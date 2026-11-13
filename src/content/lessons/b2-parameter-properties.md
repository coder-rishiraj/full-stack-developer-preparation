---
summary: A parameter property lets a constructor parameter declare and initialise a class field in one step, by putting a modifier such as `private` or `readonly` in front of it. You will learn exactly what code TypeScript generates for it, the initialisation-order trap it can cause, the places it is not allowed, and why some modern toolchains discourage it.
difficulty: intermediate
minutes: 35
objectives:
  - Write classes with parameter properties and state which modifiers create a field
  - Explain the JavaScript that `tsc` emits for a parameter property and how it interacts with field initialisers and `super()`
  - Debug the "used before its initialization" error and the `$NaN`-style bugs that come from field-initialisation order
  - Recognise where parameter properties are forbidden, including under `erasableSyntaxOnly` and Node.js type stripping
  - Choose between parameter properties and explicit fields for a given class
---

## Introduction

Classes that receive their state through the constructor often look like this (assume `HttpClient` is an interface declared elsewhere):

```typescript title="verbose.ts"
class UserService {
  private readonly http: HttpClient;
  private readonly baseUrl: string;

  constructor(http: HttpClient, baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;
  }
}
```

Each piece of state is written three times: once as a field declaration, once as a constructor parameter, once as an assignment. With five dependencies that is fifteen lines of repetition, and every repetition is a chance for a typo — declaring `baseUrl` but assigning `this.baseURL`, or forgetting the assignment altogether.

A **parameter property** removes the repetition. Put an access modifier or `readonly` in front of a constructor parameter, and TypeScript both declares a field with that name and type *and* assigns the argument to it:

```typescript title="concise.ts"
class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly baseUrl: string,
  ) {}
}
```

The two classes are equivalent. This shorthand is everywhere in Angular and NestJS, where services receive their dependencies through the constructor, and it is common in small data and model classes. It is also one of the very few TypeScript features that is not pure type annotation — it generates runtime code — which is why it has become a point of debate in newer toolchains. This lesson covers both sides.

## Before you start

- **Access modifiers and `readonly`** — what `public`, `private`, `protected` and `readonly` mean on a class member. See [[b2-public-private-protected]].
- **Classes in TypeScript** — fields, constructors and `strict` initialisation checks. See [[b2-classes-ts]].
- **Inheritance and `super`** — calling a base-class constructor from a subclass. See [[b2-class-inheritance]] and [[b2-super-constructor]].

Examples use TypeScript 5.x or 6.x with `strict` on and a compile target of ES2022 or later unless stated otherwise.

## The rule in one sentence

A constructor parameter becomes a parameter property when it carries **at least one** of these modifiers: `public`, `private`, `protected`, `readonly` or `override`. The resulting field has the parameter's name, type and modifiers. A parameter with no modifier is an ordinary parameter, visible only inside the constructor.

```typescript title="point.ts"
class Point {
  constructor(
    public x: number,
    public y: number,
    public readonly label = 'pt',      // default value: type inferred as string
  ) {}

  distance(): number {
    return Math.hypot(this.x, this.y);
  }
}

const pt = new Point(3, 4);
console.log(pt.distance());
console.log(pt);
console.log(Object.keys(pt));
```

```output
5
Point { x: 3, y: 4, label: 'pt' }
[ 'x', 'y', 'label' ]
```

`x`, `y` and `label` are real own properties of the instance, exactly as if they had been declared and assigned by hand. The modifier combinations behave as you would expect:

| Parameter | Field created | Visible to | Reassignable after construction |
|---|---|---|---|
| `public x: number` | `x: number` | everyone | yes |
| `readonly x: number` | `readonly x: number` (public) | everyone | no |
| `private x: number` | `private x: number` | this class | yes |
| `private readonly x: number` | `private readonly x: number` | this class | no |
| `protected x: number` | `protected x: number` | this class and subclasses | yes |
| `x: number` | none | — | — |

Note the second row: `readonly` on its own creates a **public** readonly field. Optional parameters (`public note?: string`) create optional fields of type `string | undefined`, and parameters with defaults (`private qty = 1`) create fields whose type is inferred from the default.

## Forgetting the modifier

The commonest mistake with this feature is leaving the modifier off and expecting a field:

```typescript title="no-modifier.ts"
class Greeter {
  constructor(name: string) {}

  hello(): string {
    return `Hello, ${this.name}`;
    // error TS2339: Property 'name' does not exist on type 'Greeter'.
  }
}
```

`name` here is just a parameter. It exists while the constructor runs and is then gone. The compiler error is clear enough when another method uses the name, but if nothing reads it yet, the code compiles silently and the value is lost. Linting with `noUnusedParameters` (or ESLint's `no-unused-vars`) catches that case, because the parameter is never read.

## How it works internally: the emitted JavaScript

Parameter properties are not part of JavaScript. `tsc` rewrites them. For a class compiled to an ES2022 target:

```typescript title="order.ts"
class Order {
  readonly createdAt = Date.now();
  constructor(readonly id: string, private qty = 1, public note?: string) {}
}
```

the output is:

```javascript title="order.js (emitted)"
class Order {
    id;
    qty;
    note;
    createdAt = Date.now();
    constructor(id, qty = 1, note) {
        this.id = id;
        this.qty = qty;
        this.note = note;
    }
}
```

Two details matter. First, the generated assignments go at the **start of the constructor body** (after `super()` in a subclass — see below). Second, the fields are also declared at the top of the class as JavaScript class fields, because with an ES2022 target TypeScript uses standard class-field semantics (the `useDefineForClassFields` option, which defaults to `true` for ES2022 and later targets).

The modifiers themselves vanish, as all type-level modifiers do: `private qty` is an ordinary property at runtime, visible in `Object.keys` and `JSON.stringify`.

### The initialisation-order trap

JavaScript runs a class's **field initialisers before the constructor body**. Parameter-property assignments live in the constructor body. So a field initialiser that reads a parameter property sees `undefined`, *even if the field is written below the constructor in the source*:

```typescript title="price.ts"
class Price {
  constructor(private readonly cents: number) {}

  readonly label = `$${(this.cents / 100).toFixed(2)}`;
  // error TS2729: Property 'cents' is used before its initialization.
}

console.log(new Price(1999).label);
```

Compiled with an ES2022 target (or TypeScript 6's default target) despite the error, this prints:

```output
$NaN
```

The emitted JavaScript shows why: `label = ...` is a class field and runs first, while `this.cents = cents` runs afterwards inside the constructor.

```javascript title="price.js (emitted, ES2022 target)"
class Price {
    cents;
    constructor(cents) {
        this.cents = cents;
    }
    label = `$${(this.cents / 100).toFixed(2)}`;
}
```

With an older target such as ES2020, `useDefineForClassFields` defaults to `false` and TypeScript moves field initialisers into the constructor *after* the parameter-property assignments, so the same source prints `$19.99`. Code that worked for years can therefore change behaviour when a project raises its target — which is exactly why the compiler reports TS2729. The fix is to compute the value where the order is guaranteed: in the constructor body, or in a getter.

```typescript title="price-fixed.ts"
class Price {
  readonly label: string;

  constructor(private readonly cents: number) {
    this.label = `$${(this.cents / 100).toFixed(2)}`;   // runs after this.cents is set
  }
}

console.log(new Price(1999).label);
```

```output
$19.99
```

### Parameter properties in subclasses

In a derived class, `this` does not exist until `super()` returns, so TypeScript places the parameter-property assignments immediately **after** the `super(...)` call. Code that does not touch `this` may run before `super()`:

```typescript title="dog.ts"
class Animal {
  constructor(readonly name: string) {}
}

class Dog extends Animal {
  constructor(override readonly name: string, private readonly breed: string) {
    console.log('before super');   // allowed: does not use this
    super(name);
  }

  describe(): string {
    return `${this.name} (${this.breed})`;
  }
}

console.log(new Dog('Rex', 'collie').describe());
```

```output
before super
Rex (collie)
```

```javascript title="dog.js (emitted, constructor only)"
    constructor(name, breed) {
        console.log('before super');
        super(name);
        this.name = name;
        this.breed = breed;
    }
```

`name` already exists on `Animal`, so redeclaring it as a parameter property in `Dog` is an override. With `noImplicitOverride` enabled, TypeScript requires the `override` keyword here (otherwise error TS4115, "This parameter property must have an 'override' modifier because it overrides a member in base class 'Animal'"). Usually the cleaner design is to *not* redeclare it: take a plain `name: string` parameter, pass it to `super`, and let the base class own the field.

## Where parameter properties are not allowed

The compiler enforces several restrictions, each with a reason.

```typescript title="restrictions.ts"
class A {
  constructor(public { a }: { a: number }) {}
  // error TS1187: A parameter property may not be declared using a binding pattern.
}

class B {
  constructor(public ...xs: number[]) {}
  // error TS1317: A parameter property cannot be declared using a rest parameter.
}

class C {
  method(public x: number) {}
  // error TS2369: A parameter property is only allowed in a constructor implementation.
}

class D {
  constructor(public x: number);   // overload signature
  // error TS2369: A parameter property is only allowed in a constructor implementation.
  constructor(x: number) {}
}
```

A destructured parameter (`{ a }`) has no single name to use as the field name, so it cannot become a field. A rest parameter could technically become an array field, but the language disallows it. Ordinary methods and constructor overload signatures produce no constructor code, so there is nowhere to put the assignment. Interfaces and type aliases have no constructors at all, so the feature does not exist there; an interface that a class `implements` simply lists the properties, and the class may satisfy them with parameter properties.

The binding-pattern restriction is the one people hit in practice. When a constructor takes an options object, parameter properties do not help:

```typescript title="options.ts"
interface RetryOptions {
  attempts: number;
  delayMs: number;
}

class Retrier {
  readonly attempts: number;
  readonly delayMs: number;

  constructor({ attempts, delayMs }: RetryOptions) {
    this.attempts = attempts;
    this.delayMs = delayMs;
  }
}

console.log(new Retrier({ attempts: 3, delayMs: 200 }));
```

```output
Retrier { attempts: 3, delayMs: 200 }
```

Alternatively, store the whole object: `constructor(private readonly options: RetryOptions) {}`, then read `this.options.attempts`.

## Parameter properties and erasable syntax

Most TypeScript syntax is **erasable**: delete the type annotations and what remains is valid JavaScript with identical behaviour. Parameter properties are not erasable. Delete `private readonly` from `constructor(private readonly http: HttpClient)` and you get a constructor that silently stops storing `http`. Enums, namespaces with values, and legacy `import =` syntax share this property.

That matters because several tools now run TypeScript by stripping types instead of compiling it:

- **Node.js type stripping.** Recent Node.js versions can run `.ts` files directly by replacing type annotations with whitespace. Stripping cannot generate the assignments a parameter property needs, so Node refuses the file. On Node.js 22.22:

  ```output
  SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript parameter property is not supported in strip-only mode
  ```

  Running with `--experimental-transform-types` enables the transformation and the file runs.
- **The `erasableSyntaxOnly` compiler option** (TypeScript 5.8 and later) makes `tsc` report every non-erasable construct, so a codebase can guarantee it will work under type stripping. A parameter property is then reported as error TS1294, "This syntax is not allowed when 'erasableSyntaxOnly' is enabled."

Bundlers such as esbuild, SWC and Vite's TypeScript handling *do* transform parameter properties, so most frontend projects are unaffected. The practical guidance: if your project runs `.ts` files directly on Node.js with type stripping, or enables `erasableSyntaxOnly`, write explicit fields instead. Otherwise parameter properties are fine.

## Decorators on parameter properties

Angular and NestJS inject dependencies by decorating constructor parameters, for example `constructor(@Inject(TOKEN) private readonly config: AppConfig) {}`. Parameter decorators exist only in TypeScript's legacy `experimentalDecorators` mode, which those frameworks enable. The TC39 standard decorators supported by TypeScript 5.0 and later do not include parameter decorators. If you see a decorator on a parameter property, the project is using the legacy mode. See [[b2-decorators]].

## Worked example: a service with injected dependencies

This is the shape of code that parameter properties were designed for: a service that receives its collaborators and configuration in the constructor and never reassigns them.

```typescript title="user-service.ts"
interface HttpClient {
  get(url: string): Promise<unknown>;
}

interface Logger {
  info(message: string): void;
}

class UserService {
  private readonly cache = new Map<string, unknown>();

  constructor(
    private readonly http: HttpClient,
    private readonly log: Logger,
    readonly baseUrl = 'https://api.example.com',
  ) {}

  async getUser(id: string): Promise<unknown> {
    const hit = this.cache.get(id);
    if (hit !== undefined) {
      this.log.info(`cache hit ${id}`);
      return hit;
    }
    const user = await this.http.get(`${this.baseUrl}/users/${id}`);
    this.cache.set(id, user);
    this.log.info(`fetched ${id}`);
    return user;
  }
}

// Test doubles: plain objects that satisfy the interfaces.
const fakeHttp: HttpClient = {
  get: async (url) => ({ url }),
};
const consoleLogger: Logger = { info: (m) => console.log(m) };

const service = new UserService(fakeHttp, consoleLogger);
console.log(await service.getUser('42'));
console.log(await service.getUser('42'));
console.log(service.baseUrl);
```

```output
fetched 42
{ url: 'https://api.example.com/users/42' }
cache hit 42
{ url: 'https://api.example.com/users/42' }
https://api.example.com
```

Walk through it. The constructor declares three fields in three lines. `http` and `log` are `private readonly`: nothing outside the service can reach them, and no method can swap them, which is what you want for injected collaborators. `baseUrl` is `readonly` without an access modifier, so it is public and read-only, and its default value means callers may omit it. The `cache` field uses an ordinary initialiser; it does not depend on any parameter property, so the initialisation-order trap does not apply. Because the dependencies are typed as interfaces, the test passes plain objects — no mocking library needed. This is constructor injection in miniature; Angular and NestJS automate the "create the dependencies and pass them in" step (see [[c5-constructor-injection]] for the same idea in Spring).

## In real systems

- **Angular and NestJS** use `constructor(private readonly x: X) {}` as the standard way to receive injected services. Style guides in both ecosystems recommend it.
- **Domain and value classes** — `Money`, `Coordinate`, `DateRange` — often consist of a constructor of parameter properties plus a few methods.
- **Projects targeting Node's native TypeScript support** increasingly ban the feature with `erasableSyntaxOnly`, and lint rules such as `@typescript-eslint/parameter-properties` let teams either require or forbid it consistently.

## Trade-offs and alternatives

The benefit is concision and a single source of truth: the field, its type, its visibility and its initialisation live on one line. The costs are worth naming. The class's fields are now split between the class body and the constructor's parameter list, so a reader scanning the body may miss them. Long parameter lists of `private readonly` modifiers become hard to read; past four or five parameters, an options object or a builder is usually clearer. The feature generates runtime code, so it is incompatible with strip-only toolchains. And it interacts with field-initialisation order in a way that changed between compile targets.

A reasonable team rule: use parameter properties for injected dependencies and small value classes; use explicit fields when a class has many fields, when field initialisers need constructor values, or when the project must stay erasable.

## Common mistakes

> [!MISTAKE] Omitting the modifier
> `constructor(name: string) {}` declares no field. Add `public`, `private`, `protected` or `readonly` to make it a parameter property.

> [!WARNING] Reading a parameter property in a field initialiser
> Field initialisers run before the constructor body, so `label = this.cents / 100` sees `undefined` under ES2022 class-field semantics. Move the computation into the constructor or a getter.

**Redeclaring a base-class property in a subclass.** `constructor(readonly name: string) { super(name); }` in a subclass creates a second assignment of the same property and, with `noImplicitOverride`, an error. Pass the value to `super` as a plain parameter instead.

**Trying to destructure.** `constructor(private { a, b }: Opts)` is not allowed. Keep the object (`private readonly opts: Opts`) or declare fields explicitly.

**Assuming `private` hides the value.** A `private` parameter property is still an ordinary property at runtime and will appear in `JSON.stringify`. See [[b2-public-private-protected]] for `#private` fields, which cannot be declared as parameter properties.

## Interview perspective

**"What does `constructor(private x: number)` compile to?"** A field declaration (with class-field semantics) plus `this.x = x` at the start of the constructor body, after `super()` in a subclass. Mentioning that the `private` disappears in the output shows you understand erasure.

**"Why might a team ban parameter properties?"** Because they are not erasable syntax: Node's type stripping rejects them and `erasableSyntaxOnly` flags them. Also because they split field declarations across two places and interact badly with field initialisers under `useDefineForClassFields`.

**"A field initialiser that uses a constructor parameter started returning `NaN` after a TypeScript upgrade. Why?"** The target moved to ES2022 or later (or TypeScript 6's default), so `useDefineForClassFields` became `true` and field initialisers now run before parameter-property assignments. TS2729 points at the line.

## Practice

1. Rewrite a class with four explicit `private readonly` fields using parameter properties. Compile both versions to ES2022 and compare the emitted JavaScript.
2. Write a class whose field initialiser reads a parameter property. Compile it with `--target es2020` and `--target es2022`, run both, and explain the difference.
3. Enable `erasableSyntaxOnly` in a small project. Which errors appear, and what is the smallest change that removes each one?
4. Design a `Money` value class with `amount` and `currency` as `readonly` parameter properties and an `add(other: Money)` method that rejects mismatched currencies.

```quiz
Q: Which constructor parameter does NOT create a class field?
- [ ] `readonly id: string`
- [ ] `protected repo: Repo`
- [x] `name: string`
- [ ] `public note?: string`
> A parameter becomes a parameter property only when it has `public`, `private`, `protected`, `readonly` or `override`. `readonly` alone is enough, and creates a public read-only field. `name: string` has no modifier, so it is an ordinary parameter that disappears when the constructor returns.
```

```quiz
Q: Under an ES2022 target, `class P { constructor(private n: number) {} half = this.n / 2 }` gives `half` the value `NaN`. Why?
- [ ] Parameter properties are assigned lazily on first access
- [x] Class field initialisers run before the constructor body, where the parameter-property assignment lives
- [ ] `private` fields cannot be read in initialisers
- [ ] Division by a `private` number is a type error
> With standard class-field semantics, `half = this.n / 2` runs first, while `this.n = n` is emitted inside the constructor body. `this.n` is still `undefined`, and `undefined / 2` is `NaN`. TypeScript reports TS2729 here. Older targets moved initialisers after the assignments, which is why the bug can appear after raising the target.
```

## Quick revision {#quick-revision}

- A constructor parameter with `public`, `private`, `protected`, `readonly` or `override` becomes a field with the same name, type and modifiers; without a modifier it is just a parameter.
- `readonly` alone creates a public readonly field. Defaults and `?` work and shape the field's type.
- Emit: field declarations plus `this.x = x` at the start of the constructor, after `super()` in subclasses. Modifiers are erased.
- Field initialisers run before the constructor body under ES2022 class fields (`useDefineForClassFields`), so they cannot read parameter properties (TS2729); compute in the constructor or a getter.
- Not allowed: destructuring (TS1187), rest parameters (TS1317), methods and overload signatures (TS2369).
- Redeclaring a base property needs `override` under `noImplicitOverride` (TS4115); usually pass it to `super` instead.
- Not erasable: rejected by Node.js type stripping (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`) and by `erasableSyntaxOnly` (TS1294).
- Parameter decorators (Angular, NestJS) require legacy `experimentalDecorators`.

## Key takeaways {#key-takeaways}

- Parameter properties declare and assign a field in one place, removing three-way repetition in constructor-heavy classes.
- They are a code transformation, not a type annotation: `tsc` emits the field and the assignment, and erases the modifier.
- Field initialisers run before parameter-property assignments under modern class-field semantics, so compute derived values in the constructor.
- They fit dependency injection and small value classes; prefer explicit fields for large classes, destructured options, or projects that must stay erasable.
