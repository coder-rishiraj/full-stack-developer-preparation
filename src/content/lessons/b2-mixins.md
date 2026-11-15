---
summary: A mixin is a function that takes a class and returns a subclass with extra behaviour, so features like timestamps or activation can be added to unrelated classes without a deep inheritance tree. You will learn how the pattern works at runtime, how TypeScript types it, and when plain composition is the better tool.
difficulty: advanced
minutes: 40
objectives:
  - Explain how a class mixin builds on JavaScript class expressions and the prototype chain
  - Write a correctly typed mixin factory using a generic constructor constraint
  - Constrain a mixin to bases that have certain members, and derive the instance type of a mixed class
  - Trace the order in which composed mixins run their constructors and override methods
  - Choose between mixins, the applyMixins pattern and plain composition, and explain the limits of each
---

## Introduction

Imagine an admin dashboard with three model classes: `User`, `Invoice` and `Project`. They have nothing in common as domain objects, yet all three need the same few features: a `createdAt` timestamp, an `activate()` / `deactivate()` switch, and a `toJSON()` that hides internal fields. How do you share that code?

Copy-pasting it into each class works until the first bug fix, which you then have to make three times. Inheritance is the next idea — put the features in a `BaseModel` and extend it — but a class can have only **one** parent. If `Invoice` already extends `Document` from another library, it cannot also extend `BaseModel`. And if you keep stuffing features into one base class, every subclass pays for every feature whether it wants it or not; projects that need activation but not timestamps cannot opt out.

A **mixin** solves this by turning a feature into a *function that produces a subclass*. You give it any class, and it returns a new class that extends yours and adds the feature:

```typescript title="shape.ts"
const ActiveUser = Activatable(User);       // User + activate()
const TrackedInvoice = Timestamped(Invoice); // Invoice + createdAt
```

Because the function can be applied to any class, and its result can be passed to another mixin, you can assemble exactly the combination each class needs: `Timestamped(Activatable(User))`. This is the closest JavaScript gets to multiple inheritance, and TypeScript can type it precisely, so the editor knows that the result has both `User`'s members and the added ones.

You meet mixins in component libraries (Lit documents class mixins as a way to share behaviour between web components), in older Angular Material code, and in interview questions about "how would you share behaviour across unrelated classes". Understanding them also sharpens your understanding of classes in general, because a mixin is nothing more than classes, functions and the prototype chain used together.

## Before you start

- **Class inheritance and `super`** — how `extends` creates a parent–child relationship and how `super(...)` calls the parent constructor. See [[b1-class-inheritance]].
- **The prototype chain** — how a method lookup walks from an object to its prototype and onward. See [[b1-prototype-chain]].
- **Classes in TypeScript** — field declarations, parameter properties and access modifiers. See [[b2-classes-ts]] and [[b2-parameter-properties]].
- **Generics and constraints** — `<T extends Something>` and why a type parameter preserves the caller's exact type. See [[b2-generics]] and [[b2-generic-constraints]].
- **`InstanceType` and other utility types** — introduced in [[b2-utility-types]]; this lesson explains the one use it needs.

## The intuition

Think of the prototype chain as a stack of transparent sheets. The bottom sheet is your base class, `User`, with `name` written on it. A mixin slips one new sheet on top with `activate()` written on it. Another mixin adds a sheet with `createdAt`. When you look down through the stack from the top — which is what JavaScript does when it looks up a property — you see everything written on every sheet. If two sheets write the same method name, you see the one nearer the top.

That picture captures the three facts you need. First, a mixin **adds a layer**; it never edits the class you passed in, so `User` itself is unchanged. Second, **order matters**: the last mixin applied sits on top and wins name clashes. Third, each layer can reach the one below it with `super`, just like ordinary inheritance — because it *is* ordinary inheritance, only with the parent chosen at call time instead of written in the source.

The analogy stops working in one place: sheets are reusable objects, but each mixin call manufactures a brand-new class. Applying `Activatable` to `User` twice gives you two different classes, a detail that matters for `instanceof` later in this lesson.

## The JavaScript foundation: classes are values

Two features of JavaScript make mixins possible. A **class expression** creates a class as a value, just as a function expression creates a function, so a function can `return class { ... }`. And the thing after `extends` can be **any expression** that evaluates to a constructor, including a function parameter. Put those together and you get a function whose parent class is decided by the caller:

```javascript title="activatable.js"
function Activatable(Base) {
  return class extends Base {
    isActive = false;
    activate() {
      this.isActive = true;
      return this;
    }
  };
}

class User {
  constructor(name) {
    this.name = name;
  }
}

const ActiveUser = Activatable(User);
const ada = new ActiveUser("Ada");
console.log(ada.activate().isActive, ada.name, ada instanceof User);
```

```output
true Ada true
```

When `Activatable(User)` runs, JavaScript evaluates `extends Base` with `Base` bound to `User`, so the returned class has `User.prototype` as the prototype of its own prototype. `new ActiveUser("Ada")` therefore runs `User`'s constructor (via the implicit constructor, which forwards all arguments to `super`), then initialises the `isActive` field. The object answers `true` to `instanceof User` because `User.prototype` is on its chain.

Nothing here is TypeScript-specific. TypeScript's job is to describe the input and output of `Activatable` so the compiler knows `ada` has `name`, `isActive` and `activate`.

## Typing a mixin

To type a mixin you need a way to say "any class". In TypeScript, a class is a value with a **construct signature** — something callable with `new`. You write that as a constructor type:

```typescript title="constructor.ts"
type Constructor<T = {}> = new (...args: any[]) => T;
```

Read it as: "something you can `new` with any arguments, producing a `T`". The default `T = {}` means "producing some object, we do not care which". The `Constructor<{ name: string }>` form, which you will use soon, means "producing an object that has at least a `name: string`".

Now the typed mixin. The essential move is to make the base class a **generic type parameter** constrained by `Constructor`:

```typescript title="timestamped.ts"
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date(0); // fixed date so the output is stable
  };
}

class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const ada = new TimestampedUser("Ada");
console.log(ada.name, ada.createdAt.toISOString());
```

```output
Ada 1970-01-01T00:00:00.000Z
```

Why the generic? Because `TBase` captures the *exact* class the caller passed — here `typeof User`, with its `(name: string)` constructor and its `name` property. If you instead wrote `function Timestamped(Base: Constructor)`, the compiler would forget everything about `User` the moment it was passed in, and the result would only know about `createdAt`:

```typescript title="naive.ts"
function NaiveTimestamped(Base: Constructor) {
  return class extends Base { createdAt = new Date(); };
}
const NaiveUser = NaiveTimestamped(User);
new NaiveUser("Ada").name;
// error TS2339: Property 'name' does not exist on type '(Anonymous class)'.
```

This is the same reason any generic function uses a type parameter instead of a wide parameter type: a type parameter flows the caller's type through to the result.

### The `any[]` rule

You may be tempted to write `new (...args: unknown[]) => {}`, since `unknown` is usually the safer choice. For mixins the compiler refuses:

```text
error TS2545: A mixin class must have a constructor with a single rest parameter of type 'any[]'.
```

The rule exists because the mixin class does not know what arguments the eventual base constructor needs. A single `...args: any[]` rest parameter is the signal TypeScript looks for to treat the class as a **mixin constructor**: it lets the mixin pass arguments straight through to `super` without checking them, and the real checking happens against the base class's own constructor (see the next section). A specific signature such as `new (name: string) => {}` triggers the same error, because then the mixin could only be applied to classes with that exact constructor.

### What type does the mixin return?

If you emit a declaration file for `Timestamped`, the compiler writes out the inferred return type:

```typescript title="timestamped.d.ts"
export declare function Timestamped<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        createdAt: Date;
    };
} & TBase;
```

The result is an **intersection** of two constructor types: an anonymous constructor that produces `{ createdAt: Date }`, and `TBase` itself. TypeScript treats this combination specially. When you call `new` on it, the construct signatures come from `TBase` — so the arguments are checked against `User`'s constructor — and the instance type is the intersection `{ createdAt: Date } & User`. That is why the mixed class keeps the base constructor's parameter checking:

```typescript title="checked.ts"
new TimestampedUser();
// error TS2554: Expected 1 arguments, but got 0.
```

The `& TBase` part also carries **static members** across. If `User` has `static kind = "user"`, then `TimestampedUser.kind` is typed and works at runtime, because a class's static side is inherited through `extends` as well.

## Getting the instance type

A class declaration creates two things with the same name: a value (the constructor) and a type (the instance). A mixin result is only a value — `const TimestampedUser = ...` declares no type. To annotate a variable or parameter with "an instance of the mixed class", use the built-in `InstanceType` utility, which reads the return type of a construct signature:

```typescript title="instance-type.ts"
const TimestampedUser = Timestamped(User);
type TimestampedUser = InstanceType<typeof TimestampedUser>;

function age(entity: TimestampedUser): number {
  return Date.now() - entity.createdAt.getTime();
}
```

Declaring the type alias with the same name as the constant mirrors what a `class` declaration gives you for free, and TypeScript allows it because values and types live in separate namespaces. If you need the instance type of the mixin in general — independent of any base — `InstanceType<ReturnType<typeof Timestamped>>` gives `{ createdAt: Date }` (since the unconstrained `TBase` instance is just `{}`). That form is useful for a parameter that only cares about the timestamp feature.

## Constrained mixins

Some features need something from the base class. A `Tagged` mixin that builds a hashtag from the entity's name only makes sense if the base has a `name`. Constrain the base with `Constructor<{ name: string }>` and the mixin body is allowed to use `this.name`:

```typescript title="tagged.ts"
function Tagged<TBase extends Constructor<{ name: string }>>(Base: TBase) {
  return class extends Base {
    tag() {
      return `#${this.name.toLowerCase()}`;
    }
  };
}

class Product {
  constructor(public price: number) {}
}

Tagged(User);    // fine: User instances have name: string
Tagged(Product);
// error TS2345: Argument of type 'typeof Product' is not assignable to parameter
//   of type 'Constructor<{ name: string; }>'.
//   ...Property 'name' is missing in type 'Product' but required in type '{ name: string; }'.
```

The constraint plays the role of a contract in both directions. Inside the mixin, the compiler knows `this.name` is a string. Outside, it refuses to apply the mixin to a class that cannot meet the contract, with an error pointing at the missing member. This is the main advantage of typed mixins over the untyped JavaScript version, where `Tagged(Product)` would fail only at runtime with `Cannot read properties of undefined (reading 'toLowerCase')`.

## Composing mixins

Mixins compose by nesting calls. The innermost call is applied first and sits lowest in the prototype chain:

```typescript title="compose.ts"
type Constructor<T = {}> = new (...args: any[]) => T;

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    activate() { this.isActive = true; return this; }
    describe() { return "activatable"; }
  };
}
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date(0);
  };
}
function Tagged<TBase extends Constructor<{ name: string }>>(Base: TBase) {
  return class extends Base {
    tag() { return `#${this.name.toLowerCase()}`; }
    describe() { return "tagged"; }
  };
}

class User {
  constructor(public name: string) {}
  static kind = "user";
}

const SmartUser = Tagged(Timestamped(Activatable(User)));
type SmartUser = InstanceType<typeof SmartUser>;

const u: SmartUser = new SmartUser("Ada");
console.log(u.activate().isActive, u.tag(), u.createdAt.getTime(), SmartUser.kind);
console.log(u.describe());
console.log(u instanceof User);

const chain: string[] = [];
let proto = Object.getPrototypeOf(u);
while (proto !== Object.prototype) {
  chain.push(proto.constructor.name || "(anonymous)");
  proto = Object.getPrototypeOf(proto);
}
console.log(chain.join(" -> "));
```

```output
true #ada 0 user
tagged
true
(anonymous) -> (anonymous) -> (anonymous) -> User
```

Walk through what happened. `Activatable(User)` built a class whose parent is `User`. `Timestamped(...)` built a class whose parent is that one, and `Tagged(...)` built a third on top. The prototype walk at the end shows four layers: three anonymous classes (a class expression returned directly from a function gets the empty string as its `name`) and `User` at the bottom.

Both `Activatable` and `Tagged` define `describe()`. `Tagged` was applied last, so its layer is on top and its method is found first — `u.describe()` prints `tagged`. Swap the nesting to `Activatable(Timestamped(Tagged(User)))` and the answer becomes `activatable`.

Be aware of one gap in the type checking here. When you write a subclass by hand, TypeScript checks every override against the parent's method. A mixin's body is checked against its *constraint*, not against the class it is eventually applied to — when `Tagged` is written, the compiler has no idea a `describe()` will exist underneath. So if one mixin's `describe()` returned a `number` and another's a `string`, nesting them would still compile. The instance type would contain both signatures as an intersection, and calls resolve to the outer mixin's signature, which matches what runs. Clashing names are therefore not an error, only a design smell worth avoiding.

Note also that `Tagged` was applied to `Timestamped(Activatable(User))`, not to `User` directly, and its `{ name: string }` constraint was still satisfied. The `& TBase` in each mixin's return type carries `User`'s instance members through every layer.

```mermaid title="Prototype chain built by Tagged(Timestamped(Activatable(User)))"
flowchart TB
  I["instance u: name, isActive, createdAt"] --> T["Tagged layer: tag(), describe()"]
  T --> S["Timestamped layer: (fields only)"]
  S --> A["Activatable layer: activate(), describe()"]
  A --> U["User.prototype"]
  U --> O["Object.prototype"]
```

Notice where the data lives. Fields such as `isActive` and `createdAt` are **instance fields**, so they are created on the object itself during construction, not on the layer's prototype. Methods live on each layer's prototype. That is why the diagram shows the Timestamped layer with no methods: its only contribution is a field initialiser that runs in its constructor.

## Mixins with their own constructors

A mixin can run setup code in a constructor, but it must accept and forward whatever the base needs. Because the mixin does not know the base's parameters, its constructor uses the same `...args: any[]` shape and passes everything to `super`:

```typescript title="counted.ts"
type Ctor<T = {}> = new (...args: any[]) => T;

interface Counter {
  count: number;
  increment(): number;
}

function Counted<T extends Ctor>(Base: T): T & Ctor<Counter> {
  return class extends Base {
    count = 0;
    constructor(...args: any[]) {
      super(...args);
      console.log("Counted constructor ran");
    }
    increment() { return ++this.count; }
  };
}

class Box {
  constructor(public label: string) { console.log("Box constructor ran"); }
}

const CountedBox = Counted(Box);
const b = new CountedBox("a");
console.log(b.label, b.increment(), b.increment());
console.log(Counted(Box) === Counted(Box));
```

```output
Box constructor ran
Counted constructor ran
a 1 2
false
```

Constructors run bottom-up: `super(...args)` must finish — running `Box`'s constructor — before the mixin's own code and field initialisers run. That ordering is ordinary class semantics, but it has a consequence for mixins: a mixin's constructor cannot cleanly add *new required parameters*, because it has no idea which positions the base's parameters occupy. Mixins that need configuration usually take it as an extra argument to the mixin function (`Retrying(Base, { attempts: 3 })`) or expose a setter, rather than changing the constructor.

This example also shows an **explicit return type**: `T & Ctor<Counter>`. Writing the return type out, with the added members described by an interface, keeps hover text short, documents the mixin's contract in one place, and stops inference from producing an enormous anonymous type when many mixins are stacked. It is the standard fix when a deep mixin chain starts producing unreadable or slow-to-check types.

The last line answers a question that trips people up: `Counted(Box) === Counted(Box)` is `false`. Every call evaluates the class expression again and creates a new class. Apply mixins once, at module level, and reuse the result; calling a mixin inside a render function or a loop creates a fresh class each time.

## How it works internally

At runtime a mixin is three ordinary operations: a function call, a class expression, and `extends`, which sets two prototype links — the new class's `prototype` object points to `Base.prototype`, and the new constructor function itself points to `Base` (which is how static members are inherited). There is no mixin-specific machinery in JavaScript, and TypeScript emits the mixin almost unchanged; only type annotations are erased.

At the type level, TypeScript (since version 2.2, when mixin classes were introduced) recognises a class that extends a value whose type is a type parameter constrained to a constructor type with a single `any[]` rest parameter. For such a class it does two things. It infers the result as `{ new (...args: any[]): Added } & TBase`, and when it later resolves `new` on that intersection it takes the construct signatures from `TBase` and intersects their return types with `Added`. That special rule is why the base constructor's parameters are still enforced and why the instance type is `Added & BaseInstance`.

Because every mixin result is an intersection containing the previous result, stacking `n` mixins produces a type nested `n` levels deep. The compiler handles a handful easily; long chains with large classes make editor hovers slow and type checking expensive, which is the practical reason to annotate return types.

## Limits of class mixins

Mixins are just classes, but a few class features interact badly with them.

**`private` and `protected` members in exported mixins.** If the mixin function is exported and declaration files are being generated (`"declaration": true`, which every published library uses), the compiler has to write the anonymous class's type into a `.d.ts` file. An anonymous object type cannot express TypeScript's `private` or `protected`, so you get:

```text
error TS4094: Property 'secret' of exported anonymous class type may not be private or protected.
```

The fix is to use JavaScript's own private fields (`#secret`), which are enforced at runtime and do not need to appear in the declaration, or to describe the public contract with an interface and an explicit return type as in `Counted`.

**`instanceof` against the mixin.** There is no single `Timestamped` class to test against — `Timestamped` is a function, and every application creates a different class. To ask "does this object have the timestamp feature?", check for the member (`"createdAt" in obj`) or write a type guard.

**Hidden coupling.** A mixin that reads `this.name` depends on its base; two mixins that both define `describe()` silently override each other depending on order, and, as shown above, the compiler does not even compare their signatures. This is the same "who defined this method?" problem that made React's team deprecate the old `createClass` mixins in 2016, in favour of higher-order components and, later, Hooks.

## The alternative pattern: copying methods with `applyMixins`

Older TypeScript code — and the TypeScript handbook, as an "alternative pattern" — uses a different technique: write each feature as a normal class, copy its prototype methods onto the target class at runtime, and use **declaration merging** to tell the compiler about the copied methods:

```typescript title="apply-mixins.ts"
class Jumpable {
  jump(this: { name: string }) { return `${this.name} jumps`; }
}
class Duckable {
  duck() { return "ducks"; }
}

class Player {
  constructor(public name: string) {}
}
// Declaration merging: this interface merges with the class's instance type.
interface Player extends Jumpable, Duckable {}

function applyMixins(target: Function, sources: Function[]) {
  for (const source of sources) {
    for (const key of Object.getOwnPropertyNames(source.prototype)) {
      if (key === "constructor") continue;
      Object.defineProperty(
        target.prototype, key,
        Object.getOwnPropertyDescriptor(source.prototype, key)!,
      );
    }
  }
}
applyMixins(Player, [Jumpable, Duckable]);

const p = new Player("Lin");
console.log(p.jump(), p.duck(), p instanceof Jumpable);
```

```output
Lin jumps ducks false
```

The `interface Player extends Jumpable, Duckable {}` line merges with the class `Player` (see [[b2-declaration-merging]]), so the compiler believes every `Player` has `jump` and `duck`. `applyMixins` then makes that belief true by copying property descriptors from each source prototype.

The weakness is that the two halves are not connected. Delete the `applyMixins` call and the code still compiles, then fails at runtime with `p.jump is not a function`. Only prototype methods are copied, so instance fields declared in `Jumpable` never reach `Player`, and `instanceof Jumpable` is `false` because no prototype link was created. Prefer the class-expression pattern in new code; it keeps the runtime and the types in one place.

## In real systems

**Web components.** Lit's documentation describes class mixins for sharing behaviour between `LitElement` subclasses, typed with the same `Constructor<LitElement>` constraint pattern taught here. Custom elements must extend `HTMLElement`, so a single base class cannot also inherit from a "feature" class — the exact situation mixins solve.

**UI component libraries.** Earlier versions of Angular Material built components from mixins such as `mixinDisabled` and `mixinColor`, each adding one input and its handling to a base class. Later versions moved away from them toward plain inputs and composition, which is a common trajectory: mixins solve the problem, but large mixin stacks become hard to follow.

**Domain models and ORMs.** Mixins add cross-cutting persistence features — soft deletion, audit timestamps, optimistic-locking versions — to entity classes. Whatever the framework, the shape is the one in this lesson: a constrained generic function returning `class extends Base`.

**React.** React components moved from mixins (`createClass`) to higher-order components (functions that wrap a component and return a new one — structurally the same idea applied to components) and then to Hooks, which share behaviour by composition rather than by layering classes. If you work mainly in React, you will meet mixins in non-React code and in interview questions far more often than in components.

## Trade-offs and alternatives

| Approach | How behaviour is shared | Strengths | Costs |
|---|---|---|---|
| Single inheritance | One fixed parent class | Simple, familiar | One parent only; base classes grow into grab-bags |
| Class mixins | Functions returning `class extends Base` | Pick features per class; typed; `super` works; one object | Order-dependent overrides; deep chains hurt readability and compile time |
| `applyMixins` + merging | Copy prototype methods, declare via interface | Works with existing classes | Types and runtime can drift; fields and `instanceof` lost |
| Composition | Hold helper objects as fields (`this.clock`, `this.activation`) | Explicit, testable, no name clashes | Slightly more wiring; delegating methods by hand |
| Plain functions | `activate(entity)`, `isStale(entity)` | Simplest; tree-shakeable | Behaviour not attached to the object |

A useful rule: reach for a mixin when several unrelated classes need the *same members on the object itself* — usually because a framework calls those members (a web component lifecycle method, an ORM hook). When you only need to reuse logic, a helper object or function is clearer, and is the usual reading of the "favour composition over inheritance" guideline. Keep chains short: two or three mixins are easy to follow, while six make every method lookup a puzzle.

## Common mistakes

**Typing the parameter as `Constructor` instead of a generic.** `function M(Base: Constructor)` compiles but discards the base type, so the result loses every base member. Use `function M<T extends Constructor>(Base: T)`.

**Using `unknown[]` or a specific constructor signature.** The compiler requires exactly one rest parameter of type `any[]` in the constructor constraint (TS2545). This is one of the few places where `any` is the correct choice; the base class's real constructor still checks arguments at the call site.

**Expecting `instanceof Mixin` to work.** A mixin is a function, not a class. Check for the members, or keep a reference to the specific mixed class you created.

**Applying mixins repeatedly.** Calling a mixin inside a function body creates a new class on every call, so identity checks fail and memory grows. Build mixed classes once at module scope.

**`private` members in exported mixins.** These break declaration emit with TS4094. Use `#private` fields or an explicit interface return type.

**Forgetting that order changes behaviour.** When two mixins define the same method, the outermost one wins. If both need to run, have each call `super.method()` (and constrain the base so that the method is known to exist).

## Interview perspective

**"How do you get multiple inheritance in TypeScript?"** A strong answer says JavaScript has single inheritance, then explains class mixins: a generic function `<T extends new (...args: any[]) => {}>(Base: T) => class extends Base { ... }`. Mention that composition is often the better answer and say when you would still choose a mixin (framework-called members on many unrelated classes).

**"Why must the constraint be `new (...args: any[]) => ...`?"** Because TypeScript only treats a class as a mixin when the base's constructor type has a single `any[]` rest parameter; the mixin forwards arguments it cannot know, and the real base constructor's signature is reapplied when you call `new` on the result.

**"What is the type of the returned class?"** An intersection of an anonymous constructor producing the added members with the base constructor type; instances are `Added & BaseInstance`. Follow-up: get the instance type with `InstanceType<typeof Mixed>`.

**"What can go wrong with mixins?"** Order-dependent overrides, hidden dependencies on base members, no `instanceof` for the mixin, private-member declaration errors, and hard-to-read types for long chains — each with its fix.

## Practice

1. Write a `Serializable` mixin that adds `serialize(): string` returning `JSON.stringify(this)`. Apply it to a `Point` class and print the result.
2. Write a `SoftDeletable` mixin that adds `deletedAt: Date | null` and `softDelete()`. Then write a `Restorable` mixin constrained to bases that have `deletedAt`, adding `restore()`. Confirm that `Restorable(User)` fails to compile and `Restorable(SoftDeletable(User))` works.
3. Give both `Activatable` and `Tagged` a `describe()` method that calls `super.describe()` and appends its own word. Constrain the base so that `super.describe()` type-checks, and predict the output for both nesting orders before running it.
4. Convert the `applyMixins` example to class mixins and explain which runtime behaviours change (fields, `instanceof`, the safety of forgetting a step).
5. Rewrite the `SmartUser` example using composition: a `User` with `activation` and `clock` helper objects. Compare how much code each version needs and which is easier to test.

```quiz
Q: Why does `function Timestamped<T extends Constructor>(Base: T)` keep the base class's members on the result, while `function Timestamped(Base: Constructor)` does not?
- [ ] The generic version copies the base's methods at runtime
- [x] The type parameter `T` captures the caller's exact class type, and the result type includes `& T`
- [ ] `Constructor` without a generic is treated as `any`
- [ ] Only the generic version uses `extends` in the emitted JavaScript
> Both versions produce identical JavaScript; the difference is purely in types. A parameter typed as `Constructor` widens whatever you pass to "something that builds `{}`", so the compiler forgets `User`. A type parameter records `typeof User`, and the inferred return type `{ new (...): Added } & T` carries it through.
```

```quiz
Q: Given `const C = Tagged(Activatable(User))` where both mixins define `describe()`, what does `new C("Ada").describe()` return?
- [ ] Activatable's version, because it was applied first
- [x] Tagged's version, because the outermost mixin is the top layer of the prototype chain
- [ ] A compile error, because two mixins define the same method
- [ ] Both results concatenated
> Method lookup starts at the object's nearest prototype, which is the class created by the outermost call. Defining the same method in two mixins is legal: each mixin body is checked only against its own constraint, so the compiler never sees a clash.
```

```quiz
Q: Which constructor constraint does TypeScript accept for a mixin's base class?
- [ ] `new (...args: unknown[]) => {}`
- [ ] `new (name: string) => {}`
- [x] `new (...args: any[]) => {}`
- [ ] `Function`
> TS2545 requires a single rest parameter of type `any[]`. That shape tells the compiler the class is a mixin, letting it forward unknown arguments to `super` while still applying the real base constructor's signature when you call `new` on the result.
```

## Quick revision {#quick-revision}

- Mixin: a function `(Base) => class extends Base { ... }` that adds behaviour to any class; JavaScript's substitute for multiple inheritance.
- Works because class expressions are values and `extends` accepts any constructor expression.
- Typing: `type Constructor<T = {}> = new (...args: any[]) => T;` then `function M<TBase extends Constructor>(Base: TBase)`.
- The rest parameter must be exactly `...args: any[]` (TS2545); `unknown[]` or a fixed signature is rejected.
- Inferred return type: `{ new (...args: any[]): Added } & TBase`; `new` uses the base's constructor signature; instances are `Added & BaseInstance`; statics carry over.
- Instance type of a mixed class: `type X = InstanceType<typeof X>`.
- Constrained mixin: `TBase extends Constructor<{ name: string }>` lets the body use `this.name` and rejects bases without it.
- Composition `A(B(C(Base)))`: `C` is applied first and sits lowest; the outermost mixin wins method clashes; constructors run base-first.
- Mixin constructors take `(...args: any[])` and call `super(...args)`; pass configuration to the mixin function instead of adding constructor parameters.
- Pitfalls: each call creates a new class; no `instanceof Mixin`; `private`/`protected` in exported mixins break declaration emit (TS4094); deep chains slow types — annotate return types with an interface.
- `applyMixins` + interface merging copies prototype methods only; types and runtime can drift.
- Prefer composition when you only need to reuse logic.

## Key takeaways {#key-takeaways}

- A mixin is ordinary JavaScript — a function returning a class expression that extends its argument — and each application adds one layer to the prototype chain.
- TypeScript types mixins through a generic parameter constrained to `new (...args: any[]) => T`; the generic is what preserves the base class's members and constructor checks.
- Constraints let a mixin depend on base members safely, turning runtime failures into compile errors at the point the mixin is applied.
- Order of application decides which method wins, and constructors run from the base upward.
- Mixins have real limits — no `instanceof`, new class per call, declaration-emit rules for private members, unwieldy types in deep stacks — so use them for framework-facing members on unrelated classes and prefer composition for plain logic reuse.
