---
summary: let declares a variable that can be reassigned but lives only inside the block where it is written. You will learn how block scope, the temporal dead zone and per-iteration loop bindings make let safer than var, and when let is the right choice over const.
difficulty: beginner
minutes: 35
objectives:
  - Explain block scope and predict where a let binding is visible
  - Explain why let is hoisted yet throws when read before its declaration
  - Trace how for (let …) creates a new binding per iteration and why that fixes loop closures
  - Avoid the switch-statement and single-statement pitfalls specific to let
  - Choose between let and const for a given variable
---

## Introduction

`let` was added in ES2015 (also called ES6) to fix the problems of `var`. It declares a variable you can reassign — a counter, an accumulator, a value that changes as a loop runs — but with three rules that match what most programmers expect:

- It is **block-scoped**: it exists only inside the nearest pair of curly braces.
- It cannot be used **before its declaration** runs; trying to do so throws an error instead of quietly giving `undefined`.
- It cannot be **declared twice** in the same scope.

A fourth property is what made `let` famous: in a `for` loop, each iteration gets its own copy of the loop variable, which removes the most common closure bug in JavaScript.

`let` is the "mutable" half of the ES2015 design. Its sibling [[b1-const]] is the same in every respect except that its binding cannot be reassigned. In modern code you use `const` by default and `let` when a variable genuinely needs to change, so understanding `let` is mostly understanding block scope and the temporal dead zone, which `const` shares.

## Before you start

- **Variables** — the difference between declaring, initialising and assigning a binding. See [[b1-variables]].
- **`var`** — how function scope and hoisting to `undefined` work, since `let` is defined largely by how it differs. See [[b1-var]].
- **Closures (basic idea)** — a function can use variables from the scope where it was created, even after that scope has finished. See [[b1-closures]]; the overview here is enough to follow the loop section.

## The intuition

Picture each block `{ }` as a small office with its own nameplates on the door. A `let` puts a nameplate on the door of the office it is written in. Code inside that office, and in offices nested inside it, can see the nameplate. Code outside cannot. When execution leaves the office, the nameplate comes off — unless a function created inside kept a key (a closure), in which case the variable lives on for that function.

One more detail: the nameplate goes up the moment you walk into the office, but it is covered until the `let` line runs. Touching it while covered is an error. That is the temporal dead zone.

## Block scope

A `let` belongs to the nearest enclosing **block**: the body of an `if`, `else`, `for`, `while`, `do`, `try`, `catch`, `finally`, a `switch`, or a bare `{ }`. Outside that block the name does not exist (or refers to some outer variable with the same name).

```javascript title="block-scope.js"
let n = 0;
n += 1;              // let can be reassigned
{
  let n = 99;        // a different variable, only inside this block
  console.log('inner', n);
}
console.log('outer', n);
```

```output
inner 99
outer 1
```

The inner `let n` creates a second, separate variable that **shadows** the outer one inside the block ([[b1-shadowing]]). When the block ends, the outer `n` is visible again, unchanged.

Block scope means you can keep a variable as close as possible to where it is used. A variable that is only needed inside a loop body should be declared inside the loop body, so it cannot be misused afterwards:

```javascript title="loop-body.js"
let attempts = 0;
while (attempts < 3) {
  let message = `attempt ${attempts + 1}`;   // a new message on every pass
  attempts++;
  console.log(message);
}
console.log(attempts);
try {
  console.log(message);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
attempt 1
attempt 2
attempt 3
3
ReferenceError: message is not defined
```

`attempts` must survive between iterations and be read after the loop, so it is declared outside. `message` is needed only inside one pass, so it is declared inside, and reading it after the loop is an error — a helpful one, because with `var` it would have silently held `'attempt 3'`.

### When let is the right keyword

Use `let` exactly when the binding has to be **reassigned**: counters, running totals, a "found" flag that is set inside a loop, a value assigned in different branches. Here `found` starts as `null` and is set when a match appears:

```javascript title="find-user.js"
function findUser(users, id) {
  let found = null;                 // reassigned below, so let
  for (const user of users) {       // never reassigned within an iteration, so const
    if (user.id === id) {
      found = user;
      break;
    }
  }
  return found;
}
console.log(findUser([{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }], 2));
console.log(findUser([], 7));
```

```output
{ id: 2, name: 'Linus' }
null
```

If a variable is never reassigned, use `const` instead; that tells readers it will not change and lets the linter rule `prefer-const` hold you to it. (In this example, `users.find((u) => u.id === id) ?? null` would avoid the `let` entirely, which is often the cleanest outcome.)

## Hoisted, but not usable early: the temporal dead zone

People often say "`let` is not hoisted". That is wrong, and the difference matters. A `let` binding *is* created when its block is entered — before any line of the block runs — but it is left **uninitialised** until execution reaches the `let` line. Any read or write before then throws a `ReferenceError`. That window is called the **temporal dead zone (TDZ)**.

```javascript title="let-tdz.js"
const x = 'outer';
{
  try {
    console.log(x);        // the inner x already exists, so this does not see 'outer'
  } catch (e) {
    console.log(e.name + ': ' + e.message);
  }
  const x = 'inner';
  console.log(x);
}
```

```output
ReferenceError: Cannot access 'x' before initialization
inner
```

The example uses `const`, which behaves identically here. If the inner declaration did not exist until its line, the first `console.log` would find the outer `x` and print `'outer'`. It throws instead, which proves the inner binding existed from the opening brace and was hiding the outer one. The TDZ has its own lesson, [[b1-tdz]], covering `typeof`, default parameters, classes and modules.

Why design it this way rather than giving `undefined` like `var`? Two reasons. First, a name inside a block should mean the same variable on every line of that block; shadowing that started halfway through would be confusing. Second, reading a variable before it is set is almost always a bug, and an immediate error at the faulty line is far easier to debug than an `undefined` that turns into `NaN` three functions later.

When the `let` line runs without a value — `let total;` — the binding is initialised to `undefined`. From then on it is an ordinary variable.

## let in loops: a fresh binding per iteration

The rule that made `let` famous is about `for` loops. When the loop header declares its variable with `let`, the loop does not reuse one variable for all iterations. It creates a **new binding for every iteration**, copying in the current value before applying the update expression.

```javascript title="per-iteration.js"
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);       // each arrow function closes over this iteration's i
}
console.log(fns.map((f) => f()));
```

```output
[ 0, 1, 2 ]
```

Each arrow function closes over the `i` of its own iteration, so the three functions return `0`, `1` and `2`. With `var i`, there would be one binding shared by all three, and they would all return `3`. This is why the `setTimeout`-in-a-loop puzzle is solved by changing one keyword; the details and the older workarounds are in [[b1-closures-in-loops]] and [[b1-var-loop-problem]].

The per-iteration behaviour belongs to the `for (let …)` header specifically. A `while` loop does not create one, because its variable is declared outside the loop:

```javascript title="while-closures.js"
const handlers = [];
let i = 0;
while (i < 3) {
  handlers.push(() => i);     // all three share the single outer i
  i++;
}
console.log(handlers.map((h) => h()));

const handlers2 = [];
let k = 0;
while (k < 3) {
  const current = k;          // declared inside the body: new binding each pass
  handlers2.push(() => current);
  k++;
}
console.log(handlers2.map((h) => h()));
```

```output
[ 3, 3, 3 ]
[ 0, 1, 2 ]
```

The general rule is: **a block creates new bindings each time it is entered.** A `while` body is entered once per iteration, so a `let` or `const` declared *inside* it is fresh every time. The `i` declared outside is not. `for…of` and `for…in` also create a fresh binding per iteration, which is why `for (const item of items)` works even though `item` gets a different value each time.

Does creating a binding per iteration cost performance? In principle the engine must allocate a new environment when a closure captures the variable. In practice engines like V8 avoid that work when no closure captures it, so a plain counting loop with `let` is as fast as with `var`.

## No redeclaration in the same scope

Two `let` declarations of the same name in one scope — or a `let` and a `var`, a parameter, a function declaration or a `class` of the same name — are an early SyntaxError. The whole file fails to run:

```javascript
let total = 0;
let total = 1;   // SyntaxError: Identifier 'total' has already been declared
```

This catches copy-paste mistakes that `var` would hide. Declaring the same name in an *inner* block is shadowing, not redeclaration, and is allowed. The full rules are under Redeclaration in [[b1-variables]].

## Pitfalls specific to let

### switch cases share one block

A `switch` statement has a single block for all its cases. `case` labels are just jump targets inside that block, not separate scopes. A `let` in one case is therefore visible — but possibly uninitialised — in the others:

```javascript title="switch-tdz.js"
function describe(action) {
  switch (action) {
    case 'save':
      let msg = 'Saving';
      return msg;
    case 'load':
      msg = 'Loading';    // same msg as above, but its let line never ran
      return msg;
  }
}
console.log(describe('save'));
try {
  console.log(describe('load'));
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
Saving
ReferenceError: Cannot access 'msg' before initialization
```

For `'load'`, execution jumps straight to the second case, skipping the `let` line, so `msg` is still in its dead zone. Writing `let msg` again in the second case would instead be a SyntaxError (redeclaration). The fix is to give each case its own block:

```javascript
switch (action) {
  case 'save': {
    const msg = 'Saving';
    return msg;
  }
  case 'load': {
    const msg = 'Loading';
    return msg;
  }
}
```

See [[b1-switch]] for more on `switch`.

### A let cannot be the whole body of an if

`if (ready) let status = 'ok';` is a SyntaxError ("Lexical declaration cannot appear in a single-statement context"). The variable would live in a scope containing nothing else, so it could never be used. Add braces.

### Top-level let is global but not on window

At the top level of a classic browser script, `let user = …` creates a global variable that every other classic script on the page can read. It does not create `window.user`. Two classic scripts that both declare `let user` at top level collide: the second script fails with a SyntaxError and does not run. In an ES module, a top-level `let` is private to the module. See [[b1-global-scope-vars]] under [[b1-var-let-const]].

### let is not a reserved word everywhere

For backward compatibility, sloppy-mode code may still use `let` as a variable name: `var let = 1;` runs. In strict mode it is a SyntaxError. You should never do this; it is mentioned only so the error message makes sense if you meet it in old code.

## How it works internally

When execution enters a block that contains lexical declarations, the engine creates a new **declarative environment record** for that block, links it to the current environment as its parent, and makes it the current **LexicalEnvironment**. It then creates an uninitialised binding for each `let`, `const` and `class` in the block (and, in strict code, for each function declaration). Evaluating a `let` line initialises its binding. When the block finishes, the previous environment is restored. The block's record is then unreachable, and its memory can be reclaimed — unless a closure created inside still references it ([[b1-lexical-environment]], [[b1-garbage-collection]]).

For `for (let i = …; …; …)`, the specification goes further: after each iteration it creates a fresh environment, copies the current values of the loop variables into it, and only then runs the update expression (`i++`) in the new environment. That copy-then-update order is why each closure sees the value from its own iteration.

Engines optimise heavily. A `let` that no closure captures typically lives in a register or stack slot, with no environment object at all, and the TDZ check is removed when the compiler can prove the variable is always initialised before use.

## In real systems

**`prefer-const` makes `let` a signal.** Because modern linters convert every never-reassigned `let` to `const`, seeing `let` in a well-maintained codebase tells you the variable *will* change. That makes `let` declarations the places to look when tracking down how a value evolved.

**Event handlers in loops.** UI code that attaches listeners in a loop — `for (let i = 0; i < buttons.length; i++) buttons[i].addEventListener('click', () => select(i))` — relies on per-iteration bindings. With `var`, every button would select the last index.

**React components rarely need `let`.** Component state lives in `useState`, and derived values are recomputed on each render, so most bindings in a component are `const`. A `let` inside a component body is often a sign that state is being stored in a plain variable, which resets on every render.

## Trade-offs and alternatives

| Choose | When |
|---|---|
| `const` | The binding is never reassigned — the default for most variables |
| `let` | The binding must be reassigned: counters, accumulators, values set in branches or loops |
| `var` | Never in new code; only when editing legacy code in its own style |

Often a `let` can be replaced by an expression. A running total can be `reduce`; a value set in branches can be a ternary or a small helper function; a "found" flag can be `find`. Prefer that when it reads naturally, but do not force it: a clear loop with one `let` is better than a clever chain no one can follow.

## Common mistakes

> [!MISTAKE] "let is not hoisted"
> It is hoisted to the top of its block — that is why an inner `let` shadows an outer variable from the very first line of the block. It is *uninitialised* until its declaration runs, so early access throws instead of returning `undefined`.

**Declaring inside a block, using after it.** `if (ok) { let result = 1; } return result;` throws `ReferenceError: result is not defined`. Declare `let result;` before the `if` and assign inside.

**Using `let` for everything.** If a binding is never reassigned, `let` hides that fact from readers. Use `const`, and let `prefer-const` find the cases you miss.

**Expecting `while` loops to behave like `for (let …)`.** Closures in a `while` loop share the variable declared outside it. Copy the value into a `const` inside the body.

**`let` in several `switch` cases.** Either a redeclaration error or a TDZ error. Wrap each case body in braces.

## Interview perspective

> [!INTERVIEW] "Explain how for (let i…) fixes the setTimeout loop."
> "With `var` there's one `i` for the whole function, and every callback closes over it, so by the time the timers fire they all see the final value. With `let` in the loop header, the spec creates a new binding for every iteration and copies the current value into it before the increment. Each callback closes over its own iteration's binding, so they log 0, 1, 2."

Other questions to be ready for:

- **Is `let` hoisted?** Yes, to the top of its block, but uninitialised until its line runs (TDZ). Demonstrate with shadowing.
- **Is `let` visible as `window.x` at the top level?** No; it lives in the global declarative record, not on the global object.
- **What is printed by `let x = 1; { console.log(x); let x = 2; }`?** A `ReferenceError` — the inner `x` shadows from the start of the block and is in its TDZ.
- **When would you choose `let` over `const`?** Only when the binding must be reassigned. Mutating an object does not require `let`.

## Practice

1. Predict the output:

   ```javascript
   let a = 'A';
   if (true) {
     let a = 'B';
     a += '!';
     console.log(a);
   }
   console.log(a);
   ```

2. Fix this so each button logs its own index, without changing `let i` to anything else:

   ```javascript
   const logs = [];
   let i = 0;
   while (i < 3) { logs.push(() => console.log(i)); i++; }
   logs.forEach((f) => f());
   ```

3. Rewrite this `switch` so it runs correctly for every action:

   ```javascript
   function label(kind) {
     switch (kind) {
       case 'a': let text = 'Alpha'; return text;
       case 'b': text = 'Beta'; return text;
     }
   }
   ```

4. Replace the `let` in this function with an expression so every binding is `const`:

   ```javascript
   function total(prices) {
     let sum = 0;
     for (const p of prices) sum += p;
     return sum;
   }
   ```

```quiz
Q: What does this print? `const fns = []; for (let i = 0; i < 3; i++) fns.push(() => i); console.log(fns[0]());`
- [x] 0
- [ ] 3
- [ ] undefined
- [ ] It throws a ReferenceError
> A for loop with let in its header creates a new binding of i for each iteration. The first function closes over the first iteration's binding, which holds 0. With var, all functions would share one i, and fns[0]() would return 3.

Q: What happens with `let x = 1; { console.log(x); let x = 2; }`?
- [ ] It prints 1
- [ ] It prints 2
- [ ] It prints undefined
- [x] It throws ReferenceError: Cannot access 'x' before initialization
> The inner let x is created when the block is entered, so it shadows the outer x from the first line of the block. It is uninitialised until its declaration runs, so reading it first throws. This is the clearest proof that let is hoisted.

Q: Why does using `let msg` in one `case` and assigning `msg` in another `case` throw when the second case runs?
- [ ] Each case has its own scope, so msg is undefined there
- [x] All cases share one block, and jumping to the second case skips the let line, leaving msg in its dead zone
- [ ] switch statements do not allow let at all
- [ ] Assigning to a let is not allowed after a break
> case labels are jump targets inside a single switch block. msg exists for the whole block, but its declaration only runs if execution passes through the first case. Wrapping each case body in braces gives each its own scope.

Q: Which variable should be declared with `let` rather than `const`?
- [ ] An array you will push items into
- [ ] An object whose properties you will update
- [x] A counter you increment with `count++`
- [ ] A function assigned once to a name
> Only reassignment requires let. count++ writes a new number into the binding. Pushing into an array or updating object properties mutates the value but leaves the binding pointing at the same object, which const allows.
```

## Quick revision {#quick-revision}

- `let` declares a **reassignable**, **block-scoped** binding (ES2015).
- Block = any `{ }`: `if`, loops, `try`/`catch`, `switch`, bare blocks. Outside it the name does not exist.
- **Hoisted but uninitialised**: created at block entry, unusable until its line (TDZ) → `ReferenceError`.
- `let x;` initialises to `undefined` when the line runs.
- `for (let i …)` creates a **new binding per iteration** (copy, then update), fixing loop closures. `for…of`/`for…in` also bind per iteration; `while` does not, unless you declare inside the body.
- No redeclaration in the same scope (with `let`, `var`, `const`, `class`, parameters); shadowing in inner blocks is fine.
- `switch` cases share one block — wrap case bodies in `{ }`.
- Top-level `let` in a classic script: global, shared across classic scripts, **not** on `window`.
- Use `let` only for bindings that are reassigned; otherwise `const`.

## Key takeaways {#key-takeaways}

- `let` is a mutable variable whose life is limited to its block, which keeps variables close to where they are used.
- It is hoisted to the top of the block but cannot be touched until its declaration runs; that error is a feature that exposes ordering bugs.
- A fresh binding per loop iteration is what makes closures in `for (let …)` loops behave as expected.
- Duplicate declarations fail loudly instead of silently sharing a variable.
- In modern code, `let` should appear only where a value really changes; everything else is `const`.
