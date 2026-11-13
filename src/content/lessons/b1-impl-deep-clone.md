---
summary: Deep clone, flatten and deep equality are three recursive walks over nested data — the same traversal with a different job at each node. You will implement all three by hand, handle cycles, shared references, dates, maps and sets, and learn exactly where `JSON.parse(JSON.stringify(x))` and `structuredClone` fall short.
difficulty: intermediate
minutes: 50
objectives:
  - Explain the difference between shallow and deep copies and predict which changes leak between them
  - Implement `deepClone` that preserves cycles and shared references with a `WeakMap`, and copies `Date`, `RegExp`, `Map`, `Set` and typed arrays
  - List what `JSON.parse(JSON.stringify(x))` and `structuredClone` lose, and choose between them and a custom clone
  - Implement `flatten` with a depth limit, recursively and iteratively
  - Implement `deepEqual` with `Object.is`, prototype and key checks, special types and cycle handling
---

## Introduction

JavaScript objects are passed around by reference. When you write `const copy = original`, you get a second name for the *same* object, and a change through either name is visible through both. Spread and `Object.assign` make a new outer object, but its nested objects are still shared — a **shallow copy**. A **deep copy** duplicates the whole structure, all the way down, so the copy and the original share nothing that can be changed.

Three interview exercises are really the same problem in disguise:

- **Deep clone** — walk a nested structure and build an independent duplicate of it.
- **Flatten** — walk nested arrays and collect their leaves into one flat array.
- **Deep equality** — walk two structures side by side and decide whether they hold the same data.

Each is a **recursive traversal of a graph**: objects are nodes, properties are edges. The interesting parts are the same for all three — telling objects from primitives, handling built-in types such as `Date` and `Map` that keep their data in internal slots rather than properties, and dealing with **cycles** (an object that, directly or indirectly, refers to itself). Getting those right is what interviewers look for, and it is also what separates a correct utility from one that crashes or silently corrupts data in production.

## Before you start

- **References and copying** — what spread and `Object.assign` copy. See [[b1-copying-objects]], [[b1-copying-arrays]] and [[b1-call-by-sharing]].
- **Recursion** — a function that calls itself on smaller input, and the call stack it uses. See [[b1-recursion-js]].
- **`Map`, `Set` and `WeakMap`** — keyed collections; `WeakMap` holds its keys weakly. See [[b1-map]], [[b1-set]] and [[b1-weakmap]].
- **Equality** — `===` versus `Object.is`. See [[b1-strict-equality]] and [[b1-object-is]].
- **The built-in alternatives** — [[b1-structured-clone]] and [[b1-json-clone-limits]].

## The intuition

Imagine copying a set of folders that contain documents and **shortcuts** to other folders. A naive copier follows every shortcut and copies whatever it points to. If folder A has a shortcut to folder B, and B has a shortcut back to A, the copier goes A → B → A → B forever. If two folders both have a shortcut to folder C, the naive copier makes *two* copies of C, so the new structure no longer has one shared C — it has two unrelated ones.

The fix is a **ledger**: before copying a folder, check whether you have already copied it. If yes, point to the existing copy instead of making a new one. That ledger — a map from each original object to its copy — is the heart of a correct deep clone. It ends cycles and keeps shared references shared.

Deep equality uses the same ledger idea in a different form ("have I already started comparing this pair?"), and flatten is the simplest of the three: it only descends into arrays, and arrays in practice rarely contain themselves.

## Shallow versus deep copies

```js title="shallow.js"
const original = { name: 'Ada', address: { city: 'London' }, tags: ['math'] };

const alias = original;
const shallow = { ...original };
const deep = structuredClone(original);

shallow.name = 'Grace'; // top level: independent
shallow.address.city = 'Paris'; // nested: shared with original
deep.tags.push('poetry'); // deep copy: independent at every level

console.log(alias === original, shallow === original);
console.log(original.name, original.address.city, original.tags);
console.log(shallow.address === original.address, deep.address === original.address);
```

```output
true false
Ada Paris [ 'math' ]
true false
```

Changing `shallow.name` did not affect the original, because spread copied the top-level property. Changing `shallow.address.city` *did*, because `shallow.address` and `original.address` are the same object. The deep copy shares nothing.

Shallow copies are often enough, and they are cheap. In immutable-update code (React state, Redux reducers) you copy only the path you change and deliberately share everything else. Deep copies are for when you need a fully independent snapshot — undo history, test fixtures, handing data to code that might mutate it.

## Why JSON is not a clone

`JSON.parse(JSON.stringify(x))` is a widely used shortcut. It works for plain data made of objects, arrays, strings, finite numbers, booleans and `null`. For anything else it silently changes the data or throws:

```js title="json-clone.js"
const input = {
  when: new Date(0),
  tags: new Set(['a']),
  missing: undefined,
  inf: Infinity,
  nan: NaN,
  greet() {},
};
console.log(JSON.parse(JSON.stringify(input)));

const looped = {};
looped.self = looped;
try {
  JSON.stringify(looped);
} catch (e) {
  console.log(e.constructor.name);
}
try {
  JSON.stringify({ big: 1n });
} catch (e) {
  console.log(e.message);
}
```

```output
{ when: '1970-01-01T00:00:00.000Z', tags: {}, inf: null, nan: null }
TypeError
Do not know how to serialize a BigInt
```

The `Date` became a **string**, the `Set` became an empty object, `undefined` and the method disappeared, and `Infinity` and `NaN` became `null`. Cycles and `BigInt` values throw. Class instances also come back as plain objects, losing their methods. See [[b1-json-unsupported]].

## The built-in: structuredClone

Since 2022 every major browser, and Node.js 17 onwards, provides `structuredClone(value)`. It uses the **structured clone algorithm** — the same one used to send data to Web Workers and store it in IndexedDB — and handles cycles, `Date`, `RegExp`, `Map`, `Set`, typed arrays, `ArrayBuffer`, `Error` objects and more. It has its own limits:

```js title="structured-clone-limits.js"
class Point {
  constructor() {
    this.x = 1;
  }
  get double() {
    return this.x * 2;
  }
}

const copy = structuredClone(new Point());
console.log(copy, copy instanceof Point, copy.double);

console.log(structuredClone({ [Symbol('id')]: 1, visible: 2 }));

try {
  structuredClone({ handler() {} });
} catch (e) {
  console.log(e.name);
}
```

```output
{ x: 1 } false undefined
{ visible: 2 }
DataCloneError
```

The class instance came back as a plain object: the **prototype is not preserved**, so methods and getters are gone. Symbol-keyed properties are dropped. Functions cannot be cloned at all and cause a `DataCloneError`. DOM nodes cannot be cloned either. For plain data with dates and collections, `structuredClone` is the right choice in production. When you need to preserve prototypes, keep symbol keys, or decide yourself what happens to functions, you write your own — which is also exactly what the interview asks for.

## Implementing deepClone

Build it up in layers: primitives, then cycles, then containers, then special types.

```js title="deepClone.js"
function deepClone(value, seen = new WeakMap()) {
  // Primitives are immutable, and functions are shared rather than copied.
  if (value === null || typeof value !== 'object') return value;

  // Already copied (a cycle or a shared reference): reuse that copy.
  if (seen.has(value)) return seen.get(value);

  let copy;
  if (value instanceof Date) {
    copy = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    copy = new RegExp(value.source, value.flags);
    copy.lastIndex = value.lastIndex;
  } else if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    copy = value.slice(); // typed arrays copy their bytes
  } else if (value instanceof Map) {
    copy = new Map();
    seen.set(value, copy); // register before recursing, so cycles find it
    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen));
    return copy;
  } else if (value instanceof Set) {
    copy = new Set();
    seen.set(value, copy);
    for (const v of value) copy.add(deepClone(v, seen));
    return copy;
  } else {
    // Arrays keep their length (and holes); other objects keep their prototype.
    copy = Array.isArray(value)
      ? new Array(value.length)
      : Object.create(Object.getPrototypeOf(value));
    seen.set(value, copy);
    for (const key of Reflect.ownKeys(value)) {
      if (!Object.prototype.propertyIsEnumerable.call(value, key)) continue;
      copy[key] = deepClone(value[key], seen);
    }
    return copy;
  }
  seen.set(value, copy);
  return copy;
}

class Point {
  constructor(x) {
    this.x = x;
  }
  get double() {
    return this.x * 2;
  }
}

const shared = { label: 'shared' };
const id = Symbol('id');
const source = {
  when: new Date(0),
  pattern: /ab+c/gi,
  point: new Point(21),
  lookup: new Map([['k', shared]]),
  ids: new Set([1, 2]),
  bytes: new Uint8Array([1, 2, 3]),
  sparse: [1, , 3],
  first: shared,
  second: shared,
  [id]: 'symbol value',
  greet() {
    return 'hi';
  },
};
source.self = source;

const c = deepClone(source);
console.log(c.self === c, c !== source);
console.log(c.when instanceof Date, c.when !== source.when, c.pattern.flags);
console.log(c.point instanceof Point, c.point.double);
console.log(c.first === c.second, c.first !== shared, c.lookup.get('k') === c.first);
console.log(c.ids, c.bytes, c.sparse, c[id], c.greet === source.greet);
```

```output
true true
true true gi
true 42
true true true
Set(2) { 1, 2 } Uint8Array(3) [ 1, 2, 3 ] [ 1, <1 empty item>, 3 ] symbol value true
```

Every line of output checks one rule.

**Primitives and functions are returned as they are.** Strings, numbers, booleans, `null`, `undefined`, symbols and `BigInt`s are immutable, so sharing them is safe. Functions are objects, but copying one is neither possible in general (closures capture private variables) nor usually wanted, so the clone shares them — `c.greet === source.greet` is `true`. Throwing instead, as `structuredClone` does, is an equally valid policy; say which you chose.

**The `WeakMap` ledger handles cycles and shared references.** `seen` maps each original object to its copy. `c.self === c` shows the cycle was preserved instead of recursing forever. `c.first === c.second` shows that `shared`, referenced twice, became *one* copy referenced twice — the shape of the graph is preserved. A `WeakMap` is used rather than a `Map` because its keys are held weakly: the ledger does not keep originals alive after the clone finishes, and it only accepts objects as keys, which is all it ever needs.

**The copy is registered *before* recursing into children.** If `seen.set` came after the loop, a child pointing back to its parent would not find the parent in the ledger and would recurse forever. This ordering is the most common bug in hand-written clones.

**Built-in types need explicit handling.** A `Date` stores its time in an internal slot, not in a property, so copying properties would produce an empty object. `new Date(value.getTime())` copies the slot. `RegExp` is rebuilt from `source` and `flags`, plus `lastIndex`, which matters for global regexes. `Map` and `Set` are rebuilt by iterating, cloning both keys and values. Typed arrays (`Uint8Array` and friends) copy their bytes with `slice()`; `DataView` is excluded because it has no `slice`.

**Arrays keep their holes and plain objects keep their prototype.** `new Array(value.length)` plus assignment by key preserves holes, because `Reflect.ownKeys` only lists indices that exist. `Object.create(Object.getPrototypeOf(value))` means `c.point` is still a `Point`, so its getter works — something neither JSON nor `structuredClone` does.

**Symbol keys are copied, non-enumerable properties are not.** `Reflect.ownKeys` returns string and symbol keys, so `c[id]` survived. The `propertyIsEnumerable` check skips non-enumerable ones — including an array's own `length`, which is set by the constructor instead.

### What this clone still does not do

Name these in an interview rather than discovering them during one:

- **Getters on own properties are evaluated**, and the copy gets a plain data property holding the result. Copying property descriptors with `Object.getOwnPropertyDescriptor` and `Object.defineProperty` would keep accessors and flags such as `writable`.
- **Private class fields (`#x`) are not copied**, because they are not properties and cannot be reached from outside the class. A clone of such an instance has the right prototype but missing internal state; methods that read `#x` will throw.
- **Subclasses of `Map`, `Set` and `Date` lose their subclass**, because the code constructs the base class. Using `new value.constructor()` would keep it, at the cost of calling user code.
- **Very deep structures overflow the stack.** Each nesting level is a recursive call, so a linked list with hundreds of thousands of nodes throws `RangeError: Maximum call stack size exceeded`. An explicit stack (see flatten below) removes the limit.
- Errors, `WeakMap`, `WeakSet`, promises, DOM nodes and other host objects are copied as plain objects or not meaningfully at all.

## Implementing flatten

Flatten turns `[1, [2, [3, [4]]]]` into a flat array. The built-in `Array.prototype.flat(depth)` (ES2019) flattens one level by default and any number of levels with a depth argument, including `Infinity`. It also skips holes. A recursive version mirrors it closely:

```js title="flatten.js"
function flatten(arr, depth = 1) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) continue; // flat() skips holes
    const item = arr[i];
    if (Array.isArray(item) && depth > 0) {
      for (const inner of flatten(item, depth - 1)) out.push(inner);
    } else {
      out.push(item);
    }
  }
  return out;
}

const nested = [1, [2, [3, [4]]], , 5];
console.log(flatten(nested));
console.log(flatten(nested, 2));
console.log(flatten(nested, Infinity));
console.log(nested.flat(Infinity));
```

```output
[ 1, 2, [ 3, [ 4 ] ], 5 ]
[ 1, 2, 3, [ 4 ], 5 ]
[ 1, 2, 3, 4, 5 ]
[ 1, 2, 3, 4, 5 ]
```

The `depth` parameter counts how many more levels may be opened. Each recursive call passes `depth - 1`; at zero, nested arrays are kept as single items. `Infinity - 1` is still `Infinity`, so `flatten(x, Infinity)` opens everything. The inner `for...of` copies results one by one instead of `out.push(...flatten(...))`, because spreading a very large array into a function call can exceed the engine's argument limit.

`Array.isArray` is the right test rather than `instanceof Array`: it also recognises arrays created in another realm, such as an iframe. See [[b1-array-from-isarray]] and [[b1-flat-flatmap]].

For unlimited depth without recursion — no stack overflow on deeply nested input — use an explicit stack:

```js title="flatten-iterative.js"
function flattenDeep(arr) {
  const stack = [...arr]; // note: spread turns holes into undefined
  const out = [];
  while (stack.length > 0) {
    const item = stack.pop(); // take from the end...
    if (Array.isArray(item)) stack.push(...item);
    else out.push(item);
  }
  return out.reverse(); // ...so reverse once at the end to restore order
}

let deep = [0];
for (let i = 1; i < 20000; i++) deep = [i, deep]; // 20,000 levels of nesting
console.log(flattenDeep([1, [2, [3, [4]]], 5]));
console.log(flattenDeep(deep).length);
```

```output
[ 1, 2, 3, 4, 5 ]
20000
```

Popping from the end of an array is O(1), whereas `shift()` from the front is O(n), so the iterative version pops and reverses once at the end. It handles 20,000 levels of nesting without recursion; a recursive flatten on the same input may overflow the call stack, depending on the engine's stack size. The trade-off is that spread converts holes to `undefined`, unlike `flat`.

## Implementing deepEqual

Deep equality walks two structures in parallel and returns `false` at the first difference. The decisions are about what "the same" means for each kind of value.

```js title="deepEqual.js"
function deepEqual(a, b, seen = new WeakMap()) {
  if (Object.is(a, b)) return true; // same reference, or equal primitives (NaN too)
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false; // different primitives, or object versus primitive
  }
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  // Cycle guard: if we are already comparing a with b, assume they match here;
  // any real difference will be found elsewhere in the walk.
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (a instanceof Date) return Object.is(a.getTime(), b.getTime());
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags;
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !deepEqual(value, b.get(key), seen)) return false;
    }
    return true;
  }
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const value of a) if (!b.has(value)) return false;
    return true;
  }

  const keysA = Reflect.ownKeys(a).filter((k) => Object.prototype.propertyIsEnumerable.call(a, k));
  const keysB = Reflect.ownKeys(b).filter((k) => Object.prototype.propertyIsEnumerable.call(b, k));
  if (keysA.length !== keysB.length) return false;
  if (Array.isArray(a) && a.length !== b.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.propertyIsEnumerable.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }
  return true;
}

console.log(deepEqual({ a: [1, { b: NaN }] }, { a: [1, { b: NaN }] }));
console.log(deepEqual({ x: 1, y: 2 }, { y: 2, x: 1 }));
console.log(deepEqual([1, 2], { 0: 1, 1: 2 }));
console.log(deepEqual(new Date(5), new Date(5)), deepEqual(0, -0));
console.log(deepEqual(new Map([['k', [1]]]), new Map([['k', [1]]])));
console.log(deepEqual([1, , 3], [1, undefined, 3]));

const loopA = { name: 'a' };
loopA.self = loopA;
const loopB = { name: 'a' };
loopB.self = loopB;
console.log(deepEqual(loopA, loopB));
loopB.name = 'b';
console.log(deepEqual(loopA, loopB));
```

```output
true
true
false
true false
true
false
true
false
```

**`Object.is` for primitives.** It treats `NaN` as equal to itself, which `===` does not, so structures containing `NaN` compare equal. It also treats `0` and `-0` as different. Node's `util.isDeepStrictEqual` makes the same choice; if your application considers them equal, check `a === b` as well. See [[b1-object-is]].

**Prototypes must match.** An array and an array-like object with the same keys are different kinds of thing, and so are two class instances of different classes with the same fields. Comparing prototypes rules them out with one check.

**Key order does not matter, key count does.** `{ x, y }` and `{ y, x }` are equal. Checking that both sides have the same number of enumerable own keys, and that every key of `a` exists on `b`, proves the key sets are identical. Holes count: `[1, , 3]` has no index `1`, so it differs from `[1, undefined, 3]`.

**Special types compare their internal data.** Dates compare timestamps (with `Object.is` so two invalid dates match). Maps compare sizes, then each key by identity and each value deeply. Sets here check membership by identity, which is exact for primitives; two sets of *equal but distinct* objects compare unequal. Matching objects in sets deeply means trying every pairing — O(n²) — and production libraries do exactly that.

**The cycle guard.** When comparing `loopA` and `loopB`, the walk reaches `loopA.self` and `loopB.self` — the same pair it started with. Recording "I am comparing `a` with `b`" in the `WeakMap` lets the second visit return `true` instead of recursing forever. That is safe because the pair is still being compared higher up: if anything differs, that comparison will find it and return `false`, as the last line shows. (Storing a single partner per object is a simplification; robust libraries track pairs so the same object compared against two different partners is handled precisely.)

## How it works internally

All three functions are **depth-first traversals**. Each recursive call handles one node and pushes a frame onto the call stack for each level of nesting, so memory use is proportional to the depth of the structure, plus the ledger, which grows with the number of objects visited. Time is proportional to the number of nodes and edges visited: each object is processed once by the clone (thanks to the ledger), and each key once by the comparison, except for the O(n²) deep-set matching mentioned above.

`structuredClone` works differently inside: the engine serialises the value into an internal format and then deserialises it into new objects, using the same memo of already-seen objects to preserve cycles and shared references. That serialise-then-rebuild design is why it can only handle types it knows how to serialise, why prototypes are not kept, and why it can move data between threads.

## In real systems

**State snapshots.** Undo/redo, draft editing ("cancel" restores the original) and optimistic updates take deep copies of state. Most apps use `structuredClone`; immutable-update libraries such as Immer avoid deep copies entirely by copying only the changed path.

**Test assertions.** `expect(actual).toEqual(expected)` in Vitest and Jest is a deep equality check with many extra rules (asymmetric matchers, ignoring `undefined` properties in `toEqual`, strict prototype checks in `toStrictEqual`). Node's `assert.deepStrictEqual` and `util.isDeepStrictEqual` are the built-in equivalents.

**Memoization and React.** Re-rendering decisions use shallow or reference equality on purpose, because deep comparison of large props on every render is expensive. Deep equality is reserved for small values or explicit checks.

**Security.** Deep-merge and clone utilities that copy keys such as `__proto__` from untrusted JSON have caused **prototype pollution** vulnerabilities. A clone that assigns `copy['__proto__'] = …` changes the copy's prototype instead of creating a property. Production utilities skip or specially handle that key. See [[b1-prototype-pollution]].

## Trade-offs and alternatives

| Approach | Cycles | Dates, Maps, Sets | Prototypes | Functions | Symbol keys |
|---|---|---|---|---|---|
| Spread / `Object.assign` (shallow) | n/a | shared | lost (spread) | shared | copied |
| `JSON.parse(JSON.stringify(x))` | throws | broken | lost | dropped | dropped |
| `structuredClone(x)` | yes | yes | lost | throws | dropped |
| Custom `deepClone` (this lesson) | yes | yes | kept | shared | copied |
| Lodash `cloneDeep` | yes | yes | kept | `{}` for top-level functions | copied |

Prefer `structuredClone` for plain data in modern runtimes, a custom or library clone when prototypes or symbols matter, and avoid deep copying entirely when a shallow, path-based update will do. For equality, use your test framework or `util.isDeepStrictEqual` rather than shipping your own.

## Common mistakes

**Registering the copy after recursing.** Cycles then recurse forever. Call `seen.set(original, copy)` before visiting children.

**Using `typeof x === 'object'` without excluding `null`.** `typeof null` is `'object'`, and `Object.getPrototypeOf(null)` throws.

**Copying a `Date` by its properties.** It has none; the result is an empty object. Rebuild from `getTime()`.

**Using `for...in` to copy keys.** It includes inherited enumerable properties and excludes symbol keys. Use `Reflect.ownKeys` (or `Object.keys` if you deliberately skip symbols).

**Comparing key lists by order in `deepEqual`.** `JSON.stringify(a) === JSON.stringify(b)` fails for reordered keys and has every JSON limitation.

**Checking only `a`'s keys.** `deepEqual({ a: 1 }, { a: 1, b: 2 })` must be `false`; compare key counts too.

**Using `===` and forgetting `NaN`.** Structures containing `NaN` never compare equal with `===`.

**Assuming `structuredClone` keeps classes.** Instances come back as plain objects.

## Interview perspective

**"Implement deep clone."** Start with the primitive check and the plain object/array recursion. Then, before being asked, add the `WeakMap` and explain both reasons — cycles and shared references. Add `Date`, `Map`, `Set` and say how you would handle functions and prototypes. Finish by naming the limits (getters, private fields, deep recursion) and the built-in `structuredClone`.

**"Why not `JSON.parse(JSON.stringify())`?"** Dates become strings, `undefined` and functions vanish, `NaN`/`Infinity` become `null`, `Map`/`Set` become `{}`, cycles and `BigInt` throw, prototypes are lost.

**"Implement `flatten` with a depth."** Recursive with `depth - 1`; then offer the iterative stack version and explain why it avoids stack overflow.

**"Implement `deepEqual`."** `Object.is` first, then type and prototype, then special types, then key counts and recursive comparison. Mention cycles and the O(n²) cost of deep set comparison.

```quiz
Q: In `deepClone`, why must `seen.set(original, copy)` happen before the loop that clones the children?
- [ ] `WeakMap` cannot be updated after recursion starts
- [x] A child that refers back to the original must find its copy in the ledger, otherwise the clone recurses forever
- [ ] It makes primitive properties copy faster
- [ ] It is required for arrays but not for objects
> When a cycle leads back to an object that is still being cloned, the only way to stop is to find that object in `seen`. If the copy were registered after its children, the lookup would fail, a new clone would start, and the recursion would never end. Registering first also preserves shared references.
```

```quiz
Q: What does `structuredClone(new Point(1))` return for a class `Point` with a getter `double`?
- [ ] A `Point` instance whose `double` getter works
- [x] A plain object with the instance's own data properties; `instanceof Point` is `false` and `double` is `undefined`
- [ ] It throws a `DataCloneError`
- [ ] The same instance, because class instances are not cloneable
> The structured clone algorithm copies own data properties into a plain object and does not keep the prototype, so methods and getters are lost. It throws `DataCloneError` only for values it cannot serialise at all, such as functions. A custom clone using `Object.create(Object.getPrototypeOf(value))` keeps the class.
```

```quiz
Q: Why does `deepEqual` use `Object.is(a, b)` rather than `a === b` as its first check?
- [ ] `Object.is` compares objects by their contents
- [ ] `===` throws on `NaN`
- [x] `Object.is(NaN, NaN)` is `true`, so structures containing `NaN` can compare equal; it also distinguishes `0` from `-0`
- [ ] `Object.is` is faster for objects
> `NaN === NaN` is `false`, which would make `{ x: NaN }` unequal to itself. `Object.is` treats `NaN` as equal to `NaN` and `0` as different from `-0`, the same choice Node's `isDeepStrictEqual` makes. Like `===`, it compares objects by reference only, which is why the function recurses for objects.
```

## Practice

1. Change `deepClone` to copy property descriptors, so getters, setters and non-writable properties are preserved.
2. Rewrite `deepClone` iteratively with an explicit stack so that a 100,000-node linked list does not overflow.
3. Make `deepEqual` compare sets of objects deeply, and state its time complexity.
4. Add an option to `deepClone` that throws on functions (like `structuredClone`) instead of sharing them.
5. Write `deepFreeze(obj)` using the same traversal and `Object.freeze`, handling cycles. Compare with [[b1-object-freeze-seal]].
6. Implement `flatten` for objects: `{ a: { b: 1 }, c: [2] }` → `{ 'a.b': 1, 'c.0': 2 }`. This leads into [[b1-impl-get-path]].

## Quick revision {#quick-revision}

- Shallow copy (spread, `Object.assign`) shares nested objects; deep copy shares nothing mutable.
- JSON clone: `Date` → string, `undefined`/functions dropped, `NaN`/`Infinity` → `null`, `Map`/`Set` → `{}`, prototypes lost, cycles and `BigInt` throw.
- `structuredClone`: cycles, `Date`, `RegExp`, `Map`, `Set`, typed arrays OK; prototypes and symbol keys lost; functions and DOM nodes throw `DataCloneError`.
- `deepClone`: primitives/functions returned as-is → `seen.has` check → special types (`Date` via `getTime`, `RegExp` via `source`/`flags`, typed arrays via `slice`, `Map`/`Set` by iterating) → array (`new Array(len)`) or `Object.create(proto)` → `seen.set` **before** recursing → copy own enumerable keys via `Reflect.ownKeys`.
- `WeakMap` ledger: ends cycles, preserves shared references, does not keep originals alive.
- `flatten(arr, depth = 1)`: recurse with `depth - 1`, skip holes, `Array.isArray`; iterative version uses a stack, `pop`, then `reverse`.
- `deepEqual`: `Object.is` → both objects → same prototype → cycle guard → `Date`/`RegExp`/`Map`/`Set` → equal enumerable key counts → every key present and deep-equal.
- Limits to mention: getters evaluated, private fields not copied, subclasses of built-ins, recursion depth, deep set matching is O(n²).

## Key takeaways {#key-takeaways}

- Clone, flatten and equality are one depth-first traversal with three different jobs.
- A `WeakMap` from originals to copies, registered before recursion, is what makes cloning correct for cycles and shared references.
- Built-in types keep data in internal slots, so `Date`, `RegExp`, `Map`, `Set` and typed arrays need explicit cases.
- JSON round-tripping is not a clone; `structuredClone` is the right default for plain data but drops prototypes and rejects functions.
- In interviews, write the core, add the edge cases deliberately, and name what your version still does not handle.
