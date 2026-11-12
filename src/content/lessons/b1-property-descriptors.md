---
summary: Every JavaScript property is more than a key and a value — it is a small record, the property descriptor, that also says whether the value can change, whether the property is listed, and whether its settings can be changed or the property deleted. You will learn to read and write descriptors with Object.defineProperty, what each of the three flags controls, and how they explain read-only built-ins, Object.freeze and silent assignment failures.
difficulty: intermediate
minutes: 55
objectives:
  - Explain the two kinds of property descriptor (data and accessor) and the fields each one has
  - Read any property's descriptor and predict its flags from how the property was created
  - Use Object.defineProperty correctly, including the difference between creating a property (missing flags default to false) and updating one (missing flags are kept)
  - Explain exactly what writable, enumerable and configurable each permit, and which changes remain possible once configurable is false
  - Debug silent assignment failures and "Cannot redefine property" errors by inspecting descriptors
---

## Introduction

Try to change a constant the language gives you:

```javascript title="math-pi.js"
Math.PI = 4;
console.log(Math.PI);
delete Math.PI;
console.log(Math.PI);
```

```output
3.141592653589793
3.141592653589793
```

No error, and nothing changed. `Math.PI` is an ordinary property on an ordinary object, yet assignment and `delete` both fail silently. Meanwhile `Math.PI` does not show up in `Object.keys(Math)`, and if you define your own `Math.TAU = 6.28`, that one is listed, can be changed and can be deleted.

The difference is not in the values. It is in the **property descriptor**: a small record attached to every property that holds, alongside the value, three yes/no settings. For `Math.PI`, all three are off: the value cannot be changed (**writable** is false), the property is not listed (**enumerable** is false), and the property cannot be deleted or reconfigured (**configurable** is false). For your `Math.TAU`, created by assignment, all three are on.

Most of the time you never think about descriptors, because properties created the normal way — object literals, assignment, class fields — get all three flags turned on, which means "a normal, editable, visible property". Descriptors become important when you need something else: a read-only value, a property hidden from `Object.keys` and `JSON.stringify`, a computed property backed by functions, or a property nobody can delete. They also explain behaviour you will meet regardless: why `Object.freeze` works, why `class` methods do not show up in `for...in`, why assigning to an array's `length` truncates it but `delete arr.length` does nothing, and where the error `TypeError: Cannot redefine property` comes from.

This lesson teaches descriptors as a whole, then the two nested concepts that use them: [[b1-define-property|`Object.defineProperty`]], the tool for writing descriptors, and [[b1-writable-enumerable-configurable|the three flags]] in detail.

## Before you start

- **Own vs inherited properties** — descriptors belong to own properties; the lookup through prototypes is explained in [[b1-own-vs-inherited]].
- **Enumerable properties** — one of the three flags; this lesson summarises it and [[b1-enumerable-properties]] covers it fully.
- **Object literals** — including getter/setter syntax `{ get x() {} }`, which creates the second kind of descriptor. See [[b1-object-literals]]; accessors are taught in depth in [[b1-getters-setters]].
- **Strict mode** — writes that violate a descriptor throw in strict mode and fail silently in sloppy mode. See [[b1-strict-mode]]. Snippets whose title ends in `.mjs` run as ES modules, which are always strict; `.js` snippets run in sloppy mode.

All snippets were run in Node.js 22. The descriptor rules are part of the ECMAScript standard and have been stable since ES5 (2009); the behaviour is the same in every current browser.

## The intuition

Picture the object as a **table with one row per property**. The key is the first column. A simple mental model gives every row just one more column — the value — but the real table has more:

| key | value | writable | enumerable | configurable |
|---|---|---|---|---|
| `name` | `'Ada'` | true | true | true |
| `id` | `7` | **false** | true | **false** |
| `_cache` | `{…}` | true | **false** | true |

Each row is a descriptor. The three boolean columns are **switches** that answer three different questions:

- **writable** — may assignment change the value?
- **enumerable** — should this row be listed when someone asks for all the properties?
- **configurable** — may the switches themselves be changed, or the row deleted?

Some rows use a different layout: instead of a value they have two functions, `get` and `set`, that run when the property is read or written. Those are **accessor properties**, and they have no `value` or `writable` column at all.

The table picture is accurate as far as it goes. Where it stops working: engines do not literally store a table per object — they share structure between objects with the same layout — and the switches are not independent in every combination, because once `configurable` is off, most changes to the other switches are refused too.

## The two kinds of descriptor

Every own property is exactly one of two kinds.

A **data property** stores a value. Its descriptor has four fields: `value`, `writable`, `enumerable` and `configurable`.

An **accessor property** stores two functions. Its descriptor has four fields: `get`, `set`, `enumerable` and `configurable`. Reading the property calls `get` (or yields `undefined` if there is none); assigning to it calls `set` (or fails if there is none).

`enumerable` and `configurable` are shared by both kinds. `value`/`writable` belong only to data properties, and `get`/`set` only to accessors. A descriptor that mixes them is an error:

```javascript title="mixed-descriptor.js"
try {
  Object.defineProperty({}, 'x', { value: 1, get() { return 2; } });
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
```

The rule makes sense once you see what each kind means: a data property's value *is* stored; an accessor's value is *computed* on every read. A property cannot be both.

### Reading descriptors

`Object.getOwnPropertyDescriptor(obj, key)` returns the descriptor of one own property as a plain object, or `undefined` if the object does not own that key — even if it can inherit it. `Object.getOwnPropertyDescriptors(obj)` (ES2017) returns all of them at once, keyed by property name.

```javascript title="read-descriptors.js"
const user = {
  name: 'Ada',
  get initials() { return this.name[0]; },
};

console.log(Object.getOwnPropertyDescriptor(user, 'name'));
console.log(Object.getOwnPropertyDescriptor(user, 'initials'));
console.log(Object.getOwnPropertyDescriptor(user, 'toString'));   // inherited, not own
console.log(Object.getOwnPropertyDescriptor(Math, 'PI'));
```

```output
{ value: 'Ada', writable: true, enumerable: true, configurable: true }
{
  get: [Function: get initials],
  set: undefined,
  enumerable: true,
  configurable: true
}
undefined
{
  value: 3.141592653589793,
  writable: false,
  enumerable: false,
  configurable: false
}
```

A descriptor you *read* is always complete: it has all four fields of its kind. A descriptor you *write* (with `defineProperty`) may leave fields out, and what happens to the missing ones is the most important detail of the next section. The returned object is a fresh copy; changing it does nothing to the property.

### What flags does a property start with?

The flags a property gets depend entirely on how it was created. This table is worth knowing well, because it explains a lot of everyday behaviour:

| How the property was created | writable | enumerable | configurable |
|---|---|---|---|
| Object literal `{ a: 1 }` or assignment `obj.a = 1` | true | true | true |
| Class field `a = 1` | true | true | true |
| Getter/setter in an object literal | — | true | true |
| Class method `m() {}` (on the prototype) | true | false | true |
| Class getter/setter (on the prototype) | — | false | true |
| `Object.defineProperty` with fields omitted | false | false | false |
| Built-in methods such as `Array.prototype.push` | true | false | true |
| Built-in constants `Math.PI`, `globalThis.undefined`, `NaN`, `Infinity` | false | false | false |
| A function's `name` and `length` | false | false | true |
| A function's `prototype` | true | false | false |
| A class's `prototype` | false | false | false |
| An array's `length` | true | false | false |
| An array element `arr[0]` | true | true | true |

Two patterns stand out. Properties *you* create normally are fully open. Properties the *language* creates for its own machinery are non-enumerable (so they stay out of `for...in` and `Object.keys`), and constants are fully locked.

```quiz
Q: What does `Object.getOwnPropertyDescriptor([], 'push')` return?
- [ ] A data descriptor with `writable: true`
- [ ] An accessor descriptor with a `get` function
- [x] `undefined`
- [ ] It throws, because arrays have no descriptors
> `push` is not an own property of the array; it is inherited from `Array.prototype`. `getOwnPropertyDescriptor` only reports own properties, so it returns `undefined`. `Object.getOwnPropertyDescriptor(Array.prototype, 'push')` returns a data descriptor with `writable: true, enumerable: false, configurable: true`.
```

## Object.defineProperty {#b1-define-property}

`Object.defineProperty(obj, key, descriptor)` creates a new own property on `obj`, or changes an existing one, so that it matches the descriptor you pass. Where assignment (`obj.key = value`) can only set a value and always produces an open, enumerable property, `defineProperty` lets you specify every field of the descriptor: the value or the getter/setter, and each of the three flags. It returns `obj` itself, and it throws a `TypeError` if the change is not allowed.

Think of assignment as dropping a value onto an object, and `defineProperty` as **filling in the property's whole form**.

```javascript title="define-basic.mjs"
const order = { total: 40 };

Object.defineProperty(order, 'id', {
  value: 7,
  writable: false,
  enumerable: true,
  configurable: false,
});

console.log(order.id, Object.keys(order));
try {
  order.id = 8;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
try {
  Object.defineProperty(order, 'id', { value: 9 });
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
7 [ 'total', 'id' ]
TypeError: Cannot assign to read only property 'id' of object '#<Object>'
TypeError: Cannot redefine property: id
```

The `id` property is readable and listed like any other, but neither assignment nor a second `defineProperty` can change it. Because the snippet is an ES module, the failed assignment throws; in a sloppy-mode script it would fail silently and `order.id` would stay `7`. The failed `defineProperty`, by contrast, throws in *both* modes — `defineProperty` always reports failure with an exception.

### Creating versus updating: what missing fields mean

This is the rule most people get wrong, and the one interviewers ask about. When you leave a field out of the descriptor, its meaning depends on whether the property already exists:

- **Creating a new property:** every missing field takes its default — `false` for the three flags, `undefined` for `value`, `get` and `set`.
- **Updating an existing property:** every missing field **keeps its current value**. Only the fields you mention change.

```javascript title="create-vs-update.js"
const o = { a: 1 };

Object.defineProperty(o, 'b', { value: 2 });          // create: flags default to false
console.log(Object.getOwnPropertyDescriptor(o, 'b'));

Object.defineProperty(o, 'a', { enumerable: false }); // update: other fields are kept
console.log(Object.getOwnPropertyDescriptor(o, 'a'));
```

```output
{ value: 2, writable: false, enumerable: false, configurable: false }
{ value: 1, writable: true, enumerable: false, configurable: true }
```

The first call is the trap in practice. Someone writes `Object.defineProperty(obj, 'count', { value: 0 })` intending "add a property", and gets a property that is read-only, hidden from `Object.keys` and impossible to delete or fix later. Later `obj.count++` silently does nothing in sloppy code. When you create a property with `defineProperty`, **state every flag you want to be true**.

The second call shows the update rule: only `enumerable` changed; `value`, `writable` and `configurable` kept their existing values. It also means a partial descriptor is a safe way to change one setting — provided the property is still configurable, as the next nested section explains.

### defineProperty does not assign

`defineProperty` and assignment are two different internal operations. Assignment runs the **[[Set]]** algorithm: it looks up the prototype chain, calls inherited setters, and refuses if an inherited property is read-only. `defineProperty` runs **[[DefineOwnProperty]]** on the object directly: it never looks at the prototype, never calls a setter, and ignores whether an inherited property with the same name is writable.

```javascript title="define-vs-assign.js"
const proto = {
  set name(v) { console.log('setter ran with', v); },
};
const a = Object.create(proto);
const b = Object.create(proto);

a.name = 'Ada';                               // assignment calls the inherited setter
Object.defineProperty(b, 'name', {            // definition creates an own property
  value: 'Ada', writable: true, enumerable: true, configurable: true,
});

console.log(Object.hasOwn(a, 'name'), Object.hasOwn(b, 'name'), b.name);
```

```output
setter ran with Ada
false true Ada
```

This difference is why `defineProperty` is the tool for shadowing a read-only inherited property (the "override mistake" described in [[b1-own-vs-inherited]]), and why class fields — which the language defines with [[DefineOwnProperty]] semantics, not assignment — do not trigger a setter inherited from a parent class. [[b1-getters-setters]] shows that consequence.

### Defining many properties, and copying descriptors

`Object.defineProperties(obj, descriptors)` defines several properties in one call; the second argument maps each key to its descriptor. `Object.create(proto, descriptors)` does the same while creating a new object.

Combined with `Object.getOwnPropertyDescriptors`, these give you a copy that preserves descriptors exactly — something spread and `Object.assign` cannot do, because they *read* each property (calling getters) and *write* plain data properties.

```javascript title="exact-copy.js"
const source = {
  x: 1,
  get now() { return 'computed on read'; },
};

const spreadCopy = { ...source };
const exactCopy = Object.create(
  Object.getPrototypeOf(source),
  Object.getOwnPropertyDescriptors(source),
);

console.log(Object.getOwnPropertyDescriptor(spreadCopy, 'now'));
console.log(Object.getOwnPropertyDescriptor(exactCopy, 'now'));
```

```output
{
  value: 'computed on read',
  writable: true,
  enumerable: true,
  configurable: true
}
{
  get: [Function: get now],
  set: undefined,
  enumerable: true,
  configurable: true
}
```

The spread copy turned the getter into a frozen snapshot of its result; the exact copy kept the getter. The exact copy is still shallow — nested objects are shared — as discussed in [[b1-copying-objects]].

### When defineProperty throws

`defineProperty` throws a `TypeError` when:

- the target is not an object (`Object.defineProperty(1, 'x', {})`);
- the descriptor is not an object, or mixes `value`/`writable` with `get`/`set`, or `get`/`set` is neither a function nor `undefined`;
- the property does not exist and the object is **non-extensible** (after `Object.preventExtensions`, `seal` or `freeze`);
- the property exists, is **non-configurable**, and the change is one that `configurable: false` forbids (the rules are in the next section).

If you would rather get a boolean than an exception, `Reflect.defineProperty(obj, key, desc)` performs the same operation and returns `true` or `false`. That is the style used inside Proxy handlers ([[b1-reflect]]).

```javascript title="define-failures.js"
const sealed = Object.preventExtensions({});
try {
  Object.defineProperty(sealed, 'x', { value: 1 });
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
console.log(Reflect.defineProperty(sealed, 'x', { value: 1 }));
```

```output
TypeError: Cannot define property x, object is not extensible
false
```

> [!WARNING] The descriptor object is read like any other object
> `defineProperty` checks for each field with an ordinary lookup, so inherited fields count. If something has added `enumerable: true` to `Object.prototype` (prototype pollution), every `defineProperty` call that omits `enumerable` will make the property enumerable. Security-sensitive libraries pass descriptors created with `{ __proto__: null, … }` or `Object.create(null)` to rule this out. See [[b1-prototype-pollution]].

### Arrays: the special `length` property

Arrays are **exotic objects**: they override [[DefineOwnProperty]] to keep `length` consistent with the elements. `length` is writable, non-enumerable and non-configurable. Defining (or assigning) a smaller `length` deletes the elements beyond it. Making `length` non-writable stops the array from growing: `push` throws, and assigning to a new index fails silently in sloppy mode.

```javascript title="array-length.js"
const arr = [1, 2, 3, 4];
Object.defineProperty(arr, 'length', { value: 2 });
console.log(arr);

Object.defineProperty(arr, 'length', { writable: false });
try {
  arr.push(5);
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
arr[5] = 1;                                   // sloppy mode: silently ignored
console.log(arr, arr.length);
```

```output
[ 1, 2 ]
TypeError: Cannot assign to read only property 'length' of object '[object Array]'
[ 1, 2 ] 2
```

### When to reach for defineProperty

Use it when you need a property that assignment cannot produce: read-only, non-enumerable, non-configurable, or an accessor whose name is only known at runtime. Typical cases are library code that attaches hidden metadata, polyfills that add non-enumerable methods to built-in prototypes, and frameworks that wrap properties in getters and setters (Vue 2's reactivity system worked this way).

Do not use it for ordinary instance data. A class field or a plain assignment is shorter, produces the open property you almost always want, and is easier to read. For "make this whole object read-only", `Object.freeze` expresses the intent directly ([[b1-object-freeze-seal]]). And for compile-time read-only checks in TypeScript, `readonly` is the right tool — it disappears at runtime and does not create a non-writable property ([[b2-readonly-properties]]).

```quiz
Q: `const o = { n: 1 }; Object.defineProperty(o, 'n', { writable: false });` What is `Object.getOwnPropertyDescriptor(o, 'n').enumerable` afterwards?
- [ ] `false`, because `defineProperty` defaults missing flags to `false`
- [x] `true`, because updating an existing property keeps the fields you do not mention
- [ ] `undefined`, because the descriptor is now incomplete
- [ ] It throws, because `n` was created by a literal
> The `false` defaults apply only when `defineProperty` creates a new property. `n` already existed with all flags `true`, so the update changes only `writable` and keeps `enumerable: true` and `configurable: true`. Literal properties are configurable, so the update is allowed.

Q: Why does `Object.defineProperty(child, 'x', { value: 1, writable: true, enumerable: true, configurable: true })` succeed when `child.x = 1` fails?
- [ ] `defineProperty` ignores strict mode
- [x] `defineProperty` defines an own property directly and never consults the prototype, while assignment refuses when an inherited `x` is read-only
- [ ] Assignment always fails on objects created with `Object.create`
- [ ] `defineProperty` changes the prototype's `x`
> Assignment runs [[Set]], which looks up the chain and fails if it finds a non-writable inherited `x`. `defineProperty` runs [[DefineOwnProperty]] on `child` itself, so the inherited property is irrelevant; it creates an own `x` and leaves the prototype unchanged.
```

## writable / enumerable / configurable {#b1-writable-enumerable-configurable}

Every property has three boolean flags in its descriptor. **`writable`** decides whether assignment may change a data property's value. **`enumerable`** decides whether the property is listed by `Object.keys`, `for...in`, spread and `JSON.stringify`. **`configurable`** decides whether the property may be deleted and whether its descriptor may be changed. Properties created by literals, assignment and class fields have all three set to `true`; `Object.defineProperty` sets any you leave out to `false`.

A short way to remember them: **writable = edit the value; enumerable = list me; configurable = edit the switches or delete me.**

The three flags are independent questions, but they interact through `configurable`, which guards the other two. This section takes each flag in turn and then shows how they combine.

### writable

`writable` exists only on data properties. When it is `false`, assignment cannot change the value: in sloppy mode the assignment is silently ignored; in strict mode it throws a `TypeError`. Reading is unaffected.

```javascript title="writable.mjs"
const config = {};
Object.defineProperty(config, 'port', {
  value: 8080, writable: false, enumerable: true, configurable: true,
});

try {
  config.port = 3000;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
console.log(config.port);

// configurable is still true, so the property can be redefined
Object.defineProperty(config, 'port', { value: 3000 });
console.log(config.port);
```

```output
TypeError: Cannot assign to read only property 'port' of object '#<Object>'
8080
3000
```

The assignment threw and left the value at `8080`, but the second `defineProperty` replaced it with `3000`. That is the first thing to learn about `writable`: **`writable: false` blocks assignment, not redefinition**. While the property is still configurable, `defineProperty` can change its value or even flip `writable` back to `true`. Only `writable: false` *together with* `configurable: false` makes a value truly constant.

The second thing: `writable` protects the link between the key and its value, not the value itself. If the value is an object, the object's contents stay mutable.

```javascript title="writable-shallow.js"
const settings = {};
Object.defineProperty(settings, 'limits', {
  value: { max: 10 }, writable: false, enumerable: true, configurable: false,
});

settings.limits = { max: 99 };   // ignored: the key cannot point at another object
settings.limits.max = 99;        // allowed: the object it points at is mutable
console.log(settings.limits);
```

```output
{ max: 99 }
```

This is the same shallowness that `Object.freeze` has, and for the same reason: `freeze` works by setting `writable: false` on every property, one level deep.

Accessor properties have no `writable` flag. Whether you can assign to one depends on whether it has a `set` function; a getter-only accessor behaves like a read-only property.

### enumerable

`enumerable` decides whether a property is included when code lists, copies or serialises an object: `for...in`, `Object.keys`/`values`/`entries`, spread, `Object.assign` and `JSON.stringify` skip non-enumerable properties. It has no effect on reading, writing, `in` or `Object.hasOwn`, and it is not a privacy mechanism — `Object.getOwnPropertyNames` still lists the property and anyone can read it. The defaults, the full list of operations that respect it, and the `JSON.stringify(error)` example are taught in [[b1-enumerable-properties]].

In descriptor terms, the usual reason to turn it off is to attach something to an object that should not travel with its data:

```javascript title="enumerable.js"
const user = { id: 1, name: 'Ada' };
Object.defineProperty(user, 'loadedAt', {
  value: 1700000000000, writable: true, enumerable: false, configurable: true,
});

console.log(user.loadedAt, JSON.stringify(user), Object.keys(user));
```

```output
1700000000000 {"id":1,"name":"Ada"} [ 'id', 'name' ]
```

### configurable

`configurable` is the flag about the other flags. While it is `true`, you can delete the property and change any part of its descriptor with `defineProperty`, including switching it between a data property and an accessor. Once it is `false`:

- **`delete` fails** — it returns `false` in sloppy mode and throws a `TypeError` in strict mode.
- **`enumerable` can no longer change.**
- **The property cannot switch kind** between data and accessor.
- For an accessor, **`get` and `set` cannot be replaced**.
- For a data property, **`writable` can only go from `true` to `false`**, never back; and if `writable` is `false`, **the value can no longer change** either.

What remains possible is deliberately small: on a non-configurable but writable data property, you can still assign new values and you can still lock it further by setting `writable: false`. Redefining a property with exactly the same values it already has is also allowed, because it changes nothing.

```javascript title="configurable.js"
const o = {};
Object.defineProperty(o, 'k', {
  value: 1, writable: true, enumerable: true, configurable: false,
});

o.k = 2;                                              // still writable
console.log('assigned:', o.k);
console.log('delete returned', delete o.k, '- value', o.k);

const attempts = {
  'make non-enumerable': { enumerable: false },
  'switch to accessor': { get() { return 0; } },
  'lock writable': { writable: false },
  'unlock writable': { writable: true },
  'redefine same value': { value: 2 },
  'change value': { value: 3 },
};
for (const [label, desc] of Object.entries(attempts)) {
  try {
    Object.defineProperty(o, 'k', desc);
    console.log('ok     ', label);
  } catch (e) {
    console.log('refused', label, '-', e.message);
  }
}
```

```output
assigned: 2
delete returned false - value 2
refused make non-enumerable - Cannot redefine property: k
refused switch to accessor - Cannot redefine property: k
ok      lock writable
refused unlock writable - Cannot redefine property: k
ok      redefine same value
refused change value - Cannot redefine property: k
```

Read the results in order. Assignment still worked, because `writable` was `true`. `delete` returned `false` (sloppy mode, so no exception). Changing `enumerable` or switching to an accessor was refused. Locking `writable` to `false` was allowed — it only makes the property *more* restricted. After that, unlocking it was refused, redefining with the value it already had was accepted as a no-op, and changing the value was refused because the property was now both non-writable and non-configurable.

The rules form a **one-way ratchet**: a non-configurable property can only become more locked, never less. That is what makes `configurable: false` meaningful as a guarantee. If code you do not trust receives an object whose `id` is non-writable and non-configurable, it cannot change that `id` by any means — not by assignment, not by `defineProperty`, not by deleting and re-adding it.

The same table, written as rules:

| Change requested on a non-configurable property | Allowed? |
|---|---|
| Assign a new value (data property, `writable: true`) | Yes |
| `writable`: `true` → `false` | Yes |
| `writable`: `false` → `true` | No |
| Change `value` when `writable: false` | No (same value is a no-op and allowed) |
| Change `enumerable` | No |
| Data ↔ accessor | No |
| Replace `get` or `set` | No |
| `delete` | No |

> [!WARNING] Non-configurable does not mean read-only
> A property with `configurable: false` but `writable: true` can still have its value changed by any code that can reach it. If you want a constant, set both `writable: false` and `configurable: false`. This is exactly the difference between `Object.seal` (properties non-configurable, still writable) and `Object.freeze` (non-configurable and non-writable).

### How the flags combine

In practice you will use a handful of combinations:

| Intent | writable | enumerable | configurable | Typical source |
|---|---|---|---|---|
| Normal data | true | true | true | Literals, assignment, class fields |
| Hidden but editable | true | false | true | Library metadata, built-in methods |
| Read-only to assignment, but still redefinable | false | any | true | Function `name` and `length` |
| Constant | false | any | false | `Math.PI`, frozen objects |
| Cannot be removed, can change value | true | any | false | Sealed objects, array `length` |

`Object.freeze`, `Object.seal` and `Object.preventExtensions` are shortcuts that apply these flags to every own property and also mark the object non-extensible, so no new properties can be added:

| Operation | New properties | Existing: configurable | Existing data: writable |
|---|---|---|---|
| `Object.preventExtensions(o)` | Refused | Unchanged | Unchanged |
| `Object.seal(o)` | Refused | Set to `false` | Unchanged |
| `Object.freeze(o)` | Refused | Set to `false` | Set to `false` |

```javascript title="freeze-in-flags.js"
const frozen = Object.freeze({ a: 1, get g() { return 2; } });
console.log(Object.getOwnPropertyDescriptors(frozen));

const sealed = Object.seal({ a: 1 });
console.log(Object.getOwnPropertyDescriptor(sealed, 'a'), Object.isFrozen(sealed));
```

```output
{
  a: { value: 1, writable: false, enumerable: true, configurable: false },
  g: {
    get: [Function: get g],
    set: undefined,
    enumerable: true,
    configurable: false
  }
}
{ value: 1, writable: true, enumerable: true, configurable: false } false
```

Notice that freezing left the accessor `g` working: freeze cannot make a getter return a constant, it only stops `g` from being redefined. An accessor whose getter reads changing state still returns changing values from a frozen object. The full API for these three operations, including `isFrozen`/`isSealed`/`isExtensible`, is in [[b1-object-freeze-seal]].

```quiz
Q: A property has `writable: true, configurable: false`. Which operation succeeds?
- [x] `obj.key = newValue`
- [ ] `delete obj.key`
- [ ] `Object.defineProperty(obj, 'key', { enumerable: false })` when it is currently enumerable
- [ ] Turning it into a getter with `defineProperty`
> `writable: true` still permits assignment, regardless of `configurable`. Non-configurable forbids deleting the property, changing `enumerable` and switching between data and accessor. The only flag change still allowed is `writable` from `true` to `false`.

Q: Why does `Object.seal` not stop `sealed.a = 2`?
- [ ] `seal` only affects nested objects
- [ ] `seal` makes properties non-enumerable, not read-only
- [x] `seal` sets `configurable: false` and prevents new properties, but leaves `writable` unchanged
- [ ] Assignments to sealed objects only fail in strict mode
> Sealing locks the *shape* of the object: no additions, no deletions, no descriptor changes. Values of writable data properties can still change. `Object.freeze` additionally sets `writable: false`, which is what blocks assignment.
```

## How it works internally

The specification represents a property's attributes as internal fields written in double brackets: **[[Value]]**, **[[Writable]]**, **[[Get]]**, **[[Set]]**, **[[Enumerable]]** and **[[Configurable]]**. The descriptor objects you pass to and receive from the `Object` functions are conversions to and from that internal record: `ToPropertyDescriptor` reads the fields of your object (using ordinary lookups, which is why inherited fields count), and `FromPropertyDescriptor` builds the plain object `getOwnPropertyDescriptor` returns.

Four internal operations consult the flags:

- **[[DefineOwnProperty]]** — used by `Object.defineProperty`, `Object.defineProperties`, `Object.create`'s second argument, class fields and object literals. For ordinary objects it calls **ValidateAndApplyPropertyDescriptor**, which contains the whole rule set from this lesson: if the property does not exist, refuse when the object is non-extensible, otherwise create it with missing fields defaulted (to `false`/`undefined`); if it exists and is non-configurable, check each requested change against the ratchet rules and refuse any that loosen it; otherwise merge the requested fields into the existing record. It returns `false` on refusal; `Object.defineProperty` turns `false` into a `TypeError`, and `Reflect.defineProperty` returns it.
- **[[Set]]** — used by assignment. It checks [[Writable]] on the data property it finds (own or inherited) and calls [[Set]] on an accessor. A `false` result throws only in strict-mode code.
- **[[Delete]]** — used by `delete`. It returns `true` if the property does not exist or is configurable (and removes it), and `false` otherwise.
- **[[OwnPropertyKeys]]** plus a check of [[Enumerable]] — used by every listing operation.

Engines such as V8 do not store a full descriptor on every property of every object. Objects with the same set of keys and attributes share a hidden structure (often called a **shape** or **hidden class**) that records the attributes once, and the object stores only the values. Changing a property's attributes typically changes the object's shape, which is one reason to set attributes when you create properties rather than toggling them repeatedly in hot code.

Some objects override these operations. **Arrays** override [[DefineOwnProperty]] to maintain `length`. **Module namespace objects** (`import * as ns`) report their exports as `writable: true, enumerable: true, configurable: false`, yet refuse every assignment because they are live views of the module's bindings — an example of an exotic object whose descriptors do not behave like an ordinary object's. A **Proxy** can intercept `defineProperty`, `getOwnPropertyDescriptor` and `deleteProperty` with traps, but the language enforces **invariants**: for example, a proxy cannot report a property as non-configurable unless the target really has a non-configurable property with that key. Those invariants exist precisely so that `configurable: false` remains a trustworthy guarantee ([[b1-proxy-traps]]).

## Worked example: an order object with locked and hidden fields

Suppose an order-processing module creates order objects that are passed to other teams' code. The requirements:

1. `id` must never change once assigned — not by assignment, not by redefinition, not by deletion.
2. `status` must be changeable, but nobody may delete it.
3. A `_audit` array is internal bookkeeping: it must stay attached but must not appear in `JSON.stringify` or `Object.keys`.
4. No one may add surprise properties.

```javascript title="order.mjs"
function createOrder(id, items) {
  const order = { items };
  Object.defineProperties(order, {
    id:     { value: id, writable: false, enumerable: true, configurable: false },
    status: { value: 'new', writable: true, enumerable: true, configurable: false },
    _audit: { value: [], writable: false, enumerable: false, configurable: false },
  });
  return Object.preventExtensions(order);
}

const order = createOrder(42, ['book']);
order.status = 'paid';
order._audit.push('paid at checkout');

console.log(JSON.stringify(order));
console.log(Object.keys(order), order._audit);

const attempts = [
  () => { order.id = 43; },
  () => { delete order.status; },
  () => { order.discount = 0.5; },
  () => { Object.defineProperty(order, 'id', { value: 43 }); },
];
for (const attempt of attempts) {
  try {
    attempt();
  } catch (e) {
    console.log(e.constructor.name + ': ' + e.message);
  }
}
```

```output
{"items":["book"],"id":42,"status":"paid"}
[ 'items', 'id', 'status' ] [ 'paid at checkout' ]
TypeError: Cannot assign to read only property 'id' of object '#<Object>'
TypeError: Cannot delete property 'status' of #<Object>
TypeError: Cannot add property discount, object is not extensible
TypeError: Cannot redefine property: id
```

Walk through the design. `items` was created by the literal, so it is a normal property. `Object.defineProperties` adds the other three with every flag spelled out — relying on defaults here would have made `status` read-only by accident. `id` is a constant (non-writable, non-configurable). `status` is writable but non-configurable, so it can change but cannot be removed or hidden. `_audit` is non-enumerable, so it is absent from both the JSON and `Object.keys`, and non-writable, so the array cannot be swapped out — but, as the `push` shows, the array itself is still mutable, which is what the module wants. `Object.preventExtensions` covers requirement 4.

Because the file is a module, every violation throws. In a sloppy-mode script the first three would fail silently instead (`delete` would return `false`), while the `defineProperty` call would still throw, because `defineProperty` reports failure with an exception in every mode. The key order in the output is creation order: `items` from the literal, then the properties in the order they appear in the object passed to `defineProperties`.

Two edge cases are worth checking against the design. A consumer can still call `order.items.push(...)` or `order.items = []`, because `items` is a normal property holding a mutable array; if that matters, define it like `id`, or freeze a copy of the array. And `Object.preventExtensions` cannot be undone, so the module itself also loses the ability to add properties later — which is usually the point, but should be a conscious choice.

## In real systems

**The standard library.** Descriptors are how the built-ins behave the way they do. Methods on built-in prototypes are non-enumerable, so `for...in` over your objects and arrays does not list `toString` or `map`. Constants such as `Math.PI` and the global `undefined`, `NaN` and `Infinity` are non-writable and non-configurable, which is why `undefined = 1` has no effect. Accessors such as `Map.prototype.size` have a getter and no setter, so `map.size = 10` is ignored in sloppy code and throws in strict code.

**Polyfills.** A polyfill that adds a missing method, such as `Array.prototype.at` on an old engine, must use `defineProperty` with `enumerable: false`. Adding it by assignment would make it enumerable, and every `for...in` over every array in the application would suddenly iterate `'at'`. Libraries such as core-js define their methods this way.

**Framework reactivity.** Vue 2 made component data reactive by walking each data object and replacing every property with an accessor defined through `Object.defineProperty`: the getter recorded which component read the value, and the setter triggered a re-render. Because `defineProperty` works per existing key, Vue 2 could not detect properties added later (hence its `Vue.set` API). Vue 3 switched to `Proxy`, which intercepts operations on any key ([[b1-proxy]]).

**Immutability in state management.** Immer, which Redux Toolkit uses inside `createSlice`, freezes the state objects it produces by default. Every property becomes non-writable and non-configurable, so an accidental mutation of produced state fails — with a `TypeError` in strict-mode code — instead of silently corrupting it. Because `Object.freeze` is shallow, Immer freezes nested objects as well.

**Globals.** In a classic browser script, a top-level `var x` creates a property on the global object that is non-configurable, so `delete window.x` fails, while `window.y = 1` creates a configurable one that can be deleted. (This follows from the specification's global-declaration rules; it was not run here, because Node.js modules have no such top-level `var` behaviour.)

**TypeScript.** The `readonly` modifier and `Readonly<T>` exist only at compile time: they make the compiler reject assignments, then vanish from the emitted JavaScript. They do not create non-writable properties. When you need runtime enforcement — data shared with code you do not control, or a security boundary — combine them with `Object.freeze` or `defineProperty`. See [[b2-readonly-properties]].

## Trade-offs and alternatives

Descriptors give fine control, but each restriction has a cost:

| Choice | Benefit | Cost |
|---|---|---|
| `writable: false` | Guards a value against accidental change | Sloppy-mode code fails silently, which can hide bugs; does not protect nested objects |
| `enumerable: false` | Keeps machinery out of listings, copies and JSON | Surprises readers ("where is that property?"); not privacy |
| `configurable: false` | A guarantee no other code can undo | Irreversible for your own code too; tests cannot stub or delete the property |
| Accessor (`get`/`set`) | Computed or validated values with field syntax | Hidden cost on every read; dropped by spread and JSON in surprising ways |

There are usually simpler alternatives for each goal:

- **For whole-object immutability**, `Object.freeze` (or an immutable-data library) is clearer than defining each property by hand.
- **For privacy**, class private fields (`#id`), closures and `WeakMap` actually prevent access, whereas a non-enumerable property only hides from listings. See [[b1-public-private-fields]] and [[b1-private-state]].
- **For compile-time safety**, TypeScript's `readonly` costs nothing at runtime.
- **For intercepting arbitrary keys**, `Proxy` handles keys that do not exist yet, which `defineProperty` cannot.

Reach for descriptors directly when you are writing library or framework code, polyfills, or a module boundary that must hold even against careless or hostile callers. In application code, the defaults are usually what you want.

## Common mistakes

> [!MISTAKE] Creating a property with defineProperty and forgetting the flags
> `Object.defineProperty(obj, 'count', { value: 0 })` creates a property that is read-only, non-enumerable and non-configurable. Later `obj.count++` does nothing in sloppy mode, `JSON.stringify` omits `count`, and you cannot fix the descriptor because it is non-configurable. When creating, spell out every flag that should be `true`.

**Expecting a partial update to reset other fields.** On an existing property, `defineProperty(obj, 'a', { enumerable: false })` changes only `enumerable`. Missing fields are kept, not set to `false`. The "missing means false" rule applies only to creation.

**Relying on silent failures.** In sloppy-mode scripts, assigning to a non-writable property, deleting a non-configurable one and adding to a non-extensible object all do nothing and report nothing. Code that "works" in sloppy mode can start throwing when moved into an ES module or a class body (both strict). Write your code in modules, or test with strict mode, so violations surface.

**Thinking `writable: false` or `freeze` makes data deeply immutable.** Both act on one level. A non-writable property holding an array still lets anyone `push` into the array. Freeze nested objects too, or keep them immutable by convention.

**Treating `configurable: false` as read-only.** A non-configurable, writable property can still be assigned. You need `writable: false` as well.

**Mixing data and accessor fields.** `{ value: 1, get() {} }` throws. To convert a data property into an accessor, the property must be configurable, and the new descriptor must contain only `get`/`set` (plus `enumerable`/`configurable`).

**Checking descriptors on the instance for inherited members.** `Object.getOwnPropertyDescriptor(instance, 'method')` is `undefined` for class methods and getters, because they live on the prototype. Inspect `Object.getOwnPropertyDescriptor(ClassName.prototype, 'method')` instead.

## Interview perspective

Descriptors come up in interviews about JavaScript internals and library design, often disguised as "why does this assignment do nothing?" or "how does `Object.freeze` work?"

> [!INTERVIEW] What a strong answer sounds like
> "Every property has a descriptor. A data property has `value` and `writable`; an accessor has `get` and `set`; both have `enumerable` and `configurable`. Literal and assigned properties get all flags `true`, but `defineProperty` defaults missing flags to `false` when it creates a property — and keeps existing values when it updates one. `configurable: false` is a one-way lock: you can still make the property less writable, but nothing can loosen it. `freeze` is `preventExtensions` plus non-configurable and non-writable on every own property."

Questions you should be ready for:

- **What is a property descriptor, and what are the two kinds?** Data (`value`, `writable`) and accessor (`get`, `set`), both with `enumerable` and `configurable`.
- **What are the defaults with `defineProperty`?** `false` for missing flags on creation; on update, missing fields keep their current values. This create/update difference is the classic follow-up.
- **How would you make a true constant on an object?** `writable: false, configurable: false` (and freeze the value if it is an object).
- **What changes are still allowed on a non-configurable property?** Assigning, if writable; changing `writable` from `true` to `false`; redefining with identical values. Nothing else.
- **Difference between `seal` and `freeze`, in descriptor terms?** Both prevent extensions and set `configurable: false`; `freeze` also sets `writable: false` on data properties.
- **Why does `Math.PI = 4` not throw?** It is non-writable, and sloppy-mode assignments that fail are silent. In strict mode it throws.
- **How did Vue 2 make data reactive, and what was its limitation?** `defineProperty` getters/setters on each existing key; it could not see new keys, which Vue 3 solved with `Proxy`.

A good closing detail to offer: `Object.defineProperty` throws on failure in every mode, while `Reflect.defineProperty` returns a boolean, which is why Proxy handlers use the `Reflect` version.

## Practice

1. **Predict the descriptors.** Write down the descriptor of each property, then check with `Object.getOwnPropertyDescriptors`: `{ a: 1 }`; `class P { x = 1; m() {} }` (inspect both an instance and `P.prototype`); `function f(a, b) {}` (`name`, `length`, `prototype`).
2. **Constant helper.** Write `defineConstant(obj, key, value)` that creates a property that is visible in `Object.keys`, cannot be assigned, redefined or deleted, and whose value is frozen if it is an object.
3. **Redefine or not?** Given `Object.defineProperty(o, 'v', { value: 1, writable: true, configurable: false })`, list which of these calls throw and explain each: `{ value: 2 }`, `{ writable: false }`, `{ writable: true }` (after the previous), `{ enumerable: true }`, `{ get() { return 1; } }`.
4. **Implement `freeze`.** Write `myFreeze(obj)` using only `Reflect.ownKeys`, `Object.getOwnPropertyDescriptor`, `Object.defineProperty` and `Object.preventExtensions`. Verify that `Object.isFrozen(myFreeze({ a: 1, get b() { return 2; } }))` is `true`.
5. **Hidden metadata.** Write `tag(obj, info)` that attaches `info` under a property that does not appear in `Object.keys`, spread or `JSON.stringify`, but can still be read. Then explain why this is not privacy and rewrite it using a `WeakMap`.

## Quick revision {#quick-revision}

- A **property descriptor** is the full record of a property. **Data**: `value`, `writable`, `enumerable`, `configurable`. **Accessor**: `get`, `set`, `enumerable`, `configurable`. Mixing the two throws.
- Read with `Object.getOwnPropertyDescriptor(obj, key)` (own only; `undefined` otherwise) or `Object.getOwnPropertyDescriptors(obj)`. Read descriptors are always complete copies.
- Literals, assignment, class fields: all flags `true`. Class methods/accessors and built-in methods: non-enumerable. `Math.PI`, `undefined`: all `false`. Array `length`: writable, non-enumerable, non-configurable.
- `Object.defineProperty(obj, key, desc)` returns `obj`, throws `TypeError` on failure in every mode. `Reflect.defineProperty` returns a boolean.
- **Create**: missing flags default to `false`. **Update**: missing fields keep their current values.
- `defineProperty` defines on the object directly: no prototype lookup, no setter call, not blocked by inherited read-only properties. Assignment ([[Set]]) does all three.
- Exact copies: `Object.create(Object.getPrototypeOf(o), Object.getOwnPropertyDescriptors(o))`; spread/`assign` flatten accessors into values.
- **writable**: may assignment change the value? Failure is silent in sloppy mode, `TypeError` in strict mode. Shallow — nested objects stay mutable. Does not block redefinition while configurable.
- **enumerable**: listed by `for...in`, `Object.keys`, spread, `assign`, `JSON.stringify`? Not privacy.
- **configurable**: may the property be deleted or its descriptor changed? Once `false`: no delete, no `enumerable` change, no data/accessor switch, no new `get`/`set`; `writable` may only go `true` → `false`; non-writable values are fixed. One-way ratchet.
- `preventExtensions` → no new properties; `seal` → plus all non-configurable; `freeze` → plus data properties non-writable. All shallow.
- TypeScript `readonly` is compile-time only.

## Key takeaways {#key-takeaways}

- A property is a descriptor, not just a value: either a stored value with a `writable` flag or a getter/setter pair, plus `enumerable` and `configurable`.
- Ordinary creation gives fully open properties; `Object.defineProperty` gives fully closed ones unless you list the flags — and on updates it keeps whatever you leave out.
- `writable` guards assignment, `enumerable` guards listing, `configurable` guards deletion and every other change; together `writable: false` and `configurable: false` make a real constant.
- Non-configurable properties can only be locked further, which is what makes them a guarantee that other code cannot undo.
- `Object.freeze` and `Object.seal` are descriptor shortcuts, and like every flag they act one level deep.
- When an assignment silently does nothing or `defineProperty` throws "Cannot redefine property", read the descriptor — it tells you exactly why.
