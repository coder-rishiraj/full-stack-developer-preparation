---
summary: Encapsulation, polymorphism and composition are the design ideas that keep object-based code changeable as it grows. You will learn what each one means in JavaScript specifically — where they come from closures, private fields, prototype lookup and plain object references — and how to choose composition or inheritance for a real design.
difficulty: intermediate
minutes: 55
objectives:
  - Explain encapsulation as protecting invariants, and implement it with private fields, closures and module scope
  - Describe how polymorphism works in JavaScript through dynamic method lookup, and use duck typing and built-in protocols deliberately
  - Build objects by composition — delegation, injected dependencies and mixins — and trace how each shares behaviour
  - Compare composition with inheritance for a given design and justify the choice
  - Recognise design smells such as leaked internal state, type-switching conditionals and deep class hierarchies, and refactor them
---

## Introduction

Writing a class that works is the easy part. The hard part arrives six months later, when the requirements change and you need to modify that class without breaking the forty places that use it. Whether that change takes ten minutes or two weeks depends mostly on three design decisions made earlier:

- Could other code reach into the object's internals and come to depend on them? That is a question about **encapsulation**.
- Does calling code have to know exactly which kind of object it is dealing with? That is a question about **polymorphism**.
- Is behaviour shared by building objects out of smaller parts, or by stacking classes on top of one another? That is a question about **composition** versus inheritance.

These are usually called principles of **object-oriented programming (OOP)**: a style of programming in which a program is organised as objects that each hold some data together with the operations on that data. Textbooks often list four pillars — encapsulation, abstraction, inheritance and polymorphism. This lesson covers encapsulation (with abstraction as its other face), polymorphism and composition; inheritance has its own lesson, [[b1-class-inheritance]].

JavaScript's take on these ideas is unlike Java's or C#'s, and interviewers ask about exactly that difference. JavaScript has no `private`, `protected` or `public` keywords, no interfaces and no abstract classes. Instead it has a few flexible mechanisms — closures, `#private` names, modules, prototype lookup and objects that hold other objects — from which all three principles are built. A principle here is something you *do* with those mechanisms, not a keyword you type.

## Before you start

- **Classes** — constructors, methods, fields and `#private` members. See [[b1-classes]] and [[b1-public-private-fields]].
- **Inheritance and overriding** — `extends`, `super`, and the fact that `this.method()` is looked up on the actual object at call time. See [[b1-class-inheritance]] and [[b1-method-overriding]].
- **Closures** — a function keeps access to the variables of the scope it was created in. See [[b1-closures]] and [[b1-private-state]].
- **The prototype chain** — how a property is found on an object or the objects it delegates to. See [[b1-prototype-chain]].

Code runs as shown in Node.js 22 or a current browser console.

## The intuition

Think about a car from the driver's seat. You get a steering wheel, pedals and a gear selector. You do not get direct access to the fuel injectors, and that is deliberate: if drivers could adjust injector timing while driving, engines would be destroyed weekly, and the manufacturer could never change the engine design without retraining every driver. The controls are a small, stable surface; the machinery behind them is hidden and free to change. That is **encapsulation**.

Because every car offers the same controls, you can drive a petrol car, a diesel or an electric one without relearning. Pressing the accelerator does something entirely different inside each, but "press to go faster" holds for all. One way of using; many implementations. That is **polymorphism**.

And a car is not built by taking a "vehicle" and refining it into a "motor vehicle" and then a "four-door saloon". It is assembled from parts: an engine, a gearbox, brakes, each made separately and replaceable. To make a faster model, fit a different engine. That is **composition**.

The analogy's limit: physical parts are sealed by metal. In JavaScript, the "seal" is only as strong as the mechanism you pick, and several popular ones (naming conventions, for instance) are not seals at all. The sections below are precise about which is which.

## Encapsulation: protecting invariants

**Encapsulation** means bundling data with the operations on it, *and* restricting outside access to the data so that it can only change through those operations. The second half is the one that matters. The purpose is to protect **invariants** — rules that must always hold for the object to make sense, such as "a stock level is never negative" or "the total equals the sum of the lines".

Here is what the absence of encapsulation looks like:

```javascript
const inventory = {
  stock: { pen: 10 },
  remove(item, qty) {
    if (qty > this.stock[item]) throw new RangeError('not enough stock');
    this.stock[item] -= qty;
  },
};

inventory.remove('pen', 3);
inventory.stock.pen -= 50;          // any code, anywhere, can do this
console.log(inventory.stock.pen);
```

```output
-43
```

The `remove` method carefully checks the rule, but the check is decoration: `stock` is public, so one careless line elsewhere breaks the invariant, and the bug shows up far from its cause. In a large codebase you cannot find every writer of `stock`, so you can no longer reason about the object at all.

Encapsulation has a second benefit, usually called **abstraction** or **information hiding**: callers who cannot see the internals cannot depend on them. If `stock` is hidden, you may later replace the plain object with a `Map`, or with a call to a server, and no caller changes. The public methods form a small **interface**; everything else is an implementation detail.

JavaScript offers four mechanisms, of very different strength.

### Private fields and methods

Since ES2022, class members whose names start with `#` are accessible only from code inside the class body. This is enforced by the language: outside access is a `SyntaxError`, and the field does not appear in `Object.keys`, JSON or spread.

```javascript
class Inventory {
  #stock = new Map();

  add(item, qty) {
    this.#assertPositiveInteger(qty);
    this.#stock.set(item, this.available(item) + qty);
    return this;
  }

  remove(item, qty) {
    this.#assertPositiveInteger(qty);
    if (qty > this.available(item)) {
      throw new RangeError(`only ${this.available(item)} ${item} in stock`);
    }
    this.#stock.set(item, this.available(item) - qty);
    return this;
  }

  available(item) {
    return this.#stock.get(item) ?? 0;
  }

  #assertPositiveInteger(qty) {
    if (!Number.isInteger(qty) || qty <= 0) throw new RangeError(`bad quantity: ${qty}`);
  }
}

const inv = new Inventory().add('pen', 10).remove('pen', 3);
console.log(inv.available('pen'), Object.keys(inv), inv.stock);

try {
  inv.remove('pen', 50);
} catch (e) {
  console.log(e.message);
}
```

```output
7 [] undefined
only 7 pen in stock
```

Now the only way to change stock is through `add` and `remove`, both of which enforce the rules, so "stock is never negative" is guaranteed by construction. The helper `#assertPositiveInteger` is private too: because nobody outside can call it, it can be renamed or removed freely. The details of private names are in [[b1-public-private-fields]].

### Closures

Before private fields existed — and still today, in code that does not use classes — privacy comes from **closures**. Variables declared inside a function are invisible outside it, but functions created inside keep access. A factory function returns an object whose methods share hidden variables:

```javascript
function createInventory() {
  const stock = new Map();                      // private: only the closures see it
  const available = (item) => stock.get(item) ?? 0;

  return {
    add(item, qty) {
      stock.set(item, available(item) + qty);
    },
    available,
  };
}

const inv = createInventory();
inv.add('ink', 4);
const { available } = inv;                      // works detached: no `this` involved
console.log(available('ink'), inv.stock);
```

```output
4 undefined
```

Closure privacy is as strong as `#private`, and the methods do not use `this`, so they can be passed around as callbacks safely. The cost is that each object gets its own copies of the method functions. The pattern is taught in [[b1-private-state]], and the class-versus-factory decision in [[b1-classes-vs-factories]].

### Module scope

A file loaded as an ES module has its own scope: anything not exported is invisible to other files ([[b1-modules]], [[b1-module-scope]]). This is encapsulation at a coarser grain — hiding whole functions, constants and caches rather than fields — and it is the most widely used form in modern JavaScript. A module that exports three functions and keeps ten helpers to itself has a three-function interface.

### Conventions that are not encapsulation

A leading underscore (`this._stock`) is a naming convention that tells other programmers "internal, do not touch". Nothing enforces it; the property is fully public, shows up in `Object.keys` and JSON, and people under deadline pressure will use it. You will see it throughout older code and in codebases that predate ES2022. TypeScript's `private` keyword is similar in one respect: it is checked at compile time and then erased, so at run time the property is an ordinary public one. Only `#private`, closures and module scope hide data at run time.

### Leaking internals by reference

Hiding a field is not enough if a method hands out the object the field refers to. Arrays, objects, Maps and Dates are passed by reference ([[b1-primitive-vs-reference]]), so a getter that returns the internal array gives the caller a handle on the internals.

```javascript
class Playlist {
  #tracks = [];

  add(track) {
    if (this.#tracks.includes(track)) throw new Error(`duplicate: ${track}`);
    this.#tracks.push(track);
  }

  get leakyTracks() { return this.#tracks; }          // hands out the real array
  get tracks() { return [...this.#tracks]; }          // hands out a copy
}

const p = new Playlist();
p.add('intro');

p.tracks.push('intro');             // changes a throwaway copy
console.log(p.tracks);

p.leakyTracks.push('intro');        // changes the private array itself
console.log(p.tracks);
```

```output
[ 'intro' ]
[ 'intro', 'intro' ]
```

The "no duplicates" invariant was broken without ever touching `#tracks` by name. The fix is to return a copy (as `tracks` does), a frozen object, or an iterator — and equally, to copy mutable arguments the constructor stores, so the caller cannot keep a handle and change them later. Copying techniques are in [[b1-copying-arrays]] and [[b1-copying-objects]].

### Getters and setters are not automatically encapsulation

A class with a private `#x` plus a public getter and setter that read and write it without any checks has hidden nothing: every caller can still set any value. That is a public property with extra steps. Accessors add value when they *do* something — validate, convert, compute a derived value, or expose read-only access by omitting the setter ([[b1-getters-setters]]). A helpful guideline is **"tell, don't ask"**: instead of exposing data so callers can compute with it (`if (account.balance >= amount) account.balance -= amount`), give the object a method that does the whole operation (`account.withdraw(amount)`), keeping the rule inside.

```quiz
Q: A class stores `#items = []` and exposes `get items() { return this.#items; }`. Is the array encapsulated?
- [ ] Yes — `#items` cannot be accessed outside the class
- [x] No — the getter returns a reference to the same array, so callers can mutate it with `push` or `length = 0`
- [ ] Yes — getters return copies automatically
- [ ] No — private fields are visible through `Object.keys`
> The private *name* is inaccessible, but the array object it refers to is handed to every caller. Objects are shared by reference, so `obj.items.push(x)` changes the internal state and bypasses any validation. Return a copy or a frozen array instead. Private fields never appear in `Object.keys`, and getters copy nothing unless you write the copy.
```

## Polymorphism: one call, many behaviours

**Polymorphism** (Greek for "many forms") means that the same operation, written once in the calling code, does the right thing for different kinds of object. The caller says `shape.area()`; whether that runs the circle formula or the rectangle formula is decided by the object.

Its value is clearest when you look at code without it:

```javascript
function area(shape) {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.r ** 2;
    case 'rect': return shape.w * shape.h;
    default: throw new Error(`unknown shape: ${shape.kind}`);
  }
}

console.log(area({ kind: 'rect', w: 2, h: 3 }));
```

```output
6
```

This works, but every function that cares about shapes — `area`, `perimeter`, `draw`, `toSvg` — needs its own `switch`, and adding a triangle means finding and editing all of them. Miss one and it fails at run time. With polymorphism, each kind of shape carries its own behaviour and adding a kind means adding one new class, with no edits to existing code:

```javascript
class Circle {
  constructor(r) { this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}

class Rect {
  constructor(w, h) { this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}

const totalArea = (shapes) => shapes.reduce((sum, s) => sum + s.area(), 0);

console.log(totalArea([new Rect(2, 3), new Circle(1), new Rect(1, 1)]).toFixed(2));
```

```output
10.14
```

`totalArea` contains no knowledge of circles or rectangles. Notice also that `Circle` and `Rect` share **no parent class**. That is the first thing to understand about polymorphism in JavaScript.

### How it works: lookup at call time

In `s.area()`, JavaScript does not consult a declared type — there are none. It performs an ordinary property lookup for `'area'` on whatever object `s` is at that moment, walking its prototype chain, and calls whatever function it finds with `this` set to `s`. This is **dynamic dispatch**: the method is chosen at run time, from the object. Polymorphism in JavaScript is nothing more than this lookup; there is no separate feature.

In a class hierarchy the same lookup produces **subtype polymorphism**: a subclass overrides a method, and code written against the parent calls the override ([[b1-method-overriding]]). But a hierarchy is not required. Any objects that have an `area` method work with `totalArea`.

### Duck typing

That last point has a name: **duck typing**, from the saying "if it walks like a duck and quacks like a duck, it is a duck". An object is acceptable if it has the methods the code needs; where it came from and what class it belongs to are irrelevant.

```javascript
class Cat {
  speak() { return 'meow'; }
}

const robot = { speak: () => 'beep' };            // plain object, no class at all
const parrot = Object.create({ speak() { return 'hello'; } });   // inherited method

const chorus = (things) => things.map((t) => t.speak()).join(' ');

console.log(chorus([new Cat(), robot, parrot]));
```

```output
meow beep hello
```

Duck typing makes JavaScript code easy to test and extend: a test can pass a three-line fake object instead of a real database client, as long as it has the right methods. The price is that nothing checks the "shape" for you. If an object lacks the method, you get `TypeError: t.speak is not a function` at the call, possibly far from where the wrong object was created. TypeScript addresses this with **structural typing** — interfaces that describe the required shape and are checked at compile time — which is duck typing with a compiler.

### Protocols: polymorphism built into the language

JavaScript itself uses duck typing. Several language features work with *any* object that implements an agreed set of methods, called a **protocol**:

| Protocol | An object takes part by having | Used by |
|---|---|---|
| Iterable | a `[Symbol.iterator]()` method | `for...of`, spread, destructuring, `Array.from` ([[b1-iterable-protocol]]) |
| Thenable | a `then(resolve, reject)` method | `await`, `Promise.resolve` ([[b1-promises]]) |
| String conversion | `toString()` or `[Symbol.toPrimitive]()` | template literals, `String(x)`, `+` ([[b1-to-primitive]]) |
| JSON serialisation | `toJSON()` | `JSON.stringify` ([[b1-json-stringify-parse]]) |

```javascript
class Countdown {
  constructor(from) { this.from = from; }
  *[Symbol.iterator]() {
    for (let n = this.from; n > 0; n--) yield n;
  }
  toString() { return `Countdown from ${this.from}`; }
  toJSON() { return { type: 'countdown', from: this.from }; }
}

const c = new Countdown(3);
console.log([...c], `${c}`, JSON.stringify(c));
```

```output
[ 3, 2, 1 ] Countdown from 3 {"type":"countdown","from":3}
```

`Countdown` extends nothing, yet spread, template literals and `JSON.stringify` all accept it. When you design your own code, the same approach — "anything with a `send(message)` method is a notifier" — usually serves better than requiring a particular base class.

### Checking capability versus checking class

Sometimes code must branch on what it has been given. There are two ways to ask.

**`instanceof`** asks about ancestry: "is this class's prototype on the object's chain?" It is the right tool *inside* your own code for class hierarchies you control — error handling being the standard example (`if (err instanceof ValidationError)`).

**Feature checks** ask about capability: `typeof value?.then === 'function'`, `Symbol.iterator in Object(value)`, `Array.isArray(value)`. They are the right tool at **boundaries** — values coming from another library, another copy of the same package, an iframe or a worker. `instanceof` can give false negatives there, because each JavaScript realm (each window, iframe or worker) has its own `Array`, `Error` and so on, and two installed copies of a package have two distinct classes ([[b1-instanceof]] covers realms in detail). That is why promises are detected by "has a `then` method" and arrays by `Array.isArray` rather than `instanceof`.

### What JavaScript's polymorphism does not include

Languages such as Java also offer **overloading** — several methods with one name, chosen by argument types at compile time. JavaScript has none: a name refers to one function, and argument count and types play no part in selecting it. Functions that accept varied inputs inspect their arguments at run time instead (`typeof`, `Array.isArray`, options objects). Generic, type-parameterised code ("parametric polymorphism") needs no feature at all, because values are untyped: one `identity(x)` function already works for everything. TypeScript's generics add the checking.

```quiz
Q: `render(items)` calls `item.draw()` on each element. Which statement about JavaScript is correct?
- [ ] Every element must be an instance of a common base class that declares `draw`
- [ ] Every element's class must be registered as implementing a `Drawable` interface
- [x] Every element only needs a callable `draw` property at the time of the call, found on the object or its prototype chain
- [ ] The engine picks the `draw` to run from the type of the `items` array
> `item.draw()` is a property lookup on the actual object followed by a call. No declared type, base class or interface is involved, which is what duck typing means. A shared base class is one way to guarantee the method exists, but not a requirement. The array has no element type in JavaScript.
```

## Composition: building with parts

**Composition** means building an object's behaviour by having it *hold* other objects and hand work to them, instead of by inheriting from a parent class. The relationship is **has-a** or **uses-a** — an order *has* line items, a service *uses* a logger — where inheritance expresses **is-a**. Composition needs no language feature: it is one object stored in a property of another.

### The problem composition solves

Inheritance arranges classes in a tree, and each class has exactly one parent. Real requirements rarely form a tree. Suppose a game has characters that can walk, swim or fly:

- `Character → Walker`, `Character → Swimmer`, `Character → Flyer` handles the pure cases.
- A duck walks, swims and flies. Which parent does it extend? Whichever you pick, the other two abilities must be duplicated.
- Pushing the abilities up into `Character` gives every character `fly()`, including fish.

Each new combination forces either duplication or a base class bloated with behaviour most subclasses must not have. Adding a second dimension — say, characters that are also tradeable or serialisable — multiplies the classes. This is sometimes called the **class explosion** problem, and no rearrangement of the tree fixes it, because the abilities are independent of one another and a tree cannot express independence.

### Assemble behaviour from small pieces

With composition, each ability is its own small unit, and an object is assembled from the ones it needs:

```javascript
const walker = (state) => ({
  walk() { state.position += 1; return `${state.name} walks to ${state.position}`; },
});

const swimmer = (state) => ({
  swim() { state.depth += 1; return `${state.name} dives to ${state.depth}`; },
});

const flyer = (state) => ({
  fly() { state.altitude += 10; return `${state.name} climbs to ${state.altitude}`; },
});

function createDuck(name) {
  const state = { name, position: 0, depth: 0, altitude: 0 };
  return { ...walker(state), ...swimmer(state), ...flyer(state) };
}

function createFish(name) {
  const state = { name, depth: 0 };
  return { ...swimmer(state) };
}

const duck = createDuck('Donald');
const fish = createFish('Nemo');

console.log(duck.walk());
console.log(duck.fly());
console.log(fish.swim());
console.log(typeof fish.fly);
```

```output
Donald walks to 1
Donald climbs to 10
Nemo dives to 1
undefined
```

Each ability is a function that takes the object's state and returns an object of methods closed over it. `createDuck` spreads three sets of methods into one object; `createFish` takes one. A new ability or a new combination is one more line, and no existing code changes. The `state` object is private to each creature, because it lives only in the closures — composition and encapsulation working together.

### Delegation: hold a part, forward to it

The most common form of composition in class-based code is **delegation**: an object keeps another object in a field and forwards part of its work to it. The outer object decides exactly which operations to expose. Compare this with the `Stack extends Array` example from [[b1-class-inheritance]], which exposed every array method including the ones that break a stack:

```javascript
class Stack {
  #items = [];                       // has-a array, instead of is-an array

  push(value) { this.#items.push(value); return this; }
  pop() { return this.#items.pop(); }
  peek() { return this.#items.at(-1); }
  get size() { return this.#items.length; }
}

const s = new Stack().push(1).push(2);
console.log(s.peek(), s.size, typeof s.splice);
```

```output
2 2 undefined
```

The stack reuses all of the array's machinery but its interface has four members, none of which can violate last-in-first-out order. If the internal array were later replaced by a linked list, callers would not notice.

### Dependency injection: receive your parts

A composed object can create its own parts, or it can **receive them from outside**, usually through the constructor. Receiving them is called **dependency injection**. It makes the parts swappable — which is polymorphism applied to composition: any object with the right methods can be plugged in.

```javascript
class OrderService {
  #payments;
  #notifier;

  constructor({ payments, notifier }) {
    this.#payments = payments;
    this.#notifier = notifier;
  }

  async checkout(order) {
    const receipt = await this.#payments.charge(order.total);
    await this.#notifier.send(`Order ${order.id} paid, receipt ${receipt}`);
    return receipt;
  }
}

// In a test: tiny fakes with the same method names as the real clients.
const sent = [];
const service = new OrderService({
  payments: { charge: async (amount) => `R-${amount}` },
  notifier: { send: async (message) => { sent.push(message); } },
});

service.checkout({ id: 42, total: 1999 }).then((receipt) => console.log(receipt, sent));
```

```output
R-1999 [ 'Order 42 paid, receipt R-1999' ]
```

`OrderService` knows only that its collaborators have `charge` and `send` methods. In production it receives a real payment client and an email sender; in the test it receives two object literals. Switching from email to SMS means passing a different notifier, with no subclass and no edit to `OrderService`. Had the service extended a `PaymentClient` base class instead, it would be welded to one provider and could not be tested without the network.

### Mixins: composing into a prototype

Sometimes you want shared *methods on the prototype* — so that they are not duplicated per instance and `instanceof`-style class code keeps working — but drawn from several sources. A **mixin** is a bundle of methods added to a class without being its parent. There are two common forms.

The simple one copies methods from a plain object onto a prototype with `Object.assign`:

```javascript
const Comparable = {
  equals(other) { return this.compareTo(other) === 0; },
  greaterThan(other) { return this.compareTo(other) > 0; },
};

class Version {
  constructor(major, minor) { this.major = major; this.minor = minor; }
  compareTo(other) { return this.major - other.major || this.minor - other.minor; }
}

Object.assign(Version.prototype, Comparable);

console.log(new Version(2, 1).greaterThan(new Version(1, 9)));
console.log(new Version(1, 0).equals(new Version(1, 0)));
```

```output
true
true
```

`Comparable` expects its host to supply `compareTo` and builds the other comparisons on top. `Object.assign` copies only enumerable own properties and copies getters as plain values (it reads them once), and the copied methods cannot use `super` or private fields, so this form suits bundles of simple methods.

The second form is the **subclass factory**: a function that takes a base class and returns a new class extending it. Because `extends` accepts any expression, mixins can be chained:

```javascript
const Serializable = (Base) => class extends Base {
  serialise() { return JSON.stringify(this); }
};

const Observable = (Base) => class extends Base {
  #listeners = [];
  subscribe(fn) { this.#listeners.push(fn); return this; }
  notify(event) { this.#listeners.forEach((fn) => fn(event, this)); }
};

class Model {
  constructor(data) { Object.assign(this, data); }
}

class User extends Observable(Serializable(Model)) {
  rename(name) {
    this.name = name;
    this.notify('renamed');
  }
}

const user = new User({ name: 'ada' });
user.subscribe((event, u) => console.log(event, u.serialise()));
user.rename('grace');
```

```output
renamed {"name":"grace"}
```

Each mixin can have its own private fields, constructor logic and `super` calls. Underneath it is still a single inheritance chain — `User → Observable(...) → Serializable(...) → Model` — so it shares inheritance's hazards: two mixins defining the same method name collide silently, with the outermost winning, and the order of application matters. Use mixins for small, independent capabilities, and prefer plain delegation when a capability has state and rules of its own.

### Functions as the unit of composition

Much modern JavaScript composes with functions instead of objects. Higher-order functions wrap behaviour around other functions ([[b1-first-class-functions]], [[b1-compose-pipe]]); middleware in Express or Redux is a pipeline of small functions; and in React, reuse comes from composing components and custom hooks. React moved away from class inheritance early: components are never extended to share behaviour, they are nested, passed as `children`, or share logic through hooks. The principle is the same — small pieces, combined — applied to functions.

## Choosing between inheritance and composition

The well-known advice "favour composition over inheritance", from the 1994 book *Design Patterns*, is a default, not a prohibition. Each tool fits a different situation.

| | Inheritance (`extends`) | Composition (hold and delegate) |
|---|---|---|
| Relationship | is-a: a `ValidationError` is an `Error` | has-a / uses-a: a `Cart` has line items, uses a `PriceCalculator` |
| What the new class exposes | Everything public on the parent | Only what it chooses to forward |
| Coupling | To the parent's internals and its self-calls | To the part's public interface only |
| Changing behaviour at run time | Not possible; the parent is fixed at definition | Swap the part |
| Combining several capabilities | One parent only | Any number of parts |
| Boilerplate | Minimal | Forwarding methods must be written |
| Testing | Needs the real parent | Parts can be replaced by fakes |

Three questions settle most cases:

1. **Would every use of the parent still be correct with the child substituted?** If a `ReadOnlyList` extended `List`, code calling `list.add()` would break; that is not an is-a relationship, whatever the names suggest.
2. **Do you want the parent's whole interface?** If you want two of its twelve methods, hold an instance and forward two calls.
3. **Is the base class designed for extension, or required by a platform?** `Error`, `HTMLElement` and framework base classes are; extend them. An arbitrary class from another team is usually not.

When inheritance does fit, keep it shallow — one or two levels — and compose everything else. Real designs mix both: `class CheckoutError extends Error` (is-a) inside an `OrderService` that *has* a payment client and a notifier.

## How it works internally

None of these principles has dedicated machinery in the engine; each rests on mechanisms taught elsewhere.

**Encapsulation** rests on two things. Private names are resolved at parse time: the parser knows every `#name` declared in the enclosing class bodies, which is why a stray `obj.#x` is a `SyntaxError`, not a run-time failure. At run time a private access checks that the object holds that exact private name, and throws a `TypeError` if not. Closure privacy rests on lexical environments: the hidden variables live in an environment record reachable only through the functions created in that scope ([[b1-lexical-environment]]).

**Polymorphism** rests on the ordinary property `[[Get]]` operation. `obj.method(args)` looks up `method` on `obj` and its chain, then calls the result with `this = obj`. Engines make this fast with **inline caches**: a call site remembers the shapes of the objects it has seen and where the method was found. A site that always sees one shape is *monomorphic* and fastest; a few shapes, *polymorphic* and still quick; very many shapes, *megamorphic* and slower, because the cache is abandoned for a general lookup ([[b1-hidden-classes]]). This matters only in very hot loops, and is not a reason to avoid polymorphism in ordinary code.

**Composition** is plain references: a property holding another object. The garbage collector treats composed parts like anything else — a part lives as long as something reachable refers to it ([[b1-reachability]]).

## Worked example: refactoring a notification system

The following starts with a design that uses inheritance for everything and shows why it stalls; then rebuilds it with the three principles.

The first version has a base `Notifier` and subclasses per channel. Then requirements arrive: some notifications must be retried, some logged, some both, on any channel. With inheritance that means `RetryingEmailNotifier`, `LoggingEmailNotifier`, `RetryingLoggingEmailNotifier`, and the same again for SMS — channels times features, and growing.

The composed version separates what varies independently. A **channel** is anything with `send(message)`. **Retry** and **logging** are wrappers that take any channel and return a new one with the same interface.

```javascript title="notifications.js"
// Channels: each encapsulates its own details behind send().
class EmailChannel {
  #address;
  constructor(address) { this.#address = address; }
  async send(message) { return `email to ${this.#address}: ${message}`; }
}

class FlakySmsChannel {
  #number;
  #failuresLeft;
  constructor(number, failures) { this.#number = number; this.#failuresLeft = failures; }
  async send(message) {
    if (this.#failuresLeft-- > 0) throw new Error('network down');
    return `sms to ${this.#number}: ${message}`;
  }
}

// Wrappers: composition. Each holds a channel and offers the same send().
const withRetry = (channel, attempts) => ({
  async send(message) {
    for (let i = 1; ; i++) {
      try {
        return await channel.send(message);
      } catch (error) {
        if (i === attempts) throw error;
      }
    }
  },
});

const withLog = (channel, log) => ({
  async send(message) {
    const result = await channel.send(message);
    log.push(result);
    return result;
  },
});

// The service depends only on "things with send()" — polymorphism.
class AlertService {
  #channels;
  constructor(channels) { this.#channels = [...channels]; }
  async alert(message) {
    const results = await Promise.allSettled(this.#channels.map((c) => c.send(message)));
    return results.map((r) => r.status);
  }
}

const log = [];
const service = new AlertService([
  withLog(new EmailChannel('ops@example.com'), log),
  withLog(withRetry(new FlakySmsChannel('555-0100', 2), 3), log),
  new FlakySmsChannel('555-0199', 1),
]);

service.alert('disk 91% full').then((statuses) => {
  console.log(statuses);
  console.log(log);
});
```

```output
[ 'fulfilled', 'fulfilled', 'rejected' ]
[
  'email to ops@example.com: disk 91% full',
  'sms to 555-0100: disk 91% full'
]
```

Trace the second channel. `AlertService` calls `send` on the logging wrapper, which calls `send` on the retry wrapper, which calls the SMS channel. The channel fails twice (`failures = 2`), the retry wrapper swallows those errors and succeeds on the third attempt, and the logging wrapper records the result. The third channel has no retry wrapper, fails once, and its promise is rejected; `Promise.allSettled` reports that without stopping the others ([[b1-promise-allsettled]]).

Where each principle appears:

- **Encapsulation.** Addresses, numbers and failure counters are private. `AlertService` copies the array it is given, so the caller cannot alter the channel list afterwards.
- **Polymorphism.** `AlertService` calls `c.send(message)` on class instances and on plain objects returned by wrappers alike. There is no common base class and no `instanceof`.
- **Composition.** Retry and logging are written once and combine with any channel, in any order. Two channels and two features need four small pieces instead of eight classes; a new channel or feature adds one piece. A wrapper that has the same interface as the thing it wraps is known as the **decorator pattern**.

The edge worth noticing is ordering: `withLog(withRetry(ch))` logs once after the retries succeed, while `withRetry(withLog(ch))` would log on each successful inner call. Composition makes such choices explicit at the place where objects are assembled.

## In real systems

**Front-end frameworks.** React builds interfaces by composing components and hooks, and its documentation advises against component inheritance. Vue's composables and Svelte's stores apply the same idea. The typical encapsulation unit is a module or a hook that exposes a small API over hidden state.

**Middleware pipelines.** Express, Koa, Redux and `fetch` interceptors are composition of functions sharing one signature. Each middleware is replaceable and testable alone.

**Dependency injection.** Angular and NestJS construct classes by injecting their collaborators; in plain Node.js services, passing clients (database, cache, logger) into constructors or factory functions is standard practice because it makes unit tests possible without infrastructure.

**Platform protocols.** Anything iterable works with `for...of`; anything thenable works with `await`; streams accept any object with the right methods. Library authors rely on feature detection over `instanceof` so that values from other realms or duplicated packages still work.

**Domain modelling.** Value objects such as `Money` or `EmailAddress` encapsulate validation so that an invalid value cannot exist; aggregates such as `Order` expose operations (`addLine`, `cancel`) rather than their arrays.

## Trade-offs and alternatives

Encapsulation costs some convenience. Private state cannot be inspected by generic tools: it is skipped by JSON, spread and `structuredClone`, so encapsulated objects need explicit `toJSON` or `clone` methods. Tests cannot peek at private fields either — which is usually healthy, since tests should exercise behaviour through the public interface. And not everything deserves hiding: a plain data record passed between layers, such as an API response, has no invariants to protect, and wrapping it in a class with accessors adds ceremony without safety.

Polymorphism moves the "which case is this?" decision from the caller into the objects. That is the right trade when there are several operations over an open set of kinds. When the set of kinds is small and fixed and new *operations* are added often, a `switch` over a discriminating field can be simpler — and in TypeScript, discriminated unions make such switches exhaustively checked. Neither style is universally better.

Composition costs forwarding code and one more level of indirection when reading: you must find which part does the work. Taken to extremes, a system of many tiny wrappers is as hard to follow as a deep hierarchy. The aim is not the maximum number of parts but parts that correspond to things that actually vary independently.

It is also worth saying that OOP is one style among several in JavaScript. A great deal of well-structured code uses plain data plus pure functions ([[b1-functional-style]], [[b1-pure-functions]]), with modules providing the encapsulation. The principles in this lesson — hide what can change, depend on small interfaces, assemble from parts — apply equally there.

## Common mistakes

**Treating `_name` or TypeScript `private` as run-time privacy.** Both are visible and writable at run time. If an invariant matters, use `#private`, a closure or module scope.

**Returning or storing mutable internals by reference.** A getter that returns the private array, or a constructor that stores the caller's array without copying, leaves a back door. Copy on the way in and on the way out, or freeze.

**Anaemic classes.** A class with only fields plus getters and setters, with all the logic living in other functions that pull the data out, has the syntax of OOP and none of the benefit. Move the operations to the object that owns the data.

**Switching on type inside polymorphic code.** A chain of `if (x instanceof A) ... else if (x instanceof B)` that picks behaviour is a missed method. Give each class the method and call it. (Branching on `instanceof` to *handle errors* is a different, legitimate use.)

**Inheriting for code reuse alone.** "Both need `formatDate`" does not make one class a kind of the other. Put shared helpers in a module or a small collaborator.

**Mixin name collisions.** Two mixins that both define `init` or `id` overwrite each other silently, last one wins. Keep mixins small, name their methods specifically, and prefer delegation when the capability has its own state.

> [!MISTAKE] Using `instanceof` at a boundary
> A value from an iframe, a worker, or a second installed copy of a library can fail `instanceof` even though it is the right kind of object, because the class it was created from is a different object from the one you are comparing with. At boundaries, check for the capability you need: `Array.isArray(value)`, or `typeof value?.then === 'function'`.

## Interview perspective

These questions are less about syntax and more about whether you can connect a principle to a mechanism and to a design consequence. Define the term in one sentence, name the JavaScript mechanism, then give the reason it matters.

> [!INTERVIEW] "How does JavaScript implement the OOP principles?"
> "Encapsulation comes from `#private` class members, closures and module scope — underscore prefixes are only a convention. Polymorphism is dynamic property lookup: `obj.method()` finds the method on the actual object's prototype chain at call time, so it works through overriding in a class hierarchy and also through duck typing with no hierarchy at all. Inheritance is prototype delegation, with `class extends` as syntax for it. And composition is just objects holding references to other objects and delegating, which is usually preferred over deep hierarchies."

Questions to prepare:

- **What is the difference between encapsulation and abstraction?** Encapsulation restricts access to state so invariants hold; abstraction presents a simplified interface that hides how. Hiding the data is what makes the interface the only thing callers can depend on.
- **How would you make a property private?** `#field`; closure in a factory; module-scoped variable; a `WeakMap` keyed by instance in pre-2022 code ([[b1-weakmap]]). State which are enforced.
- **What is duck typing, and what is its risk?** Capability over ancestry; failures surface at the call, at run time. Mention TypeScript's structural types.
- **Why "composition over inheritance"?** Looser coupling, selective interface, run-time swapping, several capabilities at once, easier testing. Give the fragile base class and class explosion problems as the concrete reasons, and say when inheritance is still right.
- **Does JavaScript have multiple inheritance or interfaces?** No. Use mixins or composition for the first; duck typing, protocols such as `Symbol.iterator`, or TypeScript interfaces for the second.
- **Design question:** "Model a text editor's shapes, a payment system with several providers, or a logger with several outputs." A strong answer identifies what varies, puts each variation behind a small common interface, injects the implementations, and keeps state private.

A frequent follow-up is to ask you to refactor a `switch (type)` into polymorphic objects, or a subclass into a wrapper. Practise both directions.

## Practice

1. **Seal the leak.** Write `class Team` with a private member list, `add(name)` rejecting duplicates, and a `members` getter. Show that `team.members.push('x')` cannot corrupt the team. Then make the constructor accept an initial array safely.
2. **Replace the switch.** Given `function price(item)` with a `switch (item.type)` over `'book'`, `'food'` and `'digital'` applying different tax rules, refactor into objects with a `price()` method. Add a fourth type without editing existing code.
3. **Duck-typed logger.** Write `createApp({ logger })` that works with `console`, with an object that collects messages in an array, and with a logger that prefixes timestamps — without any `instanceof`.
4. **From inheritance to composition.** `class TimestampedCache extends Map` overrides `set` to record insertion times, and breaks when code calls `clear()`. Rewrite it to hold a `Map` privately and expose only `get`, `set`, `has` and `ageOf`.
5. **Write a mixin.** Implement `Emitter(Base)` adding `on` and `emit` with private listener storage, apply it to two unrelated classes, and explain what happens if `Base` also defines `on`.
6. **Decorate.** Add a `withTimeout(channel, ms)` wrapper to the worked example that rejects if `send` takes too long, and decide where in the wrapper chain it belongs relative to `withRetry`.

## Quick revision {#quick-revision}

- **Encapsulation**: state changes only through the object's own methods, so invariants hold and internals can change. Enforced by `#private` members, closures and module scope. `_underscore` and TypeScript `private` are not enforced at run time.
- Do not leak mutable internals: copy arrays and objects on the way in and out. Accessors that only pass values through hide nothing. Prefer methods that do the operation ("tell, don't ask").
- **Abstraction**: the small public interface is all that callers can rely on.
- **Polymorphism**: one call site, many behaviours. In JavaScript it is dynamic lookup of a method name on the actual object at call time — through overriding in a hierarchy, or through duck typing with no shared class.
- Built-in protocols are duck typing: `Symbol.iterator`, `then`, `toString` / `Symbol.toPrimitive`, `toJSON`.
- Use `instanceof` inside code you control; use feature checks (`Array.isArray`, `typeof x.then`) at boundaries across realms and packages. No overloading in JavaScript.
- **Composition**: objects hold other objects and delegate (has-a / uses-a). Forms: delegation to a private part, dependency injection, wrappers (decorators), mixins (`Object.assign` onto a prototype, or `Base => class extends Base`), and function composition.
- Inheritance is for genuine, shallow is-a relationships and platform base classes; it exposes the whole parent and couples to its internals. Composition exposes only what you forward, allows swapping parts and combining many capabilities.
- Smells: type switches for behaviour, anaemic data classes, deep hierarchies, inheriting to reuse a helper, mixin name clashes.

## Key takeaways {#key-takeaways}

- The three principles exist to make change cheap: hide what may change, depend on small interfaces, and assemble behaviour from independent parts.
- Encapsulation is about protecting invariants, not about adding getters; in JavaScript only `#private` names, closures and module scope enforce it.
- Polymorphism in JavaScript needs no class hierarchy — any object with the right method takes part, which is why duck typing and protocols are everywhere in the language.
- Composition is plain object references plus delegation, and it handles independent, combinable capabilities that a single-parent hierarchy cannot.
- Favour composition by default; use inheritance where the is-a relationship is real, the hierarchy is shallow, or a platform requires a base class.
- These ideas are not tied to the `class` keyword: modules, closures and functions express them equally well.
