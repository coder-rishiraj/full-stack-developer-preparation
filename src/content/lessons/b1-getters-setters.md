---
summary: Getters and setters are accessor properties — properties that run a function when they are read or assigned, while still looking like ordinary fields to the code that uses them. You will learn the syntax in object literals, classes and Object.defineProperty, where the real value is stored, how accessors interact with inheritance, copying and JSON, and when an explicit method is the better choice.
difficulty: intermediate
minutes: 45
objectives:
  - Write getters and setters in object literals, classes and with Object.defineProperty, and explain where each one is stored
  - Explain what happens on reading or assigning an accessor with a missing getter or setter, in strict and sloppy mode
  - Store an accessor's backing value safely and debug the infinite-recursion setter bug
  - Predict how accessors behave under inheritance, spread, Object.assign and JSON.stringify
  - Choose between an accessor, a plain property and an explicit method for computed, validated and lazy values
---

## Introduction

A `Map` has a `size`:

```javascript title="map-size.js"
const roles = new Map([['ada', 'admin'], ['alan', 'user']]);
console.log(roles.size);
roles.set('grace', 'user');
console.log(roles.size);

roles.size = 100;                 // no effect
console.log(roles.size);
console.log(Object.getOwnPropertyDescriptor(Map.prototype, 'size'));
```

```output
2
3
3
{
  get: [Function: get size],
  set: undefined,
  enumerable: false,
  configurable: true
}
```

`roles.size` reads like a field, but nobody updates a `size` field when you call `set`. It is not a stored value at all. `size` is an **accessor property**: a property defined by a **getter** function that runs every time the property is read. `Map.prototype.size` has a getter that counts the entries and no **setter**, so assigning to it does nothing (and would throw in strict-mode code).

That is the whole idea of getters and setters: a property whose read runs one function and whose assignment runs another, while the code that uses it still writes `obj.size` and `obj.size = value`. It lets an object offer a **computed value** (`fullName` from `firstName` and `lastName`), a **validated value** (a `price` setter that rejects negative numbers), a **read-only view** of internal state, or a value computed **lazily** on first use — without changing how callers access it.

Accessors are everywhere once you look. `array.length` is a data property, but `map.size`, `set.size`, `regex.flags` and `typedArray.byteLength` are getters. In browsers, almost every DOM property you use — `element.id`, `element.innerHTML`, `input.value` — is an accessor pair defined on a prototype, which is why setting `innerHTML` can parse HTML and rebuild part of the page. Frameworks have used accessors to make state reactive. And every class with a `get` keyword creates them.

## Before you start

- **Property descriptors** — an accessor property has a descriptor with `get`, `set`, `enumerable` and `configurable` instead of `value` and `writable`. See [[b1-property-descriptors]] and [[b1-define-property]].
- **Own vs inherited properties** — class accessors live on the prototype, and assignment behaves differently when it finds an inherited setter. See [[b1-own-vs-inherited]].
- **`this`** — a getter or setter is a function, and `this` inside it is the object the property was accessed on. See [[b1-this]].
- **Classes and private fields** — the class syntax for accessors and the `#field` syntax used to store their values. See [[b1-classes]] and [[b1-public-private-fields]].
- **Strict mode** — writes to an accessor without a setter throw only in strict mode. See [[b1-strict-mode]]. Snippets whose title ends in `.mjs` run as ES modules, which are always strict.

All snippets were run in Node.js 22. Getter and setter syntax has been standard since ES5 (2009) for object literals and ES2015 for classes; private fields (`#x`) need ES2022, which every current browser and Node.js 12+ supports.

## The intuition

A getter/setter pair is **two functions wearing a field costume**. From the outside you see one property. Underneath, reading it calls the first function and returns whatever it returns; assigning to it calls the second function with the assigned value and ignores what it returns.

Think of a hotel's front desk. Guests ask "what's my room number?" and "please change my wake-up call to 7:00". They do not walk into the back office and edit the ledger themselves. The desk clerk looks up the answer (getter), or checks the request and records it (setter). The guest's interaction is the same simple question or instruction either way.

Where the analogy stops working: a getter runs on *every* read. There is no memory of the last answer unless you build one. A getter that does expensive work, or returns a new object each time, behaves very differently from a field even though it looks like one — `obj.items === obj.items` can be `false`.

## Defining accessors

There are three ways to create an accessor property. They produce the same kind of property but differ in where it ends up and what its flags are.

### In an object literal

Prefix a method with `get` or `set`. The getter takes no parameters; the setter takes exactly one.

```javascript title="literal-accessors.js"
const temperature = {
  celsius: 0,
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  },
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  },
};

temperature.fahrenheit = 212;     // runs the setter
console.log(temperature.celsius, temperature.fahrenheit);
console.log(temperature);
console.log(Object.getOwnPropertyDescriptor(temperature, 'fahrenheit'));
```

```output
100 212
{ celsius: 100, fahrenheit: [Getter/Setter] }
{
  get: [Function: get fahrenheit],
  set: [Function: set fahrenheit],
  enumerable: true,
  configurable: true
}
```

Only one value is stored: `celsius`. `fahrenheit` is derived from it on every read, and assigning to `fahrenheit` converts the input and stores it in `celsius`. The two values can never disagree, which is the main benefit of a computed property over keeping two fields in sync by hand. Node's console prints the accessor as `[Getter/Setter]` rather than calling it; browser consoles show a clickable `(...)` that calls the getter when you expand it.

A getter and setter with the same name form **one** property with both functions in its descriptor. In a literal, the property is own, enumerable and configurable, like any literal property.

### In a class

The same syntax inside a class body defines the accessor on the class's **prototype**, so all instances share one pair of functions. Class accessors are **non-enumerable**, like class methods.

```javascript title="class-accessors.js"
class User {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  get fullName() {
    return `${this.first} ${this.last}`;
  }
  set fullName(value) {
    [this.first, this.last] = value.split(' ');
  }
  static get kind() {
    return 'person';
  }
}

const u = new User('Ada', 'Lovelace');
u.fullName = 'Grace Hopper';
console.log(u.first, u.fullName, User.kind);
console.log(Object.hasOwn(u, 'fullName'), 'fullName' in u, Object.keys(u));
console.log(Object.getOwnPropertyDescriptor(User.prototype, 'fullName').enumerable);
```

```output
Grace Grace Hopper person
false true [ 'first', 'last' ]
false
```

`fullName` is not an own property of `u`; it is found on `User.prototype`, and inside both functions `this` is `u` because that is the object the property was accessed on. A `static` accessor is defined on the class itself (`User.kind`).

### With Object.defineProperty

When the property name is only known at runtime, or you need non-default flags, pass a descriptor with `get` and/or `set`. Remember that `defineProperty` defaults `enumerable` and `configurable` to `false` when it creates a property.

```javascript title="define-accessors.js"
const point = {};
for (const axis of ['x', 'y']) {
  let stored = 0;                         // each axis gets its own variable
  Object.defineProperty(point, axis, {
    get() { return stored; },
    set(value) { stored = Math.round(value); },
    enumerable: true,
  });
}

point.x = 2.7;
point.y = -1.2;
console.log(point.x, point.y, JSON.stringify(point));
```

```output
3 -1 {"x":3,"y":-1}
```

Here the backing value lives in a closure variable (`stored`), one per loop iteration because `let` creates a fresh binding each time ([[b1-closures-in-loops]]). Old code sometimes uses `obj.__defineGetter__(name, fn)`; it is a deprecated legacy API that does the same thing with less control, and new code should use `defineProperty`.

| | Object literal | Class body | `Object.defineProperty` |
|---|---|---|---|
| Where it lives | On the object (own) | On the prototype (shared) | Wherever you define it |
| Enumerable | Yes | No | No unless stated |
| Configurable | Yes | Yes | No unless stated |
| Name | Fixed or computed `[expr]` | Fixed or computed `[expr]` | Any runtime value |

## Missing halves: getter-only and setter-only

An accessor does not need both functions.

A **getter without a setter** is read-only from the point of view of assignment. In sloppy mode the assignment is silently ignored; in strict mode it throws a `TypeError`. This is the usual way to expose internal state for reading only.

A **setter without a getter** is write-only: reading the property returns `undefined`. This is rare and usually a mistake — if code can set a value, it can almost always reasonably read it back.

```javascript title="missing-halves.mjs"
const account = {
  get id() { return 7; },
  set password(value) { this._hash = `hashed(${value})`; },
};

console.log(account.id);
try {
  account.id = 8;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}

account.password = 'hunter2';
console.log(account.password, account._hash);
```

```output
7
TypeError: Cannot set property id of #<Object> which has only a getter
undefined hashed(hunter2)
```

The same rule applies to inherited accessors, which leads to a subtle bug covered below: overriding only the getter of an inherited pair leaves the property with no setter.

## Where the value is actually stored

A getter computes; a setter has to put the value *somewhere*. The first attempt most people write puts it back into the property itself:

```javascript title="recursive-setter.js"
const product = {
  set price(value) {
    this.price = value;           // assigns to price... which calls this setter again
  },
};

try {
  product.price = 10;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
RangeError: Maximum call stack size exceeded
```

`this.price = value` inside the setter is an assignment to `price`, so it finds the accessor and calls the setter again, which assigns again, forever — until the call stack overflows. The accessor *is* the property; there is no separate slot behind it. The value must live somewhere with a different name. There are four common choices:

| Storage | Example | Who can bypass the accessor? |
|---|---|---|
| Underscore convention | `this._price` | Anyone; `_` is only a naming hint, and `_price` shows in `Object.keys` and JSON |
| Private class field | `this.#price` | Nobody outside the class body |
| Closure variable | `let price` captured by the functions | Nobody; works in literals and `defineProperty` too |
| `WeakMap` keyed by the object | `prices.get(this)` | Only code with access to the `WeakMap` |

In modern classes, a **private field** is the clear default: it is truly inaccessible from outside, it does not appear in `Object.keys` or `JSON.stringify`, and it is cheap.

```javascript title="validated-price.mjs"
class Product {
  #price = 0;

  get price() {
    return this.#price;
  }

  set price(value) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`price must be a non-negative number, got ${value}`);
    }
    this.#price = Math.round(value * 100) / 100;   // keep two decimal places
  }
}

const book = new Product();
book.price = 12.499;
console.log(book.price);

try {
  book.price = -5;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
console.log(book.price, Object.keys(book), JSON.stringify(book));
```

```output
12.5
RangeError: price must be a non-negative number, got -5
12.5 [] {}
```

The setter enforces the rule at the one place every assignment goes through, so no caller can store an invalid price. When validation fails, the setter throws and the old value stays. Notice the last line: `Object.keys(book)` is empty and `JSON.stringify(book)` is `{}`, because the private field is not a property and the accessor lives on the prototype. That is the next topic.

> [!TIP] Throw from setters, don't silently ignore
> A setter that quietly refuses an invalid value makes bugs hard to find: the caller believes the assignment worked. Throwing a `TypeError` or `RangeError` with the bad value in the message fails loudly at the line that caused the problem.

## Accessors and inheritance

Because class accessors live on the prototype, the lookup rules from [[b1-own-vs-inherited]] apply, with two consequences that surprise people.

**`this` is the receiver, not the prototype.** When a read finds a getter on a prototype, the getter runs with `this` set to the object you read from. That is what lets one getter on `User.prototype` serve every user. If you read the property directly on the prototype, `this` is the prototype, which usually has none of the instance data.

**Assignment calls an inherited setter instead of creating an own property.** Normally, `obj.key = value` creates an own property that shadows the prototype. When the lookup finds an accessor, though, the assignment calls its setter with `this` set to `obj`, and no own property named `key` is created. If the inherited accessor has *no* setter, the assignment fails.

That second rule causes a classic subclassing bug. A getter and setter with the same name form a single property. If a subclass redefines only the getter, its prototype now has an accessor with a getter and **no setter**, which shadows the parent's complete pair:

```javascript title="override-getter-only.js"
class Base {
  #value = 1;
  get value() { return this.#value; }
  set value(v) { this.#value = v; }
}

class Doubled extends Base {
  get value() { return super.value * 2; }   // no setter defined here
}

const d = new Doubled();
d.value = 5;                 // finds Doubled.prototype.value: getter only, so ignored
console.log(d.value);
```

```output
2
```

The assignment found the accessor on `Doubled.prototype` first, saw no setter, and failed (silently, because this file is sloppy mode). The parent's setter was never reached, so `#value` stayed `1` and the getter returned `2`. The fix is to redefine both halves in the subclass, delegating the one you do not change: `set value(v) { super.value = v; }`. As the example shows, `super.value` inside an accessor calls the parent's getter (or setter) with the current `this`.

### Class fields do not call inherited setters

A public class field such as `value = 42` is not an assignment. The language defines it with [[DefineOwnProperty]] semantics — the same operation as `Object.defineProperty` — so it creates an own data property on the instance and never calls a setter it would inherit. An assignment in the constructor does call the setter.

```javascript title="field-vs-assignment.js"
class Base {
  get value() { return 'from getter'; }
  set value(v) { console.log('Base setter received', v); }
}

class WithField extends Base {
  value = 42;                               // defines an own property
}
class WithAssignment extends Base {
  constructor() { super(); this.value = 42; } // assignment: runs the setter
}

const f = new WithField();
const a = new WithAssignment();
console.log(f.value, Object.hasOwn(f, 'value'));
console.log(a.value, Object.hasOwn(a, 'value'));
```

```output
Base setter received 42
42 true
from getter false
```

`WithField` instances get an own `value` that shadows the parent's accessor entirely. `WithAssignment` runs the parent's setter. This matters most in TypeScript projects: with `useDefineForClassFields` set to `true` (the default when `target` is `ES2022` or later, including `ESNext`), TypeScript emits standard define semantics; with it `false`, older TypeScript output turned fields into constructor assignments that *did* call inherited setters. Code that relied on the old behaviour can change meaning when the target is upgraded.

## Accessors under copying and serialisation

Copying and serialising operations **read** properties, so they call getters and store the results as plain data. They never copy the getter function itself.

**`JSON.stringify` calls own enumerable getters.** A getter defined in an object literal is own and enumerable, so its current result is serialised. A getter defined in a class is on the prototype, so `JSON.stringify` never sees it — the `Product` above serialised to `{}`. To include computed values from a class, add a `toJSON` method that returns the shape you want ([[b1-json-replacer-reviver]]).

**Spread and `Object.assign` take a snapshot.** `{ ...obj }` reads each own enumerable property, calling getters, and defines a data property with the result. The copy no longer computes anything.

**`Object.assign` calls setters on the target.** `Object.assign(target, source)` *assigns* each property, so if `target` has a setter for a key, the setter runs. Spread into a new literal does not, because it defines properties on a fresh object.

```javascript title="copying-accessors.js"
let reads = 0;
const counter = {
  get next() { reads += 1; return reads; },
};

const snapshot = { ...counter };            // calls the getter once
console.log(snapshot.next, snapshot.next, counter.next, counter.next);

const target = { set name(v) { console.log('target setter got', v); } };
Object.assign(target, { name: 'Ada' });

const risky = { ok: 1, get broken() { throw new Error('not loaded yet'); } };
try {
  JSON.stringify(risky);
} catch (e) {
  console.log('JSON.stringify failed:', e.message);
}
```

```output
1 1 2 3
target setter got Ada
JSON.stringify failed: not loaded yet
```

`snapshot.next` is the number `1` forever: the spread read it once. `counter.next` keeps counting. The last case is the warning from the notes made concrete: because `JSON.stringify` calls own enumerable getters, a getter that throws breaks serialisation of the whole object, and an expensive getter runs every time the object is logged or sent. To copy accessors as accessors, use `Object.getOwnPropertyDescriptors` with `Object.defineProperties` or `Object.create`, as shown in [[b1-define-property]].

```quiz
Q: `class C { get area() { return 4; } }` — what is `JSON.stringify(new C())`?
- [ ] `{"area":4}`
- [x] `{}`
- [ ] It throws, because getters cannot be serialised
- [ ] `{"area":"[Getter]"}`
> `JSON.stringify` serialises own enumerable properties. A class getter lives on `C.prototype` and is non-enumerable, so the instance has no own properties to serialise. A getter written in an object literal would be own and enumerable, and its value would appear.

Q: Why does `set total(v) { this.total = v; }` crash?
- [ ] Setters cannot use `this`
- [ ] The setter needs to return the value
- [x] `this.total = v` assigns to the same accessor, calling the setter again without end
- [ ] `total` is a reserved word
> An accessor property has no separate storage slot. Assigning to `total` inside its own setter invokes the setter recursively until the call stack overflows with a `RangeError`. Store the value under a different name, such as a private field `#total`.
```

## How it works internally

An accessor property's descriptor has **[[Get]]** and **[[Set]]** fields holding functions (or `undefined`) in place of the **[[Value]]** and **[[Writable]]** fields of a data property. The behaviour falls out of the two ordinary internal methods:

- **Reading (`OrdinaryGet`)**: find the property on the object or its prototype chain. If it is a data property, return its value. If it is an accessor, call its getter with `this` set to the **receiver** — the object the read started from — and return the result. If the getter is `undefined`, return `undefined`.
- **Assigning (`OrdinarySet`)**: find the property on the object or its chain. If it is an accessor, call its setter with `this` = receiver and the assigned value as the argument; the setter's return value is ignored. If the setter is `undefined`, the operation fails — silently in sloppy mode, with a `TypeError` in strict mode. No own data property is created in either case.

Each of the three syntaxes is a different route to the same [[DefineOwnProperty]] call: an object literal defines the accessor on the new object with `enumerable: true`; a class body defines it on the prototype (or, for `static`, on the constructor) with `enumerable: false`; `Object.defineProperty` uses whatever you pass. A getter and a setter with the same name in one literal or class body merge into a single property whose descriptor holds both functions.

Getter calls are ordinary function calls, but engines optimise them aggressively. When a property access site always sees the same object shape and the same getter, JIT compilers such as V8's can inline a small getter so that it costs about the same as a field read. A large or polymorphic getter does not get that benefit. Treat simple getters as cheap and heavy ones as function calls, because that is what they are.

`Reflect.get(target, key, receiver)` and `Reflect.set(target, key, value, receiver)` expose the receiver parameter directly, which is how a `Proxy` can forward accessor calls with the right `this` ([[b1-reflect]]).

## Worked example: a shopping cart with derived and lazy values

A cart stores line items. It should offer a computed `total` that is always correct, a `discountCode` that is validated when set, and a `summary` string that is expensive to build, so it is computed only once per change. It should also serialise to a sensible JSON shape.

```javascript title="cart.mjs"
class Cart {
  #items = [];
  #discount = 0;
  #summaryCache = null;

  add(name, price, qty = 1) {
    this.#items.push({ name, price, qty });
    this.#summaryCache = null;               // invalidate the cached summary
  }

  get total() {                              // derived: never stored, never stale
    const subtotal = this.#items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return Math.round(subtotal * (1 - this.#discount) * 100) / 100;
  }

  set discountCode(code) {
    const codes = { SAVE10: 0.1, HALF: 0.5 };
    if (!Object.hasOwn(codes, code)) {
      throw new TypeError(`unknown discount code: ${code}`);
    }
    this.#discount = codes[code];
    this.#summaryCache = null;
  }

  get summary() {                            // lazy: built on first read after a change
    if (this.#summaryCache === null) {
      console.log('(building summary)');
      this.#summaryCache = this.#items
        .map((i) => `${i.qty} x ${i.name}`)
        .join(', ') + ` = ${this.total}`;
    }
    return this.#summaryCache;
  }

  toJSON() {                                 // class getters are not serialised by default
    return { items: this.#items.length, total: this.total };
  }
}

const cart = new Cart();
cart.add('book', 12.5, 2);
cart.add('pen', 1.25, 4);
console.log(cart.total);
console.log(cart.summary);
console.log(cart.summary);                   // cached: no rebuild

cart.discountCode = 'SAVE10';
console.log(cart.summary);                   // invalidated by the setter
try {
  cart.discountCode = 'FREE';
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
try {
  cart.total = 0;
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
console.log(JSON.stringify(cart));
```

```output
30
(building summary)
2 x book, 4 x pen = 30
2 x book, 4 x pen = 30
(building summary)
2 x book, 4 x pen = 27
TypeError: unknown discount code: FREE
TypeError: Cannot set property total of #<Cart> which has only a getter
{"items":2,"total":27}
```

Walk through it in order. `total` has only a getter, so it is recomputed from `#items` and `#discount` on every read and can never disagree with them; the attempt to assign it throws because the file is a module (strict). `discountCode` has only a setter — a deliberate write-only property here, since the cart exposes the *effect* (a lower total) rather than the code — and it validates its input with `Object.hasOwn`, so a code such as `'constructor'` cannot sneak through via `Object.prototype`. `summary` is lazy: the first read builds and caches the string, the second read returns the cache, and both `add` and the `discountCode` setter clear the cache, so the next read rebuilds it. Finally, `toJSON` gives `JSON.stringify` an explicit shape, because the class's getters live on the prototype and would otherwise be ignored.

A variation of the lazy pattern replaces the getter with a plain data property on first read, using `Object.defineProperty(this, 'summary', { value, … })`. That is ideal for values that never change after they are computed, such as a parsed configuration; the cache-and-invalidate version above is the right choice when the inputs can change.

## In real systems

**The DOM.** Web IDL attributes such as `element.id`, `element.className`, `element.innerHTML`, `input.value` and `node.textContent` are defined as getter/setter pairs on interface prototypes like `Element.prototype` and `HTMLInputElement.prototype`. Setting `innerHTML` runs a setter that parses HTML and replaces child nodes; reading `offsetHeight` runs a getter that may force the browser to compute layout, which is why reading layout properties in a loop that also writes styles is a well-known performance problem. (Described from the specifications; not run here.)

**The standard library.** `Map.prototype.size`, `Set.prototype.size`, `RegExp.prototype.flags`, `ArrayBuffer.prototype.byteLength` and `Symbol.prototype.description` are getters without setters, which is how the language exposes read-only state.

**Reactivity in UI frameworks.** Vue 2 converted each property of component data into a getter/setter pair with `Object.defineProperty`: the getter recorded which component depended on the value, and the setter scheduled a re-render. Vue 3 uses a `Proxy` for `reactive()` objects, and `ref()` returns an object whose `value` is an accessor pair. MobX's computed values are exposed as getters as well. The common idea is that an accessor is a hook on every read and write.

**Domain models.** Many Object-Relational Mapping (ORM) and modelling libraries expose computed or virtual fields as getters — for example, Mongoose "virtuals" such as a `fullName` derived from stored name fields.

**Deprecation and compatibility.** Libraries rename a property while keeping the old name working by defining the old name as an accessor that logs a deprecation warning and forwards to the new one.

## Trade-offs and alternatives

An accessor's main strength — it looks exactly like a field — is also its main risk: readers cannot tell that `obj.total` runs code.

| Choose… | When |
|---|---|
| A plain data property | The value is simply stored and any value is acceptable |
| A getter | The value is cheap to derive from other state, has no side effects, and should read like a property |
| A setter | Every write must be validated or must update related state |
| An explicit method (`getTotal()`, `computeReport()`) | The work is expensive, can fail, takes arguments, is asynchronous, or has side effects |

Good getters behave like fields: they are **cheap**, **free of side effects**, and return the **same value** when nothing has changed. A getter that performs a network request, mutates state, or allocates a large new object on each read violates what the syntax promises. In particular, a getter cannot be declared `async` (that is a syntax error), and a getter that returns a promise forces callers to write `await obj.data`, which is legal but easy to misread; an `async` method is clearer.

Setters should be predictable: store the value (possibly normalised) or throw. A setter that silently changes unrelated state or ignores input surprises every caller.

Accessors also interact poorly with copying, as shown above: spread, `Object.assign` and `structuredClone` turn them into snapshots, and `JSON.stringify` ignores class accessors. If an object is mainly passed around as data — sent over the network, stored, cloned — plain properties plus standalone functions are often simpler than a class full of getters.

## Common mistakes

**Recursive setters.** `set x(v) { this.x = v; }` overflows the stack. Store the value under a different name: a `#private` field, a closure variable or a `WeakMap`.

**Overriding only half of an accessor pair in a subclass.** Redefining just the getter leaves the subclass property with no setter, and assignments silently fail (or throw in strict mode). Redefine both, delegating with `super.value`.

> [!MISTAKE] Expecting JSON or spread to keep getters
> `JSON.stringify` ignores class getters (they are inherited) and calls literal getters once; spread and `Object.assign` store the getter's current result as a plain value. If a copy must stay live, copy the descriptors; if JSON must include computed values, write `toJSON`.

**Getters with side effects.** Debuggers, loggers, test frameworks and `JSON.stringify` all read properties. A getter that increments a counter or triggers a fetch will run at times you did not plan for, sometimes just because you hovered over a variable in the debugger.

**Assuming a getter-only property can be overridden by assignment on an instance.** Because the assignment finds the inherited accessor, `instance.total = 5` does not create an own `total`; it fails. Use `Object.defineProperty(instance, 'total', { value: 5, … })` if you really need an instance-level override, for example in a test.

**Expecting a TypeScript class field to trigger a parent's setter.** With standard class-field semantics (and TypeScript's `useDefineForClassFields`), a field declaration defines an own property and bypasses the inherited accessor. Assign in the constructor if you want the setter to run.

**Returning a fresh mutable object from a getter.** `get items() { return [...this.#items]; }` protects internal state, but `cart.items.push(x)` then silently modifies a throwaway copy, and `cart.items !== cart.items`. Document this, or return a frozen or read-only view.

## Interview perspective

Getters and setters appear in interviews as definition questions ("what is an accessor property?"), in class-design discussions ("how would you validate this field?") and in output puzzles involving inheritance or JSON.

> [!INTERVIEW] What a strong answer sounds like
> "A getter or setter defines an accessor property: its descriptor holds `get` and `set` functions instead of a value. Reading calls the getter with `this` as the receiver; assigning calls the setter. In a literal the accessor is own and enumerable; in a class it lives on the prototype and is non-enumerable, which is why `JSON.stringify` skips class getters. The value must be stored under another name — usually a private field — or the setter recurses."

Questions you should be ready for:

- **What happens when you assign to a getter-only property?** Ignored in sloppy mode; `TypeError` in strict mode, including inside classes and modules.
- **Why does `set x(v) { this.x = v }` crash?** It calls itself until the stack overflows; there is no backing slot.
- **Does `JSON.stringify` call getters?** It calls own enumerable getters (literal-defined); class getters on the prototype are not visited. Mention `toJSON` as the fix.
- **How are accessors different from methods?** Same functions underneath; the difference is syntax and expectations. Accessors should be cheap, side-effect free and argument-free.
- **How did Vue 2 detect changes, and why couldn't it see new properties?** `defineProperty` accessors installed per existing key at setup time; a new key had no accessor. Vue 3 moved to `Proxy`.
- **Output puzzle:** a subclass overrides only the getter and then assigns. Explain that the subclass's accessor shadows the parent's pair and has no setter.

A good follow-up to anticipate: *"How would you make a value computed once and then cached?"* Describe the lazy getter that replaces itself with a data property via `Object.defineProperty`, or a private cache field invalidated by setters, and say which one fits mutable inputs.

## Practice

1. **Temperature class.** Write a `Temperature` class that stores Kelvin in a private field and exposes `celsius` and `fahrenheit` accessors. Setting any of them must reject values below absolute zero with a `RangeError`.
2. **Read-only view.** Write `readonlyView(obj)` that returns a new object whose properties are getters reading from `obj` (so changes to `obj` show through) and which has no setters. Use `Object.keys` and `Object.defineProperty`. What happens when the caller assigns to a view property in a module?
3. **Lazy configuration.** Write an object with a `config` getter that parses a JSON string on first access, then replaces itself with a non-writable data property. Verify with `Object.getOwnPropertyDescriptor` before and after the first read.
4. **Deprecated alias.** Given a class with a `userName` property, add a `username` accessor pair that logs a deprecation warning once and forwards to `userName`.
5. **Debug it.** Explain the output of the `Doubled` example in this lesson, then fix the class so that `d.value = 5` makes `d.value` return `10`.

## Quick revision {#quick-revision}

- An **accessor property** has `get`/`set` functions instead of `value`/`writable`. Reading calls the getter; assigning calls the setter with the value; the setter's return value is ignored.
- Syntax: `get x() {}` / `set x(v) {}` in object literals and classes; `Object.defineProperty(obj, key, { get, set })` for dynamic names or custom flags. `static get` defines on the class.
- Literal accessors: own, enumerable, configurable. Class accessors: on the prototype, non-enumerable. `defineProperty`: non-enumerable and non-configurable unless stated.
- Getter only: assignment ignored (sloppy) or `TypeError` (strict). Setter only: reads return `undefined`.
- Never assign to the accessor inside its own setter — infinite recursion, `RangeError`. Store in `#private` fields, closures or a `WeakMap`.
- `this` in an accessor is the **receiver**. Assigning to an inherited accessor calls its setter and creates no own property.
- Overriding only the getter in a subclass removes the setter for that class; redefine both and delegate with `super`.
- Class fields use define semantics: they shadow inherited accessors instead of calling the setter (TypeScript: `useDefineForClassFields`).
- `JSON.stringify` calls own enumerable getters only, so class getters are skipped; use `toJSON`. A throwing getter breaks stringify.
- Spread and `Object.assign` snapshot getter results; `Object.assign` also calls setters on the target. Copy accessors with `Object.getOwnPropertyDescriptors`.
- Good getters are cheap, pure and stable; expensive, failing, async or side-effecting work belongs in a method.

## Key takeaways {#key-takeaways}

- Getters and setters let a property run code on read and write while callers keep the plain `obj.x` syntax.
- An accessor has no storage of its own, so its value must live elsewhere — a private field is the modern default.
- Where an accessor is defined decides its behaviour: literal accessors are own and enumerable; class accessors are shared on the prototype and hidden from listings and JSON.
- Inheritance changes assignment: an inherited setter runs instead of shadowing, and a getter-only accessor anywhere on the chain blocks the write.
- Copying and serialising read through getters and produce plain values, so accessors do not survive spread, `Object.assign` or `JSON.stringify`.
- Use accessors for cheap derived values, validation and read-only views; use explicit methods for anything expensive, asynchronous or side-effecting.
