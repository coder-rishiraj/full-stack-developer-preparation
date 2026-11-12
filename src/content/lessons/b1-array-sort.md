---
summary: "`sort` reorders an array in place, and by default it compares elements as strings — which is why `[10, 2, 1].sort()` gives `[1, 10, 2]`. You will learn how to write comparator functions for numbers, strings, dates and objects, how to sort by several keys, what stability guarantees, and when to use the copying `toSorted` instead."
difficulty: beginner
minutes: 45
objectives:
  - Explain why the default `sort` puts `10` before `2`, and fix it with a comparator
  - Write comparators that return negative, zero or positive for numbers, strings, dates and object fields, ascending and descending
  - Sort by several keys, and explain what a stable sort guarantees
  - Choose between `sort`, which mutates, and `toSorted`, which copies
  - Sort human-readable text correctly with `localeCompare` and `Intl.Collator`
  - Recognise broken comparators — returning a boolean, inconsistent results, subtracting non-numbers
---

## Introduction

Sorting is one of the most common things a program does with a list: products by price, messages by date, names alphabetically, search results by relevance. JavaScript arrays have a built-in method for it, **`sort`**, and using it looks trivial — until the first time it is applied to numbers:

```javascript title="surprise.js"
console.log([10, 2, 1].sort());
```

```output
[ 1, 10, 2 ]
```

That result is not a bug in the engine. It is the documented default: with no arguments, `sort` converts every element to a string and orders the strings. As text, `'10'` comes before `'2'` for the same reason that "ab" comes before "b" in a dictionary.

To sort by anything other than that string order, you give `sort` a **comparator**: a function that takes two elements and says which should come first. Nearly everything worth knowing about sorting in JavaScript is about writing that function correctly. This lesson covers the default order and why it exists, the comparator contract, the standard comparators for each kind of data, sorting objects by one or several fields, stability, the fact that `sort` mutates the array and the ES2023 method `toSorted` that does not, and sorting text the way a person would expect.

## Before you start

- **Array basics and mutation** — `sort` changes the array it is called on. See [[b1-array-basics]] and [[b1-array-mutation]].
- **Functions as arguments** — the comparator is a callback that `sort` calls many times. See [[b1-callbacks-sync]] and [[b1-arrow-functions]].
- **Strings as sequences of code units** — helpful for understanding the default order. See [[b1-unicode-strings]].
- **References** — a sorted array of objects contains the same objects, reordered. See [[b1-primitive-vs-reference]].

All outputs in this lesson are from Node.js 22.

## The intuition

Imagine handing a shuffled stack of index cards to an assistant who is good at sorting but knows nothing about what is written on the cards. The assistant's method is to hold up two cards at a time and ask you one question: "which of these goes first?" You answer "the left one", "the right one" or "it does not matter". After enough questions, the stack is in order.

The assistant is `sort`. Your answers are the comparator. The assistant decides which pairs to ask about and how many questions are needed; you only decide, for any pair, the order. That split is why one sorting method can order numbers, names, dates or any objects — the knowledge of what "order" means lives entirely in your function.

Two consequences follow from the picture. If you give no instructions, the assistant falls back on a fixed rule: read every card as text and use dictionary order. And if your answers contradict each other — you say A before B, B before C, and C before A — the assistant cannot produce a sensible order, and what you get back is unpredictable.

## The default order

Called with no comparator, `sort` converts each element to a string and compares the strings by their UTF-16 code unit values — the numbers that represent each character internally.

```javascript title="default-order.js"
console.log([10, 2, 1, 33, 4].sort());
console.log(['pear', 'apple', 'fig'].sort());
console.log(['banana', 'apple', 'Cherry'].sort());
console.log(['z', 'ä', 'a'].sort());
console.log([true, false, null].sort());
```

```output
[ 1, 10, 2, 33, 4 ]
[ 'apple', 'fig', 'pear' ]
[ 'Cherry', 'apple', 'banana' ]
[ 'a', 'z', 'ä' ]
[ false, null, true ]
```

Line by line:

- **Numbers** are compared as the strings `'10'`, `'2'`, `'1'`, `'33'`, `'4'`. Strings are compared character by character from the left, so `'10'` is before `'2'` because `'1'` is before `'2'`, and `'33'` is before `'4'`.
- **Lowercase words** come out alphabetically, because the code units for `a` to `z` are in alphabetical order. This case is the one the default was designed for.
- **Mixed case** does not: every uppercase letter has a smaller code unit than every lowercase letter (`'C'` is 67, `'a'` is 97), so `'Cherry'` sorts before `'apple'`.
- **Accented letters** have code units above the basic alphabet (`'ä'` is 228), so `'ä'` sorts after `'z'`.
- **Other values** are compared by their string forms: `'false'`, `'null'`, `'true'`.

The default is therefore correct for one case only: strings that are all plain ASCII in a single letter case, such as identifiers or keys. For everything else, pass a comparator.

> [!WARNING] The default sort is a string sort
> `sort()` with no arguments never compares numbers numerically, whatever the array contains. For numbers, always write `sort((a, b) => a - b)`.

## The comparator

A comparator is a function of two parameters, conventionally `a` and `b`, that returns a number. `sort` looks only at the **sign** of that number:

| Comparator returns | Meaning | Result |
|---|---|---|
| A negative number | `a` is less than `b` | `a` is placed before `b` |
| A positive number | `a` is greater than `b` | `a` is placed after `b` |
| `0` | They are equal for sorting purposes | Their existing relative order is kept |

For numbers, subtraction produces exactly this: `a - b` is negative when `a` is smaller, positive when `a` is larger, and zero when they are equal.

```javascript title="numeric.js"
const nums = [10, 2, 1, 33, 4];

nums.sort((a, b) => a - b);
console.log(nums);

nums.sort((a, b) => b - a);
console.log(nums);
```

```output
[ 1, 2, 4, 10, 33 ]
[ 33, 10, 4, 2, 1 ]
```

`a - b` sorts ascending. Swapping the operands, `b - a`, reverses the sign of every answer and so sorts descending. A way to remember which is which: the comparator answers "how much bigger is `a` than `b`?", and ascending order puts smaller things first.

To see that `sort` really is asking about pairs, log the calls:

```javascript title="comparator-calls.js"
const result = [3, 1, 2].sort((a, b) => {
  console.log(`compare ${a} with ${b} -> ${a - b}`);
  return a - b;
});
console.log(result);
```

```output
compare 1 with 3 -> -2
compare 2 with 1 -> 1
compare 2 with 3 -> -1
compare 2 with 1 -> 1
[ 1, 2, 3 ]
```

Which pairs are compared, in what order, and which element arrives as `a` are decided by the engine's sorting algorithm and are not specified by the language. The output above is from Node.js 22; other engines, or other versions of Node.js, may print different lines here. A comparator must not depend on any of it; it must give a consistent answer for any pair in either order.

### Comparing things that are not numbers

Subtraction only works for numbers (and for things that convert to numbers, such as `Date` objects). For strings, `'b' - 'a'` is `NaN`. The general-purpose comparator uses `<` and `>`:

```javascript title="generic-compare.js"
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

console.log(['pear', 'apple', 'fig'].sort(compare));
console.log([10, 2, 1].sort(compare));
console.log([30n, 4n, 100n].sort(compare));
```

```output
[ 'apple', 'fig', 'pear' ]
[ 1, 2, 10 ]
[ 4n, 30n, 100n ]
```

The three-way form — `-1`, `1`, or `0` — works for strings, numbers and BigInts alike, because `<` and `>` are defined for all of them. BigInts need it: `a - b` on two BigInts returns a BigInt, and `sort` requires a number, so the subtraction comparator throws a `TypeError` ([[b1-bigint]]).

For strings, `<` and `>` use the same code-unit order as the default sort, so this comparator still puts `'Cherry'` before `'apple'`. Sorting text for people to read needs `localeCompare`, covered below.

### The boolean comparator bug

A very common mistake is to return the result of a comparison directly:

```javascript title="boolean-comparator.js"
console.log([3, 1, 2].sort((a, b) => a > b));
console.log([3, 1, 2].sort((a, b) => a - b));
```

```output
[ 3, 1, 2 ]
[ 1, 2, 3 ]
```

`a > b` is `true` or `false`, which convert to `1` or `0`. The comparator can therefore say "after" or "equal" but never "before" — it never returns a negative number. In Node.js 22 the array comes back unsorted. Older engines happened to produce a sorted result for small arrays with this comparator, which is why the bug appears in old code and tutorials. Return a number with the correct sign.

## `sort` mutates; `toSorted` copies

`sort` rearranges the array **in place** and returns a reference to that same array. It does not create a new one.

```javascript title="sort-mutates.js"
const scores = [70, 95, 82];
const sorted = scores.sort((a, b) => b - a);

console.log(sorted);
console.log(scores);
console.log(sorted === scores);
```

```output
[ 95, 82, 70 ]
[ 95, 82, 70 ]
true
```

Because `sort` returns the array, `const sorted = scores.sort(...)` looks as if it produced a new sorted array and left `scores` alone. It did not: `sorted` and `scores` are the same array, and the original order is gone. If another part of the program holds a reference to that array — a function's caller, a piece of React state — its data has just been reordered without its knowledge ([[b1-call-by-sharing]]).

ES2023 added **`toSorted`**, which takes the same comparator, leaves the original untouched and returns a new sorted array. It is available in Node.js 20 and later and in all current browsers. In older environments, copy first and then sort the copy.

```javascript title="to-sorted.js"
const scores = [70, 95, 82];

const ranked = scores.toSorted((a, b) => b - a);
console.log(ranked);
console.log(scores);

const alsoRanked = [...scores].sort((a, b) => b - a);
console.log(alsoRanked, scores);
```

```output
[ 95, 82, 70 ]
[ 70, 95, 82 ]
[ 95, 82, 70 ] [ 70, 95, 82 ]
```

Use `toSorted` (or copy-then-sort) whenever you did not create the array yourself: function parameters, props, state, anything shared. Use `sort` when the array is local to your function and nobody else can see it. In both cases the copy is shallow — the new array holds the same element objects ([[b1-copying-arrays]]).

`toSorted` has the same default as `sort`: with no comparator it sorts as strings.

## Sorting objects

Real data is usually an array of objects sorted by one of their fields. The comparator receives two whole objects and compares the field:

```javascript title="sort-objects.js"
const people = [
  { name: 'Lin', age: 31, joined: new Date('2023-04-01') },
  { name: 'Ada', age: 36, joined: new Date('2021-09-15') },
  { name: 'Sam', age: 24, joined: new Date('2024-01-20') },
];

const byAge = people.toSorted((a, b) => a.age - b.age);
console.log(byAge.map((p) => p.name));

const byName = people.toSorted((a, b) => a.name.localeCompare(b.name));
console.log(byName.map((p) => p.name));

const newestFirst = people.toSorted((a, b) => b.joined - a.joined);
console.log(newestFirst.map((p) => p.name));
```

```output
[ 'Sam', 'Lin', 'Ada' ]
[ 'Ada', 'Lin', 'Sam' ]
[ 'Sam', 'Lin', 'Ada' ]
```

Numeric fields use subtraction. String fields use `localeCompare`, a string method that returns a negative number, zero or a positive number — exactly the comparator contract. `Date` objects can be subtracted because subtraction converts each to its timestamp in milliseconds; `b.joined - a.joined` puts the later date first.

If dates are stored as ISO 8601 strings in the same format and time zone, such as `'2024-01-20'`, they can be compared as strings, because that format is designed so that text order equals time order. Dates in other formats (`'20/01/2024'`) must be parsed first.

### Sorting by several keys

To sort by department and then by name within each department, compare the first key; only if it is a tie (the result is `0`) compare the second. The `||` operator expresses this compactly, because `0` is falsy and any other number is truthy ([[b1-short-circuit]]):

```javascript title="multi-key.js"
const staff = [
  { name: 'Lin', dept: 'Ops', age: 31 },
  { name: 'Ada', dept: 'Eng', age: 36 },
  { name: 'Sam', dept: 'Ops', age: 24 },
  { name: 'Bo', dept: 'Eng', age: 36 },
];

const ordered = staff.toSorted(
  (a, b) =>
    a.dept.localeCompare(b.dept) ||   // 1. department A-Z
    b.age - a.age ||                  // 2. oldest first
    a.name.localeCompare(b.name),     // 3. name A-Z
);

console.log(ordered.map((p) => `${p.dept} ${p.age} ${p.name}`));
```

```output
[ 'Eng 36 Ada', 'Eng 36 Bo', 'Ops 31 Lin', 'Ops 24 Sam' ]
```

For Ada and Bo, the department comparison returns `0`, so `||` moves on to age; that is `0` too, so the name decides. For Ada and Lin, the department comparison returns a negative number and the rest is never evaluated.

### Missing values

A comparator must handle every value that can appear. If a field can be `null` or `undefined`, decide where those go and say so explicitly — otherwise `null - 5` or `undefined.localeCompare(...)` will produce `NaN` or throw.

```javascript title="nulls-last.js"
const items = [{ price: 30 }, { price: null }, { price: 12 }, {}];

const sorted = items.toSorted((a, b) => {
  const aMissing = a.price == null;
  const bMissing = b.price == null;
  if (aMissing || bMissing) return aMissing - bMissing;   // missing values last
  return a.price - b.price;
});

console.log(sorted.map((i) => i.price));
```

```output
[ 12, 30, null, undefined ]
```

`aMissing - bMissing` subtracts two booleans, which convert to `1` and `0`: if only `a` is missing the result is `1` (after), if only `b` is missing it is `-1` (before), and if both are missing it is `0`.

## Stability

A sort is **stable** if elements that compare as equal keep the relative order they had before the sort. Since ES2019 the language requires `sort` to be stable, and every current engine complies.

```javascript title="stability.js"
const orders = [
  { id: 1, customer: 'Zed', total: 50 },
  { id: 2, customer: 'Amy', total: 20 },
  { id: 3, customer: 'Zed', total: 20 },
  { id: 4, customer: 'Amy', total: 50 },
];

const byTotal = orders.toSorted((a, b) => a.total - b.total);
console.log(byTotal.map((o) => o.id));

const byCustomer = byTotal.toSorted((a, b) => a.customer.localeCompare(b.customer));
console.log(byCustomer.map((o) => `${o.customer} ${o.total}`));
```

```output
[ 2, 3, 1, 4 ]
[ 'Amy 20', 'Amy 50', 'Zed 20', 'Zed 50' ]
```

In the first sort, orders 2 and 3 both have a total of 20; they stay in their original order (2 before 3), as do 1 and 4. The second sort shows why this matters. Sorting the already-sorted list by customer keeps each customer's orders in total order, because orders for the same customer compare as equal and are not rearranged. This is how a table lets a user click "Total" and then "Customer" and get a result sorted by customer, then by total. With an unstable sort, the second click would scramble the first.

Before ES2019, stability was not guaranteed. V8 (Chrome and Node.js) used an unstable algorithm for arrays longer than ten elements until version 7.0, released in 2018. If you support only current runtimes, you can rely on stability.

## Sorting text for people

Code-unit order is not alphabetical order for humans: uppercase sorts before lowercase, accented letters sort after `z`, and numbers inside strings are compared digit by digit. The language-aware tools are **`localeCompare`** and **`Intl.Collator`**, part of the internationalisation API built into browsers and Node.js.

```javascript title="locale-compare.js"
const words = ['banana', 'apple', 'Cherry', 'ähnlich', 'zebra'];

console.log(words.toSorted());
console.log(words.toSorted((a, b) => a.localeCompare(b, 'en')));

const files = ['file10.txt', 'file2.txt', 'File1.txt'];
console.log(files.toSorted());

const natural = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
console.log(files.toSorted(natural.compare));
```

```output
[ 'Cherry', 'apple', 'banana', 'zebra', 'ähnlich' ]
[ 'ähnlich', 'apple', 'banana', 'Cherry', 'zebra' ]
[ 'File1.txt', 'file10.txt', 'file2.txt' ]
[ 'File1.txt', 'file2.txt', 'file10.txt' ]
```

`a.localeCompare(b, 'en')` compares according to the rules of English: case differences are minor, and `ä` is ordered with `a`. The first argument after the string is a locale tag — `'en'`, `'de'`, `'sv'` — and it matters, because languages disagree. In German `ä` sorts with `a`; in Swedish it is a separate letter that comes after `z`:

```javascript title="locales-differ.js"
const letters = ['ä', 'z', 'a'];
console.log(letters.toSorted((x, y) => x.localeCompare(y, 'de')));
console.log(letters.toSorted((x, y) => x.localeCompare(y, 'sv')));
```

```output
[ 'a', 'ä', 'z' ]
[ 'a', 'z', 'ä' ]
```

If the locale argument is omitted, the runtime's default locale is used, which means the same code can sort differently on different machines. Pass the user's locale explicitly when the order is shown to them.

`Intl.Collator` creates a reusable comparison object. Its `compare` property is a function that can be passed directly to `sort`. Two options are used constantly:

- `numeric: true` compares runs of digits as numbers, giving the "natural" order `file2` before `file10`.
- `sensitivity: 'base'` treats letters that differ only by case or accent as equal, so `'a'`, `'A'` and `'á'` compare as `0`.

When sorting many strings, create one `Intl.Collator` and reuse it; calling `localeCompare` with a locale argument has to look up the locale's rules on each call and is noticeably slower on large arrays.

## `undefined`, holes and other edge cases

`sort` treats `undefined` specially: `undefined` elements are always moved to the end of the array, and the comparator is never called with them. Holes in a sparse array ([[b1-sparse-arrays]]) are moved after the `undefined` values and remain holes.

```javascript title="undefined-last.js"
const mixed = [3, undefined, 1, , 2];
mixed.sort((a, b) => b - a);
console.log(mixed);

console.log([3, null, 1].sort((a, b) => a - b));
console.log([3, NaN, 1].sort((a, b) => a - b));
```

```output
[ 3, 2, 1, undefined, <1 empty item> ]
[ null, 1, 3 ]
[ 3, NaN, 1 ]
```

Even with a descending comparator, `undefined` is last. `null` gets no such treatment: it is passed to the comparator, where `null - 1` converts `null` to `0`, so it sorts as zero. `NaN` is worse: any subtraction involving `NaN` gives `NaN`, which `sort` treats as `0` — "equal" — so `NaN` claims to be equal to everything while `3` and `1` are not equal to each other. That is an inconsistent comparator, and the result here is not sorted at all. Remove or handle `NaN` before sorting numeric data ([[b1-nan-infinity]]).

Three more cases:

- **Typed arrays** such as `Int32Array` sort numerically by default, unlike ordinary arrays ([[b1-arraybuffer]]).
- **`reverse()` is not a sort.** `arr.sort().reverse()` gives descending string order, not descending numeric order. Use a `b - a` comparator.
- **Shuffling with `sort(() => Math.random() - 0.5)`** is a well-known trick that does not produce a uniform shuffle, because the comparator is inconsistent. Use the Fisher–Yates algorithm: walk the array from the end, swapping each element with a randomly chosen element at or before it.

```quiz
Q: What does `[5, 25, 100, 1].sort()` return?
- [ ] `[1, 5, 25, 100]`
- [x] `[1, 100, 25, 5]`
- [ ] `[100, 25, 5, 1]`
- [ ] It throws, because no comparator was given
> With no comparator, elements are converted to strings and compared by code units. `'1'` < `'100'` < `'25'` < `'5'`, because comparison goes character by character from the left. Pass `(a, b) => a - b` for numeric order.

Q: Which comparator sorts `users` by `age` from oldest to youngest?
- [ ] `(a, b) => a.age - b.age`
- [x] `(a, b) => b.age - a.age`
- [ ] `(a, b) => a.age > b.age`
- [ ] `(a, b) => b.age < a.age`
> A positive result places `a` after `b`. `b.age - a.age` is positive when `b` is older, so the older one comes first: descending order. The first option is ascending, and the last two return booleans, which can never be negative.

Q: After `const top = scores.sort((a, b) => b - a).slice(0, 3);`, what is true of `scores`?
- [ ] It is unchanged, because the result was assigned to `top`
- [x] It has been sorted in descending order, because `sort` mutates the array it is called on
- [ ] It now has three elements
- [ ] It is empty
> `sort` reorders `scores` in place and returns the same array; `slice` then copies the first three elements without changing anything. To leave `scores` alone, use `scores.toSorted(...)` or `[...scores].sort(...)`.

Q: Records are sorted by `price`, then the result is sorted by `category`. Within each category, what order are the records in?
- [ ] Unpredictable
- [ ] Their original order from before both sorts
- [x] Ascending by price, because `sort` is stable and keeps equal elements in their existing order
- [ ] Descending by price
> Records in the same category compare as equal in the second sort, so a stable sort leaves them in the order they already had — price order from the first sort. Stability has been required since ES2019.
```

## How it works internally

The specification describes `sort` in terms of results, not a particular algorithm. It requires that the outcome be a correctly ordered permutation when the comparator is consistent, that the sort be stable, that `undefined` values go last and holes after them, and — when the comparator is *not* consistent — it says only that the order is implementation-defined. An engine may use any algorithm that meets those requirements.

**The default comparison.** Without a comparator, each pair is compared by converting both values to strings and comparing those strings code unit by code unit. Engines avoid repeating the conversion for every comparison, but the observable result is as if each comparison did it.

**The algorithm in V8.** Since V8 7.0 (Chrome 70, Node.js 11), `sort` uses **TimSort**, a stable algorithm that combines merge sort with insertion sort for short runs ([[a3-merge-sort]]). It looks for stretches of the array that are already in order and merges them, so it takes O(n log n) comparisons in the worst case and close to O(n) on data that is already sorted or nearly so — which real data often is. Before that version, V8 used insertion sort for arrays of up to ten elements and a quicksort variant for longer ones ([[a3-quick-sort]]); the quicksort was not stable, which is why old articles warn about instability. Firefox uses merge sort and Safari's engine also uses a stable merge-based sort. These are implementation details; rely only on what the specification guarantees.

**Cost.** Sorting n elements calls the comparator on the order of n × log₂ n times: about 10,000 calls for 1,000 elements and about 20 million for 1,000,000. The comparator's own cost is therefore multiplied heavily. If computing the sort key is expensive — parsing a date string, normalising text — compute each key once before sorting instead of inside the comparator:

```javascript title="precompute-keys.js"
const rows = [{ when: '2024-03-05' }, { when: '2023-11-20' }, { when: '2024-01-15' }];

const sorted = rows
  .map((row) => ({ row, key: Date.parse(row.when) }))   // decorate: one parse per row
  .sort((a, b) => a.key - b.key)                        // sort on the cheap key
  .map(({ row }) => row);                               // undecorate

console.log(sorted.map((r) => r.when));
```

```output
[ '2023-11-20', '2024-01-15', '2024-03-05' ]
```

Here `sort` is safe to use on the intermediate array, because `map` created it and nothing else refers to it. The pattern is sometimes called decorate–sort–undecorate.

**Memory.** `sort` works in place from the caller's point of view, but TimSort uses temporary storage of up to half the array's length for merging. `toSorted` additionally allocates the result array.

## Worked example: a sortable table

A product table lets the user click a column header to sort by it, and click again to reverse the direction. The table data comes from application state, so it must not be mutated. Some products have no rating; those should always appear last, in either direction.

```javascript title="sortable-table.js"
const products = [
  { name: 'Desk lamp', price: 35, rating: 4.5 },
  { name: 'chair', price: 120, rating: null },
  { name: 'Bookshelf', price: 80, rating: 4.5 },
  { name: 'Áriel mug', price: 12, rating: 3.9 },
];

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

function compareValues(a, b) {
  if (typeof a === 'string' && typeof b === 'string') return collator.compare(a, b);
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortRows(rows, column, direction = 'asc') {
  const sign = direction === 'asc' ? 1 : -1;
  return rows.toSorted((rowA, rowB) => {
    const a = rowA[column];
    const b = rowB[column];
    if (a == null || b == null) return (a == null) - (b == null);   // missing last, both directions
    return sign * compareValues(a, b) || collator.compare(rowA.name, rowB.name);
  });
}

const show = (rows) => console.log(rows.map((r) => r.name));

show(sortRows(products, 'name'));
show(sortRows(products, 'price', 'desc'));
show(sortRows(products, 'rating', 'desc'));
show(sortRows(products, 'rating', 'asc'));
show(products);
```

```output
[ 'Áriel mug', 'Bookshelf', 'chair', 'Desk lamp' ]
[ 'chair', 'Bookshelf', 'Desk lamp', 'Áriel mug' ]
[ 'Bookshelf', 'Desk lamp', 'Áriel mug', 'chair' ]
[ 'Áriel mug', 'Bookshelf', 'Desk lamp', 'chair' ]
[ 'Desk lamp', 'chair', 'Bookshelf', 'Áriel mug' ]
```

The design decisions, in order:

1. **`toSorted`**, so `products` is unchanged — the last line of output confirms it. A UI framework comparing the old and new arrays sees a new array and re-renders ([[b4-update-state-arrays]]).
2. **One collator, created once**, with `sensitivity: 'base'` so that `chair` is not sorted after every capitalised name and `Áriel` sorts under A.
3. **Direction as a sign.** Multiplying the comparison by `1` or `-1` reverses the order without a second comparator. This is more correct than sorting ascending and calling `reverse()`, which would also reverse the order of tied rows.
4. **Missing values handled before the direction is applied**, so `chair`, which has no rating, is last in both the ascending and the descending rating sort.
5. **A tie-breaker.** Bookshelf and Desk lamp both have a rating of 4.5. Stability would keep them in their input order, but an explicit tie-break on name makes the result independent of how the input happened to be ordered — the user sees the same order every time.

## In real systems

**UI lists and tables.** Sorting on the client is appropriate when all the rows are already in memory. In React, sort while rendering or in a memoised computation, with `toSorted` or a copy; calling `sort` directly on state or props mutates them and causes missed or inconsistent renders ([[b4-direct-state-mutation]]).

**Server-side sorting.** When the data is paginated, the client holds only one page, so sorting it locally gives the wrong answer. The sort belongs in the database query (`ORDER BY`), with the sort column and direction sent as request parameters.

**Search and ranking.** Results are sorted by a computed score, descending, with a deterministic tie-breaker such as an id, so that pages do not shuffle between requests.

**Preparing for other algorithms.** Sorting first makes many problems simpler: binary search needs sorted input ([[a3-binary-search]]), duplicates become adjacent, and intervals can be merged in one pass. Comparator design for those problems is covered in [[a3-comparator-sorting]].

**Deterministic output.** Build tools sort file lists and object keys so that output is identical between runs and machines. For that purpose, the locale-independent code-unit order is the right choice, because it never varies with the machine's language settings.

**Internationalised products.** Any list of names shown to users — contacts, countries, cities — should be sorted with a collator for the user's locale.

## Trade-offs and alternatives

| Approach | Strengths | Costs |
|---|---|---|
| `arr.sort(cmp)` | No extra array; available everywhere | Mutates; unsafe on shared data |
| `arr.toSorted(cmp)` | Leaves the original intact; chainable | Allocates a copy; ES2023 (Node.js 20+) |
| `[...arr].sort(cmp)` | Same safety; works in older runtimes | Slightly more to read; turns holes into `undefined` |
| Default `sort()` | Fine for same-case ASCII strings; locale-independent | Wrong for numbers, mixed case, accents |
| `localeCompare` / `Intl.Collator` | Correct for human text; natural numeric order | Slower than code-unit comparison; locale-dependent |
| Keep the data sorted as you insert | No full re-sort after each change | Insertion into an array is O(n); more code |
| Sort in the database | Works with pagination and large data | A network round trip per change of sort |

A full sort is also more than some tasks need. To find only the minimum or maximum, a single pass with `Math.min(...nums)` or `reduce` is O(n), against O(n log n) for sorting. To find the top few of a very large collection, a heap avoids sorting everything.

## Common mistakes

> [!MISTAKE] Sorting numbers without a comparator
> `[10, 9, 1].sort()` returns `[1, 10, 9]`. It appears to work for single-digit numbers and for numbers with the same number of digits, so the bug often survives testing. Always pass `(a, b) => a - b`.

**Returning a boolean.** `(a, b) => a > b` never returns a negative number. Return `a - b`, or `-1`/`1`/`0`.

**Forgetting that `sort` mutates.** `const sorted = list.sort()` changes `list`. Use `toSorted` or copy first, especially for props, state and function parameters.

**Subtracting things that are not numbers.** `'b' - 'a'` is `NaN`; BigInt subtraction makes `sort` throw. Use the three-way comparison or `localeCompare`.

**Sorting human text by code units.** Uppercase before lowercase and `ä` after `z` look broken to users. Use a collator.

**Expecting `'file10'` after `'file2'`.** That needs `{ numeric: true }`.

**An inconsistent comparator.** Random results, `NaN` results, or a comparator that reads state which changes during the sort all leave the order implementation-defined.

**Not handling `null` or `undefined` fields.** `undefined` *elements* are moved to the end automatically; `undefined` *fields* inside objects are your comparator's responsibility.

**Using `sort().reverse()` for descending numbers.** The default sort is still a string sort. Write `(a, b) => b - a`.

**Sorting only to get the largest element.** `Math.max` or one `reduce` pass is simpler and faster.

## Interview perspective

Sorting questions test whether you know the default behaviour, can write a comparator without hesitation, and remember that `sort` mutates.

> [!INTERVIEW] What a strong answer sounds like
> "By default `sort` converts elements to strings and compares UTF-16 code units, so numbers need a comparator — `(a, b) => a - b` for ascending. The comparator returns negative, zero or positive. `sort` mutates and returns the same array, so for shared data I use `toSorted` or copy first. It has been guaranteed stable since ES2019, and for user-facing strings I use `localeCompare` or an `Intl.Collator`."

Questions you should be able to answer:

- **Why is `[1, 10, 2].sort()` not numeric?** The default comparison is on string forms, by code unit.
- **What must a comparator return?** A negative number if `a` goes first, positive if `b` goes first, `0` if they are equivalent. Only the sign matters.
- **Is `sort` stable? Since when?** Yes, required since ES2019; V8 has been stable since version 7.0.
- **What algorithm does it use, and what is the complexity?** Implementation-defined; V8 uses TimSort — O(n log n) worst case, O(n) on already-sorted input, O(n) extra space.
- **How do you sort by two fields?** Compare the first; if `0`, compare the second: `cmp1(a, b) || cmp2(a, b)`.
- **How do you sort without mutating?** `toSorted`, or `[...arr].sort()` / `arr.slice().sort()`.
- **Where do `undefined` values go?** Always to the end, without the comparator being called; holes go after them.
- **How do you sort strings case-insensitively?** `a.localeCompare(b, undefined, { sensitivity: 'base' })` or an `Intl.Collator` with that option.

A follow-up to expect: *"Why not shuffle with `sort(() => Math.random() - 0.5)`?"* The comparator is inconsistent, so the result is implementation-defined and measurably non-uniform — some orderings are more likely than others. Fisher–Yates gives every permutation equal probability in O(n).

## Practice

1. Sort `[40, 100, 1, 5, 25]` ascending and descending. Then explain, comparison by comparison, why the default sort gives `[1, 100, 25, 40, 5]`.
2. Given `[{ name, score }]`, return a new array sorted by `score` descending, with ties broken by `name` ascending and case-insensitively. The input must not change.
3. Write `sortBy(arr, keyFn, direction)` that returns a new array sorted by the value `keyFn` returns for each element, calling `keyFn` only once per element.
4. Sort version strings such as `['1.10.0', '1.2.9', '1.2.10']` into the correct order, first with `Intl.Collator`, then by splitting on `.` and comparing the parts as numbers.
5. A colleague's comparator is `(a, b) => a.price > b.price ? 1 : -1`. Explain what is wrong with it when two prices are equal, and what property of `sort` it defeats.
6. Implement a Fisher–Yates shuffle that returns a new array.

## Quick revision {#quick-revision}

- `sort()` with no comparator converts elements to strings and compares UTF-16 code units: `[10, 2, 1].sort()` → `[1, 10, 2]`; uppercase before lowercase; accents after `z`.
- Comparator `(a, b)`: negative → `a` first; positive → `b` first; `0` → keep existing order. Only the sign matters.
- Numbers: `(a, b) => a - b` ascending, `(a, b) => b - a` descending.
- Strings: `(a, b) => a.localeCompare(b)`; general three-way: `a < b ? -1 : a > b ? 1 : 0`. Do not subtract strings or BigInts.
- Dates: subtract `Date` objects; compare ISO 8601 strings as strings.
- Multiple keys: `cmp1(a, b) || cmp2(a, b)`.
- `sort` mutates and returns the same array; `toSorted` (ES2023, Node.js 20+) returns a sorted copy; `[...arr].sort()` in older runtimes.
- Stable since ES2019: equal elements keep their relative order.
- `undefined` elements always go last and never reach the comparator; holes go after them. `null` and `NaN` do reach it — handle them.
- Human text: `localeCompare(b, locale)` or a reused `Intl.Collator(locale, { numeric: true, sensitivity: 'base' })`.
- A comparator must be consistent; returning booleans, `NaN` or random values gives an implementation-defined order.
- Cost: O(n log n) comparator calls; precompute expensive keys.
- V8 uses TimSort; the algorithm is not specified by the language.

## Key takeaways {#key-takeaways}

- The default sort is a string sort, correct only for same-case ASCII strings; everything else needs a comparator.
- A comparator answers one question — which of two elements comes first — with the sign of a number, and must answer consistently.
- `sort` reorders the original array; use `toSorted` or a copy for any array you do not own.
- Stability lets you sort by several keys, either in one comparator with `||` or by sorting repeatedly.
- Sort text that people will read with a locale-aware collator, and choose the locale deliberately.
- Decide explicitly where missing values go, and add a tie-breaker when the order must be deterministic.
