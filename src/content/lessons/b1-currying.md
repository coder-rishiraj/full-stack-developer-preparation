---
summary: Currying turns a function of several arguments into a chain of functions that each take one, and partial application fixes some arguments now and leaves the rest for later. You will learn how both work through closures, how to write a generic curry and where it breaks, and how compose and pipe chain small functions into readable data pipelines.
difficulty: intermediate
minutes: 50
objectives:
  - Distinguish currying from partial application and implement each by hand
  - Implement a generic curry function and explain how it uses closures, rest parameters and fn.length
  - Debug currying failures caused by default parameters, rest parameters and shared mutable state
  - Implement compose and pipe with reduce and predict the order in which their steps run
  - Decide when curried, composed code improves a codebase and when it hurts readability
---

## Introduction

Many functions receive their arguments at different times. A logging function needs a module name, a severity and a message, but the module name is known when the file loads, while each message only arrives when something happens. An HTTP helper needs a base URL, a method and a path, but the base URL is fixed for the whole application. A click handler for a form field needs to know *which* field it handles when the form is rendered, and the event only when the user types.

The usual workaround is to pass the same early arguments over and over, or to stash them in variables that every call must reach. A cleaner solution is to supply the early arguments once and get back a new function that remembers them and waits for the rest. Two closely related techniques do this:

- **Partial application** fixes some of a function's arguments and returns a function that takes the remaining ones. From `request(method, baseUrl, path)`, partially applying `'GET'` and the base URL gives `getFromApi(path)`.
- **Currying** transforms a function of several arguments into a sequence of functions that each take one argument. `volume(l, w, h)` becomes `volume(l)(w)(h)`. Once a function is curried, supplying its first argument *is* partial application.

Both are built from closures, which you already know: a returned function keeps access to the variables of the function that created it. The name comes from the logician Haskell Curry, and in languages such as Haskell every function is curried automatically. JavaScript does not do that; you curry by writing functions that return functions, or with a helper.

Currying also leads directly to **function composition**: if every step of a data transformation is a function of one argument, you can join the steps into a pipeline with `compose` or `pipe`. That technique is taught in the second half of this lesson. These ideas appear in real code more than their academic names suggest — Redux middleware is curried, React event handlers are often curried, and utility libraries such as Lodash and Ramda ship `curry`, `partial`, `flow` and `compose`.

## Before you start

- **Closures** — a function remembers the variables in scope where it was created. See [[b1-closures]]. Every technique in this lesson is a closure holding arguments.
- **Functions as values** — passing functions as arguments and returning them from other functions. See [[b1-first-class-functions]].
- **Rest and spread** — `(...args)` collects arguments into an array, and `fn(...arr)` spreads an array into arguments. See [[b1-parameters]] and [[b1-spread-rest]].
- **Arrow functions** — the compact syntax used for curried functions. See [[b1-arrow-functions]].
- **`reduce`** — folding an array into one value, which is how `compose` and `pipe` are implemented. See [[b1-array-map-filter-reduce]].

## The intuition

Think of ordering a custom sandwich at a counter with several stations. At the first station you choose the bread, and the server hands your order slip to the next station. At the second you choose the filling; at the third, the sauce. Only after the last station is the sandwich made. At any point, the slip in progress *remembers* your earlier choices — and a regular customer can keep a pre-filled slip ("sourdough, chicken") and only choose the sauce each day.

A curried function is that line of stations: each call takes one choice and returns the next station, carrying the earlier choices with it. Partial application is the pre-filled slip: some choices are fixed in advance, and the remaining ones are supplied later, possibly many times. Where the analogy stops: a real slip is a single object, but in JavaScript every partially applied function is a separate, independent function. Using a pre-filled slip does not change it, so you can reuse it as often as you like.

## Currying by hand

The most direct way to curry is to write nested arrow functions:

```javascript title="curry-by-hand.js"
function volume(l, w, h) { return l * w * h; }
const curriedVolume = (l) => (w) => (h) => l * w * h;

console.log(volume(2, 3, 4));
console.log(curriedVolume(2)(3)(4));

const base2 = curriedVolume(2);        // remembers l = 2
const base2by3 = base2(3);             // remembers l = 2, w = 3
console.log(base2by3(4), base2by3(10));
console.log(typeof base2, base2.length);
```

```output
24
24
24 60
function 1
```

Read `(l) => (w) => (h) => l * w * h` from the left: a function that takes `l` and returns a function that takes `w` and returns a function that takes `h` and finally computes the product. `curriedVolume(2)(3)(4)` is three calls in a row; each call's result is the next function.

The intermediate results are the point. `base2` is a function of one argument (`base2.length` is `1`) whose closure holds `l = 2`. `base2by3` holds both `l = 2` and `w = 3`, and it can be called any number of times with different heights. Nothing is computed until the last argument arrives.

This style is clear when the number of stages is small and fixed. Its cost is that callers must use the `f(a)(b)(c)` syntax; `curriedVolume(2, 3, 4)` would ignore the extra arguments and return a function.

## Partial application

Partial application does not require a function to be curried. A general helper takes a function plus some leading arguments and returns a function for the rest:

```javascript title="partial.js"
function partial(fn, ...preset) {
  return (...later) => fn(...preset, ...later);
}

function request(method, baseUrl, path) {
  return `${method} ${baseUrl}${path}`;
}

const getFromApi = partial(request, 'GET', 'https://api.example.com');
console.log(getFromApi('/users'));
console.log(getFromApi('/orders/42'));

const postViaBind = request.bind(null, 'POST', 'https://api.example.com');
console.log(postViaBind('/users'));
console.log(postViaBind.name, postViaBind.length, request.length);
```

```output
GET https://api.example.com/users
GET https://api.example.com/orders/42
POST https://api.example.com/users
bound request 1 3
```

`partial` stores `preset` in its closure. The returned function collects whatever it is later called with into `later`, and calls the original with both lists spread in order. The fixed arguments are always the leftmost ones.

JavaScript has partial application built in: **`Function.prototype.bind`**. Its first argument sets `this` for the new function (`null` here, because `request` does not use `this`), and any further arguments are fixed as leading arguments. The **bound function** also reports useful metadata: its `name` is `"bound request"` and its `length` is the original length minus the number of bound arguments, here `3 - 2 = 1`. `bind` is the right choice when you also need to fix `this` — for example, passing an object's method as a callback. For arrow functions, which ignore any bound `this`, it fixes arguments only. See [[b1-bind]].

The **difference between the two techniques** is worth stating precisely, because interviewers ask it:

| | Currying | Partial application |
|---|---|---|
| What it produces | A chain of functions, normally one argument each | One function taking the remaining arguments |
| How many arguments are fixed | Exactly one per call (strict form) | Any number, all at once |
| Applied to | The function's definition (a transformation) | A particular call (a use) |
| Example | `f(a, b, c)` becomes `f(a)(b)(c)` | `f(a, b, c)` with `a` fixed becomes `g(b, c)` |

They meet in practice: calling a curried function with its first argument is a partial application, and most "curry" helpers in libraries allow several arguments per call, blurring the line.

## A generic curry function

Writing nested arrows by hand for every function is tedious. A **generic curry** helper takes an ordinary function and returns a curried version that collects arguments until it has enough, then calls the original. This is a common interview implementation question.

```javascript title="curry.js"
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);                 // enough arguments: call through
    }
    return (...more) => curried.apply(this, [...args, ...more]);  // wait for more
  };
}

const volume = (l, w, h) => l * w * h;
const cv = curry(volume);
console.log(cv(2)(3)(4), cv(2, 3)(4), cv(2)(3, 4), cv(2, 3, 4));

const withL2 = cv(2);
console.log(withL2(3)(4), withL2(5)(6));       // reusing a partial is safe
```

```output
24 24 24 24
24 60
```

Here is how it works, line by line.

1. **`fn.length` is the target.** A function's `length` property is the number of parameters it declares (with exceptions discussed next). For `volume` it is `3`, so `curried` knows it must collect three arguments.
2. **`curried(...args)` collects this call's arguments.** If there are already enough, it calls the original function with all of them. `apply(this, args)` passes the arguments as an array and forwards whatever `this` the curried function was called with, so curried methods still work.
3. **Otherwise, it returns a new function.** That arrow function closes over the `args` collected so far. When called with `more`, it calls `curried` again with the combined list — a recursive step that either finishes or returns yet another collector.
4. **Each partial is independent.** `[...args, ...more]` builds a *new* array; nothing is mutated. That is why `withL2` can be reused: `withL2(3)` and `withL2(5)` each start from the same untouched `[2]`.

Notice that this curry accepts several arguments per call — `cv(2, 3)(4)` and `cv(2, 3, 4)` both work. This style is sometimes called **auto-currying** or loose currying, and it is what Lodash's `_.curry` and Ramda's `R.curry` provide, because it is more convenient than the strict one-argument-at-a-time form. Strictly speaking it mixes currying with partial application.

### Where `fn.length` lies

The generic curry relies entirely on `fn.length`, and `length` does not always count what you think:

```javascript title="length.js"
console.log(((a, b, c) => 0).length);
console.log(((a, b = 2, c) => 0).length);
console.log(((a, ...rest) => 0).length);
console.log(((...all) => 0).length);
console.log((({ a, b }) => 0).length);
```

```output
3
1
1
0
1
```

The rule: **`length` counts the parameters before the first one with a default value or a rest parameter.** Everything from the first default onwards is ignored, even ordinary parameters after it (`c` in the second line). A rest parameter never counts. A destructuring pattern counts as one parameter.

That breaks the generic curry in two ways:

```javascript title="length-bugs.js"
// uses the curry() function from curry.js above
const greet = curry((greeting, name = 'friend') => `${greeting}, ${name}`);
console.log(greet('Hi'));
console.log(typeof greet('Hi'));

const sum = curry((...nums) => nums.reduce((a, b) => a + b, 0));
console.log(sum(1));
```

```output
Hi, friend
string
1
```

`greet` has a `length` of 1, so curry calls it as soon as it receives one argument; you never get a chance to pass `name` separately. `sum` has a `length` of 0, so the very first call runs it with whatever arrived. The fix is to let the caller state the **arity** — the number of arguments to wait for — explicitly:

```javascript title="curry-n.js"
function curryN(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const sum3 = curryN((...nums) => nums.reduce((a, b) => a + b, 0), 3);
console.log(sum3(1)(2)(3), sum3(1, 2)(3));
```

```output
6 6
```

Library helpers offer the same escape hatch: `_.curry(fn, arity)` in Lodash and `R.curryN(arity, fn)` in Ramda. Wrapping also changes metadata: the curried function itself has `length` 0 (it declares only a rest parameter), so curried functions cannot be curried again by the same helper without an explicit arity.

## Argument order: data last

Currying fixes arguments from the **left**. So which argument comes first determines what you can pre-configure. Compare two ways of writing a "multiply" and a "get property" helper:

```javascript title="data-last.js"
console.log(['1', '2', '3'].map(parseInt));
console.log(['1', '2', '3'].map((s) => parseInt(s, 10)));

const multiply = (a) => (b) => a * b;
console.log([1, 2, 3].map(multiply(10)));

const prop = (key) => (obj) => obj[key];
const users = [{ name: 'Ada', age: 36 }, { name: 'Linus', age: 28 }];
console.log(users.map(prop('name')));
```

```output
[ 1, NaN, NaN ]
[ 1, 2, 3 ]
[ 10, 20, 30 ]
[ 'Ada', 'Linus' ]
```

The first line is a famous trap that shows why one-argument functions matter. `map` calls its callback with three arguments — the element, the index and the array — and `parseInt` accepts a second parameter, the radix. So the calls are `parseInt('1', 0)` (radix 0 means "detect", giving 1), `parseInt('2', 1)` (radix 1 is invalid, giving `NaN`) and `parseInt('3', 2)` (`'3'` is not a binary digit, giving `NaN`). Wrapping it in a one-argument arrow fixes it.

`multiply(10)` and `prop('name')` work as callbacks because the **configuration** comes first and the **data** comes last. Each partial application produces a one-argument function ready to receive the data. This convention is called **data-last**, and it is why Ramda's functions take the collection as their final argument (`R.map(fn, list)`), the reverse of Lodash's `_.map(list, fn)`. Lodash ships a separate `lodash/fp` build with data-last, auto-curried versions for this reason. When you design a function intended for currying, put the arguments that vary least on the left and the data on the right.

## Real uses of currying and partial application

**Event handlers that need context.** In React and similar libraries, one handler factory can serve many fields:

```javascript title="handlers.js"
const form = { email: '', name: '' };
const handleChange = (field) => (event) => {
  form[field] = event.target.value;
};

const onEmail = handleChange('email');
const onName = handleChange('name');
onEmail({ target: { value: 'ada@example.com' } });
onName({ target: { value: 'Ada' } });
console.log(form);
```

```output
{ email: 'ada@example.com', name: 'Ada' }
```

In JSX this looks like `<input onChange={handleChange('email')} />`. The field name is supplied while rendering; the event is supplied later by the browser. (In a real component you would update state rather than mutate an object; the shape of the handler is the point here.) Be aware that `handleChange('email')` creates a new function on every render, which matters only when it is passed to a memoized child; see [[b4-usecallback]].

**Redux middleware.** Redux defines middleware as a curried function of three stages, and the store supplies them at different times:

```javascript title="middleware.js"
const logger = (store) => (next) => (action) => {
  console.log('before', action.type, store.getState());
  const result = next(action);
  console.log('after ', action.type, store.getState());
  return result;
};

// a tiny store to show how the stages are supplied
let state = 0;
const store = { getState: () => state };
const baseDispatch = (action) => {
  if (action.type === 'inc') state += 1;
  return action;
};

const dispatch = logger(store)(baseDispatch);    // stages 1 and 2 at setup time
dispatch({ type: 'inc' });                       // stage 3 on every action
dispatch({ type: 'inc' });
```

```output
before inc 0
after  inc 1
before inc 1
after  inc 2
```

The store is known when middleware is installed; `next` (the next middleware in the chain) is known when the chain is assembled; the action only arrives when someone dispatches. Currying lets each stage be supplied exactly once. See [[b4-redux-middleware]].

**Configured factories.** Many libraries expose functions that take options and return the real worker: the `cors` package's `cors(options)` returns Express middleware, `createLogger('db')` returns a logger, a validation library's `minLength(8)` returns a validator. These are partial application under another name — the closure-based pattern shown in [[b1-closures]].

**Callbacks for array methods.** `items.filter(hasStatus('active'))`, `users.map(prop('id'))` and `prices.map(multiply(1.2))` read like sentences once the helpers exist.

## compose / pipe {#b1-compose-pipe}

**Function composition** means feeding the output of one function directly into the next, so that several small functions act as one. `compose` and `pipe` are two helper functions that do this: each takes a list of functions and returns a single new function. When you call that new function with a value, the value passes through every function in turn. The only difference between the two is direction. `pipe` runs the functions **left to right**, in the order they are listed, like an assembly line. `compose` runs them **right to left**, matching how nested calls are written in mathematics, where `(f ∘ g)(x)` means `f(g(x))`.

The problem they solve is readability. Turning a title into a URL slug might take three steps: trim whitespace, lowercase, and replace runs of other characters with dashes. Written as nested calls, the steps read inside-out: `dashes(lower(trim(title)))` — the first step is the innermost, the last step is written first. With five or six steps this becomes hard to follow and harder to edit. A pipeline lists the steps in the order they happen.

### Implementing them with reduce

```javascript title="compose-pipe.js"
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const dashes = (s) => s.replace(/[^a-z0-9]+/g, '-');

const slugA = compose(dashes, lower, trim);    // read right to left
const slugB = pipe(trim, lower, dashes);       // read left to right

console.log(slugA('  Hello World, Again '));
console.log(slugB('  Hello World, Again '));
console.log(dashes(lower(trim('  Hello World, Again '))));
console.log(pipe()('unchanged'), compose()('unchanged'));
```

```output
hello-world-again
hello-world-again
hello-world-again
unchanged unchanged
```

`pipe(...fns)` collects the functions into an array and returns a function waiting for the starting value `x`. When called, `reduce` walks the array from the first function to the last, keeping a running value `acc`: it starts as `x`, and each step replaces it with `fn(acc)`. After the last function, `acc` is the result. `compose` is identical except that `reduceRight` walks from the last function to the first.

All three lines produce the same slug: `compose(dashes, lower, trim)`, `pipe(trim, lower, dashes)` and the nested call are the same computation. `compose` keeps the functions in the same order as the nested version (outermost first); `pipe` lists them in execution order. Most application code prefers `pipe` because people read left to right.

The last line shows the edge case: with no functions, both return the value unchanged. An empty pipeline is the **identity function**, `(x) => x`, which is exactly what `reduce` produces when given an empty array and a starting value.

> [!WARNING] Which runs first?
> `compose(f, g)(x)` is `f(g(x))`: `g` runs first. `pipe(f, g)(x)` is `g(f(x))`: `f` runs first. Swapping them is the most common composition bug, and the most common interview question about it.

### Every step must take one argument

A step in a pipeline receives exactly one value: the previous step's output. Functions that need more information must have it fixed in advance, which is where currying and partial application come in. With curried, data-last helpers, a data pipeline becomes a readable list of steps:

```javascript title="pipeline.js"
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const map = (fn) => (arr) => arr.map(fn);
const filter = (pred) => (arr) => arr.filter(pred);
const sortBy = (key) => (arr) => [...arr].sort((a, b) => a[key] - b[key]);
const take = (n) => (arr) => arr.slice(0, n);
const tap = (label) => (x) => { console.log(label, x); return x; };

const products = [
  { name: 'Desk', price: 250, inStock: true },
  { name: 'Lamp', price: 40, inStock: false },
  { name: 'Chair', price: 120, inStock: true },
  { name: 'Mug', price: 12, inStock: true },
];

const cheapestInStock = pipe(
  filter((p) => p.inStock),
  sortBy('price'),
  tap('sorted:'),
  take(2),
  map((p) => `${p.name} ($${p.price})`),
);

console.log(cheapestInStock(products));
```

```output
sorted: [
  { name: 'Mug', price: 12, inStock: true },
  { name: 'Chair', price: 120, inStock: true },
  { name: 'Desk', price: 250, inStock: true }
]
[ 'Mug ($12)', 'Chair ($120)' ]
```

Each helper is curried with configuration first: `filter(pred)` returns a function waiting for an array, `take(2)` returns a function waiting for an array, and so on. `cheapestInStock` is defined without ever mentioning its data — a style called **point-free** — and is then called with `products`. `sortBy` copies the array before sorting, because `sort` mutates in place and a pipeline step should not change its input; see [[b1-pure-functions]].

The `tap` helper solves the main practical complaint about pipelines: you cannot easily put a breakpoint or `console.log` between steps. `tap` logs (or inspects) the value and returns it unchanged, so it can be inserted anywhere and removed later without disturbing the pipeline.

### Async pipelines

If a step returns a promise, the next step receives the promise rather than its value, and the synchronous `pipe` breaks. An **async pipe** awaits each step in order:

```javascript title="pipe-async.js"
const pipeAsync = (...fns) => async (x) => {
  let acc = x;
  for (const fn of fns) acc = await fn(acc);     // one step at a time, in order
  return acc;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchUser = async (id) => { await delay(10); return { id, name: 'ada' }; };
const capitalise = (user) =>
  ({ ...user, name: user.name[0].toUpperCase() + user.name.slice(1) });
const greet = async (user) => { await delay(5); return `Hello, ${user.name} (#${user.id})`; };

const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
try {
  pipe(fetchUser, capitalise)(7);
} catch (e) {
  console.log('sync pipe:', e.message);
}

pipeAsync(fetchUser, capitalise, greet)(7).then((text) => console.log('async pipe:', text));
```

```output
sync pipe: Cannot read properties of undefined (reading '0')
async pipe: Hello, Ada (#7)
```

With the synchronous `pipe`, `capitalise` received the promise returned by `fetchUser`; a promise has no `name` property, so `user.name[0]` failed. `pipeAsync` awaits each result before passing it on. Awaiting a non-promise value is harmless, so synchronous steps like `capitalise` can be mixed in. Note that the steps run **sequentially**, because each needs the previous result; this is not a place for `Promise.all`, which runs independent operations in parallel. See [[b1-sequential-vs-parallel]].

### Where you will meet compose and pipe

Redux exports a `compose` helper, used to combine store enhancers. Lodash provides `_.flow` (pipe) and `_.flowRight` (compose); Ramda provides `R.pipe` and `R.compose`. Libraries such as RxJS use a `pipe` method to chain operators on a stream. Higher-order components in older React code were combined with `compose(withRouter, connect(mapState))(Component)`. A pipeline operator `|>` for JavaScript has been proposed to TC39 for years; it is not part of the language, so these helpers remain the way to write pipelines today.

In TypeScript, typing a hand-written `pipe` precisely requires overloads (one signature per number of steps) so the compiler can check that each step's output type matches the next step's input; libraries such as fp-ts provide those overloads. A simple `(...fns: Function[])` signature loses that checking.

## How it works internally

Currying is a pattern, not a language feature: the ECMAScript specification has no notion of it. Everything happens through ordinary closures. Each call to a curried function creates a new function object whose `[[Environment]]` internal slot points at the scope holding the arguments received so far. Calling `cv(2)` therefore allocates a function object and keeps an environment with `args = [2]` alive for as long as that function is reachable.

That has two consequences. First, **each stage costs an allocation**: currying a three-argument function and calling it one argument at a time creates two intermediate functions and two argument arrays. Modern engines make this cheap, but it is not free in a hot loop processing millions of items. Second, **partials are values with lifetimes**: storing `withL2` in a long-lived object keeps its closed-over arguments in memory, which matters if those arguments are large. See [[b1-closure-memory]].

`compose` and `pipe` are also nothing more than a loop: `reduce` calls each function with the previous result. A pipeline of five steps is five ordinary function calls, plus one array iteration. Stack traces through pipelines show the anonymous arrow inside `reduce` between your functions, which is the main debugging cost.

```mermaid title="pipe(trim, lower, dashes) applied to a string"
flowchart LR
    X["'  Hello World, Again '"] --> T["trim"]
    T -- "'Hello World, Again'" --> L["lower"]
    L -- "'hello world, again'" --> D["dashes"]
    D --> R["'hello-world-again'"]
```

## Trade-offs and alternatives

Currying and composition pay off when the same configuration is reused many times, when arguments genuinely arrive at different moments, and when a sequence of transformations is clearer as a list of named steps than as nested calls or temporary variables.

They cost readability when overused. `getUser(config)(id)(options)` forces every caller to know the stage boundaries, error messages from a deeply curried call are hard to trace, and point-free pipelines of tiny helpers can turn a five-line function into a puzzle that only its author can read. Teams that are not used to the style often find plain functions with an options object easier.

Alternatives worth considering:

| Need | Alternative to currying |
|---|---|
| Fixing a few arguments once | A small arrow wrapper: `const getUsers = () => request('GET', BASE, '/users')` |
| Many optional settings | An options object with defaults: `request({ method = 'GET', path })` |
| Fixing `this` and arguments | `bind` |
| Long data transformations | Method chaining on arrays (`.filter().map()`), or well-named intermediate variables |

Note that default parameters are not partial application. A default gives every caller the same fallback value; partial application lets different parts of a program create differently configured versions of the same function.

## Common mistakes

> [!MISTAKE] Sharing one array across all partial calls
> A curry that pushes arguments into a single array created once, outside the returned function, works the first time and then breaks: every partial shares the same list. Always build a new array per call, such as `[...args, ...more]`.

Here is that bug, so you can recognise it:

```javascript title="broken-curry.js"
function brokenCurry(fn) {
  const collected = [];                            // one array shared by every call
  return function curried(...args) {
    collected.push(...args);
    if (collected.length >= fn.length) return fn(...collected);
    return curried;
  };
}

const add3 = brokenCurry((a, b, c) => a + b + c);
const add1 = add3(1);
console.log(add1(2)(3));
console.log(add1(10));
```

```output
6
6
```

The first use collects `[1, 2, 3]` and returns 6. The second use of `add1` should return a function waiting for one more argument, but `collected` already holds `[1, 2, 3]`, so pushing 10 makes four arguments and it immediately returns `1 + 2 + 3` again. The partial was not a snapshot; it was a view of shared, mutated state.

**Currying functions with defaults or rest parameters by `length`.** As shown above, `length` stops counting at the first default and ignores rest parameters. Pass the arity explicitly.

**Calling a curried function with all arguments at once when it is strictly curried.** `curriedVolume(2, 3, 4)` with hand-written nested arrows returns a function, silently ignoring 3 and 4. Only auto-curry helpers accept batches.

**Mixing up `compose` and `pipe` order.** Write the order down: `pipe` is execution order. If you find yourself reversing a list in your head, switch to `pipe`.

**Putting a multi-argument function directly into a pipeline or `map`.** Each step receives one value (and `map` passes extra arguments). Wrap or curry the function so it takes exactly the data argument.

**Forgetting that a step returned a promise.** A synchronous `pipe` passes promises along as values. Use an async pipe, or keep async work at the edges of the pipeline.

## Interview perspective

Front-end interviews ask for implementations, and they probe the edges: arity, `this`, reuse.

> [!INTERVIEW] Implementing curry
> A strong answer names the moving parts while writing: "I compare the number of collected arguments with `fn.length`. If there are enough, I call `fn` with `apply` so `this` is preserved. Otherwise I return a function that concatenates the new arguments into a *new* array and recurses. Because I never mutate the collected array, partial results can be reused." Then mention that `length` ignores defaults and rest parameters, so a production version accepts an explicit arity.

Questions you should be ready for:

- **Currying versus partial application?** Currying transforms an n-argument function into n one-argument functions; partial application fixes some arguments of a function and returns a function of the rest. Calling a curried function with its first argument is a partial application.
- **Implement `sum(1)(2)(3)()` returning 6 (infinite currying).** Return a function that accumulates while it receives an argument and returns the total when called with none. It cannot rely on `length`, so the empty call is the signal to finish.
- **Implement `compose` and `pipe`.** `reduceRight` and `reduce` over the functions, starting from the input value; mention the identity case and async variants.
- **Why does `['1', '2', '3'].map(parseInt)` return `[1, NaN, NaN]`?** `map` passes the index as `parseInt`'s radix argument.
- **Where have you seen currying in real code?** Redux middleware, React handler factories, configured middleware such as `cors(options)`.

Implementation drills for these live in [[b1-impl-curry-compose]].

```quiz
Q: Given `const curry = (fn) => function c(...a) { return a.length >= fn.length ? fn(...a) : (...b) => c(...a, ...b); };`, what does `curry((x, y = 1) => x + y)(5)` return?
- [ ] A function waiting for `y`
- [x] 6
- [ ] NaN
- [ ] 5
> The arrow's `length` is 1, because `length` stops counting at the first parameter with a default. With one argument collected, the curry calls the function immediately, and `y` takes its default of 1, giving 6. To pass `y` separately you would need an explicit arity.

Q: What does `pipe(double, increment)(5)` return, where `double = x => x * 2` and `increment = x => x + 1`?
- [ ] 12
- [x] 11
- [ ] 10
- [ ] 6
> `pipe` runs left to right: double(5) is 10, then increment(10) is 11. `compose(double, increment)(5)` would run right to left, giving double(6) = 12, which is the tempting wrong answer.

Q: Which statement about `request.bind(null, 'GET')` is true, where `request` declares three parameters?
- [ ] It calls `request` immediately with 'GET'
- [ ] It returns a curried function that accepts one argument per call
- [x] It returns a new function with 'GET' fixed as the first argument and `length` 2
- [ ] It changes `request` so that its first argument is always 'GET'
> `bind` performs partial application: it returns a new bound function with `this` set to null and the first argument fixed. The original function is unchanged. The bound function's length is the original length minus the bound arguments, and it accepts all remaining arguments in one call.
```

## Practice

1. **Strict curry.** Write `curryStrict(fn)` that accepts exactly one argument per call, so `curryStrict(add3)(1, 2)` returns a function still waiting for two more (the extra argument is ignored). Compare its usability with the auto-curry version.
2. **Infinite sum.** Implement `sum(1)(2)(3)()` → `6` and `sum(4)()` → `4`. Then make `sum(1, 2)(3)()` also work.
3. **Placeholders.** Extend `partial` so that a special `_` value leaves a position open: `partial(request, _, 'https://api.example.com')('GET', '/users')`.
4. **Pipeline refactor.** Take a function that normalises user input with five nested calls and rewrite it with `pipe` and curried helpers. Add a `tap` to inspect the middle step, then remove it.
5. **Typed pipe.** In TypeScript, write `pipe` overloads for one, two and three steps so that `pipe((s: string) => s.length, (n: number) => n > 3)` has type `(s: string) => boolean`, and a mismatched step is a compile error.

## Quick revision {#quick-revision}

- Currying: `f(a, b, c)` becomes `f(a)(b)(c)`; each call returns a function remembering earlier arguments.
- Partial application: fix some arguments now, get a function for the rest. `bind(thisArg, ...args)` is built-in partial application.
- Both are closures; partials are independent and reusable if collected arguments are never mutated.
- Generic curry: compare collected `args.length` with `fn.length`; call through with `apply(this, args)`, else return a collector that combines `[...args, ...more]`.
- `fn.length` counts parameters before the first default or rest; destructuring counts as one. Rest-only functions have `length` 0. Pass an explicit arity for such functions.
- Bound functions: `name` is `"bound fn"`, `length` is original minus bound arguments.
- Data-last argument order makes curried helpers usable as callbacks (`map(prop('id'))`).
- `['1','2','3'].map(parseInt)` is `[1, NaN, NaN]` because the index becomes the radix.
- Real uses: Redux middleware `store => next => action`, React handler factories, configured middleware.
- `compose(f, g)(x) = f(g(x))` (right to left, `reduceRight`); `pipe(f, g)(x) = g(f(x))` (left to right, `reduce`).
- Empty pipe/compose is the identity function. Pipeline steps must be unary.
- Async pipe: `for...of` with `await`, sequential by necessity. `tap` helps debugging.
- Library names: Lodash `curry`, `partial`, `flow`, `flowRight`; Ramda `curry`, `curryN`, `pipe`, `compose`; Redux `compose`.

## Key takeaways {#key-takeaways}

- Currying and partial application let you supply arguments at the moment they are known, by returning functions that remember earlier arguments in closures.
- A generic curry is a few lines, but it depends on `fn.length`, which ignores defaults and rest parameters; accept an explicit arity when that matters.
- Never mutate the collected arguments: partially applied functions must be independent snapshots.
- Put configuration first and data last so curried helpers slot into callbacks and pipelines.
- `pipe` runs steps in the order written and `compose` in reverse; both need one-argument steps, and async steps need an async pipe.
- Use these techniques where they make code clearer, not as a default style.
