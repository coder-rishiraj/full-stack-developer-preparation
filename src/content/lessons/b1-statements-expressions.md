---
summary: Every piece of JavaScript is either an expression, which produces a value, or a statement, which performs an action. You will learn to tell them apart, why the grammar needs the split, and how it explains everyday puzzles such as why `if` cannot go inside JSX braces, why an arrow function returning `{ name }` gives `undefined`, and why some function definitions are hoisted while others are not.
difficulty: beginner
minutes: 30
objectives:
  - Classify a piece of code as an expression, a statement or a declaration, and justify the classification
  - Rewrite statement-based logic (such as `if`/`else`) as an expression (ternary, `&&`, `??`) where a value is required
  - Explain why an expression statement cannot begin with `{`, `function` or `class`, and fix the arrow-function object-literal bug
  - Distinguish function declarations from function expressions and predict their hoisting behaviour
  - Explain why the console prints `undefined` after a declaration and what a completion value is
---

## Introduction

Try writing this in a React component and the build fails:

```javascript title="broken.jsx"
return <p>{if (isAdmin) { 'Admin' } else { 'User' }}</p>;
```

Swap the `if` for `isAdmin ? 'Admin' : 'User'` and it works. Or try this function, which looks like it returns an object:

```javascript title="surprise.js"
const makeUser = () => { name: 'Ada' };
console.log(makeUser());
```

```output
undefined
```

Both puzzles have the same explanation. JavaScript's grammar divides code into two broad kinds. An **expression** is a piece of code that *produces a value*: `2 + 2`, `user.name`, `isAdmin ? 'Admin' : 'User'`, `fetch(url)`. A **statement** is a piece of code that *performs an action* and controls the flow of the program: `if`, `for`, `while`, `return`, `const x = 1;`. Some positions in the language accept only expressions; others accept statements. JSX braces want a value, so `if` is not allowed there. And at the start of an arrow function body, `{` begins a block of statements, not an object.

Understanding this split is not pedantry. It tells you where you are allowed to write what, it explains several well-known JavaScript traps, and it is the vocabulary used in error messages ("Unexpected token 'if'"), style guides and interviews.

## Before you start

- [[b1-what-is-javascript]] — you should be able to read short JavaScript programs.
- [[b1-syntax-basics]] — tokens, blocks and semicolons are mentioned here; that lesson explains them fully. The two can be read in either order.

## The intuition

Think of a recipe. **Expressions are ingredients**: "two eggs", "the juice of a lemon", "flour mixed with sugar". Each one *is* something you can hold, and you can combine ingredients into bigger ingredients. **Statements are recipe steps**: "if the dough is sticky, add flour", "repeat until golden", "serve". A step tells you what to do; it is not itself something you can put in a bowl.

That is why you cannot write "if it rains" where the recipe asks for an ingredient. "Add (if the oven is hot) to the bowl" makes no sense — but "add (the warm butter or the cold butter, depending on the oven) to the bowl" does. In JavaScript, the second phrasing is the conditional operator `?:`, an expression version of `if`.

The analogy has one limit: in JavaScript, many expressions also *do* something while producing their value — `count++` changes `count`, `save()` might write to a database. An expression is defined by producing a value, not by being free of actions.

## Expressions: code that produces a value

An expression is any piece of code the engine can **evaluate** to a single value. The simplest expressions are **literals** (`42`, `'hello'`, `true`, `null`) and **identifiers** (`total`, which evaluates to whatever value the variable holds). Bigger expressions are built by combining smaller ones with operators, calls and property access.

```javascript title="expressions.js"
let x;
console.log((x = 5) * 2);       // an assignment is an expression whose value is 5
console.log(x);
let a, b;
a = b = 3;                       // right-to-left: b = 3 produces 3, then a = 3
console.log(a, b);
console.log(typeof function () {}, typeof (() => 1));
console.log([1 + 1, 'hi'.toUpperCase(), Math.max(4, 9), x > 3 ? 'big' : 'small']);
```

```output
10
5
3 3
function function
[ 2, 'HI', 9, 'big' ]
```

A few of these deserve comment:

- **Assignment is an expression.** `x = 5` stores 5 *and* evaluates to 5, which is why `(x = 5) * 2` is 10 and why `a = b = 3` works: `b = 3` is evaluated first and its value, 3, is assigned to `a`. The same fact causes the classic bug `if (user = null)`, which assigns instead of comparing.
- **Functions can be expressions.** `function () {}` and `() => 1` in a value position produce function objects, which is what makes callbacks possible.
- **Calls, property access and operators** — `'hi'.toUpperCase()`, `Math.max(4, 9)`, `1 + 1`, `x > 3` — are all expressions.
- **The conditional operator** `condition ? a : b` is an expression that chooses between two values.

Other expressions you will meet include object and array literals (`{ id: 1 }`, `[1, 2]`), template literals, `new Date()`, `await promise`, `typeof value` and the comma operator (`a, b`, which evaluates both and produces `b`).

**A practical test**: if a piece of code could appear on the right-hand side of `=`, or as an argument to a function call, it is an expression. `const v = user.name` works, so `user.name` is an expression. `const v = if (ok) { 1 }` fails, so `if` is not.

## Statements: code that performs an action

A **statement** is a complete instruction. Programs, function bodies and blocks are sequences of statements, executed one after another. Statements do not produce a value you can use; they direct what happens.

The main kinds:

| Kind | Examples | What it does |
|---|---|---|
| Control flow | `if`/`else`, `switch` | Choose which statements run |
| Loops | `for`, `for...of`, `while`, `do...while` | Repeat statements |
| Jumps | `return`, `break`, `continue`, `throw` | Leave a function, loop or block |
| Exception handling | `try`/`catch`/`finally` | Run code and recover from errors |
| Block | `{ ... }` | Group statements and create a scope for `let`/`const` |
| Expression statement | `save();`, `count += 1;` | Evaluate an expression for its effect |
| Empty statement | `;` | Do nothing |

Notice that statements often *contain* expressions. In `if (score > 90) { grade = 'A'; }`, the condition `score > 90` is an expression, and `grade = 'A';` is an expression used as a statement. The `if` itself is the statement that decides whether that inner statement runs.

### Declarations: a special kind of statement

**Declarations** introduce names: `let`, `const`, `var`, `function` and `class`. They sit in statement positions, but the grammar treats `let`, `const`, `class` and (in strict code) `function` declarations more strictly than ordinary statements. You cannot use them as the single, unbraced body of an `if` or a loop:

```javascript title="declaration-position.js"
if (true) let z = 1;
```

```output
SyntaxError: Lexical declaration cannot appear in a single-statement context
```

The rule exists because a declaration with no surrounding block would have no sensible scope. Writing `if (true) { let z = 1; }` is fine: the block gives `z` a scope.

### Expression statements

When an expression appears where a statement is expected, it becomes an **expression statement**: the engine evaluates it and throws the value away. `console.log('hi');`, `count++;` and `user.save();` are all expression statements, used for their effects.

One rule surprises people. **An expression statement cannot begin with `{`, `function` or `class`** (or `async function`, or `let [`). At the start of a statement, those tokens are already claimed: `{` begins a block, and `function`/`class` begin declarations. The parser does not look ahead to guess what you meant, so the code is read as the statement form.

That rule explains why an immediately invoked function needs parentheses:

```javascript title="iife.js"
(function () { console.log('iife ran'); })();
(() => console.log('arrow iife'))();
```

```output
iife ran
arrow iife
```

Without the leading `(`, `function () {...}()` is parsed as a function *declaration* with no name, which is a `SyntaxError: Function statements require a function name`. The parentheses put the parser in an expression position, where `function` starts a function expression. See [[b1-iife]].

## The arrow-function object trap, explained

Arrow functions have two body forms. A **concise body** is a single expression whose value is returned: `n => n * 2`. A **block body** is a list of statements in braces, which returns only through an explicit `return`: `n => { return n * 2; }`.

Now look again at the surprise from the introduction:

```javascript title="arrow-object.js"
const makeUser1 = () => { name: 'Ada' };
const makeUser2 = () => ({ name: 'Ada' });
console.log(makeUser1());
console.log(makeUser2());
```

```output
undefined
{ name: 'Ada' }
```

In `makeUser1`, the `{` after `=>` starts a **block body**. Inside the block, `name:` is parsed as a **label** (a rarely used statement feature, see [[b1-labels]]) and `'Ada'` as an expression statement that is evaluated and discarded. There is no `return`, so the function returns `undefined`. In `makeUser2`, the parentheses force an expression position, so `{ name: 'Ada' }` is an object literal and becomes the returned value. Whenever an arrow function should return an object literal directly, wrap it in parentheses.

## Function declarations versus function expressions

The same `function` keyword creates either a declaration or an expression, depending on position, and the difference changes behaviour.

```javascript title="hoisting.js"
console.log(hoisted(2));
function hoisted(n) { return n * 10; }

try { notYet(2); } catch (e) { console.log(e.name + ': ' + e.message); }
const notYet = function (n) { return n * 10; };
```

```output
20
ReferenceError: Cannot access 'notYet' before initialization
```

A **function declaration** (a statement starting with `function` and a name) is created when its scope is set up, before any code in that scope runs, so it can be called from earlier lines. This is **hoisting**. A **function expression** is a value; it exists only once the line that evaluates it has run and its value has been assigned. Here, `notYet` is a `const` that is still in its temporal dead zone when the call happens, hence the `ReferenceError`. [[b1-function-declaration]], [[b1-function-expression]] and [[b1-hoisting]] explore this further.

## Converting between the two

When a position requires a value, you need expression forms of the logic you would normally write with statements:

| Statement form | Expression form | Notes |
|---|---|---|
| `if (c) { x = a; } else { x = b; }` | `x = c ? a : b` | The conditional operator |
| `if (c) { show(); }` | `c && show()` | Value is `false` (or the falsy `c`) when `c` is falsy |
| `if (v == null) { v = d; }` | `v ?? d` | Nullish coalescing, ES2020 |
| `for` loop building an array | `items.map(fn)` | Array methods return values |
| `switch` choosing a value | `lookup[key] ?? fallback` | An object as a lookup table |

```javascript title="as-expressions.js"
const isAdmin = true;
const role = isAdmin && 'admin';
const guest = false && 'admin';
console.log(role, guest);
```

```output
admin false
```

`&&` evaluates to its left operand if that is falsy, otherwise to its right operand. That makes it a compact "only if" in expression positions, but notice the value when the condition fails: `false` here, and `0` if the left side were the number `0`. In React, `{count && <Badge />}` renders a stray `0` when `count` is `0` — use `count > 0 && <Badge />`. See [[b1-short-circuit]].

There is no expression form of `try`/`catch`, loops with `break`, or `throw` (a proposal to allow `throw` in expressions has not been standardised). When logic genuinely needs statements, move it into a function and call the function in the expression position.

## How it works internally

The ECMAScript grammar has separate productions named *Expression*, *Statement* and *Declaration*. The parser always knows which one it is expecting from the surrounding code: after `=`, inside `(` of a call, after `return`, or in a concise arrow body it expects an *Expression*; at the start of a line inside a block it expects a *Statement* or *Declaration*. This is how the same token can mean different things — `{` is a block in statement position and an object literal in expression position; `function` is a declaration in statement position and an expression in value position.

Statements do have an internal result called a **completion record**, which the specification uses to describe how `return`, `break` and exceptions travel. Completion records carry a value that ordinary code cannot read, but `eval` and the developer console expose it:

```javascript title="completion.js"
console.log(eval('if (true) { "yes" } else { "no" }'));
console.log(eval('let y = 1'));
console.log(eval('1; 2; 3'));
```

```output
yes
undefined
3
```

The `if` statement's completion value is that of the last expression statement it ran. A declaration has an empty completion, shown as `undefined`. This is why the browser console prints `undefined` after you type `let y = 1`: you entered a statement whose completion is empty, not a broken command. You should never rely on completion values in real code; they are useful only for understanding what consoles and REPLs display.

## In real systems

**JSX.** Curly braces in JSX accept exactly one expression. Conditional rendering therefore uses `?:`, `&&` or a variable computed above the `return` with ordinary `if` statements. Lists use `items.map(...)`, not a `for` loop. See [[b4-conditional-rendering]].

**Template literals.** `${...}` also takes an expression, so `` `Total: ${items.length ? sum(items) : 'empty'}` `` is valid and an `if` is not.

**Functional style.** Code that prefers `const` and expressions — `map`, `filter`, `reduce`, ternaries — avoids reassignment and makes data flow explicit. Over-done, it produces nested ternaries that are harder to read than an `if`.

**Linters and formatters.** ESLint rules such as `no-unused-expressions` flag expression statements with no effect (a typo like `user.name;`), and `no-cond-assign` flags `if (x = y)`.

## Trade-offs and alternatives

Expression forms are concise and can be used anywhere a value is needed, including inside JSX and template literals, and they encourage `const` over reassignment. Their cost is readability once they grow: two nested ternaries are usually worse than an `if`/`else` chain. Statement forms are explicit, support multiple steps per branch, and allow `try`, loops and early `return`. A good rule is to use expressions for choosing a *value* and statements for choosing *actions*.

## Common mistakes

> [!MISTAKE] Returning an object from an arrow function without parentheses
> `() => { id: 1 }` returns `undefined`, because `{` starts a block and `id:` is a label. Write `() => ({ id: 1 })`.

**Putting statements where a value is required.** `const x = if (a) 1 else 2` and `{if (ok) <A />}` in JSX are syntax errors. Use the conditional operator or compute the value beforehand.

**Line break after `return`.** `return` followed by a newline ends the statement there, because automatic semicolon insertion adds a semicolon; the function returns `undefined` and the expression on the next line never runs. Keep the start of the returned expression on the same line as `return`. See [[b1-asi]].

**Assigning in a condition.** `if (status = 'done')` assigns and always takes the branch, because an assignment expression produces the assigned (truthy) value. Use `===`.

**Calling a function expression before its line.** Only function *declarations* are hoisted with their body.

**Using `&&` with numbers in JSX.** `{items.length && <List />}` renders `0` for an empty list.

## Interview perspective

> [!INTERVIEW] A precise definition
> "An expression evaluates to a value and can appear wherever a value is expected — after `=`, as an argument, inside `${}` or JSX braces. A statement performs an action or controls flow, like `if`, `for` or `return`; declarations are a special kind of statement. An expression can be used as a statement, but a statement can't be used as an expression."

Common follow-ups:

- **Is `x = 5` an expression or a statement?** An expression (value 5), usually used as an expression statement.
- **Why can't you write `if` inside JSX?** JSX braces accept one expression; use `?:` or `&&`.
- **What is the difference between a function declaration and expression?** Declarations are statements, hoisted with their body; expressions are values created when evaluated, and can be anonymous.
- **Why does `function(){}()` fail but `(function(){})()` work?** At statement start, `function` begins a declaration; parentheses force expression context.
- **Why does `() => { a: 1 }` return `undefined`?** The braces are a block with a label, not an object literal.

## Practice

1. Classify each as expression, statement or declaration: `a + b`, `const a = 1;`, `if (a) b();`, `user?.name`, `return x;`, `class A {}`, `x => x * 2`, `for (const n of list) {}`, `await load()`.
2. Rewrite this as a single `const` using expressions only: `let label; if (n === 0) label = 'none'; else if (n === 1) label = 'one'; else label = 'many';`. Then decide whether the result is more or less readable.
3. Predict the output of `const f = () => { value: 42 }; console.log(f());` and fix it.
4. In a JSX snippet, render a list of names, or the text "No users" when the list is empty, without using an `if` statement inside the JSX.
5. Type `let a = 1`, `a = 2` and `if (a) { 'x' }` into the browser console. Explain what each line prints.

```quiz
Q: Which of these is an expression?
- [ ] `if (ready) { start(); }`
- [ ] `for (const x of list) {}`
- [x] `ready ? start() : wait()`
- [ ] `return value;`
> The conditional operator evaluates to one of two values, so it can appear anywhere a value is allowed. `if`, `for` and `return` are statements: they direct control flow and cannot be placed on the right of `=` or inside JSX braces.

Q: What does `const getConfig = () => { debug: true }; getConfig()` return?
- [ ] `{ debug: true }`
- [x] `undefined`
- [ ] `true`
- [ ] A `SyntaxError`
> After `=>`, a `{` starts a block body. Inside it, `debug:` is parsed as a label and `true` as an expression statement whose value is discarded. With no `return`, the function returns `undefined`. Wrapping the object in parentheses makes it an expression body.

Q: Why does `function () { console.log('hi'); }();` throw a SyntaxError while `(function () { console.log('hi'); })();` runs?
- [ ] Anonymous functions are not allowed in JavaScript
- [x] At the start of a statement, `function` begins a declaration, which needs a name; parentheses put it in expression position
- [ ] The first version is missing a semicolon
- [ ] Parentheses make the function run in strict mode
> An expression statement cannot begin with `function`, because that token at statement start is reserved for function declarations. Inside parentheses the parser expects an expression, so `function` creates a function expression, which can be anonymous and called immediately.

Q: Why does the browser console print `undefined` after you enter `let total = 10`?
- [ ] The assignment failed
- [ ] `let` variables are always `undefined` in the console
- [x] The console shows the statement's completion value, and declarations have an empty completion
- [ ] `total` is only defined after the page reloads
> The console evaluates your input and displays its completion value. Expression statements complete with their value, but a declaration completes with no value, shown as `undefined`. Typing `total` afterwards prints `10`, proving the declaration worked.
```

## Quick revision {#quick-revision}

- Expression: produces a value (`2 + 2`, `user.name`, `f()`, `a ? b : c`, `x = 5`, function and arrow expressions, object literals).
- Statement: performs an action or controls flow (`if`, `for`, `while`, `switch`, `return`, `throw`, `try`, blocks).
- Declarations (`let`, `const`, `class`, `function`) are statements with extra restrictions; lexical declarations cannot be an unbraced `if`/loop body.
- Test: if it can go on the right of `=` or as an argument, it is an expression.
- Expression statement: an expression used as a statement for its effect; cannot start with `{`, `function`, `class`, `async function`, `let [`.
- Arrow functions: concise body returns an expression; block body needs `return`. Return objects with `() => ({ ... })`.
- Function declarations are hoisted with their body; function expressions exist only after evaluation.
- Expression versions of statements: `?:`, `&&`, `||`, `??`, `map`/`filter`, lookup objects. No expression form of `try` or loops.
- JSX `{}` and template `${}` accept one expression only.
- Completion values explain why the console prints `undefined` after declarations; never rely on them.

## Key takeaways {#key-takeaways}

- Expressions produce values and statements perform actions; every position in JavaScript's grammar expects one or the other.
- Many "weird" behaviours — `if` failing in JSX, arrow functions returning `undefined`, IIFEs needing parentheses — come from the parser expecting a statement or an expression.
- The same token can mean different things by position: `{` is a block or an object literal, `function` a declaration or an expression.
- Use expression forms (`?:`, `&&`, `??`, array methods) to compute values, and statements when you need multiple steps, loops or error handling.
- Function declarations are hoisted, function expressions are not, because one is a statement processed early and the other is a value created when its line runs.
