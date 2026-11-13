---
summary: "`extends` makes a class inherit another class's code and builds a real prototype chain; `implements` only asks the compiler to check that a class matches a contract. You will learn exactly what each keyword does at compile time and at runtime, how to combine them, the surprising things `implements` does not do, and how to choose between them when designing types."
difficulty: intermediate
minutes: 40
objectives:
  - Explain what `extends` and `implements` each do at compile time and at runtime
  - Combine one `extends` with several `implements` clauses and predict the compiler's checks
  - Debug the common surprise that `implements` does not type a class's method parameters or add optional members
  - Explain why interfaces can extend classes and what declaration merging between a class and an interface does
  - Choose between inheritance, interfaces and composition for a given design
---

## Introduction

TypeScript gives classes two ways to relate to other types, and they look similar enough to be confused:

```typescript title="two-keywords.ts"
interface Drivable {
  drive(): string;
}

class Vehicle {
  wheels = 4;
  honk(): string { return 'beep'; }
}

class Car extends Vehicle implements Drivable {
  drive(): string { return 'vroom'; }
}

const car = new Car();
console.log(car.drive(), car.honk(), car.wheels);
```

```output
vroom beep 4
```

`Car` gets `honk` and `wheels` from `Vehicle` without writing them: that is **`extends`**, which means *inherit implementation*. `Car` had to write `drive` itself; `Drivable` merely required it: that is **`implements`**, which means *promise to satisfy a contract, and have the compiler check the promise*.

The distinction matters well beyond syntax. `extends` creates a runtime relationship that affects how objects behave, how they are constructed and what `instanceof` returns. `implements` creates nothing at runtime; it is a compile-time assertion. Mixing them up leads to designs that inherit code they should not, and to surprises such as "I implemented the interface, so why are my parameters `any`?". This lesson makes both keywords precise.

## Before you start

- **Interfaces** — declaring object shapes and extending interfaces. See [[b2-interfaces]] and [[b2-extending-interfaces]].
- **Classes and inheritance** — `class`, `extends`, `super`. See [[b2-classes-ts]] and [[b2-class-inheritance]].
- **Structural typing** — TypeScript compares types by their members, not their names. See [[b2-structural-typing]].
- **Abstract classes** — useful for the comparison at the end. See [[b2-abstract-classes]].

Examples use TypeScript 5.x or 6.x with `strict` enabled, targeting ES2022.

## The intuition

`extends` is like inheriting a house: you move in and everything is already there — walls, plumbing, furniture. You can renovate rooms (override methods) and add new ones, but you live inside the original structure, and you can inherit only one house.

`implements` is like passing a building inspection. The inspector has a checklist ("has a fire exit", "has working smoke alarms"). You build everything yourself; the inspector only checks that the list is satisfied. You can pass several inspections at once — fire, electrical, accessibility — and once you have passed, the inspector leaves nothing behind in the building. The certificate is the compiler's approval, and it exists only at build time.

## `extends`: inheriting implementation

`class B extends A` does three things:

1. **Types.** `B`'s instance type includes every member of `A`'s instance type, and `B` is assignable wherever an `A` is expected.
2. **Runtime.** JavaScript links `B.prototype` to `A.prototype`, so method lookups that miss on a `B` instance continue to `A`'s methods. The constructors are also linked, so static members are inherited.
3. **Construction.** `B`'s constructor must call `super(...)` before touching `this`, which runs `A`'s constructor and its field initialisers.

```typescript title="extends.ts"
class Entity {
  constructor(readonly id: number) {}
  describe(): string { return `#${this.id}`; }
}

class Order extends Entity {
  constructor(id: number, readonly total: number) {
    super(id);                                 // required before using this
  }
}

const o = new Order(7, 99);
console.log(o.describe(), o instanceof Order, o instanceof Entity);
console.log(Object.getPrototypeOf(Order.prototype) === Entity.prototype);
```

```output
#7 true true
true
```

Omitting the `super` call is a compile error (`Constructors for derived classes must contain a 'super' call`, TS2377) and, in JavaScript, a runtime `ReferenceError` when `this` is used. A class can extend only **one** class; JavaScript has single inheritance. The thing after `extends` is any expression that evaluates to a constructor, which is how mixins work (`class X extends Timestamped(Base)`; see [[b2-mixins]]).

## `implements`: checking a contract

`class B implements I` does exactly one thing: the compiler checks that `B`'s instance type is assignable to `I`, and reports an error on the class if it is not. Nothing else changes.

```typescript title="implements.ts"
interface Serializable {
  serialize(): string;
}

interface Auditable {
  readonly createdBy: string;
}

class Invoice implements Serializable, Auditable {
  readonly createdBy = 'ada';
  constructor(readonly amount: number) {}
  serialize(): string { return JSON.stringify(this); }
}

class Broken implements Serializable {}
// error TS2420: Class 'Broken' incorrectly implements interface 'Serializable'.
//   Property 'serialize' is missing in type 'Broken' but required in type 'Serializable'.

console.log(new Invoice(120).serialize());
```

```output
{"amount":120,"createdBy":"ada"}
```

A class may implement **any number** of interfaces, separated by commas. The check is structural and member-by-member: each required member must exist, with a compatible type, and must be **public** (an interface describes what outsiders can use, so `private serialize()` fails with `Property 'serialize' is private in type ... but not in type 'Serializable'`). Besides interfaces, a class can implement an object type alias or even another class's instance type, but not a union, because a union does not say which members are guaranteed (error TS2422).

### What `implements` does *not* do

Because `implements` is only a check, three things that people expect do not happen.

**It does not type the class's members.** The class body is checked on its own first, then compared against the interface. Parameters do not get their types from the interface:

```typescript title="no-contextual-types.ts"
interface Handler {
  handle(input: string): number;
  label?: string;
}

class Len implements Handler {
  handle(input) { return input.length; }
  // error TS7006: Parameter 'input' implicitly has an 'any' type.
}

new Len().label;
// error TS2339: Property 'label' does not exist on type 'Len'.
```

Annotate the parameters in the class (`handle(input: string)`). This behaviour surprises many developers and has been discussed at length in the TypeScript issue tracker; the design team kept it because changing it would alter the meaning of existing code.

**It does not add optional members.** `label` is optional in `Handler`, the class does not declare it, so instances of `Len` have no `label` property in their type. Declare it in the class if you want it.

**It leaves nothing at runtime.** The `implements` clause is erased. You cannot use an interface with `instanceof`:

```typescript title="no-runtime.ts"
interface Serializable {
  serialize(): string;
}

const x: unknown = { serialize: () => '{}' };
console.log(x instanceof Serializable);
// error TS2693: 'Serializable' only refers to a type, but is being used as a value here.
```

If you compile it anyway, the emitted code throws `ReferenceError: Serializable is not defined`. To test at runtime whether a value satisfies an interface, write a type guard (see [[b2-custom-type-guards]]).

### `implements` is optional, and that is the point

Thanks to structural typing, a class does not need `implements` to be used where an interface is expected; it only needs the right members. Plain objects qualify too:

```typescript title="structural.ts"
interface Shape {
  area(): number;
}

class Square {                        // no implements clause
  constructor(private readonly side: number) {}
  area(): number { return this.side ** 2; }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}

console.log(totalArea([new Square(2), { area: () => 1.5 }]));
```

```output
5.5
```

So why write `implements` at all? Because it moves the error to the right place. Without it, a mistake in `Square` (say, `area` returning a `string`) is reported at every call site that passes a `Square` as a `Shape` — possibly in another file, possibly never if nobody does yet. With `implements Shape`, the error appears on the class itself, the moment the class stops matching. It also documents intent: readers see immediately which contracts the class is meant to fulfil.

`implements` checks only the **instance side** of a class. Static members cannot be required this way; if you need a class to have a static `create()`, describe the constructor in a separate interface and check it by assignment: `const factory: ClockStatic = DigitalClock;`.

## Combining them

The full form is one `extends` followed by any number of `implements`:

```typescript title="combined.ts"
interface Serializable { serialize(): string }
interface Auditable { readonly createdBy: string }

class Entity {
  constructor(readonly id: number) {}
}

class Order extends Entity implements Serializable, Auditable {
  readonly createdBy = 'ada';
  serialize(): string { return JSON.stringify(this); }
}

const order = new Order(7);
console.log(order.serialize(), order instanceof Entity);
```

```output
{"id":7,"createdBy":"ada"} true
```

Inherited members count towards the contract. If `Entity` already had a public `serialize()`, `Order` would satisfy `Serializable` without writing anything. Interfaces themselves use `extends`, and may extend several: `interface Repository<T> extends Reader<T>, Writer<T> {}`. Interfaces never use `implements`.

| | `class A extends B` | `class A implements I` | `interface I extends J` |
|---|---|---|---|
| Inherits code | Yes | No | No code to inherit |
| How many | One | Many | Many |
| Runtime effect | Prototype chain, `super`, `instanceof` | None | None |
| Requires `super()` | Yes, if `A` has a constructor | No | — |
| Checks visibility | Can widen, not narrow | Members must be public | — |

## How it works internally

Compile `combined.ts` to ES2022 and look at the `Order` class:

```javascript title="combined.js (emitted, excerpt)"
class Order extends Entity {
    createdBy = 'ada';
    serialize() { return JSON.stringify(this); }
}
```

The `extends Entity` clause is JavaScript and stays. The `implements Serializable, Auditable` clause is TypeScript and is gone, along with the interfaces. This is the single most useful fact for reasoning about the two keywords: **if it survives compilation, it can affect runtime behaviour**.

## Two surprises: interfaces extending classes, and class–interface merging

The notes many developers carry say "an interface cannot extend a class". That is false in TypeScript. An interface may extend a class, and it then inherits the class's members — **including private and protected ones**, but not their implementations:

```typescript title="interface-extends-class.ts"
class Control {
  private state = 0;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select(): void {}
}

class Fake implements SelectableControl {
  private state = 0;
  select(): void {}
}
// error TS2420: Class 'Fake' incorrectly implements interface 'SelectableControl'.
//   Types have separate declarations of a private property 'state'.
```

Because `SelectableControl` contains `Control`'s private `state`, only subclasses of `Control` can implement it. This is a niche technique for saying "this interface is only for members of this class family".

The second surprise is **declaration merging**. An interface with the same name as a class merges into the class's instance type:

```typescript title="merging.ts"
class Box {
  width = 1;
}

interface Box {
  height: number;
}

const b = new Box();
console.log(b.width, b.height);       // compiles: Box now "has" height
```

```output
1 undefined
```

The compiler believes every `Box` has a `height`, but no code ever sets it. Merging is how mixin libraries and module augmentation add members to existing classes (see [[b2-declaration-merging]] and [[b2-module-augmentation]]). In application code it is almost always a mistake — often an accidental name collision — and TypeScript's strict property initialisation checks do not catch it.

## Worked example: a contract at the boundary, inheritance inside

A common, healthy design: an interface defines what the rest of the application depends on, a small abstract base shares code between real implementations, and tests use a fake that implements the interface without inheriting anything.

```typescript title="storage.ts"
interface KeyValueStore {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
}

// Shared code for real stores: key prefixing and logging.
abstract class PrefixedStore implements KeyValueStore {
  constructor(private readonly prefix: string) {}

  async get(key: string): Promise<string | undefined> {
    return this.read(this.prefix + key);
  }

  async set(key: string, value: string): Promise<void> {
    console.log(`set ${this.prefix + key}`);
    await this.write(this.prefix + key, value);
  }

  protected abstract read(fullKey: string): Promise<string | undefined>;
  protected abstract write(fullKey: string, value: string): Promise<void>;
}

class MemoryStore extends PrefixedStore {
  private readonly data = new Map<string, string>();
  protected async read(k: string) { return this.data.get(k); }
  protected async write(k: string, v: string) { this.data.set(k, v); }
}

// A test double: satisfies the contract, inherits nothing.
class FakeStore implements KeyValueStore {
  calls: string[] = [];
  async get(key: string) { this.calls.push(`get ${key}`); return 'fake'; }
  async set(key: string) { this.calls.push(`set ${key}`); }
}

async function rememberTheme(store: KeyValueStore, theme: string): Promise<string> {
  await store.set('theme', theme);
  return (await store.get('theme')) ?? 'default';
}

console.log(await rememberTheme(new MemoryStore('app:'), 'dark'));
const fake = new FakeStore();
console.log(await rememberTheme(fake, 'dark'), fake.calls);
```

```output
set app:theme
dark
fake [ 'set theme', 'get theme' ]
```

Walk through the design. `rememberTheme` depends only on `KeyValueStore`, an interface; it cannot know or care which class it receives. `PrefixedStore` uses `implements` so that any drift from the contract is reported on the base class, and uses `abstract` methods for the storage-specific steps. `MemoryStore` uses `extends` to inherit the prefixing and logging. `FakeStore` uses only `implements`: it would be wrong for a test double to inherit real logging and prefixing. Note also that `FakeStore.set` declares only one parameter; that is allowed, because a method that ignores an argument can still be called with it. A production `LocalStorageStore` or `RedisStore` would extend `PrefixedStore` in the same way.

## In real systems

- **Dependency boundaries.** Services depend on interfaces (`PaymentGateway`, `Clock`, `Logger`) so that implementations can be swapped and faked. `implements` keeps each implementation honest.
- **Framework lifecycle interfaces.** Angular components declare `implements OnInit, OnDestroy`. The interfaces add nothing at runtime — Angular would call `ngOnInit` anyway — but they make a misspelled `ngOnInt` a compile error.
- **Base classes for shared plumbing.** Error hierarchies (`class NotFoundError extends HttpError`), web components (`extends HTMLElement`) and framework base classes rely on `extends` because they need real inherited behaviour and a working `instanceof`.
- **Libraries publishing contracts.** Libraries often export interfaces for consumers to implement (custom storage adapters, loggers) rather than base classes to extend, so consumers keep their single `extends` slot for their own hierarchy.

## Trade-offs and alternatives

Reach for **`implements`** (or plain structural typing) when you want to state *what* something can do without dictating *how*. It costs nothing at runtime, allows many contracts per class, and keeps implementations independent — which is why it suits module boundaries and testing.

Reach for **`extends`** when several classes genuinely share implementation and an "is-a" relationship holds: a `NotFoundError` is an `HttpError`. Inheritance buys code reuse and `instanceof`, but costs coupling: subclasses depend on the base class's internals, and the single inheritance slot is used up.

When the reuse is about *behaviour* rather than identity — "this class also needs retry logic" — **composition** is usually better than either: hold a `Retrier` as a field and delegate to it. See [[d1-composition-vs-inheritance]] and [[b4-composition-over-inheritance]] for the same principle in React.

## Common mistakes

> [!MISTAKE] Expecting `implements` to type method parameters
> `class Len implements Handler { handle(input) {...} }` leaves `input` as implicit `any` (TS7006 under `strict`). Annotate the parameters in the class.

**Using an interface at runtime.** `x instanceof Serializable` is a type-only name used as a value (TS2693). Use a class (with `extends`) if you need `instanceof`, or a type guard function.

**Implementing an interface with private members.** Interface members must be public. If the member should be hidden, it does not belong in the interface.

**Extending a class only to satisfy a type.** If you write `extends Base` just so a function accepting `Base` will take your object, and you override everything, you wanted an interface. Inheriting unwanted constructor logic and fields is the cost.

**Accidental class–interface merging.** Declaring `interface User` in the same scope as `class User` merges them; the class now claims properties it never sets. Rename one of them.

## Interview perspective

**"What is the difference between `extends` and `implements`?"** Lead with runtime: `extends` creates a prototype chain and inherits code; `implements` is erased and only makes the compiler check the class's shape. Then: one `extends`, many `implements`; `super()` required with `extends`; public-only members for `implements`.

**"If TypeScript is structural, why use `implements`?"** It reports mismatches at the class declaration instead of at distant use sites, and documents intent.

**"Can an interface extend a class?"** Yes, and it inherits private and protected members, which restricts implementers to that class's subclasses. Candidates who say "no" are repeating a rule from other languages.

**"Abstract class or interface for a plugin API?"** Interface for the contract consumers implement, so they can keep their own inheritance; optionally ship an abstract base class with helpful defaults for those who want it.

## Practice

1. Define `interface Cache<V> { get(k: string): V | undefined; set(k: string, v: V): void }`. Write a `MapCache` that implements it and an `ExpiringCache` that extends `MapCache`. Which methods does `ExpiringCache` need to override?
2. Write a class that `implements` an interface but omits parameter types. Read the errors, then fix them.
3. Create an interface that extends a class with a private member, and try to implement it from an unrelated class. Explain the error in your own words.
4. Take a class hierarchy from a project you know. Which `extends` relationships are true "is-a" relationships, and which would be clearer as composition?

```quiz
Q: What remains of `class Car extends Vehicle implements Drivable` in the compiled JavaScript?
- [ ] Both `extends Vehicle` and `implements Drivable`
- [x] Only `extends Vehicle`
- [ ] Only `implements Drivable`
- [ ] Neither; both are type-level
> `extends` is JavaScript syntax that builds a real prototype chain, so it is kept. `implements` and the `Drivable` interface are TypeScript-only and are erased. That is why `instanceof Vehicle` works and `instanceof Drivable` is an error.
```

```quiz
Q: `interface Handler { handle(input: string): number }` and `class H implements Handler { handle(input) { return input.length } }`. What does the compiler say under `strict`?
- [ ] Nothing; `input` is inferred as `string` from the interface
- [x] `input` implicitly has an `any` type
- [ ] `H` does not implement `handle`
- [ ] `length` does not exist on `string`
> `implements` checks the class after its own types are worked out; it does not provide types to the class's parameters. `input` has no annotation, so `noImplicitAny` (part of `strict`) reports TS7006. The class does implement `handle` — with an `any` parameter, which is compatible.
```

## Quick revision {#quick-revision}

- `extends`: inherits code, builds a prototype chain, requires `super()` (TS2377 if missing), enables `instanceof`; one base class only.
- `implements`: compile-time check that the instance type matches; many allowed; erased in output; members must be public (TS2420).
- `implements` does not type parameters (TS7006), does not add optional members, cannot be used with `instanceof` (TS2693), checks only the instance side.
- Classes can implement interfaces, object type aliases and class types, but not unions (TS2422).
- Structural typing means `implements` is optional; use it to report mismatches at the declaration.
- Form: `class A extends B implements I, J`. Inherited members count towards `I`, `J`. Interfaces use `extends` (many), never `implements`.
- Interfaces can extend classes and inherit private/protected members, restricting implementers to subclasses.
- Same-named class and interface merge; the class then claims members it never initialises.

## Key takeaways {#key-takeaways}

- `extends` is about reusing implementation and exists at runtime; `implements` is about checking a contract and vanishes at compile time.
- A class gets one `extends` and any number of `implements`.
- `implements` checks the class but does not shape it: annotate parameters yourself and declare optional members you need.
- Depend on interfaces at boundaries, use inheritance for real "is-a" code sharing, and prefer composition for borrowed behaviour.
