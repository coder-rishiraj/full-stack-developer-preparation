---
summary: "`map`, `filter` and `reduce` turn the three most common loops — transform every element, keep some elements, combine all elements into one value — into named, chainable operations. You will learn exactly how each one works, how `forEach`, `flat` and `flatMap` fit beside them, and the traps around return values, initial values, `async` callbacks and holes."
difficulty: beginner
minutes: 60
objectives:
  - Explain what `map`, `filter` and `reduce` each do to an array's length and contents, and choose the right one for a task
  - Trace a `reduce` call step by step, with and without an initial value, and explain why the initial value should almost always be passed
  - Chain methods into a pipeline and explain the cost of the intermediate arrays
  - Explain why `forEach` cannot be stopped and does not wait for `async` callbacks, and choose `for...of` when either matters
  - Use `flat` and `flatMap` to flatten nested arrays and to map one element to zero, one or many
  - Avoid the classic traps — `map(parseInt)`, `filter(Boolean)` dropping `0`, a missing `return`, and mutating inside callbacks
---

## Introduction

Most code that works with a list does one of three things. It **transforms** each item into something else: prices into formatted strings, user records into table rows. It **selects** some of the items: the unread messages, the products in stock. Or it **combines** the items into a single result: a total, an average, a lookup table.

You can write all three with a `for` loop. The loop version of "the total price of the in-stock items, with tax" declares an accumulator variable, loops over indexes, tests a condition, performs the arithmetic and updates the accumulator. It works, but a reader has to execute the loop in their head to discover which of the three jobs it is doing — or that it is doing all three at once.

The array methods **`map`**, **`filter`** and **`reduce`** give each job a name. `map` transforms every element and returns a new array of the same length. `filter` returns a new array containing only the elements that pass a test. `reduce` folds the whole array into one value. Because `map` and `filter` return arrays, they can be chained: `items.filter(inStock).map(withTax).reduce(sum, 0)` reads as a description of the result, step by step.

These three are the core of everyday JavaScript. React renders every list with `map`. Data from APIs is reshaped with chains of them. This lesson teaches each in depth, then covers three close relatives in sections that can be read on their own: [[b1-foreach|forEach]], for running a side effect per element, and [[b1-flat-flatmap|flat and flatMap]], for nested arrays.

## Before you start

- **Array basics** — indexes, `length`, and arrays holding references to objects. See [[b1-array-basics]].
- **Functions as values** — passing a function to another function, which calls it back. See [[b1-first-class-functions]] and [[b1-callbacks-sync]].
- **Arrow functions** — especially the difference between `(x) => x * 2` (returns the value) and `(x) => { x * 2 }` (returns `undefined`). See [[b1-arrow-functions]].
- **Mutating versus non-mutating methods** — why returning a new array matters. See [[b1-array-mutation]].
- **Truthy and falsy values** — `filter` keeps an element when the callback's result is truthy. See [[b1-truthy-falsy]].

## The intuition

Picture a conveyor belt carrying items past three kinds of workstation.

At a **map** station, a worker picks up each item, makes something from it, and places the new thing on an outgoing belt. Ten items arrive; ten items leave. The originals are not altered — they continue on their own belt.

At a **filter** station, an inspector looks at each item and either waves it through or does not. Ten items arrive; somewhere between zero and ten leave, unchanged and in the same order.

At a **reduce** station, there is one worker holding a single container. For each item that arrives, the worker updates what is in the container — adds to a running total, drops the item into the right compartment — and at the end hands over the container. Ten items arrive; one thing leaves.

Stations can be placed in a row, each receiving the previous one's output. Where the picture is imperfect: on a real conveyor each item passes through all stations before the next item starts. JavaScript's array methods do not work that way. Each method processes the *entire* array and builds a complete new array before the next method begins.

## The shared shape: a callback per element

`map`, `filter`, `forEach`, `flatMap` and the search methods all follow one pattern. You pass a **callback** function; the method calls it once for each element, in index order, with three arguments:

```javascript title="callback-arguments.js"
['a', 'b'].map((element, index, array) => {
  console.log(element, index, array);
  return element;
});
```

```output
a 0 [ 'a', 'b' ]
b 1 [ 'a', 'b' ]
```

Most callbacks declare only the first parameter. The second is the element's index, and the third is the array being processed, which is useful in the middle of a chain where the intermediate array has no name. `reduce` is slightly different: its callback receives the accumulator first, as you will see.

What differs between the methods is **what they do with the callback's return value**:

| Method | Uses the callback's return value to… | Returns |
|---|---|---|
| `map` | become the element of the new array | New array, same length |
| `filter` | decide whether to keep the element (truthy = keep) | New array, same or shorter |
| `reduce` | become the accumulator for the next call | The final accumulator |
| `forEach` | nothing — it is ignored | `undefined` |
| `flatMap` | become elements of the new array, unpacked one level | New array, any length |

None of these methods mutates the array it is called on. (Your callback *can* mutate things; it should not.)

## map: transform every element

`map` calls the callback on each element and collects the return values into a new array. The result always has the same `length` as the original, and element `i` of the result came from element `i` of the input.

```javascript title="map.js"
const prices = [5, 12.5, 20];

const withTax = prices.map((p) => p * 1.2);
const labels = prices.map((p, i) => `#${i + 1}: £${p.toFixed(2)}`);

console.log(withTax);
console.log(labels);
console.log(prices);

const users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Lin' }];
console.log(users.map((u) => u.name));
console.log(users.map((u) => ({ ...u, active: true })));
```

```output
[ 6, 15, 24 ]
[ '#1: £5.00', '#2: £12.50', '#3: £20.00' ]
[ 5, 12.5, 20 ]
[ 'Ada', 'Lin' ]
[
  { id: 1, name: 'Ada', active: true },
  { id: 2, name: 'Lin', active: true }
]
```

The output type does not have to match the input type: numbers become strings, objects become names. `prices` is unchanged. The last line builds a new object for each user with an extra field; `{ ...u, active: true }` copies the user's properties into a new object. The parentheses around the object literal are required — without them, the braces would be read as a function body, and the function would return `undefined`.

Two things `map` is *not* for. It is not a loop for side effects: if you ignore the array it returns, you wanted `forEach` or `for...of`. And it cannot change the number of elements: to drop some, `filter` first, or use `flatMap`.

### The forgotten `return`

Since `map` uses the return value, a callback that returns nothing produces an array of `undefined`:

```javascript title="missing-return.js"
const doubled = [1, 2, 3].map((n) => { n * 2; });
console.log(doubled);
```

```output
[ undefined, undefined, undefined ]
```

An arrow function with a braced body needs an explicit `return`. Either write `(n) => n * 2` or `(n) => { return n * 2; }`.

### The extra-arguments trap: `map(parseInt)`

Passing an existing function directly as the callback is tidy, but remember that `map` passes three arguments, and the function may use them:

```javascript title="map-parseint.js"
console.log(['10', '10', '10'].map(parseInt));
console.log(['10', '10', '10'].map((s) => parseInt(s, 10)));
console.log(['10', '10', '10'].map(Number));
```

```output
[ 10, NaN, 2 ]
[ 10, 10, 10 ]
[ 10, 10, 10 ]
```

`parseInt(string, radix)` takes a number base as its second argument ([[b1-parseint-parsefloat]]). `map` supplies the *index* there, so the calls are `parseInt('10', 0)`, `parseInt('10', 1)` and `parseInt('10', 2)`. A radix of `0` means "default", giving `10`; a radix of `1` is invalid, giving `NaN`; and `'10'` in base 2 is `2`. Wrap the function in an arrow that passes only what you intend, or use a function such as `Number` that takes a single argument.

## filter: keep the elements that pass

`filter` calls the callback — here usually called a **predicate**, a function that answers yes or no — on each element, and returns a new array of the elements for which the result was truthy. Order is preserved, and the kept elements are the same values (the same object references) as in the original.

```javascript title="filter.js"
const tasks = [
  { title: 'Write tests', done: true },
  { title: 'Fix bug', done: false },
  { title: 'Deploy', done: false },
];

const open = tasks.filter((t) => !t.done);
console.log(open.map((t) => t.title));
console.log(open[0] === tasks[1]);

console.log(tasks.filter((t) => t.title.length > 100));
console.log([5, 8, 13, 21].filter((n, i) => i % 2 === 0));

const withoutFix = tasks.filter((t) => t.title !== 'Fix bug');
console.log(withoutFix.length, tasks.length);
```

```output
[ 'Fix bug', 'Deploy' ]
true
[]
[ 5, 13 ]
2 3
```

When nothing passes, the result is an empty array — never `null` or `undefined` — so it is always safe to chain another method or read `.length`. The predicate can use the index, as in the fourth line, which keeps the elements at even positions. The last line is the standard way to **remove** an item without mutating: keep everything that is not the item.

### `filter(Boolean)` and falsy values

The predicate's result is converted to a boolean, so any function can serve as a predicate. Passing the built-in `Boolean` function keeps the truthy elements:

```javascript title="filter-boolean.js"
const raw = ['Ada', '', null, 'Lin', undefined];
console.log(raw.filter(Boolean));

const readings = [3, 0, null, 7, 0];
console.log(readings.filter(Boolean));           // the zeros are gone
console.log(readings.filter((r) => r != null));  // remove only null/undefined
```

```output
[ 'Ada', 'Lin' ]
[ 3, 7 ]
[ 3, 0, 7, 0 ]
```

`filter(Boolean)` is a handy way to drop `null`, `undefined` and empty strings — but it also drops `0`, `NaN` and `false`, because they are falsy too. For numeric data, where `0` is a real value, that is a bug. Say what you mean: `r != null` removes exactly `null` and `undefined` ([[b1-undefined-vs-null]]).

## reduce: fold the array into one value

`reduce` is the most general of the three, and the one that takes practice. It walks the array from left to right carrying a value called the **accumulator**. For each element it calls your callback — conventionally named the **reducer** — with the current accumulator and the current element. Whatever the reducer returns becomes the accumulator for the next element. After the last element, the accumulator is the result.

```javascript
array.reduce((accumulator, element, index, array) => nextAccumulator, initialValue)
```

```javascript title="reduce-sum.js"
const amounts = [5, 10, 20];

const total = amounts.reduce((sum, n) => {
  console.log(`sum=${sum} n=${n} -> ${sum + n}`);
  return sum + n;
}, 0);

console.log(total);
```

```output
sum=0 n=5 -> 5
sum=5 n=10 -> 15
sum=15 n=20 -> 35
35
```

The second argument to `reduce`, `0`, is the **initial value**: the accumulator for the first call. Traced as a table:

| Call | `sum` (accumulator) | `n` (element) | Returned |
|---|---|---|---|
| 1 | `0` (initial value) | `5` | `5` |
| 2 | `5` | `10` | `15` |
| 3 | `15` | `20` | `35` |

The reducer **must return** the next accumulator. Forgetting to return means the next call receives `undefined`.

### The initial value: pass it

If you omit the initial value, `reduce` uses the **first element** as the starting accumulator and begins calling the reducer at the second element. That has three consequences, two of which are bugs waiting to happen.

```javascript title="reduce-initial-value.js"
const sum = (acc, n) => acc + n;

console.log([5, 10, 20].reduce(sum));       // works: starts with 5
console.log([5].reduce(sum));               // reducer never called
console.log([].reduce(sum, 0));             // safe with an initial value

try {
  [].reduce(sum);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}

const items = [{ price: 5 }, { price: 10 }];
console.log(items.reduce((acc, item) => acc + item.price));
console.log(items.reduce((acc, item) => acc + item.price, 0));
```

```output
35
5
0
TypeError: Reduce of empty array with no initial value
[object Object]10
15
```

On an **empty array** with no initial value there is nothing to start from, so `reduce` throws a `TypeError`. This passes every test that uses sample data and then fails in production the first time a list is empty. With a **one-element array**, the element is returned without the reducer running at all.

The last pair shows the third problem: without an initial value, the accumulator starts as the first *element*. When the elements are objects but the result should be a number, the first call computes `{ price: 5 } + 10`, which converts the object to the string `'[object Object]'` and concatenates. The accumulator and the elements have different types, so the initial value is not optional.

The rule: **always pass an initial value**, unless you have a specific reason not to. It makes empty arrays safe, makes the accumulator's type explicit, and makes every element go through the reducer.

### Building other shapes with `reduce`

The accumulator can be anything: a number, a string, an object, an array, a `Map`. That makes `reduce` able to express counting, grouping, indexing, finding a maximum — any computation that looks at each element once and carries state along.

```javascript title="reduce-shapes.js"
const votes = ['yes', 'no', 'yes', 'yes'];
const tally = votes.reduce((counts, vote) => {
  counts[vote] = (counts[vote] ?? 0) + 1;
  return counts;
}, {});
console.log(tally);

const users = [{ id: 'u1', name: 'Ada' }, { id: 'u2', name: 'Lin' }];
const byId = users.reduce((index, user) => {
  index[user.id] = user;
  return index;
}, {});
console.log(byId.u2.name);

const temps = [18, 24, 21];
console.log(temps.reduce((max, t) => (t > max ? t : max), -Infinity));
```

```output
{ yes: 3, no: 1 }
Lin
24
```

In the tally, the accumulator is an object that starts empty. For each vote, the reducer increments that vote's count (starting from `0` when the key is missing) and returns the same object. Mutating the accumulator here is safe, because the reducer created it — it is the `{}` passed as the initial value, and nothing else holds a reference to it.

For grouping specifically, ES2024 added `Object.groupBy(items, keyFn)` (available in Node.js 21 and later and current browsers), which is clearer than the `reduce` version:

```javascript title="group-by.js"
const pets = [
  { name: 'Rex', kind: 'dog' },
  { name: 'Tom', kind: 'cat' },
  { name: 'Fido', kind: 'dog' },
];
const grouped = Object.groupBy(pets, (p) => p.kind);
console.log(Object.keys(grouped), grouped.dog.map((p) => p.name));
```

```output
[ 'dog', 'cat' ] [ 'Rex', 'Fido' ]
```

### `reduceRight`

**`reduceRight`** is the same operation walking from the last element to the first. It matters when the combining step is not symmetric:

```javascript title="reduce-right.js"
const parts = ['a', 'b', 'c'];
console.log(parts.reduce((acc, s) => acc + s, ''));
console.log(parts.reduceRight((acc, s) => acc + s, ''));
```

```output
abc
cba
```

Its main real use is composing functions right to left ([[b1-compose-pipe]]).

### When not to use `reduce`

`reduce` can implement `map`, `filter`, `find`, `some` and everything else — which is exactly why it is often the wrong choice. A reader seeing `map` knows the result has one output per input; a reader seeing `reduce` must study the reducer to learn what is being built. Prefer the specific method when one exists: `map` and `filter` for those jobs, `some`/`every`/`find` for searching ([[b1-array-search]]), `Math.max(...nums)` for the maximum of a modest-sized array, `Object.groupBy` for grouping, `Object.fromEntries` for building an object from pairs. When the reducer grows past a few lines, a plain `for...of` loop with a named variable is usually easier to read and to debug. Use `reduce` for what it names: reducing many values to one.

## Chaining

Because `map` and `filter` return arrays, calls can be chained, each working on the result of the one before:

```javascript title="chaining.js"
const orders = [
  { id: 1, total: 40, status: 'paid' },
  { id: 2, total: 15, status: 'refunded' },
  { id: 3, total: 60, status: 'paid' },
];

const revenue = orders
  .filter((o) => o.status === 'paid')
  .map((o) => o.total)
  .reduce((sum, t) => sum + t, 0);

console.log(revenue);
```

```output
100
```

Read top to bottom: keep the paid orders, take each one's total, add them up. Each line does one job. Order matters for efficiency — filtering first means the later steps handle fewer elements — and for correctness, since `map` changes what the following callbacks receive.

Each step in a chain walks its input completely and allocates a new array. Three steps over 1,000 elements is three passes and two intermediate arrays; for the list sizes of typical UI code that cost is not measurable. For hundreds of thousands of elements in a hot path, combine the steps into a single `reduce` or a `for...of` loop:

```javascript title="single-pass.js"
const orders = [
  { total: 40, status: 'paid' },
  { total: 15, status: 'refunded' },
  { total: 60, status: 'paid' },
];

let revenue = 0;
for (const o of orders) {
  if (o.status === 'paid') revenue += o.total;
}
console.log(revenue);
```

```output
100
```

Optimise for reading first; switch to the single pass when a profiler says the chain matters ([[b1-profiling-basics]]).

```quiz
Q: What does `[1, 2, 3].map((n) => { n * 2 })` return?
- [ ] `[2, 4, 6]`
- [x] `[undefined, undefined, undefined]`
- [ ] `[]`
- [ ] It throws a `SyntaxError`
> Braces after `=>` start a function body, not an object or an expression. The body evaluates `n * 2` and discards it; with no `return`, the function returns `undefined`. `map` still produces one element per input, so the result has three `undefined` values.

Q: What happens when `cart.reduce((sum, item) => sum + item.price)` runs on an empty `cart`?
- [ ] It returns `0`
- [ ] It returns `undefined`
- [x] It throws a `TypeError`, because there is no initial value and no first element to use instead
- [ ] It returns `NaN`
> Without an initial value, `reduce` takes the first element as the starting accumulator. An empty array has none, so it throws `TypeError: Reduce of empty array with no initial value`. Passing `0` as the second argument fixes this, and also stops the first item object from being used as the running total.

Q: Why does `['1', '2', '3'].map(parseInt)` return `[1, NaN, NaN]`?
- [ ] `parseInt` cannot parse strings inside `map`
- [x] `map` passes the index as the second argument, which `parseInt` treats as the radix
- [ ] `map` converts the strings to numbers before calling `parseInt`
- [ ] `parseInt` only works on the first element of an array
> The calls are `parseInt('1', 0)`, `parseInt('2', 1)` and `parseInt('3', 2)`. Radix 0 means default (10), radix 1 is invalid, and `'3'` is not a valid base-2 digit. Use `(s) => parseInt(s, 10)` or `Number`.
```

## forEach {#b1-foreach}

`forEach` calls a function once for each element of an array, in order, and returns `undefined`. It is a loop written as a method: use it when you want to *do* something for each element — log it, add it to the page, send it somewhere — and you do not need a result array.

```javascript title="foreach.js"
const names = ['Ada', 'Lin'];

const result = names.forEach((name, index) => {
  console.log(`${index + 1}. ${name}`);
});
console.log(result);
```

```output
1. Ada
2. Lin
undefined
```

The callback receives the same `(element, index, array)` arguments as `map`. The difference from `map` is what happens to the callback's return value: `forEach` **ignores it** and builds nothing. That makes the intent clear in both directions. If the code needs the transformed array, it should use `map`. If it only causes effects, it should use `forEach` or `for...of` — using `map` and throwing the array away allocates an array for no reason and misleads the reader. Because it returns `undefined`, `forEach` also cannot be chained; it must come last.

### You cannot stop a `forEach`

`forEach` has no way to exit early. `break` and `continue` are syntax errors inside the callback, because the callback is a separate function, not a loop body. A `return` only ends the current call of the callback — the equivalent of `continue` — and `forEach` moves on to the next element.

```javascript title="foreach-no-break.js"
[1, 2, 3, 4].forEach((n) => {
  if (n === 2) return;          // skips this element only
  console.log('forEach', n);
});

for (const n of [1, 2, 3, 4]) {
  if (n === 3) break;           // really stops the loop
  console.log('for...of', n);
}

function firstNegative(nums) {
  nums.forEach((n) => {
    if (n < 0) return n;        // returns from the callback, not from firstNegative
  });
}
console.log(firstNegative([4, -2, 7]));
```

```output
forEach 1
forEach 3
forEach 4
for...of 1
for...of 2
undefined
```

The last function is a common beginner bug: the `return n` inside the callback hands a value back to `forEach`, which discards it, and `firstNegative` falls off its end returning `undefined`. Inside a `for...of` loop the same `return` would return from the enclosing function.

The only way to abort a `forEach` is to throw an exception, which also aborts everything else and should not be used for control flow. When you need to stop early, use `for...of` with `break`, or a method that stops by design: `find`, `findIndex`, `some` or `every`.

### `forEach` does not wait for `async` callbacks

`forEach` calls the callback and immediately moves on; it does not look at what the callback returns. An `async` function returns a promise the moment it reaches its first `await` ([[b1-async-await]]), so `forEach` starts every callback one after another without waiting for any of them, and then returns while they are all still pending.

```javascript title="foreach-async.js"
const save = async (id) => {
  await null;                           // stands in for a network request
  console.log('saved', id);
};

async function withForEach(ids) {
  ids.forEach(async (id) => {
    await save(id);
  });
  console.log('forEach finished');      // runs before any save completes
}

async function withForOf(ids) {
  for (const id of ids) {
    await save(id);                     // pauses this function each time
  }
  console.log('for...of finished');
}

await withForEach([1, 2]);
await new Promise((resolve) => setTimeout(resolve, 10));
await withForOf([3, 4]);
```

```output
forEach finished
saved 1
saved 2
saved 3
saved 4
for...of finished
```

With `forEach`, "finished" is printed before either save completes, and an error thrown inside a callback becomes an unhandled promise rejection instead of reaching a surrounding `try`/`catch`. (The file is an ES module, which allows `await` at the top level.) There are two correct alternatives, depending on what you want. To run the operations **one after another**, use `for...of` with `await`. To run them **at the same time** and wait for all of them, use `map` to collect the promises and `await Promise.all(ids.map(save))`. See [[b1-sequential-vs-parallel]] and [[b1-promise-all]].

### Other behaviours

`forEach` reads `length` once before it starts, so elements pushed onto the array during iteration are not visited. Elements removed during iteration shift the rest down and cause one to be skipped. It skips holes in sparse arrays ([[b1-sparse-arrays]]): `[1, , 3].forEach(fn)` calls `fn` twice. It accepts an optional second argument that becomes `this` inside a non-arrow callback, which arrow functions have made obsolete. `Map`, `Set` and DOM `NodeList` objects have their own `forEach` methods with the same idea, though `NodeList` has no `map` or `filter`.

### `forEach` or `for...of`?

| Need | `forEach` | `for...of` |
|---|---|---|
| `break` / `continue` / early `return` | No (`return` acts as `continue`) | Yes |
| `await` each step in sequence | No | Yes |
| The index | Second callback argument | Use `arr.entries()` |
| Works on any iterable (`Map`, `Set`, generators, strings) | Only where a `forEach` method exists | Yes |
| Skips holes | Yes | No — yields `undefined` |

Many teams default to `for...of` for side-effect loops, because it handles every case in the table, and keep `forEach` for the end of a method chain: `items.filter(isNew).forEach(notify)`.

```quiz
Q: What does this function return? `function has(list, x) { list.forEach((v) => { if (v === x) return true; }); return false; }`
- [ ] `true` when `x` is in the list
- [x] Always `false`
- [ ] `undefined`
- [ ] It throws, because `return` is not allowed in `forEach`
> `return true` returns from the arrow callback, and `forEach` ignores that value. Nothing ever returns `true` from `has`, so execution always reaches `return false`. Use `list.includes(x)`, `list.some(...)` or a `for...of` loop.

Q: Why does `ids.forEach(async (id) => { await upload(id); }); console.log('done');` print `done` before the uploads finish?
- [ ] `await` does not work inside arrow functions
- [x] `forEach` ignores the promise each `async` callback returns, so it never waits
- [ ] `console.log` has a higher priority than promises
- [ ] The uploads run on another thread
> An `async` callback returns a promise at its first `await`. `forEach` discards return values, starts the next callback at once, and returns. Use `for...of` with `await` to run in sequence, or `await Promise.all(ids.map(upload))` to run concurrently and wait.
```

## flat and flatMap {#b1-flat-flatmap}

`flat` and `flatMap` deal with arrays inside arrays. **`flat(depth)`** returns a new array in which nested arrays have been unpacked into the outer array, down to `depth` levels (one level by default). **`flatMap(fn)`** maps each element with `fn` and then flattens the result by exactly one level, in a single pass. Both were added in ES2019, and neither mutates the original.

### `flat`

```javascript title="flat.js"
const nested = [1, [2, 3], [4, [5, [6]]]];

console.log(nested.flat());           // one level (the default)
console.log(nested.flat(2));
console.log(nested.flat(Infinity));   // every level
console.log(nested.flat(0).length);   // no flattening: a shallow copy, still 3 elements

console.log(['ab', ['cd']].flat());   // strings are not unpacked
console.log([1, , 3, [4, , 6]].flat());  // holes are removed
```

```output
[ 1, 2, 3, 4, [ 5, [ 6 ] ] ]
[ 1, 2, 3, 4, 5, [ 6 ] ]
[ 1, 2, 3, 4, 5, 6 ]
3
[ 'ab', 'cd' ]
[ 1, 3, 4, 6 ]
```

With the default depth of 1, only the first layer of nesting is opened: `[2, 3]` is unpacked, but the `[5, [6]]` that was two levels down is still an array. `flat(Infinity)` flattens completely, whatever the depth. Only real arrays are unpacked — strings and array-like objects are left as single elements, so there is no danger of a string being split into characters. `flat` also drops holes, at every level it flattens, which makes `arr.flat(0)` an occasional idiom for removing holes while copying.

The most common use is merging a list of lists: pages of results, the children of several parents, rows of a grid.

```javascript title="flat-pages.js"
const pages = [['a', 'b'], ['c'], []];
console.log(pages.flat(), pages.flat().length);
```

```output
[ 'a', 'b', 'c' ] 3
```

### `flatMap`

Often the nested arrays come from a `map` whose callback returns an array. `flatMap` combines the two steps:

```javascript title="flatmap.js"
const sentences = ['the quick fox', 'jumps over'];

console.log(sentences.map((s) => s.split(' ')));
console.log(sentences.flatMap((s) => s.split(' ')));

const orders = [
  { id: 1, items: ['pen', 'ink'] },
  { id: 2, items: ['paper'] },
];
console.log(orders.flatMap((o) => o.items));
```

```output
[ [ 'the', 'quick', 'fox' ], [ 'jumps', 'over' ] ]
[ 'the', 'quick', 'fox', 'jumps', 'over' ]
[ 'pen', 'ink', 'paper' ]
```

`map` alone gives an array of arrays. `flatMap` unpacks each returned array into the result. `arr.flatMap(fn)` produces the same result as `arr.map(fn).flat()`, without building the intermediate array of arrays.

The more interesting way to think of `flatMap` is as **a `map` in which each element can produce zero, one or many outputs**. Return an empty array to produce nothing, a one-element array (or a bare value) to produce one, and a longer array to produce several:

```javascript title="flatmap-zero-one-many.js"
const nums = [1, 2, 3];

// filter and map in one pass: keep the even numbers, doubled
console.log(nums.flatMap((n) => (n % 2 === 0 ? [n * 2] : [])));

// expand: each number followed by its negative
console.log(nums.flatMap((n) => [n, -n]));

// a value that is not an array is kept as one element
console.log(nums.flatMap((n) => n * 10));

// only one level is flattened
console.log([1, 2].flatMap((n) => [ [n, n] ]));
```

```output
[ 4 ]
[ 1, -1, 2, -2, 3, -3 ]
[ 10, 20, 30 ]
[ [ 1, 1 ], [ 2, 2 ] ]
```

Returning `[]` to drop an element makes `flatMap` a combined filter-and-map, which is useful when deciding whether to keep an element and computing its replacement share work. The last line shows the limit: `flatMap` always flattens **exactly one level**. If the callback returns an array containing the pair `[n, n]`, the outer array is unpacked and the inner one stays. To keep an array as a single element on purpose, wrap it once: `[pair]`. For deeper flattening, use `map(fn).flat(depth)`.

### Limits

`flat` on a very deeply nested structure recurses once per level, so `flat(Infinity)` on pathological input can exhaust the call stack ([[b1-stack-overflow]]). And neither method understands cyclic structures: an array that contains itself makes `flat(Infinity)` recurse until it throws a `RangeError`. Ordinary data — pages of results, tree children a few levels deep — is nowhere near these limits.

```quiz
Q: What does `[[1, 2], [3, [4]]].flat()` return?
- [ ] `[1, 2, 3, 4]`
- [x] `[1, 2, 3, [4]]`
- [ ] `[[1, 2], [3, [4]]]`
- [ ] `[1, 2, [3, [4]]]`
> `flat()` uses a depth of 1, so it unpacks the two outer sub-arrays and leaves anything nested deeper. `[4]` was two levels down and remains an array. Use `flat(2)` or `flat(Infinity)` to flatten it too.

Q: Which call returns `[2, 6]` from `[1, 2, 3]` — the odd numbers doubled — in one pass?
- [ ] `[1, 2, 3].map((n) => (n % 2 ? n * 2 : []))`
- [x] `[1, 2, 3].flatMap((n) => (n % 2 ? [n * 2] : []))`
- [ ] `[1, 2, 3].flat((n) => n * 2)`
- [ ] `[1, 2, 3].forEach((n) => (n % 2 ? n * 2 : null))`
> `flatMap` unpacks each returned array, so an empty array contributes nothing and a one-element array contributes one value. `map` would leave an empty array in the middle of the result, `flat` does not take a callback, and `forEach` returns `undefined`.
```

## How it works internally

Each method is specified as a loop over indexes `0` to `length - 1`, with `length` read once at the start. For each index, `map`, `filter`, `forEach`, `reduce`, `some` and `every` first check that the index exists as a property; if it is a hole, the callback is not called. This check is why these methods skip holes — and why `map` on an array of holes returns holes ([[b1-sparse-arrays]]). `flatMap` and `flat` skip holes too and do not copy them to the output.

`map` creates its result array with the same `length` as the source up front and assigns each result at its index; `filter` appends each kept element to an initially empty array. `reduce` without an initial value searches from the left for the first index that exists and uses that element as the accumulator; if it finds none, it throws the `TypeError`.

Because `length` is captured first, elements appended by the callback are never visited. Elements changed before the loop reaches them are seen with their new values, and elements deleted before they are reached are skipped. Mutating the array you are iterating is legal and confusing; do not rely on these rules.

The new arrays are created through a mechanism called `ArraySpeciesCreate`, which allows a subclass of `Array` to get instances of the subclass back from `map` and `filter`. For plain arrays this is an ordinary `Array`.

On performance: engines implement these methods natively and V8 can inline simple callbacks, so `map` and `filter` on dense arrays are close to hand-written loops. The costs that remain are the function call per element when inlining fails, and the allocation of each result array. Writing the methods yourself is a common interview exercise; see [[b1-impl-map-filter-reduce]].

## Worked example: an order report

An online shop has a list of orders, each with line items. The dashboard needs the number of paid orders, the revenue, the units sold per product, and the three best sellers.

```javascript title="order-report.js"
const orders = [
  { id: 'A1', status: 'paid', lines: [{ sku: 'pen', qty: 3, price: 2 }, { sku: 'ink', qty: 1, price: 9 }] },
  { id: 'A2', status: 'cancelled', lines: [{ sku: 'pen', qty: 10, price: 2 }] },
  { id: 'A3', status: 'paid', lines: [{ sku: 'pad', qty: 2, price: 5 }, { sku: 'pen', qty: 4, price: 2 }] },
  { id: 'A4', status: 'paid', lines: [] },
];

const paid = orders.filter((o) => o.status === 'paid');

// One flat list of line items across all paid orders.
const lines = paid.flatMap((o) => o.lines);

const revenue = lines
  .map((l) => l.qty * l.price)
  .reduce((sum, amount) => sum + amount, 0);

const unitsBySku = lines.reduce((units, l) => {
  units[l.sku] = (units[l.sku] ?? 0) + l.qty;
  return units;
}, {});

const bestSellers = Object.entries(unitsBySku)
  .toSorted(([, a], [, b]) => b - a)
  .slice(0, 3)
  .map(([sku, qty]) => `${sku} (${qty})`);

console.log(paid.length, lines.length);
console.log(revenue);
console.log(unitsBySku);
console.log(bestSellers);
paid.forEach((o) => console.log(`${o.id}: ${o.lines.length} line(s)`));
```

```output
3 4
33
{ pen: 7, ink: 1, pad: 2 }
[ 'pen (7)', 'pad (2)', 'ink (1)' ]
A1: 2 line(s)
A3: 2 line(s)
A4: 0 line(s)
```

Each step uses the method that names its job. `filter` selects the paid orders. `flatMap` turns "an array of orders, each with an array of lines" into one array of lines; order `A4`, with no lines, contributes nothing, and the cancelled order's ten pens are excluded because it was filtered out first. `map` computes each line's amount and `reduce` sums them with an initial value of `0`, so the report still works on a day with no orders. The second `reduce` builds an object of units per product. `Object.entries` turns that object into `[sku, qty]` pairs so that array methods can sort and format them; the comparator destructures each pair and sorts by quantity descending ([[b1-array-sort]], [[b1-destructuring]]). `forEach` comes last, for the one step that is purely a side effect.

## In real systems

**Rendering lists.** React components render collections with `map`: `items.map((item) => <Row key={item.id} item={item} />)`. Filtering before mapping — `items.filter(isVisible).map(...)` — is the standard way to render a subset. See [[b4-rendering-lists]] and [[b4-keys]].

**Reshaping API data.** Responses rarely arrive in the shape the UI wants. `map` picks and renames fields, `filter` removes records the user should not see, and `reduce` or `Object.groupBy` builds lookup tables and grouped sections.

**State updates.** Immutable updates in React and Redux are `map` (replace one item), `filter` (remove one) and spread (add one), as shown in [[b1-array-mutation]]. Redux's central idea — `(state, action) => newState` — is named after `reduce`: the store's state is the result of reducing the list of actions.

**Concurrent requests.** `await Promise.all(ids.map((id) => fetchUser(id)))` starts one request per id and waits for all of them. This is `map` producing an array of promises, not `forEach`.

**Flattening.** `flatMap` merges paginated results, collects the tags from many posts, and expands a list of folders into a list of files. `flat(Infinity)` normalises arguments that may be values or arrays of values.

**Build and data tooling.** Bundlers, linters and data scripts running on Node.js are largely pipelines of these methods over lists of files, tokens or records.

## Trade-offs and alternatives

| Approach | Strengths | Costs |
|---|---|---|
| `map` / `filter` / `reduce` chain | States intent; no mutable variables; composable | One pass and one array per step; cannot `break`; awkward with `await` |
| `for...of` loop | `break`, `continue`, `await`; single pass; any iterable | More code; the reader must infer the intent |
| Classic `for` loop | Full control of index and direction; fastest in hot paths | Most room for off-by-one errors |
| Iterator helpers (`values().filter().map()`) | Lazy: no intermediate arrays, stops early | ES2025; needs a recent runtime (Node.js 22+) |

Use the array methods by default for transforming data, because they make the shape of the computation visible. Switch to a loop when you need to stop early, await each step in order, update several results in one pass, or when profiling shows the chain is a bottleneck. The functional style these methods support is discussed in [[b1-functional-style]].

## Common mistakes

> [!MISTAKE] Calling `reduce` without an initial value
> `[].reduce(fn)` throws, a one-element array skips the reducer, and with objects the first *element* becomes the accumulator. Pass the initial value — `0`, `''`, `[]`, `{}` — every time.

**Forgetting `return` in a braced callback.** `map` gives `undefined`s, `filter` gives `[]`, `reduce` gives `undefined` or `NaN`. Use an expression body or write `return`.

**Returning an object literal without parentheses.** `(u) => { name: u.name }` is a function body containing a label, and returns `undefined`. Write `(u) => ({ name: u.name })`.

**Using `map` for side effects.** If the returned array is not used, use `forEach` or `for...of`.

**Expecting `forEach` to return something, break, or await.** It returns `undefined`, cannot be stopped, and does not wait for promises.

**`filter(Boolean)` on numeric data.** It removes `0`. Use an explicit test.

**Passing a multi-argument function directly.** `map(parseInt)` receives the index as the radix. Wrap it in an arrow function.

**Mutating elements inside `map`.** `users.map((u) => { u.active = true; return u; })` returns a new array containing the *same, now mutated* objects. Return a new object: `({ ...u, active: true })`.

**`map` with an `async` callback and no `Promise.all`.** The result is an array of promises, not values. `await Promise.all(...)` it.

**Expecting `flat()` or `flatMap` to flatten deeply.** Both stop at one level by default; `flatMap` always does.

**Spreading in a reducer on large arrays.** `reduce((acc, x) => [...acc, f(x)], [])` copies the accumulator on every step, making the whole operation O(n²). Use `map`, or `push` onto the accumulator you own.

## Interview perspective

Interviewers use these methods in three ways: "what does this print?" questions on the traps above, asking you to implement `map`, `filter` or `reduce` yourself, and watching whether you reach for the right method while solving a larger problem.

> [!INTERVIEW] What a strong answer sounds like
> "`map` returns a new array of the same length with each element transformed. `filter` returns a new array of the elements whose predicate is truthy. `reduce` carries an accumulator across the elements and returns its final value — and I always pass an initial value so that empty arrays work and the accumulator's type is explicit. None of them mutates the source, and all of them skip holes."

Questions you should be able to answer:

- **`map` versus `forEach`?** `map` returns a new array built from the callback's return values; `forEach` returns `undefined` and is for side effects. Neither can be stopped early.
- **Implement `map` using `reduce`.** `arr.reduce((out, x, i) => { out.push(fn(x, i, arr)); return out; }, [])`.
- **What happens with `reduce` and no initial value?** The first element is the initial accumulator; an empty array throws a `TypeError`.
- **How do you run async work for each element?** Sequentially: `for...of` with `await`. Concurrently: `Promise.all(arr.map(fn))`. Not `forEach`.
- **How would you flatten an arbitrarily nested array without `flat`?** Recursively: reduce over the elements, concatenating `flatten(x)` when `Array.isArray(x)` and `x` otherwise; or iteratively with a stack.
- **What is the complexity of a chain of three methods?** O(n) time for each, so O(n) overall, with O(n) extra space for each intermediate array.
- **`flatMap` versus `map().flat()`?** The same result for depth 1; `flatMap` does it in one pass without the intermediate array, and cannot flatten deeper.

A follow-up to expect: *"Is `reduce` faster than `filter().map()`?"* It makes one pass and no intermediate array, so it can be, on very large inputs. For typical sizes the difference is negligible and the chain is easier to read; measure before optimising.

## Practice

1. Given `[{ name, score }, ...]`, produce the names of students scoring at least 50, in upper case. Then produce the average score, handling an empty list without throwing or returning `NaN`.
2. Implement `myMap`, `myFilter` and `myReduce` as functions taking the array as the first argument. `myReduce` must support a missing initial value and throw on an empty array without one.
3. Write `countBy(arr, keyFn)` with `reduce`, returning an object of counts. Rewrite it with `Object.groupBy`.
4. A function `async function loadAll(ids)` uses `ids.forEach(async (id) => results.push(await load(id)))` and returns `results`, which is always empty. Explain why and write the sequential and the concurrent fixes.
5. Using `flatMap`, turn `[{ tag: 'a', count: 2 }, { tag: 'b', count: 0 }, { tag: 'c', count: 1 }]` into `['a', 'a', 'c']`.
6. Write `flatten(arr)` that fully flattens nested arrays without using `flat`, once recursively and once with an explicit stack.

## Quick revision {#quick-revision}

- Callbacks receive `(element, index, array)`; the reducer receives `(accumulator, element, index, array)`.
- `map(fn)`: new array, same length, each element replaced by `fn`'s return value.
- `filter(fn)`: new array of the elements where `fn` is truthy; `[]` when none; same references.
- `reduce(fn, init)`: carries an accumulator left to right; returns its final value. `reduceRight` goes right to left.
- No initial value: the first element is the accumulator; empty array → `TypeError`; one element → returned without calling `fn`. Always pass one.
- `forEach(fn)`: side effects only; returns `undefined`; no `break`; `return` acts as `continue`; does not await `async` callbacks.
- Sequential async: `for...of` + `await`. Concurrent: `await Promise.all(arr.map(fn))`.
- `flat(depth = 1)`: unpacks nested arrays; `flat(Infinity)` fully; removes holes; leaves strings alone.
- `flatMap(fn)`: `map` then flatten exactly one level, in one pass; return `[]` to drop, `[a, b]` to expand.
- None of these mutates the source; all skip holes; `length` is read once at the start.
- Traps: missing `return` in a braced arrow; `({ ... })` needed to return an object literal; `map(parseInt)`; `filter(Boolean)` drops `0`; mutating elements inside `map`.
- Chains cost one pass and one array per step; fine for UI-sized data, replace with a loop in hot paths.
- `Object.groupBy(items, keyFn)` (ES2024) replaces grouping with `reduce`.

## Key takeaways {#key-takeaways}

- `map` transforms, `filter` selects, `reduce` combines; choosing the specific method tells the reader the shape of the result before they read the callback.
- Each method uses the callback's return value differently, so a missing `return` fails differently in each.
- Pass an initial value to `reduce` every time.
- `forEach` is for side effects and cannot break or await; use `for...of` when you need either.
- `flatMap` is a `map` whose callback may return zero, one or many elements; `flat` unpacks nesting to a chosen depth.
- These methods do not mutate the array, but they do not protect the objects inside it — return new objects instead of editing elements.
