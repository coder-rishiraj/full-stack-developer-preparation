---
summary: Every time your code mentions a variable, the engine must work out which binding that name refers to — or decide that it refers to nothing. You will learn the exact resolution procedure, what happens on reads versus writes, why strict mode and typeof change the outcome, and how the global object, with and eval complicate the picture.
difficulty: intermediate
minutes: 40
objectives:
  - Distinguish identifier resolution from property lookup in any expression
  - Trace how the engine resolves a name through the scope chain and what it returns when it succeeds or fails
  - Predict the outcome of reading or writing an unresolvable name in sloppy mode, strict mode and with typeof
  - Explain how the global scope's two stores (declarative record and global object) affect lookups
  - Debug ReferenceError and TypeError messages by naming the resolution step that failed
---

## Introduction

Look at the line `total = price * qty;`. It mentions three names, and before the multiplication can happen, the engine has to answer the same question for each one: *which variable does this name mean?* There may be several variables called `price` in the program — a parameter here, a module-level constant there. Or there may be none at all, because of a typo. Finding the right binding for a name, or concluding that there is none, is called **identifier resolution** (or **variable resolution**).

You already know the rule from [[b1-lexical-scope]]: search the scope chain from the innermost scope outward, and the first declaration wins. This lesson looks at the procedure in detail, because the interesting behaviour lives at the edges. What does the engine do when the search fails — and why does it sometimes throw, sometimes return `'undefined'`, and sometimes silently create a new global variable? Why can a global `let` and `globalThis` disagree about a variable's value? Why does `obj.x` never involve the scope chain at all? Each of these is a common source of bugs, and each has a precise answer.

## Before you start

- **Lexical scope and the scope chain** — how scopes nest and link outward. See [[b1-lexical-scope]] and [[b1-scope-chain]].
- **Strict mode** — because resolution failures behave differently with it. See [[b1-strict-mode]].
- **Global variables and `globalThis`** — the global object that sits at the end of every chain. See [[b1-global-variables]].
- **The temporal dead zone** — why a `let` can exist but be unreadable. See [[b1-tdz]].

## The intuition

Think of looking for a colleague in an office building by asking at reception on each floor, starting from your own. The first floor that says "yes, they work here" ends the search, and you go to that desk. What happens if every floor, including the ground floor, says "never heard of them" depends on what you were trying to do. If you wanted to *read* a message from them, you have nothing to read — an error. If you wanted to *leave* them a message, an old, careless building would set up a new desk in the lobby for this unknown person and leave the message there. A strict building refuses.

Two details complete the picture. Some floors know a person exists but report that they have not arrived yet (a `let` in its temporal dead zone). And some desks accept visitors but refuse new deliveries (a `const`). Resolution finds the desk; whether you can then read from it or write to it is a second step.

## Identifiers versus property names

Resolution applies only to **identifiers used as variable references**. Many names in JavaScript code look similar but are not resolved through scopes at all. Getting this distinction right avoids a whole family of confused bugs.

```javascript
const color = 'red';
const key = 'color';
const car = { color: 'blue' };

console.log(color);      // `color` is an identifier: resolved on the scope chain
console.log(car.color);  // `car` is resolved; `.color` is a property name
console.log(car[key]);   // `car` and `key` are resolved; the string 'color' is a key
const point = { color }; // shorthand: the identifier `color` is resolved
console.log(point);
```

```output
red
blue
blue
{ color: 'red' }
```

In `car.color`, only `car` goes through identifier resolution. Once `car` is found, `color` is looked up as a property of that object, which uses a different algorithm — the **prototype chain** (see [[b1-property-lookup]]). In `car[key]`, the identifier `key` is resolved to the string `'color'`, and that string is then used as a property key. In the object literal `{ color: 'blue' }`, `color` is just a key and nothing is resolved. But the shorthand `{ color }` means `{ color: color }`, so the second `color` *is* an identifier and is resolved to `'red'`.

Other names that are not variable references: labels (`outer:` before a loop), names after `.` or `?.`, method names in a class body, and keys in destructuring patterns such as `const { color: c } = car` (where `color` is a property key and `c` is a new binding being declared).

## The resolution procedure

The specification describes resolution in a few steps, which are worth knowing in simplified form because they explain every outcome that follows.

1. **Start at the running code's current environment** — the innermost scope at the point where the name appears.
2. **Ask the environment whether it has a binding for the name.** For a declarative scope (function, block, module), this checks its table of declared names. For the global scope, it checks the declarative part first, then the global object (more on this below).
3. **If yes, stop.** The result is a **reference**: a small record saying "the binding named `x` in *this* environment".
4. **If no, move to the outer environment** and repeat from step 2.
5. **If there is no outer environment** — you have passed the global scope — the result is an **unresolvable reference**: "a name `x` that no environment has".

Notice that resolution itself never throws. It only produces a reference, resolvable or not. What happens next depends on whether the code wants to **read** the value (the spec's `GetValue`) or **write** one (`PutValue`), and whether the code is strict.

```mermaid title="From an identifier to a value: resolve first, then read or write"
flowchart TD
    A(["identifier x"]) --> B["check current environment"]
    B --> C{"has binding x?"}
    C -- no --> D{"outer environment exists?"}
    D -- yes --> E["move to outer environment"]
    E --> C
    D -- no --> U["unresolvable reference"]
    C -- yes --> R["reference to that binding"]
    R --> I{"initialised?"}
    I -- no --> T1["ReferenceError: before initialization"]
    I -- yes --> V["read value, or write if not const"]
    U --> W{"read, write, or typeof?"}
    W -- read --> T2["ReferenceError: not defined"]
    W -- typeof --> TU(["'undefined'"])
    W -- "write, sloppy" --> G["create global property"]
    W -- "write, strict" --> T2
```

## When the name is found

A successful search finds a binding, but that is not yet a guarantee of success. The binding has state, and the read or write is checked against it:

| Binding state | Read | Write |
|---|---|---|
| Initialised `let`, `var`, parameter, function | Returns the value | Stores the new value |
| `let`, `const` or `class` in its temporal dead zone | `ReferenceError` | `ReferenceError` |
| Initialised `const` (or a class's inner name binding) | Returns the value | `TypeError` |
| Imported binding | Returns the exporter's current value | `TypeError` |

The program below hits each row, plus the unresolvable cases covered in the next section. It is strict, as all module code is.

```javascript
'use strict';
let ready = true;
const LIMIT = 3;

function run() {
  console.log(ready);                                            // found, initialised
  try { console.log(later); } catch (e) { console.log(e.message); } // found, in TDZ
  try { LIMIT = 4; } catch (e) { console.log(e.message); }         // found, const
  try { console.log(missing); } catch (e) { console.log(e.message); } // not found, read
  try { missing = 1; } catch (e) { console.log(e.message); }       // not found, strict write
  console.log(typeof missing);                                   // not found, typeof
  let later = 'x';
}

run();
```

```output
true
Cannot access 'later' before initialization
Assignment to constant variable.
missing is not defined
missing is not defined
undefined
```

The two `ReferenceError` messages are worth learning to tell apart, because they point to different bugs. **"Cannot access 'later' before initialization"** means resolution *succeeded* — a `let`, `const` or `class` with that name exists in scope — but the code ran before the declaration. The fix is to reorder code. **"missing is not defined"** means resolution *failed* — no scope declares the name at all. The fix is to declare it, import it, or correct a typo. A **`TypeError`** after a successful resolution means the binding exists but cannot be assigned. (The messages are V8's wording, used by Chrome and Node.js; Firefox and Safari word them differently but throw the same error types.)

The TDZ row also teaches something about shadowing. Inside `run`, `later` is declared further down, so the search for `later` stops at `run`'s scope even though the binding is not ready. It does not continue outward to look for some other `later`. Resolution is about *declarations*, not about whether a value has arrived yet.

## When the name is not found

An unresolvable reference has three possible fates.

**Reading it throws a `ReferenceError`**, in all modes. There is no value to return, and returning `undefined` silently would hide typos.

**`typeof` returns `'undefined'`.** The `typeof` operator is deliberately special-cased: given an unresolvable reference, it returns the string `'undefined'` instead of throwing. This exists so code can test whether a global is available before using it:

```javascript
const inBrowser = typeof window !== 'undefined';
const inNode = typeof process !== 'undefined' && process.versions?.node !== undefined;
console.log(inBrowser, inNode);
```

```output
false true
```

Run in Node.js, `window` is not declared anywhere, so `typeof window` is `'undefined'` and no error is thrown. This pattern is common in code that must run both in the browser and on a server, for example in server-side rendering. The special case only covers unresolvable names. If the name resolves to a `let`, `const` or `class` that is still in its TDZ, `typeof` throws like any other read.

> [!WARNING] typeof can hide a missing import
> Because `typeof` never complains about an undeclared name, a check such as `if (typeof analytics !== 'undefined') analytics.track(…)` keeps working silently after someone removes the `import` of `analytics` — the feature simply stops running. Use `typeof` checks only for genuinely optional globals, and let a missing import fail loudly.

**Writing to it depends on strict mode.** In strict code (including every ES module and class body), assignment to an unresolvable name throws `ReferenceError`, as the earlier program showed. In sloppy code, the assignment instead **creates a property on the global object**:

```javascript
function sloppy() {
  leaked = 'oops'; // no declaration anywhere: sloppy mode creates a global property
}

sloppy();
console.log(globalThis.leaked);
console.log(delete leaked, typeof leaked);
```

```output
oops
true undefined
```

This is the **implicit global** — one of the original design decisions of JavaScript, preserved so old pages keep working. It turns typos into silent shared state. Notice also that the result is a plain, deletable property of the global object, not a real variable declaration: `delete leaked` removes it, which would not work on a `var`. Strict mode exists largely to close holes like this one.

## Resolution at the global level

The global scope is the last stop on every chain, and it is built differently from the rest. It is a composite of two stores, checked in a fixed order:

1. A **declarative record** holding top-level `let`, `const` and `class` declarations from classic scripts.
2. The **global object** (`window` in browsers, `globalThis` everywhere), holding built-ins like `Math` and `fetch`, top-level `var` and function declarations from classic scripts, implicit globals, and anything code assigns as `globalThis.something`.

A name is looked up in the declarative record first. Usually the two stores do not overlap, but when they do, a bare name and `globalThis.name` can return different things:

```javascript title="page-script.js"
// Run as a classic script, so these are true globals.
globalThis.mode = 'object-property';
let mode = 'lexical';

console.log(mode, globalThis.mode);
```

```output
lexical object-property
```

The bare identifier `mode` finds the `let` in the declarative record and never reaches the global object. `globalThis.mode` is a property lookup on the global object and never sees the `let`. Two different paths, two different answers. In practice this matters when code mixes styles: a library reading `window.config` will not see a page's `let config`.

The global object is an ordinary object, so looking a name up in it is a *property* lookup, including its prototype chain. That has odd consequences. In a browser or Node.js, `typeof toString` at any level of nesting returns `'function'`, because `toString` is inherited by the global object from `Object.prototype`. Browsers add more: elements with an `id` attribute become named properties of `window`, so `<div id="app">` makes a bare `app` resolve to that element in classic scripts if nothing else declares `app`. And some global object properties are accessors with their own behaviour. The classic example is `name` in browsers: `window.name` is a built-in string property, so a classic script that does `var name = 42` and then checks `typeof name` gets `'string'` — the `var` reused the existing property, and the assignment went through its setter, which converts values to strings. Modules avoid all of this, because their top-level names live in the module scope, which sits in front of the global scope on the chain.

## Constructs that change resolution at run time

Two old features let the scope chain change while code runs. Both make resolution impossible to determine from the source, and both are restricted by strict mode.

### `with`

`with (obj) { … }` inserts `obj` into the scope chain as an extra environment, so its properties can be used as if they were variables:

```javascript
const point = { x: 1 };
let y = 2;

with (point) {
  console.log(x, y); // x is found as a property of point; y continues outward
  x = 10;            // writes point.x
}
console.log(point.x);
```

```output
1 2
10
```

Inside the `with` block, resolving `x` first asks "does `point` have a property `x`?" The answer depends on the object's contents at run time — if `point` later lacked `x`, the same line would resolve to some outer `x` instead. Neither a reader nor an engine can know in advance which binding `x` refers to. `with` is a `SyntaxError` in strict mode and in modules, so you will only meet it in legacy code and interview questions.

### Direct `eval`

`eval(code)` runs a string as code. When called directly by the name `eval`, in sloppy mode it runs inside the *calling* function's scope, and any `var` it declares is added to that function's scope:

```javascript
function sloppyEval() {
  eval('var injected = 42');
  console.log(injected); // a binding that did not exist when the function started
}

function strictEval() {
  'use strict';
  eval('var injected = 42'); // strict eval gets its own scope
  console.log(typeof injected);
}

sloppyEval();
strictEval();
```

```output
42
undefined
```

In `sloppyEval`, the name `injected` cannot be resolved by reading the function's source; it appears only when the string is evaluated. In strict mode, `eval` runs its code in a new scope of its own, so declarations inside it disappear afterwards and the enclosing scope stays exactly as written. An **indirect** call such as `(0, eval)(code)` runs the code in the global scope instead. Beyond scope problems, `eval` executes arbitrary strings, which is a security risk when any part of the string comes from user input.

## How engines make resolution fast

A literal implementation would walk a chain of tables for every variable access. Real engines do almost none of that. Because scope is lexical, V8 performs **scope analysis** while parsing: for each identifier, it determines which scope declares it and where that variable will be stored. A local variable that no inner function uses becomes a register or stack slot. A captured variable becomes a numbered slot in a heap-allocated context, and the engine records "go up two contexts, take slot 3". At run time there is no searching at all — just fixed offsets.

Global lookups are handled with caches: the first lookup of `Math` in a function records where it was found so later executions can go straight there. The constructs above are exactly the ones that break the analysis. A direct `eval` or a `with` anywhere in a function means some names cannot be resolved ahead of time, so the engine falls back to dynamic lookups for that scope. Avoiding them keeps code fast as well as readable.

## Worked example: tracing every name

Here is a short module-style program. The table traces how each name is resolved when `checkout` runs.

```javascript
'use strict';
const TAX = 0.2;

function checkout(cart) {
  let total = 0;
  for (const item of cart) {
    const price = item.price * (1 + TAX);
    total += price;
  }
  return Math.round(total * 100) / 100;
}

console.log(checkout([{ price: 10 }, { price: 5.5 }]));
```

```output
18.6
```

| Name (where used) | Environments checked | Found in | Kind of lookup |
|---|---|---|---|
| `cart` (in `for…of`) | `for` block → `checkout` | `checkout` (parameter) | Identifier |
| `item` (in loop body) | loop body block → per-iteration `for` scope | `for` scope (`const item`) | Identifier |
| `item.price` → `.price` | — | `item` object | Property, not resolution |
| `TAX` | loop body → `for` scope → `checkout` → global | global (top-level `const`) | Identifier |
| `price` | loop body | loop body (`const price`) | Identifier |
| `total` | loop body → `for` scope → `checkout` | `checkout` (`let total`) | Identifier |
| `Math` | `checkout` → global declarative record → global object | global object (built-in) | Identifier, then property `round` |
| `checkout` (last line) | global declarative record → global object | global object | Identifier |

The last row is subtle. When this file runs as a classic script, `checkout` is a top-level function declaration, so it lives on the global object. Loaded as an ES module, it would live in the module scope instead, which is checked before the global scope. Either way the bare name resolves correctly; only `globalThis.checkout` would behave differently. The total is `10 × 1.2 + 5.5 × 1.2 = 18.6`.

## In real systems

**Reading errors quickly.** In production error logs, "X is not defined" almost always means a missing import, a typo, a script that loaded in the wrong order, or code that assumed a browser global (`window`, `document`, `localStorage`) while running on a server. "Cannot access 'X' before initialization" usually means a circular import or code reordered so that a `const` is used before its line runs.

**Catching failures before they ship.** ESLint's `no-undef` rule and TypeScript's "Cannot find name" error perform resolution statically on every identifier in the project. They catch implicit globals and typos at edit time. Global names that really are provided by the environment are declared to these tools explicitly (ESLint `globals`, TypeScript `lib` and `types` settings).

**Environment detection.** Universal code uses `typeof window !== 'undefined'` or checks on `globalThis` to decide whether browser APIs exist, precisely because `typeof` does not throw on unresolvable names.

**Avoiding the global object.** Modules, bundlers and strict mode together mean modern application code almost never creates global-object properties, and so rarely meets the global-scope oddities above. They remain relevant when integrating third-party scripts, analytics snippets and legacy pages.

## Common mistakes

> [!MISTAKE] Treating "is not defined" and "undefined" as the same thing
> A variable that exists and holds `undefined` is fine to read. A name that does not resolve throws `ReferenceError: x is not defined`. `typeof x === 'undefined'` cannot tell these two apart, so do not use it to check whether a *declared* variable has been set — compare with `undefined` directly.

**Expecting `obj.x` to find a variable `x`, or `x` to find `obj.x`.** Property lookup and identifier resolution are separate. The only bridge is `with` (forbidden in strict mode) and the global object.

**Relying on implicit globals.** A sloppy assignment to an undeclared name "works" until another script uses the same name. Use strict mode or modules so it throws instead.

**Assuming `globalThis.x` and `x` are the same.** They match for `var` and function declarations in classic scripts, and differ for top-level `let`, `const` and `class`.

**Misreading TDZ errors as missing variables.** "Before initialization" means the name *was* found. Look for code ordering problems or circular imports, not for a missing declaration.

## Interview perspective

Resolution questions usually appear as "what happens when…" questions. Strong answers separate the two steps — find the binding, then read or write it — and name the mode.

> [!INTERVIEW] Answering "what happens if you assign to an undeclared variable?"
> "The name doesn't resolve to any binding. In sloppy mode, the assignment creates a property on the global object — an implicit global. In strict mode and in ES modules, it throws a ReferenceError. Reading an undeclared name throws in both modes, except under `typeof`, which returns 'undefined'."

Questions to prepare:

- **How does the engine find a variable?** It walks the environments from the current scope outward; the first one with a binding wins. Failure yields an unresolvable reference.
- **Difference between "not defined" and "before initialization"?** Resolution failed versus resolution found an uninitialised `let`/`const`/`class`.
- **Why does `typeof undeclaredVar` not throw?** It is special-cased to allow safe existence checks for globals.
- **Why are `with` and `eval` discouraged?** They make resolution depend on run-time data, defeat engine optimisations, and (for `eval`) create security risks. Strict mode bans `with` and isolates `eval`.
- **Follow-up: can a global `let` be read through `window`?** No. It lives in the global declarative record, not on the global object.

## Practice

1. **Classify names.** In a function from your own code, mark every name as identifier resolution, property name, object key or new declaration.
2. **Three errors.** Write one line that throws "is not defined", one that throws "before initialization", and one that throws "Assignment to constant variable." Explain which resolution step caused each.
3. **Sloppy versus strict.** Write a function that assigns to an undeclared name. Run it without and with `'use strict'`, and check `globalThis` afterwards.
4. **Two stores.** In a classic script, create a global `let` and a `globalThis` property with the same name, then predict and verify what a bare reference and a `globalThis.` reference each return.
5. **Safe detection.** Write a function `hasLocalStorage()` that returns `true` only when `localStorage` exists and does not throw when run in Node.js.

```quiz
Q: In strict mode, what does `typeof notDeclaredAnywhere` evaluate to?
- [ ] It throws a ReferenceError
- [x] `'undefined'`
- [ ] `'object'`
- [ ] `undefined` (the value, not a string)
> `typeof` is special-cased for unresolvable references and returns the string 'undefined' in every mode. Strict mode changes the outcome of *writing* to an undeclared name, not of `typeof`. The exception is a name that resolves to a let/const in its temporal dead zone, which throws.

Q: Which error message tells you that a binding with the name *was* found by resolution?
- [ ] `ReferenceError: total is not defined`
- [x] `ReferenceError: Cannot access 'total' before initialization`
- [ ] Both of them
- [ ] Neither of them
> "Before initialization" means the scope chain contains a let, const or class named `total`, but its declaration has not run yet. "Is not defined" means no environment on the chain declares the name at all.

Q: In the expression `order.customer.name`, which names go through identifier resolution on the scope chain?
- [x] Only `order`
- [ ] `order` and `customer`
- [ ] All three names
- [ ] None, because they are all property accesses
> Only the leftmost name is a variable reference. `customer` and `name` follow a dot, so they are property names looked up on the objects reached so far, using the prototype chain rather than the scope chain.
```

## Quick revision {#quick-revision}

- Resolution = finding which binding a name refers to by walking environments outward; first match wins.
- Resolution produces a reference (resolvable or unresolvable); reading or writing it is a separate step.
- Only bare identifiers are resolved. Names after `.`, object-literal keys, labels and class method names are not; shorthand `{ x }` is.
- Found but in TDZ → `ReferenceError: Cannot access 'x' before initialization`.
- Found `const` or import, written → `TypeError`.
- Not found, read → `ReferenceError: x is not defined` (all modes).
- Not found, `typeof` → `'undefined'`.
- Not found, write → sloppy: creates a deletable global-object property; strict/module: `ReferenceError`.
- Global scope = declarative record (`let`/`const`/`class`) checked before the global object (`var`, functions, built-ins).
- The global object's prototype chain and browser named properties (element ids, `window.name`) can surprise classic scripts.
- `with` adds an object to the chain; sloppy direct `eval` can add `var`s; strict mode bans `with` and gives `eval` its own scope.
- Engines resolve most names at parse time to fixed slots; `with`/`eval` force slow dynamic lookups.

## Key takeaways {#key-takeaways}

- Using a variable is a two-step act: find the binding through the scope chain, then read or write it.
- "Is not defined" means no binding was found; "before initialization" means one was found too early; a `TypeError` means it cannot be assigned.
- `typeof` is the only way to mention an undeclared name without an error, which makes it useful for environment checks and dangerous for hiding missing imports.
- Sloppy-mode writes to unknown names create globals; strict mode and modules turn them into errors.
- The global scope has two stores, so a top-level `let` and a `globalThis` property can disagree.
- `with` and `eval` make resolution unpredictable and slow; modern strict code avoids both.
