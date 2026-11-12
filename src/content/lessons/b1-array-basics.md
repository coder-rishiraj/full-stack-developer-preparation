---
summary: A JavaScript array is an ordered, zero-indexed list — but underneath it is an ordinary object with numeric-string keys and a self-maintaining `length`. You will learn how to create arrays without traps, how indexing and `length` really behave, and how "holes" in sparse arrays make some methods skip elements that others visit.
difficulty: beginner
minutes: 50
objectives:
  - Create arrays with literals, `Array.of` and `Array.from`, and explain why `new Array(3)` behaves differently from `[undefined, undefined, undefined]`
  - Predict what indexing returns for valid, out-of-range, negative and non-integer indexes, and use `at()` for counting from the end
  - Explain how `length` is maintained, and use it deliberately to grow, truncate or clear an array
  - Explain why `typeof [] === 'object'` and why `Array.isArray` is the correct array check
  - Identify holes in sparse arrays, predict which methods skip them, and avoid creating them by accident
---

## Introduction

Almost every screen in a web application is a list of something: messages in a chat, products in a cart, rows in a table, notifications in a dropdown. The data behind those lists arrives from an API as JSON arrays, gets filtered and sorted in JavaScript, and is finally turned into elements on the page. The **array** is the data structure that holds all of it.

An array is an **ordered collection of values, each identified by a position number called its index**. The first element is at index `0`, the second at index `1`, and so on. Arrays in JavaScript can hold values of any type — numbers, strings, objects, functions, even other arrays — and they grow and shrink as you add and remove elements. You do not declare a size or an element type up front.

That flexibility comes from an unusual design decision. In languages such as Java or C, an array is a fixed-size block of memory. In JavaScript, an array is **an object** whose property names happen to be `'0'`, `'1'`, `'2'` and so on, plus a special `length` property that the engine keeps in sync. Most of the time you never notice this. But it explains a whole family of behaviours that surprise beginners and appear in interviews: why reading past the end returns `undefined` instead of throwing, why setting `length` can delete elements, why `typeof` says `'object'`, and why an array can have "empty slots" that are not the same as slots holding `undefined`.

This lesson teaches arrays from the ground up: creating them, reading and writing elements, the `length` property, how the engine stores them, and — in a section that can be read on its own — [[b1-sparse-arrays|sparse arrays and holes]]. The rest of the Arrays module builds on this: [[b1-array-mutation]] covers which methods change an array, [[b1-array-search]] and [[b1-array-map-filter-reduce]] cover processing, and [[b1-copying-arrays]] covers copying.

## Before you start

- **Objects as values** — an object is a collection of named properties, and variables hold references to objects rather than the objects themselves. See [[b1-objects-as-values]] and [[b1-primitive-vs-reference]].
- **Bracket property access** — `obj['name']` reads a property whose name is computed at run time. See [[b1-dot-vs-bracket]].
- **`typeof`** — the operator that reports a value's basic type. See [[b1-typeof]].
- **`for` loops** — the counting loop `for (let i = 0; i < n; i++)`. See [[b1-for-loops]].

## The intuition

Picture a row of numbered pigeonholes on a wall, starting at `0`. Each pigeonhole can hold one item of any kind. Above the row hangs a sign that says how long the row is. When you put something in pigeonhole `7` of a five-hole row, the row stretches to eight holes and the sign updates to `8`. When you repaint the sign to say `2`, every pigeonhole from `2` onwards is torn down and its contents thrown away.

Two details of this picture matter later. First, the sign is not a count of items; it is "highest pigeonhole number plus one". If you put something only in hole `7`, the sign says `8` even though seven holes are empty. Second, an **empty pigeonhole** is different from a pigeonhole holding a card that says "nothing here". The first is a hole — the property does not exist. The second is a slot holding the value `undefined`. Some array methods treat the two the same; many do not.

Where the analogy stops working: real pigeonholes occupy space whether or not they are filled. A JavaScript engine can store a mostly-empty array without allocating space for every empty slot, as you will see under [[b1-sparse-arrays]].

## Creating arrays

### Array literals

The normal way to create an array is an **array literal**: values separated by commas inside square brackets.

```javascript title="literals.js"
const empty = [];
const scores = [90, 72, 85];
const mixed = ['Ada', 36, true, null, { role: 'admin' }, [1, 2]];
const trailing = [
  'first',
  'second', // a trailing comma is allowed and ignored
];

console.log(empty.length, scores.length, mixed.length, trailing.length);
console.log(mixed[4].role, mixed[5][1]);
```

```output
0 3 6 2
admin 2
```

Elements can be any expression, and they can mix types freely. `mixed[5][1]` reads index `5` (the inner array `[1, 2]`) and then index `1` of that, which is `2`. Arrays nested inside arrays are how JavaScript represents grids and matrices.

A **trailing comma** after the last element is ignored, which is why teams format multi-line arrays with one: adding a new line later changes only one line in the diff. Be careful with commas *between* elements, though. `[1, , 3]` has two commas with nothing between them, and that creates a hole — an index with no element. `[1, , 3].length` is `3`. Holes are covered in their own section below.

### The `Array` constructor and its trap

You can also create arrays with `Array(...)` or `new Array(...)` — the two are equivalent. The constructor has an awkward rule: **a single numeric argument is treated as a length, not as an element**.

```javascript title="array-constructor.js"
console.log(Array(3));        // one number: a length
console.log(Array(3, 4));     // two arguments: elements
console.log(Array('3'));      // one non-number: an element
console.log(Array.of(3));     // always elements

try {
  new Array(2.5);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
```

```output
[ <3 empty items> ]
[ 3, 4 ]
[ '3' ]
[ 3 ]
RangeError: Invalid array length
```

`Array(3)` creates an array whose `length` is `3` but which contains **no elements at all** — Node prints `<3 empty items>`. That is not the same as three `undefined` values, and the difference is the most famous array trap in JavaScript: `Array(3).map(() => 0)` returns `[ <3 empty items> ]`, not `[0, 0, 0]`, because `map` skips holes. A single argument that is negative or not a whole number throws a `RangeError`, and a single non-number becomes the only element. This inconsistency — the meaning changes with the type and count of arguments — is why `Array.of` was added in ES2015: it always treats its arguments as elements.

Outputs in this lesson are from Node.js 22. Browser consoles display holes differently (Chrome shows `[empty × 3]`), but the underlying array is the same.

### Making an array of a given size

When you really do want an array of `n` elements, fill it in the same step, so it never contains holes:

```javascript title="sized-arrays.js"
console.log(Array(3).fill(0));
console.log(Array.from({ length: 3 }, () => 0));
console.log(Array.from({ length: 5 }, (_, i) => i * 2));

const shared = Array(2).fill([]);
shared[0].push('x');
console.log(shared);

const separate = Array.from({ length: 2 }, () => []);
separate[0].push('x');
console.log(separate);
```

```output
[ 0, 0, 0 ]
[ 0, 0, 0 ]
[ 0, 2, 4, 6, 8 ]
[ [ 'x' ], [ 'x' ] ]
[ [ 'x' ], [] ]
```

`fill(value)` writes the same value into every index from `0` to `length - 1`, turning holes into real elements. `Array.from({ length: n }, fn)` treats the object `{ length: n }` as an "array-like" with `n` missing entries, and calls `fn(undefined, index)` for each index; the function's return value becomes the element. The underscore `_` is a naming convention for "a parameter I do not use". [[b1-array-from-isarray]] explains `Array.from` in full.

The second pair of examples shows the trap with `fill`. `fill([])` evaluates `[]` **once** and writes *the same array reference* into every slot, so pushing into `shared[0]` also changes `shared[1]` — they are one array. `Array.from` calls its function once per index, producing a fresh array each time. Use `Array.from` whenever each element should be its own object. If references are new to you, [[b1-primitive-vs-reference]] explains why this happens.

## Reading and writing elements

### Zero-based indexes

You read and write elements with square brackets. Indexes start at `0`, so the last element of an array of length `n` is at `n - 1`.

```javascript title="indexing.js"
const colours = ['red', 'green', 'blue'];

console.log(colours[0], colours[2]);
console.log(colours[3]);              // past the end: no error
console.log(colours[colours.length - 1]);
console.log(colours.at(-1), colours.at(-3), colours.at(-4));

colours[1] = 'lime';                  // overwrite
console.log(colours);
```

```output
red blue
undefined
blue
blue red undefined
[ 'red', 'lime', 'blue' ]
```

Reading an index that does not exist returns `undefined`. There is no "index out of bounds" exception as in Java or Python. This is convenient and dangerous: a typo like `colours[colours.length]` (one past the end) silently produces `undefined`, and the bug surfaces later when some code tries to call a method on it.

**`at(index)`**, added in ES2022, accepts negative numbers that count from the end: `at(-1)` is the last element, `at(-2)` the second to last. Before `at`, the idiom was `arr[arr.length - 1]`. You cannot write `arr[-1]` for the same purpose, for the reason explained next.

### Indexes are property names

Because an array is an object, `colours[0]` is a property read, just like `user['name']`. Property names are strings (or symbols), so the engine converts the index `0` to the string `'0'` before looking it up. You can see this with `Object.keys`, which lists an object's own property names:

```javascript title="indexes-are-keys.js"
const a = [10, 20, 30];
console.log(Object.keys(a));
console.log(a['1'], a[1.0], a['01']);

a[-1] = 'negative';
a[1.5] = 'fraction';
console.log(a.length);
console.log(a);
```

```output
[ '0', '1', '2' ]
20 20 undefined
3
[ 10, 20, 30, '-1': 'negative', '1.5': 'fraction' ]
```

`a['1']` and `a[1.0]` both reach the element at index `1`, because both convert to the string `'1'`. `a['01']` does not — the string `'01'` is a different property name. Writing to `a[-1]` or `a[1.5]` does not throw, and it does not create elements either: `'-1'` and `'1.5'` are not valid **array indexes**, so they become ordinary named properties attached to the array object. `length` stays `3`, and methods such as `map` and `forEach` ignore them. That is why `arr[-1]` is not "the last element" in JavaScript, unlike Python.

The specification defines an array index precisely: a property name that is the canonical string form of an integer from `0` up to 2³² − 2 (4,294,967,294). Only those names count as elements and affect `length`.

> [!NOTE] Engines do not really build strings
> Converting `a[2]` to the string `'2'` is how the language *specification* describes the lookup. Engines such as V8 detect integer indexes and read them directly from a compact internal store, so array access is fast. The string view is the mental model for behaviour, not a description of performance.

## The `length` property

### How `length` is maintained

`length` is a special property of every array. The engine maintains one rule, sometimes called the **length invariant**: `length` is always greater than the largest index that holds an element. Two consequences follow, one when you write an element and one when you write `length` itself.

**Writing an element at or beyond `length` grows the array.** The new `length` becomes that index plus one, and any indexes in between are left as holes:

```javascript title="length-grows.js"
const items = [1, 2];
items[5] = 6;
console.log(items, items.length);
```

```output
[ 1, 2, <3 empty items>, 6 ] 6
```

**Writing a smaller `length` deletes every element at or above it.** Writing a larger `length` adds holes at the end:

```javascript title="length-writes.js"
const letters = ['a', 'b', 'c', 'd'];
letters.length = 2;
console.log(letters, letters[2]);

letters.length = 4;
console.log(letters);

letters.length = 0;
console.log(letters);

try {
  letters.length = -1;
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
```

```output
[ 'a', 'b' ] undefined
[ 'a', 'b', <2 empty items> ]
[]
RangeError: Invalid array length
```

Truncation really deletes: after `letters.length = 2`, growing `length` back to `4` does not bring `'c'` and `'d'` back — the new slots are holes. Setting `length = 0` is a common way to **empty an array in place**. It differs from `letters = []`: reassigning the variable creates a new array and leaves any other variable that pointed at the old one still seeing the old contents, while `length = 0` empties the one shared array that every reference sees. Which one you want depends on whether other code should observe the change; [[b1-array-mutation]] discusses this in depth.

`length` must be a whole number from `0` to 2³² − 1 (4,294,967,295). Anything else throws a `RangeError`. You will not hit the upper limit in practice — an array that long would need tens of gigabytes — but it explains why the largest valid index is 2³² − 2.

### `length` is not a count of elements

Because holes count towards `length`, `length` is "last index plus one", not "number of elements":

```javascript title="length-vs-count.js"
const sparse = [];
sparse[3] = 'x';
console.log(sparse.length, Object.keys(sparse).length);
```

```output
4 1
```

For the arrays you create with literals, `push` and `map`, there are no holes and the two numbers agree. They diverge only when holes appear, which is exactly what the sparse-arrays section is about.

## Arrays are objects

### `typeof` and `Array.isArray`

Since arrays are objects, `typeof` reports `'object'`, the same as for `{}` or `null`. To ask "is this an array?", use **`Array.isArray`**:

```javascript title="is-array.js"
console.log(typeof [], typeof {}, typeof null);
console.log(Array.isArray([]), Array.isArray({ length: 0 }), Array.isArray('abc'));
```

```output
object object object
true false false
```

`Array.isArray` checks whether the value is a genuine array object (or a `Proxy` wrapping one), regardless of what it looks like. A plain object with a `length` property is not an array, and neither is a string, even though both can be indexed with brackets. You will meet such "array-likes" — `arguments`, DOM `NodeList`s, strings — in [[b1-array-from-isarray]], along with why `instanceof Array` is a weaker check.

### `const` does not freeze an array

Declaring an array with `const` prevents the *variable* from being reassigned. It does not prevent changes to the array the variable points at:

```javascript title="const-array.js"
const cart = ['apple'];
cart.push('pear');
cart[0] = 'plum';
console.log(cart);

try {
  cart = [];
} catch (err) {
  console.log(err.name + ': ' + err.message);
}

const locked = Object.freeze(['apple']);
try {
  locked.push('pear');
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
```

```output
[ 'plum', 'pear' ]
TypeError: Assignment to constant variable.
TypeError: Cannot add property 1, object is not extensible
```

If you need an array that cannot change, `Object.freeze` makes it read-only (shallowly — objects inside it can still change). In non-strict scripts, writes to a frozen array are silently ignored instead of throwing; this snippet throws because it runs as an ES module, which is always strict. [[b1-const]] and [[b1-object-apis]] cover `const` and `freeze` in detail.

### Arrays are passed by reference

Assigning an array to another variable, or passing it to a function, copies the **reference**, not the elements. Both names then point at the same array, and a change through either name is visible through the other:

```javascript title="shared-reference.js"
const original = [1, 2, 3];
const alias = original;
alias.push(4);
console.log(original, original === alias);
```

```output
[ 1, 2, 3, 4 ] true
```

This is the source of many state bugs in user interfaces. Making a genuine copy is the topic of [[b1-copying-arrays]].

## Iterating over an array

Three loops are appropriate for arrays, and one is not.

```javascript title="iteration.js"
const fruits = ['apple', 'banana', 'cherry'];

for (let i = 0; i < fruits.length; i++) {
  if (i === 1) continue;             // index loop: full control
  console.log(i, fruits[i]);
}

for (const fruit of fruits) {         // for...of: values, supports break
  if (fruit === 'banana') break;
  console.log(fruit);
}

fruits.forEach((fruit, i) => console.log(`${i}:${fruit}`));
```

```output
0 apple
2 cherry
apple
0:apple
1:banana
2:cherry
```

The classic **index loop** gives you the index and full control: skip, go backwards, step by two, or stop early. **`for...of`** gives you each value in order and supports `break`, `continue` and `await`; it is the best default when you need values. **`forEach`** calls a function for each element and cannot be stopped early; it is covered in [[b1-foreach]].

The loop to avoid is **`for...in`**. It iterates over an object's enumerable property *names*, so on an array it gives you the index strings `'0'`, `'1'`, `'2'` — strings, not numbers — plus any extra named properties, plus enumerable properties inherited from `Array.prototype` if a library added some:

```javascript title="for-in-trap.js"
const nums = [10, 20];
nums.label = 'scores';
Array.prototype.extra = function () {};   // a careless library does this

for (const key in nums) {
  console.log(key, typeof key);
}

delete Array.prototype.extra;
```

```output
0 string
1 string
label string
extra string
```

String keys turn `key + 1` into `'01'` instead of `1`, and the extra names are never what you meant. Use `for...of` or an index loop for arrays; [[b1-for-of-in]] compares the two loops in detail.

```quiz
Q: What does this code log? `const a = ['x', 'y', 'z']; a.length = 1; a.length = 3; console.log(a[1]);`
- [ ] `'y'`
- [x] `undefined`, because shrinking `length` deleted the elements
- [ ] It throws a `RangeError`
- [ ] `null`
> Setting `length = 1` deletes every element at index 1 and above. Growing `length` back to 3 adds holes, not the old values. Reading a hole returns `undefined`. Nothing throws, because 1 and 3 are valid lengths.

Q: Why does `arr[-1]` not return the last element of a JavaScript array?
- [ ] Negative indexes are a syntax error
- [ ] It returns the first element instead
- [x] `'-1'` is not a valid array index, so it is an ordinary property name that the array does not have
- [ ] It does return the last element in strict mode
> Array indexes are the strings `'0'` to `'4294967294'`. `'-1'` is outside that set, so `arr[-1]` looks up a normal property called `-1`, which usually does not exist and returns `undefined`. Use `arr.at(-1)` instead.

Q: Which expression correctly creates an array of three independent empty arrays?
- [ ] `Array(3).fill([])`
- [ ] `new Array(3)`
- [x] `Array.from({ length: 3 }, () => [])`
- [ ] `Array(3).map(() => [])`
> `fill([])` stores one shared array in all three slots. `new Array(3)` creates three holes. `map` skips holes, so `Array(3).map(...)` returns three holes. `Array.from` calls the function once per index, creating a new array each time.
```

## How it works internally

### What the specification says

The ECMAScript specification calls arrays **array exotic objects**. "Exotic" means the object overrides one of the internal operations that ordinary objects use — in this case `[[DefineOwnProperty]]`, the operation behind every property write. An array's version adds two rules on top of the normal behaviour:

1. When the property being defined is an array index greater than or equal to the current `length`, `length` is set to that index plus one.
2. When the property being defined is `length` itself, the new value is validated (a `RangeError` for anything that is not a whole number up to 2³² − 1), and if it is smaller than the old value, every index from the new length upwards is deleted, highest first.

Everything else — reading elements, adding named properties, the prototype chain — is ordinary object behaviour. Reading `arr[5]` when there is no property `'5'` follows the normal rule for a missing property: look up the prototype chain (`Array.prototype`, then `Object.prototype`), and return `undefined` if nothing is found. That is why out-of-range reads return `undefined` rather than throwing.

The methods you call on arrays — `push`, `map`, `includes` — are not stored on each array. They live once on `Array.prototype`, and every array inherits them through its prototype link ([[b1-prototype-chain]]). Most of them are deliberately **generic**: the specification writes them in terms of "read `length`, then read and write properties by index", so they work on any object with a `length` and indexed properties, not only on real arrays.

### What V8 does

The specification describes behaviour, not storage. If engines really stored arrays as hash tables keyed by strings, they would be slow. V8, the engine in Chrome and Node.js, instead stores the indexed elements of an array in a separate, contiguous **backing store**, apart from its named properties, and tracks an **elements kind** for each array that describes what the store contains:

| Elements kind | Meaning |
|---|---|
| `PACKED_SMI_ELEMENTS` | No holes; every element is a small integer |
| `PACKED_DOUBLE_ELEMENTS` | No holes; elements are numbers, stored as raw doubles |
| `PACKED_ELEMENTS` | No holes; elements can be anything |
| `HOLEY_SMI_ELEMENTS`, `HOLEY_DOUBLE_ELEMENTS`, `HOLEY_ELEMENTS` | The same three, but the array may contain holes |
| `DICTIONARY_ELEMENTS` | Very sparse; stored as a hash table from index to value |

`[1, 2, 3]` starts as `PACKED_SMI_ELEMENTS`. Pushing `1.5` moves it to `PACKED_DOUBLE_ELEMENTS`; pushing a string moves it to `PACKED_ELEMENTS`. Transitions only go towards the more general kinds, and an array that becomes holey stays holey even if you later fill every hole. Code that operates on packed arrays of one kind can be optimised more aggressively by V8's compiler, because it does not have to check for holes or unexpected types on every access.

These are V8 implementation details and can change between versions; other engines use different strategies. The practical lesson is stable across engines: **arrays created densely and kept to one kind of element are the fastest case**, and an array like `arr[1_000_000] = 1` on an empty array is stored as a dictionary and accessed more slowly. How V8 shapes objects in general is covered in [[b1-hidden-classes]].

## Sparse arrays {#b1-sparse-arrays}

A **sparse array** is an array with **holes**: index positions below `length` where no element exists. An array with no holes is called **dense**. A hole is not a slot containing `undefined` — it is the *absence* of a property. In `[1, , 3]`, index `1` is a hole: the array has `length` 3, but it owns only the properties `'0'` and `'2'`.

Holes exist because, as the array basics showed, `length` can be larger than the number of elements: writing an index past the end, or writing a larger `length`, leaves gaps. The language then had to decide what each array operation does with a gap. Different methods, added in different years, decided differently. That is the whole difficulty of sparse arrays: there are two kinds of "empty", and you need to know which methods tell them apart.

### How holes are created

```javascript title="making-holes.js"
const a = [1, , 3];                 // 1. a missing element in a literal
const b = new Array(3);             // 2. the Array constructor with a length
const c = [];
c[2] = 'x';                         // 3. writing past the end
const d = ['p', 'q'];
d.length = 4;                       // 4. growing length
const e = ['a', 'b', 'c'];
delete e[1];                        // 5. delete on an element

console.log(a, b, c, d, e);
console.log(e.length);
```

```output
[ 1, <1 empty item>, 3 ] [ <3 empty items> ] [ <2 empty items>, 'x' ] [ 'p', 'q', <2 empty items> ] [ 'a', <1 empty item>, 'c' ]
3
```

The fifth case catches people out. The `delete` operator removes a property, and an element is a property, so `delete e[1]` leaves a hole and **does not shift the later elements down or change `length`**. To remove an element and close the gap, use `splice` ([[b1-slice-splice]]) or `filter`.

### Detecting a hole

Reading a hole returns `undefined`, so a plain read cannot tell a hole from a stored `undefined`. To ask whether an index holds an element, ask whether the property exists:

```javascript title="detecting-holes.js"
const sparse = [1, , 3];
const dense = [1, undefined, 3];

console.log(sparse[1], dense[1]);
console.log(1 in sparse, 1 in dense);
console.log(Object.hasOwn(sparse, 1), Object.hasOwn(dense, 1));
```

```output
undefined undefined
false true
false true
```

Both checks agree here, but they are not identical. The **`in`** operator also searches the prototype chain, while **`Object.hasOwn`** looks only at the array itself. The difference shows a strange consequence of "a hole is a missing property": a read of a hole falls through to `Array.prototype`, exactly like any missing property.

```javascript title="hole-reads-prototype.js"
Array.prototype[1] = 'from the prototype';
const p = [0, , 2];
console.log(p[1], 1 in p, Object.hasOwn(p, 1));
delete Array.prototype[1];
```

```output
from the prototype true false
```

No real code should put indexes on `Array.prototype`; the example only proves the mechanism. Use `Object.hasOwn(arr, i)` when you need a precise answer.

### Which operations skip holes

This is the table to remember. The rule underneath it is that older methods (from ES5, 2009) check whether each index exists and skip missing ones, while newer, iterator-based features (ES2015 onwards) read every index from `0` to `length - 1` and so see holes as `undefined`.

```javascript title="hole-behaviour.js"
const s = [1, , 3];

const visited = [];
s.forEach((value, i) => visited.push(i));
console.log('forEach visits', visited);
console.log('map', s.map((x) => x * 2));
console.log('filter', s.filter(() => true));
console.log('some/every', s.some((v) => v === undefined), s.every((v) => v !== undefined));
console.log('Object.keys', Object.keys(s));

console.log('spread', [...s], 'Array.from', Array.from(s));
console.log('includes', s.includes(undefined), 'indexOf', s.indexOf(undefined));
console.log('findIndex', s.findIndex((v) => v === undefined));
console.log('join', s.join('-'), 'JSON', JSON.stringify(s));
```

```output
forEach visits [ 0, 2 ]
map [ 2, <1 empty item>, 6 ]
filter [ 1, 3 ]
some/every false true
Object.keys [ '0', '2' ]
spread [ 1, undefined, 3 ] Array.from [ 1, undefined, 3 ]
includes true indexOf -1
findIndex 1
join 1--3 JSON [1,null,3]
```

| Treats holes as… | Operations |
|---|---|
| **Skipped** (callback not called) | `forEach`, `map`, `filter`, `reduce`, `some`, `every`, `indexOf`, `lastIndexOf`, `Object.keys`, `for...in` |
| **Visited as `undefined`** | `for...of`, spread `[...a]`, `Array.from`, destructuring, `entries`/`keys`/`values`, `find`, `findIndex`, `findLast`, `findLastIndex`, `includes` |
| **Preserved as holes** | `map` (result keeps the hole), `slice`, `concat`, `reverse`, `copyWithin` |
| **Removed** | `filter`, `flat`, `flatMap` |
| **Turned into a value** | `join` and `toString` (empty string), `JSON.stringify` (`null`), `sort` (moved to the very end), `toSorted`/`toReversed`/`with`/`toSpliced` (become `undefined`) |

Look at `includes(undefined)` and `indexOf(undefined)` side by side: one says the array contains `undefined`, the other says it does not, for the same array. `indexOf` skips the hole; `includes` reads it as `undefined`. Likewise `some(v => v === undefined)` is `false` because `some` never calls its callback for the hole.

Note also that **`map` does not fill holes**: `map(x => x)` returns an array with the same holes. If you need a dense result, densify first with `Array.from(s)` or `[...s]`, or fill the holes with `fill`.

### Densifying and avoiding holes

```javascript title="densify.js"
const s = [1, , 3];
console.log(Array.from(s), [...s]);                 // holes -> undefined
console.log(Array.from(s, (v) => v ?? 0));          // holes -> a default
console.log(s.filter(() => true));                  // holes removed
console.log(Array.from({ length: 3 }), Array(3).fill(null));
```

```output
[ 1, undefined, 3 ] [ 1, undefined, 3 ]
[ 1, 0, 3 ]
[ 1, 3 ]
[ undefined, undefined, undefined ] [ null, null, null ]
```

In everyday code the best policy is to **never create holes**: build arrays with literals, `push`, `Array.from` and `fill`; remove elements with `splice` or `filter` rather than `delete`; and avoid writing indexes past the end. Holes make behaviour depend on which method you happened to choose, and, in V8, they push an array into a slower "holey" storage mode permanently.

### When sparseness is legitimate

There are a few cases where gaps are real data. A lookup table keyed by small integer IDs (`byId[42] = user`) is naturally sparse; so is a timeline indexed by second where most seconds have no event. Even then, a `Map` ([[b1-map]]) is usually clearer: it has a real `size`, it does not create a giant `length`, and iterating it never visits the gaps. A sparse array with one element at index one million has `length` 1,000,001 and is stored by V8 as a dictionary — `forEach` calls its callback once, but an index loop up to `length` runs a million times.

```quiz
Q: `const a = ['a', 'b', 'c']; delete a[1];` — what are `a.length` and `a`?
- [ ] `2` and `['a', 'c']`
- [x] `3` and `['a', <1 empty item>, 'c']`
- [ ] `3` and `['a', undefined, 'c']`, with index 1 holding `undefined`
- [ ] It throws, because array elements cannot be deleted
> `delete` removes the property `'1'`, leaving a hole. It never shifts later elements or changes `length`. The hole is not a stored `undefined`: `1 in a` is `false`. Use `splice(1, 1)` to remove and close the gap.

Q: For `const s = [1, , 3]`, which pair of results is correct?
- [ ] `s.includes(undefined)` is `false` and `s.indexOf(undefined)` is `-1`
- [x] `s.includes(undefined)` is `true` and `s.indexOf(undefined)` is `-1`
- [ ] Both report that `undefined` is present at index 1
- [ ] Both throw on a sparse array
> `indexOf` is an ES5 method that skips missing indexes, so it never compares the hole. `includes` (ES2016) reads every index from 0 to length - 1, and reading a hole produces `undefined`, which matches.
```

## Worked example: a seat map

A small booking widget shows a row of seats. The API returns which seats are taken; the UI needs a dense array with one entry per seat. This example builds the array correctly, shows the sparse version that a beginner might write, and compares them.

```javascript title="seat-map.js"
const SEATS = 6;
const taken = [1, 4];                       // from the API: seat indexes

// Beginner version: assign only the taken seats.
const sparse = [];
for (const seat of taken) sparse[seat] = 'taken';
sparse.length = SEATS;
console.log(sparse);
console.log(sparse.map((s) => s ?? 'free'));     // map skips the holes

// Dense version: every seat gets a value up front.
const seats = Array.from({ length: SEATS }, (_, i) =>
  taken.includes(i) ? 'taken' : 'free',
);
console.log(seats);

const firstFree = seats.indexOf('free');
const lastSeat = seats.at(-1);
console.log({ firstFree, lastSeat, count: seats.length });

// Book seat 0, then release every seat after index 3 by truncating.
seats[firstFree] = 'taken';
seats.length = 4;
console.log(seats);
```

```output
[ <1 empty item>, 'taken', <2 empty items>, 'taken', <1 empty item> ]
[ <1 empty item>, 'taken', <2 empty items>, 'taken', <1 empty item> ]
[ 'free', 'taken', 'free', 'free', 'taken', 'free' ]
{ firstFree: 0, lastSeat: 'free', count: 6 }
[ 'taken', 'taken', 'free', 'free' ]
```

The sparse version looks reasonable but fails at the next step: `map(s => s ?? 'free')` was meant to replace empty seats with `'free'`, yet `map` never calls its callback for holes, so the result has exactly the same holes. A rendering loop using `map` (which is how React renders lists) would draw only two seats.

The dense version asks a question for *every* index, so no hole can exist. `indexOf('free')` finds the first free seat, `at(-1)` reads the last one, and assigning to `length` truncates the row. In a real UI you would not truncate the array your component is rendering — you would create a new one — and [[b1-array-mutation]] explains why.

## In real systems

**API responses and rendering.** JSON arrays from a server always become dense JavaScript arrays — JSON has no syntax for holes — and UI frameworks render lists with `map`. React's list rendering ([[b4-rendering-lists]]) calls `items.map(item => <Row ... />)`, which is one more reason to keep arrays dense: a hole renders nothing.

**Pre-sized buffers.** Code that needs an array of known size — a grid for a game board, a histogram with 24 hourly buckets — creates it with `Array.from({ length: n }, ...)` or `new Array(n).fill(0)`. Filling immediately keeps the array packed in V8.

**Truncating and clearing.** Libraries that reuse an array as a buffer (an event queue flushed every frame, a pool of reusable objects) clear it with `buffer.length = 0` so every holder of the reference sees the empty buffer and no new allocation happens.

**Defensive type checks.** Functions that accept "one item or a list" normalise their input with `Array.isArray(input) ? input : [input]`. This is common in configuration APIs, such as build tools that accept either one entry file or an array of them.

**Binary data.** For large numeric data — pixels, audio samples, WebGL vertex buffers — production code uses **typed arrays** such as `Uint8Array` and `Float32Array`, which have a fixed length and a single numeric element type. They share many method names with arrays but are not arrays: `Array.isArray(new Uint8Array(4))` is `false`. See [[b1-arraybuffer]].

## Trade-offs and alternatives

| Structure | Good for | Weak at |
|---|---|---|
| Array | Ordered lists, iteration, index access, rendering | Membership tests (O(n)), removing from the front |
| `Set` ([[b1-set]]) | Unique values, fast "is it present?" | Index access, ordering by anything but insertion |
| `Map` ([[b1-map]]) | Lookup by key, sparse integer keys | JSON serialisation, index access |
| Plain object | Records with known field names | Ordered collections, iteration order of numeric keys |
| Typed array | Large numeric data, binary I/O | Mixed types, resizing |

Reading or writing by index is O(1). Appending at the end with `push` is O(1) amortised. Inserting or removing near the front is O(n), because every later element must move — see [[b1-push-pop-shift]]. Searching for a value is O(n); if you check membership often, keep a `Set` alongside or instead of the array.

## Common mistakes

> [!MISTAKE] Using `new Array(n)` and then `map`
> `new Array(5).map((_, i) => i)` returns five holes, because `map` skips missing indexes. Use `Array.from({ length: 5 }, (_, i) => i)`, which calls the function for every index.

**Off-by-one at the end.** The last index is `length - 1`. `arr[arr.length]` is always `undefined`, and a loop with `i <= arr.length` runs one time too many. Use `i < arr.length`, or `at(-1)` for the last element.

**Using `arr[-1]`.** It reads a property named `'-1'`, not the last element. Use `at(-1)`.

**Using `delete` to remove an element.** It leaves a hole and keeps `length`. Use `splice(index, 1)` to remove in place or `filter` to create a new array without the element.

**Checking arrays with `typeof`.** `typeof` returns `'object'` for arrays, plain objects and `null`. Use `Array.isArray`.

**Iterating with `for...in`.** It yields string indexes plus any extra enumerable properties. Use `for...of` or an index loop.

**Filling with one shared object.** `Array(3).fill({})` and `Array(3).fill([])` store one object three times. Use `Array.from({ length: 3 }, () => ({}))`.

**Thinking `const` makes an array immutable.** `const` stops reassignment only; `push` and index writes still work. Use `Object.freeze` for a read-only array, or non-mutating methods to avoid changing shared data.

## Interview perspective

Array basics come up as quick warm-up questions and as "what does this print?" puzzles. Interviewers are checking whether you know that arrays are objects and can reason about `length` and holes rather than guessing.

> [!INTERVIEW] What a strong answer sounds like
> "A JavaScript array is an object whose element keys are the strings `'0'` to `'4294967294'`, plus a `length` that the engine keeps one greater than the highest index. Writing past the end grows `length` and leaves holes; writing a smaller `length` deletes elements. Holes are missing properties, not `undefined` values, so ES5 methods like `map` and `forEach` skip them while `for...of` and spread see them as `undefined`."

Questions you should be able to answer:

- **Why is `typeof []` `'object'`, and how do you test for an array?** Arrays are objects; `typeof` only distinguishes primitives, functions and "everything else". Use `Array.isArray`, which also works across iframes, unlike `instanceof Array`.
- **What is the difference between `new Array(3)` and `[undefined, undefined, undefined]`?** The first has three holes and no own index properties; the second has three elements whose value is `undefined`. `map`, `forEach` and `Object.keys` behave differently on them.
- **How do you empty an array?** `arr.length = 0` empties the existing array, visible to every reference; `arr = []` makes the variable point at a new array and leaves others unchanged.
- **What does `[1, 2, 3].length = 1` do?** It deletes indexes 1 and 2; the array becomes `[1]`.
- **Why might a mostly-empty array be slow?** Engines like V8 switch very sparse arrays to dictionary storage, and holey arrays need extra checks on every access.

A follow-up to expect: *"What is `[,,,].length`?"* It is `3`. The final comma is a trailing comma and is ignored, leaving three holes.

## Practice

1. Without running it, predict the output of `const a = []; a[2] = 'c'; a.length = 5; console.log(a.length, Object.keys(a).length, a.indexOf(undefined), a.includes(undefined));`. Then run it and explain each value.
2. Write `range(start, end, step = 1)` that returns a dense array from `start` (inclusive) to `end` (exclusive), using `Array.from`. Handle a negative `step`.
3. Write `countHoles(arr)` that returns how many indexes below `length` have no element. Test it on `[1, , , 4, , 6]` (expected `3`).
4. Create a 3 × 3 grid of zeros where setting `grid[0][0] = 1` changes only one cell. Then write the buggy version with `fill` and explain why it changes a whole column.
5. A function receives either a single tag string or an array of tags. Normalise the input to an array and return the tags in upper case.

## Quick revision {#quick-revision}

- An array is an object with index keys `'0'`…`'4294967294'` and a special `length`; methods live on `Array.prototype`.
- Create with literals, `Array.of(...)` or `Array.from({ length: n }, fn)`; `Array(n)` with one number creates `n` holes.
- `fill(obj)` puts the same reference in every slot; use `Array.from` for independent objects.
- Indexes are zero-based; reading a missing index returns `undefined`, never throws.
- `arr[-1]` and `arr[1.5]` are ordinary properties, not elements; use `at(-1)` for the last element (ES2022).
- `length` = highest index + 1. Writing past the end grows it with holes; writing a smaller `length` deletes elements; `length = 0` empties in place.
- `typeof []` is `'object'`; use `Array.isArray`.
- `const` stops reassignment, not mutation; `Object.freeze` makes an array shallowly read-only.
- Iterate with `for`, `for...of` or `forEach`; never `for...in`.
- Holes: missing properties. Created by `Array(n)`, `[1, , 3]`, writing past the end, growing `length`, `delete`.
- Detect with `Object.hasOwn(arr, i)` (or `i in arr`, which also checks the prototype).
- Skip holes: `forEach`, `map`, `filter`, `reduce`, `some`, `every`, `indexOf`. See `undefined`: `for...of`, spread, `Array.from`, `find`, `findIndex`, `includes`.
- `map` keeps holes; `filter` and `flat` drop them; `JSON.stringify` writes `null`; `join` writes an empty string.
- V8: packed arrays of one element type are fastest; holey and dictionary storage are slower.

## Key takeaways {#key-takeaways}

- A JavaScript array is an ordinary object with numeric-string keys plus a `length` the engine keeps in sync, which explains `typeof`, out-of-range reads and writable `length`.
- `length` is the highest index plus one, not the number of elements; changing it can grow or destroy data.
- Create sized arrays with `Array.from` or `fill`, never with a bare `new Array(n)` that you then `map`.
- Use `at()` for negative positions and `Array.isArray` for type checks.
- A hole is a missing property, not a stored `undefined`, and different methods treat holes differently.
- Keep arrays dense: avoid `delete`, writing past the end and `Array(n)`, and reach for a `Map` when the keys really are sparse.
