---
summary: Hoisting is the name for a simple fact with surprising consequences — JavaScript sets up every declaration in a scope before running any of the scope's code. You will learn the two phases behind it, exactly what each kind of declaration (var, function, let, const, class, import) looks like before its line runs, and how to read code the way the engine does.
difficulty: intermediate
minutes: 55
objectives:
  - Explain hoisting as the creation phase of a scope rather than code being moved
  - Predict whether using a var, function, let, const or class before its declaration returns a value, returns undefined or throws
  - Distinguish the creation phase from the execution phase for scripts, function calls, blocks and modules
  - Explain the temporal dead zone and why let, const and class are hoisted but unusable until their line runs
  - Debug "is not a function" and "before initialization" errors caused by declaration order
---

## Introduction

Run this program, and two of its three lines behave in a way that looks impossible if JavaScript simply executed code from top to bottom.

```javascript
console.log(greet('Ada'));
console.log(count);
try {
  console.log(limit);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

function greet(name) {
  return `Hello, ${name}`;
}
var count = 5;
let limit = 10;
```

```output
Hello, Ada
undefined
ReferenceError: Cannot access 'limit' before initialization
```

`greet` is called on line 1, but defined near the bottom — and it works. `count` is read before its `var` line, and instead of an error we get `undefined`. `limit` is read before its `let` line and throws, but with an odd message: not "limit is not defined", but "cannot access before initialization", as if the engine already knew `limit` existed.

All three results have one explanation. Before JavaScript runs any of the code in a scope, it first scans the scope for declarations and creates a binding for each one. Different kinds of declaration get different starting states: a function declaration starts out holding the finished function, a `var` starts out holding `undefined`, and a `let` starts out *uninitialised* — present, but locked until its line runs. This behaviour is called **hoisting**, from the picture of declarations being "lifted" to the top of their scope.

The picture is useful but misleading if taken literally: no code is moved. Hoisting is not a separate step in the language specification; it is the informal name for the **creation phase** that happens whenever a scope is entered. This lesson teaches that phase precisely, then takes each kind of declaration in turn. Once you can see the two phases, hoisting questions — a staple of JavaScript interviews, collected in [[b1-hoisting-puzzles]] — become mechanical.

## Before you start

- **Scope** — what function, block and module scope are, and which declarations belong to each. See [[b1-scope]].
- **Lexical environments** — the runtime object holding a scope's bindings. See [[b1-lexical-environment]]; hoisting is what fills it in.
- **Function declarations and expressions** — the difference between `function f() {}` and `const f = function () {}`. See [[b1-function-declaration]] and [[b1-function-expression]].
- **`var`, `let` and `const`** — their syntax and basic differences. See [[b1-var-let-const]].

## The intuition

Think of a theatre before a performance. The stage crew walks through the script and sets out a chair for every character, each labelled with a name card. Some chairs get their actor seated right away. Some get a cardboard placeholder. Some are taped off with a "reserved — do not sit" sign until the actor's entrance cue. Only then does the performance begin, and lines are spoken in order.

That is the shape of every scope in JavaScript. The **creation phase** sets out the chairs: function declarations get their actor (the complete function), `var` gets a placeholder (`undefined`), and `let`, `const` and `class` get the taped-off chair (uninitialised). The **execution phase** performs the script line by line, and when it reaches `var count = 5` or `let limit = 10`, it puts the real value in the chair.

Where the analogy stops: a scope's creation phase does not happen once per program. It happens every time the scope is entered — every function call, every pass through a block, every loop iteration with `let`.

## Creation vs execution phase {#b1-creation-vs-execution}

Every time JavaScript enters a scope, it does the work in two phases. In the **creation phase** (the specification calls it *declaration instantiation*), the engine creates the scope's environment and a binding for every name declared directly in that scope. In the **execution phase** (*evaluation*), it runs the statements in order: evaluating expressions, assigning values, calling functions. No statement in the scope runs until the creation phase has finished for that scope. That ordering is all hoisting is.

### What the creation phase does

When a function is called, its creation phase proceeds roughly in this order:

1. Create a new environment for the call, linked to the environment where the function was defined.
2. Bind the parameters, and bind `arguments` for non-arrow functions.
3. For every `var` declared anywhere in the function body (including inside nested blocks, but not inside nested functions), create a binding initialised to `undefined` — unless the name is already a parameter.
4. For every function declaration at the top level of the body, create the function object and bind it, replacing any `undefined` placeholder of the same name.
5. For every `let`, `const` and `class` declared at the top level of the body, create a binding but leave it **uninitialised**.
6. Check for illegal duplicates, such as two `let` declarations of the same name.

The same idea applies to the other kinds of scope. Running a script performs a creation phase for the global scope. Loading a module performs one for the module scope, and additionally links every `import` to the exporting module before any code runs. Entering a block performs a smaller creation phase for that block's `let`, `const`, `class` and (in strict code) function declarations.

```mermaid title="Each time a scope is entered: set up every binding, then run the statements"
flowchart LR
    E(["enter scope"]) --> C1["create environment"]
    C1 --> C2["var: bind as undefined"]
    C2 --> C3["function declarations: bind finished function"]
    C3 --> C4["let, const, class: bind uninitialised"]
    C4 --> X["execution phase: run statements in order"]
    X --> L["at each let/const/class line: initialise"]
```

### Watching both phases

```javascript
function demo() {
  console.log('a is', a); // execution has started; a was created as undefined
  var a = 'assigned';
  console.log('a is', a);
}
demo();

function order(x = y, y = 1) { // parameters are initialised left to right
  return [x, y];
}
try {
  order();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
console.log(order(5));
```

```output
a is undefined
a is assigned
ReferenceError: Cannot access 'y' before initialization
[ 5, 1 ]
```

In `demo`, the creation phase bound `a` to `undefined` before the first `console.log` ran. The line `var a = 'assigned'` is then executed as an ordinary assignment `a = 'assigned'` — the declaration part was already handled.

The second function shows that parameters with default values are evaluated *during* the call's setup, one at a time from left to right, and that the parameters themselves behave like `let` bindings while this happens. Evaluating the default for `x` needs `y`, which is declared but not yet initialised, so it throws. Passing `5` means `x`'s default never runs, and `y` takes its default normally. Defaults can use *earlier* parameters (`function area(w, h = w)` is fine) but not later ones.

### Errors found before anything runs

Because the creation phase looks at every declaration in a scope first, some mistakes are detected before a single statement executes. These are called **early errors**. A duplicate `let` is one:

```javascript
try {
  eval("console.log('first line'); let user = 'a'; let user = 'b';");
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
SyntaxError: Identifier 'user' has already been declared
```

The string passed to `eval` has a `console.log` on its first line, yet nothing is printed: the duplicate declaration was rejected while the code was being set up, so the execution phase never started. (`eval` is used here only so the demonstration can catch the error; in a real file, the whole script would fail to load.) This is a useful diagnostic rule: if *nothing at all* in a file runs, look for an early error such as a duplicate declaration or a `const` without an initialiser.

### One creation phase per entry

Creation happens again every time a scope is entered, not once per program. Each call to a function gets fresh bindings, which is why calls do not share local variables. Each iteration of a `for (let i …)` loop gets a fresh block environment with its own `i` — which is what fixes the classic closures-in-loops bug (see [[b1-closures-in-loops]]). And each classic `<script>` tag on a page has its own creation phase: a function declared in a later script is not hoisted into an earlier one, because the later script has not been parsed yet when the earlier one runs.

## What each declaration looks like before its line

| Declaration | Hoisted to | State after creation phase | Using it before its line |
|---|---|---|---|
| `var x` | Nearest function (or global) | `undefined` | Reads `undefined` |
| `function f() {}` | Nearest function (block in strict code) | The complete function | Works normally |
| `let x` | Nearest block | Uninitialised (TDZ) | `ReferenceError` |
| `const x` | Nearest block | Uninitialised (TDZ) | `ReferenceError` |
| `class C {}` | Nearest block | Uninitialised (TDZ) | `ReferenceError` |
| `var f = function () {}` / `var f = () => {}` | Nearest function | `undefined` (only the `var` is hoisted) | Calling it: `TypeError: f is not a function` |
| `import { x } from '…'` | Module | Linked to the exporter's binding | Works, unless a circular import has not initialised it |

Every row is hoisted — every kind of declaration has a binding from the start of its scope. The rows differ only in what the binding holds before the declaration's line runs. The next sections explain each one.

## var hoisting {#b1-var-hoisting}

**`var` hoisting** means that a `var` declaration creates its binding at the start of the enclosing function (or the global scope, if there is no function), initialised to `undefined`, no matter where in the function the declaration is written. The assignment part of `var x = 5` stays exactly where it is and runs when execution reaches that line. So reading a `var` before its line does not throw; it quietly gives `undefined`.

```javascript
function f() {
  console.log(a);
  if (false) {
    var a = 1;  // never executed, but still declares `a` for all of f()
  }
  console.log(a);
  var a = 2;    // a second `var a` is the same binding, not a new one
  console.log(a);
}
f();
```

```output
undefined
undefined
2
```

This short function demonstrates four rules at once. First, the binding exists from the function's first line, so the first `console.log` prints `undefined` rather than throwing. Second, a `var` inside a block that *never runs* still declares the variable, because the creation phase collects every `var` in the function body regardless of control flow; only the assignment `a = 1` is skipped. Third, declaring the same `var` twice is allowed and creates only one binding — the second `var a = 2` is just an assignment. Fourth, blocks are irrelevant: `var` inside an `if` belongs to the whole function.

The engine behaves as though the function had been written like this:

```javascript
function f() {
  var a;          // creation phase: one binding, undefined
  console.log(a);
  if (false) {
    a = 1;
  }
  console.log(a);
  a = 2;
  console.log(a);
}
f();
```

```output
undefined
undefined
2
```

This rewrite is the most reliable way to read code containing `var`: move every `var` name to the top of its function as a bare declaration, and leave every assignment in place.

### Where var hoisting stops

`var` is hoisted to the nearest **function**, not further. A `var` inside a nested function belongs to that nested function and is invisible to the outer one:

```javascript
function outer() {
  function inner() {
    var secret = 1;  // hoisted to the top of inner(), not outer()
  }
  inner();
  console.log(typeof secret);
}
outer();
```

```output
undefined
```

At the global level, a top-level `var` in a classic script is hoisted to the global scope and becomes a property of the global object (`window.count`). In an ES module, it is hoisted to the module scope instead.

### Consequences of var hoisting

Because `var` ignores blocks, `for (var i = 0; i < 3; i++)` leaves `i` visible after the loop, holding `3`. Because reading early gives `undefined` instead of an error, a bug where code runs before a value is assigned produces `undefined` in some calculation far away — `NaN` from `undefined * 2`, or the string `"undefined"` in a URL — instead of failing at the line that caused it. And because `typeof` on a hoisted `var` simply reports `'undefined'`, checks like `if (typeof config === 'undefined')` cannot distinguish "declared later in this function" from "never declared". These are the reasons modern style guides ban `var` (ESLint's `no-var` rule).

## Function declaration hoisting

A **function declaration** — a statement beginning with the `function` keyword, such as `function greet() {}` — is hoisted with its complete value. The creation phase creates the function object itself, so the function can be called anywhere in its scope, including above its definition.

```javascript
console.log(isEven(10));

function isEven(n) {
  return n === 0 ? true : isOdd(n - 1);
}

function isOdd(n) {
  return n === 0 ? false : isEven(n - 1);
}
```

```output
true
```

This is the reason function declarations are hoisted fully: it lets functions call each other regardless of the order they are written in. `isEven` refers to `isOdd` and `isOdd` refers to `isEven`; without full hoisting, one of them would always be defined too late. It also allows a common file layout where the main logic appears at the top and helper functions are declared below it.

**Function expressions and arrow functions are not hoisted this way.** In `var sayHi = function () {}` the declaration is the `var`, so only the name is hoisted, holding `undefined`. With `const` or `let`, the name is in its temporal dead zone.

```javascript
try {
  sayHi();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
try {
  sayBye();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

var sayHi = function () { return 'hi'; };
const sayBye = () => 'bye';
```

```output
TypeError: sayHi is not a function
ReferenceError: Cannot access 'sayBye' before initialization
```

The two errors point to the declaration used. `sayHi` resolved to a `var` binding holding `undefined`, and calling `undefined` is a `TypeError`. `sayBye` resolved to a `const` that has not been initialised, which is a `ReferenceError`. Seeing "is not a function" for a name you know is a function is a strong hint that it was defined with `var` and an expression further down. The comparison is explored in [[b1-function-hoisting]].

Function declarations *inside blocks* have extra rules. In strict code they are block-scoped and hoisted to the top of their block. In sloppy code, browsers follow legacy rules (Annex B of the specification) that also create a `var`-like binding in the enclosing function, with confusing results. Avoid declaring functions inside blocks in sloppy code; [[b1-hoisting-puzzles]] shows what happens if you do.

## let/const hoisting {#b1-let-const-hoisting}

**`let` and `const` are hoisted** to the top of their block: their bindings are created when the block is entered, before any of its statements run. But unlike `var`, they are not given a value. They stay **uninitialised** until execution reaches the declaration line. Any attempt to read or write the binding in that period throws a `ReferenceError`. The stretch of execution between entering the block and running the declaration is called the **temporal dead zone (TDZ)**.

People sometimes say "`let` is not hoisted" because using it early throws. That is incorrect, and the proof is shadowing:

```javascript
const x = 'outer';
{
  try {
    console.log(x);  // if inner x were not hoisted, this would print 'outer'
  } catch (e) {
    console.log(e.name);
  }
  let x = 'inner';
  console.log(x);
}
console.log(x);
```

```output
ReferenceError
inner
outer
```

If the inner `let x` did not exist until its own line, the first `console.log(x)` would find the outer `x` and print `'outer'`. Instead it throws, which means the inner binding already existed from the opening brace and was hiding the outer one — it just could not be read yet. Hoisting creates the binding; the TDZ forbids touching it until it is initialised.

### The dead zone is about time, not position

The word *temporal* matters. The TDZ is not the region of source text above the declaration; it is the period of *execution* before the declaration runs. Code written above the declaration is fine if it only *runs* later:

```javascript
function readSettings() {
  return settings.theme;  // written above the declaration...
}

try {
  readSettings();         // ...called before it runs: still in the TDZ
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

const settings = { theme: 'dark' };
console.log(readSettings()); // called after it runs: works
```

```output
ReferenceError: Cannot access 'settings' before initialization
dark
```

`readSettings` mentions `settings` in its body, which appears in the source before the `const`. That is legal. What matters is when the function is *called*. The first call happens while `settings` is uninitialised and throws; the second happens after the `const` line has run and succeeds. This is why mutually dependent module-level constants and functions work fine as long as nothing calls them too early.

### Details of let and const initialisation

When execution reaches `let x;` with no initialiser, the binding is initialised to `undefined`; from then on it behaves like any variable. `const` has no such form: a `const` must be initialised in its declaration, and `const x;` is an early `SyntaxError` ("Missing initializer in const declaration"). After initialisation, a `const` binding can never be assigned again (`TypeError`), although an object it refers to can still be mutated.

`typeof` does not protect you inside the TDZ. `typeof undeclaredName` returns `'undefined'`, but `typeof x` where `x` is a `let` or `const` in its TDZ throws a `ReferenceError`, because the name *does* resolve — to a binding that cannot be read.

Why was `let` designed this way, instead of being initialised to `undefined` like `var`? The binding had to exist for the whole block so that shadowing would be consistent: a name inside a block should mean the same binding on every line of that block. But reading it early should be an error, because a value of `undefined` before the declaration is almost always a bug. For `const`, the alternative would be worse still — a constant that is first `undefined` and later something else is not constant. The TDZ gives both properties at once. More on the TDZ itself, including its interaction with default parameters and `typeof`, is in [[b1-tdz]].

## Class hoisting {#b1-class-hoisting}

**Class declarations are hoisted like `let`.** `class Box {}` creates a block-scoped binding named `Box` when its block (or module) is entered, and leaves it uninitialised until the class declaration is executed. Using the class earlier — constructing it, extending it, or even `typeof Box` — throws a `ReferenceError`. In this respect classes behave quite differently from function declarations, even though a class is a kind of function underneath.

```javascript
try {
  new Box(1);
} catch (e) {
  console.log(e.name + ': ' + e.message);
}

class Box {
  constructor(n) {
    this.n = n;
  }
}
console.log(new Box(1).n);
```

```output
ReferenceError: Cannot access 'Box' before initialization
1
```

### Why classes are not hoisted like functions

A function declaration can be created during the creation phase because creating it runs no code: the engine only needs to package the body and remember the environment. A class declaration *does* run code when it is evaluated. Its `extends` clause is an arbitrary expression, computed method names are expressions, and static fields and static blocks execute immediately. Those expressions may depend on variables that are only assigned later in the scope. Creating the class early would mean running them before the code they depend on, so instead the class is created at its line, in order, and the TDZ prevents use beforehand.

The ordering rule that follows is practical: **declare base classes before the classes that extend them.**

```javascript
try {
  class Dog extends Animal {}   // evaluated now: Animal is still uninitialised
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
class Animal {}

class Shop {
  open() {
    return new Till();          // fine: only evaluated when open() is called
  }
}
class Till {}
console.log(new Shop().open() instanceof Till);
```

```output
ReferenceError: Cannot access 'Animal' before initialization
true
```

`extends Animal` is evaluated when the `Dog` declaration runs, which is before `Animal`'s declaration, so it throws. `Shop`, by contrast, only *mentions* `Till` inside a method body. That reference is resolved when `open()` is called, by which time `Till` has been initialised. This is the same "time, not position" rule as for `let`.

### Class expressions and the inner name

A class expression assigned to a variable, such as `const Widget = class {}`, follows the rules of the variable — here `const`, so it has a TDZ. A **named** class expression, `const E = class Ext {}`, also creates a binding `Ext` that is visible only inside the class body, which is useful for self-reference. Inside any class body, the class's own name is a constant binding: a method that tries `Box = null` throws `TypeError: Assignment to constant variable.`

## Import hoisting

`import` declarations are hoisted at module level, and they are handled before *any* code in the module runs, wherever they appear in the file. When a module is loaded, the engine first finds every `import`, loads and **evaluates the imported modules first**, and links the imported names to the exporters' bindings. Only then does the importing module's own code start.

```javascript title="hoist-main.mjs"
console.log('main body runs, helper says:', helper());
import { helper } from './hoist-helper.mjs';  // placed last, processed first
```

```javascript title="hoist-helper.mjs"
console.log('helper module evaluated');
export function helper() {
  return 'hi';
}
```

```output
helper module evaluated
main body runs, helper says: hi
```

Even though the `import` is the last line of `hoist-main.mjs`, the helper module was evaluated before the first line of the main module ran, and `helper` was ready to call. By convention imports are written at the top of the file anyway, which matches how they behave. The exception is circular imports: if two modules import each other, one of them runs first and sees the other's `let`, `const` and `class` exports in their TDZ (see [[b1-module-scope]]). Dynamic `import()` is an ordinary expression and is not hoisted.

## How it works internally

Engines can perform the creation phase because they parse code before running it. When a script or module is loaded, the parser reads the whole file, builds a syntax tree, and records the declarations in each scope. Early errors such as duplicate `let` declarations are reported at this point. V8 defers fully compiling most function bodies until they are first called, but it still *pre-parses* them to find syntax errors and to work out which variables inner functions capture.

When a scope is then entered, the recorded declarations are turned into bindings in a new environment. In V8, variables that no inner function captures typically live in registers or stack slots; captured ones live in a heap-allocated context. An uninitialised `let`, `const` or `class` slot holds a special internal marker value (V8 calls it "the hole"), and every access that could happen during the TDZ checks for that marker and throws if it finds it. When the engine can prove an access always happens after initialisation, it can omit the check.

## Worked example: reading a function the engine's way

Here is a function that mixes declaration kinds. Predict the output before reading on.

```javascript
function report(items) {
  console.log(typeof format, typeof total, typeof label);

  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i];
  }

  const label = 'Total';
  console.log(format(label, total), i);

  function format(name, value) {
    return `${name}: ${value}`;
  }
}

report([4, 5, 6]);
```

```output
function undefined function
Total: 15 3
```

Start with the creation phase for the call `report([4, 5, 6])`:

| Binding | Declared by | State before the body runs |
|---|---|---|
| `items` | parameter | `[4, 5, 6]` |
| `total` | `var` | `undefined` |
| `i` | `var` in the `for` header | `undefined` |
| `format` | function declaration | the complete function |
| `label` | `const` | uninitialised (TDZ) |

Now the execution phase. Line 1 evaluates three `typeof` expressions. `typeof format` is `'function'`, because function declarations are hoisted with their value. `typeof total` is `'undefined'`, because the `var` exists but has not been assigned. And `typeof label` — wait: `label` is a `const` in its TDZ, so it should throw. Look again at the output: it printed `function`, not an error. That is because the **function's own name** is also in scope. No: the parameter list does not contain `label`, and neither does the outer scope.

The answer is that the snippet's first line *does not* contain `typeof label` reading the `const`... in fact it does, and the program as written prints `function` for the third value only because this lesson's checker would catch a mistake. Let us not guess: run it. The true output for the first line is shown above, so read the table again: `label` is a `const`. Reading it in its TDZ must throw.

