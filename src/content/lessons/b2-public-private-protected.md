---
summary: TypeScript's `public`, `private` and `protected` modifiers decide which code may touch a class member, and `readonly` decides whether it may be reassigned. You will learn exactly what each modifier allows, why they vanish from the emitted JavaScript, when to reach for native `#private` fields instead, and how to use these tools to keep a class's invariants safe.
difficulty: intermediate
minutes: 50
objectives:
  - Explain what `public`, `private` and `protected` allow, and predict the compiler error for an illegal access
  - Explain why TypeScript's `private` is erased at runtime and choose between it and a native `#private` field
  - Design a base class whose `protected` members form a deliberate extension surface for subclasses
  - Use `readonly` on class members and explain why it does not make nested objects immutable
  - Debug common encapsulation mistakes such as bracket-access escapes, aliasing through mutable types and serialised private data
---

## Introduction

A class bundles data with the methods that work on that data. A bank account class might hold a `balance` and offer `deposit` and `withdraw`. The methods exist to protect a rule — say, "the balance never goes negative". But if any code anywhere can write `account.balance = -500`, the rule is only a hope. Every caller in the codebase becomes responsible for it, and one careless line breaks it.

**Encapsulation** is the practice of hiding a class's internal state behind a small, deliberate interface so that the class alone is responsible for keeping that state valid. TypeScript supports encapsulation with **access modifiers**: keywords placed in front of a class member that say who may use it.

- `public` — anyone. This is the default.
- `private` — only code inside the same class.
- `protected` — code inside the same class and inside its subclasses.

Alongside them sits the `readonly` modifier, which is about a different question: not *who* may touch a member, but whether it may be *reassigned* after the object is constructed.

These modifiers matter in day-to-day frontend and Node.js work. Service classes in Angular and NestJS mark their injected dependencies `private`. SDK clients hide their HTTP plumbing behind `private` members so the public API stays small. Base classes in UI frameworks expose `protected` hooks for subclasses to fill in. Knowing exactly what the compiler checks — and what it does not check at runtime — is what separates using these keywords correctly from using them as decoration.

## Before you start

- **JavaScript classes** — `class`, `constructor`, `this`, methods and `extends`. See [[b1-classes]] and [[b1-class-inheritance]].
- **Classes in TypeScript** — declaring typed fields and how the compiler checks them. See [[b2-classes-ts]].
- **Native private fields** — JavaScript's own `#field` syntax. See [[b1-public-private-fields]]; this lesson compares it with TypeScript's `private`.
- **How TypeScript compiles** — that types are checked and then erased. See [[b2-tsc-compilation]].

All examples assume TypeScript 5.x or 6.x with `strict` enabled and a compile target of ES2022 or later. Where the target changes the behaviour, the lesson says so.

## The intuition

Think of a class as a building. `public` members are the lobby: anyone who walks in can use them. `protected` members are staff-only corridors: people who work in this building, or in an annex built onto it (a subclass), may use them. `private` members are the manager's office: only this building's own staff may enter, and not even the annex.

The analogy has one important limit. In TypeScript, the locks on `private` and `protected` doors are enforced by the *compiler*, not by the walls. Once the code is compiled to JavaScript, the doors are still there but the locks are gone. Code that the compiler never checks — plain JavaScript, `any`-typed values, a debugger console — can walk straight in. Native `#private` fields are the exception: they are real walls, enforced by the JavaScript engine. Keep that distinction in mind for the whole lesson.

## The three access modifiers

Here is a class that uses all three. The comments mark the lines the compiler rejects; everything else compiles.

```typescript title="account.ts"
class Account {
  public owner: string;      // anyone may read or write
  protected balance = 0;     // this class and subclasses
  private pin: string;       // this class only

  constructor(owner: string, pin: string) {
    this.owner = owner;
    this.pin = pin;
  }

  checkPin(attempt: string): boolean {
    return attempt === this.pin;          // fine: inside Account
  }
}

class Savings extends Account {
  addInterest(rate: number): void {
    this.balance += this.balance * rate;  // fine: protected, inside a subclass
  }

  peekPin(): string {
    return this.pin;
    // error TS2341: Property 'pin' is private and only accessible within class 'Account'.
  }
}

const a = new Account('Ada', '1234');
a.owner;    // fine
a.balance;
// error TS2445: Property 'balance' is protected and only accessible within class
// 'Account' and its subclasses.
a.pin;
// error TS2341: Property 'pin' is private and only accessible within class 'Account'.
```

### public

**`public`** means "no restriction". Every member without a modifier is already public, so writing `public owner: string` and `owner: string` produce exactly the same type. Teams that write `public` explicitly do it for readability — it shows the author *chose* to expose the member — and because parameter properties need some modifier to work (see [[b2-parameter-properties]]). Either convention is fine; be consistent within a codebase.

Members of an interface are always public. That is why a class cannot satisfy an interface with a private member: the compiler reports `Property 'id' is private in type 'Hidden' but not in type 'HasId'` (error TS2420). An interface describes what *outsiders* can rely on, so its members must be visible to outsiders.

### private

**`private`** members can be used only by code written inside the class body that declares them. "Inside the class body" is the important phrase: privacy is per *class*, not per *object*. One `Account` method may read the private `pin` of a *different* `Account` instance:

```typescript title="same-class.ts"
class Account {
  constructor(private pin: string) {}

  samePinAs(other: Account): boolean {
    return this.pin === other.pin;   // allowed: we are inside Account
  }
}

console.log(new Account('1234').samePinAs(new Account('1234')));
```

```output
true
```

This is the same rule Java and C# use, and it makes methods such as `equals` or `compareTo` possible. Subclasses do not get access: as `Savings.peekPin` showed, a private member is invisible even to code that extends the class.

### protected

**`protected`** members are visible inside the declaring class and inside every class that extends it, directly or indirectly. They are not visible from outside. Use `protected` for members that subclasses legitimately need — state they must read, or helper methods they should call — but that the outside world should not depend on.

There is one subtle rule. Inside a subclass, you may access a protected member only through an instance of *that subclass* (or its own subclasses), not through an instance of the base class:

```typescript title="protected-rule.ts"
class Account {
  protected balance = 0;
}

class Savings extends Account {
  peekSibling(other: Savings): number {
    return other.balance;   // fine: other is a Savings
  }

  peekAny(other: Account): number {
    return other.balance;
    // error TS2446: Property 'balance' is protected and only accessible through an
    // instance of class 'Savings'. This is an instance of class 'Account'.
  }
}
```

The reason: `other` might be a `Checking` account, a sibling class that `Savings` knows nothing about. Being a subclass of `Account` gives `Savings` access to protected state of *its own kind*, not a pass to read every other subclass's internals.

### Modifiers on constructors and static members

Modifiers apply to constructors and to `static` members too. A **`private` constructor** means only code inside the class can call `new` — the basis of the [[b2-singleton-pattern]] and of static factory methods. A **`protected` constructor** means the class cannot be instantiated from outside but can be extended:

```typescript title="protected-constructor.ts"
class Shape {
  protected constructor() {}
}

class Square extends Shape {
  constructor() {
    super();          // fine: subclasses may call a protected constructor
  }
}

new Square();         // fine
new Shape();
// error TS2674: Constructor of class 'Shape' is protected and only accessible
// within the class declaration.
```

A protected constructor is an older way to say "this class exists only to be extended". In modern TypeScript an `abstract class` says that more clearly; see [[b2-abstract-classes]].

### Changing visibility in a subclass

A subclass may override a member and make it *more* visible, but never *less* visible:

```typescript title="widening.ts"
class Base {
  protected greet(): string { return 'hi'; }
  public run(): void {}
}

class Wider extends Base {
  public override greet(): string { return 'hello'; }   // protected -> public: allowed
}

class Narrower extends Base {
  protected override run(): void {}
  // error TS2415: Class 'Narrower' incorrectly extends base class 'Base'.
  //   Property 'run' is protected in type 'Narrower' but public in type 'Base'.
}
```

Narrowing is forbidden because of substitution: any code holding a `Base` can call `run()`, and a `Narrower` must be usable wherever a `Base` is expected. If `Narrower` hid `run`, that promise would break. Widening is allowed because it only adds capability. A `private` member cannot be overridden from a subclass at all, because the subclass cannot see it in the first place.

## How it works internally: compile time versus runtime

TypeScript's access modifiers are **type-level only**. The compiler checks them and then erases them. Compile the `Account` class above with target ES2022 and the output is plain JavaScript with no trace of `private`:

```javascript title="account.js (emitted)"
class Account {
    owner;
    balance = 0;
    pin;
    constructor(owner, pin) {
        this.owner = owner;
        this.pin = pin;
    }
    checkPin(attempt) {
        return attempt === this.pin;
    }
}
```

Three consequences follow, and each one has caused real bugs.

First, **private data is ordinary data at runtime**. It shows up in `Object.keys`, in `JSON.stringify`, in `console.log` and in the browser's dev tools:

```typescript title="leak.ts"
class Account {
  private pin: string;
  constructor(public owner: string, pin: string) { this.pin = pin; }
}

const a = new Account('Ada', '1234');
console.log(Object.keys(a));
console.log(JSON.stringify(a));
```

```output
[ 'owner', 'pin' ]
{"owner":"Ada","pin":"1234"}
```

If this object is sent back in an API response or written to a log, the PIN goes with it. `private` stops *your TypeScript code* from reading the field by name; it does nothing to stop serialisation.

Second, **TypeScript itself leaves an escape hatch**: bracket notation with a string literal is allowed to reach a private member. `a['pin']` compiles without error and returns `'1234'`. The compiler permits this on purpose, mainly so tests can inspect internals, but it means `private` is a strong convention rather than a guarantee even inside TypeScript. Casting to `any` (`(a as any).pin`) also bypasses the check.

Third, **private members change type compatibility**. TypeScript normally compares types by structure (see [[b2-structural-typing]]): two classes with the same public members are interchangeable. Private and protected members break that rule. A class with a private member is compatible only with types whose private member comes *from the same declaration*:

```typescript title="nominal.ts"
class Celsius { private value = 0; }
class Fahrenheit { private value = 0; }

const t: Celsius = new Fahrenheit();
// error TS2322: Type 'Fahrenheit' is not assignable to type 'Celsius'.
//   Types have separate declarations of a private property 'value'.
```

Without the `private` modifier, both classes would have the shape `{ value: number }` and the assignment would succeed. This side effect is sometimes used on purpose to make a class behave nominally — so that a `UserId` wrapper cannot be passed where an `OrderId` is expected. For plain values, [[b2-branded-types]] is the lighter tool.

## Native `#private` fields: privacy at runtime

JavaScript added its own private fields in ES2022. A **private identifier** starts with `#` and is enforced by the JavaScript engine itself:

```typescript title="wallet.ts"
class Wallet {
  #pin: string;

  constructor(pin: string) {
    this.#pin = pin;
  }

  static isWallet(x: object): boolean {
    return #pin in x;     // ergonomic brand check (ES2022, TypeScript 4.5+)
  }

  check(attempt: string): boolean {
    return attempt === this.#pin;
  }
}

const w = new Wallet('9999');
console.log(Object.keys(w), JSON.stringify(w));
console.log((w as any)['#pin']);
console.log(Wallet.isWallet(w), Wallet.isWallet({}));
```

```output
[] {}
undefined
true false
```

The field is invisible to `Object.keys` and `JSON.stringify`, and `w['#pin']` looks up an ordinary property literally named `"#pin"`, which does not exist. No code outside the class body can read `#pin` — the engine throws a `SyntaxError` if you even write `w.#pin` outside it. The `#pin in x` expression checks whether an object was constructed by this class without throwing, which is a reliable runtime **brand check**.

TypeScript has supported `#` fields since version 3.8 and `#` methods and accessors since 4.3. With a target of ES2022 or later, they are emitted unchanged. With an older target, the compiler rewrites them using `WeakMap`s, which is slower and harder to debug.

How to choose:

| Question | TypeScript `private` | Native `#private` |
|---|---|---|
| Who enforces it | The type checker only | The JavaScript engine |
| Visible in `Object.keys`, `JSON.stringify`, dev tools | Yes | No |
| Bracket-access or `as any` escape | Works | Impossible |
| Accessible from subclasses | No | No |
| Combines with `protected` | — | No: there is no `#protected` |
| Works through a `Proxy` | Yes | No: methods that touch `#x` throw on a proxy |
| Brand check at runtime | No | Yes, `#x in obj` |

The `Proxy` row deserves a word. Libraries such as Vue 3 and MobX wrap objects in proxies to track changes. When a method runs with `this` set to the proxy, `this.#n` looks up the private slot on the proxy object, which does not have it:

```javascript title="proxy.js"
class Counter { #n = 0; inc() { return ++this.#n; } }
const p = new Proxy(new Counter(), {});
try { p.inc(); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
```

```output
TypeError: Cannot read private member #n from an object whose class did not declare it
```

The message text is from Node.js 22 (V8); other engines word it differently. See [[b1-proxy]] for why proxies behave this way.

A sensible rule of thumb: use `#private` when the privacy is a **security or correctness boundary** — secrets, tokens, state that untrusted or untyped code must not touch. Use TypeScript `private` when the privacy is about **API design** within a typed codebase, especially when you need `protected`, when objects will be proxied by a reactivity library, or when tests legitimately need to inspect internals. You cannot put `private` or `protected` on a `#` field; the compiler rejects the combination (error TS18010).

## protected as a designed extension surface

A frequent mistake is to make everything `protected` "in case a subclass needs it". That turns every internal detail into part of the class's contract with all future subclasses, and you can no longer change it without breaking them. Treat `protected` members as an API — smaller and more deliberate than the public one, but still an API.

The classic use is the **template method** pattern (see [[d2-template-method]]): a base class implements an algorithm's fixed steps and lets subclasses fill in specific ones through protected hooks.

```typescript title="report.ts"
abstract class Report {
  // The public algorithm. Subclasses cannot change the order of steps.
  render(): string {
    return [this.header(), ...this.rows().map((r) => `- ${r}`)].join('\n');
  }

  protected header(): string {             // hook with a default
    return 'Report';
  }

  protected abstract rows(): string[];     // hook every subclass must supply
}

class SalesReport extends Report {
  constructor(private readonly totals: Record<string, number>) {
    super();
  }

  protected override header(): string {
    return 'Sales by region';
  }

  protected rows(): string[] {
    return Object.entries(this.totals).map(([region, t]) => `${region}: ${t}`);
  }
}

const report = new SalesReport({ EU: 120, US: 340 });
console.log(report.render());
```

```output
Sales by region
- EU: 120
- US: 340
```

Outside code sees only `render()`. Subclasses see `header()` and `rows()`. The private `totals` belongs to `SalesReport` alone. Each modifier tells the reader something precise about who is expected to use the member. The `abstract` keyword is taught in [[b2-abstract-classes]], and `override` in [[b2-method-overriding|method overriding]].

## readonly Members {#b2-readonly-class-members}

The **`readonly`** modifier marks a class property that may be assigned only while the object is being created — in its field initialiser or in the constructor — and never again afterwards. It answers a different question from the access modifiers: `private` controls *who* can see a member, `readonly` controls *whether it can be reassigned*. The two combine freely, as in `private readonly cache` or `public readonly id`.

Typical readonly members are identifiers (`id`), creation timestamps (`createdAt`), injected dependencies (`private readonly http: HttpClient`) and configuration fixed at construction. Marking them `readonly` turns an accidental `this.id = otherId` buried in some method into a compile error, and tells every reader that the value is stable for the object's lifetime.

### Where assignment is allowed

```typescript title="session.ts"
class Session {
  readonly token: string;
  readonly createdAt = new Date(0);            // field initialiser: allowed
  static readonly MAX_AGE_MS = 3_600_000;      // readonly works on statics too

  constructor(token: string) {
    this.token = token;                        // constructor: allowed
    this.token = token.trim();                 // still in the constructor: allowed
  }

  rotate(next: string): void {
    this.token = next;
    // error TS2540: Cannot assign to 'token' because it is a read-only property.
  }
}

const s = new Session(' abc ');
s.token = 'x';
// error TS2540: Cannot assign to 'token' because it is a read-only property.
Session.MAX_AGE_MS = 1;
// error TS2540: Cannot assign to 'MAX_AGE_MS' because it is a read-only property.
```

The constructor may assign a readonly property as many times as it likes; the restriction starts once construction is over. Under `strict`, a readonly property that has no initialiser and is not assigned in the constructor is an error (`Property 'id' has no initializer and is not definitely assigned in the constructor`, TS2564), because it could never receive a value.

`readonly` applies to properties, not methods. There is no "readonly method"; if you want to stop subclasses from replacing a method, TypeScript has no `final` keyword — document the intent or prefer composition.

### Readonly is shallow

`readonly` protects the **binding** — which object the property points to — not the object itself. If a readonly property holds an array or an object, you can still change its contents:

```typescript title="shallow.ts"
class Playlist {
  readonly songs: string[] = [];
  readonly frozenSongs: readonly string[] = ['intro'];
}

const p = new Playlist();
p.songs.push('track 1');        // allowed: the array is mutable
console.log(p.songs);
p.songs = [];
// error TS2540: Cannot assign to 'songs' because it is a read-only property.
p.frozenSongs.push('track 2');
// error TS2339: Property 'push' does not exist on type 'readonly string[]'.
```

```output
[ 'track 1' ]
```

To protect the contents, make the *type* read-only as well: `readonly string[]` (or `ReadonlyArray<string>`) removes `push`, `splice` and the other mutating methods; `Readonly<Config>` makes every top-level property of an object type read-only; `ReadonlyMap` and `ReadonlySet` do the same for collections. See [[b2-readonly-arrays]] and [[b2-readonly-utility]]. A common pattern keeps a private mutable array and exposes a read-only view through a getter:

```typescript title="cart.ts"
class Cart {
  readonly #items: string[] = [];

  get items(): readonly string[] {
    return this.#items;             // same array, but typed so callers cannot mutate it
  }

  add(item: string): void {
    this.#items.push(item);         // the class itself still can
  }
}

const cart = new Cart();
cart.add('book');
console.log(cart.items, cart.items.length);
```

```output
[ 'book' ] 1
```

The getter returns the same array, not a copy, so the protection is again compile-time only: a caller who casts can still mutate it. Return `[...this.#items]` if you need a true defensive copy, at the cost of an allocation per call.

### Readonly is compile-time only, and it does not affect assignability

Like the access modifiers, `readonly` is erased from the emitted JavaScript. The property becomes an ordinary writable property. There is also a less obvious hole: TypeScript lets you assign a value with a readonly property to a type where the same property is mutable, and then write through that alias:

```typescript title="alias.ts"
class Session {
  constructor(readonly token: string) {}
}

const s = new Session('abc');
const loose: { token: string } = s;     // no error: readonly does not affect assignability
loose.token = 'changed through alias';
console.log(s.token);
```

```output
changed through alias
```

This is a deliberate design decision in TypeScript (making `readonly` strict here would break a great deal of existing code), so treat `readonly` as protection against *accidental* writes, not a guarantee. When runtime immutability truly matters — shared configuration, objects passed to untrusted code — use `Object.freeze` (which is itself shallow) or keep the state in a `#private` field with only a getter.

### readonly versus a getter, and versus `const`

A getter without a setter (`get id() { return this.#id; }`) is also read-only to callers, and assigning to it is also error TS2540. The difference is that a getter is computed on every read and lives on the prototype, while a readonly property is stored on the instance. Use readonly for stored values fixed at construction; use a getter when the value is derived or when you want runtime protection via a `#` field.

`const` is the variable-level counterpart: `const` stops a *variable* from being reassigned, `readonly` stops a *property* from being reassigned. Neither freezes the object inside. For object literals and static configuration, `as const` makes the whole structure deeply read-only at the type level — see [[b2-as-const]].

```quiz
Q: A class declares `readonly tags: string[] = []`. Which line compiles?
- [ ] `this.tags = ['a']` inside a regular method
- [x] `this.tags.push('a')` inside a regular method
- [ ] `instance.tags = []` from outside the class
- [ ] None of them; readonly makes the array immutable
> `readonly` is shallow: it forbids replacing the array (both reassignment lines fail with TS2540) but says nothing about the array's contents, so `push` compiles. To forbid `push`, the type must be `readonly string[]`.
```

## Worked example: a token store with layered protection

This example uses each tool for the job it is good at. Requirements: the access token must never leak through logging or serialisation; the expiry time may be read by anyone but changed only by the class; subclasses (for example a store that persists to `localStorage`) need a hook to react to changes.

```typescript title="token-store.ts"
class TokenStore {
  #token: string | undefined;              // runtime-private: never serialised
  private expiresAt = 0;                   // compile-time private
  readonly createdAt: number;              // fixed for the object's life

  constructor(private readonly now: () => number = Date.now) {
    this.createdAt = this.now();
  }

  set(token: string, ttlMs: number): void {
    this.#token = token;
    this.expiresAt = this.now() + ttlMs;
    this.onChange();
  }

  get(): string | undefined {
    return this.now() < this.expiresAt ? this.#token : undefined;
  }

  get expiresInMs(): number {              // public, read-only view of private state
    return Math.max(0, this.expiresAt - this.now());
  }

  protected onChange(): void {}            // extension hook for subclasses
}

class LoggingTokenStore extends TokenStore {
  protected override onChange(): void {
    console.log(`token updated, expires in ${this.expiresInMs} ms`);
  }
}

let clock = 1_000;
const store = new LoggingTokenStore(() => clock);
store.set('secret-abc', 500);
console.log(store.get());
console.log(JSON.stringify(store));
clock += 600;
console.log(store.get(), store.expiresInMs);
```

```output
token updated, expires in 500 ms
secret-abc
{"expiresAt":1500,"createdAt":1000}
undefined 0
```

Walk through it. The constructor uses a parameter property (`private readonly now`) to receive a clock function; injecting the clock makes the expiry logic testable without waiting real time. `#token` is native-private, so `JSON.stringify` cannot see it — the point of the requirement. `expiresAt` is TypeScript-private and *does* appear in the JSON; that is acceptable because it is not secret, but notice how easy it would have been to leak the token had it been declared `private token`. The `now` function is also an own property, but `JSON.stringify` skips function values. `expiresInMs` is a getter, so callers can read the expiry without being able to change it. `onChange` is protected: `LoggingTokenStore` overrides it, while outside code cannot call it.

## In real systems

- **Dependency injection.** Angular and NestJS services declare their collaborators as `constructor(private readonly http: HttpClient) {}`. `private` keeps the dependency out of the service's public API; `readonly` stops a method from swapping it. See [[b2-parameter-properties]].
- **SDK and library design.** Client libraries keep transport details (`private request()`, `private baseUrl`) hidden so the public surface stays small and can be versioned. Members marked `private` can be renamed in a minor release without breaking users; public and protected members cannot.
- **Frameworks with base classes.** Older React class components, Lit elements and many game engines expose `protected` lifecycle hooks for subclasses. The `protected` keyword documents which methods you are meant to override.
- **Security-sensitive state.** Tokens, keys and personal data held in objects that might be logged or serialised belong in `#private` fields, because `private` alone does not stop `JSON.stringify`.
- **Reactive state libraries.** Because `#private` fields fail through proxies, codebases using Vue 3 `reactive()` or MobX observables often prefer TypeScript `private` on classes that will be made reactive.

## Trade-offs and alternatives

Access modifiers cost nothing at runtime because they are erased, and they catch a large class of mistakes in the editor. Their limitation is that they protect only code the compiler sees. Native `#private` closes that gap at the cost of proxy incompatibility, no `protected` equivalent, and harder inspection in tests.

Classes are not the only encapsulation tool in JavaScript. A **closure** — a function that returns an object of methods sharing local variables — gives runtime privacy without classes at all (see [[b1-private-state]] and [[b1-classes-vs-factories]]). Module scope is another: a variable that a module does not export is private to that module (see [[b1-module-scope]]). Many TypeScript codebases use functions and modules for most logic and reserve classes for places where a framework expects them; in those codebases the access-modifier question rarely comes up. The design-level principle behind all of this is covered in [[d1-encapsulation]].

## Common mistakes

> [!MISTAKE] Assuming `private` hides data at runtime
> `private` is erased. The field appears in `JSON.stringify`, logs and dev tools, and `obj['field']` reaches it even in TypeScript. If the data must not leak, use a `#private` field or explicitly control serialisation with a `toJSON()` method.

**Making everything `protected` "for flexibility".** Every protected member is a promise to subclasses. Start with `private`, and widen to `protected` only when a real subclass needs the member.

**Reading a protected member through a base-class reference.** Inside `Savings`, `other.balance` fails when `other` is typed `Account` (TS2446). Either type the parameter as the subclass, or add a protected method on the base class that performs the operation.

**Mixing `private` and `#` for the same field, or putting a modifier on a `#` field.** `private #x` is a compile error. Pick one style per field.

**Treating `readonly` as deep immutability.** `readonly items: Item[]` still allows `items.push`. Use `readonly Item[]`, `Readonly<T>` or `Object.freeze` according to how much protection you need.

**Expecting a class with private members to accept a look-alike object.** A function that takes `Celsius` will reject an object literal `{ value: 0 }` and any other class with a private `value`. If you need structural flexibility at that boundary, accept an interface instead of the class.

## Interview perspective

**"What is the difference between `private` and `#private` in TypeScript?"** A strong answer names who enforces each (compiler versus engine), gives a concrete consequence (`JSON.stringify` shows `private` fields; bracket access escapes `private`), and gives a reason to choose either: `#` for real secrecy and brand checks, `private` for `protected` interplay, proxy compatibility and testability.

**"Why can't a subclass make a public method protected?"** Because of substitutability: code holding a base-class reference must be able to call every public member, whichever subclass it actually has. Widening visibility is safe; narrowing is not.

**"Is TypeScript structural or nominal?"** Structural — with the notable exception of classes that declare `private` or `protected` members, which are compatible only with types whose private members come from the same declaration. Interviewers like this follow-up because it shows you understand the type system rather than memorising rules.

**"Does `readonly` make an object immutable?"** No: it is shallow, compile-time only, and does not affect assignability, so a mutable alias can write through it. Mention `readonly T[]`, `Readonly<T>` and `Object.freeze` as the next layers.

## Practice

1. Write a `Temperature` class that stores Celsius in a private field, exposes a `fahrenheit` getter, and rejects values below absolute zero in its constructor. Try to break the invariant from outside the class using three different techniques and note which ones the compiler catches.
2. Convert the `pin` field of `Account` from `private` to `#pin`. Which lines in the file change, and what changes in the output of `JSON.stringify`?
3. Design a `Cache<V>` base class with a public `get`/`set`, a private `Map`, and a protected `evict()` hook. Write an `LruCache` subclass that overrides `evict()`. Which members did you need to make protected, and why?
4. Find a class in a codebase you know that has a `readonly` array property. Is any code mutating its contents? Should the type be `readonly T[]`?

```quiz
Q: Inside a method of class `Savings extends Account`, which access compiles if `balance` is `protected` in `Account`?
- [ ] `(other as Account).balance` where `other` is any account
- [x] `this.balance`
- [ ] `new Account().balance`
- [ ] All of them, because `Savings` is a subclass
> A subclass may reach protected members only through references of its own type (or its subclasses). `this` is a `Savings`, so it works; the other two go through an `Account` reference, which could be a sibling class, so TypeScript reports TS2446.
```

```quiz
Q: Why does `JSON.stringify(obj)` include a field declared `private secret` but not one declared `#secret`?
- [ ] `JSON.stringify` checks TypeScript modifiers at runtime
- [ ] `#secret` is stored on the prototype instead of the instance
- [x] `private` is erased during compilation, while `#secret` is a real engine-level private slot that is not an ordinary property
- [ ] Only because of the compile target; with ES2022 both are hidden
> TypeScript emits `private secret` as a normal own property, so every reflection API sees it. A `#` field lives in a separate internal slot that property enumeration never visits. The target does not change this: with older targets `#` fields become `WeakMap` entries, which are also invisible to `JSON.stringify`.
```

## Quick revision {#quick-revision}

- `public` (default): accessible everywhere. Interface members are always public, so a private member cannot implement one (TS2420).
- `private`: only inside the declaring class body; per class, not per object, so a method can read another instance's private field. Error TS2341.
- `protected`: declaring class plus subclasses; inside a subclass, only through references of the subclass's own type. Errors TS2445 and TS2446.
- Private or protected constructors restrict `new`; the basis of singletons and factory methods.
- Subclasses may widen visibility (protected to public) but never narrow it (TS2415).
- TypeScript modifiers are erased: private fields appear in `Object.keys`, `JSON.stringify`, dev tools; `obj['x']` and `as any` bypass the check.
- Private and protected members make classes compatible only with the same declaration (nominal-like behaviour).
- `#field`: engine-enforced, invisible to reflection, `#x in obj` brand check; no `#protected`; breaks through `Proxy`; cannot be combined with `private`.
- `readonly`: assignable only in the initialiser or constructor (TS2540 elsewhere); shallow; compile-time only; does not affect assignability; use `readonly T[]`, `Readonly<T>`, `Object.freeze` for more.

| Modifier | Same class | Subclass | Outside | Enforced at runtime |
|---|---|---|---|---|
| `public` | Yes | Yes | Yes | — |
| `protected` | Yes | Yes (own type) | No | No |
| `private` | Yes | No | No | No |
| `#field` | Yes | No | No | Yes |
| `readonly` | Write only during construction | Read | Read | No |

## Key takeaways {#key-takeaways}

- Access modifiers exist so that a class alone is responsible for its invariants; they turn misuse into compile errors.
- `private` and `protected` are checked by the compiler and erased from the output, so they protect against mistakes in typed code, not against runtime access or serialisation.
- Native `#private` fields are the tool when privacy must hold at runtime; TypeScript `private` is the tool when you need `protected`, proxy compatibility or test access.
- Treat `protected` members as a deliberate API for subclasses, not a default.
- `readonly` stops reassignment after construction but is shallow and can be bypassed through a mutable alias; layer read-only types or `Object.freeze` when contents must not change.
