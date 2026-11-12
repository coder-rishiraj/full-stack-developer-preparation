---
summary: A Map is JavaScript's purpose-built dictionary - it associates keys of any type with values, remembers insertion order and knows its own size. You will learn its API and equality rule, the patterns it is used for, and how to decide between a Map and a plain object.
difficulty: beginner
minutes: 45
objectives:
  - Create a Map and use set, get, has, delete, clear and size correctly
  - Explain how Map compares keys, and why an object key must be the same reference
  - Iterate a Map's keys, values and entries and convert between Maps, objects, arrays and JSON
  - Implement counting, grouping, indexing and caching with a Map
  - Choose between a Map and a plain object and justify the choice
---

## Introduction

Programs constantly need to look something up by a key: the user with a given id, the number of times each word occurs, the cached response for a URL. For most of JavaScript's history the only tool for this was a plain object, used as a dictionary:

```javascript
const counts = {};

for (const word of ['to', 'be', 'or', 'not', 'to', 'be', 'constructor']) {
  counts[word] = (counts[word] || 0) + 1;
}

console.log(counts.to);
console.log(counts.constructor);
```

```output
2
function Object() { [native code] }1
```

The count for `to` is right. The count for `constructor` is nonsense. Every ordinary object inherits properties from `Object.prototype`, one of which is named `constructor`, so `counts['constructor']` was not `undefined` the first time — it was a function, and adding `1` to a function produced a string. The object was never an empty dictionary; it only looked like one.

Objects have other limits as dictionaries. Their keys can only be strings or symbols, so the number `1` and the string `'1'` are the same key, and using an object as a key turns it into the useless string `'[object Object]'`. There is no direct way to ask how many entries there are.

A **Map** is a collection of key-value pairs built for this job, added in ES2015. Any value can be a key, nothing is inherited, entries stay in insertion order, and `size` is always available.

```javascript
const counts = new Map();

for (const word of ['to', 'be', 'or', 'not', 'to', 'be', 'constructor']) {
  counts.set(word, (counts.get(word) ?? 0) + 1);
}

console.log(counts.get('to'), counts.get('constructor'), counts.size);
```

```output
2 1 5
```

This lesson teaches the Map API, how keys are compared, iteration and conversion, the standard patterns, and — in its own section — how to choose between a Map and an object. [[b1-set]] is the same idea without values; [[b1-weakmap]] is the variant whose keys do not stay alive because of the map.

## Before you start

- **Objects and property access** — `obj.key`, `obj[key]`, and the fact that property keys are strings. See [[b1-object-literals]] and [[b1-dot-vs-bracket]].
- **Object identity** — two object literals with the same contents are different values. See [[b1-objects-as-values]].
- **`for...of` and destructuring an array pair** — `for (const [k, v] of ...)`. See [[b1-for-of-in]] and [[b1-destructuring]].
- **Set** — helpful but not required; Map shares its equality rule and ordering. See [[b1-set]].

## The intuition

Picture a coat check. You hand over a coat and receive a ticket; later you present the ticket and get that coat back. The attendant does not search every hanger — the ticket leads directly to the right one. A Map is the coat check: `set(ticket, coat)` stores, `get(ticket)` retrieves.

With a plain object, every ticket must be a written label, a string. With a Map the ticket can be anything, including a particular physical object: "the coat that belongs to *this* person standing here". The analogy stops working in one respect: a Map hands back the stored value without removing it, and keeps it until you call `delete`.

## Creating a Map and the core API

`new Map()` creates an empty Map. To start with entries, pass an iterable of `[key, value]` pairs — most often an array of two-element arrays.

```javascript
const stock = new Map([
  ['apple', 12],
  ['pear', 0],
]);

stock.set('fig', 7).set('apple', 11);    // set returns the map; existing key is updated

console.log(stock.get('apple'), stock.get('kiwi'));
console.log(stock.has('pear'), stock.has('kiwi'));
console.log(stock.delete('pear'), stock.delete('pear'));
console.log(stock.size, stock);

stock.clear();
console.log(stock.size);
```

```output
11 undefined
true false
true false
2 Map(2) { 'apple' => 11, 'fig' => 7 }
0
```

| Member | What it does | Returns |
|---|---|---|
| `map.set(key, value)` | Adds the entry, or replaces the value if the key exists | The Map itself |
| `map.get(key)` | Looks up a key | The value, or `undefined` if absent |
| `map.has(key)` | Tests whether a key exists | `true` or `false` |
| `map.delete(key)` | Removes an entry | `true` if one was removed |
| `map.clear()` | Removes all entries | `undefined` |
| `map.size` | Number of entries (a property) | A number |

Passing something that is not a list of pairs is a common first error: `new Map([1, 2])` throws `TypeError: Iterator value 1 is not an entry object`, because each item must itself be a `[key, value]` pair.

### `get` cannot tell "missing" from "stored undefined"

`get` returns `undefined` for a key that is not present. It also returns `undefined` for a key whose stored value *is* `undefined`. When that difference matters, ask `has`.

```javascript
const answers = new Map([['q1', undefined]]);

console.log(answers.get('q1'), answers.get('q2'));
console.log(answers.has('q1'), answers.has('q2'));
```

```output
undefined undefined
true false
```

The same caution applies to falsy values. `if (map.get(key))` treats a stored `0`, `''` or `false` as missing. The counting example in the introduction used `?? 0` and not `|| 0` for that reason: `??` falls back only on `null` and `undefined` ([[b1-nullish-coalescing]]).

## Keys can be any value

An object converts every key to a string (or keeps it as a symbol). A Map stores the key exactly as given.

```javascript
const obj = {};
obj[1] = 'number';
obj['1'] = 'string';          // overwrites: same property key
obj[{ id: 7 }] = 'object';    // key becomes '[object Object]'
console.log(obj);

const map = new Map();
map.set(1, 'number').set('1', 'string').set(true, 'boolean');
console.log(map.get(1), map.get('1'), map.size);
```

```output
{ '1': 'string', '[object Object]': 'object' }
number string 3
```

A Map compares keys with **SameValueZero**, the same algorithm a Set uses for its values ([[b1-set]]). It behaves like `===` with one exception — `NaN` is equal to `NaN` — and it never coerces types. `0` and `-0` are the same key.

For object keys, equality is **identity**: the key matches only if it is the very same object.

```javascript
const ada = { id: 1 };
const lastSeen = new Map();

lastSeen.set(ada, '10:42');
lastSeen.set(NaN, 'not a number');

console.log(lastSeen.get(ada));
console.log(lastSeen.get({ id: 1 }));
console.log(lastSeen.get(NaN));
```

```output
10:42
undefined
not a number
```

`lastSeen.get({ id: 1 })` creates a new object, which has never been used as a key, so the result is `undefined`. This is the most common Map surprise. It is also what makes object keys useful: you can attach information to an object you do not own — a DOM element, a request object from a library — without adding properties to it.

> [!WARNING] Arrays and objects as composite keys
> `map.set([2, 3], 'cell')` followed by `map.get([2, 3])` returns `undefined`, because the two array literals are different objects. For a composite key, build a primitive: `map.set('2,3', 'cell')` or `` map.set(`${row}:${col}`, ...) ``. JavaScript has no built-in way to give a Map a custom equality function.

A Map holds a strong reference to every key and value. An object used as a key cannot be garbage collected while the Map is reachable, even if nothing else refers to it. When the Map is a long-lived cache keyed by short-lived objects, that is a memory leak; [[b1-weakmap]] exists to solve it.

## Order and iteration

A Map iterates its entries in **insertion order**: the order in which each key was first added. Setting a new value for an existing key keeps its position. Deleting a key and adding it again moves it to the end.

```javascript
const m = new Map([['a', 1], ['b', 2]]);

m.set('a', 9);                 // update in place
console.log([...m]);

m.delete('a');
m.set('a', 1);                 // re-inserted: now last
console.log([...m]);
```

```output
[ [ 'a', 9 ], [ 'b', 2 ] ]
[ [ 'b', 2 ], [ 'a', 1 ] ]
```

That "delete then set moves it to the end" behaviour is the basis of the classic least-recently-used cache built on a single Map ([[b1-impl-lru]]).

A Map is iterable, and each step yields a two-element array `[key, value]`. Destructuring in the loop header gives both names at once. There are also three methods that return iterators — `keys()`, `values()` and `entries()` — and a `forEach`.

```javascript
const prices = new Map([['tea', 3], ['cake', 5]]);

for (const [item, price] of prices) console.log(item, price);

console.log([...prices.keys()], [...prices.values()]);

prices.forEach((value, key) => console.log(key, value));

const total = [...prices.values()].reduce((sum, p) => sum + p, 0);
const cheap = new Map([...prices].filter(([, price]) => price < 4));
console.log(total, cheap);
```

```output
tea 3
cake 5
[ 'tea', 'cake' ] [ 3, 5 ]
tea 3
cake 5
8 Map(1) { 'tea' => 3 }
```

Iterating the Map directly is the same as iterating `prices.entries()`. Notice the argument order of `forEach`: the callback receives `(value, key, map)`, value first, to match `Array.prototype.forEach`'s `(element, index, array)`. Getting these backwards is easy.

`keys()`, `values()` and `entries()` return **iterators**, not arrays, so they have no `length` and no `filter` or `reduce` in ES2023 ([[b1-iterators]]). Spread them into an array first, as the last two lines do. Like a Set, a Map may be modified while it is being iterated: entries deleted before they are reached are skipped, and entries added are visited.

## Converting to and from objects, arrays and JSON

Because a Map is constructed from pairs and iterates as pairs, conversions are short.

```javascript
const settings = { theme: 'dark', fontSize: 14 };

const asMap = new Map(Object.entries(settings));     // object -> Map
const backToObject = Object.fromEntries(asMap);      // Map -> object
const asPairs = [...asMap];                          // Map -> array of pairs

console.log(asMap);
console.log(backToObject, asPairs);

console.log(JSON.stringify(asMap));
const json = JSON.stringify([...asMap]);
console.log(json, new Map(JSON.parse(json)).get('fontSize'));
```

```output
Map(2) { 'theme' => 'dark', 'fontSize' => 14 }
{ theme: 'dark', fontSize: 14 } [ [ 'theme', 'dark' ], [ 'fontSize', 14 ] ]
{}
[["theme","dark"],["fontSize",14]] 14
```

`JSON.stringify(map)` gives `'{}'`. JSON serialisation reads an object's own enumerable properties, and a Map's entries are not properties — they are in internal storage — so the data vanishes without an error ([[b1-json-unsupported]]). Serialise the array of pairs, as above; that form round-trips keys of any JSON type. `Object.fromEntries(map)` is fine when every key is a string, but it converts other keys to strings, so number and object keys do not survive. [[b1-structured-clone|`structuredClone`]] does copy Maps and Sets correctly, which is one reason to prefer it over a JSON round trip for cloning.

## How it works internally

The specification models a Map's contents as an internal list of key-value records called `[[MapData]]`, and requires only that access time be sublinear in the number of entries. Engines implement it as a **hash table**, the same structure described in [[b1-set]]: the key is hashed to choose a bucket, so `get`, `set`, `has` and `delete` take constant time on average however many entries exist ([[a1-hashmap]] covers hash tables in general).

V8's implementation keeps entries in an array in insertion order, with the buckets pointing into that array. Lookup uses the buckets; iteration walks the array. Strings hash by content and numbers by value. Objects receive a random identity hash the first time they are used as a key, which the engine stores with the object — it is not derived from the object's contents, which is why mutating a key object never breaks a lookup.

The methods themselves live on `Map.prototype` and operate on that internal storage. `size` is a getter there, not a stored property. This matters for one bug in particular: a Map is also an ordinary object, so you can assign properties to it, and doing so has nothing to do with its entries.

```javascript
const m = new Map();

m['color'] = 'red';           // creates a property on the object; not an entry
console.log(m.get('color'), m.has('color'), m.size);

m.set('color', 'blue');
console.log(m.get('color'), m.color);
```

```output
undefined false 0
blue red
```

> [!MISTAKE] Using bracket syntax on a Map
> `map[key] = value` and `map[key]` compile and run without error, and appear to work if you only ever use brackets, but you are using the Map as a plain object: keys are stringified, `size` stays `0`, and iteration yields nothing. Always use `set` and `get`.

## Worked example: counting, grouping and indexing

Three patterns account for most real uses of Map. All three appear in this program, which processes a list of orders.

```javascript title="orders.js"
const orders = [
  { id: 'o1', customer: 'ada', total: 40 },
  { id: 'o2', customer: 'lin', total: 15 },
  { id: 'o3', customer: 'ada', total: 25 },
  { id: 'o4', customer: 'sam', total: 60 },
];

// 1. Index: id -> order, for direct lookup
const byId = new Map(orders.map((o) => [o.id, o]));
console.log(byId.get('o3').total);

// 2. Count / accumulate: customer -> total spent
const spent = new Map();
for (const { customer, total } of orders) {
  spent.set(customer, (spent.get(customer) ?? 0) + total);
}
console.log(spent);

// 3. Group: customer -> list of order ids
const groups = new Map();
for (const { customer, id } of orders) {
  if (!groups.has(customer)) groups.set(customer, []);
  groups.get(customer).push(id);
}
console.log(groups);

// Highest spender: entries sorted by value
const [top] = [...spent].sort(([, a], [, b]) => b - a);
console.log(top);
```

```output
25
Map(3) { 'ada' => 65, 'lin' => 15, 'sam' => 60 }
Map(3) {
  'ada' => [ 'o1', 'o3' ],
  'lin' => [ 'o2' ],
  'sam' => [ 'o4' ]
}
[ 'ada', 65 ]
```

The **index** is built by mapping each order to a `[key, value]` pair and handing the array to the constructor. After that, finding an order by id is one `get` and not an `orders.find(...)` scan; this is the fix for the nested-loop "join" of two lists.

The **accumulator** reads the current value, substitutes `0` when the key is new, and writes the sum back. The **grouping** loop needs the list to exist before pushing, hence the `has` check. Note that `groups.get(customer).push(id)` mutates the array stored in the Map; no second `set` is needed, because the Map holds a reference to that array.

Grouping is common enough that ES2024 added `Map.groupBy(iterable, keyFn)`, available in Node.js 21 and current browsers, which returns a Map from each key to an array of the *items* with that key:

```javascript
const byParity = Map.groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even'));
console.log(byParity);
```

```output
Map(2) { 'odd' => [ 1, 3 ], 'even' => [ 2, 4 ] }
```

A Map has no sort method. To order entries, spread them into an array, sort, and if needed build a new Map from the result — the new Map's insertion order is the sorted order.

## Map vs Object {#b1-map-vs-object}

A Map and a plain object can both associate keys with values, and before ES2015 objects did both jobs. They are designed for different things. An **object** is a *record*: a fixed, known set of named fields describing one thing, such as `{ id, name, email }`. A **Map** is a *dictionary*: an open-ended collection of entries whose keys are data, often not known when the code is written.

| | Object | Map |
|---|---|---|
| Key types | Strings and symbols only; other keys are converted to strings | Any value, compared by SameValueZero |
| Inherited keys | Has `toString`, `constructor`, `__proto__` and others via the prototype | None; starts empty |
| Entry count | `Object.keys(obj).length`, O(n) | `map.size`, O(1) |
| Order | Integer-like keys ascending first, then strings in insertion order | Insertion order for all keys |
| Iteration | `Object.keys/values/entries`, `for...in` | Directly iterable; `keys/values/entries/forEach` |
| Syntax | Literals, `obj.key`, destructuring, spread | `new Map()`, `get`/`set` |
| JSON | Native | Must convert |
| Frequent add and delete | Can deoptimise the object | Designed for it |

Three of these rows cause actual bugs.

**Inherited and special keys.** The introduction showed `counts['constructor']` finding an inherited function. When keys come from user input, the key `__proto__` is worse: assigning to it does not create an entry at all, it changes the object's prototype.

```javascript
const fromUser = '__proto__';

const obj = {};
obj[fromUser] = { admin: true };
console.log(Object.keys(obj), obj.admin);

const map = new Map();
map.set(fromUser, { admin: true });
console.log([...map.keys()], map.get('admin'));
```

```output
[] true
[ '__proto__' ] undefined
```

The object ends up with no own keys and an `admin` property it inherited — the mechanism behind [[b1-prototype-pollution|prototype pollution]] attacks. The Map stores `'__proto__'` as an ordinary string key. An object created with `Object.create(null)` has no prototype and avoids the problem too ([[b1-object-create]]), but a Map is the more direct tool.

**Key order.** Objects do not iterate in pure insertion order. Keys that look like non-negative integers come first, in ascending numeric order; other string keys follow in insertion order.

```javascript
const obj = { b: 1, 2: 1, a: 1, 1: 1 };
const map = new Map([['b', 1], [2, 1], ['a', 1], [1, 1]]);

console.log(Object.keys(obj));
console.log([...map.keys()]);
```

```output
[ '1', '2', 'b', 'a' ]
[ 'b', 2, 'a', 1 ]
```

If you key a dictionary by numeric id and rely on the order in which entries were added — a list of recently viewed items, for example — an object silently reorders them and also turns the ids into strings. A Map keeps both the order and the type.

**Looping.** `for...in` walks enumerable *properties*, and a Map's entries are not properties, so `for (const k in map)` runs zero times. Use `for...of`. Conversely, `for...of` on a plain object throws, because plain objects are not iterable.

On performance: engines optimise objects whose set of properties is stable, giving each "shape" a compact layout ([[b1-hidden-classes]]). An object that gains and loses many arbitrary keys falls back to a slower dictionary representation, and `delete` in particular is costly. A Map is a hash table from the start and handles frequent insertion and removal well. In a rough test on Node.js 22, adding and then deleting one million string keys took noticeably longer with an object than with a Map; exact numbers depend on the engine and the keys, so measure before optimising. For small, fixed records, property access on an object is the fastest thing the engine does.

**Use an object** when the keys are known in the source code, the value is one "thing" with fields, you want literal syntax, destructuring or JSON, or you are passing options to a function. **Use a Map** when keys are computed or come from data, when keys are not strings, when you add and remove entries often, when you need `size` or guaranteed insertion order, or when keys come from untrusted input.

> [!TIP] A quick test
> Would you ever write the keys as identifiers after a dot — `thing.name`, `thing.price`? Then it is a record: use an object. Are the keys values you loop over or receive at run time — ids, words, URLs? Then it is a dictionary: use a Map.

```quiz
Q: What does this log? `const m = new Map(); m.set({ id: 1 }, 'a'); console.log(m.get({ id: 1 }), m.size);`
- [ ] `a 1`
- [x] `undefined 1`
- [ ] `undefined 0`
- [ ] It throws, because objects cannot be Map keys
> Objects are valid keys and the entry is stored, so `size` is 1. But keys are compared by identity, and the object literal in `get` is a new object, not the one used in `set`. Keep a reference to the key object, or use a primitive such as the id as the key.

Q: `const m = new Map(); m['x'] = 1;` What are `m.size` and `m.get('x')`?
- [ ] `1` and `1`
- [ ] `1` and `undefined`
- [x] `0` and `undefined`
- [ ] The assignment throws a TypeError
> Bracket assignment creates an ordinary property on the Map object. It does not touch the Map's internal entries, so `size` is 0 and `get('x')` finds nothing. Entries are only created by `set` (or the constructor).

Q: You need a dictionary whose keys are numeric ids typed by users, iterated in the order entries were added. Which statement is correct?
- [ ] An object works identically, since objects keep insertion order
- [x] A Map is the right choice: an object would sort integer-like keys numerically and convert them to strings
- [ ] Neither preserves order; an array of pairs is required
- [ ] A Map sorts numeric keys ascending, so an object is needed
> Objects list integer-like keys first in ascending order regardless of insertion order, and store them as strings. A Map keeps insertion order for every key and keeps `1` distinct from `'1'`. A Map also has no special keys such as `__proto__`.

Q: Why is `map.has(key)` sometimes needed when `map.get(key)` already returns `undefined` for missing keys?
- [ ] `get` throws for missing keys in strict mode
- [ ] `has` is faster than `get`
- [x] A key can be present with the value `undefined`, and `get` alone cannot distinguish that from an absent key
- [ ] `get` only works for string keys
> `undefined` is a legal value to store. `get` returns `undefined` in both cases, so only `has` tells you whether the key exists. The same caution applies to truthiness checks, which also treat stored `0`, `''` and `false` as missing.
```

## In real systems

**Caches and memoisation.** A function's results are stored in a Map keyed by its argument, so repeated calls are a lookup ([[b1-memoization]]). Request-deduplication layers keep a Map from URL to the in-flight promise so that two components asking for the same data share one network call.

**Normalised client state.** Data fetched as arrays is often indexed into a Map by id so that updating one entity is a single `set` and not a search. In React such a Map must be replaced, not mutated — `new Map(prev).set(id, value)` — or the change is not detected ([[b4-state-immutability]]).

**Registries.** Event emitters keep a Map from event name to a Set of listeners ([[b1-impl-event-emitter]]); routers map paths to handlers; dependency-injection containers map tokens (often classes, which is only possible because keys can be any value) to instances.

**Metadata on objects you do not own.** Libraries associate data with DOM elements or caller-supplied objects by using them as keys. When those objects have their own lifetime, the right structure is [[b1-weakmap]], so the association does not keep them alive.

## Trade-offs and alternatives

A Map gives up the conveniences of object syntax: no literal, no dot access, no destructuring, no spread into another Map, no direct JSON. For static shapes this makes code noisier with no benefit. TypeScript also describes records and Maps differently (`Record<string, T>` versus `Map<K, V>`), and API payloads are objects, so data usually arrives as objects and is converted when a Map is wanted.

A Map cannot be given custom key equality or a custom hash function, and it has no sorted variant: Java's `TreeMap` ([[a1-treemap]]) has no built-in JavaScript equivalent, so sorted iteration means sorting the entries yourself. A Map never evicts anything on its own; a cache built on one needs an explicit size or age limit. When keys are objects whose lifetime should not be extended, use a WeakMap. When there are only keys and no values, use a [[b1-set|Set]].

## Common mistakes

**Brackets or dot access on a Map.** `map.key` and `map[key]` read and write properties, not entries. Use `get` and `set`.

**Expecting look-alike object keys to match.** `map.get({ id: 1 })` and `map.get([1, 2])` never match a previously stored literal. Use a primitive key.

**Truthiness checks on `get`.** `if (map.get(k))` fails for stored `0`, `''`, `false`. Use `has`, or compare with `undefined` when `undefined` is never stored.

**Swapping `forEach` arguments.** The callback is `(value, key)`, the reverse of the `[key, value]` order used everywhere else.

**Serialising a Map directly.** `JSON.stringify(map)` is `'{}'`. Serialise `[...map]` or `Object.fromEntries(map)`.

**Calling array methods on `keys()` or `values()`.** They are iterators. Spread them first: `[...map.values()].filter(...)`.

**Letting a cache Map grow forever.** Every entry is strongly held. Bound the size, expire entries, or use a WeakMap when keys are objects ([[b1-memory-leaks]]).

## Interview perspective

Map questions test whether you understand the differences from objects precisely, and whether you recognise problems that become linear with a hash lookup.

> [!INTERVIEW] What a strong answer sounds like
> "An object is for records with known string keys; a Map is a dictionary. Map keys can be any type and are compared with SameValueZero, so objects are keys by identity. It keeps insertion order, has an O(1) `size`, has no inherited keys like `constructor` or `__proto__`, and is built for frequent adds and deletes. The costs are no literal syntax and no JSON support."

Questions to prepare:

- **Map versus object — when would you use each?** Give the record/dictionary distinction and two concrete differences: key types and inherited keys.
- **How are keys compared?** SameValueZero; `NaN` works as a key; objects by reference.
- **What order does a Map iterate in? An object?** Insertion order; objects put integer-like keys first in ascending order.
- **Count character frequencies / find the first non-repeating character.** A Map from character to count, then a second pass in order.
- **Two-sum.** A Map from value to index, checking for the complement as you go: O(n).
- **Group anagrams.** A Map keyed by the sorted letters of each word.
- **Implement an LRU cache.** One Map; on access, `delete` then `set` to move the key to the end; evict `map.keys().next().value`, the oldest.
- **Map versus WeakMap.** WeakMap keys must be objects, are not kept alive by the map, and cannot be enumerated ([[b1-weakmap]]).

## Practice

1. Write `wordFrequency(text)` that returns a Map from lower-cased word to count, then print the three most frequent words.
2. Write `indexBy(items, keyFn)` returning a Map, and use it to join an array of orders to an array of customers in O(n + m).
3. Write `invert(map)` that returns a new Map from value to key. What happens when two keys share a value?
4. Write `mapToJSON(map)` and `jsonToMap(text)` that round-trip a Map whose keys are numbers and strings, preserving key types.
5. Without running it, predict `Object.keys({ 10: 'a', 9: 'b', x: 'c' })` and `[...new Map([[10, 'a'], [9, 'b'], ['x', 'c']]).keys()]`, then check.

## Quick revision {#quick-revision}

- `new Map([[k, v], ...])`; `set` (chainable, updates in place), `get`, `has`, `delete` (boolean), `clear`, `size` property.
- Keys can be any value and are compared with SameValueZero: no coercion, `NaN` matches `NaN`, objects by identity.
- `get` returns `undefined` for a missing key *and* for a stored `undefined`; use `has` to tell them apart.
- Iteration is in insertion order; updating a key keeps its place; delete-then-set moves it to the end.
- `for (const [k, v] of map)`; `keys()`, `values()`, `entries()` return iterators; `forEach((value, key) => ...)`.
- Object → Map: `new Map(Object.entries(obj))`. Map → object: `Object.fromEntries(map)` (keys become strings).
- `JSON.stringify(map)` is `'{}'`; serialise `[...map]`.
- `map[key] = v` sets a property, not an entry.
- Patterns: index by id, count with `(map.get(k) ?? 0) + 1`, group with `Map.groupBy` (ES2024) or `has`/`set`/`push`.
- Object for fixed records and JSON; Map for dynamic, non-string, untrusted or frequently changing keys.
- Objects order integer-like keys first and inherit keys such as `constructor`; Maps do neither.

## Key takeaways {#key-takeaways}

- A Map is a real dictionary: any key type, no inherited keys, insertion order, and a constant-time `size`.
- Object keys in a Map match by identity, so keep the reference or use a primitive key.
- Use `set` and `get`, never bracket syntax, and use `has` when a stored value might be `undefined` or falsy.
- Indexing, counting and grouping with a Map replace nested scans with constant-time lookups.
- Convert explicitly for JSON, and copy the Map when it is held in immutable UI state.
- Choose an object for a record whose fields you name in code, and a Map for a collection whose keys are data.
