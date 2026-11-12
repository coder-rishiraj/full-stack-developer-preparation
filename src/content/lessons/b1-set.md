---
summary: A Set is a collection that holds each value at most once and can answer "is this value in here?" without scanning. You will learn how Set decides that two values are the same, how it keeps insertion order while still looking values up quickly, and when to choose it over an array.
difficulty: beginner
minutes: 40
objectives:
  - Create a Set and use add, has, delete, clear and size correctly
  - Explain how SameValueZero decides uniqueness, including NaN, zero and object identity
  - Iterate a Set and predict the order, including when it is modified during the loop
  - Implement union, intersection and difference, with the ES2025 methods and without them
  - Choose between a Set and an array for a given problem and convert between them
---

## Introduction

A chat application keeps a list of the user ids that are currently online. Two questions come up constantly: "is user 4812 online?" and "add user 4812, but not if they are already there". With an array, both questions need a scan:

```javascript
const online = [1007, 2231, 4812];

if (!online.includes(4812)) online.push(4812);   // scan, then maybe push
console.log(online.includes(9000));              // scan the whole array
```

```output
false
```

`includes` looks at the elements one by one, so its cost grows with the array. With fifty users that is unnoticeable. With fifty thousand users and a check on every incoming message, it becomes the slowest thing in the program. The "add only if absent" rule is also something you must remember to write every time; forget it once and the same user appears twice.

A **Set** is a built-in collection designed for exactly these two questions. It stores each value **at most once**, and it can test membership in roughly constant time however large it grows. It was added to JavaScript in ES2015 (ES6), and every current browser and Node.js version supports it.

```javascript
const online = new Set([1007, 2231, 4812]);

online.add(4812);                 // already present: nothing changes
console.log(online.size);
console.log(online.has(9000));
```

```output
3
false
```

This lesson covers the Set API, the precise rule a Set uses to decide that two values are "the same", how iteration order works, the set-algebra operations, and a detailed comparison with arrays. Its key-value sibling is [[b1-map]]; the variants that do not keep their contents alive are [[b1-weakset]] and [[b1-weakmap]].

## Before you start

- **Arrays** — creating them, `push`, and searching with `includes`. See [[b1-array-basics]] and [[b1-array-search]].
- **Primitive values versus objects** — two object literals that look alike are still two different objects. See [[b1-primitive-vs-reference]] and [[b1-objects-as-values]].
- **`for...of`** — the loop that walks any iterable. See [[b1-for-of-in]].
- **Equality** — what `===` does, and why `NaN === NaN` is `false`. See [[b1-equality]].

## The intuition

Think of the guest list at a venue door. The doorman has a list of names; each name appears once. When someone arrives, the doorman does not read the list from the top — the names are filed so that he can jump straight to where a name would be and see whether it is there. Adding a guest who is already listed changes nothing.

That is a Set: a collection whose only questions are "is this in?" and "what is in?". It has no notion of "the third element" and no notion of "how many times". The analogy stops in one place: a Set does remember the order in which values were first added, and iterating gives them back in that order. It is ordered for *iteration*, but not *indexed*.

## Creating a Set and the core API

`new Set()` creates an empty Set. `new Set(iterable)` creates one and adds every value the iterable produces, so you can pass an array, a string, another Set, or anything else that works with `for...of`.

```javascript
const empty = new Set();
const fromArray = new Set([3, 1, 3, 2, 1]);
const fromString = new Set('hello');

console.log(empty.size);
console.log(fromArray);
console.log(fromString);
```

```output
0
Set(3) { 3, 1, 2 }
Set(4) { 'h', 'e', 'l', 'o' }
```

The array had five elements but the Set has three, because the second `3` and the second `1` were already present. A string is iterable character by character, so `new Set('hello')` is a Set of four characters, not a Set containing one string. If you want the latter, wrap it: `new Set(['hello'])`. A common slip is `new Set(5)` or `new Set({ a: 1 })`; numbers and plain objects are not iterable, so both throw a `TypeError`.

The whole API is small:

| Member | What it does | Returns |
|---|---|---|
| `set.add(value)` | Adds `value` if it is not already present | The Set itself |
| `set.has(value)` | Tests membership | `true` or `false` |
| `set.delete(value)` | Removes `value` if present | `true` if something was removed |
| `set.clear()` | Removes everything | `undefined` |
| `set.size` | Number of values (a property, not a method) | A number |

```javascript
const tags = new Set();

tags.add('js').add('css').add('js');   // add returns the set, so calls chain
console.log(tags.size);
console.log(tags.has('css'), tags.has('html'));

console.log(tags.delete('css'), tags.delete('css'));
console.log(tags.size, tags.length);

tags.clear();
console.log(tags.size);
```

```output
2
true false
true false
1 undefined
0
```

Three details in that output are worth noticing. `add` returns the Set, which is why the calls chain; the third `add('js')` was ignored without any error. `delete` reports whether it removed something, so the second `delete('css')` returns `false`. And a Set has `size`, not `length` — `tags.length` is `undefined`, which is a frequent bug when code written for arrays is switched to a Set. There is also no index access: `tags[0]` is `undefined`, because a Set's values are not stored as properties.

## How a Set decides two values are the same

Uniqueness needs a definition of "same". A Set uses an algorithm the specification calls **SameValueZero**. For almost every value it agrees with `===`. It differs in exactly one case: `NaN` is considered the same as `NaN`.

```javascript
const s = new Set();

s.add(NaN).add(NaN);
s.add(0).add(-0);
s.add(1).add('1');
s.add(undefined).add(null);

console.log(s);
console.log(s.has(NaN), [NaN].indexOf(NaN));
```

```output
Set(6) { NaN, 0, 1, '1', undefined, null }
true -1
```

`NaN === NaN` is `false` ([[b1-nan-infinity]]), so a Set that used `===` could collect an unlimited number of `NaN`s and never find any of them. SameValueZero fixes that: one `NaN`, and `has(NaN)` is `true`. (`Array.prototype.includes` uses the same algorithm; the older `indexOf` uses `===`, which is why it returns `-1` above.)

Positive and negative zero count as the same value — that is the "Zero" in the name, and it is the one difference from [[b1-object-is|`Object.is`]], which treats them as different. The Set stores `+0` whichever one you add. There is **no type coercion**: the number `1` and the string `'1'` are different values, as are `undefined` and `null`.

### Objects are compared by identity

For objects, arrays and functions, "the same value" means **the same object in memory**, not "an object with equal contents".

```javascript
const point = { x: 1 };
const s = new Set();

s.add(point);
s.add(point);            // the same object again: ignored
s.add({ x: 1 });         // a different object that looks identical: added

console.log(s.size);
console.log(s.has(point), s.has({ x: 1 }));

point.x = 99;            // mutating an object does not affect membership
console.log(s.has(point));
```

```output
2
true false
true
```

`s.has({ x: 1 })` is `false` because the literal creates a brand-new object, which cannot already be in the Set. This follows directly from how object values work ([[b1-objects-as-values]]), and it has two practical consequences.

> [!MISTAKE] Deduplicating objects with a Set
> `[...new Set(users)]` removes nothing when `users` holds separate objects for the same person, because every object is a distinct value. Deduplicate by a primitive key instead — for example, keep a `Set` of ids you have seen, or build a `Map` from id to object (shown in [[b1-map]]).

The second consequence is a benefit: because membership depends on identity and not on contents, mutating an object after adding it never "loses" it inside the Set. Readers who know Java's `HashSet` ([[a1-hashset]]) will recognise this as a hazard that JavaScript does not have — there is no `equals`/`hashCode` to override, and so no way to customise equality either.

## Iterating a Set

A Set is iterable, and it produces its values in **insertion order** — the order in which each value was first added. This is guaranteed by the specification, not an implementation accident.

```javascript
const s = new Set(['b', 'a', 'c']);
s.add('a');              // already present: its position does not change
s.delete('b');
s.add('b');              // deleted and re-added: now last

for (const value of s) console.log(value);

s.forEach((value, alsoValue, set) => {
  console.log(value === alsoValue, set === s);
});

console.log([...s.entries()]);
```

```output
a
c
b
true true
true true
true true
[ [ 'a', 'a' ], [ 'c', 'c' ], [ 'b', 'b' ] ]
```

Re-adding an existing value does not move it; deleting and adding again puts it at the end. The odd-looking parts of this output exist for symmetry with `Map`. A Set has `keys()`, `values()` and `entries()` so that code written for either collection works on both, but a Set has no keys, so `keys()` is the very same function as `values()`, `entries()` yields `[value, value]` pairs, and the `forEach` callback receives the value twice. In practice you use `for...of` on the Set directly, which calls `values()`.

A Set has none of the array methods — no `map`, `filter`, `reduce` or `sort`. To use them, convert first with spread ([[b1-spread-rest]]) or `Array.from`, then convert back if you need a Set again:

```javascript
const prices = new Set([30, 10, 20]);

const doubled = new Set([...prices].map((p) => p * 2));
const sorted = [...prices].sort((a, b) => a - b);

console.log(doubled, sorted);
```

```output
Set(3) { 60, 20, 40 } [ 10, 20, 30 ]
```

### Modifying a Set while iterating it

Unlike some languages, JavaScript defines exactly what happens if a Set changes during a loop over it. A value deleted before the loop reaches it is skipped; a value added during the loop is visited, because it is appended to the end.

```javascript
const s = new Set([1, 2, 3]);

for (const v of s) {
  if (v === 1) {
    s.delete(2);
    s.add(4);
  }
  console.log(v);
}
```

```output
1
3
4
```

This makes a Set usable as a simple work queue — keep adding items as you discover them — but it also means a loop that adds a *new* value on every iteration never ends.

## Set algebra: union, intersection, difference

Combining two Sets is common: the tags on either of two posts (union), the users in both of two groups (intersection), the permissions a role has that another lacks (difference). ES2025 added methods for these. They are available in Node.js 22 and in Chrome 122, Firefox 127 and Safari 17 or later; each returns a **new** Set and leaves both inputs unchanged.

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);

console.log(a.union(b));
console.log(a.intersection(b));
console.log(a.difference(b));
console.log(a.symmetricDifference(b));
console.log(new Set([3]).isSubsetOf(a), a.isSupersetOf(b), a.isDisjointFrom(b));
```

```output
Set(4) { 1, 2, 3, 4 }
Set(1) { 3 }
Set(2) { 1, 2 }
Set(3) { 1, 2, 4 }
true false false
```

`symmetricDifference` is "in exactly one of the two". `isSubsetOf` asks whether every value of the receiver is in the argument, `isSupersetOf` asks the reverse, and `isDisjointFrom` asks whether they share nothing.

If you must support older environments, or you are asked to write these in an interview, each is one line built from spread, `filter` and `has`:

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);

const union = new Set([...a, ...b]);
const intersection = new Set([...a].filter((x) => b.has(x)));
const difference = new Set([...a].filter((x) => !b.has(x)));

console.log(union, intersection, difference);
```

```output
Set(4) { 1, 2, 3, 4 } Set(1) { 3 } Set(2) { 1, 2 }
```

The reason these are efficient is the `b.has(x)` call. Each lookup is constant time on average, so intersecting takes time proportional to the size of `a`. The same logic written with two arrays and `includes` compares every element of one against every element of the other.

## How it works internally

The specification describes a Set's contents as an internal list called `[[SetData]]` and only requires that lookups take time that is *sublinear* in the number of elements. Engines meet that requirement with a **hash table**.

A hash table turns a value into a number (its **hash**), uses that number to choose a bucket, and looks only in that bucket. The cost therefore does not depend on how many values are stored, which is where "O(1) on average" comes from ([[a1-big-o]] explains the notation). Strings are hashed from their characters and numbers from their value. An object has no contents-based hash; V8 assigns each object a random identity hash the first time it is used as a Set value or Map key and remembers it, which is consistent with objects being compared by identity.

A plain hash table has no meaningful order, yet a Set must iterate in insertion order. V8 solves this with an ordered hash table: the entries are stored in an array in the order they were inserted, and the buckets hold positions in that array. Lookup goes through the buckets; iteration walks the entry array. Deleting marks an entry as removed rather than shifting everything, and the table is rebuilt compactly when enough entries have been removed or it needs to grow. That design is also why modifying a Set during iteration is well defined — the iterator is a position in the entry array.

"Constant time" hides a constant. Hashing a value and probing a bucket costs more than one array element comparison, so for a handful of elements an array scan is as fast or faster. The Set wins once the collection is large or the lookups are frequent.

## Worked example: unique visitors and first-seen order

A log of page views contains repeated visitor ids. We want the unique visitors in the order they first appeared, the visitors who returned at least once, and a count.

```javascript title="visitors.js"
const views = ['u7', 'u2', 'u7', 'u9', 'u2', 'u7', 'u4'];

const seen = new Set();
const returning = new Set();

for (const id of views) {
  if (seen.has(id)) {
    returning.add(id);     // second or later view
  } else {
    seen.add(id);
  }
}

console.log([...seen]);
console.log([...returning]);
console.log(`${seen.size} unique, ${returning.size} returning`);
console.log([...seen].filter((id) => !returning.has(id)));
```

```output
[ 'u7', 'u2', 'u9', 'u4' ]
[ 'u7', 'u2' ]
4 unique, 2 returning
[ 'u9', 'u4' ]
```

The loop makes one pass over the log, and every `has` and `add` is constant time, so the whole thing is O(n). `seen` keeps first-appearance order for free. `returning.add(id)` runs twice for `u7` (its second and third views) but stores it once, so no "is it already there?" check is needed. The final line is a set difference computed with `filter`. Writing the same program with arrays would put an `includes` scan inside the loop, making it O(n²).

## Set vs Array {#b1-set-vs-array}

A Set and an array are both ordered collections of values, and beginners often treat them as interchangeable. They answer different questions. An **array** is a numbered sequence: positions matter, duplicates are allowed, and you can ask for "the element at index 3". A **Set** is a collection of distinct values: the only thing that matters about a value is whether it is in or out.

| | Array | Set |
|---|---|---|
| Duplicates | Allowed | Never; adding again is a no-op |
| Access by position | `arr[i]`, O(1) | Not available |
| Membership test | `includes`, O(n) | `has`, O(1) average |
| Remove a given value | `indexOf` + `splice`, O(n) | `delete`, O(1) average |
| Order | By index; can be reordered and sorted | Insertion order only |
| Count | `length` | `size` |
| Transform methods | `map`, `filter`, `reduce`, `sort` and more | `forEach` only; convert to an array first |
| `JSON.stringify` | `[1,2]` | `{}` |
| Literal syntax | `[1, 2]` | None; `new Set([1, 2])` |

**Choose a Set** when the question is membership or uniqueness: ids already processed, selected rows in a table, visited nodes in a graph search, a list of allowed values to validate against. **Choose an array** when position or repetition carries meaning: items in a shopping cart where the same product can appear twice, a list rendered in a sortable order, a stack or queue, anything you index into or send as JSON.

Converting between them is cheap to write, which is why the two are often combined:

```javascript
const scores = [70, 85, 70, 92, 85];

const unique = [...new Set(scores)];                 // dedupe, keep first-seen order
const fromSet = Array.from(new Set(scores), (s) => s / 10);

const passing = new Set([85, 92]);
const kept = scores.filter((s) => passing.has(s));   // array order, set lookup

console.log(unique, fromSet, kept);
console.log(JSON.stringify(new Set(scores)), JSON.stringify(unique));
```

```output
[ 70, 85, 92 ] [ 7, 8.5, 9.2 ] [ 85, 92, 85 ]
{} [70,85,92]
```

`[...new Set(arr)]` is the standard way to remove duplicates from an array of primitives. It keeps the first occurrence of each value in its original position, and it is O(n). `Array.from` does the same conversion and accepts a mapping function as its second argument ([[b1-array-from-isarray]]). The `filter` line shows the most useful combination: keep the data in an array because its order and duplicates matter, and build a Set from the *other* list because it is only consulted for membership.

The last line is a real source of bugs. `JSON.stringify` serialises an object's own enumerable properties, and a Set has none — its values live in internal storage — so the result is `{}` and the data silently disappears ([[b1-json-unsupported]]). Convert to an array before serialising, and rebuild with `new Set(array)` after parsing.

> [!TIP] The rule of thumb
> If your code calls `includes`, `indexOf` or `find` on the same array inside a loop, build a Set (or a Map) from that array once, before the loop, and call `has` instead.

Two cautions keep this rule honest. Building a Set costs O(n) time and extra memory, so for a single lookup in a small array the conversion is slower than one `includes`. And a Set cannot replace an array where duplicates are data: converting a cart of `['pen', 'pen', 'ink']` to a Set loses the fact that there are two pens.

```quiz
Q: What does `new Set([1, '1', NaN, NaN, {}, {}]).size` evaluate to?
- [ ] 3
- [ ] 4
- [x] 5
- [ ] 6
> `1` and `'1'` are different values because a Set never coerces types. The two `NaN`s count as one under SameValueZero. The two `{}` literals are two separate objects, and objects are compared by identity, so both are kept: 1, '1', NaN, {}, {} gives 5.

Q: `const s = new Set(['a', 'b']); s.add('a');` What does `[...s]` contain?
- [x] `['a', 'b']`
- [ ] `['b', 'a']`
- [ ] `['a', 'b', 'a']`
- [ ] It throws, because `'a'` is already present
> Adding a value that is already present does nothing: it does not throw, does not create a duplicate, and does not move the value to the end. Only deleting and re-adding changes a value's position.

Q: An array of 100,000 product ids is checked with `includes` for each of 100,000 incoming orders. What is the most effective fix?
- [ ] Sort the array first so `includes` is faster
- [x] Build a Set from the ids once and call `has` for each order
- [ ] Replace `includes` with `indexOf`
- [ ] Use `for...of` instead of `includes`
> `includes` and `indexOf` both scan, and neither takes advantage of sorted order, so each check stays O(n) and the total is about 10 billion comparisons. A Set costs O(n) to build once and then each `has` is O(1) on average.

Q: Why does `JSON.stringify(new Set([1, 2]))` produce `'{}'`?
- [ ] Sets cannot contain numbers when serialised
- [ ] JSON has a set type that is written as `{}`
- [x] The values are held in internal storage, not as enumerable properties, so there is nothing for JSON to serialise
- [ ] `JSON.stringify` throws and returns an empty object
> JSON serialisation walks an object's own enumerable properties. A Set object has none; its contents are in an internal slot. Spread it into an array first: `JSON.stringify([...set])`.
```

## In real systems

**Selection state in user interfaces.** A table with checkboxes usually stores the selected row ids in a Set: `has(id)` decides whether a row renders as checked, and toggling is `add` or `delete`. In React the state must be replaced, not mutated, so an update looks like `setSelected((prev) => new Set(prev).add(id))` — copy, then change the copy ([[b4-state-immutability]]).

**Graph and tree traversal.** Breadth-first and depth-first searches keep a `visited` Set so that each node is processed once and cycles do not cause infinite loops. When the nodes are objects that should not be kept alive by the bookkeeping, [[b1-weakset]] is the variant to use.

**Validation and feature flags.** `const ALLOWED = new Set(['png', 'jpg', 'webp'])` followed by `ALLOWED.has(ext)` reads as what it means and stays fast as the list grows.

**Deduplicating events.** Message consumers often receive the same message more than once. Keeping a Set of processed message ids makes the handler idempotent. In a long-running process such a Set grows without bound unless ids are removed, which is a classic memory leak ([[b1-memory-leaks]]).

## Trade-offs and alternatives

A Set costs more memory per element than an array — it stores a hash table as well as the values — and it gives up indexing, sorting and the array methods. Equality cannot be customised: there is no way to make a Set treat `{ id: 1 }` and another `{ id: 1 }` as equal. The usual workarounds are to store a primitive key (`user.id`, or a string such as `` `${x},${y}` `` for a coordinate pair) or to use a `Map` keyed by that primitive.

A plain object used as a set (`seen[id] = true`) predates `Set` and still appears in old code. It only supports string keys, so `1` and `'1'` collide, and inherited names such as `constructor` can produce false positives unless the object is created with `Object.create(null)`. Prefer a Set. For membership of a very large range of small integers, a typed array or bit set is more compact, but that is a specialised optimisation.

## Common mistakes

**Using `length` or an index.** `set.length` and `set[0]` are both `undefined`, with no error. Use `set.size`, and `[...set][0]` or `set.values().next().value` for the first value.

**Expecting value equality for objects and arrays.** `new Set([[1, 2]]).has([1, 2])` is `false`. Store a primitive representation, or keep a reference to the original object.

**Passing a single value to the constructor.** `new Set('abc')` is a Set of three characters, and `new Set(42)` throws. The constructor takes an iterable *of values*.

**Serialising directly.** `JSON.stringify(set)` gives `{}`, and `localStorage.setItem('k', set)` stores the string `[object Set]`. Convert to an array first.

**Mutating a Set held in framework state.** Calling `add` on the existing Set keeps the same object identity, so React and similar libraries see no change and do not re-render. Create a new Set.

## Interview perspective

Interviewers use Set questions to check two things: that you know the equality rule precisely, and that you reach for a hash-based collection when a problem has a hidden nested loop.

> [!INTERVIEW] What a strong answer sounds like
> "A Set stores unique values compared with SameValueZero — like `===` except that `NaN` equals `NaN` — so objects are unique by reference. `has`, `add` and `delete` are O(1) on average because engines implement it as a hash table, and it iterates in insertion order. I'd use it for membership and deduplication, and an array when I need indexes, duplicates or JSON."

Questions to prepare:

- **Remove duplicates from an array.** `[...new Set(arr)]`; say that it is O(n), preserves first-occurrence order, and only works by identity for objects. Follow-up: dedupe objects by `id` — use a `Map` keyed by id, or a Set of seen ids with `filter`.
- **Why is `has` faster than `includes`?** Hash lookup versus linear scan; mention the constant factor for tiny collections.
- **How does a Set treat `NaN`, `0` and `-0`?** One `NaN`; `0` and `-0` are the same value.
- **Find the intersection of two arrays.** Build a Set from one and filter the other: O(n + m) instead of O(n·m).
- **Does a Set keep order?** Yes, insertion order, by specification.
- **Two-sum or "contains duplicate".** Both are single passes with a Set of values seen so far.
- **Set versus WeakSet.** A WeakSet holds only objects, does not keep them alive and cannot be iterated ([[b1-weakset]]).

## Practice

1. Write `hasDuplicates(arr)` that returns `true` if any value occurs twice, stopping at the first repeat. Then write a one-line version that compares `size` with `length`, and say which is faster on a long array whose first two elements are equal.
2. Write `uniqueBy(items, keyFn)` that keeps the first item for each key, using a Set of seen keys.
3. Implement `isSubset(a, b)` for two Sets without the ES2025 methods.
4. Given two arrays of email addresses, return those that appear in exactly one of them, comparing case-insensitively.
5. Predict the output, then run it: `const s = new Set([1]); for (const v of s) { if (v < 3) s.add(v + 1); console.log(v); }`.

## Quick revision {#quick-revision}

- `new Set(iterable)` stores each value once; `add` (chainable), `has`, `delete` (returns a boolean), `clear`, and the `size` property.
- Equality is SameValueZero: like `===`, but `NaN` equals `NaN`; `0` and `-0` are the same; no type coercion.
- Objects, arrays and functions are unique by identity: `new Set([{}, {}]).size` is `2`.
- Iteration is in insertion order; re-adding does not move a value; values added during iteration are visited.
- No index access, no `length`, no `map`/`filter` — convert with `[...set]` or `Array.from(set)`.
- `has`/`add`/`delete` are O(1) on average (hash table); array `includes` is O(n).
- Dedupe primitives: `[...new Set(arr)]`. Intersection: `a.filter((x) => bSet.has(x))`.
- ES2025: `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`.
- `JSON.stringify(set)` is `'{}'` — serialise `[...set]`.
- Set for membership and uniqueness; array for position, duplicates, sorting and JSON.

## Key takeaways {#key-takeaways}

- A Set answers "is this value present?" in constant time on average and guarantees that no value is stored twice.
- "Same value" means SameValueZero: primitives by value with `NaN` equal to itself, objects by identity.
- A Set remembers insertion order but has no indexes; convert to an array when you need array methods.
- Replacing repeated `includes` calls with one Set and `has` turns many O(n²) loops into O(n).
- Convert a Set to an array before serialising it, and create a new Set instead of mutating one held in UI state.
- Use an array when order, position or duplicates are part of the data, and a Set when only membership is.
