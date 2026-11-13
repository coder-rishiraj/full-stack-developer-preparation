---
summary: An abstract class is a base class that cannot be instantiated on its own; it shares real code with its subclasses while forcing each one to supply the pieces it leaves abstract. You will learn how TypeScript checks abstract members, how subclasses override methods safely with `override` and `super`, what survives into the emitted JavaScript, and when an interface or plain functions are the better tool.
difficulty: intermediate
minutes: 50
objectives:
  - Declare abstract classes with abstract methods, properties and accessors alongside concrete shared code
  - Predict the compiler errors for instantiating an abstract class or leaving an abstract member unimplemented
  - Override methods correctly using `override`, `super` calls and compatible signatures, with `noImplicitOverride` enabled
  - Explain the constructor-time pitfall of calling abstract methods from a base constructor
  - Choose between an abstract class, an interface and composition for a given design
---

## Introduction

Suppose you are building a set of data exporters: one writes CSV, one writes JSON, one writes an Excel sheet. All three follow the same steps — validate the rows, format them, add a header, report how many rows were written. Only the *formatting* step differs.

You could copy the shared steps into every exporter, but then a fix to validation must be made three times. You could put the shared steps in a base class `Exporter` and let each format extend it, but then nothing stops someone from writing `new Exporter()` — an exporter that does not know how to format anything — and nothing forces a new subclass to actually provide a `format` method.

An **abstract class** solves both problems. It is a class marked with the `abstract` keyword, which means:

1. It **cannot be instantiated** directly. `new Exporter()` is a compile error.
2. It may declare **abstract members** — methods, properties or accessors that have a name and a type but no implementation. Every concrete (non-abstract) subclass **must** implement them.
3. It may also contain ordinary **concrete members** — fully implemented methods and fields that every subclass inherits.

So an abstract class is a partially built class: it contains the shared parts and declares the missing parts that each subclass must supply. It is a standard tool in object-oriented TypeScript — base repositories in back-end code, base components and controllers in frameworks, and any design using the template method pattern.

## Before you start

- **Classes and inheritance** — `extends`, `super()` and the prototype chain. See [[b2-classes-ts]], [[b2-class-inheritance]] and [[b1-prototype-chain]].
- **Access modifiers** — `public`, `protected` and `private`, because abstract members are usually `protected` or `public`. See [[b2-public-private-protected]].
- **Interfaces** — named object shapes, since much of this lesson compares the two. See [[b2-interfaces]].

Examples use TypeScript 5.x or 6.x with `strict` and `noImplicitOverride` enabled, targeting ES2022.

## The intuition

Think of a printed form with some fields pre-filled and others left blank and marked "required". The organisation that issues the form decides its layout and fills in the parts that are the same for everyone. You cannot submit the blank form as it is; you must fill in the required fields first. And the form is checked before it is accepted: leave a required field empty and it comes back.

An abstract class is the form. Its concrete methods are the pre-filled parts, its abstract members are the required blanks, a subclass is a filled-in copy, and the compiler is the clerk who rejects incomplete ones. The analogy stops at runtime: as you will see, the compiler is the *only* clerk, and the emitted JavaScript does not check anything.

## Declaring an abstract class

```typescript title="shape.ts"
abstract class Shape {
  abstract readonly name: string;          // abstract property
  abstract area(): number;                 // abstract method: signature only

  describe(): string {                     // concrete method shared by all shapes
    return `${this.name} with area ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  readonly name = 'circle';

  constructor(private readonly radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  readonly name = 'rectangle';

  constructor(private readonly w: number, private readonly h: number) {
    super();
  }

  area(): number {
    return this.w * this.h;
  }
}

const shapes: Shape[] = [new Circle(1), new Rectangle(2, 3)];
for (const s of shapes) console.log(s.describe());
```

```output
circle with area 3.14
rectangle with area 6.00
```

Read it piece by piece. `abstract area(): number;` ends with a semicolon instead of a body: it is a promise that every concrete shape will have an `area` method returning a number. `describe()` is concrete, and it *calls* `this.area()` even though `Shape` never implements it. That is legal because the compiler knows any object that actually exists at runtime is an instance of some concrete subclass, which must have implemented `area`. The array is typed `Shape[]`: code that uses shapes depends only on the abstract type, and each element runs its own `area` — this is **polymorphism**.

Abstract members can be methods, properties or accessors (`abstract get size(): number;`). They may be `public` or `protected`, but not `private` — a private member is invisible to subclasses, so no subclass could ever implement it (error TS1243, "'private' modifier cannot be used with 'abstract' modifier"). `static` members cannot be abstract either (also TS1243).

## What the compiler enforces

Three checks make abstract classes useful.

```typescript title="abstract-errors.ts"
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number { return 0; }
  // error TS1245: Method 'perimeter' cannot have an implementation because it is
  // marked abstract.
}

new Shape();
// error TS2511: Cannot create an instance of an abstract class.

class Square extends Shape {}
// error TS2654: Non-abstract class 'Square' is missing implementations for the
// following members of 'Shape': 'area', 'perimeter'.
```

An abstract member cannot have a body. An abstract class cannot be constructed. A concrete subclass that does not implement every abstract member is rejected, and the message lists exactly what is missing — useful when a base class gains a new abstract method and every subclass must be updated.

A subclass may itself be abstract. It can implement some abstract members, leave others abstract, and add new ones; only the final concrete class must fill in everything:

```typescript title="layers.ts"
abstract class Shape {
  abstract area(): number;
}

abstract class Polygon extends Shape {
  abstract sides(): number;                 // adds a new requirement
  describe(): string { return `${this.sides()}-sided, area ${this.area()}`; }
}

class Triangle extends Polygon {
  constructor(private readonly base: number, private readonly height: number) {
    super();
  }
  area(): number { return (this.base * this.height) / 2; }
  sides(): number { return 3; }
}

console.log(new Triangle(4, 3).describe());
```

```output
3-sided, area 6
```

### Abstract classes as values: constructor types

A class name is also a value — its constructor function. For an abstract class, that value has a special **abstract construct signature**, so code cannot `new` it through a variable either:

```typescript title="ctor-types.ts"
abstract class Shape {
  abstract area(): number;
}
class Unit extends Shape {
  area(): number { return 1; }
}

function build(ctor: new () => Shape): Shape {
  return new ctor();
}

build(Unit);       // fine
build(Shape);
// error TS2345: Argument of type 'typeof Shape' is not assignable to parameter
// of type 'new () => Shape'.

// A parameter that accepts abstract classes too, for code that only inspects them:
type AnyShapeClass = abstract new (...args: any[]) => Shape;
const registry: AnyShapeClass[] = [Shape, Unit];   // fine
console.log(registry.map((c) => c.name));
```

```output
[ 'Shape', 'Unit' ]
```

The `abstract new (...)` type (TypeScript 4.2 and later) is mostly used by mixin helpers and dependency-injection containers that need to refer to class constructors without instantiating them. See [[b2-mixins]].

## How it works internally: abstract is erased

The `abstract` keyword exists only for the type checker. Here is what `tsc` emits for a small abstract class:

```typescript title="erased.ts"
abstract class S {
  abstract readonly name: string;
  abstract get size(): number;
  hello(): number { return 1; }
}
```

```javascript title="erased.js (emitted)"
class S {
    hello() { return 1; }
}
```

The `abstract` modifier, the abstract property and the abstract accessor are gone. The class is an ordinary JavaScript class, and plain JavaScript (or TypeScript code that casts to `any`) can call `new S()` freely. If runtime protection matters — for example in a library consumed from JavaScript — add a guard using `new.target`, which refers to the constructor `new` was actually called on:

```typescript title="guard.ts"
abstract class Guarded {
  constructor() {
    if (new.target === Guarded) throw new TypeError('Guarded is abstract');
  }
}

class Ok extends Guarded {}

console.log(new Ok() instanceof Guarded);
try {
  new (Guarded as any)();
} catch (e) {
  console.log((e as Error).message);
}
```

```output
true
Guarded is abstract
```

What *does* survive is the inheritance itself: `extends` builds a real prototype chain, so concrete methods of the abstract class are shared through it and `instanceof Shape` works at runtime. That is a key difference from an interface, which leaves nothing behind at all (see [[b2-implements-vs-extends]]).

## The constructor-time pitfall

A base-class constructor runs **before** the subclass's field initialisers. If the base constructor calls an abstract method, the subclass's implementation runs on a half-built object:

```typescript title="widget.ts"
abstract class Widget {
  constructor() {
    console.log('rendering:', this.render());   // calls the subclass too early
  }
  abstract render(): string;
}

class Label extends Widget {
  text = 'Hello';
  render(): string {
    return `<span>${this.text}</span>`;
  }
}

const label = new Label();
console.log('after construction:', label.render());
```

```output
rendering: <span>undefined</span>
after construction: <span>Hello</span>
```

The order is: `new Label()` calls `Label`'s implicit constructor, which calls `super()`; `Widget`'s constructor runs and calls `this.render()`; JavaScript dispatches to `Label.prototype.render`; but `text = 'Hello'` has not run yet, because subclass fields are initialised only after `super()` returns. TypeScript does not warn about this. The fix is to keep base constructors to plain setup and to call overridable methods later — from a separate `init()` or `mount()` step, or lazily on first use.

## Method Overriding {#b2-method-overriding}

**Method overriding** means a subclass provides its own implementation of a method that its base class already has, so that calls on subclass instances run the subclass's version. It is how inheritance lets related classes share a common interface while behaving differently. In JavaScript, overriding falls out of the prototype chain: when you call `obj.log()`, the engine looks for `log` on the object's own prototype first (the subclass's), and only if it is missing does it continue to the base class's prototype. Whichever it finds first runs.

TypeScript adds two layers of safety on top of that runtime mechanism: it checks that the overriding method's type is compatible with the base method, and, with the `override` keyword, it checks that you are actually overriding something.

### Overriding and calling `super`

```typescript title="logger.ts"
class Logger {
  log(msg: string): void {
    console.log(msg);
  }
}

class TimestampLogger extends Logger {
  override log(msg: string): void {
    super.log(`[2026-01-01] ${msg}`);       // reuse the base behaviour
  }
}

const loggers: Logger[] = [new Logger(), new TimestampLogger()];
for (const l of loggers) l.log('ready');
```

```output
ready
[2026-01-01] ready
```

`super.log(...)` calls the base class's implementation with the same `this`. It is how an override *extends* behaviour rather than replacing it. The loop shows dynamic dispatch: both elements are typed `Logger`, yet each runs its own class's `log`. (The timestamp is a fixed string so the output is reproducible; real code would use `new Date().toISOString()`.)

### The `override` keyword and `noImplicitOverride`

Without help, overriding has a silent failure mode. Misspell the method name, or let someone rename the base method later, and the subclass method becomes an unrelated new method: the base version runs instead and nothing reports a problem.

TypeScript 4.3 added the **`override`** modifier to prevent this. Marking a method `override` asserts "this replaces a base-class member", and the compiler reports an error if no such member exists. The **`noImplicitOverride`** compiler option makes the assertion compulsory: every member that overrides a base member must say `override`. Together they catch mistakes in both directions:

```typescript title="override-checks.ts"
class Logger {
  log(msg: string): void { console.log(msg); }
  flush(): void {}
}

class BufferedLogger extends Logger {
  flush(): void {}
  // error TS4114: This member must have an 'override' modifier because it overrides
  // a member in the base class 'Logger'.

  override flsh(): void {}
  // error TS4117: This member cannot have an 'override' modifier because it is not
  // declared in the base class 'Logger'. Did you mean 'flush'?
}
```

The first error stops *accidental* overrides (you added a helper that happens to share a base method's name). The second stops *failed* overrides (a typo, or a base method that was renamed). Enable `noImplicitOverride` in every project that uses inheritance; `strict` does not include it. Implementing an **abstract** member does not need `override`, because there is no existing implementation being replaced, although writing it is allowed. `override` also works on properties, accessors and parameter properties (see [[b2-parameter-properties]]).

### What counts as a compatible override

An override must be **assignable to** the base member's type, because code holding a base-class reference will call it with base-class expectations. The rules follow from that:

```typescript title="compat.ts"
class Handler {
  handle(e: string | number): string | number { return e; }
}

class Narrower extends Handler {
  override handle(e: string | number): string { return String(e); }  // narrower return: fine
}

class FewerParams extends Handler {
  override handle(): string { return 'ignores input'; }             // fewer params: fine
}

class WrongReturn extends Handler {
  override handle(e: unknown): boolean { return true; }
  // error TS2416: Property 'handle' in type 'WrongReturn' is not assignable to the
  // same property in base type 'Handler'.
}
```

- **Return types may be narrower** (covariant). A caller expecting `string | number` is happy to get a `string`.
- **Parameter types may be wider.** A method that accepts `unknown` can certainly handle `string | number`.
- **Fewer parameters are fine.** JavaScript ignores extra arguments, so a method that ignores its input is still callable the same way.
- **A wider return type is an error**, because a caller expecting `string | number` could receive a `boolean`.

There is one deliberate hole. Parameters of *methods* are checked **bivariantly**: TypeScript also accepts an override whose parameter type is *narrower*, even under `strictFunctionTypes`. This keeps common patterns (such as event handlers on DOM class hierarchies) compiling, but it is unsound:

```typescript title="bivariance.ts"
class Animal {
  feed(food: string | number): void { console.log('ok', food); }
}

class Fussy extends Animal {
  override feed(food: string): void {         // narrower parameter: accepted
    console.log(food.toUpperCase());
  }
}

const pet: Animal = new Fussy();
try {
  pet.feed(42);                               // type-checks: Animal.feed accepts numbers
} catch (e) {
  console.log((e as Error).message);
}
```

```output
food.toUpperCase is not a function
```

When reviewing an override, check parameter types yourself: never narrow them. See [[b2-function-variance]] for the full story.

### Methods versus arrow-function properties

An arrow function assigned to a class field is not a method. It is an own property created on each instance during construction, while methods live on the prototype. Mixing the two across a hierarchy goes wrong:

```typescript title="arrow-vs-method.ts"
class C {
  handle = () => 'C arrow';                   // own property on every instance
}

class D extends C {
  override handle() { return 'D method'; }
  // error TS2425: Class 'C' defines instance member property 'handle', but
  // extended class 'D' defines it as instance member function.
}

console.log(new D().handle());
```

```output
C arrow
```

Even if you ignore the error, the method never runs: `D.prototype.handle` exists, but the instance's own `handle` property, created by `C`'s field initialiser, is found first. Arrow-function properties also cannot be reached through `super` (error TS2855), so an overriding subclass cannot call the base version. If a method is meant to be overridden, declare it as a method; bind it where you pass it as a callback instead (see [[b1-this-lost]]).

### Overriding responsibly

Overriding is powerful and easy to overuse. Each override couples the subclass to the base class's internal call pattern: if the base class's `save()` calls `validate()`, and a subclass overrides `validate()`, a later refactor of `save()` that stops calling it silently changes the subclass's behaviour. This is called the **fragile base class** problem. Deep chains of overrides, each calling `super`, make the flow hard to follow. Two habits keep overriding manageable: design explicit hooks (abstract or `protected` methods) that subclasses are *meant* to override, rather than overriding arbitrary public methods; and prefer composition when a "subclass" only wants to change one behaviour (see [[d1-composition-vs-inheritance]]).

```quiz
Q: With `noImplicitOverride` enabled, a subclass declares `override sav(): void` while the base class has `save()`. What happens?
- [ ] It compiles and replaces `save`
- [ ] It compiles and adds a new method `sav`
- [x] Compile error: `sav` is marked `override` but the base class has no such member
- [ ] Runtime error when `sav` is called
> `override` asserts that the base class declares the member. `sav` does not exist there, so TypeScript reports TS4117 and suggests `save`. Without the keyword, the typo would have compiled as a brand-new method and `save` would never be overridden.
```

## Worked example: a template-method exporter

The introduction's exporters, written properly. The base class owns the algorithm; subclasses supply a single abstract hook and may optionally override another.

```typescript title="exporter.ts"
type Row = Record<string, string | number>;

abstract class Exporter {
  // The fixed algorithm. Subclasses do not override this.
  export(rows: Row[]): string {
    const valid = rows.filter((r) => Object.keys(r).length > 0);
    const body = this.format(valid);
    return `${this.header()}${body}\n# ${valid.length} rows`;
  }

  protected header(): string {             // optional hook with a default
    return '';
  }

  protected abstract format(rows: Row[]): string;   // required hook
}

class CsvExporter extends Exporter {
  protected override header(): string {
    return '# csv\n';
  }

  protected format(rows: Row[]): string {
    if (rows.length === 0) return '';
    const cols = Object.keys(rows[0]);
    const lines = rows.map((r) => cols.map((c) => r[c]).join(','));
    return [cols.join(','), ...lines].join('\n');
  }
}

class JsonExporter extends Exporter {
  protected format(rows: Row[]): string {
    return JSON.stringify(rows);
  }
}

const data: Row[] = [{ id: 1, name: 'Ada' }, {}, { id: 2, name: 'Linus' }];
for (const exporter of [new CsvExporter(), new JsonExporter()]) {
  console.log(exporter.export(data));
  console.log('---');
}
```

```output
# csv
id,name
1,Ada
2,Linus
# 2 rows
---
[{"id":1,"name":"Ada"},{"id":2,"name":"Linus"}]
# 2 rows
---
```

Walk through it. `export` is public and concrete: it filters out empty rows, delegates formatting, and appends a footer. Every exporter inherits that logic unchanged, so the empty-row rule is written once. `format` is `protected abstract`: subclasses must implement it, and outside code cannot call it directly. `header` is a `protected` concrete method with an empty default; `CsvExporter` overrides it (with `override`, because a base implementation exists), while `JsonExporter` keeps the default. `CsvExporter.format` does *not* need `override`, because it implements an abstract member. Adding an XML exporter means writing one class with one required method; forgetting that method is a compile error. This is the **template method** pattern; see [[d2-template-method]].

## In real systems

- **Repositories and data access.** A `BaseRepository<T>` implements shared `findById`, `save` and pagination logic and declares `abstract tableName` or `abstract toEntity(row)` for each entity type. See [[b2-generic-classes]].
- **Framework base classes.** Angular's older guidance and many back-end frameworks use abstract base controllers, guards or strategies. NestJS's Passport strategies and TypeORM's abstract base entities follow the pattern.
- **Abstract classes as injection tokens.** Angular can use an abstract class as a dependency-injection token: components depend on `abstract class Storage`, and the module provides `LocalStorageService` for it. Unlike an interface, the abstract class exists at runtime, so it can serve as the lookup key.
- **UI toolkits.** Lit's `LitElement` and older React class components are concrete base classes whose overridable lifecycle methods behave like the hooks in this lesson.

## Trade-offs and alternatives

**Abstract class versus interface.** An interface describes a shape and nothing else; it disappears at compile time, and a class may implement many. An abstract class can carry shared code and state, exists at runtime (so `instanceof` works), but a class may extend only one. A useful rule: if the base would contain *only* abstract members, use an interface — an abstract class adds the single-inheritance restriction without giving anything back. Use an abstract class when there is real shared implementation. You can combine them: define the contract as an interface and provide an abstract class that partially implements it for convenience. See [[b2-implements-vs-extends]].

**Abstract class versus composition.** Template-method inheritance fixes the algorithm in the base class and varies steps via subclasses. The same variation can be achieved by passing the varying step in as an object or function — the **strategy** pattern (see [[d2-strategy]]). `new Exporter(csvFormat)` instead of `new CsvExporter()` avoids a class hierarchy, allows changing the step at runtime, and is easier to test. Many TypeScript codebases prefer that style and use abstract classes mainly where a framework expects them.

**Costs.** Inheritance couples subclasses to the base class's internals (the fragile base class problem), and hierarchies deeper than two or three levels are hard to navigate. Abstract checks are compile-time only.

## Common mistakes

> [!MISTAKE] An abstract class with no concrete members
> If every member is abstract, nothing is being shared. Use an interface: classes can then implement several of them and also extend a different base class.

> [!WARNING] Calling abstract or overridable methods from the base constructor
> Subclass fields are not initialised yet when the base constructor runs, so the subclass implementation sees `undefined`. Move the call out of the constructor.

**Assuming `abstract` protects at runtime.** It is erased. JavaScript callers can instantiate the class. Use a `new.target` guard if that matters.

**Forgetting `override` and `noImplicitOverride`.** Without them, renaming a base method silently disconnects every subclass override. Turn the option on.

**Narrowing a parameter type in an override.** Method bivariance lets it compile, but callers using the base type can pass values the override cannot handle.

**Overriding a method with an arrow-function property (or the reverse).** Instance properties shadow prototype methods, and TypeScript reports TS2425 in the property-then-method case. Keep overridable members as methods.

## Interview perspective

**"Abstract class or interface?"** Explain the difference in runtime presence (abstract classes exist; interfaces do not), shared implementation, and inheritance limits (one base class, many interfaces). Then give a rule: interface for contracts, abstract class when there is real shared code. Mentioning the Angular DI-token use shows practical experience.

**"Can an abstract class have a constructor?"** Yes. It runs when a subclass calls `super()`, and it is the natural place for shared initialisation. It can be `protected` to make the intent explicit. Follow up with the constructor-time pitfall.

**"What does `override` give you that JavaScript does not?"** JavaScript overrides by name with no checks. `override` plus `noImplicitOverride` catches both accidental overrides and failed ones (typos, renamed base methods) at compile time.

**"Is TypeScript's override checking sound?"** No: method parameters are bivariant, so a narrower parameter type compiles and can crash at runtime. Interviewers who ask this are checking whether you know where the type system's guarantees end.

## Practice

1. Write an abstract `Notification` class with a concrete `send()` that formats a message and an abstract `deliver(text: string): Promise<void>`. Implement `EmailNotification` and `SmsNotification`.
2. Rewrite your answer to exercise 1 using a strategy object instead of inheritance. Which version is easier to unit-test?
3. Take a base class and rename one of its methods. With `noImplicitOverride` off and then on, record what the compiler reports in the subclasses.
4. Write a base constructor that calls an overridable method, observe the `undefined`, and fix the design without removing the hook.

```quiz
Q: Which statement about an abstract class in TypeScript is true?
- [ ] It cannot contain any implemented methods
- [ ] It cannot have a constructor
- [x] It can mix abstract and concrete members, but cannot be instantiated with `new` in type-checked code
- [ ] It is enforced at runtime, so JavaScript code cannot instantiate it either
> Abstract classes combine shared concrete code with abstract requirements, and they can have constructors that subclasses call through `super()`. The ban on `new` is a compile-time check only: `abstract` is erased, so the emitted class can be constructed from JavaScript.
```

## Quick revision {#quick-revision}

- `abstract class` cannot be instantiated (TS2511); may hold abstract members (no body, TS1245 if given one) and concrete shared members.
- Concrete subclasses must implement every abstract member (TS2654 lists the missing ones); an abstract subclass may defer them.
- Abstract members may be methods, properties or accessors; `public` or `protected`, never `private` or `static` (TS1243).
- `abstract` is erased; the prototype chain and concrete methods remain, so `instanceof` works. Guard with `new.target` for runtime protection.
- Constructor types: `typeof Abstract` is not assignable to `new () => T`; use `abstract new (...args: any[]) => T` to accept abstract classes.
- Base constructors run before subclass field initialisers; do not call overridable methods from them.
- Overriding: subclass method on the prototype wins; `super.method()` reuses the base. `override` + `noImplicitOverride` give TS4114 (missing keyword) and TS4113/TS4117 (nothing to override). Implementing an abstract member does not need `override`.
- Compatible overrides: narrower return, wider params, fewer params. Narrower params compile (method bivariance) but are unsafe.
- Do not mix methods and arrow-function properties for the same name across a hierarchy (TS2425, TS2855).

## Key takeaways {#key-takeaways}

- An abstract class shares real implementation with its subclasses and forces them to supply the parts it leaves abstract.
- All abstract checks happen at compile time; at runtime it is an ordinary class with a real prototype chain.
- Override with the `override` keyword and `noImplicitOverride` so that typos and renames become compile errors.
- Overrides may narrow return types and widen parameter types; never narrow parameters even though the compiler allows it for methods.
- Keep base constructors free of calls to overridable methods.
- Use an interface when nothing is shared, and consider composition before building a deep hierarchy.
