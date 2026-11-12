---
summary: JavaScript has two module systems in daily use — CommonJS, which Node.js built first, and the standard ES modules. You will learn how each one loads code, why ESM imports are live bindings while `require` hands you an object, how both handle circular dependencies, what top-level `await` does to a module graph, and why only ESM can be reliably tree-shaken.
difficulty: advanced
minutes: 65
objectives:
  - Compare CommonJS and ES modules on loading, timing, scope variables, caching and what an importer receives
  - Explain live bindings and predict what an importer sees when an exporter changes a value
  - Trace a circular dependency in both systems and restructure code that fails because of one
  - Use top-level `await` and explain how it delays importers and where it can deadlock
  - Describe how tree shaking uses the static ESM graph and what defeats it
  - Choose the right interop approach when ESM and CommonJS code must work together in Node.js
---

## Introduction

When Node.js appeared in 2009, JavaScript had no module system at all. Node adopted a convention called **CommonJS (CJS)**: every file gets a `require` function to load other files and a `module.exports` object to publish its own values. It was simple and synchronous, which suited a server reading files from a local disk, and it powered the npm ecosystem for a decade.

Six years later, ES2015 standardised a different design, **ECMAScript modules (ESM)**, with `import` and `export`. ESM had to work in browsers, where files arrive over a network, so it was designed to be analysed *before* running and loaded asynchronously. Browsers shipped it around 2017–2018, and Node.js supports it without flags since version 12.17 and 13.2.

So today a JavaScript engineer lives with both. Older packages, many build configurations and plenty of server code are CommonJS; new libraries, browsers and every modern frontend tool use ESM. The two systems look similar in simple cases — both let one file use another's functions — but they differ in ways that cause real bugs: values that do not update, `undefined` imports in circular code, packages that refuse to load, bundles that are larger than expected.

This lesson assumes you know ESM syntax from [[b1-modules]]. It first explains how CommonJS works and how Node decides which system a file uses, then teaches the four behaviours that set ESM apart: [[b1-live-bindings|live bindings]], [[b1-circular-deps|circular dependencies]], [[b1-top-level-await|top-level await]] and [[b1-tree-shaking|tree shaking]].

## Before you start

- **ES modules** — `import`, `export`, the three loading phases. See [[b1-modules]].
- **Closures** — CommonJS modules are functions, and a getter that reads a module variable is a closure. See [[b1-closures]].
- **The temporal dead zone (TDZ)** — reading a `let`/`const` before its declaration runs throws. Circular ESM imports expose it. See [[b1-tdz]].
- **Promises and `await`** — needed for top-level `await` and `import()`. See [[b1-async-await]].
- **Node.js basics** — what `node file.js` does. See [[b1-runtime-nodejs]].

Every example was run with Node.js 22.22. Version-specific behaviour is marked.

## The intuition

A CommonJS `require` is a **function call**. When it runs, Node executes the other file from top to bottom and hands you back whatever object that file put in `module.exports`. What you receive is that object, as it was at that moment; if you pulled a number out of it, you have your own copy of the number.

An ESM `import` is a **wiring instruction**. Before any code runs, the loader reads every file's imports and exports and connects each imported name directly to the variable it refers to in the exporting file. When code finally runs, reading an imported name reads that variable — so you always see its current value, but you can never assign to it.

Most differences in this lesson follow from that one contrast: *running a function and taking its result* versus *connecting names before anything runs*.

## How CommonJS works

Node does not run a CommonJS file directly. It wraps the file's source in a function and calls that function:

```javascript
(function (exports, require, module, __filename, __dirname) {
  // your file's code goes here
});
```

That wrapper explains everything CommonJS-specific. Top-level variables are private because they are local variables of a function. `require`, `module`, `exports`, `__filename` and `__dirname` look like globals but are really parameters. Top-level `this` is `module.exports`, because Node calls the wrapper with `this` set to it.

`require(specifier)` is synchronous. It resolves the specifier to an absolute file name, checks `require.cache`, and if the file is not cached it creates a `module` object, **stores it in the cache first**, runs the wrapper, and finally returns `module.exports`. The order "cache first, then run" matters for circular dependencies, as you will see.

```javascript title="main.cjs"
const counter = require('./counter.cjs');
const { count, increment } = require('./counter.cjs');
increment();
increment();
console.log(count, counter.count);
console.log(require('./counter.cjs') === counter);
console.log(this === module.exports, typeof __dirname);
```

```javascript title="counter.cjs"
let count = 0;
function increment() { count += 1; }
module.exports = { count, increment };
```

```output
0 0
true
true string
```

`increment()` ran twice, yet both `count` and `counter.count` are `0`. The object literal `{ count, increment }` copied the number `0` into a property when `counter.cjs` ran; incrementing the local variable later does not touch that property. The second line shows the cache: every `require` of the same file returns the identical object. The third confirms the wrapper's `this` and the injected `__dirname`.

One trap comes straight from the wrapper. `exports` is only a parameter that initially points at the same object as `module.exports`. Writing `exports.x = 1` mutates that shared object and works. Writing `exports = { x: 1 }` only reassigns the local parameter; `module.exports` is still the original empty object, and the importer receives `{}`. When you want to export a single value, always assign `module.exports`.

## How Node decides which system a file uses

Node.js looks at the file, not at the code that loads it:

| File | Treated as |
|---|---|
| `*.mjs` | ESM, always |
| `*.cjs` | CommonJS, always |
| `*.js` with nearest `package.json` `"type": "module"` | ESM |
| `*.js` with `"type": "commonjs"` or no `type` field | CommonJS |

Since Node 22.7 (and 20.19), a `.js` file with no `type` field that fails to parse as CommonJS but contains `import`/`export` is re-parsed as ESM, and Node prints a `MODULE_TYPELESS_PACKAGE_JSON` warning about the performance cost of reparsing. Do not rely on that detection; set `"type"` in `package.json`.

## Side-by-side comparison

| | CommonJS | ES modules |
|---|---|---|
| Syntax | `require()`, `module.exports`, `exports.x` | `import`, `export` |
| When dependencies are known | Only when `require` runs | Before any code runs (static) |
| Loading | Synchronous, one file at a time | Asynchronous; graph fetched and linked first |
| `require`/`import` position | Anywhere, including inside `if` and functions | Declarations only at top level; `import()` anywhere |
| Specifier | Any expression | String literal (declarations) |
| What the importer gets | The `module.exports` object (values copied out of it are snapshots) | Live, read-only bindings to the exporter's variables |
| Strict mode | Only with `'use strict'` | Always |
| Top-level `this` | `module.exports` | `undefined` |
| File-location helpers | `__filename`, `__dirname` | `import.meta.url`; `import.meta.filename`/`dirname` in Node 20.11+ |
| Top-level `await` | Not allowed | Allowed |
| Missing export | `undefined` at runtime | `SyntaxError` at link time |
| Cache | `require.cache`, keyed by file name, can be deleted from | Module map, keyed by URL, cannot be cleared |
| Browser support | None natively (needs a bundler) | Native |
| Tree shaking | Unreliable | Designed for it |

## Live Bindings {#b1-live-bindings}

A **live binding** is the connection an ES module import has to the exporter's variable. The imported name does not hold a copy of the value; reading it reads the exporting module's variable at that moment. If the exporting module changes the variable, every importer sees the new value the next time it reads. From the importer's side the binding is read-only.

Here is the counter from the CommonJS section, written as an ES module:

```javascript title="counter.mjs"
export let count = 0;
export function increment() { count += 1; }
```

```javascript title="live.mjs"
import { count, increment } from './counter.mjs';
import * as counter from './counter.mjs';

const snapshot = count;          // copies the current value into a new variable
const { count: copied } = await import('./counter.mjs');

increment();
increment();
console.log(count, counter.count, snapshot, copied);
```

```output
2 2 0 0
```

`count` and `counter.count` are both `2`: the imported binding and the namespace property both read `counter.mjs`'s own `count` variable. `snapshot` and `copied` are `0`. Each of them is an ordinary new variable in `live.mjs` that received the value once; destructuring a namespace or assigning an import to a local does not carry the link along. **Liveness belongs to the import binding itself**, not to the value.

### How it works

During linking, the engine does not create a variable for `count` in `live.mjs` at all. It records an *indirect* binding: "the name `count` here resolves to the binding `count` in the module record of `counter.mjs`." Every read of `count` in `live.mjs` follows that link into the exporter's module environment. That is why there is nothing to update and no event to fire — there is only one variable, viewed from two places. The namespace object works the same way: its properties are effectively getters onto the exporter's bindings.

And it is why imports are read-only. If `live.mjs` could write `count = 10`, it would be changing another module's private variable behind its back. The language forbids it; the assignment throws `TypeError: Assignment to constant variable.` even though the exporter used `let`.

### Why ESM was designed this way

Live bindings are what make circular imports workable: a module can be linked to a variable that has not been initialised yet, and once the exporter runs, the importer sees the real value without any extra API (see [[b1-circular-deps]]). They also mean an import is a name for a variable, not a moment in time, which keeps the static graph honest.

### CommonJS has no live bindings, only shared objects

A CommonJS importer gets the `module.exports` object. Because that is a *reference* to one shared object, changes to its properties are visible to every holder of the object:

```javascript title="cjs-live.cjs"
const counter = {
  count: 0,
  increment() { this.count += 1; },
};
module.exports = counter;
```

```javascript title="cjs-live-main.cjs"
const counter = require('./cjs-live.cjs');
counter.increment();
console.log(counter.count);
```

```output
1
```

This works because everyone reads the *property* of the same object. The moment someone destructures (`const { count } = require(…)`), they hold a copy. Libraries that want CommonJS consumers to see changing values expose a getter (`get count() { return count; }`) or a function.

### When it matters in practice

Exported mutable state is uncommon in good code, so live bindings rarely matter day to day. They do matter in three places: circular dependencies, where they decide whether a value is visible yet; transpiled code, where a build tool converting ESM to CommonJS must emulate them with getters (some older setups did not, which created bugs that vanished under native ESM); and test mocking, where a test cannot simply assign to an imported function because the binding is read-only. Even so, prefer exporting functions such as `getCount()` and `setLevel()` over exporting a `let` that changes — it makes the changing state explicit and identical under both module systems.

```quiz
Q: `settings.js` has `export let theme = 'light'; export function setTheme(t) { theme = t; }`. Another module runs `import { theme, setTheme } from './settings.js'; const t = theme; setTheme('dark'); console.log(theme, t);`. What is printed?
- [ ] `light light`
- [x] `dark light`
- [ ] `dark dark`
- [ ] A TypeError, because `theme` is imported
> `theme` is a live binding, so after `setTheme('dark')` it reads the exporter's updated variable: `dark`. `t` is a local copy made before the change, so it stays `light`. Nothing is assigned to the imported binding (only `settings.js` assigns its own variable), so there is no TypeError.
```

## Circular Dependencies {#b1-circular-deps}

A **circular dependency** exists when modules import each other, directly (`a` imports `b`, `b` imports `a`) or through a longer loop (`a` → `b` → `c` → `a`). Neither module can finish first, because each needs the other. Both module systems allow cycles, and both resolve them the same basic way: they start evaluating one module, and when the cycle leads back to a module that is *already in progress*, they hand over its unfinished exports instead of starting it again. The difference is what "unfinished" looks like.

Cycles happen naturally in real code: a `User` model that refers to `Order` and an `Order` model that refers to `User`; a registry that imports plugins which import the registry; two utility files that grew helpers for each other.

### CommonJS: a partially filled exports object

Remember that `require` caches the module *before* running it. In a cycle, the second `require` of a module still running finds it in the cache and returns its `module.exports` as it currently is.

```javascript title="a.cjs"
exports.loaded = false;
const b = require('./b.cjs');
console.log('in a: b.loaded =', b.loaded);
exports.loaded = true;
```

```javascript title="b.cjs"
const a = require('./a.cjs');
console.log('in b: a.loaded =', a.loaded);
exports.loaded = true;
```

```output
in b: a.loaded = false
in a: b.loaded = true
```

Running `node a.cjs`: `a.cjs` sets `loaded = false` and requires `b.cjs`. `b.cjs` requires `a.cjs`, which is in the cache but only halfway through, so `b.cjs` receives `{ loaded: false }` — whatever `a.cjs` had assigned before it paused. `b.cjs` finishes, `a.cjs` resumes and sees a complete `b`. Anything `a.cjs` had not yet assigned would be `undefined` inside `b.cjs`. Worse, if `a.cjs` later did `module.exports = { … }` (replacing the object instead of adding to it), `b.cjs` would keep holding the old, abandoned object forever.

### ESM: linked but uninitialised bindings

In ESM, linking connects all the bindings first, so a module in a cycle always has a binding for each import. What it may not have yet is a *value*. Reading an exported `let`, `const` or `class` whose declaration has not run is a TDZ error. Function declarations are initialised during linking, so they can be called early.

```javascript title="a.mjs"
import { b } from './b.mjs';
console.log('a.mjs evaluating, b =', b);
export const a = 'A';
export function describeA() { return 'I am A'; }
```

```javascript title="b.mjs"
import { a, describeA } from './a.mjs';
console.log('b.mjs evaluating');
console.log(describeA());
try { console.log(a); } catch (e) { console.log(e.name + ': ' + e.message); }
export const b = 'B';
export function useA() { return a; }
```

```javascript title="entry.mjs"
import { a } from './a.mjs';
import { useA } from './b.mjs';
console.log('later:', useA());
```

```output
b.mjs evaluating
I am A
ReferenceError: Cannot access 'a' before initialization
a.mjs evaluating, b = B
later: A
```

Trace it. `entry.mjs` imports `a.mjs` first. Before `a.mjs` can run, its dependency `b.mjs` must run. `b.mjs` depends on `a.mjs` — already in progress — so evaluation does not loop; it runs `b.mjs` immediately. Inside `b.mjs`, `describeA()` works because function declarations were initialised at link time, but reading `a` throws because `export const a = 'A'` has not executed. `b.mjs` finishes, then `a.mjs` runs and can read `b`. Finally, `useA()` is called *later*, after both modules finished, and the live binding now reads `'A'`.

The outcome depends on which module is entered first. If `entry.mjs` imported `b.mjs` first, the roles would swap. That is what makes cycle bugs confusing: an unrelated change to import order elsewhere can move the crash.

```mermaid title="Evaluation of the a.mjs / b.mjs cycle, entered through a.mjs"
sequenceDiagram
  participant E as entry.mjs
  participant A as a.mjs
  participant B as b.mjs
  E->>A: evaluate (needs b first)
  A->>B: evaluate b.mjs
  B-->>A: a.mjs already in progress, do not restart
  Note over B: describeA() works, reading a throws
  B->>A: b.mjs done
  Note over A: a.mjs runs, b is 'B'
  A->>E: done, entry.mjs runs
```

### How to fix a cycle

The fixes are the same in both systems, in order of preference:

1. **Extract the shared part.** If `a` and `b` both need something, move it to a third module `c` that imports neither. The cycle disappears.
2. **Use the import later, not at the top level.** A cycle is harmless if neither module *reads* the other's values while it is being evaluated. Wrapping the usage in a function that runs after startup (like `useA` above) is often enough.
3. **Import a type only.** In TypeScript, `import type` is erased at compile time, so a cycle created only by type annotations does not exist at runtime.
4. **Invert the dependency.** Instead of the registry importing every plugin and every plugin importing the registry, let plugins receive the registry as an argument.

The bug to watch for is any top-level line that *uses* an import immediately — `export const x = helperFromPeer()`, `class Admin extends User {}` at module scope, or registering into an object that the other module creates. Tools such as `madge` or ESLint's `import/no-cycle` rule detect cycles before they bite.

## Top-level await {#b1-top-level-await}

**Top-level `await`** (ES2022) lets an ES module use `await` outside any `async` function, directly in its module body. The module's evaluation pauses at that point until the promise settles. Any module that imports it — directly or indirectly — waits as well, because an importer cannot run until its dependencies have finished evaluating.

Before it existed, a module that needed asynchronous setup (reading a config file, initialising WebAssembly, opening a database connection) had to export a promise or an `init()` function, and every importer had to remember to await it. Top-level `await` moves that waiting into the module system.

```javascript title="config.js"
console.log('config: start');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(100); // stands in for reading a file or fetching settings
export const config = { apiUrl: 'https://api.example.com' };
console.log('config: done');
```

```javascript title="util.js"
console.log('util: evaluated');
export const util = true;
```

```javascript title="main.js"
import { config } from './config.js';
import { util } from './util.js';
console.log('main: config.apiUrl =', config.apiUrl);
```

```output
config: start
util: evaluated
config: done
main: config.apiUrl = https://api.example.com
```

Notice `util: evaluated` appears *between* `config: start` and `config: done`. When `config.js` paused, the runtime did not freeze the whole graph: it carried on evaluating modules that do not depend on `config.js`, such as `util.js`. Only `main.js`, which depends on `config.js`, waited. So top-level `await` blocks *dependents*, not siblings. (The 100 ms delay is a timer, so the exact gap is approximate, but the order is fixed.)

### What changes inside the engine

Without top-level `await`, evaluating a module graph is synchronous. A module that contains top-level `await` is evaluated like the body of an `async` function, and evaluating it produces a promise. The evaluation algorithm tracks which modules are waiting on which, and resumes dependents once all of their asynchronous dependencies have settled. If the awaited promise rejects, the module fails to evaluate, and every module that imports it fails too:

```javascript title="fail.js"
await Promise.reject(new Error('config file missing'));
```

Importing `fail.js` stops the program with `Error: config file missing`, and the importer's code never runs. In a browser the module script fails and an error is reported to the console; a dynamic `import()` of it rejects.

### Where it is allowed

Only in ES modules. In a CommonJS file or classic script, `await` at top level is a `SyntaxError` ("await is only valid in async functions and the top level bodies of modules"). In Node, `require()` can load an ES module only when its graph has no top-level `await`; otherwise it throws `ERR_REQUIRE_ASYNC_MODULE` (see the interop section below).

### Costs and the deadlock case

Top-level `await` is a graph-wide pause. A library that awaits a network request at the top level makes the start of every application that imports it wait for that request — usually a surprise to its users. Keep top-level `await` to application entry points and genuine one-time initialisation, keep the awaited work short, and let failures reject loudly rather than hanging.

There is also a way to wait forever. A module that awaits a dynamic import of a module that statically imports it back can never finish:

```javascript title="da.js"
console.log('da: awaiting import of db');
const b = await import('./db.js');
console.log('da: never gets here', b);
export const x = 1;
```

```javascript title="db.js"
import { x } from './da.js';
console.log('db evaluated');
```

```output
da: awaiting import of db
Warning: Detected unsettled top-level await at file:///…/da.js:2
```

`db.js` cannot evaluate until `da.js` finishes, and `da.js` cannot finish until `db.js` is loaded. Node notices that nothing else is keeping the process alive, prints the warning and exits with code 13. In a browser the page would wait indefinitely. Static cycles that contain top-level `await` are handled correctly by the specification; the problem is specifically awaiting something that itself waits for you.

## Tree Shaking Conceptually {#b1-tree-shaking}

**Tree shaking** is dead-code elimination performed by a bundler: it removes exports that no module in the application imports, so they never reach the user's browser. The name pictures the module graph as a tree that is shaken until the unused branches fall off. It is not a language feature and it does not happen at runtime — a browser loading an unbundled ES module downloads the whole file — but it depends entirely on ESM being static.

### Why it needs ESM

To delete an export safely, a bundler must *prove* nobody uses it. With ESM that proof is easy: imports and exports are declarations at the top level, with literal names and paths, so the bundler can list every name each module asks for without running anything. With CommonJS it is mostly impossible: `require` can be called with a computed path inside an `if`, `module.exports` can be built dynamically, and an importer can read `lib[name]` with a name computed at runtime. Bundlers fall back to keeping the whole CommonJS module.

Here is real tree shaking by Rolldown, the bundler used by Vite 8, on three small files:

```javascript title="utils.js"
export function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
export function heavyChart(data) {
  return data.map((d) => d * 2).join(',');
}
```

```javascript title="polyfill.js"
globalThis.appStarted = Date.now();
export const unused = 1;
```

```javascript title="entry.js"
import { formatPrice } from './utils.js';
import { unused } from './polyfill.js';
console.log(formatPrice(1999));
```

```output
//#region utils.js
function formatPrice(cents) {
	return `$${(cents / 100).toFixed(2)}`;
}
//#endregion
//#region polyfill.js
globalThis.appStarted = Date.now();
//#endregion
//#region entry.js
console.log(formatPrice(1999));
//#endregion
```

`heavyChart` is gone: nothing imports it. `formatPrice` stays because `entry.js` calls it. The interesting case is `polyfill.js`. Its export `unused` was imported but never read, so the export disappeared — yet the line `globalThis.appStarted = Date.now()` survived. That line is a **side effect**: running the module changes something outside it. The bundler cannot know whether the rest of the app depends on that change, so it must keep it. Tree shaking removes *unused exports*; it keeps any code that might do something when the module loads.

### The two halves: reachability and purity

Conceptually a bundler does two things. First, **mark what is used**: starting at the entry, follow every import to the specific exports it names, and from those to the functions and variables they reference. Second, **check what is safe to drop**: for every top-level statement that was not marked, decide whether removing it could change behaviour. Function declarations and constants with plain values are safe. A function call, a property assignment on a global, or `new SomeClass()` might have effects, so it stays — unless the developer has promised otherwise.

That promise has two common forms. The `"sideEffects": false` field in a library's `package.json` tells bundlers that importing any file of the package has no side effects, so an entire file whose exports are unused can be skipped. It can also list the files that *do* have effects, such as `["*.css", "./src/polyfills.js"]`. A `/*#__PURE__*/` comment before a call tells the minifier that the call's result can be dropped if unused. Both are promises; if they are false, the bundler will delete code your app needed.

### What defeats tree shaking

- **CommonJS dependencies.** A library published only as CommonJS is usually included whole. Prefer packages with an ESM build (`lodash-es` rather than `lodash`).
- **Dynamic access to a namespace.** `import * as utils` followed by `utils.formatPrice` is fine; bundlers track static property reads. `utils[name]` with a computed `name` forces every export to be kept. In the same Rolldown setup, the computed version kept both functions while the static version kept one.
- **One big default object.** `export default { formatPrice, heavyChart }` is a single value; if the bundler cannot prove which properties are read, the whole object and everything in it stays.
- **Side effects at module top level.** Registering globals, patching prototypes or running setup code on import keeps a module alive. Barrel files that re-export many such modules pull all of them in.
- **Classes.** Methods live on the class; a bundler cannot drop an unused method of a used class.

Tree shaking only removes what is provably unused. Check the real bundle with a bundle analyser rather than assuming it worked; see [[b3-bundle-size]] and [[b4-bundle-optimization]].

```quiz
Q: A module `analytics.js` exports `track()` and also runs `window.dataLayer = window.dataLayer || []` at the top level. Your app imports `track` nowhere, but does `import './analytics.js'`. What does a bundler do?
- [ ] Removes the whole module, because none of its exports are used
- [x] Keeps the top-level `window.dataLayer` statement and drops `track()`
- [ ] Keeps everything, because side-effect imports disable tree shaking for the whole app
- [ ] Throws, because a module must export something to be imported
> Unused exports such as `track` can be dropped, but the top-level assignment changes global state, and the bundler must assume someone depends on it. Only a `"sideEffects": false` declaration (or a correct list) would let it skip the module entirely — and here that would be a lie that breaks analytics.
```

## Using ESM and CommonJS together

Most Node.js projects contain both kinds of module, so the interop rules are worth knowing exactly.

**ESM importing CommonJS** always works. `module.exports` becomes the **default export**. Node also tries to offer named exports by statically scanning the CommonJS source for patterns such as `exports.name = …` and `module.exports = { name }`; names it can detect become importable with braces, names created dynamically do not.

```javascript title="lib.cjs"
exports.greet = (n) => `hi ${n}`;
exports.VERSION = 3;
```

```javascript title="fnlib.cjs"
module.exports = function slugify(s) { return s.toLowerCase().replace(/\s+/g, '-'); };
```

```javascript title="interop.mjs"
import lib, { greet } from './lib.cjs';
import slugify from './fnlib.cjs';
console.log(lib, greet('Ada'));
console.log(slugify('Hello World'));
```

```output
{ greet: [Function (anonymous)], VERSION: 3 } hi Ada
hello-world
```

**CommonJS loading ESM** has changed recently. `import()` has always worked from CommonJS, because it is asynchronous. Synchronous `require()` of an ES module was an error (`ERR_REQUIRE_ESM`) for years; since **Node 22.12 and 20.19** it works by default, provided the ES module graph contains no top-level `await`:

```javascript title="req-esm.cjs"
const m = require('./esm-lib.mjs');            // export const answer = 42; export default '…'
console.log(m.answer, m.default);
try { require('./tla-lib.mjs'); } catch (e) { console.log(e.code); } // uses top-level await
import('./tla-lib.mjs').then((ns) => console.log('import() ok:', ns.ready));
```

```output
42 the default
ERR_REQUIRE_ASYNC_MODULE
import() ok: true
```

`require` returns the module namespace object, so a default export is on `.default`. If you support older Node versions, assume `require(esm)` fails and use `import()`.

**Transpiled code and `__esModule`.** Before native ESM, Babel and TypeScript compiled `export default x` into CommonJS as `exports.default = x` plus a marker `exports.__esModule = true`, and compiled `import x from` into code that checks the marker. That is why some CommonJS packages must be imported as `require('pkg').default`, and why TypeScript has the `esModuleInterop` option ([[b2-esm-vs-cjs-ts]]).

**The dual package hazard.** A package that ships both an ESM and a CommonJS build can be loaded *twice* in one application — once through `import`, once through `require` — giving two separate copies of its state. A singleton cache, an `instanceof` check or a registered plugin list then mysteriously disagrees with itself. Package authors avoid it by keeping state in one build that the other wraps, or by shipping a single format.

## In real systems

New Node.js services and libraries are usually written as ESM (`"type": "module"`), while many still publish both formats through the `exports` field in `package.json` so that CommonJS consumers keep working. Frontend source code is ESM almost without exception; bundlers convert any CommonJS dependencies they meet, which is one reason CommonJS packages tree-shake poorly. Test runners and tools have largely followed: Vitest is ESM-native, and Jest's ESM support required extra configuration for years, which is a common reason teams migrated.

Circular dependencies show up most in large applications with model layers, dependency-injection containers and feature folders that import each other's barrels. Teams enforce acyclic layering with lint rules, because a cycle that works today breaks when someone reorders imports.

Top-level `await` is common in application entry points, server bootstrap files, scripts, and modules that initialise WebAssembly. It is avoided in published libraries for the reason given above. Bundlers support it but must output ES module chunks that browsers can await.

## Trade-offs and alternatives

CommonJS is simple, synchronous and fully dynamic: you can require conditionally, compute paths and clear the cache to reload a file, which some tools and test setups depend on. Those same properties make it impossible to analyse statically, unsupported in browsers, and unable to use top-level `await`.

ESM is static, standard across browsers and servers, tree-shakable, supports top-level `await`, and catches missing exports early. It costs some flexibility (conditional loading needs `import()`), demands exact file extensions in Node, and the module cache cannot be cleared, which complicates hot-reloading and some mocking.

For new code, choose ESM. Keep CommonJS where an existing codebase or toolchain requires it, and migrate at package boundaries rather than file by file, so that each package is consistently one or the other.

## Common mistakes

- **Expecting a destructured `require` to update.** `const { count } = require('./x')` copies the value. Read `x.count` or use a getter function.
- **Reassigning `exports`.** `exports = { … }` exports nothing. Assign `module.exports`.
- **Using `__dirname` in ESM.** It does not exist. Use `import.meta.dirname` (Node 20.11+) or `fileURLToPath(new URL('.', import.meta.url))`.
- **Reading an import at the top level of a cyclic module.** It is `undefined` in CommonJS or a TDZ `ReferenceError` in ESM. Defer the access into a function, or remove the cycle.
- **Putting top-level `await` in a shared library.** Every importer's start-up now waits for it. Export an async initialiser instead.
- **Declaring `"sideEffects": false` on a package that has side effects.** The bundler drops CSS imports or polyfills, and the bug appears only in production builds.
- **Assuming tree shaking happened.** Measure the bundle; a single CommonJS dependency or `import *` with computed access can keep everything.

## Interview perspective

This topic separates candidates who have used modules from those who understand them. The strongest answers anchor every difference in one idea: CommonJS runs a function and returns an object; ESM links named bindings before anything runs.

> [!INTERVIEW] What a strong answer sounds like
> "`require` is synchronous and dynamic — it runs the file and returns `module.exports`, so a destructured primitive is a snapshot. ESM is static: the loader parses and links the whole graph first, imports are live read-only views of the exporter's variables, and evaluation happens dependencies-first. That static graph is why ESM supports tree shaking and catches missing exports early, and the linking step is why cycles show up as TDZ errors rather than `undefined`."

Questions to prepare:

- **What is a live binding?** An import refers to the exporter's variable rather than holding a copy; it updates when the exporter changes it and cannot be assigned by the importer.
- **What happens with circular dependencies?** CommonJS returns the partially filled `module.exports` from the cache; ESM links everything, then the module evaluated first may hit uninitialised bindings (TDZ). Fix by extracting shared code or deferring access.
- **Can you `require` an ES module?** Since Node 22.12 / 20.19, yes, if the graph has no top-level `await`; otherwise use `import()`. Mentioning the version shows current knowledge.
- **What does top-level `await` do to importers?** They wait for the module to finish; independent sibling modules do not.
- **Why does tree shaking need ESM?** Static, top-level imports and exports let the bundler prove an export is unused; dynamic `require` does not.
- **Follow-up: why is my bundle still large?** CommonJS dependencies, side-effectful modules, barrel files, computed namespace access, or a default-exported object.

## Practice

1. **Port and compare.** Write a module that exports a `let total` and an `add(n)` function, once in CommonJS and once in ESM. Import it both ways, call `add` three times, and explain each value you print.
2. **Break and fix a cycle.** Create `user.mjs` and `order.mjs` that import each other and each use the other's exported `const` at the top level. Record the error, then fix it twice: once by moving the access into a function, once by extracting a third module.
3. **Ordering with top-level await.** Build `entry.js` that imports `slow.js` (awaits 200 ms), `fast.js` and `dependsOnSlow.js` (imports `slow.js`). Predict the log order before running it.
4. **Interop matrix.** In a scratch Node project, make a CommonJS file and an ES module each try to load the other with `require`, static `import` and `import()`. Fill in a table of what works on your Node version.
5. **Shake it.** With any bundler, bundle a file that imports one function from a module of five. Then switch to `import * as m` with `m[name]` and compare the output.

## Quick revision {#quick-revision}

- CommonJS: wrapper function `(exports, require, module, __filename, __dirname)`, synchronous `require`, cache by file name, top-level `this` is `module.exports`.
- ESM: static graph, async loading, always strict, top-level `this` is `undefined`, `import.meta.url`.
- Node: `.mjs` = ESM, `.cjs` = CJS, `.js` follows `package.json` `"type"`.
- `exports.x = …` works; `exports = …` does not; use `module.exports` for a single value.
- Live binding: import reads the exporter's variable; updates propagate; importer cannot assign. Destructuring or copying breaks the link.
- CJS shares the exports *object*; properties read through it stay current, destructured values do not.
- Cycles: CJS → partially filled exports (`undefined`); ESM → linked bindings, TDZ `ReferenceError` until initialised; function declarations usable early.
- Fix cycles: extract shared module, defer access into functions, `import type`, invert dependencies.
- Top-level `await`: ESM only; pauses the module and its dependents, not siblings; rejection fails the import chain; awaiting a dynamic import of your own importer deadlocks.
- Tree shaking: bundler removes unused exports using the static ESM graph; keeps side effects; `"sideEffects"` and `/*#__PURE__*/` are promises to the bundler.
- Interop: ESM imports CJS (`module.exports` = default, detectable names as named); CJS uses `import()`, or `require(esm)` in Node 22.12+/20.19+ if no top-level `await`.

## Key takeaways {#key-takeaways}

- CommonJS runs a file when `require` is called and returns an object; ESM links every import to an export before any code runs.
- ESM imports are live, read-only bindings, while values pulled out of a CommonJS exports object are snapshots.
- Both systems tolerate cycles, but code that reads a peer's value during start-up fails — `undefined` in CommonJS, a TDZ error in ESM.
- Top-level `await` makes module evaluation asynchronous and delays every dependent, so keep it out of shared libraries.
- Tree shaking is a bundler optimisation made possible by static imports; side effects and dynamic access limit it.
- Node now lets the two systems load each other in most cases, but the version and top-level `await` decide whether `require` of ESM works.
