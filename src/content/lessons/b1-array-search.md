---
summary: Searching an array means answering one of four questions — is it there, where is it, which element matches, or do any or all match. You will learn which method answers each question, the equality rule each one uses, what they return when nothing is found, and when a linear search should be replaced by a `Set` or `Map`.
difficulty: beginner
minutes: 45
objectives:
  - Choose between `includes`, `indexOf`, `find`, `findIndex`, `filter`, `some` and `every` from the question being asked
  - Explain the difference between strict equality and SameValueZero, and why `indexOf(NaN)` fails while `includes(NaN)` works
  - Explain why value-searching methods cannot find an equal-looking object, and use a predicate instead
  - Handle the "not found" results `-1`, `undefined` and `false` correctly, including the index-0 and ambiguous-`undefined` bugs
  - Predict the results of `some` and `every` on empty arrays and explain short-circuiting
  - Replace repeated linear searches with a `Set` or `Map` and state the complexity gain
---

## Introduction

A shopping cart needs to know whether a product is already in it before adding a second copy. A permissions check asks whether the user's roles contain `'admin'`. A form validator asks whether every field is filled in. A chat application looks up the message with a given id so it can mark it as read. All four are searches over an array, but they ask different questions and want different kinds of answers.

JavaScript provides a separate method for each kind of question:

| Question | Method | Answer |
|---|---|---|
| Is this value in the array? | `includes(value)` | `true` / `false` |
| At which index is this value? | `indexOf(value)`, `lastIndexOf(value)` | An index, or `-1` |
| Which element satisfies this condition? | `find(fn)`, `findLast(fn)` | The element, or `undefined` |
| At which index is the element that satisfies it? | `findIndex(fn)`, `findLastIndex(fn)` | An index, or `-1` |
| Which elements (plural) satisfy it? | `filter(fn)` | A new array, possibly empty |
| Does at least one element satisfy it? | `some(fn)` | `true` / `false` |
| Do all elements satisfy it? | `every(fn)` | `true` / `false` |

The methods split into two groups, and the split is the main idea of this lesson. The first two rows search **by value**: you hand over a value and the method compares it with each element using a built-in equality rule. The rest search **by predicate**: you hand over a function that returns true or false for an element, and *you* decide what counts as a match. Value search is right for primitives such as strings and numbers. Predicate search is the only thing that works for objects, because two separate objects are never equal to each other even when they look identical.

The nested sections [[b1-includes-indexof]] and [[b1-some-every]] cover the individual methods in depth and can be read on their own.

## Before you start

- **Array basics** — indexes, `length`, and the fact that arrays hold references to objects. See [[b1-array-basics]].
- **Equality** — what `===` does, and why `NaN === NaN` is `false`. See [[b1-strict-equality]] and [[b1-nan-infinity]].
- **References** — two object literals with the same contents are different objects. See [[b1-primitive-vs-reference]].
- **Callbacks and arrow functions** — passing a function such as `(u) => u.id === 2` to another function. See [[b1-callbacks-sync]] and [[b1-arrow-functions]].
- **Truthy and falsy values** — which values count as true in a condition. See [[b1-truthy-falsy]].

## The intuition

Searching an array is like looking for something in a row of lockers by opening them one at a time, starting from the left. There is no index card telling you where things are; the only strategy is to open locker 0, check, open locker 1, check, and continue until you find it or run out of lockers. This is **linear search**, and every method in this lesson works this way. If the thing you want is in the last locker, or is not there at all, you open every locker.

The methods differ in two respects. The first is *how you recognise a match*. With a value search you carry a sample and compare each locker's contents against it. With a predicate search you carry a checklist — "is it red and larger than a shoebox?" — and apply it to each locker's contents. The second is *what you report back*: yes or no, the locker number, or the item itself.

One limit of the picture: comparing against a sample works for primitive values, where "the same" means the same value. For objects, "the same" means *the very same object*, not a look-alike. A sample that merely resembles the object in the locker never matches.

## Searching by value: the equality rule

`indexOf`, `lastIndexOf` and `includes` each compare your value against the elements. `indexOf` and `lastIndexOf` use **strict equality**, the same comparison as `===`. `includes` uses a rule called **SameValueZero**, which is identical to `===` except for one case: it considers `NaN` equal to `NaN`.

```javascript title="equality-rules.js"
const values = [1, '2', NaN, 0];

console.log(values.indexOf(1), values.includes(1));
console.log(values.indexOf(2), values.includes(2));       // '2' is not 2
console.log(values.indexOf(NaN), values.includes(NaN));   // the difference
console.log(values.indexOf(-0), values.includes(-0));     // +0 and -0 match in both
```

```output
0 true
-1 false
-1 true
3 true
```

Neither rule converts types: the string `'2'` does not match the number `2`. This catches people who read a number from a form input (always a string) and search an array of numbers for it; convert first with `Number(input)`.

The third line is the reason `includes` exists. `NaN` is the one value that is not `===` to itself, so `indexOf(NaN)` can never find it. `includes`, added in ES2016, uses SameValueZero so that it can. The "Zero" in the name refers to the last line: positive and negative zero are treated as equal, as they are by `===`. (A third rule, `Object.is`, distinguishes `+0` from `-0`; no array search method uses it. See [[b1-object-is]].)

### Objects are matched by identity

For objects — including arrays and functions — both rules compare **references**. An element matches only if it is the same object you passed in.

```javascript title="object-identity.js"
const ada = { id: 1, name: 'Ada' };
const users = [ada, { id: 2, name: 'Lin' }];

console.log(users.includes(ada));                       // same object
console.log(users.includes({ id: 1, name: 'Ada' }));    // a look-alike
console.log(users.indexOf({ id: 2, name: 'Lin' }));

console.log(users.some((u) => u.id === 2));             // compare a field
console.log(users.find((u) => u.id === 2));

console.log([[1, 2]].includes([1, 2]));                 // arrays are objects too
```

```output
true
false
-1
true
{ id: 2, name: 'Lin' }
false
```

The object literal `{ id: 1, name: 'Ada' }` creates a brand-new object each time it is evaluated. It has the same contents as `ada` but is a different object, so no value search finds it. This is the single most common search bug with data from an API: every response creates new objects, so an object from one response is never `===` to an object from another.

The fix is to compare something that *is* a primitive — usually an id — inside a predicate. `some` answers "is there one?", `find` returns it, and `findIndex` returns its position.

## includes, indexOf and find {#b1-includes-indexof}

These are the everyday search methods. **`includes(value)`** tells you whether a value is present. **`indexOf(value)`** tells you where it first appears, or `-1` if it does not. **`find(predicate)`** returns the first element for which your function returns a truthy value, or `undefined` if none does; **`findIndex(predicate)`** returns that element's index, or `-1`. All of them scan from the left and stop at the first match.

### `includes`: is it there?

```javascript title="includes.js"
const roles = ['viewer', 'editor', 'admin'];

console.log(roles.includes('admin'), roles.includes('owner'));
console.log(roles.includes('Admin'));           // case-sensitive
console.log(roles.includes('viewer', 1));       // start searching at index 1
console.log(roles.includes('admin', -1));       // start one from the end

const status = 'archived';
if (['draft', 'archived', 'deleted'].includes(status)) {
  console.log('read-only');
}
```

```output
true false
false
false
true
read-only
```

`includes` returns a real boolean, which makes conditions read naturally. The last example is a common idiom: testing a variable against a short list of allowed values is clearer as `list.includes(x)` than as a chain of `x === 'a' || x === 'b' || x === 'c'`.

The optional second argument, **`fromIndex`**, is the index at which the search starts. A negative `fromIndex` counts from the end (`-1` means "start at the last element"); a `fromIndex` at or beyond `length` makes the search return `false` immediately without examining anything. Note that this argument is a starting position, not an end — `includes(x, 1)` skips index 0.

### `indexOf` and `lastIndexOf`: where is it?

```javascript title="index-of.js"
const letters = ['a', 'b', 'a', 'c', 'a'];

console.log(letters.indexOf('a'), letters.lastIndexOf('a'));
console.log(letters.indexOf('z'));
console.log(letters.indexOf('a', 1));           // first 'a' at or after index 1
console.log(letters.lastIndexOf('a', 3));       // last 'a' at or before index 3

const positions = [];
let at = letters.indexOf('a');
while (at !== -1) {
  positions.push(at);
  at = letters.indexOf('a', at + 1);            // continue after the last hit
}
console.log(positions);
```

```output
0 4
-1
2
2
[ 0, 2, 4 ]
```

`indexOf` searches forwards and returns the first matching index; `lastIndexOf` searches backwards and returns the last. For `lastIndexOf`, `fromIndex` is where the backward search *starts*. The loop shows the main use of `fromIndex`: finding every occurrence by restarting the search just after the previous hit.

The sentinel value `-1` is the source of a classic bug. `-1` is truthy and `0` is falsy, which is exactly backwards for a condition:

```javascript title="index-zero-bug.js"
const queue = ['urgent', 'normal'];

if (queue.indexOf('urgent')) {
  console.log('found');
} else {
  console.log('missed it: index 0 is falsy');
}

if (queue.indexOf('missing')) {
  console.log('wrongly "found": -1 is truthy');
}

console.log(queue.indexOf('urgent') !== -1, queue.includes('urgent'));
```

```output
missed it: index 0 is falsy
wrongly "found": -1 is truthy
true true
```

An item at index 0 is reported as absent and an absent item is reported as present. Always compare with `-1` explicitly — or, when you only need a yes or no, use `includes`, which cannot be misread. Use `indexOf` when you need the position itself, for example to remove the element with `splice` ([[b1-slice-splice]]). Older code contains `~arr.indexOf(x)`, a bitwise trick that turns `-1` into `0`; `includes` replaced it.

### `find` and `findIndex`: search with a predicate

A **predicate** is a function that takes an element and returns true or false. `find` calls your predicate on each element in order and returns the first element for which the result is truthy.

```javascript title="find.js"
const products = [
  { id: 10, name: 'Lamp', stock: 0 },
  { id: 11, name: 'Desk', stock: 4 },
  { id: 12, name: 'Chair', stock: 9 },
];

const inStock = products.find((p) => p.stock > 0);
console.log(inStock.name);
console.log(products.findIndex((p) => p.stock > 0));

console.log(products.find((p) => p.id === 99));
console.log(products.findIndex((p) => p.id === 99));

console.log(inStock === products[1]);            // the element itself, not a copy

console.log(products.findLast((p) => p.stock > 0).name);
console.log(products.findLastIndex((p) => p.stock > 0));
```

```output
Desk
1
undefined
-1
true
Chair
2
```

The predicate receives three arguments — `(element, index, array)` — though most predicates use only the first. `find` returns **the element itself**, not a copy: `inStock === products[1]`, so mutating `inStock` mutates the object inside the array. `find` stops as soon as the predicate returns a truthy value; later elements are never examined.

**`findLast`** and **`findLastIndex`** (ES2023, Node.js 18 and later) do the same from the right-hand end. They replace the older pattern of reversing a copy of the array and then calling `find`.

`find` returns only the first match. When you want **all** matches, use `filter`, which returns an array of every element that passes ([[b1-array-map-filter-reduce]]). A frequent slip is writing `filter(...)[0]` to get one item — it works, but it scans the entire array and builds a throwaway array, where `find` stops at the first hit.

### Handling "not found"

`find` signals "nothing matched" with `undefined`. Code that uses the result without checking fails on the next line:

```javascript title="not-found.js"
const users = [{ id: 1, name: 'Ada' }];

const user = users.find((u) => u.id === 5);
try {
  console.log(user.name);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}

console.log(user?.name ?? 'Unknown user');
```

```output
TypeError: Cannot read properties of undefined (reading 'name')
Unknown user
```

Either test the result (`if (!user) return;`) or use optional chaining and a default ([[b1-optional-chaining]], [[b1-nullish-coalescing]]).

There is a second, subtler problem. `undefined` is also what `find` returns when it *found* an element whose value is `undefined`. The two cases look the same:

```javascript title="ambiguous-undefined.js"
const readings = [3, undefined, 7];

console.log(readings.find((r) => r === undefined));        // found it
console.log(readings.find((r) => r === 99));               // found nothing
console.log(readings.findIndex((r) => r === undefined));   // 1: unambiguous
console.log(readings.findIndex((r) => r === 99));          // -1
```

```output
undefined
undefined
1
-1
```

When `undefined` can be a legitimate element, use `findIndex` and compare with `-1`; an index is never ambiguous.

### Choosing among them

| You have | You want | Use |
|---|---|---|
| A primitive value | Yes or no | `includes` |
| A primitive value | Its position | `indexOf` / `lastIndexOf` |
| A condition, or objects | The element | `find` / `findLast` |
| A condition, or objects | Its position (to replace or remove it) | `findIndex` / `findLastIndex` |
| A condition | Every matching element | `filter` |
| A condition | Yes or no | `some` |

```quiz
Q: `const list = [NaN, 5];` Which statement is true?
- [ ] `list.indexOf(NaN)` is `0` and `list.includes(NaN)` is `true`
- [x] `list.indexOf(NaN)` is `-1` and `list.includes(NaN)` is `true`
- [ ] Both report that `NaN` is absent, because `NaN` never equals anything
- [ ] `list.includes(NaN)` throws a `TypeError`
> `indexOf` compares with strict equality, and `NaN === NaN` is `false`, so it never matches. `includes` uses SameValueZero, which treats `NaN` as equal to itself. That difference is why `includes` was added in ES2016.

Q: A cart is `[{ id: 7, qty: 1 }]`. Why does `cart.includes({ id: 7, qty: 1 })` return `false`?
- [ ] `includes` does not work on arrays of objects at all
- [ ] The properties are compared in a different order
- [x] The argument is a new object, and objects are compared by reference, not by contents
- [ ] `includes` needs a second argument for objects
> Each object literal creates a distinct object. Value searches match an object only if it is the very same one. To match by contents, compare a primitive field in a predicate: `cart.some((item) => item.id === 7)`.

Q: What is wrong with `if (tags.indexOf('new')) { showBadge(); }`?
- [ ] `indexOf` cannot search for strings
- [x] It skips the badge when `'new'` is at index 0 and shows it when `'new'` is absent
- [ ] It throws when `tags` is empty
- [ ] Nothing; it is the recommended idiom
> `indexOf` returns `0` (falsy) for a match at the first position and `-1` (truthy) for no match. Write `tags.indexOf('new') !== -1`, or better, `tags.includes('new')`.
```

## some and every {#b1-some-every}

`some` and `every` answer yes-or-no questions about a whole array using a predicate. **`some(fn)`** returns `true` if the predicate returns a truthy value for **at least one** element. **`every(fn)`** returns `true` if it returns a truthy value for **all** elements. They are the array forms of the logical operators: `some` is a chain of `||` across the elements, and `every` is a chain of `&&`.

```javascript title="some-every.js"
const ages = [19, 34, 16, 52];

console.log(ages.some((age) => age < 18));     // is anyone a minor?
console.log(ages.every((age) => age >= 18));   // is everyone an adult?
console.log(ages.every((age) => age > 10));
console.log(ages.some((age) => age > 100));
```

```output
true
false
true
false
```

Both return a boolean, never an element. If you need *which* element passed, use `find`; if you need all of them, use `filter`.

### Short-circuiting

Like `||` and `&&` ([[b1-short-circuit]]), both methods stop as soon as the answer is known. `some` stops at the first truthy result, because one is enough. `every` stops at the first falsy result, because one failure settles it.

```javascript title="short-circuit.js"
const nums = [1, 2, 3, 4, 5];
const checked = [];

const anyEven = nums.some((n) => {
  checked.push(n);
  return n % 2 === 0;
});
console.log(anyEven, checked);

checked.length = 0;
const allSmall = nums.every((n) => {
  checked.push(n);
  return n < 3;
});
console.log(allSmall, checked);
```

```output
true [ 1, 2 ]
false [ 1, 2, 3 ]
```

`some` examined two elements and stopped at the first even number. `every` examined three and stopped at `3`, the first element that failed. This makes them efficient on long arrays — and it means a predicate should not have side effects you depend on, since it may not run for every element. Short-circuiting is also why `some` is the right replacement for a `for` loop that `break`s on the first hit.

### Empty arrays

On an empty array the predicate is never called, and the results are fixed: **`some` returns `false` and `every` returns `true`**.

```javascript title="empty-arrays.js"
console.log([].some(() => true));
console.log([].every(() => false));

const emails = [];
const allValid = emails.every((e) => e.includes('@'));
console.log(allValid);                                   // true for no emails
console.log(emails.length > 0 && allValid);              // the intended check
```

```output
false
true
true
false
```

`[].every(() => false)` being `true` looks wrong at first. The reasoning is that `every` means "there is no element that fails", and an empty array has no elements, so none fail. Logicians call this **vacuous truth**. Another way to see it: `every` over a list should equal `every` over its first half `&&` `every` over its second half. For that to hold when one half is empty, the empty case must be `true`, the value that does not change an `&&`. Likewise `some` over nothing is `false`, the value that does not change an `||`.

The practical consequence is in validation. "All submitted email addresses are valid" passes when no addresses were submitted. If an empty list should fail, check the length as well, as the last line does.

### The predicate's result is converted to a boolean

The predicate's return value is treated as truthy or falsy; it does not have to be `true` or `false`. That makes a forgotten `return` a silent bug:

```javascript title="forgotten-return.js"
const scores = [70, 85, 90];

const allPass = scores.every((s) => { s >= 60; });   // braces, no return
console.log(allPass);

console.log(scores.every((s) => s >= 60));
console.log([1, 0, 3].every(Boolean), [0, '', null].some(Boolean));
```

```output
false
true
false false
```

An arrow function with braces returns `undefined` unless it says `return`, and `undefined` is falsy, so `every` reports `false` for an array where every score passes. Remove the braces or add `return`. The last line passes the built-in `Boolean` function as the predicate, a common shorthand for "is every element truthy?" and "is any element truthy?".

### Negation: `some` and `every` are two views of one question

Each method can be written in terms of the other, and choosing the direct form makes code easier to read:

| Meaning | Direct form | Equivalent, harder to read |
|---|---|---|
| None match | `!arr.some(fn)` | `arr.every((x) => !fn(x))` |
| Not all match | `!arr.every(fn)` | `arr.some((x) => !fn(x))` |

JavaScript has no `none` method; `!arr.some(fn)` is the idiom.

### Holes

`some` and `every` skip holes in sparse arrays ([[b1-sparse-arrays]]): the predicate is not called for a missing index. So `[1, , 3].every((n) => n > 0)` is `true` even though index 1 holds nothing. `find`, `findIndex` and `includes` behave differently — they visit every index and see a hole as `undefined`. Keeping arrays dense avoids the question.

```quiz
Q: What does `[].every((x) => x > 100)` return, and why?
- [ ] `false`, because no element is greater than 100
- [ ] `undefined`, because the callback never runs
- [x] `true`, because there is no element that fails the test
- [ ] It throws, because `x` is `undefined`
> `every` returns `false` only when it finds a failing element. An empty array has none, so the result is `true` (vacuous truth) and the callback is never called. When an empty list should not pass, also check `length > 0`.

Q: `const ok = items.every((item) => { item.valid; });` returns `false` although every item has `valid: true`. Why?
- [ ] `every` requires the callback to return the element
- [x] The arrow function has a block body without `return`, so it returns `undefined`, which is falsy
- [ ] `every` does not work on arrays of objects
- [ ] `valid` must be compared with `=== true`
> With braces, an arrow function body is a block of statements and needs an explicit `return`. Without one the result is `undefined`, and `every` stops at the first element. Write `(item) => item.valid`.
```

## How it works internally

Each method is specified as a simple loop over the indexes `0` to `length - 1` (or the reverse for the `last` variants). `length` is read **once**, before the loop starts. Elements appended during the search are therefore not visited, while elements changed or removed before the loop reaches them are seen in their new state. Mutating an array inside its own search predicate is legal and confusing; avoid it.

The loops differ in how they treat a missing index. `indexOf`, `lastIndexOf`, `some` and `every` — all from ES5 (2009) — first check that the index exists as a property and skip it if not. `includes` (ES2016), `find` and `findIndex` (ES2015), and `findLast` and `findLastIndex` (ES2023) read every index unconditionally, so a hole is read as `undefined`. This historical split is the reason `[ , ].includes(undefined)` is `true` while `[ , ].indexOf(undefined)` is `-1`.

`fromIndex` is converted to an integer first: fractions are truncated, a missing value is `0`, and a negative value has `length` added to it (and is clamped to `0` if still negative).

All of these methods take **O(n)** time in the worst case, because they may have to examine every element. They use O(1) extra memory. Engines implement value searches with tight native loops, and V8 specialises them by the array's element kind — a search for a number in an array of small integers is a fast machine-level comparison loop — but the growth rate is still linear. No array method uses a hash table or assumes the array is sorted.

## Worked example: adding to a cart

A cart holds line items. Adding a product that is already in the cart should increase its quantity instead of adding a second line; checkout should be allowed only when the cart is non-empty and every item is in stock.

```javascript title="cart.js"
const cart = [
  { productId: 'p1', qty: 1, inStock: true },
  { productId: 'p2', qty: 2, inStock: true },
];
const blockedIds = ['p9', 'p13'];

function addToCart(items, productId) {
  if (blockedIds.includes(productId)) {          // primitive list: includes
    return items;
  }
  const index = items.findIndex((i) => i.productId === productId);
  if (index === -1) {                            // not in the cart yet
    return [...items, { productId, qty: 1, inStock: true }];
  }
  const line = items[index];
  return items.with(index, { ...line, qty: line.qty + 1 });
}

function canCheckOut(items) {
  return items.length > 0 && items.every((i) => i.inStock);
}

const afterP2 = addToCart(cart, 'p2');
const afterP3 = addToCart(afterP2, 'p3');
const afterBlocked = addToCart(afterP3, 'p9');

console.log(afterP3.map((i) => `${i.productId}x${i.qty}`).join(' '));
console.log(afterBlocked === afterP3);
console.log(canCheckOut(afterP3), canCheckOut([]));
console.log(afterP3.some((i) => i.qty > 1));
console.log(afterP3.find((i) => i.qty > 1).productId);
```

```output
p1x1 p2x3 p3x1
true
true false
true
p2
```

Each search method is chosen from the question. The blocked list is an array of strings and the question is yes-or-no, so `includes`. The cart holds objects, and the code needs the *position* of the matching line in order to replace it, so `findIndex` with a predicate on `productId` — `indexOf` could never match, since the caller has only an id, not the object. The result is checked against `-1` explicitly. `canCheckOut` guards `every` with a length check, because an empty cart would otherwise pass. `some` answers "is any quantity above one?", and `find` retrieves the line itself.

The function never mutates its input: it returns a new array built with spread or `with` ([[b1-array-mutation]]), or the same array when nothing changes.

## In real systems

**Feature flags and permissions.** `user.roles.includes('admin')` and `enabledFeatures.includes(flag)` are among the most common lines in frontend code. The lists are short arrays of strings, where a linear scan is as fast as anything.

**Lookup by id.** `items.find((item) => item.id === id)` appears in nearly every list-and-detail screen: the route gives an id, and the component finds the matching record in a cached list.

**Form validation.** `fields.every((f) => f.valid)` decides whether the submit button is enabled; `errors.some((e) => e.severity === 'error')` decides whether to show a banner. Schema libraries do the same internally.

**Updating state.** `findIndex` locates the item, then `with`, `map` or `toSpliced` produces the updated array for React state ([[b4-update-state-arrays]]).

**Scaling up: indexes.** When a list is large and looked up often, production code stops searching and builds an index once — a `Map` from id to record, or a `Set` of ids. This is what "normalised" client-side stores such as Redux Toolkit's entity adapter do: they keep `{ ids: [...], entities: { [id]: record } }` so that lookup by id is a property read, not a scan.

## Trade-offs and alternatives

A single search is O(n), which is fast in absolute terms for the list sizes typical of UI code — scanning a thousand elements takes microseconds. The cost becomes a problem when a search runs **inside a loop**, giving O(n × m) work:

```javascript title="set-vs-includes.js"
const banned = Array.from({ length: 5000 }, (_, i) => `user${i}`);
const visitors = Array.from({ length: 5000 }, (_, i) => `user${i * 2}`);

// O(n × m): up to 5,000 scans of a 5,000-element array
const slow = visitors.filter((v) => banned.includes(v));

// O(n + m): build the Set once, then each lookup is O(1) on average
const bannedSet = new Set(banned);
const fast = visitors.filter((v) => bannedSet.has(v));

console.log(slow.length, fast.length);
```

```output
2500 2500
```

Both produce the same result. The first performs up to 25 million comparisons; the second builds a `Set` in 5,000 steps and then does 5,000 constant-time lookups. `Set.prototype.has` uses the same SameValueZero equality as `includes`, so it is a drop-in replacement for primitives. See [[b1-set]] and [[b1-set-vs-array]].

| Structure | "Is `x` present?" | Find by key | Keeps order / duplicates |
|---|---|---|---|
| Array + `includes` / `find` | O(n) | O(n) | Yes / yes |
| `Set` + `has` | O(1) average | — | Insertion order / no duplicates |
| `Map` + `get` ([[b1-map]]) | O(1) average | O(1) average | Insertion order / unique keys |
| Sorted array + binary search ([[a3-binary-search]]) | O(log n) | O(log n) | Sorted / yes |

Building a `Set` or `Map` costs O(n) time and extra memory, so it pays off only when you search more than a handful of times. For a one-off check on a short list, `includes` or `find` is simpler and just as fast. JavaScript has no built-in binary search; for sorted data you write one or use a library.

## Common mistakes

> [!MISTAKE] Searching for an object by value
> `list.includes({ id: 1 })` and `list.indexOf(obj)` match only the identical object. Data from two different API responses, or from `JSON.parse`, is never identical. Compare a primitive field in a predicate: `list.some((x) => x.id === 1)`.

**Using `indexOf` as a boolean.** `0` is falsy and `-1` is truthy. Compare with `-1`, or use `includes`.

**Not handling `undefined` from `find`.** `list.find(...).name` throws when nothing matches. Check the result or use `?.`.

**Using `find` when `undefined` is a valid element.** The result is ambiguous. Use `findIndex`.

**Using `filter(...)[0]` or `filter(...).length > 0`.** Both scan the whole array and allocate a new one. Use `find` and `some`, which stop at the first match.

**Forgetting that `every` is `true` for an empty array.** Add `arr.length > 0 &&` when emptiness should fail.

**Forgetting `return` in a block-bodied predicate.** The predicate returns `undefined`; `find` finds nothing, `some` is `false`, `every` is `false`.

**Mismatched types.** `[1, 2, 3].includes('2')` is `false`. Values from inputs, URLs and `dataset` attributes are strings; convert before searching.

**Searching inside a loop.** `a.filter((x) => b.includes(x))` is quadratic. Convert `b` to a `Set` first.

**Using `includes` for a substring across elements.** `['apple pie'].includes('apple')` is `false` — array `includes` compares whole elements. Use `some((s) => s.includes('apple'))`.

## Interview perspective

Search methods show up in quick-fire questions about equality and return values, and as the first thing an interviewer expects you to optimise in a coding problem.

> [!INTERVIEW] What a strong answer sounds like
> "`indexOf` uses strict equality and returns an index or `-1`; `includes` uses SameValueZero, so it also finds `NaN`, and returns a boolean. Both compare objects by reference, so for objects I use `find` or `some` with a predicate on the id. All of these are linear; if I'm checking membership repeatedly I build a `Set` first to get constant-time lookups."

Questions you should be able to answer:

- **`includes` versus `indexOf`?** Boolean versus index; SameValueZero versus `===` (the `NaN` case); `includes` sees holes as `undefined`, `indexOf` skips them.
- **`find` versus `filter`?** First match or `undefined`, stopping early, versus an array of all matches, always scanning everything.
- **`find` versus `some`?** The element versus a boolean. Use `some` when you only need to know whether one exists.
- **What does `[].every(fn)` return?** `true`, without calling `fn`. `[].some(fn)` is `false`.
- **How would you implement `some` with a loop?** Iterate; return `true` on the first truthy predicate result; return `false` after the loop. `every` is the mirror image.
- **How do you check whether two arrays share an element efficiently?** Put one in a `Set`, then `other.some((x) => set.has(x))` — O(n + m) instead of O(n × m).
- **How do you find the last matching element?** `findLast` (ES2023); before that, a backward loop — not `reverse()`, which mutates.

A follow-up to expect: *"Can `find` return a falsy value that was really found?"* Yes — `[0, 1].find((n) => n === 0)` returns `0`. Test with `!== undefined`, not truthiness, or use `findIndex`.

## Practice

1. Predict each result, then run it: `[1, 2, 3].includes('2')`, `[NaN].indexOf(NaN)`, `[[1]].includes([1])`, `['a', 'b'].indexOf('a') ? 'yes' : 'no'`, `[].some(Boolean)`, `[].every(Boolean)`.
2. Write `removeById(items, id)` that returns a new array without the item with that id, and returns the *same* array when no item matches. Use `findIndex`.
3. Write `hasDuplicates(arr)` for an array of primitives in two ways: with `some` and `indexOf` (O(n²)), and with a `Set` (O(n)).
4. Implement `myFind(arr, predicate)` and `myEvery(arr, predicate)` with `for` loops. Make sure `myEvery([], fn)` is `true` and that both stop early.
5. Given `orders` (each with a `customerId`) and `customers` (each with an `id`), produce the orders whose customer exists. First write it with `some` inside `filter`, then make it linear with a `Set` of ids.

## Quick revision {#quick-revision}

- By value: `includes(v)` → boolean; `indexOf(v)` / `lastIndexOf(v)` → index or `-1`.
- By predicate: `find(fn)` / `findLast(fn)` → element or `undefined`; `findIndex(fn)` / `findLastIndex(fn)` → index or `-1`; `filter(fn)` → all matches; `some(fn)` / `every(fn)` → boolean.
- `indexOf` uses `===`; `includes` uses SameValueZero (finds `NaN`). Neither converts types; both treat `+0` and `-0` as equal.
- Objects match by reference only. Search objects with a predicate on a primitive field such as `id`.
- `fromIndex` is a start position; negative counts from the end.
- `-1` is truthy and `0` is falsy: never use `indexOf` directly as a condition.
- `find` returns the element itself (not a copy); `undefined` is ambiguous if `undefined` can be an element — use `findIndex`.
- `some` stops at the first truthy result; `every` stops at the first falsy result.
- `[].some(fn)` is `false`; `[].every(fn)` is `true` (vacuous truth). Guard with `length > 0` when needed.
- None match: `!arr.some(fn)`.
- `indexOf`, `some`, `every` skip holes; `includes`, `find`, `findIndex` see holes as `undefined`.
- All are O(n). For repeated membership tests use a `Set` (`has`); for lookup by key use a `Map`.
- `findLast` / `findLastIndex` are ES2023.

## Key takeaways {#key-takeaways}

- Pick the method from the question: present? (`includes`), where? (`indexOf`/`findIndex`), which one? (`find`), which ones? (`filter`), any? (`some`), all? (`every`).
- Value searches compare with strict equality (or SameValueZero for `includes`), so they work for primitives and fail for look-alike objects; use predicates for objects.
- Know the "not found" value of each method — `-1`, `undefined` or `false` — and never treat an index as a boolean.
- `every` on an empty array is `true`; decide deliberately whether an empty list should pass.
- Every array search is a linear scan. When you search the same data repeatedly, build a `Set` or `Map` once.
