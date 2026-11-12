---
summary: Some array methods change the array you call them on; others leave it alone and return a new one. You will learn which is which, what each one returns, how `push`/`pop`/`shift`/`unshift` and `slice`/`splice` behave at their edges, and how to update arrays without mutation — the skill that React state and other shared data depend on.
difficulty: beginner
minutes: 50
objectives:
  - Classify the common array methods as mutating or non-mutating and state what each returns
  - Explain why mutating a shared array causes bugs, using references and identity
  - Use `push`, `pop`, `shift` and `unshift` to build stacks and queues, and explain their costs
  - Predict the results of `slice` and `splice` for negative, missing and out-of-range arguments
  - Rewrite a mutating update (add, remove, replace, insert, sort) as a non-mutating one, including with the ES2023 methods `toSorted`, `toReversed`, `toSpliced` and `with`
---

## Introduction

Here is a bug that almost every JavaScript developer writes once. A function receives a list of prices and needs to show the three cheapest, so it sorts the list and takes the first three. It works. But a different part of the page, which was displaying the prices in the order the user added them, is now showing them sorted too. Nobody touched that code.

The cause is that `sort` does not produce a sorted copy. It rearranges the array it is called on. The function sorted *the caller's* array, and every other piece of code holding a reference to that array saw the change.

JavaScript's array methods fall into two families. **Mutating methods** change the existing array in place: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill` and `copyWithin`. **Non-mutating methods** leave the array untouched and return something new: `slice`, `concat`, `map`, `filter`, `flat`, and the four ES2023 additions `toSorted`, `toReversed`, `toSpliced` and `with`. The method names give little help — `slice` copies while `splice` mutates; `concat` copies while `push` mutates — so the classification has to be learned.

Knowing the two families matters most where data is shared. A React component must never mutate its state array, because React decides whether to re-render by comparing the old and new array references. A function that mutates its argument surprises its caller. This lesson gives you the full map, then studies the two groups people confuse most in their own sections: [[b1-push-pop-shift|push, pop, shift and unshift]], and [[b1-slice-splice|slice versus splice]].

## Before you start

- **Array basics** — creating arrays, indexes and `length`. See [[b1-array-basics]].
- **References** — a variable holds a reference to an array, and assigning it or passing it to a function shares the same array. See [[b1-primitive-vs-reference]] and [[b1-call-by-sharing]].
- **Strict equality on objects** — `a === b` is true for two arrays only when they are the same array. See [[b1-strict-equality]].
- **Spread syntax** — `[...arr]` builds a new array from the elements of `arr`. See [[b1-spread-rest]]; the lesson explains each use as it appears.

## The intuition

Think of an array as a bookshelf, and of a variable as a slip of paper with the shelf's location written on it. Several people can hold slips pointing at the same shelf.

A **mutating** method walks up to the shelf and rearranges, adds or removes books. Everyone holding a slip sees the new arrangement the next time they look, whether they wanted it or not. A **non-mutating** method builds a second shelf, arranges copies of the book *list* on it, and hands you a slip for the new shelf. The original shelf is untouched, and people holding the old slip notice nothing.

Where the analogy needs care: the new shelf does not contain new books. If the elements are objects, both shelves point at the same objects. Non-mutating array methods produce a new *array*, not new *elements* — the copy is shallow. That limit is explored in [[b1-copying-arrays]].

## What "mutate" means

To **mutate** an array is to change its contents — its elements or its `length` — while it remains the same object. The test is identity: after the operation, is the result `===` to the original, and has the original changed?

```javascript title="mutation-vs-copy.js"
const prices = [30, 10, 20];

const sorted = prices.sort((a, b) => a - b);
console.log(prices, sorted, sorted === prices);

const original = [30, 10, 20];
const copy = original.toSorted((a, b) => a - b);
console.log(original, copy, copy === original);
```

```output
[ 10, 20, 30 ] [ 10, 20, 30 ] true
[ 30, 10, 20 ] [ 10, 20, 30 ] false
```

`sort` rearranged `prices` itself and then returned the very same array, so `sorted` and `prices` are two names for one sorted array. `toSorted` built a new array and left `original` in its original order. (The comparator `(a, b) => a - b` sorts numbers ascending; [[b1-array-sort]] explains why it is needed.)

Mutation becomes a bug when someone else holds a reference and does not expect the change:

```javascript title="mutating-an-argument.js"
function cheapestThree(list) {
  return list.sort((a, b) => a - b).slice(0, 3);   // sorts the caller's array
}

const cart = [40, 15, 99, 5];
console.log(cheapestThree(cart));
console.log(cart);                                 // the caller's order is gone
```

```output
[ 5, 15, 40 ]
[ 5, 15, 40, 99 ]
```

The function returned the right answer and destroyed the caller's ordering as a side effect. The fix is one word — `list.toSorted(...)` — or copying first with `[...list].sort(...)`. A function that changes nothing outside itself is called **pure**; see [[b1-pure-functions]] and [[b1-side-effects]].

## The map of methods

| Method | Mutates? | Returns |
|---|---|---|
| `push(...items)` | Yes | The new `length` |
| `pop()` | Yes | The removed last element |
| `unshift(...items)` | Yes | The new `length` |
| `shift()` | Yes | The removed first element |
| `splice(start, deleteCount, ...items)` | Yes | An array of the removed elements |
| `sort(compare)` | Yes | The same array |
| `reverse()` | Yes | The same array |
| `fill(value, start, end)` | Yes | The same array |
| `copyWithin(target, start, end)` | Yes | The same array |
| `slice(start, end)` | No | A new array with the selected range |
| `concat(...values)` | No | A new array with the values appended |
| `map`, `filter`, `flat`, `flatMap` | No | A new array |
| `toSorted(compare)` (ES2023) | No | A new sorted array |
| `toReversed()` (ES2023) | No | A new reversed array |
| `toSpliced(start, deleteCount, ...items)` (ES2023) | No | A new array with the edit applied |
| `with(index, value)` (ES2023) | No | A new array with one element replaced |
| `join`, `indexOf`, `includes`, `find`, `some`, `every`, `reduce`, `at` | No | A string, number, boolean or element |

Two more ways to mutate are not methods at all: assigning to an index (`arr[0] = x`) and assigning to `length` (`arr.length = 0`).

Notice the three different return conventions among the mutating methods, because each causes its own bug. `push` and `unshift` return a **number**. `pop`, `shift` and `splice` return **what was removed**. `sort`, `reverse`, `fill` and `copyWithin` return **the array itself**, which makes them look like they produced a copy when they did not.

```javascript title="return-values.js"
const a = [1, 2];
console.log(a.push(3));          // a number, not the array
console.log(a.reverse() === a);  // the same array
console.log(a.splice(0, 1));     // what was removed
console.log(a);
```

```output
3
true
[ 3 ]
[ 2, 1 ]
```

## push, pop, shift and unshift {#b1-push-pop-shift}

These four methods add or remove elements at the two ends of an array. **`push`** adds to the end and **`pop`** removes from the end. **`unshift`** adds to the front and **`shift`** removes from the front. All four mutate the array. The adders return the array's new `length`; the removers return the element they removed.

```javascript title="four-ends.js"
const list = ['b', 'c'];

console.log(list.push('d'), list);
console.log(list.unshift('a'), list);
console.log(list.pop(), list);
console.log(list.shift(), list);
```

```output
3 [ 'b', 'c', 'd' ]
4 [ 'a', 'b', 'c', 'd' ]
d [ 'a', 'b', 'c' ]
a [ 'b', 'c' ]
```

A way to keep the names straight: `push` and `pop` are the short, common pair and work at the end; `shift` *shifts* every remaining element down one index, and `unshift` undoes that.

### Several items at once, and empty arrays

`push` and `unshift` accept any number of arguments and keep them in the order written. `pop` and `shift` on an empty array return `undefined` and do not throw.

```javascript title="edges.js"
const nums = [3];
nums.push(4, 5);
nums.unshift(1, 2);              // inserted as a block: 1 then 2
console.log(nums);

const more = [6];
nums.push(...more);              // spread to append another array's elements
console.log(nums);

const empty = [];
console.log(empty.pop(), empty.shift(), empty.length);
```

```output
[ 1, 2, 3, 4, 5 ]
[ 1, 2, 3, 4, 5, 6 ]
undefined undefined 0
```

`unshift(1, 2)` inserts both values as one block, so the result starts `1, 2` — not `2, 1`, which is what two separate calls `unshift(1)` then `unshift(2)` would give. `push(...more)` appends each element of `more`; without the spread, `push(more)` would append the array itself as a single nested element. For very large arrays (hundreds of thousands of elements) spreading into `push` can exceed the engine's limit on function arguments and throw a `RangeError`; use `concat` or a loop there.

Because an empty `pop` returns `undefined`, a loop like `while ((item = stack.pop()) !== undefined)` stops early if `undefined` is a legitimate element. Loop on `stack.length > 0` instead.

### The `push` return-value trap

`push` returns the new length, so assigning its result back replaces your array with a number:

```javascript title="push-trap.js"
let tags = ['js'];
tags = tags.push('css');         // tags is now the number 2
console.log(tags);

try {
  tags.push('html');
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
```

```output
2
TypeError: tags.push is not a function
```

The same mistake appears in arrow functions that are meant to return an updated array: `items => items.push(x)` returns a number. In React, `setItems(items.push(x))` both mutates the current state and sets the new state to a number. The non-mutating way to add an element is `[...items, x]`.

### Stacks and queues

A **stack** is a last-in, first-out collection: the most recently added item is the first removed, like a pile of plates. `push` and `pop` implement it directly, and both are fast. A **queue** is first-in, first-out, like a line at a counter: `push` adds to the back and `shift` removes from the front.

```javascript title="stack-and-queue.js"
const undoStack = [];
undoStack.push('type "a"');
undoStack.push('type "b"');
console.log(undoStack.pop());    // most recent first

const printQueue = [];
printQueue.push('report.pdf');
printQueue.push('photo.png');
console.log(printQueue.shift()); // oldest first
```

```output
type "b"
report.pdf
```

The data structures themselves are taught in [[a5-stack]] and [[a5-queue]].

### Why the front is slower than the end

An element's position *is* its index. Removing the first element means the element at index `1` must become index `0`, index `2` must become index `1`, and so on for every element. The specification describes `shift` and `unshift` as exactly that loop, so their cost grows with the length of the array: **O(n)**. `push` and `pop` touch only the end and are **O(1)** — for `push`, O(1) *amortised*, meaning that occasionally the engine must allocate a larger block and copy the elements, but averaged over many pushes the cost per push is constant.

| Method | Where | Cost | Returns |
|---|---|---|---|
| `push` | End | O(1) amortised | New length |
| `pop` | End | O(1) | Removed element or `undefined` |
| `unshift` | Front | O(n) | New length |
| `shift` | Front | O(n) | Removed element or `undefined` |

Engines optimise some cases — V8 can sometimes remove the first element of a moderately sized array without moving the rest — but you should not rely on it. For a queue of a few hundred items, `shift` is fine. For a queue that processes hundreds of thousands of items, such as a breadth-first search over a large graph, repeated `shift` calls can dominate the running time. The usual fixes are to keep a "head" index that advances instead of removing elements, or to use a purpose-built queue.

```javascript title="queue-with-head-index.js"
const queue = ['a', 'b', 'c'];
let head = 0;                    // index of the next item to process

while (head < queue.length) {
  const item = queue[head++];    // O(1): nothing moves
  if (item === 'a') queue.push('d');
  console.log(item);
}
```

```output
a
b
c
d
```

### Non-mutating equivalents

When the array must not change — state, props, a function argument — build a new array instead:

| Mutating | Non-mutating equivalent |
|---|---|
| `arr.push(x)` | `[...arr, x]` or `arr.concat(x)` |
| `arr.unshift(x)` | `[x, ...arr]` |
| `arr.pop()` | `arr.slice(0, -1)` (and `arr.at(-1)` for the element) |
| `arr.shift()` | `arr.slice(1)` (and `arr[0]` for the element) |

Each equivalent copies the array, which is O(n). That is the price of leaving the original intact.

## slice vs splice {#b1-slice-splice}

`slice` and `splice` have nearly the same name and opposite characters. **`slice(start, end)`** copies a range of elements into a new array and never changes the original. **`splice(start, deleteCount, ...items)`** edits the original in place — removing elements, inserting elements, or both — and returns the elements it removed. One memory aid: `slice` takes a slice of a cake you can still serve whole in the photograph; `splice` is the surgeon's word for cutting something out and joining something in.

```javascript title="slice-vs-splice.js"
const a = [0, 1, 2, 3, 4];
console.log(a.slice(1, 3), a);

const b = [0, 1, 2, 3, 4];
console.log(b.splice(1, 3), b);
```

```output
[ 1, 2 ] [ 0, 1, 2, 3, 4 ]
[ 1, 2, 3 ] [ 0, 4 ]
```

The same arguments `(1, 3)` mean different things. For `slice` they are a start index and an **end index, excluded**: indexes 1 and 2. For `splice` they are a start index and a **count**: three elements beginning at index 1. Mixing these up is the most common error with the pair.

### `slice(start, end)`

`slice` selects the half-open range from `start` up to, but not including, `end` — the same convention as string `slice` ([[b1-string-extract]]). Both arguments are optional, and negative values count from the end of the array.

```javascript title="slice-edges.js"
const letters = ['a', 'b', 'c', 'd', 'e'];

console.log(letters.slice(2));        // from index 2 to the end
console.log(letters.slice(-2));       // the last two
console.log(letters.slice(1, -1));    // drop the first and the last
console.log(letters.slice(0, 99));    // an end past the length is clamped
console.log(letters.slice(3, 1));     // start after end: empty
console.log(letters.slice() === letters, letters.slice());
```

```output
[ 'c', 'd', 'e' ]
[ 'd', 'e' ]
[ 'b', 'c', 'd' ]
[ 'a', 'b', 'c', 'd', 'e' ]
[]
false [ 'a', 'b', 'c', 'd', 'e' ]
```

A negative argument `-n` is treated as `length - n`, so `slice(-2)` starts two from the end. Out-of-range values are clamped to the array's bounds and never throw. If `start` is at or after `end`, the result is an empty array — unlike string `substring`, `slice` never swaps its arguments. With no arguments, `slice()` copies the whole array, which was the standard way to copy an array before spread syntax.

The copy is **shallow**: the new array holds the same element values, so objects inside are shared between the original and the copy.

```javascript title="slice-is-shallow.js"
const users = [{ name: 'Ada' }, { name: 'Lin' }];
const firstOnly = users.slice(0, 1);
firstOnly[0].name = 'ADA';
console.log(users[0].name);
```

```output
ADA
```

### `splice(start, deleteCount, ...items)`

`splice` does three jobs depending on its arguments. It goes to index `start`, removes `deleteCount` elements, inserts any further arguments at that position, and returns an array of what it removed.

```javascript title="splice-jobs.js"
const remove = ['a', 'b', 'c', 'd'];
console.log(remove.splice(1, 2), remove);            // remove two

const insert = ['a', 'd'];
console.log(insert.splice(1, 0, 'b', 'c'), insert);  // insert, remove none

const replace = ['a', 'x', 'y', 'd'];
console.log(replace.splice(1, 2, 'b'), replace);     // remove two, insert one
```

```output
[ 'b', 'c' ] [ 'a', 'd' ]
[] [ 'a', 'b', 'c', 'd' ]
[ 'x', 'y' ] [ 'a', 'b', 'd' ]
```

To **insert without removing**, pass a `deleteCount` of `0`; the new items go *before* the element currently at `start`. The number inserted does not have to equal the number removed — the rest of the array shifts up or down to fit. `splice` always returns an array, even when it removed one element (`[x]`) or none (`[]`).

The edge cases are where the bugs are:

```javascript title="splice-edges.js"
const a = [0, 1, 2, 3, 4];
console.log(a.splice(2), a);          // deleteCount omitted: everything from 2

const b = [0, 1, 2, 3, 4];
console.log(b.splice(-2, 1), b);      // negative start counts from the end

const c = [0, 1, 2];
console.log(c.splice(1, 99), c);      // deleteCount is clamped

const d = [0, 1, 2];
console.log(d.splice(), d);           // no arguments: nothing happens

const e = [0, 1, 2];
const index = e.indexOf(7);           // -1: not found
e.splice(index, 1);
console.log(e);                       // removed the LAST element
```

```output
[ 2, 3, 4 ] [ 0, 1 ]
[ 3 ] [ 0, 1, 2, 4 ]
[ 1, 2 ] [ 0 ]
[] [ 0, 1, 2 ]
[ 0, 1 ]
```

**Omitting `deleteCount` removes everything from `start` to the end** — `splice(2)` does not mean "remove one element at index 2". And the last case is a classic: the idiom `arr.splice(arr.indexOf(x), 1)` removes the *last* element when `x` is not present, because `indexOf` returns `-1` and a `start` of `-1` means "one from the end". Always check that the index is not `-1` first.

### Removing while looping

Because `splice` shifts later elements down, removing inside a forward index loop skips the element that slides into the removed position:

```javascript title="splice-in-loop.js"
const forward = [1, 2, 2, 3];
for (let i = 0; i < forward.length; i++) {
  if (forward[i] === 2) forward.splice(i, 1);
}
console.log(forward);            // one 2 survived

const backward = [1, 2, 2, 3];
for (let i = backward.length - 1; i >= 0; i--) {
  if (backward[i] === 2) backward.splice(i, 1);
}
console.log(backward);

console.log([1, 2, 2, 3].filter((n) => n !== 2));
```

```output
[ 1, 2, 3 ]
[ 1, 3 ]
[ 1, 3 ]
```

In the forward loop, removing index 1 moves the second `2` into index 1, and then `i++` steps past it. Looping backwards works, because removing an element only moves elements the loop has already examined. The clearest solution is `filter`, which builds a new array of the elements to keep and mutates nothing.

### `toSpliced` and `with`: the copying versions

ES2023 added **`toSpliced`**, which takes the same arguments as `splice` but returns a new array with the edit applied, and **`with(index, value)`**, which returns a new array with one element replaced. They are available in Node.js 20 and later and in all current browsers.

```javascript title="to-spliced-with.js"
const days = ['Mon', 'Tue', 'Thu'];

const fixed = days.toSpliced(2, 0, 'Wed');   // insert, original untouched
console.log(fixed, days);

const renamed = days.with(0, 'Monday');
console.log(renamed, days.with(-1, 'Thursday'));

try {
  days.with(5, 'Sat');
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
```

```output
[ 'Mon', 'Tue', 'Wed', 'Thu' ] [ 'Mon', 'Tue', 'Thu' ]
[ 'Monday', 'Tue', 'Thu' ] [ 'Mon', 'Tue', 'Thursday' ]
RangeError: Invalid index : 5
```

Note what `toSpliced` returns: the **new array**, not the removed elements. That is the opposite of `splice`, so the two are not drop-in replacements when the code uses the return value. `with` accepts negative indexes like `at`, and — unusually for arrays — throws a `RangeError` for an index outside the array instead of silently extending it.

### Choosing between them

| Goal | In place | Without mutation |
|---|---|---|
| Copy a range | — | `arr.slice(start, end)` |
| Remove at index `i` | `arr.splice(i, 1)` | `arr.toSpliced(i, 1)` or `arr.filter((_, j) => j !== i)` |
| Insert at index `i` | `arr.splice(i, 0, x)` | `arr.toSpliced(i, 0, x)` or `[...arr.slice(0, i), x, ...arr.slice(i)]` |
| Replace at index `i` | `arr[i] = x` | `arr.with(i, x)` or `arr.map((v, j) => (j === i ? x : v))` |
| Keep the first `n` | `arr.length = n` | `arr.slice(0, n)` |

```quiz
Q: What does this log? `const a = [1, 2, 3, 4, 5]; console.log(a.splice(1, 2), a.slice(1, 2));`
- [ ] `[2, 3]` and `[2, 3]`
- [x] `[2, 3]` and `[4]`
- [ ] `[2]` and `[2]`
- [ ] `[2, 3]` and `[2]`
> `splice(1, 2)` removes two elements starting at index 1 and returns `[2, 3]`, leaving `a` as `[1, 4, 5]`. The arguments are evaluated left to right, so `slice(1, 2)` then runs on the mutated array and copies index 1 only: `[4]`. The second argument is a count for `splice` and an exclusive end index for `slice`.

Q: `const list = ['a', 'b', 'c']; list.splice(list.indexOf('z'), 1);` — what is `list` afterwards?
- [ ] `['a', 'b', 'c']`, because `'z'` was not found
- [ ] It throws a `RangeError`
- [x] `['a', 'b']`, because `indexOf` returned `-1` and `splice(-1, 1)` removes the last element
- [ ] `['b', 'c']`
> A negative `start` counts from the end, so `-1` targets the last element. Nothing warns you that the search failed. Guard the call with `if (index !== -1)`, or use `filter`.
```

## sort, reverse, fill and copyWithin

The remaining mutating methods rearrange or overwrite elements without changing `length`, and all four return the array they were called on.

```javascript title="other-mutators.js"
const n = [1, 2, 3, 4, 5];

console.log(n.reverse(), n);
console.log(n.fill(0, 1, 3));          // overwrite indexes 1 and 2
console.log(n.copyWithin(0, 3));       // copy indexes 3.. over index 0..
console.log(n.toReversed(), n);
```

```output
[ 5, 4, 3, 2, 1 ] [ 5, 4, 3, 2, 1 ]
[ 5, 0, 0, 2, 1 ]
[ 2, 1, 0, 2, 1 ]
[ 1, 2, 0, 1, 2 ] [ 2, 1, 0, 2, 1 ]
```

`reverse` reverses in place. `fill(value, start, end)` overwrites a half-open range with one value (the whole array if the range is omitted). `copyWithin(target, start, end)` copies a range of the array over another part of itself; it is rare outside low-level buffer code. `sort` is important enough to have its own lesson, [[b1-array-sort]].

Because `sort` and `reverse` return the same array, code such as `const sorted = items.sort()` reads as though it made a sorted copy. It did not — `sorted` and `items` are one array. Before ES2023 the fix was to copy first, `[...items].sort()` or `items.slice().sort()`; now `items.toSorted()` and `items.toReversed()` say it directly.

## Updating without mutation

Code that manages shared state needs each kind of change — add, remove, replace, insert, reorder — in a form that produces a new array. Here is the full set on one example:

```javascript title="immutable-updates.js"
const todos = [
  { id: 1, text: 'Write tests', done: false },
  { id: 2, text: 'Fix bug', done: false },
];

const added = [...todos, { id: 3, text: 'Deploy', done: false }];
const removed = todos.filter((t) => t.id !== 1);
const toggled = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t));
const inserted = todos.toSpliced(1, 0, { id: 9, text: 'Review', done: false });
const sorted = todos.toSorted((a, b) => a.text.localeCompare(b.text));

console.log(added.length, removed.length, inserted.map((t) => t.id));
console.log(toggled[1].done, todos[1].done);
console.log(sorted.map((t) => t.text), todos.map((t) => t.text));
console.log(toggled[0] === todos[0], toggled[1] === todos[1]);
```

```output
3 1 [ 1, 9, 2 ]
true false
[ 'Fix bug', 'Write tests' ] [ 'Write tests', 'Fix bug' ]
true false
```

Every line leaves `todos` exactly as it was. `[...todos, item]` spreads the old elements into a new array and appends one. `filter` keeps the elements that pass a test, which is the idiomatic "remove by id". The `map` line is the idiomatic "update one item": it returns a *new object* for the matching todo — `{ ...t, done: true }` copies the todo's properties and overrides one — and returns the *same object* for every other todo.

The last line shows why that matters. `toggled[0] === todos[0]` is `true`: the unchanged todo is shared between the old and new arrays, which is safe because nobody mutates it. `toggled[1] === todos[1]` is `false`: the changed todo is a new object. If the `map` had instead written `t.done = true; return t`, the new array would contain the same mutated object as the old one — a new array wrapped around a mutation. **A non-mutating array method does not protect the objects inside the array.**

## How it works internally

Mutating methods are specified as a series of ordinary property operations on the array object: read `length`, read and write index properties, delete index properties, write `length`. `push` writes each argument at index `length`, `length + 1`, … and then sets `length`. `shift` reads index `0`, then loops from `1` to `length - 1` moving each element down one index (deleting the destination if the source is a hole), deletes the last index, and decrements `length`. `splice` is the same idea generalised: it moves the tail of the array up or down by the difference between the number of inserted and removed elements. Because the object's identity never changes, every reference observes the result.

The copying methods are specified as "create a new array, then write into it". `toSorted`, `toReversed`, `toSpliced` and `with` always create a plain `Array` and read every index from `0` to `length - 1`, so holes in the source become `undefined` in the result. The older `slice`, `concat`, `map` and `filter` preserve or skip holes instead ([[b1-sparse-arrays]]), and create their result through a mechanism that lets subclasses of `Array` return instances of the subclass.

All of these methods are **generic**: they only need a `this` value with a `length` and index properties. `Array.prototype.push.call(obj, 'x')` works on a plain object, adding a property at `obj.length` and updating `length`. This is how older code operated on array-likes such as `arguments`.

On memory: V8 stores elements in a backing store with spare capacity. When a `push` exceeds the capacity, V8 allocates a larger store (growing by roughly half again plus a constant) and copies the elements, which is why `push` is constant time only on average. These growth details are internal to V8 and can change.

## Worked example: a playlist reducer

A music player keeps a playlist in application state. Every change goes through one function that takes the current playlist and an action and returns the next playlist — the **reducer** pattern used by React's `useReducer` and by Redux. The rule for a reducer is that it must not mutate the state it receives.

```javascript title="playlist-reducer.js"
function playlistReducer(tracks, action) {
  switch (action.type) {
    case 'added':
      return [...tracks, action.track];
    case 'removed':
      return tracks.filter((t) => t.id !== action.id);
    case 'renamed':
      return tracks.map((t) =>
        t.id === action.id ? { ...t, title: action.title } : t,
      );
    case 'moved': {
      const from = tracks.findIndex((t) => t.id === action.id);
      if (from === -1) return tracks;              // unknown id: no change
      return tracks
        .toSpliced(from, 1)                        // take it out
        .toSpliced(action.to, 0, tracks[from]);    // put it back elsewhere
    }
    case 'sorted':
      return tracks.toSorted((a, b) => a.title.localeCompare(b.title));
    default:
      return tracks;
  }
}

const v1 = Object.freeze([
  { id: 1, title: 'Blue' },
  { id: 2, title: 'Amber' },
]);
const v2 = playlistReducer(v1, { type: 'added', track: { id: 3, title: 'Coral' } });
const v3 = playlistReducer(v2, { type: 'moved', id: 3, to: 0 });
const v4 = playlistReducer(v3, { type: 'renamed', id: 2, title: 'Azure' });
const v5 = playlistReducer(v4, { type: 'sorted' });
const v6 = playlistReducer(v5, { type: 'moved', id: 99, to: 0 });

const titles = (list) => list.map((t) => t.title).join(', ');
console.log(titles(v1));
console.log(titles(v3));
console.log(titles(v5));
console.log(v1 === v2, v5 === v6);
```

```output
Blue, Amber
Coral, Blue, Amber
Azure, Blue, Coral
false true
```

`v1` is frozen with `Object.freeze`, so any accidental `push` or `sort` on it would throw (this file runs in strict mode) — a cheap way to prove the reducer never mutates. Each case returns a new array built with a non-mutating method. The `'moved'` case chains two `toSpliced` calls: the first returns a copy without the track, the second inserts the track at the new position; `tracks[from]` still reads from the untouched original.

Two details are deliberate. When the action changes nothing — an unknown id, an unknown action type — the reducer returns the *same* array, so `v5 === v6` is `true` and a framework comparing references knows it can skip work. And when something does change, the reference changes (`v1 === v2` is `false`), which is the signal to re-render.

## In real systems

**React state.** React compares the previous and next state with `Object.is`. If you `push` into a state array and call the setter with the same array, React sees the same reference and may skip the re-render; even when a re-render happens for another reason, memoised children that compare props by reference will not update. React's documentation therefore lists `push`, `unshift`, `pop`, `shift`, `splice`, `reverse` and `sort` as methods to avoid on state, and `concat`, spread, `filter`, `slice`, `map` and the `to…` methods as their replacements. See [[b4-update-state-arrays]] and [[b4-direct-state-mutation]].

**Redux and reducers.** Redux relies on the same reference comparison for its change detection and its time-travel debugging. Redux Toolkit uses the Immer library so that reducer code can be *written* with `push` and `splice` on a draft object while Immer produces a new immutable array behind the scenes.

**Function arguments.** Library functions conventionally do not mutate their inputs. When one does — `Array.prototype.sort` being the famous case — its documentation says so, and callers copy first.

**Hot loops and local arrays.** Mutation is not wrong. Building a result with `push` inside a function, using an array as a stack in a parser, or sorting an array you just created are all normal and efficient. The array is local, so nobody else can observe the change.

**Performance-sensitive code.** Game loops, data-processing pipelines and typed-array code mutate in place to avoid allocating a new array on every frame or every record, which would create work for the garbage collector ([[b1-garbage-collection]]).

## Trade-offs and alternatives

| | Mutating in place | Returning a new array |
|---|---|---|
| Cost per change | Often O(1) (`push`, index write) | O(n) copy every time |
| Memory | No new allocation | A new array per change; old one garbage-collected |
| Change detection | Needs deep comparison or manual signalling | A reference comparison is enough |
| Safety with shared references | Others see the change unexpectedly | Others are unaffected |
| History and undo | Previous versions are lost | Keep old arrays as snapshots |

The rule of thumb: **mutate arrays you own; copy arrays you were given.** An array created inside the current function and not yet shared can be mutated freely. An array that arrived as an argument, lives in component state or in a store, or is exported from a module should be treated as read-only.

Copying costs O(n) per update. For lists of hundreds or thousands of items updated on user actions, that is negligible. For very large collections updated at high frequency, the alternatives are persistent data structures (libraries that share structure between versions so updates are cheaper than a full copy) or confining mutation behind a clear boundary.

`Object.freeze(arr)` makes accidental mutation throw in strict mode, and TypeScript's `readonly T[]` type removes the mutating methods at compile time ([[b2-readonly-arrays]]). Both are tools for enforcing the rule rather than remembering it.

## Common mistakes

> [!MISTAKE] Treating `sort()` or `reverse()` as if they returned a copy
> `const sorted = items.sort()` mutates `items`, and `sorted === items`. In React this mutates state and then sets state to the same reference. Use `items.toSorted()`, or `[...items].sort()` where ES2023 is not available.

**Assigning the result of `push`.** `arr = arr.push(x)` replaces the array with its new length. Call `arr.push(x)` on its own line, or write `arr = [...arr, x]`.

**Confusing the second argument of `slice` and `splice`.** `slice(1, 3)` ends before index 3; `splice(1, 3)` removes three elements.

**Calling `splice(i)` to remove one element.** With `deleteCount` omitted it removes everything from `i` onwards. Write `splice(i, 1)`.

**Splicing with an unchecked `indexOf`.** `splice(-1, 1)` removes the last element. Check for `-1` first.

**Removing elements in a forward loop.** Each removal shifts the remaining elements and the loop skips one. Loop backwards or use `filter`.

**Believing a new array means new elements.** `slice`, spread, `filter` and `toSorted` copy references. Mutating an object inside the copy mutates it in the original too. Create a new object for the element you change.

**Using `shift` as a queue for huge workloads.** Each call may move every remaining element. Use a head index or a dedicated queue.

## Interview perspective

This topic appears as "what does this print?" questions built on return values, as "what is the difference between `slice` and `splice`?", and inside React questions about why a component did not re-render.

> [!INTERVIEW] What a strong answer sounds like
> "`slice` is non-mutating: it returns a shallow copy of the half-open range from start to end. `splice` mutates: it removes `deleteCount` elements at start, optionally inserts new ones, and returns the removed elements. If I need the `splice` behaviour without mutation I use `toSpliced` from ES2023, or build the array from two slices and a spread."

Questions you should be able to answer:

- **Which array methods mutate?** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`, plus index and `length` assignment.
- **What does `push` return?** The new length, not the array.
- **Why is mutating state a bug in React?** State changes are detected by reference; a mutated array is the same reference, so React and memoised children cannot tell that it changed, and earlier snapshots of state are corrupted.
- **How do you remove an item from an array immutably?** `filter` by id, or `toSpliced(index, 1)`.
- **How do you insert at an index immutably?** `toSpliced(i, 0, x)` or `[...arr.slice(0, i), x, ...arr.slice(i)]`.
- **What is the time complexity of `shift` compared with `pop`?** O(n) against O(1), because removing the first element changes every other element's index.
- **Is `const` enough to prevent mutation?** No. `const` prevents reassigning the variable; the array can still be mutated. `Object.freeze` prevents (shallow) mutation.

A follow-up to expect: *"`toSorted` isn't available in our target browsers — what do you write?"* Copy, then sort the copy: `[...arr].sort(compare)` or `arr.slice().sort(compare)`.

## Practice

1. For each of these, say whether `a` changes and what the expression returns: `a.concat(4)`, `a.push(4)`, `a.reverse()`, `a.slice(-1)`, `a.splice(-1)`, `a.with(0, 9)`, `a.fill(0)`.
2. Write `moveItem(arr, from, to)` that returns a new array with the element at `from` moved to `to`, without mutating `arr`. Write it once with `toSpliced` and once with only `slice` and spread.
3. Write `removeAll(arr, value)` twice: one version that mutates `arr` in place using `splice` in a backward loop, and one that returns a new array. Test both on `[1, 2, 2, 3, 2]`.
4. The function `function addTag(tags, tag) { tags.push(tag); return tags; }` is used in a React component and the UI does not update. Explain why and fix it.
5. Implement a `Queue` class with `enqueue`, `dequeue` and `size` whose `dequeue` is O(1), using a head index. Decide when to discard the already-consumed prefix so memory does not grow without bound.

## Quick revision {#quick-revision}

- **Mutating:** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`, `arr[i] = x`, `arr.length = n`.
- **Non-mutating:** `slice`, `concat`, `map`, `filter`, `flat`, `flatMap`, `toSorted`, `toReversed`, `toSpliced`, `with` (the last four are ES2023, Node.js 20+).
- Returns: `push`/`unshift` → new length; `pop`/`shift` → removed element (`undefined` if empty); `splice` → array of removed elements; `sort`/`reverse`/`fill` → the same array.
- `push`/`pop` work at the end, O(1); `shift`/`unshift` work at the front, O(n).
- `unshift(1, 2)` inserts as a block in the written order; `push(...other)` appends another array's elements.
- `slice(start, end)`: copy of a half-open range; negatives count from the end; `slice()` is a shallow copy; never throws.
- `splice(start, deleteCount, ...items)`: in-place remove/insert/replace; returns removed elements; omitted `deleteCount` removes to the end; `splice(-1, 1)` removes the last element.
- `toSpliced` returns the new array (not the removed items); `with(i, x)` replaces one element and throws `RangeError` if `i` is out of range.
- Immutable updates: add `[...arr, x]`; remove `arr.filter(...)`; replace `arr.map(...)` or `arr.with(i, x)`; insert `arr.toSpliced(i, 0, x)`; sort `arr.toSorted(fn)`.
- Copies are shallow: element objects are shared. Create a new object for the element you change.
- Mutate arrays you own; copy arrays you were given.

## Key takeaways {#key-takeaways}

- Mutating methods change the array every reference points at; non-mutating methods return a new array and leave the original alone.
- Method names do not reveal the family — `slice` copies, `splice` mutates, and `sort` and `reverse` mutate while returning the same array.
- Check return values: `push` returns a length, `splice` returns what it removed, `toSpliced` returns the new array.
- End operations (`push`, `pop`) are cheap; front operations (`shift`, `unshift`) move every element.
- Shared data such as React state must be updated by building new arrays, because change detection compares references.
- A new array is not a deep copy: update a contained object by replacing it with a new object, not by editing it.
