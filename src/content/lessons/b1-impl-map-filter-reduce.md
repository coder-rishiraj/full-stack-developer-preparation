---
summary: Writing `map`, `filter`, `reduce` and `forEach` yourself is a classic interview exercise because each is a small loop with precise rules about callbacks, `thisArg`, holes and the starting accumulator. You will build all four from a plain `for` loop, match the behaviour the ECMAScript specification describes, and learn which details interviewers probe.
difficulty: intermediate
minutes: 45
objectives:
  - Implement `map`, `filter`, `forEach` and `reduce` with a plain loop and the correct callback arguments
  - Explain why `map` preserves length and holes while `filter` produces a dense, possibly shorter array
  - Implement `reduce` with and without an initial value, including the empty-array `TypeError`
  - Trace what happens when the callback mutates the array during iteration
  - Install a method on `Array.prototype` safely and explain why that is risky in shared code
---

## Introduction

You have used `[1, 2, 3].map((x) => x * 2)` many times. An interviewer who asks you to *write* `map` is not checking whether you know the method exists. They are checking whether you know what it actually does: which arguments the callback receives, what happens to missing elements, what `this` is inside the callback, whether the array can change underneath the loop, and why `reduce` sometimes throws on an empty array.

Each of these four methods is a **higher-order function**: a function that takes another function (the **callback**) as an argument and calls it. Under the hood every one of them is the same shape — a `for` loop from index `0` to `length - 1` that calls the callback once per element. What differs is what they do with the callback's return value:

| Method | Uses the return value to… | Returns |
|---|---|---|
| `forEach` | nothing; the return value is ignored | `undefined` |
| `map` | store it at the same index in a new array | new array, same length |
| `filter` | decide whether to keep the original element | new array, possibly shorter |
| `reduce` | become the accumulator for the next call | the final accumulator |

Once you see them as "one loop, four policies", writing them takes a few minutes. Writing them *correctly*, the way the ECMAScript specification describes, takes knowing a handful of rules. This lesson builds the four methods step by step, then covers the details: sparse arrays, array-like objects, mutation during the loop, and how to attach your version to `Array.prototype` without breaking other code.

## Before you start

- **Array methods from the user side** — what `map`, `filter` and `reduce` return. See [[b1-array-map-filter-reduce]].
- **Functions as values** — passing a function to another function. See [[b1-first-class-functions]] and [[b1-callback-concept]].
- **`this` and `call`** — `fn.call(obj, a, b)` runs `fn` with `this` set to `obj`. See [[b1-this-explicit]].
- **Sparse arrays** — arrays with missing indices, such as `[1, , 3]`. See [[b1-sparse-arrays]].

## The intuition

Picture a clerk walking down a row of numbered lockers. At each locker that actually has something in it, the clerk hands the contents to you (the callback) along with the locker number, and you hand something back.

- With `forEach`, the clerk ignores what you hand back.
- With `map`, the clerk puts what you hand back into the locker with the same number in a new row. Empty lockers in the old row stay empty in the new row.
- With `filter`, you hand back "yes" or "no". On "yes" the clerk copies the *original* contents to the next free locker in a new row, so the new row has no gaps.
- With `reduce`, the clerk carries a running total. You get the total and the locker contents, and what you hand back becomes the new total.

The phrase "that actually has something in it" is where most hand-written versions go wrong, and the clerk counting the lockers *once, before starting* is the second. Both come back below.

## The baseline: what the built-ins do

Before writing anything, look at the behaviour we are trying to reproduce, including the slightly surprising parts.

```js title="baseline.js"
const sparse = [1, , 3]; // index 1 is a hole, not undefined

console.log(sparse.map((x) => x * 2));
console.log(sparse.filter(() => true));

let calls = 0;
sparse.forEach(() => calls++);
console.log(calls);

console.log([1, 2, 3].reduce((acc, x) => acc + x));
console.log([1, 2, 3].forEach((x) => x * 2));
```

```output
[ 2, <1 empty item>, 6 ]
[ 1, 3 ]
2
6
undefined
```

Four facts are visible here. `map` kept the hole: the result has length 3 and index 1 is still empty. `filter` dropped it: its output is always **dense** (no holes). `forEach` called the callback twice, not three times — holes are skipped entirely. And `reduce` without an initial value used the first element as the starting accumulator, so the callback ran only twice (`1 + 2`, then `3 + 3`).

## Building forEach

Start with the simplest one, because the other three reuse its loop.

```js title="forEach.js"
function forEach(arr, callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  const len = arr.length; // read once, before the loop
  for (let i = 0; i < len; i++) {
    if (!(i in arr)) continue; // skip holes
    callback.call(thisArg, arr[i], i, arr);
  }
  // no return statement: forEach returns undefined
}

forEach(['a', , 'c'], (value, index, array) => {
  console.log(index, value, array.length);
});
```

```output
0 a 3
2 c 3
```

Every line of this function corresponds to a rule.

**The type check comes first.** The specification checks that the callback is callable before the loop starts, so `[].forEach(42)` throws even though there are no elements. A version that only fails when it tries to call the callback would silently accept bad input on empty arrays. `typeof x === 'function'` is the practical test for "callable" in JavaScript.

**The length is read once.** The specification reads `length` before the loop and never again. That decides what happens when the callback pushes to the array: the new elements are not visited. Writing `i < arr.length` in the loop condition instead would visit them, and a callback that pushes on every call would loop forever.

**`i in arr` skips holes.** The `in` operator asks whether the object *has* a property with that key — the specification calls this check **HasProperty**. A hole is an index with no property at all, which is different from an index holding the value `undefined`. `[undefined]` has index 0; `[ , ]` does not. Checking `arr[i] !== undefined` instead would wrongly skip real `undefined` values. Because `in` also looks up the prototype chain, it matches the specification exactly, which uses the same lookup.

**The callback gets three arguments and a `this`.** The signature is `(value, index, array)`, and the optional second argument to `forEach`, called **`thisArg`**, becomes `this` inside the callback. `callback.call(thisArg, …)` sets it. When `thisArg` is omitted it is `undefined`, which is what the built-in passes too. Arrow functions ignore `thisArg` because they have no `this` of their own (see [[b1-this-arrow]]).

> [!MISTAKE] Calling the built-in inside your own version
> Writing `function map(arr, fn) { return arr.map(fn); }` or using `arr.forEach` inside your `map` misses the point of the exercise. Interviewers ask for the loop. Use a plain `for` loop and the `in` check.

## Building map

`map` is `forEach` plus an output array of the same length.

```js title="map.js"
function map(arr, callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  const len = arr.length;
  const out = new Array(len); // pre-sized: every index starts as a hole
  for (let i = 0; i < len; i++) {
    if (!(i in arr)) continue; // the hole stays a hole in out
    out[i] = callback.call(thisArg, arr[i], i, arr);
  }
  return out;
}

console.log(map([1, , 3], (x) => x * 10));
console.log(map(['a', 'b'], (s, i) => s + i));

const multiplier = { factor: 3 };
console.log(map([1, 2], function (x) { return x * this.factor; }, multiplier));
```

```output
[ 10, <1 empty item>, 30 ]
[ 'a0', 'b1' ]
[ 3, 6 ]
```

The key choice is `new Array(len)` combined with `out[i] = …`. `new Array(3)` creates an array whose length is 3 but which has *no* index properties — three holes. Writing to `out[i]` only for present source indices leaves the holes in the same places, which is exactly what the built-in does.

The common wrong version uses `out.push(...)`. On a dense array the result looks identical, but on `[1, , 3]` it produces `[10, 30]` — length 2 — and every index after a hole shifts. `map`'s promise is **index-preserving**: element `i` of the result came from element `i` of the input. `push` breaks that promise.

The `this.factor` call shows `thisArg` working. The callback is a regular `function`, so `callback.call(multiplier, …)` makes `this` refer to `multiplier`.

## Building filter

`filter` keeps the *original* element when the callback returns a **truthy** value (anything that is not `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` or `NaN`).

```js title="filter.js"
function filter(arr, callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  const len = arr.length;
  const out = [];
  for (let i = 0; i < len; i++) {
    if (!(i in arr)) continue;
    const value = arr[i]; // read before the callback can change it
    if (callback.call(thisArg, value, i, arr)) out.push(value);
  }
  return out;
}

console.log(filter([5, , 0, 8, null], (x) => x));
console.log(filter([1, 2, 3, 4], (x, i) => i % 2 === 0));
```

```output
[ 5, 8 ]
[ 1, 3 ]
```

Here `push` is correct, because `filter`'s output is not index-preserving — it is a new, packed list of survivors. Holes are skipped, and `0` and `null` were dropped because they are **falsy**, not because they were missing.

Notice `const value = arr[i]` happens *before* the callback runs, and the saved `value` is what gets pushed. The specification does the same: it reads the element, calls the callback, then adds the element it read. If the callback overwrites `arr[i]`, the built-in still keeps the old value. Writing `out.push(arr[i])` after the call would push the new one.

## Building reduce

`reduce` is the one with real logic, because of the optional initial value.

```js title="reduce.js"
function reduce(arr, callback, ...rest) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  const len = arr.length;
  let i = 0;
  let acc;

  if (rest.length > 0) {
    acc = rest[0]; // an initial value was passed (even if it is undefined)
  } else {
    // No initial value: the first *present* element becomes the accumulator.
    while (i < len && !(i in arr)) i++;
    if (i >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    acc = arr[i];
    i++;
  }

  for (; i < len; i++) {
    if (!(i in arr)) continue;
    acc = callback(acc, arr[i], i, arr); // no thisArg for reduce
  }
  return acc;
}

console.log(reduce([1, 2, 3, 4], (sum, x) => sum + x));
console.log(reduce([1, 2, 3, 4], (sum, x) => sum + x, 100));
console.log(reduce([, , 7], (a, b) => a + b));
console.log(reduce([], (a, b) => a + b, 'start'));
console.log(reduce([1], (a, b) => a + b, undefined));
try {
  reduce([, ,], (a, b) => a + b);
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
10
110
7
start
NaN
TypeError: Reduce of empty array with no initial value
```

Walk through the decisions.

**"Was an initial value passed?" is about argument count, not value.** `reduce(arr, fn, undefined)` *passes* an initial value that happens to be `undefined`; the callback then computes `undefined + 1`, which is `NaN`. Checking `initial === undefined` would confuse that with "no initial value" and start from `arr[0]` instead, giving `1`. Collecting extra arguments with a rest parameter (`...rest`) and checking `rest.length` keeps the distinction. Older code used `arguments.length >= 3` for the same reason.

**Without an initial value, the accumulator is the first present element, not `arr[0]`.** In `[, , 7]` indices 0 and 1 are holes, so the accumulator starts as `7` and the callback never runs at all. That is why the result is `7`.

**Empty input without an initial value throws.** There is nothing to start from, and no value would be a correct answer for every reducer (`0` is right for a sum but wrong for a product or a string join). The array `[, ,]` has length 2 but no elements, so it throws too. With an initial value, an empty array simply returns it, as `'start'` shows.

**The callback receives four arguments: `(accumulator, value, index, array)`.** And `reduce` takes no `thisArg`; the callback is called with `this` set to `undefined`.

Dry run of `reduce([1, 2, 3, 4], (sum, x) => sum + x)`:

| Step | `i` | `acc` before | `arr[i]` | `acc` after |
|---|---|---|---|---|
| setup | 0 | — | 1 | 1 (first element, `i` becomes 1) |
| 1 | 1 | 1 | 2 | 3 |
| 2 | 2 | 3 | 3 | 6 |
| 3 | 3 | 6 | 4 | 10 |

Four elements produce three callback calls. With an initial value of `100` there would be four calls, starting from `acc = 100`.

> [!TIP] reduceRight
> `reduceRight` is the same algorithm walking from `len - 1` down to `0`. Without an initial value it starts from the *last* present element. Writing it is a good check that you understood `reduce`.

## How it works internally

The specification (ECMAScript 2023, section 23.1.3) describes each method as a numbered algorithm. Simplified, `map` is:

1. Let `O` be `ToObject(this value)`.
2. Let `len` be `LengthOfArrayLike(O)`.
3. If `IsCallable(callbackfn)` is false, throw a `TypeError`.
4. Let `A` be `ArraySpeciesCreate(O, len)`.
5. For `k` from 0 to `len - 1`: if `HasProperty(O, k)`, get the value, call the callback with `thisArg` and `(kValue, k, O)`, and define the result at index `k` of `A`.
6. Return `A`.

Your implementation already matches steps 2, 3 and 5. The remaining pieces are worth knowing even if you skip them in an interview.

**`ToObject` and array-likes.** The built-ins work on any object with a `length` and numeric keys, not only on real arrays. That is why `Array.prototype.map.call('abc', (c) => c.toUpperCase())` works on a string. Your functions already accept array-likes because they only use `length`, `in` and indexing:

```js title="array-like.js"
function map(arr, callback, thisArg) {
  const len = arr.length;
  const out = new Array(len);
  for (let i = 0; i < len; i++) {
    if (i in arr) out[i] = callback.call(thisArg, arr[i], i, arr);
  }
  return out;
}

const arrayLike = { length: 3, 0: 'x', 2: 'z' };
console.log(map(arrayLike, (s) => s.toUpperCase()));
console.log(map(Object('hi'), (c, i) => c + i));
```

```output
[ 'X', <1 empty item>, 'Z' ]
[ 'h0', 'i1' ]
```

The second call wraps the string in an object with `Object('hi')` because `in` throws a `TypeError` on a primitive. The built-in avoids this by converting `this` with `ToObject` at step 1; a fuller implementation would start with `const O = Object(arr)` and fail on `null` or `undefined`.

**`LengthOfArrayLike`.** The specification converts `length` to an integer between 0 and 2⁵³ − 1. Old polyfills wrote `this.length >>> 0` to approximate that. For real arrays the length is already a valid integer, so interview versions skip the conversion.

**`ArraySpeciesCreate`.** If you call `map` on an instance of a subclass of `Array`, the built-in creates the result through that subclass's constructor, so `class MyList extends Array {}` gets a `MyList` back from `map` and `filter`. Interview implementations always return a plain `Array`, and it is fine to say so.

**Mutation during the loop.** Because `len` is fixed at step 2 and `HasProperty` is checked at each step, the rules for a callback that changes the array follow directly:

```js title="mutation.js"
const grow = [1, 2, 3];
const doubled = grow.map((x, i) => {
  if (i === 0) grow.push(99); // appended after len was read
  return x * 2;
});
console.log(doubled, grow.length);

const shrink = [1, 2, 3];
shrink.forEach((x, i) => {
  if (i === 0) delete shrink[2]; // index 2 becomes a hole before it is reached
  console.log('visit', x);
});

const change = [1, 2, 3];
change.forEach((x, i) => {
  if (i === 0) change[1] = 20; // changed before it is reached
  console.log('see', x);
});
```

```output
[ 2, 4, 6 ] 4
visit 1
visit 2
see 1
see 20
see 3
```

Appended elements are never visited, elements deleted before their turn are skipped, and elements changed before their turn are seen with their new value. Your implementations produce exactly the same output, because they follow the same two rules. In practice, mutating an array while iterating it is a bug magnet; the point is to predict it, not to rely on it.

## Worked example: installing the methods on Array.prototype

Interviewers sometimes ask for `Array.prototype.myMap` so that you can write `[1, 2].myMap(fn)`. The body is the same, with `this` as the array.

```js title="prototype.js"
function defineArrayMethod(name, impl) {
  if (Object.hasOwn(Array.prototype, name)) return; // never overwrite
  Object.defineProperty(Array.prototype, name, {
    value: impl,
    writable: true,
    configurable: true,
    enumerable: false, // like the built-ins: invisible to for...in
  });
}

defineArrayMethod('myMap', function (callback, thisArg) {
  if (this == null) throw new TypeError('myMap called on null or undefined');
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }
  const O = Object(this);
  const len = O.length;
  const out = new Array(len);
  for (let i = 0; i < len; i++) {
    if (i in O) out[i] = callback.call(thisArg, O[i], i, O);
  }
  return out;
});

console.log([1, 2, 3].myMap((x) => x ** 2));

const keys = [];
for (const k in [10, 20]) keys.push(k);
console.log(keys);

Array.prototype.leaky = function () {}; // plain assignment is enumerable
const leakedKeys = [];
for (const k in [10, 20]) leakedKeys.push(k);
console.log(leakedKeys);
delete Array.prototype.leaky;
```

```output
[ 1, 4, 9 ]
[ '0', '1' ]
[ '0', '1', 'leaky' ]
```

Three details separate a careful answer from a quick one.

**The method must be a regular `function`, not an arrow.** Inside `myMap`, `this` is the array the method was called on. An arrow function would capture `this` from the surrounding scope instead, so `[1, 2].myMap` would see the wrong value.

**`enumerable: false` matters.** Built-in methods are non-enumerable, so `for...in` over an array lists only indices. Adding a method by plain assignment makes it enumerable, and every `for...in` loop over every array in the program now sees it — the `leaky` line shows it. Code that uses `for...in` on arrays is already questionable, but you should not be the one who breaks it.

**Never overwrite an existing method.** The guard at the top of `defineArrayMethod` is what a polyfill does: install only if missing. Overwriting `Array.prototype.map` itself would replace a fast, spec-complete native implementation with your slower one for the whole program, including libraries.

## In real systems

You will rarely ship your own `map`. The value of this exercise shows up elsewhere.

**Polyfills** are exactly this code. Libraries such as `core-js` contain spec-faithful versions of array methods (including `ToObject`, `LengthOfArrayLike` and species handling) and install them only when a browser lacks them. Newer methods such as `Array.prototype.toSorted` (ES2023) and `Array.prototype.findLast` (ES2023) are polyfilled the same way for older browsers.

**Custom collections** reuse the pattern. A linked list, a tree or an immutable list class usually provides its own `map`, `filter` and `reduce`, and the design decisions are the ones you just made: is the result the same shape, is the callback given an index, what happens on an empty collection.

**Debugging** benefits from knowing the rules. "Why does my `map` result have `<1 empty item>`?" (the input was sparse, often from `new Array(n)` or a `delete`), "why did `reduce` throw on an empty list?" (no initial value), and "why is `this` undefined in my callback?" (no `thisArg`, or an arrow function) are all questions this lesson answers.

## Trade-offs and alternatives

A hand-written loop is shorter to reason about but is not faster than the built-ins. Modern engines such as V8 implement `map`, `filter` and `reduce` with optimised internal code and can inline small callbacks, so the built-ins are generally the right choice in production. Write your own only in a polyfill, in a custom data structure, or in an interview.

Skipping spec details is acceptable when you say so. A reasonable interview answer is: "This handles holes, `thisArg`, the length snapshot and the empty-reduce error. It does not implement species construction or full `ToLength` conversion." Naming what you left out shows you know it exists.

Between the four methods, prefer the most specific one. `map` and `filter` say what the loop is for in their name; `reduce` can express anything, which makes it harder to read for simple cases. A `reduce` that builds an array with `push` is usually a `map` or `filter` in disguise, and a `forEach` that pushes into an outer array is usually a `map`.

## Common mistakes

**Using `push` in `map`.** It loses holes and shifts every index after them. Pre-size with `new Array(len)` and assign by index.

**Checking `arr[i] === undefined` to detect holes.** That skips real `undefined` elements, which the built-ins *do* visit. Use `i in arr`.

**Reading `arr.length` in the loop condition.** If the callback pushes, your loop visits the new elements (or never ends). Read the length once into a variable.

**Deciding "no initial value" by `initial === undefined`.** `reduce(fn, undefined)` is a real initial value. Count the arguments instead.

**Starting `reduce` from `arr[0]` on sparse input.** The accumulator starts at the first *present* element. On `[, 5]`, `arr[0]` is `undefined`; the built-in starts from `5`.

**Returning something from `forEach`.** The built-in returns `undefined`, so chaining `.forEach(...).map(...)` throws. Your version should match. Also remember that `return` inside a `forEach` callback only ends that one call; to stop early, use a `for...of` loop or `some`/`every`.

**Using an arrow function for `Array.prototype.myMap`.** `this` will not be the array.

## Interview perspective

**"Implement `Array.prototype.map`."** Start by stating the contract: new array, same length, callback receives `(value, index, array)`, optional `thisArg`, holes preserved, original not modified. Then write the loop. Mention the type check, the length snapshot and `i in O`. If time is short, write a dense-array version and say which line you would add for holes.

**"What is the difference between `map` and `forEach`?"** `map` returns a new array built from the callback's results; `forEach` returns `undefined` and exists for side effects. Neither can be stopped early with `break`.

**"Implement `reduce`." Follow-ups: "What if there is no initial value?" "What about an empty array?"** Explain argument counting, the first-present-element rule and why there is no safe default for the empty case. Walk through a dry-run table if asked.

**"Implement `map` using `reduce`."** This tests that you understand both:

```js title="map-via-reduce.js"
const mapViaReduce = (arr, fn) =>
  arr.reduce((acc, x, i) => {
    acc.push(fn(x, i, arr));
    return acc;
  }, []);

console.log(mapViaReduce([1, 2, 3], (x) => x + 1));
console.log(mapViaReduce([1, , 3], (x) => x + 1));
```

```output
[ 2, 3, 4 ]
[ 2, 4 ]
```

It is correct for dense arrays, and the second line shows the honest caveat: because `reduce` skips holes and the body uses `push`, the hole disappears and the result is one element shorter. Say so before the interviewer does.

**"Why does `[1, 2, 3].map(parseInt)` return `[1, NaN, NaN]`?"** Because `map` passes `(value, index, array)` and `parseInt` reads its second argument as the radix: `parseInt('2', 1)` and `parseInt('3', 2)` are `NaN`. This is the callback-signature rule in action.

```quiz
Q: Your `map` uses `out.push(callback(arr[i], i, arr))` and skips holes with `i in arr`. What does it return for `[1, , 3]` with `x => x * 2`?
- [ ] `[2, <1 empty item>, 6]`, the same as the built-in
- [x] `[2, 6]`, which is shorter than the input
- [ ] `[2, NaN, 6]`
- [ ] `[2, undefined, 6]`
> `push` appends to the next free slot, so skipping the hole moves `6` to index 1 and the result has length 2. The built-in pre-sizes its result and writes to index `i`, which preserves the hole. `NaN` would only appear if the hole were visited and doubled, but `i in arr` prevents that.
```

```quiz
Q: What does `[].reduce((a, b) => a + b, undefined)` do?
- [ ] Throws `TypeError: Reduce of empty array with no initial value`
- [x] Returns `undefined`
- [ ] Returns `0`
- [ ] Returns `NaN`
> An initial value was passed — it is simply `undefined`. With an initial value, an empty array returns it unchanged without calling the callback. The `TypeError` only happens when the argument is absent, which is why implementations count arguments instead of comparing to `undefined`.
```

```quiz
Q: The callback passed to the built-in `forEach` calls `arr.push(0)` on every call. Starting from `[1, 2]`, how many times is the callback called?
- [ ] It loops forever
- [x] Twice
- [ ] Four times
- [ ] Three times
> `forEach` reads `length` (2) once before the loop, so only indices 0 and 1 are visited, even though the array grows to 4. A hand-written loop with `i < arr.length` in its condition would never terminate, which is the bug this rule prevents.
```

## Practice

1. Implement `some(arr, fn, thisArg)` and `every(arr, fn, thisArg)`. Both should stop as soon as the answer is known, skip holes, and return `false`/`true` respectively on an empty array. Explain why `every` returns `true` for `[]`.
2. Implement `reduceRight`, including the no-initial-value case on a sparse array such as `[1, 2, ,]`.
3. Implement `find` and `findIndex`. Check the built-in on `[ , 'a']` first: unlike `map`, `find` does **not** skip holes. Make your version match and explain the difference.
4. Write `flatMap(arr, fn)` using your own `map` and a one-level flatten, then compare with [[b1-flat-flatmap]].
5. Write a test that proves your `filter` pushes the value read *before* the callback when the callback overwrites `arr[i]`.

## Quick revision {#quick-revision}

- All four methods: check `typeof callback === 'function'` first, read `len = arr.length` once, loop `i` from `0` to `len - 1`, skip holes with `if (!(i in arr)) continue`.
- Callback arguments: `(value, index, array)` for `forEach`/`map`/`filter`; `(acc, value, index, array)` for `reduce`.
- `thisArg` is passed with `callback.call(thisArg, …)` for `forEach`, `map`, `filter`; `reduce` has no `thisArg`. Arrow callbacks ignore it.
- `forEach` returns `undefined`.
- `map`: `out = new Array(len)`, `out[i] = …` — same length, holes preserved. Never `push`.
- `filter`: read `value = arr[i]`, call callback, `push(value)` if truthy — output is dense and possibly shorter.
- `reduce`: initial value present is decided by argument count; otherwise start from the first present element; empty (or all-holes) with no initial value throws `TypeError`.
- Mutation: appended elements are not visited; deleted-before-visit are skipped; changed-before-visit are seen with the new value.
- On `Array.prototype`: use a regular `function`, `Object.defineProperty` with `enumerable: false`, and never overwrite an existing method.

## Key takeaways {#key-takeaways}

- `forEach`, `map`, `filter` and `reduce` are one loop with four policies for the callback's return value.
- The length snapshot and the `in` check are what make a hand-written version behave like the built-in on growing and sparse arrays.
- `map` is index-preserving, so it assigns by index; `filter` builds a packed list, so it pushes.
- `reduce`'s hard part is the start: count arguments to detect an initial value, use the first present element otherwise, and throw on empty input.
- Say which specification steps you skipped (species, full `ToLength`) — knowing they exist is part of a strong answer.
