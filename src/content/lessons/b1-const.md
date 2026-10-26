---
summary: const declares a block-scoped binding that must be given a value immediately and can never be pointed at a different value. You will learn exactly what const does and does not protect, how to make objects genuinely read-only when you need to, and why "const by default" is the modern rule.
difficulty: beginner
minutes: 35
objectives:
  - Explain the difference between an immutable binding and an immutable value
  - Predict which operations on a const variable throw and which succeed
  - Use Object.freeze correctly and explain why it is shallow
  - Use const in for...of and for...in loops, and explain why it fails in a classic for loop
  - Justify the "const by default, let when needed" convention
---

## Introduction

Most variables in a program are set once and never changed. A configuration value, the result of a calculation, a reference to a DOM element, a function — you compute it, give it a name, and use it. If such a name were accidentally reassigned halfway through a function, the bug would be hard to find, because every line below would silently use the wrong value.

`const` exists for these names. Added in ES2015 alongside `let`, it declares a variable that:

- must be **initialised** in its declaration — `const x;` is not allowed;
- can never be **reassigned** — any later `x = …` throws a `TypeError`;
- is **block-scoped** and has a **temporal dead zone**, exactly like `let`.

The part that confuses almost everyone is what `const` does *not* do. It does not make the value immutable. A `const` array can still be pushed to, and a `const` object can still have its properties changed. `const` protects the *name*, not the *thing the name refers to*. Once that distinction is clear, `const` becomes the simplest and most useful declaration in the language.

## Before you start

- **Variables** — bindings versus values, and reassignment versus mutation. See [[b1-variables]]; the section on assignment is the foundation of this lesson.
- **`let`** — block scope and the temporal dead zone, which `const` shares. See [[b1-let]].
- **Primitive and reference types** — that numbers and strings are immutable while objects and arrays can change. See [[b1-primitive-vs-reference]].

## The intuition

Think of a `const` as a signpost bolted to the ground, pointing at a house. Bolting it down means it will always point at the same house — you cannot swing it towards a different one. But the signpost has no control over the house. People can repaint it, add rooms or move the furniture, and the signpost still points at it.

If the "house" is a primitive value — a number like `3.14` or a string like `'admin'` — it cannot be renovated at all, because primitives are immutable. So a `const` holding a primitive really is constant. If it is an object or array, only the pointing is fixed.

## What const forbids

A `const` binding forbids exactly one thing: writing a new value into the binding. Every way of doing that throws a `TypeError` at run time.

```javascript title="const-basics.js"
const PI = 3.14159;
const user = { role: 'guest' };
user.role = 'admin';          // mutating the object: allowed
const nums = [1, 2];
nums.push(3);                 // mutating the array: allowed
try {
  nums = [];                  // rebinding the name: not allowed
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
console.log(PI, user.role, nums);
```

```output
TypeError: Assignment to constant variable.
3.14159 admin [ 1, 2, 3 ]
```

`user.role = 'admin'` and `nums.push(3)` follow the binding to its object and change the object; the binding itself still points at the same object afterwards, so `const` has nothing to object to. `nums = []` tries to point the binding at a new array and throws.

Compound assignment and increment operators are reassignments too, because they write a new value into the binding:

```javascript title="const-writes.js"
const limit = 3;
function next() {
  console.log('right-hand side evaluated');
  return 4;
}
try { limit = next(); } catch (e) { console.log(e.name); }
try { limit++; } catch (e) { console.log(e.name); }
try { limit += 1; } catch (e) { console.log(e.name); }
console.log(limit);
```

```output
right-hand side evaluated
TypeError
TypeError
TypeError
3
```

Notice the first line of output: the right-hand side `next()` ran *before* the error. Assignment evaluates its value first and only fails when it tries to write. If the right-hand side has side effects — a network call, a counter increment — they still happen. Also note that the error is a run-time `TypeError`, not a SyntaxError: the code parses fine and fails only when the line executes. Many editors and TypeScript report it earlier, as a static check.

### const must be initialised

A `const` declaration without a value is rejected before the program runs:

```javascript
const apiUrl;
// SyntaxError: Missing initializer in const declaration
```

This follows from the definition. If a `const` could be declared empty and filled in later, that later filling would be an assignment, which `const` forbids. So its first value has to come with the declaration. When the value depends on a condition, compute it in one expression — a ternary, `??`, or a helper function:

```javascript
const label = isAdmin ? 'Administrator' : 'Member';
const timeout = options.timeout ?? 5000;
const discount = discountFor(customer);   // logic moved into a function
```

## What const does not protect: the value

Because `const` fixes only the binding, objects and arrays held in `const` variables are fully mutable. This is not a loophole; it is the intended design. `const` is about whether *this name* can be repointed, which is a property of the variable. Whether an object can change is a property of the object, controlled by different tools.

When you need the value itself to be read-only, use **`Object.freeze`**. It makes an object's existing properties read-only and prevents adding or removing properties:

```javascript title="freeze.js"
const config = Object.freeze({ api: { url: '/v1' }, retries: 3 });
config.retries = 5;           // ignored: config is frozen
config.api.url = '/v2';       // works: the nested object is not frozen
console.log(config.retries, config.api.url, Object.isFrozen(config), Object.isFrozen(config.api));
```

```output
3 /v2 true false
```

Two lessons are hidden in this output. First, the write to `config.retries` was **silently ignored** — this file runs in sloppy mode. In strict mode (ES modules, classes, or a `'use strict'` directive) the same write throws:

```javascript title="freeze-strict.js"
'use strict';
const config = Object.freeze({ retries: 3 });
try {
  config.retries = 5;
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
TypeError: Cannot assign to read only property 'retries' of object '#<Object>'
```

Second, `Object.freeze` is **shallow**. It froze `config`, but `config.api` is a separate object that was not frozen, so its `url` could still change. To freeze a whole structure you must freeze every nested object:

```javascript title="deep-freeze.js"
function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;                       // primitives and already-frozen objects
  }
  Object.freeze(value);                 // freeze first so cycles terminate
  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

const settings = deepFreeze({ theme: { colors: ['red', 'blue'] } });
try {
  settings.theme.colors.push('green');  // push tries to add index 2
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
console.log(settings.theme.colors);

// The usual way to "change" frozen data: build a new copy
const updated = {
  ...settings,
  theme: { ...settings.theme, colors: [...settings.theme.colors, 'green'] },
};
console.log(updated.theme.colors, settings.theme.colors);
```

```output
TypeError: Cannot add property 2, object is not extensible
[ 'red', 'blue' ]
[ 'red', 'blue', 'green' ] [ 'red', 'blue' ]
```

`push` throws even in sloppy mode, because array methods are specified to throw when they cannot write. The last two lines show the pattern that usually replaces mutation: create a new object with the change, leaving the original untouched. That style — never mutate, always copy — is the basis of state handling in React and Redux. See [[b1-object-freeze-seal]] for `freeze`, `seal` and `preventExtensions`, and [[b1-immutability-fp]] for the copying style.

In everyday code, most teams do not freeze objects; they rely on the convention of not mutating shared data, sometimes backed by TypeScript's compile-time `readonly` types. Freezing is most useful for shared constants and in tests that want to prove a function does not mutate its input.

## const in loops

Whether `const` works in a loop header depends on whether the loop reassigns its variable.

```javascript title="const-loops.js"
for (const letter of ['a', 'b']) console.log(letter);
for (const key in { width: 1, height: 2 }) console.log(key);
try {
  for (const i = 0; i < 3; i++) console.log('classic', i);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
a
b
width
height
classic 0
TypeError: Assignment to constant variable.
```

`for…of` and `for…in` create a **fresh binding for each iteration** and initialise it with the next value; nothing is ever reassigned, so `const` is fine and is the recommended choice. The classic three-part `for` loop also creates a binding per iteration, but its update expression `i++` *reassigns* the variable. The first iteration runs (printing `classic 0`); then `i++` tries to write to a `const` and throws. Use `let` in classic `for` loops. More on these loop forms in [[b1-for-of-in]] and [[b1-for-loops]].

## Scope and the temporal dead zone

Apart from initialisation and reassignment, `const` behaves exactly like `let`. It is scoped to the nearest block, it cannot be redeclared in the same scope, and its binding exists from the start of the block but is uninitialised until the declaration runs. Reading it earlier throws `ReferenceError: Cannot access '…' before initialization`. At the top level of a classic browser script, a `const` is a global variable but not a property of `window`. These shared rules are taught in [[b1-let]], [[b1-tdz]] and [[b1-var-let-const]]; there is nothing `const`-specific to add.

One consequence is worth spelling out. Because a `const` has to be initialised at its declaration, and cannot be read before it, a `const` is only ever observed holding one value. That is a strong guarantee: if you see `const total = …`, then everywhere `total` is successfully read, it means that value.

## How it works internally

In the specification, `const` creates an **immutable binding** in the block's declarative environment record, while `let` creates a mutable one. Both start uninitialised. Evaluating the declaration calls *InitializeBinding* once. Any later assignment calls *SetMutableBinding*, which, for an immutable binding, throws a `TypeError`. Since `const` bindings are always created as strict bindings, the throw happens in both strict and sloppy mode — unlike writes to frozen properties, which are silent in sloppy mode.

`Object.freeze` works at a different level entirely. It changes the object, not any variable: it marks every own property as non-writable and non-configurable, and marks the object non-extensible ([[b1-property-descriptors]]). This is why the two are independent: a `let` can hold a frozen object, and a `const` can hold a mutable one.

Do not expect `const` to make code faster. Engines can sometimes use the knowledge that a binding never changes, but modern engines already detect variables that are never reassigned, whatever keyword declared them. Choose `const` for readability and safety.

## In real systems

**"const by default" is enforced by tooling.** ESLint's `prefer-const` rule reports any `let` that is never reassigned. The Airbnb and Standard style guides, and the default configurations of most frameworks, enable it. As a result most declarations in modern codebases are `const`, and `let` stands out as a signal that a value changes.

**React renders are full of `const`.** `const [count, setCount] = useState(0)` declares two fresh `const` bindings on every render. You never reassign `count`; you call `setCount`, React schedules a new render, and the next render's `count` is a new `const` with the new value. A closure that captured an old render's `count` keeps seeing that old value — the root of the *stale closure* problem ([[b1-stale-closures]]).

**Module exports.** `export const API_URL = '/v1'` cannot be reassigned by anyone. Importers could not reassign it anyway — imported bindings are read-only ([[b1-live-bindings]]) — but `const` also stops the exporting module from changing it. If the export is an object, importers can still mutate it, which is why shared configuration objects are often frozen.

**Naming.** A common convention is `UPPER_SNAKE_CASE` for values that are fixed for the whole program and known in advance (`MAX_RETRIES`, `API_URL`), and ordinary `camelCase` for everything else, even when declared with `const` — a `const` holding a fetched user is still `user`, not `USER`. See [[b1-variable-naming]].

## Trade-offs and alternatives

| Tool | Protects | Level | When it fails |
|---|---|---|---|
| `const` | The binding | Variable | Always throws `TypeError` on reassignment |
| `Object.freeze` | Top-level properties | Object (shallow) | Throws in strict mode, silently ignored in sloppy mode |
| Deep freeze | Whole structure | Object graph | Same as freeze; costs a full traversal |
| TypeScript `readonly` / `as const` | Properties and literals | Compile time only | Type error at build; no run-time effect |
| Copy-on-write (spread, `structuredClone`) | Original data | Convention | Not enforced; relies on discipline |

The cost of `const` is small: you must have the value at the point of declaration, and you cannot use it for accumulators. Both limits push you towards code where values are computed once, which is usually easier to read. Use `let` when a binding genuinely needs reassignment; never use `var`.

## Common mistakes

> [!MISTAKE] Believing const freezes objects
> `const settings = {}` still allows `settings.theme = 'dark'`. If the object must not change, freeze it (remembering freeze is shallow) or never mutate it and create copies instead.

**Switching to `let` just to push into an array.** `const items = []; items.push(x);` is correct. Mutation does not need `let`; only reassignment does.

**`const` in a classic `for` loop.** `for (const i = 0; i < n; i++)` runs the first iteration, then throws on `i++`. Use `let i`, or `for (const x of items)` when you only need the elements.

**Declaring `const` without a value to fill in later.** `const result;` is a SyntaxError. Compute the value in the declaration, or move the logic into a function.

**Relying on freeze in sloppy code.** Writes to a frozen object are silently ignored outside strict mode, so a bug can go unnoticed. Use modules (strict by default) so such writes throw.

## Interview perspective

> [!INTERVIEW] "Can you change a const array?"
> "You can change its contents — `push`, `pop`, assigning to an index — because those mutate the array object, and `const` only fixes the binding. What you can't do is assign a new array to the name; that throws `TypeError: Assignment to constant variable.` If I need the array itself to be read-only I'd `Object.freeze` it, keeping in mind that freeze is shallow."

Other questions:

- **What is the difference between `const` and `Object.freeze`?** `const` makes a *variable* non-reassignable; `freeze` makes an *object's* properties non-writable. They are independent and can be combined.
- **Why does `for (const x of arr)` work but `for (const i = 0; i < n; i++)` fail?** `for…of` initialises a new binding each iteration; the classic loop's `i++` reassigns.
- **Is `const` hoisted?** Yes, like `let`: created at block entry, in the TDZ until its declaration runs.
- **When is a `const` truly constant?** When it holds a primitive, or an object that is deeply frozen.

## Practice

1. For each line, say whether it throws, and with which error: `const a = [];` then `a.push(1);`, `a[0] = 2;`, `a.length = 0;`, `a = [1];`.

2. This code is meant to keep `DEFAULTS` unchanged. Explain why it fails and fix it in two different ways:

   ```javascript
   const DEFAULTS = { theme: 'light', layout: { sidebar: true } };
   function withDark(options) {
     options.theme = 'dark';
     return options;
   }
   const mine = withDark(DEFAULTS);
   console.log(DEFAULTS.theme);   // expected 'light'
   ```

3. Rewrite this so `discount` can be a `const`:

   ```javascript
   let discount = 0;
   if (user.isMember) discount = 0.1;
   if (user.isMember && cart.total > 100) discount = 0.15;
   ```

4. Write `deepFreeze` yourself without looking, then show that it handles an object that refers to itself (`obj.self = obj`).

```quiz
Q: Which line throws? `const list = [1, 2];`
- [ ] `list.push(3);`
- [ ] `list[0] = 9;`
- [ ] `list.length = 0;`
- [x] `list = [3];`
> The first three lines change the array object, which const allows. Only `list = [3]` tries to make the binding refer to a different array, which throws TypeError: Assignment to constant variable.

Q: After `const cfg = Object.freeze({ db: { host: 'a' } }); cfg.db.host = 'b';`, what is `cfg.db.host`?
- [ ] 'a', because cfg is frozen
- [x] 'b', because Object.freeze is shallow
- [ ] It throws a TypeError in every mode
- [ ] undefined
> Object.freeze only freezes cfg's own properties. cfg.db still refers to the same inner object, and that object was never frozen, so its host property can change. To protect nested objects you have to freeze them too.

Q: What happens with `for (const i = 0; i < 3; i++) console.log(i);`?
- [ ] SyntaxError before anything runs
- [ ] It logs 0, 1, 2
- [x] It logs 0, then throws TypeError when i++ runs
- [ ] It loops forever logging 0
> const is allowed in the header, so the code parses and the first iteration runs. The update expression i++ then tries to reassign the const binding, which throws at run time. for...of loops work with const because they create a new binding per iteration instead of reassigning.

Q: Why must `const` be initialised in its declaration?
- [ ] For performance, so the engine can allocate memory
- [x] Because any later "first value" would be an assignment, and const forbids assignment
- [ ] Because const values are stored on the global object
- [ ] It doesn't; `const x;` defaults to undefined
> The only way to give a binding a value after its declaration is assignment, and assignment to a const always throws. So the language requires the initialiser in the declaration and makes `const x;` a SyntaxError.
```

## Quick revision {#quick-revision}

- `const` = block-scoped binding that **must be initialised** and **cannot be reassigned** (ES2015).
- Reassignment (`=`, `+=`, `++`, `??=`) → run-time `TypeError: Assignment to constant variable.`; the right-hand side is evaluated first.
- `const x;` → early `SyntaxError: Missing initializer in const declaration`.
- `const` does **not** freeze values: objects and arrays stay mutable.
- `Object.freeze` makes an object's own properties read-only; it is **shallow**; failed writes throw in strict mode and are silently ignored in sloppy mode.
- `for…of` / `for…in` with `const`: fine (new binding per iteration). Classic `for` with `const`: throws on the update.
- Shares with `let`: block scope, TDZ, no redeclaration, not on `window` at top level.
- Default to `const`; use `let` only for reassignment; `prefer-const` enforces it.

| Operation on `const obj = {}` | Result |
|---|---|
| `obj.x = 1` | Allowed (mutation) |
| `delete obj.x` | Allowed (mutation) |
| `obj = {}` | `TypeError` |
| `Object.freeze(obj); obj.x = 2` | Ignored (sloppy) / `TypeError` (strict) |

## Key takeaways {#key-takeaways}

- `const` fixes which value a name refers to; it says nothing about whether that value can change.
- With primitives, a `const` is truly constant; with objects, use freezing or a no-mutation style if the contents must stay fixed.
- A `const` is only ever observed holding one value, which makes code easier to reason about.
- `const` works in `for…of` and `for…in` loops but not with a classic loop counter.
- Use `const` for every binding that is not reassigned; seeing `let` should mean the value changes.
