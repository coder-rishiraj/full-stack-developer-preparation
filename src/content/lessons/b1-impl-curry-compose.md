---
summary: `curry`, `compose` and `pipe` are the small functional-programming tools behind point-free code, Redux middleware and RxJS operators. You will implement each from closures and `reduce`, understand why `curry` depends on `fn.length` and when that breaks, and learn when these tools make code clearer and when they make it harder to read.
difficulty: intermediate
minutes: 40
objectives:
  - Implement `curry` that collects arguments one or several at a time until the function's arity is reached
  - Explain how `Function.prototype.length` treats default and rest parameters, and work around it with an explicit arity
  - Implement `compose` and `pipe` with `reduceRight` and `reduce`, including the empty and multi-argument cases
  - Build an async `pipe` that awaits each step
  - Decide when curried, composed code is clearer than plain function calls
---

## Introduction

Many small functions are more useful when you can **configure them now and use them later**, or **chain them together** without naming every intermediate value. Consider formatting a price: trim the input, parse it as a number, apply a discount, round it, add a currency sign. Written as nested calls, the last step comes first:

```js title="nested.js"
const raw = ' 120.456 ';
const price = `$${Math.round(Number(raw.trim()) * 0.9 * 100) / 100}`;
console.log(price);
```

```output
$108.41
```

That is hard to read and impossible to reuse in parts. Three classic tools address it.

- **`curry(fn)`** turns a function of several arguments into a chain of functions that each take some of them: `add(1, 2, 3)` can be called as `add(1)(2)(3)` or `add(1, 2)(3)`. Fixing the first arguments produces a specialised function, such as `discount(0.9)`, ready to be used later.
- **`compose(f, g, h)`** returns a function that runs `h`, then `g`, then `f`: `compose(f, g, h)(x)` equals `f(g(h(x)))`. It reads right to left, like the nested call it replaces.
- **`pipe(h, g, f)`** does the same thing in reading order: left to right, like an assembly line.

Implementing them is a standard interview exercise because it combines closures, rest and spread, `reduce`, and a subtle language detail — `Function.prototype.length`. This lesson builds each, then discusses where they appear in real code and where they do not belong.

## Before you start

- **Closures** — an inner function keeps the arguments collected so far. See [[b1-closures]].
- **Rest and spread** — `(...args)` and `fn(...args)`. See [[b1-spread-rest]].
- **`reduce` and `reduceRight`** — folding a list into one value. See [[b1-array-map-filter-reduce]] and [[b1-impl-map-filter-reduce]].
- **The concepts from the user side** — [[b1-currying]] and [[b1-compose-pipe]]. This lesson focuses on implementing them.
- **Pure functions** — composition is easiest to reason about when each step is pure. See [[b1-pure-functions]].

## The intuition

**Currying is a piggy bank of arguments.** You can drop coins in one at a time or several at once. The bank knows how many coins it needs — the function's **arity**, its number of declared parameters — and the moment it is full, it opens and the original function runs with everything collected.

**Composition is plumbing.** Each function is a pipe segment with one input and one output. Connecting segments end to end produces a longer pipe that is itself just another segment: one input, one output. `pipe` connects them in the order water flows; `compose` lists them in the order mathematicians write `f ∘ g`.

The plumbing analogy has one important limit: segments must fit. A function that returns an object cannot feed a function that expects a number. Composition works best with **unary** functions — functions that take exactly one argument — which is why currying and composition are usually taught together: currying turns multi-argument functions into unary ones that fit the pipe.

## Implementing curry

The idea: keep collecting arguments in a closure; when you have at least `fn.length` of them, call `fn`.

```js title="curry.js"
function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    // Not enough yet: return a function that remembers what we have.
    return function (...more) {
      return curried.apply(this, [...args, ...more]);
    };
  };
}

const add3 = (a, b, c) => a + b + c;
const add = curry(add3);

console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(add(1)(2, 3));
console.log(add(1, 2, 3));

const addTen = add(10); // a reusable partial
console.log(addTen(1)(1), addTen(5, 5));
```

```output
6
6
6
6
12 20
```

Follow `add(1)(2)(3)`. `add` is `curried`. Called with `[1]`, it has 1 of 3 arguments, so it returns a new function remembering `[1]`. Calling that with `2` calls `curried(1, 2)` — still short — which returns another function remembering `[1, 2]`. Calling that with `3` calls `curried(1, 2, 3)`, which has enough arguments and calls `add3`.

**Each partial is independent.** `addTen` remembers `[10]`. Calling `addTen(1)` builds a *new* array `[10, 1]` with spread; it does not modify `addTen`'s array. That is why `addTen(1)(1)` and `addTen(5, 5)` do not interfere. A version that pushed into one shared `args` array would make the second call see leftovers from the first — a classic bug.

**Arguments can come in batches.** Because every step accepts `...more`, the caller can supply one or several arguments at a time. Strict "one argument per call" currying, as in Haskell, is less convenient in JavaScript, and libraries such as Lodash and Ramda use this batching version.

**Extra arguments are passed through.** `args.length >= arity` uses `>=`, so `add(1, 2, 3, 4)` calls `add3` with four arguments; the fourth is ignored by `add3` but would be visible to a function that reads `arguments`.

**`this` is forwarded.** Using `function` and `apply(this, …)` means a curried method still sees its object. If you only curry standalone functions, an arrow-based version is shorter and equally correct.

### The fn.length trap

`curry` trusts `fn.length`, and `length` does not always mean "number of parameters". It counts only the parameters **before the first one with a default value, and excludes the rest parameter**:

```js title="length.js"
console.log(((a, b, c) => 0).length);
console.log(((a, b = 2, c) => 0).length);
console.log(((...nums) => 0).length);
console.log(((a, ...rest) => 0).length);
console.log(function ({ x, y }) {}.length);
```

```output
3
1
0
1
1
```

A destructured parameter counts as one. Defaults and rest are the problems. Currying a function whose `length` is `0` calls it immediately, with whatever arguments the first call received:

```js title="length-trap.js"
function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const sumAll = (...nums) => nums.reduce((a, b) => a + b, 0);
const withDefault = (a, b = 10, c = 0) => a + b + c;

console.log(curry(sumAll)(1)); // length 0: runs immediately with [1]
console.log(curry(withDefault)(1)); // length 1: runs immediately, b and c use defaults
console.log(curry(sumAll, 3)(1)(2)(3)); // explicit arity fixes it
```

```output
1
11
6
```

That is why `curry` takes an optional `arity` argument, as Lodash's `curry(func, [arity=func.length])` does. Pass it whenever the function uses defaults or rest parameters, or whenever `fn` is itself a wrapper (a function returned by `debounce` or `bind` may have a different `length` than you expect).

### Variadic "infinite" currying

A popular interview variant asks for `sum(1)(2)(3)()` to return `6`, with any number of calls and an empty call at the end. There is no arity to wait for, so the stop signal is the empty call:

```js title="infinite-sum.js"
function sum(...first) {
  const collected = [...first];
  return function next(...more) {
    if (more.length === 0) return collected.reduce((a, b) => a + b, 0);
    collected.push(...more);
    return next;
  };
}

console.log(sum(1)(2)(3)());
console.log(sum(1, 2)(3, 4)(5)());
```

```output
6
15
```

Here pushing into `collected` is fine, because each top-level `sum(...)` call creates its own array and the chain is used once. (Some versions use `valueOf` so that `+sum(1)(2)` works without the empty call; it relies on implicit type conversion and is best avoided in real code.)

## Implementing compose and pipe

`pipe` threads a value through a list of functions, left to right. That is exactly what `reduce` does: start with the input as the accumulator, and let each function transform it.

```js title="compose-pipe.js"
const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((value, fn) => fn(value), input);

const compose =
  (...fns) =>
  (input) =>
    fns.reduceRight((value, fn) => fn(value), input);

const trim = (s) => s.trim();
const toNumber = (s) => Number(s);
const discount = (rate) => (n) => n * rate;
const round2 = (n) => Math.round(n * 100) / 100;
const dollars = (n) => `$${n}`;

const formatPrice = pipe(trim, toNumber, discount(0.9), round2, dollars);
console.log(formatPrice(' 120.456 '));

const sameThing = compose(dollars, round2, discount(0.9), toNumber, trim);
console.log(sameThing(' 120.456 '));

console.log(pipe()(42), compose()('unchanged'));
```

```output
$108.41
$108.41
42 unchanged
```

The price formatter now reads as a list of steps in the order they happen, each step is reusable and testable on its own, and `discount(0.9)` is a manually curried function — it takes the rate first and returns a unary function ready for the pipe.

**`reduceRight` is the only difference.** `compose` applies the last function first, so it folds from the right. `compose(f, g)` and `pipe(g, f)` are the same function.

**No functions means identity.** `reduce` with an initial value and an empty list returns the initial value, so `pipe()` and `compose()` return the input unchanged. This is the mathematically correct answer — the **identity function** `x => x` is to composition what `0` is to addition — and it falls out of the implementation without a special case. Without the initial value, an empty list would throw.

Dry run of `pipe(trim, toNumber, discount(0.9), round2, dollars)(' 120.456 ')`:

| Step | Function | Input | Output |
|---|---|---|---|
| 1 | `trim` | `' 120.456 '` | `'120.456'` |
| 2 | `toNumber` | `'120.456'` | `120.456` |
| 3 | `discount(0.9)` | `120.456` | `108.4104` |
| 4 | `round2` | `108.4104` | `108.41` |
| 5 | `dollars` | `108.41` | `'$108.41'` |

### Letting the first function take several arguments

The version above passes exactly one value in. Real `compose` implementations (Redux's `compose`, Lodash's `flowRight`) let the *first* function applied receive all arguments, since only the steps after it need to be unary:

```js title="compose-multi.js"
function compose(...fns) {
  if (fns.length === 0) return (arg) => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduce(
    (outer, inner) =>
      (...args) =>
        outer(inner(...args)),
  );
}

const add = (a, b) => a + b;
const double = (n) => n * 2;
const describe = (n) => `result: ${n}`;

console.log(compose(describe, double, add)(3, 4));
console.log(compose()(5));
```

```output
result: 14
5
```

This is essentially how Redux writes `compose`. Instead of threading a *value*, `reduce` threads *functions*: each step wraps the previous composition in a new function. `compose(describe, double, add)` becomes `(...args) => describe(double(add(...args)))`. The work happens later, when the composed function is called.

## Async pipe

If any step returns a promise, the plain `pipe` passes the *promise* to the next step, which is almost never what you want. An async version awaits each step:

```js title="pipe-async.js"
const pipeAsync =
  (...fns) =>
  (input) =>
    fns.reduce(
      (promise, fn) => promise.then(fn), // wait for the previous step
      Promise.resolve(input),
    );

const fetchUser = async (id) => ({ id, name: 'ada lovelace' });
const capitalise = (user) => ({
  ...user,
  name: user.name.replace(/\b\w/g, (c) => c.toUpperCase()),
});
const greet = async (user) => `Hello, ${user.name} (#${user.id})`;

const welcome = pipeAsync(fetchUser, capitalise, greet);
console.log(await welcome(7));
```

```output
Hello, Ada Lovelace (#7)
```

The accumulator is now a promise. Starting from `Promise.resolve(input)`, each step is attached with `then`, which waits for the previous value and accepts both synchronous and async functions, because `then` unwraps a returned promise. A rejection anywhere skips the remaining steps and rejects the final promise — the same short-circuit behaviour as a `try` block around sequential `await`s.

## How it works internally

**Every partial is a new closure.** `add(1)` allocates a function object plus a closure scope holding `args`. A curried call `f(1)(2)(3)` allocates two intermediate functions and two arrays before doing any work. Engines handle this well, but in a hot loop (millions of calls) plain calls are measurably cheaper.

**`compose` and `pipe` build the chain once.** `pipe(a, b, c)` only captures the array `fns`; nothing runs until the returned function is called. The reduce-of-functions version of `compose` creates nested wrappers once and then calls through them on each use, adding one stack frame per step — which is why stack traces through composed code show many anonymous frames. Naming the steps (as `trim`, `round2` above) keeps traces readable.

**`length` comes from the declaration.** The engine computes a function's `length` when the function is created, from the parameter list (the specification calls it `ExpectedArgumentCount`). It stops counting at the first default or rest parameter. Wrappers created with `(...args) =>` have `length` 0, unless the wrapper sets `length` with `Object.defineProperty`, as native `bind` effectively does. That is why a curried function wrapped by another utility may lose its arity.

## In real systems

**Redux** uses `compose` to combine store enhancers and `applyMiddleware`. Middleware itself is a curried function, `store => next => action => …`, so each layer can be configured with the store, then given the next handler, then called with each action.

**RxJS** builds streams with `observable.pipe(map(...), filter(...), debounceTime(300))`: each operator is a curried function that takes its configuration and returns a unary function from observable to observable.

**Configuration and dependency injection** often use manual currying: `const makeLogger = (prefix) => (message) => …`, or a request handler factory `(db) => (req, res) => …` that receives its dependencies once and handles many requests.

**Data transformation** in utility libraries (Ramda, `lodash/fp`) is built around data-last, auto-curried functions so that `pipe(filter(isActive), map(toRow), sortBy(byName))` reads as a declarative recipe.

There is also a proposal to add a pipeline operator (`|>`) to JavaScript; it is not part of the language, so `pipe` remains a library function.

## Trade-offs and alternatives

Currying and composition pay off when a function is **configured once and called many times**, and when a transformation is genuinely a sequence of small, reusable steps. They cost readability when overused: a long point-free chain with no named intermediate values can hide what data flows through it, and debugging requires breaking the chain apart.

| Situation | Prefer |
|---|---|
| Two or three one-off steps | Plain calls or intermediate `const`s |
| A reusable sequence of transformations | `pipe` |
| A function configured once, called often | Manual currying (`(config) => (input) => …`) |
| Generic library code accepting any function | `curry` with an explicit `arity` option |
| Steps that are async | Sequential `await` or `pipeAsync` |

In TypeScript, typing a variadic `pipe` or a generic `curry` precisely requires overloads or advanced conditional types; libraries ship many overloads for this reason. Manual currying (`(a: A) => (b: B) => C`) is trivially typed.

Partial application with `bind` (`fn.bind(null, 1)`) is a built-in alternative to `curry` when you only need to fix leading arguments once; see [[b1-bind]].

## Common mistakes

**Sharing one argument array across partials.** `args.push(...more)` mutates state that other partials also see. Build a new array with spread.

**Trusting `fn.length` blindly.** Defaults and rest parameters make it smaller than you expect; wrappers often make it `0`. Accept an explicit arity.

**Mixing up `compose` and `pipe` order.** `compose(f, g)(x)` is `f(g(x))`; `pipe(f, g)(x)` is `g(f(x))`. Test with two non-commuting functions such as `n => n + 1` and `n => n * 2`.

**Forgetting the initial value in `reduce`.** Without `input` as the initial accumulator, the first *function* becomes the accumulator, and an empty list throws.

**Composing async steps with a sync `pipe`.** The next step receives a promise. Use `then` in the reduce or `await` each step.

**Feeding a multi-argument function into the middle of a pipe.** Only the first step can receive several arguments; every later step receives exactly one value.

## Interview perspective

**"Implement `curry`."** Explain arity first, write the collecting closure, and show that partials are reusable. Then mention the `fn.length` caveats and the explicit `arity` parameter before being asked.

**"Implement `compose` and `pipe`."** Write `pipe` with `reduce` and `compose` with `reduceRight`, note that the empty case returns the identity, then offer the version where the first function takes several arguments.

**"Make `sum(1)(2)(3)()` work."** Use the empty call as the stop signal and keep a per-chain array.

**Follow-ups:** "What does `((a, b = 1) => {}).length` return?" (1). "How would you curry a function with optional parameters?" (explicit arity, or fix them with a wrapper). "Write an async `pipe`." "Why does Redux middleware look like `store => next => action`?" (curried configuration, layered at different times).

```quiz
Q: `const f = (a, b = 2, ...rest) => a + b;` What is `f.length`, and what does `curry(f)(5)` return with the `curry` from this lesson?
- [ ] `f.length` is 3, and `curry(f)(5)` returns a function waiting for more arguments
- [ ] `f.length` is 2, and `curry(f)(5)` returns a function
- [x] `f.length` is 1, and `curry(f)(5)` returns `7` immediately
- [ ] `f.length` is 0, and `curry(f)(5)` returns `NaN`
> `length` counts parameters before the first default and never counts rest, so it is 1. One argument satisfies an arity of 1, so `f(5)` runs with `b` defaulting to `2`. Passing an explicit arity to `curry` is how you make it wait for more.
```

```quiz
Q: Which expression equals `compose(f, g, h)(x)`?
- [ ] `h(g(f(x)))`
- [x] `f(g(h(x)))`
- [ ] `pipe(f, g, h)(x)`
- [ ] `f(x) + g(x) + h(x)`
> `compose` applies its functions right to left, so `h` runs first and `f` last — the same order as the nested expression written out. `pipe(f, g, h)` runs left to right and equals `h(g(f(x)))`; `compose(f, g, h)` equals `pipe(h, g, f)`.
```

```quiz
Q: Why do `pipe()` and `compose()` with no functions return their input unchanged?
- [ ] They check for an empty list and return `undefined`
- [x] `reduce` with an initial value over an empty list returns that initial value, which is the input
- [ ] They throw, because `reduce` needs at least one element
- [ ] They return the first function, which is the identity
> With an initial value, `reduce` on an empty array never calls its callback and returns the initial value, here the input. That makes the empty composition the identity function, which is the correct mathematical answer. Without an initial value, `reduce` on an empty array throws a `TypeError`.
```

## Practice

1. Add **placeholder** support to `curry`: `curry(fn)(_, 2)(1)` should fill the gap left by `_` with `1`.
2. Write `uncurry(fn, n)`, which turns `a => b => c => …` back into a function of `n` arguments.
3. Write `pipeWith(transform, fns)`, where `transform(fn, value)` decides how to apply each step; express both `pipe` and `pipeAsync` with it.
4. Rewrite a nested formatting expression from your own code with `pipe`, then decide honestly whether it became clearer.
5. Implement `partial(fn, ...preset)` without `bind`, and compare its `length` with `fn.bind(null, ...preset).length`.

## Quick revision {#quick-revision}

- `curry(fn, arity = fn.length)`: return `curried(...args)`; if `args.length >= arity` call `fn`, else return `(...more) => curried(...args, ...more)` — new array each time, so partials are reusable.
- `fn.length` counts parameters before the first default; rest is never counted; destructured parameters count as one; wrappers are often `0`. Pass an explicit arity when in doubt.
- Variadic curry (`sum(1)(2)()`): stop on the empty call.
- `pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)` — left to right.
- `compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)` — right to left; `compose(f, g)(x) === f(g(x))`.
- Empty `pipe()`/`compose()` is the identity (from `reduce`'s initial value).
- Multi-argument first step: `fns.reduce((f, g) => (...args) => f(g(...args)))` (Redux style).
- Async: `fns.reduce((p, f) => p.then(f), Promise.resolve(x))`.
- Used in Redux middleware and enhancers, RxJS `pipe`, Ramda and `lodash/fp`.

## Key takeaways {#key-takeaways}

- Currying is a closure that collects arguments until the function's arity is reached; partial results are reusable because each step builds a new argument list.
- `fn.length` is a declaration-based count that defaults and rest parameters shrink, so robust `curry` accepts an explicit arity.
- `pipe` and `compose` are one `reduce` apart: left-to-right versus right-to-left, with identity as the empty case.
- Composition works with unary steps; currying is how multi-argument functions are made to fit.
- Use these tools for reusable, configured-once transformations, and plain calls when a chain would hide what is happening.
