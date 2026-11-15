---
summary: Decorators are functions you attach to a class or class member with `@` syntax to wrap, replace or register it when the class is defined. You will learn how the standard (ECMAScript) decorators in TypeScript 5+ work and how to type them, how they differ from the older `experimentalDecorators` used by Angular and NestJS, and what TypeScript actually emits for each.
difficulty: advanced
minutes: 50
objectives:
  - Explain what a decorator is, when it runs, and what it receives and may return
  - Write and type standard method, field, accessor and class decorators, including decorator factories
  - Trace the evaluation and application order of several decorators on one class
  - Compare standard decorators with `experimentalDecorators` and `emitDecoratorMetadata`, and choose the right mode for a framework
  - Recognise the runtime cost and emitted helpers of decorators and avoid mixing modes
---

## Introduction

Many classes need the same extra behaviour on several members: log every call to these methods, bind these handlers to their instance, validate this property, register this class with a dependency-injection container. You can write that logic by hand in every method, but the repetition hides the method's real purpose and is easy to forget once.

A **decorator** moves that cross-cutting logic into a reusable function and attaches it with one line:

```ts title="calculator.ts (excerpt)"
class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}
```

`@logged` is an expression that evaluates to a function. When the class is defined, JavaScript calls that function with the method being decorated, and the function may return a replacement. Nothing about `add` itself changes; the logging lives in `logged`.

Decorators are a JavaScript language feature, currently a Stage 3 ECMAScript proposal, which TypeScript has supported natively since 5.0. They are also, confusingly, an older TypeScript-only feature with the same `@` syntax but different semantics, enabled with `experimentalDecorators`, which Angular, NestJS and TypeORM were built on. You will meet both. This lesson teaches the standard version first, then the legacy one, and what goes wrong when the two are mixed.

## Before you start

- **Classes in TypeScript** — methods, fields, accessors, `static`. See [[b2-classes-ts]].
- **Higher-order functions** — functions that take and return functions. See [[b1-first-class-functions]].
- **`this` binding** — why a method loses its `this` when detached. See [[b1-this-lost]].
- **Generics** — standard decorator types are generic. See [[b2-generics]].

## The intuition: wrapping at definition time

Think of a decorator as a gift-wrapping station that every item passes through once, as it comes off the production line. The station receives the item, may wrap it in something (a logging wrapper, a validation layer), and sends on either the original or the wrapped version. Customers only ever receive what left the station.

Two details of the analogy matter. The station runs **once per class definition**, not per call or per instance; the wrapper it produces then runs on every call. And the station cannot inspect what customers later do with the item; it only shapes the item. Decorators that need per-instance work (such as binding a method to each object) register an **initializer** that runs during construction.

The pattern is the same as the classic object-oriented decorator pattern (see [[d2-decorator]]), applied to class members at definition time rather than to objects at runtime.

## Standard decorators: the shape

A standard decorator is a function with two parameters:

1. **`value`** — the thing being decorated: the method function, the class constructor, the getter/setter pair, or `undefined` for a field (a field has no value yet when the class is defined).
2. **`context`** — an object describing it: `kind` (`'class'`, `'method'`, `'getter'`, `'setter'`, `'field'`, `'accessor'`), `name`, `static`, `private`, an `access` object, `metadata`, and the `addInitializer` function.

It may return a replacement of the same kind (a new method, a new class) or nothing to keep the original. TypeScript provides a context type per kind: `ClassMethodDecoratorContext`, `ClassFieldDecoratorContext`, `ClassAccessorDecoratorContext`, `ClassGetterDecoratorContext`, `ClassSetterDecoratorContext` and `ClassDecoratorContext`.

## Method decorators

Here is `logged` in full, typed so it works on any method:

```ts title="std.ts"
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`-> ${name}(${args.join(', ')})`);
    const result = target.call(this, ...args);
    console.log(`<- ${name} returned ${String(result)}`);
    return result;
  };
}

class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(2, 3));
```

```output
-> add(2, 3)
<- add returned 5
5
```

Read the types from the inside out. `This`, `Args` and `Return` are inferred from the decorated method: here `Calculator`, `[a: number, b: number]` and `number`. The replacement function is declared with the same `this` type, parameters and return type, so the decorated `add` keeps its exact signature; callers still get errors for `calc.add('2', 3)`. Using `target.call(this, ...args)` passes the real instance through, so the original method still sees the right `this`. `context.name` is typed `string | symbol`, hence `String(...)` before printing.

A simpler signature such as `(target: Function, context: ClassMethodDecoratorContext)` compiles too, but returning a loosely typed wrapper would erase the method's parameter types. Generic decorators are more verbose to write and much safer to use.

## Decorator factories

`@logged` takes no options. To configure a decorator, write a **decorator factory**: a function that takes options and returns the decorator. You call it at the use site, `@retry(3)` or `@trace('render')`. The factory runs when the decorator expression is evaluated; the decorator it returns runs when it is applied. That difference shows up in the order of events:

```ts title="order.ts"
function trace(label: string) {
  console.log(`evaluate ${label}`);
  return function (_value: unknown, context: DecoratorContext) {
    console.log(`apply ${label} to ${context.kind} ${String(context.name)}`);
  };
}

@trace('class')
class Widget {
  @trace('field') size = 1;
  @trace('first') @trace('second') render() {}
  static {
    console.log('static block runs');
  }
}

console.log('created', new Widget().size);
```

```output
evaluate class
evaluate field
evaluate first
evaluate second
apply second to method render
apply first to method render
apply field to field size
apply class to class Widget
static block runs
created 1
```

This output (from TypeScript 6's downlevelled emit, run on Node.js 22) shows the rules:

- **Decorator expressions are evaluated top to bottom**, in source order, including the class decorator written above the class.
- **Several decorators on one element apply bottom-up**: the one closest to the member (`second`) wraps first, and `first` wraps the result. Like function composition, `@first @second render` means `first(second(render))`.
- **Member decorators apply before class decorators**, and method decorators apply before field decorators.
- **Class decorators apply last**, then static initialization (the `static` block) runs. So a class decorator sees a class whose members are already decorated.

## Field and accessor decorators

A field has no value when the class is defined; it is created per instance. So a **field decorator** receives `undefined` as its value and can return an **initializer function**, which runs for each instance, receives the field's initial value and returns the value to store. **`addInitializer`** registers code to run during construction for every instance, which is how a decorator can do per-object work:

```ts title="bound.ts"
function bound<This extends object, Args extends unknown[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  context.addInitializer(function (this: This) {
    // Runs during construction, so every instance gets its own bound copy.
    Reflect.set(this, context.name, method.bind(this));
  });
}

function trimmed(_value: undefined, _context: ClassFieldDecoratorContext<unknown, string>) {
  // The returned function receives the field's initial value and replaces it.
  return (initial: string) => initial.trim();
}

class Counter {
  @trimmed label = '  clicks  ';
  count = 0;

  @bound
  increment() {
    this.count++;
    return this.count;
  }
}

const c = new Counter();
const inc = c.increment; // detached from c, e.g. passed as an event handler
console.log(inc(), inc(), `[${c.label}]`);
```

```output
1 2 [clicks]
```

Without `@bound`, calling the detached `inc()` would run with `this` as `undefined` (class bodies are strict mode) and throw a `TypeError`. The initializer puts an own property on each instance holding the method bound to it, so passing `c.increment` as a callback works. The field decorator only transforms the initial value; it cannot intercept later assignments to `label`, because a field is an ordinary data property.

To intercept reads and writes, use the **`accessor` keyword**, also part of the decorators proposal. `accessor volume = 150` creates a private storage slot plus a getter and setter, and an **accessor decorator** can replace the getter, the setter and the initializer:

```ts title="acc.ts"
function clamp(min: number, max: number) {
  return function <This>(
    target: ClassAccessorDecoratorTarget<This, number>,
    _context: ClassAccessorDecoratorContext<This, number>,
  ): ClassAccessorDecoratorResult<This, number> {
    return {
      set(value) {
        target.set.call(this, Math.min(max, Math.max(min, value)));
      },
      init(value) {
        return Math.min(max, Math.max(min, value));
      },
    };
  };
}

class Player {
  @clamp(0, 100) accessor volume = 150;
}

const p = new Player();
console.log(p.volume);
p.volume = -20;
console.log(p.volume);
p.volume = 42;
console.log(p.volume);
```

```output
100
0
42
```

`init` clamps the initial `150` to `100`, and the replacement `set` clamps every later assignment. The decorator returned no `get`, so the original getter is kept.

## Class decorators

A **class decorator** receives the class constructor and a `ClassDecoratorContext`. It may return a new class (usually a subclass) to replace it, or use `addInitializer` to run code once the class is fully defined. A common use is registration:

```ts title="cls.ts"
const registry = new Map<string, Function>();

function register(name: string) {
  return function (target: Function, context: ClassDecoratorContext) {
    context.addInitializer(() => {
      registry.set(name, target);
    });
  };
}

@register('email')
class EmailNotifier {
  send(to: string) {
    return `email to ${to}`;
  }
}

@register('sms')
class SmsNotifier {
  send(to: string) {
    return `sms to ${to}`;
  }
}

console.log([...registry.keys()]);
console.log(registry.get('sms') === SmsNotifier, new EmailNotifier().send('ada@example.com'));
```

```output
[ 'email', 'sms' ]
true email to ada@example.com
```

Registration happens when each class definition is evaluated, so it depends on the module being imported. A class in a file nothing imports is never registered, a classic source of "my plugin is not found" bugs.

> [!NOTE] Types do not change
> A decorator can change runtime behaviour, but TypeScript does not change the decorated declaration's *type* based on what the decorator returns. If a class decorator returns a subclass with an extra method, code using the class still cannot see that method. Use mixins (see [[b2-mixins]]) when you need the type to change.

## Legacy decorators: `experimentalDecorators`

Before the proposal stabilised, TypeScript shipped its own decorator implementation based on an earlier draft. It is enabled with `"experimentalDecorators": true`, and it is still fully supported in TypeScript 6 because large frameworks depend on it. Its signatures differ:

| Kind | Legacy signature | Standard signature |
|---|---|---|
| Class | `(constructor)` | `(value, context)` |
| Method / accessor | `(prototype, key, descriptor)` | `(value, context)` |
| Property | `(prototype, key)` | `(undefined, context)` for fields |
| Parameter | `(target, key, index)` | Not supported |

The legacy method decorator works on a **property descriptor**, the object `Object.defineProperty` uses:

```ts title="legacy.ts"
function logged(target: object, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    console.log(`-> ${key}(${args.join(', ')})`);
    return original.apply(this, args);
  };
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

class Logger {}

@sealed
class Calculator {
  constructor(private logger: Logger) {}

  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator(new Logger());
console.log(calc.add(2, 3));
console.log(Object.isSealed(Calculator.prototype));
```

Compiled with `experimentalDecorators` and run:

```output
-> add(2, 3)
5
true
```

### `emitDecoratorMetadata` and dependency injection

The legacy mode has a companion option, **`emitDecoratorMetadata`**, that the standard mode does not support. With it, TypeScript records the design-time types of decorated declarations in the emitted JavaScript. Compiling `legacy.ts` with both options produces calls such as:

```js title="out/legacy.js (excerpt)"
__metadata("design:paramtypes", [Number, Number]),
__metadata("design:returntype", Number)
// ...and on the class:
__metadata("design:paramtypes", [Logger])
```

The last line is the important one: the constructor's parameter types survive into runtime as real references (`Logger`). With the `reflect-metadata` polyfill loaded, a dependency-injection container reads `design:paramtypes`, sees that `Calculator` needs a `Logger`, and constructs one automatically. This is how NestJS and Angular's older injection style resolve constructor dependencies without you listing them. Without the polyfill, the `__metadata` helper does nothing, which is why the program above still ran. Only types that exist at runtime can be recorded: interfaces become `Object`, which is why these frameworks require classes or explicit tokens for injectable dependencies. Parameter decorators such as NestJS's `@Inject(TOKEN)` and `@Body()` exist only in the legacy mode.

## The two modes do not mix

A project compiles all its decorators in one mode. Legacy decorator functions applied in standard mode fail to type-check, because the runtime will call them with different arguments:

```output
legacy.ts(20,3): error TS1241: Unable to resolve signature of method decorator when called as an expression.
  The runtime will invoke the decorator with 2 arguments, but the decorator expects 3.
```

And a parameter decorator in standard mode is rejected outright with TS1206, "Decorators are not valid here". A library's decorators are written for one mode; check its documentation before choosing. Today the practical rule is:

| Situation | Mode |
|---|---|
| NestJS, TypeORM, Angular projects, anything using `reflect-metadata` or parameter decorators | `experimentalDecorators` (+ `emitDecoratorMetadata` where the framework says so) |
| New code and libraries written for the standard (for example MobX 6.10+ and Lit 3, which support both) | Standard (leave `experimentalDecorators` off) |

## How it works internally

No JavaScript engine in common use runs decorator syntax natively yet: Node.js 22 rejects `@d m(){}` with `SyntaxError: Invalid or unexpected token`. So TypeScript (or Babel, or a bundler's transformer) rewrites decorated classes into plain JavaScript. In standard mode, TypeScript 6 targeting ES2022 emits helper functions named `__esDecorate` and `__runInitializers`: for each element it builds the `context` object, calls the decorators in the order shown earlier, installs any replacements on the class or prototype, and arranges for initializers to run in the constructor. In legacy mode it emits `__decorate` (and `__metadata`), which calls decorators with prototypes and descriptors and redefines the properties.

That rewriting has costs. The helpers add code to the bundle (shared via `tslib` with `importHelpers`), every decorated method call goes through an extra wrapper function, and decorated classes are harder for minifiers to tree-shake because applying a decorator is a side effect. In hot paths, a wrapper per call can matter; for request handlers and components it rarely does.

## In real systems

Most developers use decorators written by frameworks rather than write their own. NestJS controllers (`@Controller`, `@Get`, `@Body`), Angular components (`@Component`, `@Input`), and TypeORM entities (`@Entity`, `@Column`) all use legacy decorators to attach metadata that the framework reads at startup to build routes, components or database mappings. In Spring, Java annotations play a similar role, though they are passive metadata rather than functions (compare [[c1-annotations]]). Hand-written decorators in application code are most often small utilities: logging, timing, memoisation, binding, and access checks.

## Trade-offs and alternatives

Decorators make declarative code concise and keep cross-cutting logic in one place. In exchange, they hide behaviour behind a one-word annotation, depend on definition-time side effects, are limited to classes (you cannot decorate a plain function or object literal), and come in two incompatible modes. Alternatives are often simpler: a higher-order function wrapping a plain function (`const add = logged(rawAdd)`), explicit registration calls, or composition. Use decorators where a framework expects them or where the same wrapper genuinely applies to many class members.

## Common mistakes

- **Mixing modes.** Turning on `experimentalDecorators` for one library breaks decorators written for the standard, and the reverse. Pick one per project.
- **Losing the method's types.** A wrapper typed `(...args: any[]) => any` erases the signature. Use the generic `This`/`Args`/`Return` pattern.
- **Calling `target(...args)` instead of `target.call(this, ...args)`.** The original method then runs without its instance.
- **Expecting a field decorator to intercept assignments.** It only sees the initial value; use an `accessor` field.
- **Assuming decorators change types.** Returned replacements are invisible to the type checker.
- **`emitDecoratorMetadata` without `reflect-metadata`.** The metadata is silently dropped; frameworks then fail to inject dependencies. Import the polyfill once at the entry point.

> [!MISTAKE] Bundler and compiler disagree
> If your bundler or test runner transpiles TypeScript itself, it must use the same decorator mode as `tsc`. A mismatch shows up as decorators receiving unexpected arguments at runtime even though type checking passed.

## Interview perspective

> [!INTERVIEW] What a strong answer sounds like
> "A decorator is a function applied to a class or member when the class is defined; in the standard version it gets the value and a context object and can return a replacement or add initializers. TypeScript 5 implements the Stage 3 standard, but Angular and NestJS still use `experimentalDecorators` with `emitDecoratorMetadata`, which records constructor parameter types so the DI container can inject them. You can't mix the two modes."

Questions to be ready for:

- **When does a decorator run?** Once, at class definition; replacements and initializers then run per call or per instance.
- **What order do multiple decorators apply in?** Expressions evaluate top to bottom; decorators on one element apply bottom-up; class decorators last.
- **How does NestJS know what to inject?** `emitDecoratorMetadata` emits `design:paramtypes`, read via `reflect-metadata`.
- **Follow-up: "Why can't the DI container inject an interface?"** Interfaces do not exist at runtime; metadata records `Object`, so an explicit token is needed.

```quiz
Q: Given `@first @second method() {}`, in which order are the decorators applied?
- [ ] `first`, then `second`
- [x] `second`, then `first`, so the result is `first(second(method))`
- [ ] Both at the same time
- [ ] It depends on whether they are factories
> Decorator expressions are evaluated top to bottom, but application is bottom-up: the decorator nearest the member wraps it first. Factories only add an evaluation step; they do not change the application order.

Q: A standard field decorator wants to reject negative values assigned to `price` at any time. Why can't it do that, and what should be used?
- [ ] Field decorators are not allowed in standard mode; use `experimentalDecorators`
- [x] A field decorator only sees and can replace the initial value; use an `accessor` field with an accessor decorator that replaces the setter
- [ ] It can, by returning a setter function
- [ ] Use a class decorator that freezes the object
> A field is a plain data property, so later assignments bypass any decorator. `accessor price = 0` creates a getter/setter pair that an accessor decorator can replace, intercepting every write.

Q: Why does `emitDecoratorMetadata` make dependency injection possible in NestJS?
- [ ] It makes TypeScript generate a DI container
- [ ] It keeps interfaces at runtime
- [x] It emits the constructor's parameter types as runtime references (`design:paramtypes`), which the container reads through `reflect-metadata`
- [ ] It works with standard decorators to record the `context` object
> The emitted metadata lists actual class references such as `Logger`, so the container knows what to construct. Interfaces are erased and recorded as `Object`, and the option only works with `experimentalDecorators`.
```

## Practice

1. Write a generic `@memoize` method decorator that caches results by the first argument, and confirm that the decorated method keeps its parameter types.
2. Write a `@timed(label)` factory that logs how long a method takes, including for async methods (await the result before measuring).
3. Predict the output of a class with a class decorator, two decorated methods and a decorated field, then run it to check the order.
4. Convert the legacy `logged` decorator in this lesson to a standard one, and note each signature change.

## Quick revision {#quick-revision}

- Decorator = function applied with `@expr` to a class or member at class-definition time. Classes only.
- Standard (TS 5.0+, Stage 3): `(value, context)`; `context.kind`, `name`, `static`, `private`, `access`, `addInitializer`, `metadata`. Return a replacement or nothing.
- Types: `ClassMethodDecoratorContext`, `ClassFieldDecoratorContext`, `ClassAccessorDecoratorContext` (+ `Target`/`Result`), `ClassDecoratorContext`. Generic `This`/`Args`/`Return` keeps signatures.
- Field decorators get `undefined`, may return an initializer `(initial) => newValue`. Use `accessor` fields to intercept get/set.
- `addInitializer`: per-instance code for members (e.g. binding), post-definition code for classes.
- Order: expressions top-down; per element bottom-up; members before class; methods before fields.
- Decorators never change the declared type.
- Legacy `experimentalDecorators`: `(proto, key, descriptor)`, parameter decorators, `emitDecoratorMetadata` → `design:type`/`paramtypes`/`returntype` via `reflect-metadata`. Used by NestJS, Angular, TypeORM.
- Modes cannot be mixed (TS1241, TS1206). Engines (e.g. Node.js 22) do not run decorators natively; TypeScript emits `__esDecorate`/`__runInitializers` or `__decorate`.

## Key takeaways {#key-takeaways}

- Decorators package cross-cutting class behaviour into reusable functions that run once, when the class is defined.
- Standard decorators receive a value and a context and can replace members or register per-instance initializers; type them generically to keep signatures intact.
- Use `accessor` fields when you need to intercept reads and writes; field decorators only see the initial value.
- Legacy `experimentalDecorators` remain essential for NestJS, Angular and TypeORM, especially for parameter decorators and metadata-based injection.
- Choose one decorator mode per project and keep every tool that transpiles your code on the same mode.
