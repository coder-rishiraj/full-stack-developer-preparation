---
summary: Before JavaScript had modules, developers built them from functions — an immediately invoked function that keeps its variables private and returns a public object. You will learn how the IIFE module pattern and its revealing variant work, why they were needed, how AMD and UMD grew out of them, and how to read and safely maintain code that still uses them.
difficulty: intermediate
minutes: 35
objectives:
  - Explain the global-scope problem that the module pattern solved in pre-ES2015 browsers
  - Trace how an IIFE plus closures creates private state and a public API
  - Write the classic and revealing module patterns, and spot the stale-copy bug in a revealed primitive
  - Recognise namespacing, dependency injection through IIFE parameters, AMD and UMD wrappers in legacy code
  - Compare the pattern with ES modules and decide when (rarely) it is still the right tool
---

## Introduction

Open the source of a website from 2012 and you will find files that begin with `(function () {` and end with `})();`, or a library that starts with a strange block checking `typeof define` and `typeof module`. These are the **IIFE module pattern** and its descendants. For roughly fifteen years they were how JavaScript developers built modules, because the language did not have any.

The problem they solved was the **shared global scope**. In a browser, every classic `<script>` runs in the same global scope, and a top-level `var` or function declaration becomes a property of `window`. Two scripts that both declared `var config` or `function init()` silently overwrote each other, and every helper variable a library used was visible — and changeable — by every other script on the page.

The fix was to put the code inside a function, because a function has its own scope, and to call that function immediately. Whatever the function returned became the module's public interface; everything else stayed hidden in the function's scope, kept alive by **closures**. ES modules ([[b1-modules]]) made this unnecessary in 2015, which is why this lesson is labelled historical. You still need it to read legacy code, to understand the output of some bundlers, and because the underlying mechanism — closures as private state — is used all the time in modern code.

## Before you start

- **Closures** — an inner function keeps access to variables of the function that created it, even after that function returns. This is the whole engine of the pattern. See [[b1-closures]].
- **IIFE** — an immediately invoked function expression, `(function () { … })()`. See [[b1-iife]].
- **Scope and `var`** — why a top-level `var` in a classic script becomes a global. See [[b1-function-scope-vars]] and [[b1-global-variables]].
- **`this` in plain function calls** — in sloppy mode it is the global object. See [[b1-this-default]].

## The intuition

Think of a vending machine. Inside are the coins, the stock count and the motor — you cannot reach any of them. On the front are a few buttons. Pressing a button runs machinery inside that *can* reach the coins and stock. The module pattern builds that machine: the IIFE's local variables are the insides, the returned object is the front panel, and each method on the panel is a closure that can reach inside.

The machine is built once, at the moment the IIFE runs, and you are handed the panel. There is no second machine unless someone runs the code again.

## The pattern step by step

An IIFE is a function expression that is called as soon as it is defined:

```javascript
(function () {
  var secret = 42; // local to this function, not a global
})();
```

The outer parentheses turn the `function` keyword into an *expression* (a statement that starts with `function` would be a declaration, which cannot be called in place). The trailing `()` calls it. When it finishes, `secret` is unreachable — nothing outside can name it.

That alone gives isolation. To build a **module**, the IIFE returns an object whose methods close over the private variables, and the result is stored in a single variable:

```javascript title="counter.js"
const counter = (function () {
  let count = 0; // private: only the functions below can reach it

  function increment() {
    count += 1;
    return count;
  }
  function reset() {
    count = 0;
  }

  return { increment, reset, get value() { return count; } };
})();

counter.increment();
counter.increment();
console.log(counter.value, counter.count);
counter.count = 100;
console.log(counter.increment());
```

```output
2 undefined
3
```

Read it in order. The IIFE runs once, creating a fresh `count` and three functions that refer to it. It returns an object with two methods and a `value` getter. After the IIFE returns, its scope would normally be discarded, but the returned functions still refer to `count`, so the engine keeps that scope alive: this is the closure. `counter.count` is `undefined` because `count` is a variable, not a property. Setting `counter.count = 100` merely adds an unrelated property to the public object; the next `increment()` returns `3`, proving the private variable was untouched. That is **encapsulation** without classes or `#private` fields.

## The revealing module pattern

A popular variant, the **revealing module pattern**, writes every function as a private local and then "reveals" chosen ones at the end by listing them in the returned object. The appeal is readability: the bottom of the file is a summary of the public API, and functions can call each other by plain name without `this`.

```javascript title="reveal.js"
var CartModule = (function () {
  var items = [];
  var count = 0;

  function add(item) {
    items.push(item);
    count = items.length;
  }
  function total() {
    return items.reduce(function (sum, i) { return sum + i.price; }, 0);
  }

  return { add: add, total: total, count: count };
})();

CartModule.add({ name: 'pen', price: 3 });
CartModule.add({ name: 'book', price: 12 });
console.log(CartModule.total(), CartModule.count, CartModule.items);
```

```output
15 0 undefined
```

`total()` correctly reports `15`, and `items` is private as intended. But `CartModule.count` is `0` after two additions. The returned object literal copied the *value* of `count` at the moment the IIFE returned. Later assignments change the private variable, not the property. This is the classic bug of revealing a primitive, and it is the same snapshot behaviour you see when destructuring a CommonJS export ([[b1-esm-vs-cjs]]). The fix is to reveal a function or a getter (`get count() { return count; }`), as `counter.js` above did. Objects and arrays do not have this problem when revealed, because the property and the variable refer to the same object — but then callers can mutate your private array, which defeats the point.

A second, subtler drawback: public methods in the revealing pattern call the private functions directly. If someone replaces `CartModule.total` with a patched version, internal callers still use the original. That makes the module hard to extend or monkey-patch, which some teams saw as a feature and others as a limitation.

```quiz
Q: A module ends with `return { isOpen: isOpen, open: open };`, where `isOpen` is a private boolean that `open()` sets to `true`. After calling `Module.open()`, what is `Module.isOpen`?
- [ ] `true`, because the property is linked to the private variable
- [x] Whatever `isOpen` was when the IIFE returned, because the object literal copied the value
- [ ] `undefined`, because private variables cannot be returned
- [ ] It throws, because the returned object is frozen
> An object literal evaluates `isOpen` once and stores that boolean in a new property. `open()` later reassigns the private variable, which is a different storage location, so the property keeps the old value. Exposing `get isOpen() { return isOpen; }` or a function fixes it.
```

## Variations you will meet in legacy code

### Namespacing

With dozens of modules, even one global per module becomes many globals. Teams grouped them under a single application object:

```javascript title="namespace.js"
var MyApp = globalThis.MyApp || {}; // reuse it if another file created it first
MyApp.utils = (function () {
  function slug(s) { return s.toLowerCase().replace(/\s+/g, '-'); }
  return { slug: slug };
})();
console.log(MyApp.utils.slug('Hello World'));
```

```output
hello-world
```

The `globalThis.MyApp || {}` idiom (in old code, `window.MyApp || {}`) lets files load in any order without wiping each other's additions. Dependencies between files, however, still relied on `<script>` order: if `MyApp.cart` used `MyApp.utils` at load time, `utils.js` had to come first, and nothing enforced it.

### Importing dependencies through parameters

An IIFE can take arguments, which gave modules an explicit list of dependencies and short local names:

```javascript title="inject.js"
const fakeJQuery = { version: '3.7.1' };
(function ($, undefined) {
  console.log('using jQuery', $.version, typeof undefined);
})(fakeJQuery);
```

```output
using jQuery 3.7.1 undefined
```

jQuery plugins were written exactly like this, passing `jQuery` in as `$` so the plugin worked even if another library had taken the global `$`. The extra `undefined` parameter, never passed an argument, guaranteed a real `undefined` inside — a defence from the ES3 era, when the global `undefined` could be reassigned. Since ES5 it is read-only, so the trick is obsolete but still common in old files.

### The leading semicolon

Many legacy files start with `;(function () {`. That is not a typo. When files are concatenated, a previous file that ends without a semicolon can merge with the opening parenthesis:

```javascript title="asi.js"
const a = 1
const b = a
(function () { console.log('iife ran'); })()
```

```output
TypeError: a is not a function
```

Automatic semicolon insertion does not add a semicolon before `(`, so the engine reads `a(function () { … })()` and tries to call `1`. The leading `;` protects against the file before it. See [[b1-asi]].

### AMD and UMD

As applications grew, script order became unmanageable, and loaders appeared. **AMD (Asynchronous Module Definition)**, used by RequireJS, wrapped each module in `define(['dep1', 'dep2'], function (dep1, dep2) { return api; })` and loaded the dependencies asynchronously in the browser before calling the factory. Meanwhile Node used CommonJS. Library authors who wanted to support both, plus plain `<script>` users, wrote **UMD (Universal Module Definition)**:

```javascript title="umd.js"
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);                 // AMD loader such as RequireJS
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();          // CommonJS (Node, older bundlers)
  } else {
    root.MiniLib = factory();            // plain script: attach a global
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return { version: '1.0.0' };
});
```

Loaded with `require('./umd.js')` in Node, the CommonJS branch runs and `.version` is `'1.0.0'`; in a browser with no loader the same file creates `window.MiniLib`. UMD is still the format of many `.min.js` files served from CDNs. Its environment sniffing is fragile — a page that happens to define a global `define` sends the library down the wrong branch — which is one reason ESM's single standard format was welcome.

## How it works internally

When the IIFE runs, the engine creates a **function execution context** with its own environment record holding `count`, `increment`, `reset` and so on ([[b1-function-execution-context]]). Each inner function object stores a reference to that environment. When the IIFE returns, its execution context is popped off the call stack, but the environment record survives because the returned functions still reference it; the garbage collector keeps anything reachable ([[b1-closure-memory]]). Each call to a public method creates a new execution context whose outer environment is that saved record, so `count` resolves there.

Compare that with an ES module. A module also gets one environment for its top-level variables, created once and shared by everyone who imports it. The difference is who manages it: the module system creates the scope, records the dependencies, guarantees one instance per URL, and connects exports by name. With the IIFE pattern, *you* create the scope, dependencies are implicit (globals or script order), and nothing prevents the file from being run twice, which would create a second independent instance with its own state.

## Sloppy-mode `this` inside an IIFE

Some legacy modules used `this` inside the IIFE, either to find the global object or by mistake. In sloppy (non-strict) mode, a plain function call sets `this` to the global object, so writing to `this` creates globals:

```javascript title="sloppy.js"
const Api = (function () {
  this.leaked = 'oops';
  return this;
}).call(undefined);
console.log(Api === globalThis, globalThis.leaked);
```

```output
true oops
```

`.call(undefined)` is the same as a plain call; in sloppy mode `undefined` is replaced with the global object. The module meant to keep things private just created `globalThis.leaked`, and anyone who used the returned "API" is actually holding `window`. In strict mode (`'use strict'` at the top of the IIFE, or any ES module) `this` would be `undefined` and the assignment would throw immediately. Legacy IIFEs that need the global object use a parameter — `(function (root) { … })(this)` at the top level of a script, or `globalThis` today.

## The pattern versus ES modules

| | IIFE module pattern | ES modules |
|---|---|---|
| Private scope | Function scope, created by you | Module scope, created by the runtime |
| Public API | Returned object (one global or namespace property) | Named and default exports |
| Dependencies | Globals and `<script>` order, or IIFE parameters | Explicit `import`, resolved and ordered by the loader |
| Missing dependency | `undefined` / `ReferenceError` at runtime | Link-time `SyntaxError` |
| Instances | One per execution of the file | One per resolved URL |
| Strict mode | Opt in | Always |
| Tooling | Opaque to static analysis | Tree shaking, code splitting, editor auto-imports |
| Works without a build step | Yes, in any browser ever made | Yes, in current browsers |

## In real systems

You will meet the pattern in four places. **Legacy applications** and jQuery-era plugins are full of it, and the safe way to change them is to keep the public object's shape stable while you refactor the inside. **Bundler output** often wraps code in IIFEs: when an ES module app is built in `iife` format (for embedding with a single `<script>` tag), the bundler produces exactly this pattern, with the module graph flattened inside. **Third-party snippets** — analytics tags, chat widgets, ad loaders pasted into pages — are IIFEs so they do not collide with the host page's globals. And **UMD builds** on CDNs remain the easiest way to drop a library into a page without any tooling.

The closure-as-private-state idea is everywhere in modern code too: factory functions that return objects ([[b1-classes-vs-factories]]), React hooks that keep state per component, and memoisation helpers all use the same mechanism, just without the immediate invocation.

## Trade-offs and alternatives

The module pattern needs no tooling, works in every JavaScript environment, and gives genuinely private state that no outside code can reach. Those are the reasons it lasted so long.

Its costs are the ones ES modules were designed to remove: dependencies are invisible to tools, load order is manual, a global (or namespace) is still required, private functions cannot be unit-tested directly, the revealing variant snapshots primitives, and bundlers cannot remove unused parts. For new code, use ES modules; for private state inside a module, use plain module-level variables, closures or `#private` class fields ([[b1-private-state]]). Reach for a hand-written IIFE today only for a self-contained snippet that must run as a classic script on a page you do not control.

## Common mistakes

- **Revealing a primitive and expecting it to update.** Return a getter or a function instead of `count: count`.
- **Forgetting the call parentheses.** `var api = (function () { … });` stores the function, not its result; `api.method` is `undefined`.
- **Using `this` to mean "the module".** In sloppy mode it is the global object; in strict mode it is `undefined`. Refer to the returned object by name, or keep functions independent of `this`.
- **Dropping the leading semicolon when concatenating files.** The previous file's last expression gets called with your IIFE as its argument.
- **Recreating the pattern inside ES modules.** A module already has private scope; wrapping its body in an IIFE adds nothing but indentation.
- **Running the same file twice.** Two `<script>` tags for one file create two instances with separate state, and the second overwrites the global.

## Interview perspective

Interviewers ask about the module pattern to test closures and to see whether you understand why ES modules exist.

> [!INTERVIEW] What a strong answer sounds like
> "Before ES2015 every script shared the global scope, so people wrapped each file in an immediately invoked function. Its local variables are private, and the returned object's methods close over them, so they are the only way in. It gave encapsulation and one global per module, but dependencies were implicit and load order was manual — ES modules replaced that with a real scope per file, explicit imports and a loader that orders them."

Questions to expect:

- **Write a counter with private state without classes.** An IIFE or factory returning `increment` and a getter; explain the closure that keeps `count` alive.
- **What is the revealing module pattern, and what is its pitfall?** Private functions revealed by name at the end; primitives are copied once, and internal calls ignore patched public methods.
- **What is UMD?** A wrapper that detects AMD, CommonJS or a plain global and registers the module accordingly.
- **Why the leading semicolon?** To stop automatic semicolon insertion from merging with the previous file.
- **Follow-up: how do ES modules differ?** Runtime-managed scope, static dependencies, link-time errors, one instance per URL, always strict.

## Practice

1. **Rate limiter.** Write `const limiter = (function () { … })()` with a private request log, a public `tryRequest()` that allows five calls per second, and a `remaining` getter.
2. **Find the bug.** Convert `CartModule` above so `count` stays correct, without exposing `items`.
3. **Migrate.** Rewrite `CartModule` as an ES module with named exports. List what changed in how other files must use it.
4. **UMD by hand.** Add an AMD branch test: define a fake global `define` with `define.amd = true` and confirm which branch `umd.js` takes.
5. **Read legacy code.** Find a UMD build of any library in `node_modules` and identify its three branches and its factory.

## Quick revision {#quick-revision}

- Problem: classic scripts share one global scope; top-level `var`/functions become `window` properties and collide.
- IIFE: `(function () { … })()` — parentheses make it an expression, `()` calls it; locals are private.
- Module pattern: IIFE returns an object; its methods are closures over private variables; one instance per execution.
- Revealing pattern: define everything privately, return `{ name: fn, … }`; revealed primitives are snapshots — use getters.
- Namespacing: `var MyApp = globalThis.MyApp || {}`; dependency injection via IIFE parameters (`(function ($) {})(jQuery)`).
- Leading `;` protects against concatenation with a file that lacks a final semicolon.
- AMD: `define(deps, factory)` for async browser loading; UMD: detects AMD / CommonJS / global.
- Sloppy-mode `this` in a plain call is the global object; strict mode makes it `undefined`.
- ES modules replace the pattern: runtime scope, explicit imports, link-time errors, tree shaking.

## Key takeaways {#key-takeaways}

- The module pattern simulated modules with a function's scope, because pre-ES2015 JavaScript had none.
- Privacy comes from closures: the returned methods are the only code that can reach the IIFE's variables.
- Reveal functions or getters, never raw primitives, or callers see a stale copy.
- AMD and UMD extended the idea to loaders and to code that must run in several environments.
- Read and maintain the pattern in legacy code, but write ES modules for anything new.
