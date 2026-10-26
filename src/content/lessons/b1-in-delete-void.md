---
summary: "`in`, `delete`, `void` and `instanceof` are JavaScript's keyword operators: they test whether a property exists, remove a property, discard a value, and check an object's prototype chain. You will learn exactly what each one checks or changes, the surprises around inherited properties, arrays, strict mode and primitives, and the modern alternatives you should often reach for instead."
difficulty: beginner
minutes: 35
objectives:
  - Distinguish `key in obj`, `Object.hasOwn(obj, key)` and `obj.key !== undefined`, and choose the right one
  - Predict the result of `delete` for own, inherited, non-configurable and array properties in sloppy and strict mode
  - Explain what `void` returns and recognise its legitimate modern uses
  - Explain `instanceof` as a prototype-chain search and identify the inputs that make it throw or mislead
  - Debug precedence and type errors involving these operators, such as `!key in obj` and `'x' in 'text'`
---

## Introduction

Most operators compute something from values: `+` adds, `<` compares. JavaScript also has four operators spelled as keywords that work on the **structure** of objects instead:

- `key in obj` asks whether an object has a property with that name, either its own or inherited.
- `delete obj.key` removes a property from an object.
- `void expr` evaluates an expression and throws the result away, producing `undefined`.
- `obj instanceof C` asks whether `C.prototype` appears in the object's prototype chain.

They look like functions in some code (`void(0)`, `delete(obj.x)`), but they are operators: the parentheses there are just grouping. Each one is short to write and easy to misread, and each has an edge where the obvious reading is wrong. `'toString' in {}` is `true`. `delete` on an array element leaves a hole and does not change `length`. `void` exists mostly for reasons that no longer apply, but has two modern uses. `instanceof` returns `false` for a string and can be fooled entirely by objects from another window.

This lesson takes the four operators one at a time, then compares them with the newer APIs — `Object.hasOwn`, destructuring, `Array.isArray`, `Reflect` — that cover the same ground more precisely. They belong together in this module because they share the precedence level of the relational and unary operators, which produces a family of shared bugs.

## Before you start

- **Objects and properties** — reading, adding and computing property names. See [[b1-object-literals]] and [[b1-dot-vs-bracket]].
- **Prototypes** — objects inherit properties from a chain of prototype objects. You need the idea, not the details. See [[b1-prototype-chain]].
- **Own versus inherited properties** — the distinction `in` and `delete` disagree about. See [[b1-own-vs-inherited]].
- **Strict mode** — several results differ between strict and non-strict ("sloppy") code; classes and ES modules are always strict. See [[b1-strict-mode]].

## The intuition

Picture an object as a desk with drawers, sitting in front of a series of shelves — its prototype chain. Each operator asks a different question about that picture.

`in` asks "**can I find a drawer with this label anywhere**, on the desk or on the shelves behind it?". It does not care what is in the drawer, even if the drawer is empty.

`delete` says "**remove this drawer from the desk**". It never touches the shelves. If a drawer with the same label exists on a shelf, you will now see that one instead.

`void` is a shredder: whatever you hand it is processed (any side effects happen) and **you get nothing back**.

`instanceof` asks "**is this particular shelf, `C.prototype`, somewhere behind the desk?**". It does not look at drawers at all, and it does not ask who built the desk.

The picture stops working in one place: for `instanceof`, a class can override the question entirely with `Symbol.hasInstance`. That is covered in the `instanceof` section.

## `in`: does the property exist?

`key in obj` evaluates to `true` if `obj` has a property named `key` — **including inherited properties** — and `false` otherwise. The value of the property does not matter.

```javascript title="in-basics.js"
const proto = { inherited: 1 };
const obj = Object.create(proto);   // obj's prototype is proto
obj.own = 2;
obj.empty = undefined;

console.log('own' in obj, 'inherited' in obj, 'missing' in obj, 'toString' in obj);
console.log(Object.hasOwn(obj, 'own'), Object.hasOwn(obj, 'inherited'));
console.log('empty' in obj, obj.empty !== undefined);
```

```output
true true false true
true false
true false
```

The first line shows the prototype walk: `inherited` lives on `proto`, and `toString` lives on `Object.prototype`, at the end of the chain — so both count. The second line shows `Object.hasOwn` (ES2022), which checks **only the object's own properties**. The third line shows why `in` is different from comparing with `undefined`: `empty` exists but holds `undefined`, so `in` says `true` while the comparison says it is absent.

Those three checks answer three different questions, and choosing between them is the main skill:

| Check | Question it answers | Inherited? | Property set to `undefined`? |
|---|---|---|---|
| `key in obj` | Can this object respond to `key` at all? | counts | counts |
| `Object.hasOwn(obj, key)` | Is `key` stored on this object itself? | ignored | counts |
| `obj[key] !== undefined` | Is there a usable value? | counts | treated as missing |

For data — parsed JSON, dictionaries, records — you almost always want `Object.hasOwn`, because inherited names like `toString` and `constructor` are not part of your data. `in` is the right tool for **capability checks**: "does this object support this method?", where an inherited method is just as good as an own one. The older `obj.hasOwnProperty(key)` does the same as `Object.hasOwn` but fails on objects created with `Object.create(null)` (they do not inherit the method) and can be shadowed by a property of the same name. See [[b1-object-hasown]].

### Keys are converted, the object is not

The left operand of `in` is converted to a **property key**: symbols stay symbols, everything else becomes a string. That is why numbers work for array indices. The right operand must be an **object**; a primitive is not automatically wrapped, so `in` throws:

```javascript title="in-keys.js"
const arr = ['a', , 'c'];             // index 1 is a hole
console.log(0 in arr, 1 in arr, 3 in arr, 'length' in arr, '0' in arr);

const id = Symbol('id');
console.log(id in { [id]: 1 });

try {
  console.log('length' in 'text');
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
true false false true true
true
TypeError: Cannot use 'in' operator to search for 'length' in text
```

`1 in arr` is `false` because a **hole** in a sparse array is a missing property, not an element holding `undefined` (see [[b1-sparse-arrays]]). `3 in arr` is `false` because the array has only indices 0–2. Note that `in` checks **keys**, not values: `'a' in arr` is `false`, because `'a'` is an element, not an index. Use `arr.includes('a')` for values.

The `TypeError` on a string catches people who write `'x' in someValue` where `someValue` may be a string or `null`. Check `typeof value === 'object' && value !== null` first, or use `Object.hasOwn`, which converts its first argument to an object and throws only for `null` and `undefined`.

### Private-field brand checks

Since ES2022, `#field in obj` checks whether an object has a particular **private field**, which tells you it was created by that class:

```javascript title="private-in.js"
class Account {
  #balance = 0;
  static isAccount(x) {
    return #balance in x;
  }
}
console.log(Account.isAccount(new Account()), Account.isAccount({ balance: 0 }));
```

```output
true false
```

Unlike `instanceof`, this cannot be fooled by changing an object's prototype, because private fields are attached when the constructor runs. It only works inside the class body, where `#balance` is in scope. See [[b1-public-private-fields]].

`in` also appears inside `for (const key in obj)`, but that is a different piece of syntax — a loop over enumerable keys — not the operator ([[b1-for-of-in]]). And in TypeScript, `'swim' in animal` **narrows** a union type to the members that declare `swim` ([[b2-narrowing]]).

## `delete`: remove an own property

`delete obj.key` (or `delete obj[expr]`) removes the property **from the object itself**. It returns `true` if the property is gone afterwards — including when it never existed — and `false` if it could not be removed (in sloppy mode). It never touches the prototype chain.

```javascript title="delete-basics.js"
'use strict';
const user = {
  name: 'Ada',
  password: 'secret',
  toString() { return 'custom'; },
};

console.log(delete user.password, user);
console.log(delete user.nothing);                       // never existed: still true
console.log(String(user), delete user.toString, String(user));
```

```output
true { name: 'Ada', toString: [Function: toString] }
true
custom true [object Object]
```

The third line is the "drawer on the shelf" effect. `user` had its own `toString` that **shadowed** the inherited one. Deleting the own method uncovers `Object.prototype.toString`, so `String(user)` falls back to `'[object Object]'`. `delete` removed a property, but the object still responds to `toString` — `'toString' in user` remains `true`.

### What cannot be deleted

A property can be deleted only if it is **configurable**. Properties of frozen or sealed objects, many built-in properties such as `Math.PI`, and an array's `length` are non-configurable. What happens then depends on the mode:

```javascript title="delete-sloppy.js"
const frozen = Object.freeze({ id: 1 });
console.log(delete frozen.id, frozen);
console.log(delete Math.PI, Math.PI);

var counter = 1;
console.log(delete counter, counter);
```

```output
false { id: 1 }
false 3.141592653589793
false 1
```

In sloppy mode `delete` quietly returns `false`. In **strict mode** — which includes every class body and ES module — the same attempt throws `TypeError: Cannot delete property 'id' of #<Object>`, which is much easier to notice. Variables declared with `var`, `let`, `const` or `function` are not deletable either. In strict mode, writing `delete counter` with a bare identifier is not even allowed to compile: it is a `SyntaxError: Delete of an unqualified identifier in strict mode.`

Two more facts complete the picture. `delete` through optional chaining is allowed: `delete config?.cache` does nothing and returns `true` if `config` is nullish. And `delete` removes a **reference**, not memory: if no other reference to the deleted value exists, the garbage collector can reclaim it later, exactly as if you had overwritten the property ([[b1-garbage-collection]]).

### Arrays: `delete` leaves a hole

On an array, `delete arr[i]` removes the property at index `i`, but array length is not recalculated and later elements do not move:

```javascript title="delete-array.js"
const list = [1, 2, 3];
console.log(delete list[1], list, list.length, 1 in list);

const items = [1, 2, 3];
items.splice(1, 1);
console.log(items, items.length);
```

```output
true [ 1, <1 empty item>, 3 ] 3 false
[ 1, 3 ] 2
```

The result is a **sparse array**, which many methods treat inconsistently (`forEach` skips holes, `map` preserves them, `for...of` yields `undefined`). To remove an element, use `splice` to shift the rest down, or `filter`/`toSpliced` (ES2023) to build a new array.

### Alternatives to `delete`

In everyday application code, `delete` is often not the best tool:

- **To build a copy without some keys**, use rest destructuring: `const { password, ...safeUser } = user;` leaves `user` untouched and gives you a new object without `password`. This is the idiomatic way to strip fields before sending data to a client, and it fits immutable state updates in React.
- **For a dictionary whose keys come and go**, use a `Map` and `map.delete(key)`. Maps are designed for frequent additions and removals ([[b1-map-vs-object]]).
- **When "absent" and "empty" mean the same thing to your code**, setting `obj.key = undefined` is simpler and keeps the object's shape stable.

That last point matters for performance in hot code. Engines such as V8 optimise objects whose set of properties stays the same (their "shape" or **hidden class**). Deleting properties can push an object into a slower dictionary-like representation. It is not a reason to avoid `delete` everywhere, but it is a reason not to use it inside tight loops on objects that are read often ([[b1-hidden-classes]]).

## `void`: evaluate, then discard

`void expr` evaluates `expr`, ignores its value, and returns `undefined`. Any side effects of the expression still happen:

```javascript title="void-basics.js"
let n = 0;
const result = void n++;
console.log(result, n, typeof void 0, void 'anything');
console.log(void 1 + 1);
```

```output
undefined 1 undefined undefined
NaN
```

`n++` ran — `n` is now 1 — but the expression's value was discarded. The last line is a precedence reminder: `void` is a unary operator, so `void 1 + 1` means `(void 1) + 1`, which is `undefined + 1`, which is `NaN`. Write `void (1 + 1)` if you mean the whole expression.

### Why `void 0` exists

`void 0` is the shortest expression that is guaranteed to produce `undefined`. That guarantee used to matter. `undefined` is not a keyword; it is a property of the global object, and before ES5 (2009) that property could be reassigned. Today the global `undefined` is read-only, but the name can still be **shadowed** by a local variable:

```javascript title="shadow-undefined.js"
function f() {
  const undefined = 'surprise';   // legal: undefined is not a reserved word
  return [undefined, void 0];
}
console.log(f());
```

```output
[ 'surprise', undefined ]
```

No sensible code does this, so in handwritten code plain `undefined` is clearer. You will still see `void 0` constantly in **compiled output**: minifiers use it because it is three characters shorter than `undefined`, and compilers such as TypeScript and Babel use it in down-levelled optional chaining and nullish coalescing because it cannot be shadowed.

### Legitimate modern uses

**Arrow functions that must not return a value.** A concise arrow function returns its expression. Sometimes that leaks a value where none is expected — for example, a callback whose return value has meaning to the caller. `void` makes "no return value" explicit:

```javascript title="void-arrow.js"
const log = [];
const record = (x) => log.push(x);          // returns the new length
const recordQuietly = (x) => void log.push(x);

console.log(record('a'), recordQuietly('b'), log);
```

```output
1 undefined [ 'a', 'b' ]
```

React effect callbacks are the classic case: an effect may return only a cleanup function or nothing, so `useEffect(() => void subscribe(), [])` avoids accidentally returning whatever `subscribe` returns.

**Marking a promise as intentionally not awaited.** `void saveDraft();` tells readers — and the typescript-eslint rule `no-floating-promises`, which accepts `void` by default — that you deliberately started async work without waiting for it. It does not catch rejections, so the promise should handle its own errors.

**Legacy `javascript:void(0)` links.** Old HTML used `<a href="javascript:void(0)">` as a link that does nothing when clicked, relying on scripts attached elsewhere. `void` was needed because if a `javascript:` URL's expression produces a string, the browser replaces the page with it. A `<button type="button">` is the correct element for an action today. (This is browser behaviour and was not run for this lesson.)

## `instanceof`: is the prototype in the chain?

`obj instanceof C` evaluates to `true` if `C.prototype` appears anywhere in `obj`'s prototype chain. It is the operator for "was this object made by `C`, or by a subclass of `C`?" — with some important caveats. It has its own detailed lesson, [[b1-instanceof]]; this section covers what you need alongside the other three operators.

```javascript title="instanceof-basics.js"
class Animal {}
class Dog extends Animal {}
const rex = new Dog();

console.log(rex instanceof Dog, rex instanceof Animal, rex instanceof Object);
console.log('text' instanceof String, new String('text') instanceof String);
console.log(Object.create(null) instanceof Object);

Object.setPrototypeOf(rex, Array.prototype);
console.log(rex instanceof Dog, rex instanceof Array);
```

```output
true true true
false true
false
false true
```

Read the lines as prototype-chain searches. `rex`'s chain is `Dog.prototype` → `Animal.prototype` → `Object.prototype`, so all three checks succeed. A primitive string has **no** prototype chain of its own, so `'text' instanceof String` is `false`, while a `String` wrapper object is `true`. An object created with `Object.create(null)` has an empty chain, so it is not even an `instanceof Object`. And because the check looks only at the chain, replacing `rex`'s prototype makes it stop being a `Dog` and start being an `Array` — `instanceof` checks ancestry as it is *now*, not how the object was created.

### When `instanceof` throws or is overridden

The right-hand side must be something `instanceof` can use. A non-object throws `TypeError: Right-hand side of 'instanceof' is not an object`, and an object that is not callable (and has no custom check) throws `TypeError: Right-hand side of 'instanceof' is not callable`. That second error commonly appears when an import resolves to `undefined` or a plain object instead of a class.

A class can replace the whole algorithm by defining a static `Symbol.hasInstance` method. `instanceof` then calls it and uses its truthiness:

```javascript title="has-instance.js"
class Even {
  static [Symbol.hasInstance](n) {
    return n % 2 === 0;
  }
}
console.log(2 instanceof Even, 3 instanceof Even);
```

```output
true false
```

This is rare in application code, but it means `instanceof` is not always a prototype check.

### Realms: when the same class is a different object

Every window, iframe, worker and Node.js `vm` context has its own **realm** with its own copy of the built-ins. An array created in an iframe is built from *that* realm's `Array.prototype`, which is a different object from the main page's:

```javascript title="realms.js"
const vm = require('node:vm');
const foreignArray = vm.runInNewContext('[]');
console.log(foreignArray instanceof Array, Array.isArray(foreignArray));
```

```output
false true
```

`Array.isArray` checks what the value *is* rather than its ancestry, so it works across realms. The same problem appears when two copies of a library are bundled: `err instanceof LibError` fails for errors created by the other copy. For built-ins, prefer `Array.isArray`, `typeof` and duck typing; for your own types, a brand check (`#field in obj`) or a discriminating property such as `kind: 'dog'` is more robust.

## How they work internally

Each operator maps to a small, well-defined algorithm in the specification, and each has a matching `Reflect` function and `Proxy` trap. That correspondence is a useful way to remember what they really do:

| Operator | Specification steps | `Reflect` equivalent | `Proxy` trap |
|---|---|---|---|
| `key in obj` | Throw if `obj` is not an object; convert `key` with ToPropertyKey; call `obj.[[HasProperty]](key)`, which walks the prototype chain | `Reflect.has(obj, key)` | `has` |
| `delete obj.key` | Call `obj.[[Delete]](key)`; if it returns `false` in strict mode, throw `TypeError` | `Reflect.deleteProperty(obj, key)` (returns `false`, never throws) | `deleteProperty` |
| `void expr` | Evaluate `expr`, call GetValue on it (so getters run), return `undefined` | none | none |
| `obj instanceof C` | If `C[Symbol.hasInstance]` exists, call it; otherwise require `C` callable and walk `obj`'s chain comparing each prototype with `C.prototype` | none (`Function.prototype[Symbol.hasInstance]` is the default) | `getPrototypeOf` (on the object being tested) |

The proxy column explains some real behaviour. Vue 3's reactivity system is built on proxies, and it intercepts `has` and `deleteProperty` so that `'key' in state` and `delete state.key` are tracked as reads and writes. A `has` trap runs whenever `in` is used on a proxy:

```javascript title="proxy-in.js"
const flags = new Proxy({}, {
  has(target, key) {
    console.log('has trap called for', String(key));
    return key === 'beta';
  },
});
console.log('beta' in flags);
```

```output
has trap called for beta
true
```

Precedence ties the four together. `void`, `delete` and `typeof` are unary operators, which bind tightly: `delete obj.a.b` deletes `b` from `obj.a`, and `void a + b` is `(void a) + b`. `in` and `instanceof` share the relational level with `<` and `>`, below unary operators — which is why `!key in obj` negates the key, not the test. See [[b1-precedence]].

## Worked example: preparing a user record for an API response

A server loads a user record and must send it to the browser. The record may contain sensitive fields, may have optional fields set to `undefined`, and must be validated before use.

```javascript title="public-user.js"
const SENSITIVE = ['passwordHash', 'resetToken'];

function toPublicUser(record) {
  if (typeof record !== 'object' || record === null) {
    throw new TypeError('record must be an object');
  }
  // own keys only: inherited names like toString are not user data
  if (!Object.hasOwn(record, 'id')) {
    throw new Error('record has no id');
  }

  const { passwordHash, resetToken, ...publicUser } = record;   // copy without secrets

  for (const key of Object.keys(publicUser)) {
    if (publicUser[key] === undefined) delete publicUser[key];  // drop empty optionals
  }
  return publicUser;
}

const record = { id: 7, name: 'Ada', passwordHash: 'x9f', nickname: undefined };
const result = toPublicUser(record);
console.log(result);
console.log(SENSITIVE.some((k) => k in result), 'passwordHash' in record);

try {
  toPublicUser(Object.create({ id: 99 }));
} catch (e) {
  console.log(e.message);
}
```

```output
{ id: 7, name: 'Ada' }
false true
record has no id
```

Walk through the decisions. The type check comes first because `Object.hasOwn(null, 'id')` would throw a less helpful error. The `id` check uses `Object.hasOwn`, not `in`: the last call passes an object that only *inherits* an `id`, which `in` would accept but which is not a real record. Rest destructuring builds a new object without the sensitive fields, so the caller's `record` keeps its `passwordHash` — confirmed by the last `true`. Finally, `delete` is used on the fresh copy, which nobody else references, to drop keys whose value is `undefined`. (`JSON.stringify` would omit them anyway, but other serialisers do not.) The `SENSITIVE.some(k => k in result)` check is a cheap self-test that no secret survived.

Notice what was *not* used. `delete record.passwordHash` would have mutated the caller's object — a surprising side effect for a function named `toPublicUser`. And `record.id !== undefined` would have wrongly accepted the inherited `id`.

## In real systems

**Feature detection.** Code that runs in many environments checks capabilities with `in`: `'IntersectionObserver' in window`, `'serviceWorker' in navigator`. Inherited properties count, which is exactly right — these APIs usually live on prototypes. (Browser checks like these were not run for this lesson.)

**API serialisation and logging.** Rest destructuring removes sensitive fields before data leaves a service. `delete` is used on objects the function itself created, never on the caller's input.

**State management.** Immutable updates in React and Redux remove keys with destructuring, `const { [id]: removed, ...rest } = byId;`, rather than `delete`, so that the old state object is unchanged and the change can be detected by reference.

**Error handling.** `catch (e) { if (e instanceof ValidationError) ... }` dispatches on error classes. Libraries that may be bundled twice often add a brand property or a static `isXxx` helper because `instanceof` can fail across copies.

**Fire-and-forget calls.** `void` marks intentionally un-awaited promises (`void analytics.track(event)`) in codebases that lint for floating promises.

## Trade-offs and alternatives

| Task | Operator | Often better | Why |
|---|---|---|---|
| Does this data object have key `k`? | `k in obj` | `Object.hasOwn(obj, k)` | Ignores inherited names like `toString` |
| Does this object support method `m`? | `m in obj` or `typeof obj.m === 'function'` | either | Inherited methods are fine here |
| Remove a key from your own object | `delete obj.k` | `delete`, or a `Map` for dynamic keys | `Map` is built for frequent removal |
| Produce a copy without key `k` | — | `const { k, ...rest } = obj` | No mutation |
| Remove an array element | `delete arr[i]` | `splice`, `filter`, `toSpliced` | `delete` leaves a hole |
| Get `undefined` | `void 0` | `undefined` | Clearer; `void 0` belongs in compiled output |
| Is this an array? | `x instanceof Array` | `Array.isArray(x)` | Works across realms |
| Was this object made by my class? | `x instanceof C` | `#brand in x` for strong guarantees | Cannot be faked with `setPrototypeOf` |

## Common mistakes

> [!MISTAKE] Negating `in` or `instanceof` without parentheses
> `if (!'token' in session)` evaluates `!'token'` first, giving `false`, then checks for a property named `'false'`. Write `if (!('token' in session))`. ESLint's `no-unsafe-negation` rule catches this.

**Using `in` to check data keys.** `'constructor' in parsedJson` is `true` for every plain object. Use `Object.hasOwn`.

**Using `in` on a value that may be a primitive.** `'x' in 'text'` and `'x' in null` throw a `TypeError`. Check the type first.

**Expecting `delete` to shorten an array.** It leaves a hole and keeps `length`. Use `splice` or `filter`.

**Expecting `delete` to remove inherited properties.** It only removes own properties; deleting an own property can *reveal* an inherited one with the same name.

**Ignoring `delete`'s return value in sloppy mode.** A failed delete returns `false` silently. Strict mode turns it into a `TypeError`, which is one more reason to write modules and classes.

**Writing `void a + b` and expecting `undefined`.** It is `(void a) + b`.

**Relying on `instanceof` across frames or package copies.** Use `Array.isArray`, brand checks or discriminant properties.

## Interview perspective

These operators appear in "what does this print?" questions and in questions about object design. The strongest answers explain each operator in terms of own properties, the prototype chain, and configurability.

> [!INTERVIEW] What a strong answer sounds like
> "`in` checks whether a property exists anywhere on the prototype chain, so `'toString' in {}` is true; `Object.hasOwn` checks only own properties. `delete` removes an own, configurable property and returns `true` even if it didn't exist; in strict mode deleting a non-configurable property throws. `void` evaluates and returns `undefined`. `instanceof` walks the prototype chain looking for `C.prototype`, which is why it fails across realms and for primitives."

Questions you should be able to answer:

- **What is the difference between `'a' in obj` and `obj.a !== undefined`?** `in` is true for a property that exists with value `undefined`; the comparison is not. Both include inherited properties.
- **What does `delete` return for a missing property?** `true`.
- **Why does `delete arr[0]` not change `arr.length`?** It removes the property at index 0 but does not re-index; `length` is a separate, non-configurable property.
- **Why does `void 0` appear in minified code?** It is a shorter, unshadowable way to write `undefined`.
- **Why is `[] instanceof Object` true but `Object.create(null) instanceof Object` false?** The first has `Object.prototype` in its chain; the second has no chain at all.
- **How would you check that a value is an array from an iframe?** `Array.isArray`.

```quiz
Q: `const o = Object.create({ a: 1 }); o.b = undefined;` What does `console.log('a' in o, 'b' in o, Object.hasOwn(o, 'a'))` print?
- [ ] `false true false`
- [x] `true true false`
- [ ] `true false false`
- [ ] `true true true`
> `in` walks the prototype chain, so the inherited `a` counts, and it ignores values, so `b` counts even though it holds `undefined`. `Object.hasOwn` looks only at own properties, and `a` is inherited.

Q: In strict mode, what does `delete Object.freeze({ x: 1 }).x` do?
- [ ] Returns `true` and removes `x`
- [ ] Returns `false`
- [x] Throws a TypeError
- [ ] Is a SyntaxError
> Freezing makes `x` non-configurable. In sloppy mode `delete` would return `false`; strict mode turns the failed delete into a `TypeError`. The syntax is valid because `delete` is applied to a property, not a bare identifier.

Q: What does `const arr = [1, 2, 3]; delete arr[2]; console.log(arr.length, 2 in arr);` print?
- [ ] `2 false`
- [x] `3 false`
- [ ] `3 true`
- [ ] `2 true`
> `delete` removes the property at index 2 but does not change `length`, so the array becomes `[1, 2, <1 empty item>]`. The index no longer exists, so `2 in arr` is `false`.

Q: Which expression is `true`?
- [ ] `'hello' instanceof String`
- [ ] `Object.create(null) instanceof Object`
- [x] `new Map() instanceof Object`
- [ ] `void 'x' === 'x'`
> A `Map`'s prototype chain ends with `Object.prototype`. A primitive string has no prototype chain for `instanceof` to search, `Object.create(null)` has an empty chain, and `void 'x'` is `undefined` (the expression is `(void 'x') === 'x'`, which is `false`).
```

## Practice

1. **Three checks.** Build an object where `key in obj`, `Object.hasOwn(obj, key)` and `obj[key] !== undefined` give three different combinations of results, and explain each.
2. **Safe omit.** Write `omit(obj, keys)` that returns a copy without the given keys, does not mutate `obj`, and preserves symbol keys. Compare a version using `delete` on a copy with one using `Object.entries` and `filter`.
3. **Strict versus sloppy.** Write two scripts, one with `'use strict'`, that try to delete a frozen property, `Math.PI` and a `var` variable. Record what each does.
4. **Capability check.** Write `canIterate(value)` that returns `true` for arrays, strings, Maps and Sets, using `in` with `Symbol.iterator` where appropriate, and without throwing for primitives or `null`.
5. **Brand check.** Rewrite an `instanceof`-based `isMoney(x)` helper with a private field and `#field in x`, and show an object that fools the first version but not the second.

## Quick revision {#quick-revision}

- `key in obj`: true if the property exists anywhere on the prototype chain, regardless of value; key converted to string or symbol; right side must be an object, else `TypeError`.
- `Object.hasOwn(obj, key)`: own properties only — use it for data. `obj.k !== undefined` treats a stored `undefined` as missing.
- Arrays: `i in arr` checks an index exists (holes are absent); use `includes` for values. `#field in obj` (ES2022) is a private brand check.
- `delete obj.k`: removes an own, configurable property; returns `true` (also if it never existed). Non-configurable: `false` in sloppy mode, `TypeError` in strict. `delete x` on a bare identifier is a `SyntaxError` in strict mode.
- `delete arr[i]` leaves a hole and keeps `length`; use `splice`/`filter`/`toSpliced`. Prefer rest destructuring for copies without keys, `Map` for dynamic keys.
- `void expr`: evaluates, returns `undefined`; `void a + b` is `(void a) + b`. Uses: compiled output, arrows with no return value, `void promise`.
- `obj instanceof C`: is `C.prototype` on `obj`'s chain? Primitives are `false`; `Symbol.hasInstance` overrides; fails across realms — use `Array.isArray`.
- `!` binds tighter than `in`/`instanceof`: write `!(k in o)`.
- Reflect/Proxy pairs: `in` ↔ `Reflect.has`/`has`; `delete` ↔ `Reflect.deleteProperty`/`deleteProperty`.

## Key takeaways {#key-takeaways}

- `in` asks about existence across the whole prototype chain; for data keys, `Object.hasOwn` is usually what you mean.
- `delete` removes only own, configurable properties, never shrinks arrays, and fails silently outside strict mode.
- `void` discards a value; today it mainly appears in compiled code, value-free arrow functions and fire-and-forget promises.
- `instanceof` is a prototype-chain search, so it is misleading for primitives, changed prototypes and values from other realms.
- Many uses of these operators have clearer modern replacements: `Object.hasOwn`, rest destructuring, `splice`, `Map`, `Array.isArray` and private brand checks.
