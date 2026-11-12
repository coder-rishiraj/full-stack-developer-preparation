---
summary: Parameters are how a JavaScript function receives its inputs, and JavaScript is unusually relaxed about them — any number of arguments can be passed to any function. You will learn what happens with missing and extra arguments, how default parameters, rest parameters and destructured options objects work, and why the legacy `arguments` object behaves strangely.
difficulty: intermediate
minutes: 50
objectives:
  - Predict parameter values when a function receives fewer or more arguments than it declares
  - Use default parameters correctly, including when they are evaluated and why `null` does not trigger them
  - Collect variable numbers of arguments with rest parameters and explain how they differ from `arguments`
  - Design function signatures with destructured options objects and safe defaults
  - Explain parameter passing (call-by-sharing), `function.length`, and the strict-mode rules for parameters
---

## Introduction

A function becomes useful when it can work on different inputs. `area(3, 4)` and `area(10, 2)` run the same code on different numbers because `area` declares **parameters** — named slots that each call fills with **arguments**.

Many languages check the number of arguments strictly: call a two-parameter method with one argument in Java and the program does not compile. JavaScript does not check at all. Every function accepts any number of arguments:

```javascript
function greet(name, greeting) {
  return `${greeting}, ${name}`;
}

console.log(greet('Ada', 'Hello'));
console.log(greet('Ada'));
console.log(greet('Ada', 'Hi', 'this is ignored'));
```

```output
Hello, Ada
undefined, Ada
Hi, Ada
```

A missing argument leaves its parameter `undefined`; an extra one is not bound to any parameter. No error is raised either way. That flexibility is convenient, but without care it produces strings like `undefined, Ada`. The language features in this lesson exist to handle it well: **default parameters** fill in missing values, **rest parameters** collect any number of extra arguments into an array, **destructuring** lets a function accept a single options object, and the older **`arguments` object** is what code used before all of these existed.

You use these features every time you read a React component's props (`function Button({ variant = 'primary', ...rest })`), call `fetch(url, options)`, or write a utility like `sum(...numbers)`.

## Before you start

- **Function declarations and expressions** — how a function is defined and called. See [[b1-function-declaration]] and [[b1-function-expression]].
- **Primitive vs reference values** — needed to understand what a function can change about its arguments. See [[b1-primitive-vs-reference]].
- **`undefined` vs `null`** — default parameters treat them differently. See [[b1-undefined-vs-null]].
- **Destructuring and spread** — used for options objects and passing arrays as arguments. See [[b1-destructuring]] and [[b1-spread-rest]]; this lesson explains what it uses.

## The intuition

Picture a function call as filling in a form. The function's parameter list is the form's labelled boxes, in order. The caller's arguments are written into the boxes left to right. Any box left blank holds `undefined`. A **default parameter** is a box with a pre-printed value that is used only when the box is left blank. A **rest parameter** is a final box labelled "anything else", which collects every remaining argument into a list.

The form is filled in fresh for every call. The boxes are the function's own local variables; writing over one of them does not change what the caller wrote on their copy — unless the value in the box is a reference to a shared object, which is the subtle part covered under parameter passing below.

## Parameters and arguments

The terms are often used loosely, but the distinction helps:

- A **parameter** is a name in the function's definition: in `function greet(name, greeting)`, the parameters are `name` and `greeting`.
- An **argument** is a value supplied at a call: in `greet('Ada', 'Hello')`, the arguments are `'Ada'` and `'Hello'`.

When a function is called, the engine creates a new scope and binds each parameter, in order, to the corresponding argument. Parameters then behave like local variables declared at the top of the body. They can be read, reassigned, and closed over by inner functions, and they disappear when the call ends unless something still references them.

Matching is purely **by position**. JavaScript has no keyword arguments. Writing `greet(greeting = 'Hi', name = 'Ada')` at a call site does not name the arguments: it evaluates two assignment expressions — creating or overwriting variables called `greeting` and `name` in sloppy code, or throwing a `ReferenceError` in strict code if they are undeclared — and passes the results by position. Use an options object, shown later, when you want named inputs.

### Missing and extra arguments

| Situation | What happens |
|---|---|
| Fewer arguments than parameters | Unfilled parameters are `undefined` (or their default) |
| More arguments than parameters | Extra values are not bound to a name; they are still available via a rest parameter or `arguments` |
| `undefined` passed explicitly | Treated the same as a missing argument for defaults |

### `function.length`

Every function has a `length` property: the number of parameters it *expects*. It counts parameters up to, but not including, the first one with a default value, and never counts a rest parameter:

```javascript
console.log(((a, b) => {}).length);
console.log(((a, b = 1, c) => {}).length);
console.log(((...all) => {}).length);
console.log(((a, ...more) => {}).length);
console.log((function ({ x }, [y]) {}).length);
```

```output
2
1
0
1
2
```

Destructured parameters count like any other. `length` is used by a few libraries — for example, Express treats middleware with four parameters `(err, req, res, next)` as an error handler — so adding a default to such a function can change how a framework treats it.

## Parameter passing: call-by-sharing

When you pass a variable to a function, the function does not receive the variable itself. It receives a **copy of the value** the variable holds. For primitives (numbers, strings, booleans), that copy is the whole story. For objects and arrays, the value is a **reference** to the object — so the function and the caller now point to the same object. This model is called **call-by-sharing**:

```javascript
function rename(user, name) {
  name = name.trim();          // reassigns the local parameter only
  user.name = name;            // mutates the object the caller also holds
  user = { name: 'replaced' }; // reassigns the local parameter only
  return user;
}

const account = { name: 'old' };
const raw = '  Ada  ';
const result = rename(account, raw);

console.log(account, JSON.stringify(raw), result);
```

```output
{ name: 'Ada' } "  Ada  " { name: 'replaced' }
```

Three lines, three outcomes. Reassigning `name` does not touch the caller's `raw` — strings are primitives and the parameter is a separate variable. Mutating `user.name` *is* visible to the caller, because `user` and `account` refer to the same object. Reassigning `user` to a new object afterwards only changes where the local parameter points; `account` still refers to the original object. The rule to remember: **reassigning a parameter never affects the caller; mutating an object through a parameter always does.** Mutating arguments is a common source of bugs, discussed in [[b1-pure-functions]]; the model itself is covered in [[b1-call-by-sharing]].

## Default parameters

A **default parameter** gives a parameter a value to use when its argument is missing or `undefined`. It was added in ECMAScript 2015.

```javascript
function f(a, b = 2, ...rest) {
  return { a, b, rest, argc: arguments.length };
}

console.log(f(1));
console.log(f(1, undefined, 3, 4));
console.log(f(1, null));
```

```output
{ a: 1, b: 2, rest: [], argc: 1 }
{ a: 1, b: 2, rest: [ 3, 4 ], argc: 4 }
{ a: 1, b: null, rest: [], argc: 2 }
```

The first two calls use the default: once because `b` is missing, once because `undefined` was passed explicitly (which lets a caller skip a parameter in the middle). The third call passes `null`, and `b` stays `null`. **Only `undefined` triggers a default.** `null`, `0`, `''` and `false` are real values that the caller chose.

### Why not `b = b || 2`?

Before ES2015, defaults were written by hand inside the body, usually with `||`. That pattern has a bug: `||` replaces every *falsy* value, including legitimate ones.

```javascript
function oldStyle(count) {
  count = count || 10;
  return count;
}
function newStyle(count = 10) {
  return count;
}

console.log(oldStyle(0), newStyle(0));
console.log(oldStyle(''), newStyle(undefined), newStyle(null));
```

```output
10 0
10 10 null
```

Asking for zero items with `oldStyle(0)` silently gives ten. A default parameter keeps the `0`. If you also want `null` to fall back to the default, handle it explicitly in the body with nullish coalescing: `count = count ?? 10` ([[b1-nullish-coalescing]]).

### Defaults are evaluated at call time, every time

A default is an expression, not a fixed value. It is evaluated **when the call happens**, **only if it is needed**, and **again on every call**:

```javascript
function addItem(item, list = []) {
  list.push(item);
  return list;
}
console.log(addItem(1), addItem(2));

let created = 0;
function nextId() {
  created += 1;
  return created;
}
function makeRecord(id = nextId()) {
  return id;
}
console.log(makeRecord(), makeRecord(), makeRecord(99), created);
```

```output
[ 1 ] [ 2 ]
1 2 99 2
```

Each call to `addItem` without a list gets a **brand-new** empty array, so the two results do not share items. (Python developers should note the contrast: Python evaluates defaults once, at definition time, which makes a mutable default a famous trap. JavaScript does not have that trap.) In `makeRecord(99)` the default is not needed, so `nextId()` is not called at all — `created` is `2` after three calls.

### Defaults can use earlier parameters

Parameters are initialised **left to right**, and each default can refer to the parameters before it:

```javascript
function range(start, end = start + 10) {
  return [start, end];
}
console.log(range(5));

function broken(a = b, b = 1) {
  return [a, b];
}
try {
  broken();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
console.log(broken(0));
```

```output
[ 5, 15 ]
ReferenceError: Cannot access 'b' before initialization
[ 0, 1 ]
```

`end` can use `start` because `start` is already initialised. `a = b` fails because, when `a`'s default runs, `b` exists but is still in its temporal dead zone ([[b1-tdz]]) — the same rule as `let`. Passing a value for `a` skips its default, so `broken(0)` works.

### A required-parameter trick

Because defaults run only when an argument is missing, a default that throws turns a parameter into a required one:

```javascript
function required(name) {
  throw new Error(`${name} is required`);
}
function connect(url = required('url'), timeoutMs = 5000) {
  return `connecting to ${url} (timeout ${timeoutMs}ms)`;
}

console.log(connect('db.internal'));
try {
  connect();
} catch (e) {
  console.log(e.message);
}
```

```output
connecting to db.internal (timeout 5000ms)
url is required
```

It is a neat idiom; TypeScript's required parameters give the same guarantee at compile time, without runtime cost.

## Rest parameters

A **rest parameter**, written `...name` as the last parameter, collects all remaining arguments into a **real array**:

```javascript
function tag(first, ...others) {
  return `${first} | ${others.join(',')} | ${others.length}`;
}

console.log(tag('a'));
console.log(tag('a', 'b', 'c'));

const sum = (...nums) => nums.reduce((total, n) => total + n, 0);
console.log(sum(), sum(4), sum(1, 2, 3, 4));
```

```output
a |  | 0
a | b,c | 2
0 4 10
```

When there are no remaining arguments, the rest parameter is an empty array, never `undefined`, so code can call array methods on it without checks. Functions that accept "any number of" something — `console.log`, `Math.max`, a `sum` helper, a logger that takes tags — are called **variadic**, and rest parameters are the modern way to write them.

Three rules are enforced by the parser. The rest parameter must be **last** (`function f(...a, b)` is a `SyntaxError: Rest parameter must be last formal parameter`), there can be **only one**, and it **cannot have a default** (`...items = []` is a `SyntaxError`; it would never be needed, since rest is always an array).

### Rest vs spread

The same three dots do the opposite job at a call site. In a **parameter list**, `...` *collects* arguments into an array (rest). In a **call**, `...` *spreads* an array into separate arguments:

```javascript
function multiply(a, b) {
  return a * b;
}
const pair = [3, 4];

console.log(multiply(...pair));          // spread: multiply(3, 4)
console.log(Math.max(...[5, 1, 8]));     // spread into a variadic built-in
```

```output
12
8
```

Before spread syntax, the equivalent was `multiply.apply(null, pair)`. Both directions are covered together in [[b1-spread-rest]].

## Destructured parameters and options objects

When a function needs more than two or three inputs, or several optional ones, positional parameters become hard to read: what does `createUser('Ada', true, false, 'admin')` mean? The common solution is a single **options object**, destructured in the parameter list with defaults for each property:

```javascript
function makeRequest(url, { method = 'GET', retries = 2, headers = {} } = {}) {
  return `${method} ${url} retries=${retries} headers=${JSON.stringify(headers)}`;
}

console.log(makeRequest('/users'));
console.log(makeRequest('/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}));
```

```output
GET /users retries=2 headers={}
POST /users retries=2 headers={"Content-Type":"application/json"}
```

Read the second parameter from the inside out. `{ method = 'GET', retries = 2, headers = {} }` unpacks three properties from the object passed in, each with its own default for when the property is missing. The trailing `= {}` is a default for the **whole object**: if the caller passes nothing, destructuring runs against an empty object and every property default applies. Without it, `makeRequest('/users')` would throw, because destructuring `undefined` is an error:

```javascript
try {
  (function ({ a }) {})();
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
```

```output
TypeError: Cannot destructure property 'a' of 'undefined' as it is undefined.
```

Options objects make call sites self-documenting, let callers pass options in any order, and let you add new options later without breaking existing calls. They are how most JavaScript APIs take configuration: `fetch(url, { method, headers })`, `addEventListener(type, fn, { once: true })`, and every React component's props. Destructuring with defaults and renaming is taught in [[b1-destructure-defaults]].

A rest element inside the destructuring collects the remaining properties — common in React components that forward unknown props to a DOM element:

```javascript
function Button({ label, variant = 'primary', disabled = false, ...rest } = {}) {
  return { label, variant, disabled, rest };
}

console.log(Button({ label: 'Save', id: 'save-btn', 'aria-label': 'Save draft' }));
```

```output
{
  label: 'Save',
  variant: 'primary',
  disabled: false,
  rest: { id: 'save-btn', 'aria-label': 'Save draft' }
}
```

## The `arguments` object

Before rest parameters existed, the only way to reach extra arguments was **`arguments`**: an object automatically available inside every regular (non-arrow) function, holding all the arguments of the current call by index.

```javascript
function maxOf() {
  let max = -Infinity;
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] > max) max = arguments[i];
  }
  return max;
}

function inspect() {
  return [typeof arguments, Array.isArray(arguments), arguments.length, Array.from(arguments)];
}

console.log(maxOf(3, 9, 4));
console.log(inspect('x', 'y'));
```

```output
9
[ 'object', false, 2, [ 'x', 'y' ] ]
```

`arguments` is **array-like**, not an array: it has `length` and numeric indices, but no `map`, `filter` or `reduce`. Old code converted it with `Array.prototype.slice.call(arguments)`; today you would use `Array.from(arguments)` or `[...arguments]` — or, better, a rest parameter, which is a real array from the start and names what it holds.

`arguments.length` is also the only way to tell "argument omitted" from "argument passed as `undefined`": `function count(a, b) { return arguments.length; }` returns `1` for `count(1)` but `2` for `count(1, undefined)`.

### Arrow functions do not have one

Arrows have no `arguments` of their own. Inside an arrow, `arguments` refers to the nearest enclosing regular function's `arguments` (or throws `ReferenceError` at the top level of a module). Use `(...args) => …` instead. See [[b1-arrow-functions]].

### Legacy aliasing in sloppy mode

In sloppy-mode functions whose parameters are all **simple** (plain names: no defaults, no rest, no destructuring), `arguments` is **mapped**: `arguments[0]` and the first parameter are linked, so writing to one changes the other. In strict mode, or when any parameter is non-simple, `arguments` is an **unmapped** snapshot:

```javascript
function sloppyLinked(a) {
  a = 'changed';
  return arguments[0];
}
function sloppyReverse(a) {
  arguments[0] = 'via arguments';
  return a;
}
function strictUnlinked(a) {
  'use strict';
  a = 'changed';
  return arguments[0];
}
function defaultUnlinked(a = 0) {
  a = 'changed';
  return arguments[0];
}

console.log(sloppyLinked('orig'), sloppyReverse('orig'));
console.log(strictUnlinked('orig'), defaultUnlinked('orig'));
```

```output
changed via arguments
orig orig
```

The aliasing makes code harder to reason about and harder for engines to optimise; it survives only for backward compatibility. Strict functions also forbid `arguments.callee` (a reference to the running function, once used for anonymous recursion) — accessing it throws a `TypeError`. Use a named function expression instead ([[b1-named-function-expression]]).

## Strict-mode rules for parameters

A few parameter rules depend on strict mode ([[b1-strict-mode]]) or on whether the parameter list is **simple**:

- **Duplicate parameter names** (`function f(a, a) {}`) are allowed in sloppy functions with simple parameters — the later one wins — and are a `SyntaxError` in strict code, in arrow functions, and in any function with defaults, rest or destructuring.
- A function with non-simple parameters **cannot contain a `'use strict'` directive** in its body: `function f(a = 1) { 'use strict'; }` is a `SyntaxError`. Put the directive at the top of the file, or use modules, which are strict automatically.
- `arguments` is unmapped and `arguments.callee` throws, as shown above.

## How it works internally

When a function is called, the specification's `FunctionDeclarationInstantiation` sets up its parameters before the first line of the body runs. In order:

1. Create a binding for every parameter name, uninitialised.
2. If the function is not an arrow and does not declare its own `arguments`, create the arguments object — mapped or unmapped, as above.
3. Initialise the parameters **left to right** from the argument list. For each one, if the incoming value is `undefined` and there is a default, evaluate the default expression now; a rest parameter receives a new array of the leftovers; a destructuring pattern unpacks its value.
4. Set up the body's own declarations (`var`, functions, `let`, `const`) and start running the body.

Step 3 explains every default-parameter rule in this lesson: defaults run at call time, only when needed, in order, with later parameters still in the temporal dead zone.

When a function has any default values, the engine also gives the body a **separate scope** from the parameters, so that a default expression cannot see variables declared inside the body. One visible consequence: a closure created in a default captures the parameter, not a same-named `var` in the body.

```javascript
function scopes(a, readA = () => a) {
  var a = 'body';
  return [a, readA()];
}

console.log(scopes('param'));
```

```output
[ 'body', 'param' ]
```

You will rarely write code like this, but it confirms the model: parameters live in their own scope, initialised before the body begins.

## Worked example: a flexible formatting helper

This function combines everything: a required positional parameter, an options object with defaults (including one computed from another option), and a rest parameter.

```javascript title="format.js"
function formatAmount(
  amount,
  { currency = 'USD', decimals = currency === 'JPY' ? 0 : 2, sign = false } = {},
  ...notes
) {
  const fixed = Math.abs(amount).toFixed(decimals);
  const prefix = amount < 0 ? '-' : sign ? '+' : '';
  const suffix = notes.length > 0 ? ` (${notes.join('; ')})` : '';
  return `${prefix}${fixed} ${currency}${suffix}`;
}

console.log(formatAmount(1234.5));
console.log(formatAmount(1234.5, { currency: 'JPY' }));
console.log(formatAmount(-20, { decimals: 1 }));
console.log(formatAmount(15, { sign: true }, 'refund', 'manual'));
console.log(formatAmount(15, undefined, 'note only'));
```

```output
1234.50 USD
1235 JPY
-20.0 USD
+15.00 USD (refund; manual)
15.00 USD (note only)
```

Walk through the calls. The first passes only `amount`, so the options object defaults to `{}` and every property default applies; `notes` is an empty array, so there is no suffix. The second sets `currency`; `decimals` has no value, so its default runs and reads the already-initialised `currency`, giving `0`. The third shows a negative amount and an explicit `decimals`. The fourth collects two extra arguments into `notes`. The last passes `undefined` to skip the options object while still supplying notes — the explicit `undefined` triggers the `= {}` default.

## In real systems

**Configuration objects.** Browser and Node.js APIs take options objects: `fetch(url, { method: 'POST', body })`, `fs.readFile(path, { encoding: 'utf8' })`, `element.addEventListener('scroll', fn, { passive: true })`. Library functions follow the same convention so they can add options without breaking callers.

**React props.** A function component receives one props object, and destructuring with defaults is the standard way to read it: `function Avatar({ src, size = 40, ...imgProps })`. Since React 19, `defaultProps` is no longer supported on function components, so parameter defaults are the way to set prop defaults.

**Variadic utilities.** Logging helpers (`log(level, ...messages)`), class-name builders (`cx('btn', isActive && 'active')`), and wrappers that forward arguments (`(...args) => fn(...args)`) all depend on rest parameters and spread.

**Framework signatures.** Express distinguishes error-handling middleware by `function.length === 4`, so removing an unused `next` parameter from an error handler silently turns it into ordinary middleware.

## Trade-offs and alternatives

| Approach | Good for | Weak spots |
|---|---|---|
| Positional parameters | One to three required, obvious inputs (`add(a, b)`) | Unreadable call sites with many or boolean arguments |
| Defaults on positional parameters | One or two optional trailing inputs | Skipping a middle parameter needs an explicit `undefined` |
| Options object with destructuring | Many inputs, optional settings, future growth | Slightly more verbose; property names become part of the API |
| Rest parameter | Any number of same-kind values | Must be last; can obscure meaning if overused |
| `arguments` | Legacy code only | Array-like, not in arrows, aliasing quirks |

A useful rule: if a call site needs a comment to explain an argument (`render(data, true /* animate */)`), switch that input to an options object (`render(data, { animate: true })`).

## Common mistakes

> [!MISTAKE] Expecting `null` to trigger a default
> `function f(b = 2)` keeps `null` when called as `f(null)`. Defaults apply only to `undefined`. If `null` should also fall back, write `b = b ?? 2` in the body.

**Forgetting `= {}` on a destructured options parameter.** `function f({ a = 1 })` throws when called with no arguments. Add the outer default: `function f({ a = 1 } = {})`.

**Using `||` for defaults.** `x = x || 10` replaces `0`, `''` and `false`. Use a default parameter or `??`.

**Mutating an argument by accident.** Sorting, pushing to or editing a passed-in array or object changes the caller's data. Copy first (`[...items].sort()` or `items.toSorted()`) when the caller does not expect changes.

**Using `arguments` in an arrow function.** It refers to an outer function's arguments, not the arrow's. Use rest parameters.

**Assuming argument counts are checked.** Calling a function with too few arguments does not fail; the missing parameters are `undefined` and the bug surfaces later. TypeScript or runtime validation catches this.

## Interview perspective

Parameter questions in interviews tend to be output predictions (`null` vs `undefined` with defaults, `function.length`, `arguments` aliasing) and design questions (how to make an API with many optional inputs).

> [!INTERVIEW] What a strong answer sounds like
> "JavaScript binds arguments to parameters by position and never checks the count. Missing ones are `undefined`, and a default parameter runs only for `undefined`, evaluated fresh at call time, left to right. For many optional inputs I'd take a destructured options object with a `= {}` default, and for variable-length inputs a rest parameter, which unlike `arguments` is a real array and works in arrows."

Questions you should be able to answer:

- **What does `function f(a, b = 5) {}; f(1, null)` give for `b`?** `null`.
- **Is a default like `list = []` shared between calls?** No; it is evaluated on every call that needs it.
- **What is `((a, b = 1, c) => {}).length`?** `1` — counting stops at the first default.
- **Differences between rest parameters and `arguments`?** Rest is a real array, contains only the unnamed leftovers, and works in arrows; `arguments` is array-like, contains all arguments, is missing in arrows, and is aliased to parameters in sloppy mode with simple parameters.
- **Can a function change a caller's variable?** It cannot reassign it, but it can mutate an object the variable refers to (call-by-sharing).

```quiz
Q: What does `function f(x = 10) { return x; }` return for `f(0)`, `f(undefined)` and `f(null)`?
- [ ] `10`, `10`, `10`
- [x] `0`, `10`, `null`
- [ ] `0`, `undefined`, `null`
- [ ] `10`, `10`, `null`
> A default parameter is used only when the incoming value is `undefined`, which covers both a missing argument and an explicit `undefined`. `0` and `null` are values the caller chose, so they are kept. The first option describes the old `x = x || 10` pattern, which wrongly replaces `0` too.

Q: Given `function add(item, list = []) { list.push(item); return list; }`, what does `console.log(add(1), add(2))` print?
- [x] `[ 1 ] [ 2 ]`
- [ ] `[ 1 ] [ 1, 2 ]`
- [ ] `[ 1, 2 ] [ 1, 2 ]`
- [ ] It throws because `list` is undefined
> JavaScript evaluates a default expression at call time, every time it is needed, so each call gets a new empty array. The second option is what Python does, because Python evaluates defaults once when the function is defined.

Q: Why does `function show({ title }) { return title; }` throw when called as `show()`?
- [ ] Destructuring is not allowed in parameter lists
- [ ] `title` is a reserved word
- [x] The parameter is `undefined`, and destructuring `undefined` throws a `TypeError`
- [ ] Functions with destructured parameters must be arrow functions
> With no argument, the parameter's value is `undefined`, and extracting a property from `undefined` is a `TypeError`. Adding a default for the whole pattern, `function show({ title } = {})`, makes destructuring run against an empty object instead.
```

## Practice

1. **Defaults table.** Write `function f(a = 'A', b = a + 'B')` and predict the result of `f()`, `f('x')`, `f(undefined, 'y')`, `f(null)` and `f(0, null)`. Run them and explain each.
2. **Variadic average.** Write `average(...nums)` that returns `0` for no arguments and otherwise the mean. Then call it with an existing array using spread.
3. **Refactor a boolean soup.** Convert `createModal(title, true, false, 400, 'center')` into a function taking `(title, { closable, backdrop, width, position } = {})` with sensible defaults, and rewrite the call.
4. **Replace `arguments`.** Rewrite an old `function join() { var parts = Array.prototype.slice.call(arguments); … }` with a rest parameter, then as an arrow function.
5. **Call-by-sharing.** Write a function that receives an array, sorts it and returns it. Show that the caller's array changes, then fix the function so it does not.

## Quick revision {#quick-revision}

- Parameters are names in the definition; arguments are values at the call; binding is by position only.
- Missing arguments → `undefined`; extra arguments are ignored by named parameters; no count checking.
- `fn.length` counts parameters before the first default; rest is never counted.
- Call-by-sharing: reassigning a parameter never affects the caller; mutating an object through it does.
- Defaults (`b = 2`) apply only for `undefined` (missing or explicit), not `null`/`0`/`''`.
- Defaults are evaluated at call time, lazily, every call, left to right; later parameters are in the TDZ.
- Rest (`...rest`) collects leftovers into a real array (empty if none); must be last, one only, no default.
- Spread at a call site does the reverse: `f(...arr)`.
- Options object: `function f(x, { a = 1, b = 2 } = {})`; the outer `= {}` prevents a `TypeError` when omitted.
- `arguments`: array-like, all arguments, not in arrows; mapped (aliased) only in sloppy functions with simple parameters; `arguments.callee` throws in strict mode.
- Strict mode / non-simple parameters: no duplicate parameter names; `'use strict'` in a function with non-simple parameters is a `SyntaxError`.

## Key takeaways {#key-takeaways}

- JavaScript never checks argument counts: missing parameters become `undefined` and extras are only reachable through rest parameters or `arguments`.
- Default parameters replace only `undefined`, are evaluated fresh at each call, and can depend on earlier parameters.
- Rest parameters are the modern, array-based way to accept any number of arguments; prefer them to `arguments` in all new code.
- For several optional inputs, a destructured options object with defaults and a trailing `= {}` gives readable, extensible call sites.
- Arguments are passed by sharing: a function can mutate the objects it receives, so avoid doing that unless the caller expects it.
