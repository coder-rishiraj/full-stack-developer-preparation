---
summary: The methods `call`, `apply` and `bind` let you choose the value of `this` for a function instead of leaving it to the call site. You will learn what each one does, how they differ (run now with a list, run now with an array, or return a new function for later), how to use them to borrow methods and keep callbacks attached to their objects, and how they work well enough to implement them yourself.
difficulty: intermediate
minutes: 50
objectives:
  - Explain what `call`, `apply` and `bind` each do and choose between them for a given task
  - Predict `this` and the arguments a function receives when called through each method, including with `null`, arrows and bound functions
  - Use `bind` for partial application and for stable callback references, and explain why each `bind` call creates a new function
  - Borrow generic methods such as `Array.prototype.slice` and `Object.prototype.hasOwnProperty`, and recognise which methods cannot be borrowed
  - Implement simplified versions of `call`, `apply` and `bind`, and explain where they differ from the built-ins
---

## Introduction

For a regular JavaScript function, `this` is decided by how the function is called. `cart.total()` runs `total` with `this` set to `cart`; a plain `total()` runs it with `this` set to `undefined` in strict code. That rule is explained in [[b1-this]]. Most of the time it is exactly what you want.

Sometimes, though, you need to say *for yourself* what `this` should be:

- you have a function written for one object and want to run it on another object that has the same shape;
- you have a method that you must hand to `setTimeout`, `addEventListener` or a React prop, and you need it to keep its object when it is called later;
- you are writing a wrapper — a logger, a timer, a `debounce` — that must call the original function with the same `this` and arguments it was given.

Every regular function inherits three methods from `Function.prototype` for this. They differ in only two ways: **when** the function runs, and **how** you pass its arguments.

| Method | Runs the function | Arguments | Returns |
|---|---|---|---|
| `fn.call(thisArg, a, b)` | Now | One by one | Whatever `fn` returns |
| `fn.apply(thisArg, [a, b])` | Now | As one array (or array-like) | Whatever `fn` returns |
| `fn.bind(thisArg, a)` | Not yet | Some now, the rest when called | A new function |

A common way to remember the first two: **a**pply takes an **a**rray; **c**all takes **c**ommas. This lesson teaches `call` first, then the two nested topics [[b1-apply]] and [[b1-bind]], then the most common use of all three, [[b1-function-borrowing]].

## Before you start

- **How `this` is decided** — default, implicit, `new` and arrow binding, and why methods lose `this` when passed as callbacks. See [[b1-this]], especially [[b1-this-explicit]] and [[b1-this-lost]].
- **Functions as values** — storing functions in variables, passing and returning them. See [[b1-first-class-functions]].
- **Rest parameters, spread and `arguments`** — `function f(...args)`, `f(...array)` and the array-like `arguments` object. See [[b1-parameters]] and [[b1-spread-rest]].
- **Prototypes, lightly** — that arrays get methods such as `map` from `Array.prototype`. See [[b1-prototypes]].

## The intuition

Imagine a function as a worker who does a job on "the current customer". Normally, the customer is whoever the worker was sent to: `cart.total()` sends `total` to `cart`. The three methods are three ways of assigning a customer yourself:

- `call` is "do the job for this customer, right now, with these instructions read out one at a time";
- `apply` is the same, but you hand the instructions over as one list;
- `bind` does not start any work. It produces a **new worker** permanently assigned to that customer, who can be sent anywhere and will always work for them.

The analogy breaks down at one point: in JavaScript, the "worker" is not changed by `bind`. The original function is untouched; `bind` creates a separate function that calls the original.

## call: run now with a chosen `this`

`Function.prototype.call` runs a function immediately. Its first argument becomes `this` inside the function; every argument after that is passed to the function as its normal parameters, in order. `fn.call(obj, a, b)` behaves like `obj.fn(a, b)` would if `fn` were stored on `obj` — but without having to store it there.

```javascript title="call-basics.mjs"
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const ada = { name: 'Ada' };
const grace = { name: 'Grace' };

console.log(greet.call(ada, 'Hello', '.'));
console.log(greet.call(grace, 'Welcome', '.'));

const result = greet.call(ada, 'Hi', '?');
console.log(typeof result);
```

```output
Hello, Ada.
Welcome, Grace.
string
```

`greet` is not a property of `ada` or `grace`, yet each call runs it with the chosen object as `this`. The return value of `call` is the return value of the function: `call` does not wrap or change it. And nothing is modified: neither object gains a `greet` property, and `greet` itself is unchanged.

### What `thisArg` becomes

Whether the value you pass is used exactly as given depends on whether the *called* function is strict. In strict code (ES modules, classes, `'use strict'`) `this` is exactly the value you pass — including `undefined`, `null` or a primitive. In sloppy code, `null` and `undefined` are replaced by the global object, and primitives are wrapped in objects:

```javascript title="call-thisarg.cjs"
function sloppy() { return this; }
function strict() { 'use strict'; return this; }

console.log(sloppy.call(null) === globalThis, typeof sloppy.call('text'));
console.log(strict.call(null), typeof strict.call('text'));
console.log(strict.call());                 // no thisArg at all
```

```output
true object
null string
undefined
```

When a function does not use `this` at all, the convention is to pass `null` as a placeholder: `Math.max.call(null, 3, 7)`. Nothing reads it, so its value does not matter.

### Cases where `call` cannot set `this`

Two kinds of function ignore the `thisArg` you pass. An **arrow function** has no `this` of its own — it always uses the `this` of the code it was written in — so `call` runs it, passes the arguments, and silently drops the `thisArg`. A **bound function** (one produced by `bind`) already has a permanent `this`, so `call` cannot replace it. Both are covered with examples in [[b1-this-arrow]] and in the [[b1-bind]] section below.

```javascript title="call-ignored.mjs"
const arrow = () => this;
console.log(arrow.call({ id: 1 }));          // module-level this

function whoAmI() { return this.id; }
const bound = whoAmI.bind({ id: 'bound' });
console.log(bound.call({ id: 'call' }));
```

```output
undefined
bound
```

### `call` in modern code

Classes, arrow functions and spread syntax removed many reasons to reach for `call`. It is still the right tool in three situations you will meet regularly: **borrowing** a method for an object that does not have it (see [[b1-function-borrowing]]), **calling a parent constructor** in older constructor-function inheritance (`Animal.call(this, name)` inside `function Dog(name) { … }`, the pre-class version of `super(name)`), and **forwarding** `this` inside wrappers, which uses `call` or `apply` as shown in the worked example.

## apply {#b1-apply}

**`Function.prototype.apply`** runs a function immediately with a chosen `this`, exactly like `call`, but takes the function's arguments as a **single array** instead of one by one. `fn.apply(obj, [a, b, c])` does the same thing as `fn.call(obj, a, b, c)`. The `this` rules are identical — strict functions receive the value as given, sloppy ones turn `null`/`undefined` into the global object — and so are the exceptions: arrows and bound functions ignore the `thisArg`.

```javascript title="apply-basics.mjs"
function introduce(greeting, punctuation) {
  return `${greeting}, I am ${this.name}${punctuation}`;
}

const ada = { name: 'Ada' };
const args = ['Hello', '.'];

console.log(introduce.apply(ada, args));
console.log(introduce.call(ada, ...args));   // the modern equivalent
```

```output
Hello, I am Ada.
Hello, I am Ada.
```

### Why `apply` existed

Before ES2015, JavaScript had no spread syntax. If the arguments you wanted to pass were already in an array of unknown length, there was no way to write `fn(a, b, c, …)` for them. `apply` was the only way to "unpack" an array into an argument list. The best-known example finds the largest number in an array:

```javascript title="apply-max.mjs"
const scores = [72, 95, 88, 61];

console.log(Math.max.apply(null, scores));  // pre-ES2015 idiom
console.log(Math.max(...scores));           // modern: spread
console.log(Math.max.apply(null, []));      // no arguments at all
```

```output
95
95
-Infinity
```

`Math.max` ignores `this`, so `null` is only a placeholder. With an empty array it receives no arguments and returns `-Infinity`, the same as `Math.max()` — worth knowing, because code that expects a number from an empty list gets a surprising value.

Today, spread does the unpacking: `fn(...args)` when `this` does not matter, `fn.call(thisArg, ...args)` when it does. `apply` remains common in older code, in polyfills and in interview questions, and it is still the shortest way to forward the `arguments` object.

### What the second argument may be

The second argument must be an **array-like** object — anything with a `length` and numbered properties — or `null`/`undefined` for "no arguments". Real arrays, the `arguments` object, typed arrays and objects such as `{ 0: 'a', length: 1 }` all work. A primitive does not, not even a string:

```javascript title="apply-args.mjs"
function count() { return arguments.length; }

console.log(count.apply(null), count.apply(null, undefined));
console.log(count.apply(null, { length: 2, 0: 'a' }));   // array-like: 2 args

try {
  count.apply(null, 'ab');
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
0 0
2
TypeError: CreateListFromArrayLike called on non-object
```

The array-like with `length: 2` produced two arguments, `'a'` and `undefined`, because `apply` reads indices `0` to `length - 1` whether or not they exist. The error message names the specification step that copies the array-like into an argument list.

### Forwarding all arguments in a wrapper

The pattern where `apply` still shines is a wrapper that must call another function with *the same `this` and the same arguments* it received. Inside a regular function, `this` is the wrapper's receiver and `arguments` holds whatever was passed, so `fn.apply(this, arguments)` forwards both in one step:

```javascript title="apply-forward.mjs"
function logged(fn) {
  return function () {
    console.log(`calling ${fn.name} with`, [...arguments]);
    return fn.apply(this, arguments);       // same this, same arguments
  };
}

const account = {
  balance: 100,
  deposit(amount) { this.balance += amount; return this.balance; },
};
account.deposit = logged(account.deposit);

console.log(account.deposit(25));
```

```output
calling deposit with [ 25 ]
125
```

`account.deposit(25)` calls the wrapper as a method, so the wrapper's `this` is `account`, and `apply` passes it on. The wrapper must be a regular function: an arrow wrapper would have no `this` of its own and would forward the wrong one. A modern version reads `function (...args) { return fn.apply(this, args); }` or `fn.call(this, ...args)` — the same idea with rest parameters. Real `debounce` and `throttle` utilities do exactly this ([[b1-impl-debounce-throttle]]).

### Limits on very large arrays

Each argument of a function call occupies space on the call stack ([[b1-call-stack]]). Passing a huge array through `apply` — or through spread, which has the same limit — can exceed it. In Node.js 22, `Math.max.apply(null, arr)` succeeded with 100,000 numbers and threw `RangeError: Maximum call stack size exceeded` with 200,000. The exact threshold depends on the engine, its version and the available stack, so treat it as unpredictable. For arrays whose size you do not control, use a loop or `reduce` (`arr.reduce((m, x) => Math.max(m, x), -Infinity)`), which has no such limit.

### `Reflect.apply`

ES2015 added `Reflect.apply(fn, thisArg, argsList)`, a standalone function that does the same as `fn.apply(thisArg, argsList)`. It has two small advantages: it works even if `fn` has its own property named `apply` that shadows the inherited one, and it insists on an argument list (omitting it throws a `TypeError` instead of meaning "no arguments"). It is mainly used in meta-programming such as `Proxy` handlers ([[b1-reflect]]).

## bind {#b1-bind}

**`Function.prototype.bind`** does not call the function. It returns a **new function**, called a **bound function**, that remembers a `this` value — and optionally some leading arguments — and uses them every time it is called. `fn.bind(obj)` gives you a function that, whenever and however it is invoked, runs `fn` with `this` set to `obj`. The original `fn` is unchanged.

```javascript title="bind-basics.mjs"
const counter = {
  count: 0,
  increment() {
    this.count += 1;
    return this.count;
  },
};

const detached = counter.increment;
const bound = counter.increment.bind(counter);

try {
  detached();
} catch (err) {
  console.log(err.message);
}

console.log(bound(), bound());
setTimeout(bound, 0);                       // safe to hand to any API
setTimeout(() => console.log('count is now', counter.count), 10);
```

```output
Cannot read properties of undefined (reading 'count')
1 2
count is now 3
```

`detached()` is a plain call, so `this` is `undefined` and the method throws. `bound()` is also a plain call, but a bound function ignores the call shape and always uses the `this` it stored — so it increments `counter`. Passing `bound` to `setTimeout` works for the same reason; when the timer fires, the count reaches 3. (The second timer uses a longer delay so that it runs after the first; timers with the same delay run in the order they were set.)

### The bound `this` is permanent

A bound function's `this` cannot be changed afterwards by anything except `new`. Calling it as a method, with `call` or `apply`, or binding it again all leave the original `this` in place. This is called **hard binding**:

```javascript title="bind-permanent.mjs"
function who() { return this.id; }

const toOne = who.bind({ id: 1 });
const rebound = toOne.bind({ id: 2 });       // tries to bind again
const holder = { id: 3, who: toOne };

console.log(toOne(), rebound(), toOne.call({ id: 4 }), holder.who());
```

```output
1 1 1 1
```

Every call prints `1`. Binding an already-bound function creates yet another function, but its `this` has no effect: the inner bound function ignores whatever `this` it receives. If you might need a different `this` later, keep a reference to the original, unbound function.

The one exception is `new`. Calling a bound function with `new` creates a fresh object in the usual way and ignores the bound `this`; preset arguments are still passed. This rarely matters in practice, but it is a favourite follow-up question, and the details are in [[b1-this-new]].

### Partial application

Arguments passed to `bind` after `thisArg` are **preset**: they are placed in front of any arguments supplied when the bound function is called. Fixing some of a function's arguments in advance to create a more specific function is called **partial application** ([[b1-currying]]):

```javascript title="bind-partial.mjs"
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);       // a is fixed to 2
console.log(double(5), double(7));
console.log(double.name, double.length);

function log(level, area, message) {
  return `[${level}] ${area}: ${message}`;
}
const authWarning = log.bind(null, 'WARN', 'auth');
console.log(authWarning('token expires in 5 minutes'));
```

```output
10 14
bound multiply 1
[WARN] auth: token expires in 5 minutes
```

`multiply` does not use `this`, so `null` is a placeholder. Note the bound function's properties: its `name` is `"bound "` plus the original name, which makes bound functions recognisable in stack traces and dev tools, and its `length` — the number of parameters it expects — is the original's `length` minus the number of preset arguments (never below 0). Many developers write partial application with an arrow instead, `(b) => multiply(2, b)`, which reads more clearly and does not involve `this` at all; `bind` is shorter when there are several preset arguments.

### Every `bind` call creates a new function

`bind` always returns a brand-new function object, even when called twice with the same arguments: `fn.bind(obj) === fn.bind(obj)` is `false`. That matters wherever **function identity** matters.

The first place is **removing event listeners**. `removeEventListener` only removes a listener if you pass *the same function object* you added. Code that adds `this.onResize.bind(this)` and later removes `this.onResize.bind(this)` removes nothing, and the listener — plus the object it keeps alive — stays registered. The fix is to bind once, store the result (often in the constructor: `this.onResize = this.onResize.bind(this)`), and use the stored function for both calls. [[b1-this-lost]] shows this running.

The second place is **React**. In React class components ([[b4-class-components-foundations]]), handlers were bound once in the constructor rather than in `render`, because `onClick={this.handleClick.bind(this)}` creates a new function on every render. A child component wrapped in `React.memo` or extending `PureComponent` compares props by identity, sees a new function each time and re-renders even though nothing changed. Function components avoid `this`, and keep handler identity stable with [[b4-usecallback]] when it matters.

### `bind` compared with an arrow wrapper

`obj.method.bind(obj)` and `() => obj.method()` both produce a function that calls `method` with `this === obj`, and both are fine in most code. The differences are small but real:

| | `obj.method.bind(obj)` | `(...args) => obj.method(...args)` |
|---|---|---|
| When `obj` and `method` are looked up | Once, when `bind` runs | Every time the wrapper is called |
| If `obj.method` is later replaced | Still calls the old function | Calls the new one |
| Preset arguments | Built in | Written by hand |
| Readability | Says "fix `this`" | Says "call this method" |

The lookup timing is the one that can surprise you. A bound function captures the function value at bind time, so patching `obj.method` afterwards — as test mocks often do — does not affect it. An arrow wrapper sees the patch.

### Bound functions in classes

Binding in the constructor is the classic way to give a class method a stable `this`:

```javascript title="bind-constructor.mjs"
class Clock {
  constructor() {
    this.ticks = 0;
    this.tick = this.tick.bind(this);         // own property shadows the prototype method
  }
  tick() {
    this.ticks += 1;
  }
}

const clock = new Clock();
const handler = clock.tick;                   // safe to detach
handler();
handler();
console.log(clock.ticks, Object.hasOwn(clock, 'tick'), 'tick' in Clock.prototype);
```

```output
2 true true
```

The constructor reads `tick` from the prototype, binds it to the new instance and stores the bound version as an own property, which takes priority when you read `clock.tick`. The prototype method still exists, so a subclass can override `tick` and call `super.tick()`, which the alternative — an arrow class field — does not allow (compared in [[b1-this-arrow]]). The cost is one bound function per instance, the same as an arrow field.

## Function Borrowing {#b1-function-borrowing}

**Function borrowing** means running a method that belongs to one kind of object on a different object, by calling it with `call` or `apply` and passing that object as `this`. The borrowed method is not copied or attached anywhere; it runs once with the other object as its receiver. It works whenever the method only relies on things the other object actually has — usually a `length` and numbered properties, or a particular property name.

The classic case is the `arguments` object. Inside a regular function, `arguments` holds every argument passed, with indices and a `length`, but it is not an array: it has no `map`, `slice` or `filter`. For years the standard fix was to borrow `Array.prototype.slice`:

```javascript title="borrow-arguments.mjs"
function toArray() {
  return Array.prototype.slice.call(arguments);   // borrow slice for arguments
}
console.log(toArray(1, 2, 3));

function sum() {
  return Array.prototype.reduce.call(arguments, (total, n) => total + n, 0);
}
console.log(sum(4, 5, 6));
```

```output
[ 1, 2, 3 ]
15
```

`slice` was written for arrays, but it never checks that `this` is an array. It reads `this.length`, then reads `this[0]`, `this[1]` and so on, and builds a new array from them. `arguments` has those properties, so the borrowed method works.

### Why array methods can be borrowed

The ECMAScript specification deliberately makes most `Array.prototype` methods **generic**: they convert `this` to an object and read its `length`, and they never require it to be a real array. That is why they work on any **array-like** object — anything with a `length` and indexed properties:

```javascript title="borrow-array-like.mjs"
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

console.log(Array.prototype.map.call(arrayLike, (s) => s.toUpperCase()));
console.log(Array.prototype.join.call(arrayLike, '-'));
console.log(Array.prototype.filter.call('a1b2c3', (ch) => ch >= '0' && ch <= '9'));
```

```output
[ 'A', 'B', 'C' ]
a-b-c
[ '1', '2', '3' ]
```

Strings are array-like too — they have a `length` and indexed characters — so read-only array methods work on them. Two caveats apply. Strings are indexed by UTF-16 code units, so an emoji made of two units is visited as two separate halves. And strings are immutable, so methods that write to `this`, such as `reverse` or `sort`, throw a `TypeError` when borrowed for a string: convert with `Array.from(str)` or `[...str]` first.

In the browser, `document.querySelectorAll` returns a `NodeList` and `element.children` returns an `HTMLCollection`. Both are array-like. Modern `NodeList`s have `forEach` but not `map` or `filter`, and `HTMLCollection` has neither, so `Array.prototype.map.call(document.querySelectorAll('a'), (a) => a.href)` was a common idiom. (Browser-only; not run here.)

### Borrowing `Object.prototype` methods

The other family of borrowed methods comes from `Object.prototype`. Two are worth knowing.

**`hasOwnProperty` on objects that do not inherit it.** An object created with `Object.create(null)` — often used as a plain dictionary — has no prototype, so it has no `hasOwnProperty` method. An object might also have its own property named `hasOwnProperty` that hides the real one. Borrowing the method from `Object.prototype` works in both cases:

```javascript title="borrow-hasown.mjs"
const dict = Object.create(null);
dict.apple = 3;

try {
  dict.hasOwnProperty('apple');
} catch (err) {
  console.log(err.message);
}

console.log(Object.prototype.hasOwnProperty.call(dict, 'apple'));
console.log(Object.hasOwn(dict, 'apple'));       // ES2022 replacement
```

```output
dict.hasOwnProperty is not a function
true
true
```

ES2022's `Object.hasOwn(obj, key)` exists precisely to replace this borrowing idiom; prefer it in new code ([[b1-own-vs-inherited]]).

**`toString` for reliable type tags.** `Object.prototype.toString`, borrowed for any value, returns a string like `"[object Array]"` that names the value's built-in type. Unlike `typeof`, it distinguishes arrays, dates, regular expressions and `null`:

```javascript title="borrow-tostring.mjs"
const tag = (value) => Object.prototype.toString.call(value).slice(8, -1);

console.log(tag([]), tag(null), tag(new Date()), tag(/x/), tag(undefined));
```

```output
Array Null Date RegExp Undefined
```

Objects can customise this tag with `Symbol.toStringTag` ([[b1-tostringtag]]), so it is a convention rather than a guarantee.

### What cannot be borrowed

Borrowing works only for methods that use ordinary properties of `this`. Many built-in methods instead read **internal slots** — hidden storage that only real instances have, such as a `Date`'s time value or a `Map`'s entries. Borrowing those for a plain object fails:

```javascript title="borrow-fails.mjs"
try {
  Date.prototype.getTime.call({});
} catch (err) {
  console.log(err.message);
}

try {
  Map.prototype.get.call({}, 'key');
} catch (err) {
  console.log(err.message);
}
```

```output
this is not a Date object.
Method Map.prototype.get called on incompatible receiver #<Object>
```

Methods that *modify* `this` can be borrowed, but the result may surprise you. `Array.prototype.push.call(obj, 'a')` on a plain object writes `obj[0] = 'a'` and sets `obj.length = 1`, quietly turning the object into an array-like. That is correct behaviour for a generic method, but rarely what you intended.

### Borrowing versus `Array.from` and spread

Most borrowing of array methods predates ES2015. Today, convert the array-like once and use normal array methods: `Array.from(arguments)` or `[...arguments]`, `Array.from(nodeList, (node) => node.textContent)`, and rest parameters (`function sum(...nums)`) instead of `arguments` altogether ([[b1-array-from-isarray]]). These read more clearly and give you a real array to keep.

There is one behavioural difference to know about: **holes**. `Array.prototype.map.call({ length: 3, 0: 'a', 2: 'c' }, fn)` skips the missing index 1 and leaves a hole in the result, while `Array.from` treats the missing index as `undefined` and calls the mapping function for it. Code that converts with `Array.from` and code that borrows `map` can therefore produce different results for sparse array-likes.

Borrowing remains useful for `Object.prototype.toString`, for one-off reuse of a method between objects of the same shape, and for understanding older code and libraries.

## Choosing between the three

| You want to… | Use |
|---|---|
| Run a function once with a specific `this`, arguments written out | `call` |
| Run a function once with a specific `this`, arguments already in an array | `call` with spread, or `apply` |
| Forward `this` and all arguments inside a wrapper | `fn.apply(this, arguments)` or `fn.call(this, ...args)` |
| Hand a method to another API and keep its object | `bind`, or an arrow wrapper |
| Keep one stable function to add and later remove as a listener | `bind` once and store it |
| Preset some arguments | `bind` with extra arguments, or an arrow |
| Run an array method on an array-like | Prefer `Array.from`; borrow with `call` if needed |

## How it works internally

The specification defines `call` and `apply` directly in terms of the engine's internal call operation. `fn.call(thisArg, ...args)` checks that `fn` is callable (throwing a `TypeError` otherwise) and then performs the same internal **[[Call]]** that a normal function call performs, with `thisArg` as the `this` candidate and `args` as the argument list. `apply` does the same after converting its array-like into a list. From that point on the called function treats the candidate exactly as described in [[b1-this]]: arrows ignore it, strict functions use it as given, sloppy functions substitute the global object for `null`/`undefined`.

`bind` creates a **bound function exotic object** — a special function object with three internal slots: the target function, the bound `this` and the bound arguments. Calling it performs [[Call]] on the target with the stored `this` and with the stored arguments followed by the new ones; the `this` supplied by the call itself is never consulted. Constructing it with `new` forwards to the target's construct behaviour, which creates a new object, so the bound `this` is ignored. A bound function has no `prototype` property of its own; `instanceof` with a bound function on the right checks against the target's prototype.

### Implementing them yourself

"Write your own `bind`" is a common interview task. Simplified versions show the mechanics:

```javascript title="polyfills.mjs"
Function.prototype.myCall = function (thisArg, ...args) {
  const fn = this;                            // the function myCall was called on
  const receiver = thisArg == null ? globalThis : Object(thisArg);
  const key = Symbol('fn');                   // unique key: cannot clash
  receiver[key] = fn;
  try {
    return receiver[key](...args);            // implicit binding does the work
  } finally {
    delete receiver[key];
  }
};

Function.prototype.myApply = function (thisArg, args) {
  return this.myCall(thisArg, ...(args == null ? [] : Array.from(args)));
};

Function.prototype.myBind = function (thisArg, ...preset) {
  const target = this;
  return function bound(...later) {
    if (new.target) return new target(...preset, ...later); // new beats bind
    return target.apply(thisArg, [...preset, ...later]);
  };
};

function intro(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const ada = { name: 'Ada' };

console.log(intro.myCall(ada, 'Hello', '.'));
console.log(intro.myApply(ada, ['Hi', '.']));
const hey = intro.myBind(ada, 'Hey');
console.log(hey('?'), hey.call({ name: 'Grace' }, '?'));

function Point(x, y) { this.x = x; this.y = y; }
const OnYAxis = Point.myBind(null, 0);
console.log(new OnYAxis(5), Object.keys(ada));
```

```output
Hello, Ada.
Hi, Ada.
Hey, Ada? Hey, Ada?
Point { x: 0, y: 5 } [ 'name' ]
```

`myCall` turns explicit binding into implicit binding: it temporarily stores the function on the receiver under a `Symbol` key (so it cannot overwrite a real property), calls it as a method, and removes it in `finally` so it is cleaned up even if the function throws. `Object.keys(ada)` at the end confirms nothing was left behind. `myBind` returns a closure ([[b1-closures]]) that remembers `target`, `thisArg` and `preset`; the `new.target` check gives `new` priority, as the built-in does.

These versions are teaching tools, not exact copies. `myCall` always behaves like a sloppy function — it substitutes `globalThis` and wraps primitives even for strict targets, and it briefly adds a property, which fails on frozen objects. `myBind` does not set the bound function's `name` or `length`, and `new OnYAxis()` works through the target rather than through a true bound-function object. Being able to name these differences is part of a strong interview answer.

## Worked example: a wrapper that keeps `this`

A frequent real-world task is adding behaviour around existing methods — timing, logging, retry — without editing them. The wrapper must preserve `this`, or every method it wraps breaks. Here is a broken version and a correct one, side by side:

```javascript title="timed.mjs"
function timedBroken(fn) {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);               // plain call: this is lost
    console.log(`${fn.name} took ${Math.round(performance.now() - start)}ms`);
    return result;
  };
}

function timed(fn) {
  return function (...args) {                 // regular function: has its own this
    const start = performance.now();
    const result = fn.apply(this, args);      // forward this and arguments
    console.log(`${fn.name} took ${Math.round(performance.now() - start)}ms`);
    return result;
  };
}

const repo = {
  rows: ['a', 'b', 'c'],
  count(filter) { return this.rows.filter((r) => r !== filter).length; },
};

const broken = { ...repo, count: timedBroken(repo.count) };
const fixed = { ...repo, count: timed(repo.count) };

try {
  broken.count('b');
} catch (err) {
  console.log(err.message);
}
console.log(fixed.count('b'));
```

```output
Cannot read properties of undefined (reading 'rows')
count took 0ms
2
```

Step by step. `broken.count('b')` calls the arrow wrapper as a method, but an arrow has no `this` of its own, and inside it `fn(...args)` is a plain call — so `count` runs with `this` as `undefined` and throws on `this.rows`. `fixed.count('b')` calls a regular function as a method, so the wrapper's `this` is `fixed`; `fn.apply(this, args)` passes that `this` and the argument `'b'` to the original `count`, which counts the two rows that are not `'b'`. The `0ms` reading depends on machine speed; a fast machine rounds it to zero.

Two choices made the wrapper correct: it is a **regular function**, so it receives the caller's `this`, and it uses **`apply` (or `call`)** to pass that `this` on. Change either and methods break.

## In real systems

**Utility libraries.** Lodash's `debounce`, `throttle`, `memoize` and `once`, and their hand-written equivalents in most codebases, all use `func.apply(thisArg, args)` internally, capturing `this` from the wrapper's call so the wrapped method keeps working ([[b1-impl-debounce-throttle]]).

**Event-driven classes.** UI code that registers DOM or Node.js `EventEmitter` listeners commonly binds handlers once in the constructor and stores them, so that a `destroy()` or `disconnect()` method can remove exactly the same functions. Forgetting this is a common memory-leak source in single-page applications ([[b3-remove-event-listener]]).

**Legacy inheritance.** Before `class` and `extends`, inheritance between constructor functions called the parent with `Parent.call(this, …args)` to initialise the child instance. You still see this in older libraries and in transpiled code ([[b1-constructor-functions]]).

**Polyfills and frameworks.** Libraries that patch or wrap built-in methods use `Function.prototype.call.bind(Array.prototype.slice)` — a trick sometimes called "uncurrying `this`" — to obtain a version of a method that takes its receiver as the first argument. This protects them from user code that replaces methods on prototypes later.

**Proxies and meta-programming.** `Proxy` handlers forward calls with `Reflect.apply(target, thisArg, args)`, which is the reflective twin of `apply` ([[b1-proxy]]).

## Trade-offs and alternatives

The three methods give precise control over `this`, but each use of them is a sign that the code depends on dynamic `this`. Modern JavaScript offers alternatives that often read better:

| Need | Explicit-binding solution | Common alternative |
|---|---|---|
| Spread an array into arguments | `fn.apply(null, arr)` | `fn(...arr)` |
| Keep a method's `this` in a callback | `obj.m.bind(obj)` | `() => obj.m()`, or an arrow class field |
| Preset arguments | `fn.bind(null, a)` | `(b) => fn(a, b)` |
| Array method on an array-like | `Array.prototype.map.call(x, f)` | `Array.from(x, f)` |
| Check an own property safely | `Object.prototype.hasOwnProperty.call(o, k)` | `Object.hasOwn(o, k)` |
| Forward `this` in a wrapper | `fn.apply(this, args)` | No real alternative; this is the right tool |

Performance is rarely a reason to choose. Modern engines optimise `call`, `apply` and bound functions well, and the cost difference from a direct call is negligible outside very hot loops. The costs that do matter are **allocation and identity**: `bind` and arrow wrappers both create a new function each time they run, so create them once and reuse them, rather than inside render functions or loops.

## Common mistakes

**Confusing `bind` with `call`.** `button.addEventListener('click', view.render.call(view))` runs `render` immediately and registers its *return value* (usually `undefined`) as the listener. Use `bind`, which returns a function, or an arrow wrapper.

**Passing an array to `call` or separate values to `apply`.** `fn.call(obj, [1, 2])` passes one argument — the whole array. `fn.apply(obj, 1, 2)` throws, because `1` is not array-like. Match the method to the shape of your arguments.

**Expecting `call` or `bind` to change an arrow function's `this`.** The `thisArg` is silently ignored. If a function needs a call-time `this`, write it as a regular function.

**Re-binding a bound function.** `fn.bind(a).bind(b)` still uses `a`. Bind the original function if you need a different `this`.

**Binding inline when adding a listener you will remove.** Two `bind` calls produce two different functions, so `removeEventListener` silently fails. Bind once and store the reference.

> [!MISTAKE] Writing a wrapper as an arrow function
> A wrapper that must forward `this` cannot be an arrow, because an arrow has no `this` to forward. `const wrap = (fn) => (...args) => fn.apply(this, args)` passes the module's `this`, not the caller's. The inner function must be a regular `function`.

## Interview perspective

Interviewers use these methods to check whether you really understand `this`, and "implement `bind`" is a standard coding question.

> [!INTERVIEW] What a strong answer sounds like
> "`call` and `apply` both invoke the function immediately with the `this` I pass; `call` takes arguments individually and `apply` takes an array, which spread has mostly replaced. `bind` doesn't invoke anything — it returns a new function with `this` and any leading arguments fixed. A bound function's `this` can't be changed by `call` or another `bind`, only by `new`, and none of them affect arrow functions."

Questions you should be able to answer:

- **Difference between `call`, `apply` and `bind`?** Timing (now, now, later) and argument shape (list, array, partial list).
- **What does `bind` return, and is it the same function each time?** A new bound function; every `bind` call creates a new one, which matters for listener removal and React props.
- **Can `call` override a bound function's `this`?** No. Can `new`? Yes — `new` creates a fresh object and ignores the bound `this`.
- **Find the maximum of an array with `apply`.** `Math.max.apply(null, arr)`; mention `Math.max(...arr)` and the large-array `RangeError` that affects both.
- **How would you convert `arguments` to an array?** `Array.prototype.slice.call(arguments)` historically; `Array.from(arguments)`, `[...arguments]` or rest parameters today.
- **Implement `call` and `bind`.** Temporarily attach the function to the receiver under a `Symbol` and call it as a method; for `bind`, return a closure that applies the target with the stored `this` and concatenated arguments, and handle `new.target`.

A good follow-up to anticipate: *"What are the limitations of your polyfill?"* Mention strict-mode `thisArg` handling, frozen receivers, missing `name`/`length`, and that a true bound function is a special object rather than a closure.

```quiz
Q: What does `button.addEventListener('click', view.render.call(view))` register as the listener?
- [ ] A function that calls `render` with `this === view` on each click
- [x] The value `render` returned when it was called immediately
- [ ] Nothing; `call` throws inside `addEventListener`
- [ ] A bound copy of `render`
> `call` runs the function right away and evaluates to its return value, so the listener is whatever `render` returned — usually `undefined`, which registers nothing useful. `bind` is the method that returns a function for later.

Q: `function who() { return this.id; }` — what does `who.bind({ id: 1 }).bind({ id: 2 }).call({ id: 3 })` return?
- [x] `1`
- [ ] `2`
- [ ] `3`
- [ ] `undefined`
> The first `bind` fixes `this` permanently. The second `bind` creates another function, but the `this` it passes is ignored by the inner bound function, and so is the `this` from `call`. Only `new` overrides a bound `this`.

Q: Why does `Array.prototype.map.call(arrayLike, fn)` work on `{ 0: 'a', 1: 'b', length: 2 }` while `Map.prototype.get.call({}, 'k')` throws?
- [ ] `call` only works with methods from `Array.prototype`
- [x] Array methods are generic and use only `length` and indexed properties, while `Map.prototype.get` needs the internal storage only real `Map` objects have
- [ ] Plain objects cannot be used as `this`
- [ ] `Map.prototype.get` is an arrow function
> The specification makes most array methods work on any object with a `length` and indices. `Map` methods read an internal slot holding the map's entries; a plain object has no such slot, so the engine throws an "incompatible receiver" `TypeError`.

Q: A `debounce(fn)` utility returns `(...args) => { setTimeout(() => fn.apply(this, args), 100); }`. What happens when it wraps a method and is called as `obj.save()`?
- [ ] `save` runs with `this === obj`
- [x] `save` runs with the `this` of the code where `debounce` was defined, not `obj`
- [ ] It throws a syntax error
- [ ] `save` runs with `this` set to the timer
> The returned wrapper is an arrow function, so it has no `this` of its own and cannot receive `obj` from the method call. `this` inside it is the `this` of `debounce`'s scope. The outer returned function must be a regular `function` so it can capture `obj` and forward it with `apply`; the inner timer callback can stay an arrow.
```

## Practice

1. **Rewrite with spread.** Convert `Math.min.apply(null, values)`, `fn.apply(ctx, args)` and `Array.prototype.push.apply(a, b)` to modern syntax. Which one still needs `call`?
2. **Borrow safely.** Write `countVowels(str)` by borrowing `Array.prototype.filter` for the string. Then explain what would happen if you borrowed `Array.prototype.reverse` instead, and fix it.
3. **Listener manager.** Write a class `ResizeWatcher` with `start()` and `stop()` methods that add and remove a listener on an `EventTarget`, using a handler bound once in the constructor. Prove that `stop()` really removes it.
4. **Partial application.** Using `bind`, create `toHex` and `toBinary` from `function format(radix, n) { return n.toString(radix); }`. Then write the same with arrows and compare the bound functions' `name` and `length` with the arrows'.
5. **Polyfill gaps.** Extend `myBind` so the returned function has the correct `name` (`"bound " + target.name`) and `length`. Then make `myCall` respect strict targets by not wrapping primitives — and explain why this is hard to detect from inside a polyfill.

## Quick revision {#quick-revision}

- `fn.call(thisArg, a, b)` — run now, arguments one by one; returns `fn`'s result.
- `fn.apply(thisArg, [a, b])` — run now, arguments as an array-like (`null`/`undefined` means none; a primitive throws `TypeError`).
- `fn.bind(thisArg, a)` — returns a new function with `this` fixed and `a` preset; does not run `fn`.
- Strict functions get `thisArg` exactly; sloppy ones turn `null`/`undefined` into `globalThis` and box primitives.
- Arrows ignore `thisArg` from all three. Bound functions ignore later `call`/`apply`/`bind`; only `new` overrides them.
- Bound function: `name` is `"bound " + name`, `length` is reduced by preset arguments, no own `prototype`.
- Every `bind` creates a new function — store it to remove listeners; avoid binding in render.
- Spread replaces most `apply`; very large arrays overflow the stack with both (Node.js 22: fine at 100,000, `RangeError` at 200,000).
- Forward `this` in wrappers with a regular function and `fn.apply(this, args)`.
- Borrowing: generic array methods work on array-likes and strings (read-only methods only for strings); `Object.prototype.toString.call(v)` gives type tags; `Object.hasOwn` replaces `hasOwnProperty.call`; methods using internal slots (`Date`, `Map`) cannot be borrowed.

## Key takeaways {#key-takeaways}

- `call` and `apply` run a function immediately with a chosen `this`; they differ only in how arguments are passed.
- `bind` returns a new, permanently bound function for later use, optionally with preset arguments.
- A bound `this` cannot be changed by `call`, `apply` or another `bind`; only `new` ignores it, and arrow functions ignore all three.
- Each `bind` call produces a distinct function, so bind once when identity matters.
- Function borrowing works because many built-in methods are generic; prefer `Array.from`, spread and `Object.hasOwn` in new code.
- Wrappers that must preserve `this` are regular functions that forward with `apply` or `call`.
