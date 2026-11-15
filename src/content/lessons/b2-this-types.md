---
summary: TypeScript has several features built around `this` — the polymorphic `this` type that keeps fluent APIs working in subclasses, `this` parameters that declare what a function expects `this` to be, `this`-based type guards, and the utility types that read or set `this`. You will learn what each one checks, why it exists, and how it prevents the classic "lost `this`" bugs.
difficulty: advanced
minutes: 40
objectives:
  - Explain why a method returning the base class type breaks fluent chains in subclasses, and fix it with the polymorphic `this` type
  - Declare and use `this` parameters, and explain why they disappear from the emitted JavaScript
  - Debug "lost this" errors such as TS2684 and TS2683, and choose between `this: void`, arrow-function fields and `bind`
  - Write `this is T` type guards and use `ThisParameterType`, `OmitThisParameter` and `ThisType`
  - Recognise where `this` types cannot be used, such as static members and arrow functions, and the workaround for each
---

## Introduction

`this` is the most context-dependent value in JavaScript. Inside a method it usually means "the object the method was called on", but its value is decided by *how the function is called*, not where it is written. Pass `user.greet` as a callback and, when the callback runs, `this` may be `undefined`. Return `this` from a method and the "type" of the returned object depends on which subclass the object belongs to. Plain type annotations struggle with both situations.

TypeScript answers with a small family of features, all spelled with the keyword `this` in a type position:

| Feature | Looks like | What it does |
|---|---|---|
| Polymorphic `this` type | `where(c: string): this` | "Returns whatever class this object actually is" — fluent chains keep subclass methods |
| `this` parameter | `function f(this: User, x: number)` | Declares what `this` must be when the function is called; erased from output |
| `this`-based type guard | `isFile(): this is FileNode` | Narrows the object a method was called on |
| Utility types | `ThisParameterType<F>`, `OmitThisParameter<F>`, `ThisType<T>` | Read, remove or set the `this` type of functions and object literals |

They show up wherever code chains or passes methods around: query builders in ORMs such as Knex and TypeORM, test-assertion libraries, validation schemas, DOM event handlers (whose `this` is the element), and store libraries that let you write `this.count++` in an object of actions. This lesson builds each feature from the problem it solves.

## Before you start

- **How `this` works in JavaScript** — call-site binding, method extraction, and why arrow functions capture `this` lexically. See [[b1-this]] and [[b1-arrow-functions]].
- **`call`, `apply` and `bind`** — explicitly setting `this`. See [[b1-impl-call-apply-bind]].
- **Classes and inheritance in TypeScript** — subclasses, `override`, `protected`. See [[b2-classes-ts]] and [[b1-class-inheritance]].
- **Typed functions** — function type syntax such as `(x: number) => string`. See [[b2-typed-functions]].
- **Narrowing and type guards** — `x is T` predicates. See [[b2-narrowing]].

## The intuition

Think of the polymorphic `this` type as a blank on a form that is filled in later. When the base class says "`where()` returns `this`", it is not naming a class; it is saying "returns *the same kind of object you called me on*". The blank is filled in at each call site: called on an `AdminQueryBuilder`, the answer is `AdminQueryBuilder`. Writing `QueryBuilder` instead pre-fills the blank with the base class, and the subclass information is lost forever.

A `this` parameter is a different idea: a **precondition**. `function greet(this: User)` means "only call me in a way where `this` is a `User`" — `user.greet()` or `greet.call(user)`. The compiler checks every call against that precondition. Nothing about it exists at runtime; the JavaScript engine never sees the annotation, just as it never sees any other type.

Keep the two apart: the `this` *type* describes what a method **returns or accepts** relative to the receiving object, while a `this` *parameter* describes what the **receiver itself** must be.

## The polymorphic `this` type

### The problem: fluent chains that forget the subclass

A **fluent interface** (also called method chaining) is an API whose methods return the object they were called on, so calls can be strung together: `query.where("a").where("b").build()`. Here is a natural first attempt, annotated with the class name:

```typescript title="fixed-return.ts"
class QueryBuilder {
  protected clauses: string[] = [];
  where(clause: string): QueryBuilder {
    this.clauses.push(clause);
    return this;
  }
}

class AdminQueryBuilder extends QueryBuilder {
  includeDeleted() {
    this.clauses.push("deleted_at IS NOT NULL");
    return this;
  }
}

new AdminQueryBuilder().where("age > 18").includeDeleted();
// error TS2339: Property 'includeDeleted' does not exist on type 'QueryBuilder'.
```

At runtime this code is fine — `where` returns the very same `AdminQueryBuilder` object, which does have `includeDeleted`. The problem is the annotation. `where` promises to return a `QueryBuilder`, so after `.where(...)` the compiler only knows the base class's members. Every subclass method becomes unreachable after the first inherited call. You could override `where` in every subclass just to change its return type, but that defeats the point of inheritance.

### The fix: return `this`

Change the return annotation to the keyword `this`:

```typescript title="query-builder.ts"
class QueryBuilder {
  protected clauses: string[] = [];
  where(clause: string): this {
    this.clauses.push(clause);
    return this;
  }
  build(): string {
    return `SELECT * FROM users WHERE ${this.clauses.join(" AND ")}`;
  }
}

class AdminQueryBuilder extends QueryBuilder {
  includeDeleted(): this {
    this.clauses.push("deleted_at IS NOT NULL");
    return this;
  }
}

const sql = new AdminQueryBuilder()
  .where("age > 18")
  .includeDeleted()
  .where("active")
  .build();
console.log(sql);
```

```output
SELECT * FROM users WHERE age > 18 AND deleted_at IS NOT NULL AND active
```

The **polymorphic `this` type** (added in TypeScript 1.7) is a type that, inside a class or interface, refers to "the type of the object this member was accessed on". When you call `.where()` on an `AdminQueryBuilder`, `this` is resolved to `AdminQueryBuilder`, so the result still has `includeDeleted`. The base class did not need to know any subclass exists.

Interfaces can use it the same way, which is how fluent APIs are usually described in library type definitions:

```typescript title="builder-interface.ts"
interface Builder {
  set(key: string, value: string): this;
  build(): Record<string, string>;
}
```

Any class implementing `Builder` gets back its own type from `set`.

### What you are allowed to return

Inside the class, `this` the type behaves like a **type parameter constrained to the class**: it means "some subtype of `QueryBuilder`, exactly which one we do not know yet". That has a consequence people hit quickly:

```typescript title="new-instance.ts"
class Q {
  where(c: string): this {
    return new Q();
  }
}
// error TS2322: Type 'Q' is not assignable to type 'this'.
//   'Q' is assignable to the constraint of type 'this', but 'this' could be
//   instantiated with a different subtype of constraint 'Q'.
```

The error message explains it precisely. If `where` were called on an `AdminQ`, the return type promises an `AdminQ`, but `new Q()` is only a plain `Q`. The only value guaranteed to have type `this` is `this` itself (or something derived from it). Immutable builders that return a *copy* therefore need a copy that preserves the runtime class:

```typescript title="clone.ts"
let nextId = 1;

class Model {
  id = nextId++;
  // `this` cannot be used as a type in static members, so use a `this` parameter.
  static create<T extends Model>(this: new () => T): T {
    return new this();
  }
  clone(): this {
    // Same prototype as the original, so the copy is the same subclass.
    const copy = Object.create(Object.getPrototypeOf(this));
    return Object.assign(copy, this);
  }
}

class Post extends Model {
  title = "Hello";
}

const post = Post.create();
const copy = post.clone();
console.log(post.title, copy.title, copy instanceof Post, copy !== post);
```

```output
Hello Hello true true
```

`clone` builds an object with the original's prototype, so a cloned `Post` really is a `Post`, and the `this` return type is honest. `Object.create` returns `any`, which is why no assertion is needed; you are taking responsibility for the claim, so keep such code small and well tested.

### Static members cannot use the `this` type

The polymorphic `this` type only exists for **instances**. Writing `static make(): this` fails with:

```text
error TS2526: A 'this' type is available only in a non-static member of a class or interface.
```

The workaround is in `Model.create` above: give the static method a generic `this` *parameter* (the next section explains these) typed as a constructor, `this: new () => T`. Inside a static method `this` is the class it was called on, so `Post.create()` infers `T = Post` and returns a `Post`. This is the standard pattern for factory methods in active-record style ORMs.

## `this` parameters

### Declaring what `this` must be

A **`this` parameter** is a fake first parameter named `this` that declares the type `this` must have inside the function. It was added in TypeScript 2.0 and is only allowed in function declarations, function expressions and methods:

```typescript title="greet.ts"
function greet(this: { name: string }, greeting: string) {
  return `${greeting}, ${this.name}`;
}

const user = { name: "Ada", greet };
console.log(user.greet("Hello"));
console.log(greet.call({ name: "Lin" }, "Hi"));
console.log(greet.length);
```

```output
Hello, Ada
Hi, Lin
1
```

Callers never pass the `this` parameter as an argument; `greet("Hello")` has one argument. The compiler instead checks the call *site*: in `user.greet(...)` the receiver is `user`, which has a `name`, so the call is fine; in `greet.call(obj, ...)` it checks `obj`. Calling `greet("Hello")` on its own would be an error, because nothing provides a `name`.

The last line proves the parameter is erased. The compiled JavaScript is `function greet(greeting) { ... }`, and `greet.length` — the number of declared parameters — is `1`. A `this` parameter has **zero runtime cost** and cannot change what `this` actually is; it only makes the compiler reject calls that would get it wrong.

### `noImplicitThis`: why you need it

Without an annotation, TypeScript cannot know what `this` is inside a standalone function. Under the `noImplicitThis` compiler option — which `strict: true` turns on — it refuses to guess:

```typescript title="implicit.ts"
function fullName() {
  return `${this.first} ${this.last}`;
}
// error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
```

The fix is to declare it: `function fullName(this: { first: string; last: string })`. Inside class methods and object-literal methods the compiler already knows the type of `this` (the class instance or the object literal), so annotations are needed mainly for standalone functions that are meant to be attached to objects or called with `call`/`apply`.

### Catching lost `this` when methods are extracted

The classic runtime bug is taking a method off its object. With a `this` parameter, the compiler catches it:

```typescript title="extract.ts"
interface Cat {
  name: string;
  speak(this: Cat): string;
}
const cat: Cat = { name: "Tom", speak() { return this.name; } };

cat.speak();            // fine: receiver is cat
const speak = cat.speak;
speak();
// error TS2684: The 'this' context of type 'void' is not assignable to method's
//   'this' of type 'Cat'.
```

A plain function call has no receiver, which TypeScript models as `this: void`. `void` is not a `Cat`, so the call is rejected. At runtime, in a module (always strict mode), `this` would be `undefined` and `this.name` would throw.

Note that methods declared in a class do **not** get this protection automatically. In `class Cat { speak() { ... } }`, `const s = cat.speak; s();` compiles, because class methods are not given an implicit `this` parameter. Add `this: Cat` explicitly to methods that are likely to be passed around.

### Callbacks: `this: void`

The same tool works in the other direction. A function that accepts a callback can declare that it will call the callback **without** a receiver, by typing the callback with `this: void`. Then any method that needs its object is rejected at the point it is passed in:

```typescript title="callbacks.ts"
interface UIElement {
  addClickListener(onclick: (this: void, e: string) => void): void;
}
const el: UIElement = { addClickListener(cb) { cb("click"); } };

class Handler {
  info = "handler";
  onClickBad(this: Handler, e: string) { console.log(this.info, e); }
  onClickGood = (e: string) => { console.log(this.info, e); };
}

const h = new Handler();
el.addClickListener(h.onClickGood);
el.addClickListener(h.onClickBad);
// error TS2345: Argument of type '(this: Handler, e: string) => void' is not
//   assignable to parameter of type '(this: void, e: string) => void'.
```

```output
handler click
```

The output shows the good call only. If you compile past the error and run the bad call, it throws `TypeError: Cannot read properties of undefined (reading 'info')` — exactly the bug the error predicted.

`onClickGood` works because it is an **arrow function stored in an instance field**. Arrow functions do not have their own `this`; they capture `this` from where they are created, which in a field initialiser is the instance. The trade-off is that each instance gets its own copy of the function instead of sharing one on the prototype, and subclasses cannot call it with `super`. The alternatives are `h.onClickBad.bind(h)` at the call site, or wrapping it: `(e) => h.onClickBad(e)`.

### Arrow functions cannot declare `this`

Because an arrow function's `this` is fixed lexically, declaring a `this` parameter on one is meaningless, and the compiler says so:

```text
error TS2730: An arrow function cannot have a 'this' parameter.
```

Inside an arrow function, `this` has whatever type it has in the surrounding scope.

### Real APIs that use `this` parameters

The DOM type definitions use `this` parameters heavily. `addEventListener` on an element is declared with a listener of type `(this: HTMLElement, ev: ...) => any` (with the precise element type), because browsers call event listeners with `this` set to the element the listener was attached to. That is why, in a non-arrow handler, `this.classList` is typed correctly. (This lesson's snippets were run in Node, not in a browser; the DOM behaviour is described from the DOM specification and TypeScript's `lib.dom.d.ts`.)

## `this`-based type guards

A method can narrow the object it is called on by returning `this is SomeType`. This is the method form of a user-defined type guard:

```typescript title="fs-nodes.ts"
abstract class FsNode {
  constructor(public name: string) {}
  isFile(): this is FileNode {
    return this instanceof FileNode;
  }
}
class FileNode extends FsNode {
  constructor(name: string, public size: number) { super(name); }
}
class DirNode extends FsNode {
  children: FsNode[] = [];
}

const nodes: FsNode[] = [new FileNode("a.txt", 120), new DirNode("src")];
for (const n of nodes) {
  console.log(n.isFile() ? `${n.name}: ${n.size} bytes` : `${n.name}/`);
}
```

```output
a.txt: 120 bytes
src/
```

In the true branch of `n.isFile() ? ... : ...`, the compiler narrows `n` from `FsNode` to `FileNode`, so `n.size` type-checks. As with any type guard, the compiler trusts your implementation: if `isFile` returned `true` for a directory, the narrowing would be wrong. Here the check is `instanceof`, which is reliable for classes. This pattern is common in tree-shaped data such as abstract syntax trees and UI component trees, where every node shares a base class and code branches on the node kind.

## Utility types for `this`

TypeScript ships three utilities that work with `this`.

**`ThisParameterType<F>`** extracts the `this` parameter type of a function type, or `unknown` if it has none. **`OmitThisParameter<F>`** produces the same function type without its `this` parameter — exactly the type of a function after `bind`:

```typescript title="this-utils.ts"
function greet(this: { name: string }, greeting: string) {
  return `${greeting}, ${this.name}`;
}

type GreetThis = ThisParameterType<typeof greet>;          // { name: string }
const bound: OmitThisParameter<typeof greet> = greet.bind({ name: "Ada" });
const ctx: GreetThis = { name: "Lin" };

console.log(bound("Hello"), greet.call(ctx, "Hi"));
```

```output
Hello, Ada Hi, Lin
```

Library authors use these when writing their own `bind`-like helpers, or when storing functions with a fixed receiver in a typed map.

**`ThisType<T>`** is different: it is a *marker* with no members of its own. Inside an object literal whose contextual type includes `ThisType<T>`, the type of `this` in its methods becomes `T`. It only takes effect when `noImplicitThis` is enabled (it is under `strict`). This is how store libraries let you write `this.count` inside an actions object even though the actions object itself has no `count`:

```typescript title="store.ts"
function defineStore<S extends object, A extends object>(def: {
  state: S;
  actions: A & ThisType<S & A>;
}): S & A {
  return Object.assign({}, def.state, def.actions);
}

const store = defineStore({
  state: { count: 0 },
  actions: {
    inc(by: number) {
      this.count += by; // `this` is { count: number } & typeof actions
      return this.count;
    },
    twice() {
      this.inc(1);
      return this.inc(1);
    },
  },
});

console.log(store.twice(), store.count);
```

```output
2 2
```

Without `ThisType`, `this` inside `inc` would be the actions object literal, which has no `count`, and the code would not compile. `ThisType<S & A>` tells the compiler the truth about how the methods will be called: `defineStore` merges state and actions into one object, so `this` really is state plus actions when `store.twice()` runs. Vue's Options API and Pinia's options-style stores are typed with this technique.

## How it works internally

All of these features are **compile-time only**. The emitted JavaScript has no `this` parameters, no `this` return annotations and no `ThisType`; the engine binds `this` with its usual rules — the receiver for method calls, `undefined` for plain calls in strict code, the explicit value for `call`/`apply`/`bind`, the enclosing scope's value for arrow functions, and the new object for `new`.

The polymorphic `this` type is implemented as an implicit **type parameter** on every class and interface. When you access a member through a value of type `AdminQueryBuilder`, the compiler instantiates that hidden parameter with `AdminQueryBuilder`, then substitutes it wherever `this` appears in the member's type. That is why it is resolved "at the call site" and why, inside the class body, only `this` itself is assignable to it.

A `this` parameter becomes part of the function's type. When the compiler checks a call, it computes the type of the receiver — the object before the dot, the first argument of `call`, or `void` for a bare call — and checks it against the declared `this` type, just as it checks ordinary arguments. When comparing two function types (for example, a method passed as a callback), the `this` types are compared too, which is how `this: void` callbacks reject methods that need an object.

## In real systems

**Query builders and ORMs.** Knex's and TypeORM's query builders chain `where`, `orderBy` and `limit`; their type definitions return the builder type so that chains keep their specific types. Base repository and model classes use `this` return types and generic static `this` parameters so that `User.create()` returns a `User` without each subclass redeclaring the factory.

**Validation and assertion libraries.** Schema builders (`string().min(1).email()`) and assertion chains rely on methods that return the current, more specific builder.

**Event handlers.** DOM listeners are typed with `this` parameters; component code often uses arrow-function fields for handlers specifically so that `this` survives being passed to `addEventListener` or a framework.

**State stores.** `ThisType` powers the "write `this.x` inside an object of methods" style of Vue's Options API and Pinia option stores.

## Trade-offs and alternatives

| Approach | Use when | Watch out for |
|---|---|---|
| `this` return type | Fluent, mutable builders meant to be subclassed | Cannot return a fresh base instance; must return `this` or a same-class copy |
| Generic static `this` parameter | Factories on base classes (`Model.create()`) | Constructor signature in the constraint must match subclasses |
| `this` parameter on functions | Standalone functions attached to objects, or methods likely to be extracted | Class methods do not get it automatically |
| Arrow-function fields | Handlers passed as callbacks | One function per instance; not on the prototype; no `super` |
| `bind` at the call site | One-off callback passing | Creates a new function each time (matters for removing listeners) |
| Plain functions taking the object as an argument | Avoiding `this` entirely | Less discoverable than methods |

Many teams minimise `this` altogether — functional code and React Hooks rarely use it — and that is a perfectly good choice. The features in this lesson matter most when you design class-based APIs or type existing JavaScript that depends on `this`.

## Common mistakes

**Returning the class name instead of `this` from chainable methods.** The chain loses subclass members after the first inherited call (TS2339 on the subclass method). Return `this`.

**Returning a new base instance from a `this`-typed method.** TS2322 "`'this' could be instantiated with a different subtype`". Return `this`, or construct a copy that preserves the runtime class.

**Assuming class methods are protected from extraction.** `const f = obj.method; f()` compiles for ordinary class methods. Declare `this: ClassName` on methods that are handed out, use arrow fields, or bind.

**Thinking a `this` parameter is a real argument.** Callers never pass it, and it does not exist at runtime; `fn.length` does not count it, and it cannot fix a wrong `this` — only report it.

**Writing a `this` parameter on an arrow function** (TS2730) or using the `this` type in a static member (TS2526). Use a regular function, or a generic `this` parameter on the static method.

**Using `ThisType` with `noImplicitThis` off.** The marker is ignored and `this` inside the methods silently becomes `any`, so typos such as `this.cuont` compile. Keep `strict` on.

## Interview perspective

**"How do you type a fluent builder so subclasses can chain their own methods?"** Return `this` instead of the class name. Explain that `this` is resolved at each call site to the receiver's type, and show the TS2339 failure that happens otherwise. A strong follow-up answer covers immutable builders (return a same-class copy) and static factories (generic `this` parameter).

**"What is a `this` parameter, and does it exist at runtime?"** A fake first parameter that types `this`; it is erased in the output, is not passed by callers, and only causes compile-time checks of the receiver at each call.

**"How does TypeScript help with the 'lost this' bug?"** `noImplicitThis` forbids untyped `this`; `this` parameters make bare calls of extracted methods an error (TS2684); callbacks typed `this: void` reject methods that need a receiver. Then mention the runtime fixes: arrow fields, `bind`, wrapper lambdas.

**"What do `ThisType` and `OmitThisParameter` do?"** `ThisType<T>` sets the type of `this` inside object-literal methods (used by store/options APIs); `OmitThisParameter<F>` removes the `this` parameter, giving the type of a bound function.

## Practice

1. Build an `HttpRequestBuilder` with `header()`, `query()` and `build()` methods returning `this`. Subclass it as `AuthedRequestBuilder` with `bearer(token)` and confirm that `new AuthedRequestBuilder().header("a", "1").bearer("t").build()` compiles. Then change one return type to the base class name and read the error.
2. Write an immutable `Money` class whose `add()` returns a new instance typed as `this`. Make it work for a subclass `Usd`.
3. Add a generic static `fromJSON` to a base `Entity` class so that `Invoice.fromJSON({...})` returns an `Invoice`.
4. Given `function onSave(this: Form, e: Event)`, write the type of `onSave.bind(form)` without using `typeof onSave.bind(...)`, using a utility type.
5. Write a tiny `defineComponent({ data, methods })` helper where `methods` can use `this` to read `data` fields and call other methods. Use `ThisType`.

```quiz
Q: A base class method is declared `where(c: string): QueryBuilder` and returns `this`. Why does `new AdminQueryBuilder().where("x").includeDeleted()` fail to compile?
- [ ] `where` returns a new `QueryBuilder` object at runtime
- [x] The declared return type is the base class, so after the call the compiler only knows `QueryBuilder` members
- [ ] Subclass methods cannot be called after inherited methods
- [ ] `includeDeleted` must be marked `override`
> At runtime `where` returns the same `AdminQueryBuilder`, so the program would work. The annotation throws the subclass information away. Declaring the return type as `this` makes the compiler resolve it to the receiver's type at every call.
```

```quiz
Q: What does `function greet(this: User, msg: string)` compile to in JavaScript?
- [ ] `function greet(self, msg)` with `this` passed as the first argument
- [x] `function greet(msg)` — the `this` parameter is erased
- [ ] `function greet(msg)` wrapped in `bind` so `this` is always a `User`
- [ ] It does not compile; `this` is a reserved word
> A `this` parameter exists only for type checking. Callers do not pass it, the emitted function has only `msg`, and nothing at runtime changes how `this` is bound — the compiler simply rejects calls whose receiver is not a `User`.
```

```quiz
Q: A library declares `addClickListener(cb: (this: void, e: Event) => void)`. Why is passing a method declared as `onClick(this: Handler, e: Event)` rejected?
- [ ] Methods can never be used as callbacks
- [ ] `void` callbacks must return `undefined`
- [x] The library promises to call the callback without a receiver, and `void` is not assignable to `Handler`
- [ ] Event handlers must be arrow functions
> `this: void` documents that the callback is invoked as a plain function. A method that needs `this` to be a `Handler` would crash, so the compiler compares the two `this` types and rejects it. An arrow-function field or a bound method is accepted because it does not depend on the call's receiver.
```

## Quick revision {#quick-revision}

- Polymorphic `this` type (TS 1.7): `method(): this` means "returns the type of the receiver"; fluent chains keep subclass members.
- Returning the class name from chainable methods loses subclass members (TS2339 later in the chain).
- Inside the class, `this` type acts like a type parameter constrained to the class: only `this` (or a same-class copy) is assignable to it; `new Base()` is TS2322.
- No `this` type in static members (TS2526); use a generic `this` parameter: `static create<T>(this: new () => T): T`.
- `this` parameter (TS 2.0): fake first parameter `function f(this: T, ...)`; erased from output; not counted in `fn.length`; checked against the receiver at each call.
- `noImplicitThis` (part of `strict`): untyped `this` in a standalone function is TS2683.
- Extracted method with `this: T` called bare: TS2684 (`void` is not `T`). Class methods do not get an implicit `this` parameter.
- Callback typed `this: void` rejects methods needing a receiver; fixes: arrow-function fields, `bind`, wrapper lambdas.
- Arrow functions cannot declare `this` (TS2730); they use the enclosing `this`.
- `isX(): this is X` narrows the receiver.
- `ThisParameterType<F>` reads the `this` type; `OmitThisParameter<F>` removes it (bound function type); `ThisType<T>` sets `this` inside object-literal methods (needs `noImplicitThis`).

## Key takeaways {#key-takeaways}

- The polymorphic `this` type lets a base class describe "returns the same kind of object you called me on", which is what makes subclass-friendly fluent APIs possible.
- `this` parameters are compile-time preconditions on the receiver; they cost nothing at runtime and cannot change how JavaScript binds `this`.
- Most "lost `this`" bugs can be caught at compile time with `strict`, explicit `this` parameters on extractable methods, and `this: void` on callback types.
- Arrow functions take `this` from their surroundings, which is why arrow-function fields are a common fix for handlers and why they cannot declare a `this` parameter.
- `this is T` guards narrow the receiver, and `ThisType`, `ThisParameterType` and `OmitThisParameter` cover object-literal methods and bound functions.
