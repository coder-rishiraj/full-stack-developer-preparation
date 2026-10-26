---
summary: A global variable is a name that every script in a realm can see, and `globalThis` is the one portable way to reach the object that holds many of them. You will learn every way a global gets created, why the global scope is split into two stores, how browsers, workers and Node.js differ, and why modern code keeps its own names out of the global scope.
difficulty: beginner
minutes: 50
objectives:
  - Identify every way a global variable is created, including the accidental ones, and predict whether each becomes a property of the global object
  - Explain the two halves of the global scope and use them to predict redeclaration errors, `delete` results and shadowing between scripts
  - Use `globalThis` to detect features, add polyfills and reach shadowed built-ins in browsers, workers and Node.js
  - Compare top-level behaviour in classic scripts, ES modules and Node.js CommonJS files, including the value of top-level `this`
  - Debug browser-specific global surprises such as `window.name`, element-id properties and cross-realm `instanceof` failures
---

## Introduction

Every JavaScript program runs inside an environment that already contains names before your first line executes: `Math`, `JSON`, `parseInt`, `undefined`, `setTimeout`, and in a browser `document` and `fetch`. Those names live in the **global scope**, the outermost scope that every piece of code can reach. A **global variable** is any binding in that scope. Your own code can add to it, and for most of JavaScript's history the easiest way to share a value between two scripts on a page was to do exactly that.

The trouble is that the global scope is shared by *everything* in the same page or process: your scripts, third-party widgets, analytics snippets, browser extensions' injected scripts and the environment's own built-ins. If two pieces of code both use a global called `count`, they are using the same variable, and each will silently change the other's data. Bugs of this kind do not throw errors; they produce wrong numbers in places far from the cause.

Alongside the global scope there is the **global object**: an ordinary-looking object whose properties include the built-ins and some of the global variables. It has had different names in different environments — `window` in browser pages, `self` in web workers, `global` in Node.js — which made it awkward for code that runs everywhere. ES2020 added **`globalThis`**, a single name that refers to the global object in every environment.

This lesson explains what makes a variable global, the two separate stores inside the global scope, how the global object differs between runtimes, why ES modules and Node.js files do not create globals at the top level, and how to use `globalThis` deliberately in the few situations where touching the global object is the right call. It is the home of these details for the course; [[b1-scope]] and [[b1-name-resolution]] refer here.

## Before you start

- **`var`, `let` and `const`** — what each declaration does and how they differ in scope. See [[b1-var-let-const]], and [[b1-global-scope-vars]] for the short version of global scope.
- **Scope** — the idea that a name is visible only in a region of code, and that the global scope is the outermost one. See [[b1-scope]].
- **Strict mode** — what `'use strict'` changes, because the most dangerous global behaviour exists only without it. See [[b1-strict-mode]].
- **How scripts load** — the difference between a classic `<script>` and `<script type="module">`. See [[b1-script-loading]] and [[b1-script-module]].

## The intuition

Think of an open-plan office with one shared whiteboard on the wall. Anyone can write on it, anyone can read it, and anyone can erase what someone else wrote. It is a convenient place for information everybody needs — the Wi-Fi password, today's date — and a terrible place for your personal to-do list, because a colleague with a to-do list of their own will eventually write over yours.

The global scope is that whiteboard. Built-ins such as `Math` and `JSON` are the information everybody needs; they belong there. Your application's private state does not.

The analogy needs one correction. The real whiteboard has two panels. One panel is the **global object** — it can be reached as an object (`globalThis.Math`) and enumerated. The other panel is a hidden list that holds top-level `let`, `const` and `class` declarations; those are global names too, but you cannot reach them through `globalThis`. A bare name is looked up on the hidden panel first and on the global object second. Most of the strange behaviour in this lesson comes from that split.

## What makes a variable global

There are five ways to create a global binding. They differ in which store the binding lands in, and that difference decides how the binding behaves later.

| How it is created | Example (top level of a classic script) | Lands in | Property of `globalThis`? | Can be deleted? |
|---|---|---|---|---|
| `var` declaration | `var theme = 'dark'` | Global object | Yes | No |
| Function declaration | `function render() {}` | Global object | Yes | No |
| `let`, `const`, `class` | `let user = null` | Global declarative record | No | No |
| Explicit property | `globalThis.config = {}` | Global object | Yes | Yes |
| Implicit (sloppy-mode assignment to an undeclared name) | `total = 15` | Global object | Yes | Yes |

The first three apply only at the **top level of a classic script** — a `<script>` tag without `type="module"`, or code evaluated in the browser console. The same declarations inside a function are local to that function, and at the top level of an ES module or a Node.js file they are local to that file, as later sections explain. The last two work from anywhere, including deep inside a function, which is what makes them dangerous.

Here is the table in action. The code runs as a classic script; in a browser, `globalThis` is `window`.

```javascript title="classic-script.js"
var fromVar = 1;
let fromLet = 2;
implicitGlobal = 3; // no declaration at all (sloppy mode)

console.log(Object.getOwnPropertyDescriptor(globalThis, 'fromVar'));
console.log(globalThis.fromLet, fromLet);
console.log(delete globalThis.fromVar, delete globalThis.implicitGlobal);
console.log(typeof fromVar, typeof implicitGlobal);
```

```output
{ value: 1, writable: true, enumerable: true, configurable: false }
undefined 2
false true
number undefined
```

Read the output line by line. The `var` became a real property of the global object, and its descriptor says `configurable: false`, which is the language's way of saying "this property cannot be deleted". The `let` is reachable by its bare name but is not a property, so `globalThis.fromLet` is `undefined`. The `delete` of the `var` property fails (it returns `false` and the variable survives), while the implicit global is an ordinary configurable property and disappears. That difference is the only reliable way to tell a declared `var` global from an accidental one after the fact.

> [!NOTE] Where these outputs come from
> The outputs in this lesson were produced with Node.js 22 running code in a classic-script context (`vm.runInThisContext`), which follows the same specification rules as a browser classic script. Browser consoles format objects differently but report the same values.

## The global object and `globalThis` {#global-object}

The **global object** is created by the host environment before any of your code runs. It carries three kinds of property:

1. **Language built-ins** defined by the ECMAScript specification: `Object`, `Array`, `Map`, `Promise`, `JSON`, `Math`, `parseInt`, `NaN`, `Infinity`, `undefined`, and `globalThis` itself.
2. **Host APIs** added by the runtime: in browsers `document`, `fetch`, `localStorage`, `setTimeout`; in Node.js `process`, `Buffer`, `setImmediate`, and (since Node.js 18) `fetch`.
3. **Your globals**: top-level `var` and function declarations from classic scripts, implicit globals, and anything assigned with `globalThis.name = …`.

This is why `setTimeout(…)` and `window.setTimeout(…)` are the same call in a browser: the bare name is resolved by looking it up as a property of the global object. See [[b1-runtime-web-apis]] for the line between language features and host APIs.

### Different names in different environments

The object itself exists everywhere, but historically each environment exposed it under a different name:

| Environment | Names for the global object | Missing names |
|---|---|---|
| Browser page (main thread) | `window`, `self`, `frames`, `globalThis` | `global` |
| Web worker | `self`, `globalThis` | `window`, `document` |
| Node.js | `global`, `globalThis` | `window`, `self` |
| Deno, Bun | `globalThis` (plus compatibility aliases) | varies |

That table caused real pain for libraries meant to run everywhere. Before ES2020, a portable library needed code like this to find the global object:

```javascript title="get-global-legacy.js"
// Before ES2020: find the global object in any environment
var getGlobal = function () {
  if (typeof self !== 'undefined') return self;     // browsers, workers
  if (typeof window !== 'undefined') return window; // older browsers
  if (typeof global !== 'undefined') return global; // Node.js
  throw new Error('unable to locate global object');
};
console.log(getGlobal() === globalThis);
```

```output
true
```

Notice that it uses `typeof self` rather than `self`. Reading an undeclared name throws `ReferenceError`, but `typeof` on an undeclared name returns `'undefined'` instead — a special case covered in [[b1-name-resolution]]. Another old trick, `Function('return this')()`, relied on sloppy-mode functions receiving the global object as `this`; it fails on sites whose Content Security Policy forbids building functions from strings.

**`globalThis`** was standardised in ES2020 (shipping in Chrome 71, Firefox 65, Safari 12.1 and Node.js 12) to end this. It is a property of the global object that points back to the global object, so the bare name `globalThis` resolves in every environment. Prefer it in any code that is not certain to run only in a browser page. Use `window` when you specifically mean the browser window — for example `window.innerWidth` — because then failing loudly in a worker or on a server is the correct behaviour.

> [!TIP] `globalThis` is itself an ordinary property
> `globalThis.globalThis === globalThis` is `true`. The property is writable and configurable, so code *could* overwrite it. Nothing in the language prevents that; it is one more reason libraries avoid relying on any global they do not control.

In browsers there is one more layer. `window` and `globalThis` actually refer to a **WindowProxy**, a stand-in object that forwards to the current `Window`. When a frame navigates to a new page, the proxy stays the same but starts forwarding to a fresh `Window` with a fresh set of globals. You rarely need this detail, but it explains why a reference to another frame's `window` keeps working across that frame's navigations. The browser-specific side of the global object is covered further in [[b3-window-global-scope]] and [[b3-globalthis]].

## The two halves of the global scope {#two-stores}

When ES2015 introduced `let`, `const` and `class`, the language had a compatibility problem. Top-level `var` and function declarations had always become properties of the global object, and real websites depended on that. But putting the new declarations there too would carry over every old problem — any script could read, overwrite or delete them through `window`. So the specification split the global scope into two records:

- The **object record** is the global object itself. Top-level `var` and function declarations, implicit globals, built-ins and explicit `globalThis.x` assignments live here.
- The **declarative record** is a hidden store for top-level `let`, `const` and `class` declarations. It is shared by all classic scripts in the realm, but it is not an object and cannot be reached through `globalThis`.

When code uses a bare name and resolution reaches the global scope, the declarative record is checked first, then the global object (including its prototype chain). Both stores are global — any classic script on the page can use either kind of name — but they behave differently in three ways that show up in real bugs.

### Redeclaration across scripts

All classic scripts on a page share one global scope, so a top-level `let` in one script and a declaration of the same name in a later script collide. The second script fails to run *at all*: the check happens before any of its code executes.

```javascript title="first-script.js"
let session = 'abc';
var theme = 'dark';
```

```javascript title="second-script.js"
let session = 'xyz'; // or `var session`, or `const session`
```

```output
SyntaxError: Identifier 'session' has already been declared
```

The same error appears if the first script used `var theme` and the second declares `let theme`. Two scripts that both use `var` for the same name, by contrast, do *not* error — the second `var` silently reuses the existing property. That is the collision from the introduction: `var` collisions are silent, and `let`/`const` collisions break the second script. Neither is good, but the loud failure is easier to find. Rules for redeclaration within one script are covered in [[b1-redeclaration]].

### Shadowing between the stores

Because the declarative record is checked first, a top-level `let` can hide a property of the global object with the same name. The bare name and the property then refer to different values:

```javascript title="shadowing.js"
// Classic script
globalThis.mode = 'object-property';
let mode = 'lexical';

console.log(mode, globalThis.mode);
```

```output
lexical object-property
```

This matters when your code and a library disagree about which store to use. A library that reads `window.config` will never see a page's `let config`, and a page's bare `config` will never see the library's `window.config` once a `let config` exists. The [[b1-shadowing]] lesson covers shadowing in general.

### Names that cannot be shadowed

A top-level `let` may shadow a configurable property of the global object, but not a **non-configurable** one. `undefined`, `NaN` and `Infinity` are non-configurable, read-only properties, and so are some browser properties such as `window` and `document`:

```javascript title="restricted.js"
// Classic script
let undefined = 5;
```

```output
SyntaxError: Identifier 'undefined' has already been declared
```

The rule exists so that no script can change what `undefined` means for every other script. Inside a function, by contrast, `let undefined = 5` is legal (it shadows the global locally) — legal, but never a good idea.

## Implicit globals and strict mode

The most common way beginners create globals is by accident. In sloppy mode, assigning to a name that is not declared anywhere on the scope chain does not raise an error; the engine creates a property on the global object instead. A single typo is enough:

```javascript title="implicit-global.js"
function startTimer() {
  'use strict';
  try {
    totl = 0; // typo for "total"
  } catch (e) {
    console.log(e.name + ': ' + e.message);
  }
}

function startTimerSloppy() {
  totl = 0; // same typo, no strict mode
}

startTimer();
startTimerSloppy();
console.log(globalThis.totl);
```

```output
ReferenceError: totl is not defined
0
```

In the strict function, the typo throws immediately and points at the line. In the sloppy function, it succeeds, creates `globalThis.totl`, and leaves the real `total` untouched — a bug you discover only when something downstream misbehaves. **ES modules and class bodies are always strict**, so modern code using `import`/`export` gets the safe behaviour automatically.

Strict mode also changes what happens when you write to a read-only global. In sloppy mode, `undefined = 5` and `NaN = 1` silently do nothing. In strict mode they throw `TypeError: Cannot assign to read only property 'undefined' of object`. Writing to a `const` global throws in both modes, because the `const` rule is part of the declaration, not of strict mode.

A related source of accidental global access is `this`. In a sloppy-mode function called without an object (`doWork()` rather than `obj.doWork()`), `this` is the global object, so `this.count = 0` inside it writes a global. In strict mode `this` is `undefined` in that call, and the same line throws. This rule is part of [[b1-this-default]].

## Top level is not always global

Whether a top-level declaration becomes global depends on *how the file is loaded*, not on how it is written. Three loading modes matter in practice:

| Top level of… | `var x` at top level | Bare assignment `y = 1` | Top-level `this` |
|---|---|---|---|
| Classic browser script | Global, on `window` | Creates a global (sloppy) or throws (strict) | `globalThis` (`window`) |
| ES module (browser or Node.js) | Local to the module | Throws `ReferenceError` (modules are strict) | `undefined` |
| Node.js CommonJS file | Local to the file | Creates a global (unless `'use strict'`) | `module.exports` |

The module row is the most important. An ES module has its own **module scope** sitting between its code and the global scope. Every top-level declaration — `var` included — lands in the module scope, so it is visible throughout that file and nowhere else unless exported. Modules can still *read* globals (`Math`, `fetch`, `document`), because resolution continues outward past the module scope. They just do not *create* them by accident. The full treatment is in [[b1-module-scope]].

```javascript title="module.mjs"
var x = 1;
console.log(this, globalThis.x);

try {
  y = 2;
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
undefined undefined
ReferenceError: y is not defined
```

Node.js CommonJS files are local for a different reason: before running a `.js` file, Node.js wraps its source in a function, roughly `function (exports, require, module, __filename, __dirname) { … }`. Top-level `var` therefore behaves like any function-local variable. Because the wrapper is a sloppy function, an undeclared assignment inside a CommonJS file still creates a real global. The Node.js REPL and `node -e` are the exception: they evaluate code like a classic script, so top-level `var` does create a property of `global` there.

## Browser-specific global surprises

Browsers put far more on the global object than other runtimes, and some of those properties behave in ways no ordinary variable would. Each of the following only affects classic scripts, because module code declares its names in module scope, which is checked before the global object.

**`window.name` converts to a string.** `name` is a built-in property of every window, used as the target name for links and `window.open`. It is an accessor whose setter converts any value to a string. A classic script that writes `var name = 42` does not create a new variable — `var` reuses the existing property — so the assignment goes through that setter:

```javascript title="window-name.js"
// Browser, classic script
var name = 42;
console.log(typeof name, name === 42);
```

```output
string false
```

`let name = 42` would behave as expected, because it creates a separate binding in the declarative record that shadows the property. The same trap exists, more mildly, for `status`, `length` (the number of frames), `top`, `parent`, `origin` and `event`. Naming advice to avoid these is in [[b1-variable-naming]].

**Element ids become globals.** HTML's "named access on the Window object" makes an element with `id="app"` available as `window.app`, and therefore as a bare `app` in classic scripts, unless some real declaration or property already uses that name. Code that accidentally relies on this works until someone renames the element or adds a variable called `app`. Always fetch elements explicitly with `document.getElementById('app')` or `document.querySelector('#app')`.

**Inherited names resolve too.** The global object has a prototype chain ending in `Object.prototype`, so bare names such as `toString` and `hasOwnProperty` resolve to functions everywhere. `typeof toString` is `'function'` even though you never declared it.

## Realms: one global object per world {#realms}

A **realm** is a complete, independent JavaScript world: its own global object, its own set of built-ins (`Array`, `Object`, `Error`…) and its own global scope. Each browser tab is a realm; so is every `<iframe>`, every web worker and every Node.js `vm` context. Code in an iframe has a different `globalThis` from the parent page, and globals declared in one realm are invisible in the other.

The consequence that surprises people is that built-ins are per-realm. An array created inside an iframe was built by that iframe's `Array` constructor, so `instanceof Array` in the parent returns `false`. Node.js `vm` contexts show the same thing without needing a browser:

```javascript title="realms.js"
const vm = require('vm');
// A second realm, like an iframe: its own global object and built-ins
const otherRealm = vm.createContext({});
const foreignArray = vm.runInContext('[1, 2, 3]', otherRealm);
const foreignArrayCtor = vm.runInContext('Array', otherRealm);

console.log(foreignArrayCtor === Array);
console.log(foreignArray instanceof Array);
console.log(Array.isArray(foreignArray));
```

```output
false
false
true
```

`instanceof` walks the prototype chain looking for *this realm's* `Array.prototype`, which a foreign array does not have. `Array.isArray` checks an internal property of the object instead, so it works across realms. This is why library code that may receive values from frames, workers or test environments prefers `Array.isArray` over `instanceof Array`. See [[b1-instanceof]] for how `instanceof` works, and [[b3-iframes]] for the frames themselves. Workers do not share objects at all; they exchange copies through `postMessage` ([[b3-worker-postmessage]]).

## How it works internally

When a classic script is about to run, the engine performs a step the specification calls **GlobalDeclarationInstantiation**. It happens after parsing and before the first statement executes:

1. Collect every top-level `let`, `const` and `class` name, and every top-level `var` and function name.
2. Check for conflicts against the *existing* global scope: a lexical name that already exists in either store, a `var` or function name that already exists in the declarative record, or a lexical name that matches a non-configurable global object property. Any conflict throws a `SyntaxError` and the script does not run.
3. Create the bindings: `var` names become non-configurable properties of the global object (initialised to `undefined` if new), function declarations become properties holding the function, and lexical names become uninitialised entries in the declarative record — they stay in the [[b1-tdz]] until their declaration line runs.

Step 2 is why the redeclaration error appears even though the conflicting line is far down the second script: nothing in that script runs until the whole declaration set is accepted. Step 3 is the global version of [[b1-hoisting]].

Resolution of a bare name that reaches the global level then checks the declarative record, then performs a property lookup on the global object. Engines speed this up with caches, but a global object property can be added, changed or removed by any script at any time, so those caches must be guarded and invalidated. The cost of globals that matters to you is not speed, though — it is that any code anywhere might be the one that changed the value.

Globals also affect memory. The global object and the declarative record stay alive as long as the realm does, which for a page is until the user navigates away. Anything reachable from a global — a cache object, an array of DOM nodes, an event log — can never be garbage-collected while that global refers to it. A forgotten `window.debugData = hugeArray` is one of the classic [[b1-memory-leaks]].

## Using `globalThis` deliberately

Modern code rarely needs to create globals, but there are a handful of legitimate reasons to *touch* the global object. In each, `globalThis` is the portable spelling.

### Detecting the environment and its features

Universal code — code that runs in browsers, workers and on a server — checks for the capability it needs rather than for a particular environment name. Property lookups on `globalThis` never throw, even when the property is missing:

```javascript title="feature-detect.js"
const env = {
  hasDocument: typeof globalThis.document !== 'undefined',
  hasProcess: typeof globalThis.process !== 'undefined',
  hasFetch: typeof globalThis.fetch === 'function',
};
console.log(env);
```

```output
{ hasDocument: false, hasProcess: true, hasFetch: true }
```

Run under Node.js 22, the output shows no `document`, a `process` object, and the built-in `fetch`. In a browser page the first two would flip. Checking `typeof globalThis.fetch === 'function'` is more honest than "am I in a browser?", because what the code actually needs is `fetch`.

### Adding a polyfill

A **polyfill** supplies a standard API in environments that lack it. Polyfills must be global, because the code that uses them expects the standard name. The pattern is to check first and assign only when the feature is missing, so a native implementation is never replaced:

```javascript title="polyfill.js"
// queueMicrotask fallback for very old environments
if (typeof globalThis.queueMicrotask !== 'function') {
  globalThis.queueMicrotask = (callback) => {
    Promise.resolve().then(callback);
  };
}

console.log('sync 1');
queueMicrotask(() => console.log('microtask'));
console.log('sync 2');
```

```output
sync 1
sync 2
microtask
```

The fallback is not perfect — an exception thrown by `callback` becomes a rejected promise instead of being reported like the native version — which is typical: polyfills approximate, so prefer maintained ones (such as `core-js`) over hand-written ones in production. The microtask timing itself is explained in [[b1-microtasks]].

### Reaching a built-in your code has shadowed

Sometimes a local name hides a global one for good reasons. A React project with a map widget will often `import Map from './components/Map'`, which hides the built-in `Map` collection for that whole file. `globalThis.Map` still reaches the built-in:

```javascript title="markers.mjs"
// Pretend this came from: import Map from './components/Map.js'
const Map = function MapComponent() { return '<div class="map"></div>'; };

const markersById = new globalThis.Map();
markersById.set('m1', { lat: 51.5, lng: -0.12 });
console.log(markersById.get('m1'));
```

```output
{ lat: 51.5, lng: -0.12 }
```

Renaming the import (`import MapView from …`) is usually cleaner, but `globalThis.X` is a useful escape hatch when the name is not yours to change.

### Deliberate, namespaced globals

A few integration points really do need a global: an analytics queue that scripts push to before the library loads (`window.dataLayer`), state embedded by a server-rendered page for the client to pick up (`window.__INITIAL_STATE__`), or a hook that developer tools look for. Treat these as a public interface: use one distinctive name, put everything under it, document it, and in TypeScript declare it so the compiler checks every use:

```typescript title="globals.d.ts"
export {};

declare global {
  interface Window {
    __INITIAL_STATE__?: { userId: string; locale: string };
  }
}
```

The `export {}` makes the file a module, which is required for `declare global` to be allowed. After this, `window.__INITIAL_STATE__?.locale` is typed and a misspelling is a compile error. See [[b2-declaration-files]].

## Worked example: two scripts, one variable

Here is the bug from the introduction, reproduced. A page loads an analytics script and a carousel script as classic scripts. Each author picked the name `count`.

```javascript title="page.js"
const vm = require('vm');
// Each runInThisContext call behaves like one classic <script> on a page.

// analytics.js
vm.runInThisContext(`
var count = 0;
function track(event) {
  count++;
  console.log('analytics: event #' + count + ' (' + event + ')');
}
`);

// carousel.js
vm.runInThisContext(`
var count = 5; // number of slides
function next() {
  console.log('carousel: ' + count + ' slides');
}
`);

// inline page code
vm.runInThisContext(`
track('page_view');
next();
track('click');
`);
```

```output
analytics: event #6 (page_view)
carousel: 6 slides
analytics: event #7 (click)
```

Trace what happened. The analytics script created a global `count` with value `0`. The carousel script's `var count` found that the global already existed, so it did not create a new one — it reused the same property and assigned `5`. When the page called `track`, analytics incremented the shared variable to `6` and reported event number six on the very first event. The carousel then believed it had six slides. No error appeared anywhere. If the carousel had used `let count`, the second script would have thrown a `SyntaxError` and not run at all, which is louder but still broken.

The fix before modules existed was to expose **one** global per library and keep everything else private inside a function, the [[b1-iife]] pattern:

```javascript title="page-fixed.js"
const vm = require('vm');

// analytics.js, rewritten to expose exactly one global
vm.runInThisContext(`
var Analytics = (function () {
  let count = 0; // private to this function
  return {
    track(event) {
      count++;
      console.log('analytics: event #' + count + ' (' + event + ')');
    },
  };
})();
`);

vm.runInThisContext(`
var count = 5;
Analytics.track('page_view');
Analytics.track('click');
console.log(typeof Analytics, count);
`);
```

```output
analytics: event #1 (page_view)
analytics: event #2 (click)
object 5
```

Now the counter is a local variable captured by a [[b1-closures|closure]], and nothing outside can reach it. The page's own `count` is unaffected. The only global the library adds is `Analytics`, and the chance of another script choosing that exact name is much smaller.

The modern fix goes further. With ES modules, each file's top-level names are private by default, and sharing happens through `export` and `import`. A bundler or the browser's module loader connects the files without any global at all:

```javascript title="analytics.mjs"
let count = 0;

export function track(event) {
  count++;
  console.log(`analytics: event #${count} (${event})`);
}
```

```javascript title="main.mjs"
import { track } from './analytics.mjs';

const count = 5; // a different variable from the one in analytics.mjs
track('page_view');
track('click');
console.log(count);
```

```output
analytics: event #1 (page_view)
analytics: event #2 (click)
5
```

## In real systems

**Application code avoids globals entirely.** Bundled applications (Vite, webpack, Next.js) compile every file as a module, so top-level declarations never touch `window`. Shared state lives in imported modules, React context or a state library. Front-end teams treat a new `window.something` in code review the same way backend teams treat a new mutable static field: as something that needs a reason. React's own guidance on state placement is covered in [[b4-global-state]].

**Linters and compilers police the boundary.** ESLint's `no-undef` rule flags any name that is neither declared nor listed as a known global, which catches typos that would otherwise create implicit globals. `no-implicit-globals` flags top-level `var` and function declarations in classic scripts. TypeScript reports "Cannot find name" for undeclared identifiers, and its `lib` and `types` settings decide which environment globals (DOM, Node.js) it believes exist. See [[b2-eslint-typescript]].

**Server-side rendering exposes hidden global assumptions.** Code that reads `window` or `localStorage` at module load time crashes with `ReferenceError: window is not defined` when the same module is imported on the server. The fix is to read browser globals only inside code that runs in the browser (an effect, an event handler) or behind a `typeof window !== 'undefined'` check.

**Tests replace globals on purpose.** Test runners stub globals such as `fetch`, `Date` or `localStorage` so tests are deterministic — Vitest provides `vi.stubGlobal('fetch', mockFetch)` and `vi.unstubAllGlobals()` to undo it. Because the global object is shared, a stub that is not restored can leak into the next test, a common source of flaky test suites.

**Third-party scripts still share the global scope.** Analytics tags, chat widgets and A/B-testing snippets are usually classic scripts that create globals (`dataLayer`, `gtag`, `_hsq`). A page that also defines one of those names breaks the integration silently. Library authors defend against this by checking before creating: `window.dataLayer = window.dataLayer || []`.

## Trade-offs and alternatives

| Way to share a value | Visibility | Collision risk | When it fits |
|---|---|---|---|
| Global variable / `globalThis` property | Every script in the realm | High | Polyfills, integration hooks for third-party scripts, server-to-client bootstrapping data |
| One namespaced global (`window.MyLib`) | Every script, but one name | Low | Libraries distributed as classic `<script>` tags |
| ES module exports | Only files that import it | None by accident | Almost all application and library code |
| Dependency injection / passing arguments | Only the code you pass it to | None | Code that must be testable with different implementations |

Globals are convenient precisely because they skip the wiring: any code can reach them without imports or parameters. That convenience is also the cost. Reading a function that uses a global no longer tells you where the value comes from or who else changes it; testing it requires mutating shared state; and running two copies of the code on one page (two widgets, two versions of a library) becomes impossible because they would share the same state. Modules keep the convenience of top-level names while making every dependency visible in an `import` line.

## Common mistakes

> [!MISTAKE] Forgetting a declaration keyword
> `function save() { result = compute(); }` in sloppy mode creates `globalThis.result`. Every later call overwrites it, and two concurrent operations clobber each other. Fix: always declare with `const` or `let`, and use modules or `'use strict'` so the mistake throws `ReferenceError` instead of succeeding.

**Assuming `window.x` and a global `let x` are the same.** They are different stores. A top-level `let` or `const` is never a property of `window`, so code that reads configuration through `window.config` cannot see `const config = …`. If something really must be readable through the global object, assign it as a property explicitly.

**Using `window` in code that also runs elsewhere.** `window` does not exist in workers, Node.js or during server-side rendering, and referencing it throws `ReferenceError`. Use `globalThis` when you mean "the global object", and guard genuinely browser-only code with feature checks.

**Naming a classic-script variable after a window property.** `var name`, `var status`, `var top` or an `id` that collides with a variable produce strange values with no error. Prefer modules, and avoid these names in classic scripts.

**Using `instanceof` on values from another realm.** Arrays and errors from an iframe, a worker message or a Node.js `vm` context fail `instanceof Array` / `instanceof Error`. Use `Array.isArray`, and for errors check the shape you need (`typeof err.message === 'string'`).

**Leaking memory through debug globals.** Assigning large structures to `window` while debugging, then forgetting to remove them, keeps them alive for the lifetime of the page. Remove them, or keep debug state inside a module.

## Interview perspective

Interviewers use globals to check whether you understand JavaScript's environment model rather than only its syntax. The strongest answers name the two stores and the loading mode.

> [!INTERVIEW] "What is the difference between `var x = 1` and `let x = 1` at the top level?"
> "In a classic script both are globals, but only the `var` becomes a property of the global object, so `window.x` sees it; the `let` lives in the global declarative record and `window.x` is `undefined`. The `var` property is non-configurable, so it can't be deleted. A later script that redeclares the `let` name fails with a SyntaxError before running, while a second `var` silently reuses the first. In an ES module neither is global — both are module-scoped."

Questions to prepare:

- **What is `globalThis` and why was it added?** A standard name (ES2020) for the global object in every environment, replacing environment-specific names like `window`, `self` and `global` and the fragile detection code libraries used to need.
- **What happens when you assign to an undeclared variable?** Sloppy mode: a configurable property is created on the global object. Strict mode and modules: `ReferenceError`.
- **What is `this` at the top level?** `globalThis` in a classic script, `undefined` in an ES module, `module.exports` in a Node.js CommonJS file.
- **Why are global variables considered bad practice?** Collisions between unrelated scripts, hidden dependencies, hard-to-test shared state, values that live for the whole page and cannot be collected. Mention the legitimate exceptions: polyfills and integration hooks.
- **Follow-up: why does `[] instanceof Array` sometimes return false?** The array came from another realm with its own `Array` constructor; use `Array.isArray`.
- **Follow-up: why did `var name = 42` print a string?** In browsers `name` is an existing accessor property on `window` that converts values to strings, and top-level `var` reuses existing global object properties.

## Practice

1. **Classify.** For each line, say whether it creates a global, whether that global is a property of `globalThis`, and whether `delete` can remove it, assuming a classic script: `var a = 1`, `let b = 2`, `function c() {}`, `d = 4`, `globalThis.e = 5`, `class F {}`. Then check your answers in a browser console.
2. **Redeclaration.** Create an HTML page with two classic scripts. Make the first declare `let apiUrl` and the second `var apiUrl`. Observe which script fails and explain why it fails before its first line runs.
3. **Module comparison.** Change both scripts in exercise 2 to `type="module"` and explain why the error disappears.
4. **Universal helper.** Write `getStorage()` that returns `globalThis.localStorage` when it exists and an in-memory object with `getItem`/`setItem` otherwise. Run it in a browser and in Node.js.
5. **Leak hunt.** Run a sloppy function containing a typo'd assignment, then find the leaked global using `Object.keys(globalThis)` filtered against a list taken before the call.
6. **Realm check.** Using Node.js `vm.runInNewContext`, create an `Error` in a new context and compare `instanceof Error` with a check on `err.name`.

```quiz
Q: A classic script contains `let total = 10;` at the top level. What does `window.total` return in a browser?
- [ ] `10`
- [x] `undefined`
- [ ] It throws a ReferenceError
- [ ] `null`
> Top-level `let`, `const` and `class` declarations live in the global declarative record, which is not the global object. The name is global — other classic scripts can read `total` — but `window.total` is a property lookup on the global object and finds nothing, so it returns `undefined`. Only `var` and function declarations become properties.

Q: Which line, run in sloppy mode inside a function, creates a property that `delete globalThis.x` can remove?
- [ ] `var x = 1;`
- [ ] `let x = 1;`
- [x] `x = 1;` with no declaration of `x` anywhere
- [ ] `const x = 1;`
> Inside a function, `var`, `let` and `const` all create local variables, not globals. An assignment to a name that resolves nowhere creates an implicit global, which is an ordinary configurable property and can be deleted. A top-level `var` would also become a property, but a non-configurable one that `delete` cannot remove.

Q: What is the value of `this` at the top level of an ES module?
- [ ] `globalThis`
- [ ] `module.exports`
- [x] `undefined`
- [ ] The module namespace object
> Module code is strict and is not run as a method of any object, so top-level `this` is `undefined`. `globalThis` is the answer for classic scripts, and `module.exports` is the answer for Node.js CommonJS files, which Node.js runs inside a wrapper function called with `module.exports` as `this`.

Q: An array arrives from an iframe. Why can `arr instanceof Array` be `false` while `Array.isArray(arr)` is `true`?
- [ ] `instanceof` does not work on arrays
- [x] The iframe is a separate realm with its own `Array` constructor and prototype
- [ ] The array was converted to an object when crossing the frame boundary
- [ ] `Array.isArray` is slower but more thorough
> Each realm has its own set of built-ins. The array's prototype is the iframe's `Array.prototype`, which is not on the chain `instanceof` searches for the parent's `Array`. `Array.isArray` checks an internal marker that every real array carries regardless of realm. The array was not converted — it really is an array.
```

## Quick revision {#quick-revision}

- Global scope = outermost scope; shared by every classic script in the realm.
- Two stores: the **global object** (`var`, functions, implicit globals, built-ins, `globalThis.x = …`) and the **declarative record** (top-level `let`, `const`, `class`). Bare names check the declarative record first.
- Top-level `var` → non-configurable property (cannot delete). Implicit global → configurable property (can delete). `let`/`const` → not a property at all.
- Redeclaring a global `let`/`const`/`class` name in another script → `SyntaxError` before that script runs. Repeating `var` → silent reuse.
- `undefined`, `NaN`, `Infinity` (and browser `window`, `document`) are non-configurable and cannot be shadowed by a global `let`.
- Sloppy assignment to an undeclared name creates a global; strict mode and modules throw `ReferenceError`.
- `globalThis` (ES2020) = the global object everywhere. Old names: `window`/`self`/`frames` (pages), `self` (workers), `global` (Node.js).
- Top-level `this`: classic script → `globalThis`; ES module → `undefined`; CommonJS → `module.exports`.
- ES modules and Node.js files keep top-level declarations local; they can still read globals.
- Browser traps: `window.name` stringifies, element ids become globals, inherited names like `toString` resolve.
- Each iframe/worker/`vm` context is a realm with its own globals and built-ins; prefer `Array.isArray` to `instanceof Array`.
- Legitimate global use: feature detection, polyfills, shadowed built-ins, one documented namespaced integration point.

## Key takeaways {#key-takeaways}

- A global is a name every script in the realm shares, which makes collisions and hidden dependencies the default rather than the exception.
- The global scope has two stores; knowing which one a declaration lands in predicts `window` visibility, `delete` behaviour, shadowing and redeclaration errors.
- Accidental globals come from sloppy-mode assignments; strict mode and ES modules turn them into immediate errors.
- `globalThis` is the portable way to reach the global object; use `window` only when you specifically mean the browser window.
- ES modules are the modern answer to globals: private top-level names and explicit `import`/`export` for sharing.
- When you do need the global object — polyfills, feature checks, integration hooks — check before writing, use one distinctive name, and declare it for your tools.
