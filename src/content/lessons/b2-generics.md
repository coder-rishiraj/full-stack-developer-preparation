---
summary: Generics let one function, interface, type alias or class work with many types while keeping the link between what goes in and what comes out. You will learn how type parameters are declared and inferred, why they beat `any` and `unknown` for reusable code, how generic classes and default type parameters work, and why none of it exists at runtime.
difficulty: intermediate
minutes: 55
objectives:
  - Explain the problem generics solve and why `any` and `unknown` are worse answers to it
  - Write generic functions, interfaces, type aliases and classes with one or more type parameters
  - Trace how the compiler infers a type argument, including literal types and conflicting candidates
  - Design generic classes, and explain why static members cannot use the class's type parameter
  - Use default type parameters correctly, including their ordering rules and how they interact with inference
  - Explain type erasure and why generic code cannot check `T` at runtime
---

## Introduction

Suppose you want a small helper that returns the first element of an array. In plain JavaScript it is one line, and it works for arrays of anything. In TypeScript the question is what type to write for it.

```typescript title="first-attempts.ts"
function firstNumber(items: number[]): number | undefined {
  return items[0];
}

function firstAny(items: any[]): any {
  return items[0];
}

const n = firstNumber([10, 20]);   // number | undefined — correct, but numbers only
const s = firstAny(["a", "b"]);    // any — the compiler has forgotten it was a string
s.toFixed(2);                      // compiles, then crashes at runtime
```

The first version is precise but useless for strings, users or anything else; you would need a copy per type. The second version accepts every array, but its return type is `any`, so the compiler stops checking whatever you do with the result. `s` is really a string, `toFixed` does not exist on strings, and the call throws `TypeError: s.toFixed is not a function` when the code runs.

What you actually want to say is: *"whatever type the array holds, the result has that same type."* That sentence describes a **relationship** between the input type and the output type, and neither version can express it. **Generics** are the TypeScript feature for exactly that. A generic function declares a **type parameter** — a placeholder name for a type — and uses it to connect its parameters and its return type:

```typescript title="first.ts"
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([10, 20]);      // n: number | undefined
const s = first(["a", "b"]);    // s: string | undefined
```

One implementation, full type safety for every element type. You use generics every day already: `Array<T>`, `Promise<T>`, `Map<K, V>`, `Set<T>` and React's `useState<S>` are all generic. This lesson explains how they work so you can read their signatures confidently and write your own. The next lesson, [[b2-generic-constraints]], covers how to require that a type parameter has certain properties, and [[b2-utility-types]] shows the built-in generic types that transform other types.

## Before you start

You should be comfortable with:

- **Typing functions** — parameter and return type annotations. See [[b2-typed-functions]].
- **Type inference** — how the compiler works out a type from a value without an annotation. See [[b2-type-inference]].
- **Interfaces and type aliases** — naming object shapes and other types. See [[b2-interfaces]] and [[b2-type-aliases]].
- **`any` and `unknown`** — what each one turns off or forces. See [[b2-special-types]] and [[b2-unknown]].
- **Classes in TypeScript** — needed for the generic classes section. See [[b2-classes-ts]].

## The intuition: parameters for types

You already know how ordinary parameters work. A function like `double(x)` does not know which number it will receive; `x` is a name for "whatever value the caller passes". The caller fills it in: `double(4)`.

A type parameter is the same idea one level up. In `first<T>(items: T[])`, the angle brackets declare `T` as a name for "whatever type the caller uses". The caller fills it in too — either explicitly, `first<string>(...)`, or, far more often, implicitly, by passing an argument from which the compiler can work it out.

| | Value parameter | Type parameter |
|---|---|---|
| Declared in | `( … )` | `< … >` |
| Example | `x` in `double(x: number)` | `T` in `first<T>(items: T[])` |
| Filled in by | an argument value: `double(4)` | a type argument: `first<string>(…)`, or inference |
| Exists when | the program runs | only while the compiler checks the code |

The last row is where the analogy stops. Value parameters exist at runtime. Type parameters do not: after compilation, every trace of `T` is gone. That fact, called **type erasure**, shapes what generic code can and cannot do, and it is covered in detail below.

A useful way to read any generic signature is to say it out loud with "for every type T": *"for every type `T`, `first` takes an array of `T` and returns a `T` or `undefined`."* The phrase "for every" is a promise: the implementation must be correct whatever `T` turns out to be. That promise is what makes generic code trustworthy, and it is also why you cannot do much with a bare `T` inside the function, as you will see.

## Writing and calling generic functions

### Declaring type parameters

A function declaration puts its type parameters between the name and the parameter list. An arrow function puts them before the parameter list:

```typescript title="declare.ts"
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrapArrow = <T>(value: T): { value: T } => ({ value });

console.log(wrap(42), wrapArrow("hi"));
```

```output
{ value: 42 } { value: 'hi' }
```

The name `T` is a convention, not a keyword. Single capital letters are traditional for short, obvious roles: `T` for "type", `K` and `V` for key and value, `E` for error, `R` for result. When a signature has several parameters with less obvious roles, descriptive names such as `TItem` and `TKey` read better. Whatever you choose, the name is local to the declaration, exactly like a parameter name.

> [!NOTE] Generic arrows in `.tsx` files
> In a `.tsx` file, `<T>(value: T) => …` is ambiguous, because `<T>` looks like the start of a JSX element. Write `<T,>(value: T) => …` (the trailing comma tells the parser it is a type parameter list) or use a function declaration. See [[b2-ts-vs-tsx]].

### Inference and explicit type arguments

There are two ways to supply `T`. You can write it yourself, as a **type argument** in angle brackets at the call site, or you can let the compiler **infer** it from the arguments:

```typescript title="explicit-vs-inferred.ts"
function wrap<T>(value: T): { value: T } {
  return { value };
}

const a = wrap<string>("hello");   // T is string because you said so
const b = wrap("hello");           // T is inferred from the argument
const c = wrap<number>("hello");   // error: the argument contradicts the type argument
```

```output
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Inference is the normal case. Most calls to generic functions in real code have no angle brackets at all — you call `items.map(x => x.id)` without writing `map<string>`. Explicit type arguments are for situations where there is nothing to infer from (a function whose `T` appears only in the return type), or where inference picks something narrower or wider than you want.

### Multiple type parameters

A function can declare as many type parameters as it needs, separated by commas. Each one captures a different independent type:

```typescript title="pair.ts"
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair(1, "one");          // p: [number, string]
console.log(p);
```

```output
[ 1, 'one' ]
```

One rule surprises people: explicit type arguments are **all or nothing**. If you write any of them, you must write all of the ones that have no default, because TypeScript does not infer the remaining ones.

```typescript title="all-or-nothing.ts"
const q = pair<string>("a", 1);
```

```output
error TS2558: Expected 2 type arguments, but got 1.
```

Default type parameters, covered later in this lesson, relax this rule for parameters that have one.

## How the compiler infers a type argument

Inference is not magic, and knowing roughly how it works explains most of the confusing results you will meet. When you call a generic function without type arguments, the compiler:

1. Compares each argument's type with the corresponding parameter type, looking for places where `T` appears. Each match produces a **candidate** for `T`. Passing `["a", "b"]` to `items: T[]` produces the candidate `string`.
2. Combines the candidates into one type for `T`.
3. Substitutes that type for `T` everywhere in the signature — this is called **instantiating** the signature — and then checks the call against the result as if the function had been written for that type.

### Literal types and widening

Step 2 has a detail that shows up constantly. A literal argument such as `42` has the literal type `42`. Whether `T` keeps that literal or widens it to `number` depends on context:

```typescript title="literals.ts"
function identity<T>(x: T): T {
  return x;
}

const a = identity(42);   // a: 42
let b = identity(42);     // b: number
let label = "save";
const c = identity(label); // c: string
```

`a` is a `const`, so its declared type can keep the literal `42`. `b` is a `let` that might be reassigned later, so the compiler widens the literal to `number`, exactly as it does for `let b = 42` without any generics ([[b2-literal-types]] explains widening). `c` is `string` because `label` was already declared as `string`; inference only sees the variable's type, not its current value.

If you want a generic function to keep literal types — for example to infer `["a", "b"]` as a readonly tuple of literals rather than `string[]` — TypeScript 5.0 added **`const` type parameters**: `function f<const T>(x: T)`. They make inference behave as if the caller had written `as const` ([[b2-as-const-assertion]]).

### Conflicting candidates

When the same type parameter appears in more than one parameter, every argument contributes a candidate. If the candidates disagree, the compiler does not silently create a union; it picks one candidate and reports the argument that does not fit:

```typescript title="conflict.ts"
function same<T>(a: T, b: T): T[] {
  return [a, b];
}

same(1, 2);                          // fine: T is number
same(1, "x");                        // error
same<number | string>(1, "x");       // fine: you asked for the union explicitly
```

```output
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

This is deliberate. A signature that says "both arguments have the same type `T`" usually means it, and `same(1, "x")` is far more often a bug than a request for `number | string`. If you really want the union, say so with an explicit type argument.

## Generic types: interfaces, aliases and function types

Functions are not the only things that can take type parameters. Interfaces and type aliases can too, and this is how `Array<T>` and `Promise<T>` are defined:

```typescript title="generic-types.ts"
interface ApiResponse<T> {
  data: T;
  status: number;
  receivedAt: Date;
}

type Nullable<T> = T | null;
type Pair<A, B> = [A, B];

interface User {
  id: string;
  name: string;
}

const res: ApiResponse<User[]> = {
  data: [{ id: "u1", name: "Ada" }],
  status: 200,
  receivedAt: new Date(),
};

const maybeName: Nullable<string> = null;
const entry: Pair<string, number> = ["visits", 3];
console.log(res.data[0].name, maybeName, entry);
```

```output
Ada null [ 'visits', 3 ]
```

There is one difference from functions: a generic **type** never infers its type arguments. When you write `ApiResponse<User[]>` you are applying the generic type to a specific argument, the way you call a function with a value. Writing a bare `ApiResponse` where a type is expected is an error ("Generic type 'ApiResponse<T>' requires 1 type argument(s)") unless its parameters have defaults.

Generic types also compose with generic functions. A function that fetches JSON can return `Promise<ApiResponse<T>>`, and after `await` the caller gets `ApiResponse<User[]>` with `data` typed as `User[]` — the type argument flows through each layer.

### Where the type parameter lives in a function type

Function types can be generic in two different ways, and the difference matters:

```typescript title="function-types.ts"
type Mapper<T, U> = (value: T) => U;   // the alias is generic
type Identity = <T>(value: T) => T;    // the function itself is generic

const toLength: Mapper<string, number> = (s) => s.length;
const id: Identity = (x) => x;

console.log(toLength("hello"), id(true), id("still generic"));
```

```output
5 true still generic
```

`Mapper<T, U>` must be given its type arguments when you use the alias, so `toLength` is a plain, non-generic function from `string` to `number`. `Identity` has no type parameters of its own; instead, the function it describes is generic, so `id` can be called with a boolean and then with a string. Choose the first form when one implementation handles one specific pair of types (callbacks, event handlers), and the second when the implementation itself must work for every type.

## Inside a generic function, `T` is opaque

Because a generic function must work "for every type `T`", the compiler only lets you do things with a value of type `T` that are valid for *every* possible type. That is very little: you can store it, return it, pass it on, and compare it with `===`. You cannot read properties from it:

```typescript title="opaque.ts"
function longest<T>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
```

```output
error TS2339: Property 'length' does not exist on type 'T'.
error TS2339: Property 'length' does not exist on type 'T'.
```

The error is correct, not fussy. `longest(10, 20)` would be a legal call, and numbers have no `length`. To use `.length` you must narrow the set of allowed types to those that have it, which is written `<T extends { length: number }>`. That is a **generic constraint**, and it is the whole subject of [[b2-generic-constraints]].

## Generics compared with `any`, `unknown` and unions

It helps to see the alternatives side by side, because each one fails in a different way.

| Approach | Accepts many types? | Caller gets a precise result type? | Checks the implementation? |
|---|---|---|---|
| One function per type | No | Yes | Yes |
| `any` | Yes | No — result is `any`, checking stops | No |
| `unknown` | Yes | No — caller must narrow or cast | Yes |
| Union, e.g. `string \| number` | A fixed list only | Only the whole union | Yes |
| Generic `T` | Yes | Yes — the caller's own type | Yes |

`unknown` is the safe way to accept "anything" when you genuinely do not care what comes back; a logging function that takes `value: unknown` is fine. But a function that returns what it received should not throw away that information, and only a type parameter keeps it. A union is right when there is a small, fixed set of types the function handles differently (for example with [[b2-function-overloading|overloads]]); a generic is right when the function treats every type the same way.

## How it works internally: erasure and instantiation

TypeScript checks generic code and then **erases** it. The compiler removes type parameters, type arguments and annotations, and emits ordinary JavaScript. The `first` function at the top of this lesson compiles to:

```javascript title="first.js (compiled output)"
function first(items) {
    return items[0];
}
const n = first([10, 20]);
const s = first(["a", "b"]);
```

There is one function at runtime, not one per type, and nothing in it knows what `T` was. That has three practical consequences.

**Generics cost nothing at runtime.** No extra code is generated per type argument. The only cost is compile time and, for very complex generic types, slower editor feedback.

**You cannot inspect `T` at runtime.** Code such as `if (typeof value === T)`, `new T()` or `value instanceof T` does not compile, because `T` is not a value. If a generic function needs runtime information about a type, the caller must pass it as an ordinary argument: a constructor (`create<T>(ctor: new () => T)`), a type guard function ([[b2-custom-type-guards]]) or a schema object from a validation library.

**A type argument is a promise, not a check.** This is the most dangerous consequence. Consider a JSON helper:

```typescript title="unsound-parse.ts"
function parseAs<T>(json: string): T {
  return JSON.parse(json);       // JSON.parse returns any, so this compiles
}

interface Settings {
  theme: string;
}

const settings = parseAs<Settings>('{"colour":"blue"}');
console.log(settings.theme.toUpperCase());
```

```output
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

The compiler accepted `parseAs<Settings>` because you told it the result was `Settings`. Nothing checked that the JSON actually had a `theme`. A type parameter that appears *only* in the return type is a disguised type assertion ([[b2-type-assertions]]); it moves the risk to the caller without making anything safer. For data from the network, files or `localStorage`, validate at runtime and let the validator produce the type.

Conceptually, the checker handles each generic call by **instantiation**: it substitutes the inferred or explicit type arguments for the type parameters and checks the call against the resulting concrete signature. This is the opposite of how C++ templates work (they generate separate code per type) and is similar to Java's generics, which are also erased — though Java keeps some generic information in class files for reflection, and TypeScript keeps none.

## Generic Classes {#b2-generic-classes}

A **generic class** is a class that declares type parameters after its name, such as `class Stack<T>`. The type parameter can then be used in the types of the class's fields, constructor parameters and methods, so that one class definition produces a correctly typed container, wrapper or service for whatever type each instance holds. `Array<T>`, `Map<K, V>` and `Promise<T>` are the standard examples; in application code the common ones are stores, caches, queues, repositories and result types.

### A first generic class

```typescript title="stack.ts"
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const history = new Stack<string>();
history.push("/home");
history.push("/settings");
console.log(history.pop(), history.size);

const undoLevels = new Stack<number>();
undoLevels.push(3);
// undoLevels.push("3");   // error TS2345: 'string' is not assignable to 'number'
console.log(undoLevels.peek());
```

```output
/settings 1
3
```

Each `new Stack<…>()` fixes `T` for that **instance**. `history` is a `Stack<string>`, so its `push` accepts only strings and its `pop` returns `string | undefined`; `undoLevels` is a `Stack<number>`. The class body was written once, and it never needed to know which type it would hold — it only stores and returns values of type `T`, which is valid for every `T`.

### Supplying the type argument

Like generic functions, generic classes can infer their type arguments, but only from the **constructor's** arguments:

```typescript title="box.ts"
class Box<T> {
  constructor(public value: T) {}

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

const price = new Box(19.99);                  // Box<number>, inferred from 19.99
const label = price.map((p) => `$${p.toFixed(2)}`); // Box<string>
console.log(label.value);
```

```output
$19.99
```

`public value: T` is a parameter property ([[b2-parameter-properties]]), so the constructor argument both sets the field and gives the compiler something to infer `T` from. The `map` method shows that a method can declare **its own** type parameter (`U`) in addition to the class's `T`. `T` is fixed when the instance is created; `U` is chosen fresh on each call to `map`.

The `Stack` constructor takes no arguments, so there is nothing to infer from. In that case TypeScript does not report an error; it quietly picks `unknown`:

```typescript title="unknown-stack.ts"
const s = new Stack();   // s: Stack<unknown>
s.push(1);
s.push("two");           // accepted — anything is assignable to unknown
const top = s.pop();     // top: unknown — useless without narrowing
```

This is one of the most common generic-class bugs: the code compiles, but the container has no useful type. Always pass the type argument when the constructor cannot infer it — `new Stack<string>()` — or give the parameter a default (see the next section).

### Static members cannot use the class's type parameter

A class's type parameter belongs to its **instances**. Static members belong to the class itself, and there is only one class object at runtime no matter how many different `T`s its instances use. A static field typed `T` would have to be a `string` for `Stack<string>` and a `number` for `Stack<number>` at the same time, which is impossible, so the compiler forbids it:

```typescript title="static-error.ts"
class Registry<T> {
  static defaultItem: T;   // error
}
```

```output
error TS2302: Static members cannot reference class type parameters.
```

When a static method needs a type parameter — typically a factory — it declares its own:

```typescript title="result.ts"
class Result<T, E = Error> {
  private constructor(
    readonly ok: boolean,
    readonly value?: T,
    readonly error?: E,
  ) {}

  static success<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  static failure<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }
}

const ok = Result.success(42);                 // Result<number, never>
const bad = Result.failure(new Error("timeout")); // Result<never, Error>
console.log(ok.value, bad.error?.message);
```

```output
42 timeout
```

The `T` in `static success<T>` is a new type parameter that happens to share the name of the class's `T`; it shadows it. Using `never` for the unused side says "a success has no error type, a failure has no value type", which lets both be assigned to a wider `Result<number, Error>` later. The `E = Error` in the class header is a default type parameter, explained in the next section.

### Inheritance and interfaces

When a class extends a generic class, it either **fixes** the type argument or **passes its own type parameter through**:

```typescript title="extends.ts"
class Box<T> {
  constructor(public value: T) {}
}

class StringBox extends Box<string> {      // fixes T to string
  shout(): string {
    return this.value.toUpperCase();       // value is known to be a string
  }
}

class TimestampedBox<T> extends Box<T> {   // stays generic
  readonly createdAt = new Date(0);
}

console.log(new StringBox("hi").shout(), new TimestampedBox(7).value);
```

```output
HI 7
```

A generic class can also implement a generic interface, which is how you separate a contract from an implementation:

```typescript title="repository.ts"
interface Repository<T> {
  get(id: string): T | undefined;
  save(id: string, entity: T): void;
}

class InMemoryRepository<T> implements Repository<T> {
  private rows = new Map<string, T>();

  get(id: string): T | undefined {
    return this.rows.get(id);
  }

  save(id: string, entity: T): void {
    this.rows.set(id, entity);
  }
}

const users = new InMemoryRepository<{ name: string }>();
users.save("u1", { name: "Ada" });
console.log(users.get("u1")?.name, users.get("u2"));
```

```output
Ada undefined
```

Code that depends on `Repository<User>` can now be handed an in-memory version in tests and a database-backed version in production. A real repository usually needs to read an `id` from the entity itself, which requires `T extends { id: string }` — see [[b2-generic-constraints]].

### What remains at runtime

Generic classes are erased like everything else. `Stack<string>` and `Stack<number>` are the same JavaScript class, so `history instanceof Stack` is `true` but there is no way to ask "is this a `Stack<string>`?". If a class needs to behave differently by element type, that difference must come from a value passed to the constructor — a comparator, a serializer, a validator — not from `T`.

> [!TIP] Generic React components
> React function components are generic functions, not classes: `function List<T>(props: { items: T[]; render: (item: T) => ReactNode })`. The caller writes `<List items={users} render={(u) => u.name} />` and `T` is inferred from `items`, so `render` receives a typed `u`. See [[b2-react-component-props]].

## Default Type Parameters {#b2-default-type-parameters}

A **default type parameter** is a fallback type written with `=` in a type parameter list, such as `interface ApiError<TDetails = unknown>`. When a use of the generic leaves that type argument out, the default is used instead. Defaults exist so that the simple case needs no type arguments at all while advanced callers can still specialise — the same reason ordinary functions have default parameter values.

### Syntax and the simple case

```typescript title="defaults.ts"
interface ApiError<TDetails = unknown> {
  message: string;
  details: TDetails;
}

const generic: ApiError = { message: "Server error", details: null };

const validation: ApiError<{ field: string }[]> = {
  message: "Invalid input",
  details: [{ field: "email" }],
};

console.log(generic.message, validation.details[0].field);
```

```output
Server error email
```

Without the default, the bare `ApiError` annotation would be an error, because a generic type must be given its type arguments. With it, `ApiError` means `ApiError<unknown>`. The caller that has structured details writes `ApiError<{ field: string }[]>` and gets a precise `details` type.

Choose `unknown` rather than `any` as a "could be anything" default. `unknown` forces code that reads `details` to check it first; `any` would silently switch off checking for every caller who did not think about the parameter ([[b2-avoiding-any]]).

### The rules

Three rules govern defaults, and the compiler enforces all of them at the declaration:

1. **Defaulted parameters come after required ones.** Once a parameter has a default, every parameter after it must have one too, because type arguments are matched by position. `type Bad<T = string, U> = …` reports *error TS2706: Required type parameters may not follow optional type parameters.*
2. **A default must satisfy the parameter's constraint.** `type Id<T extends number = string> = T` reports *error TS2344: Type 'string' does not satisfy the constraint 'number'.*
3. **A default may refer to earlier type parameters**, but not later ones. `interface Page<T, TItems = T[]>` is valid; the default for `TItems` is computed from whatever `T` is.

### Defaults and inference

For generic **functions** and **constructors**, defaults interact with inference, and the order of precedence is easy to get wrong:

1. If you pass type arguments explicitly, they win.
2. Otherwise, if the compiler can infer a type parameter from the arguments, the inferred type wins over the default.
3. Only if there is nothing to infer from does the default apply. Without a default, the compiler falls back to the parameter's constraint, which is `unknown` for an unconstrained parameter.

```typescript title="default-vs-inference.ts"
function makeList<T = string>(...items: T[]): T[] {
  return items;
}

const a = makeList(1, 2);     // T inferred as number — the default is ignored
const b = makeList();         // nothing to infer from — T is the default, string
b.push("ok");

class Queue<T = string> {
  private items: T[] = [];
  add(item: T) { this.items.push(item); }
}

const q = new Queue();        // Queue<string> rather than Queue<unknown>
console.log(a, b);
```

```output
[ 1, 2 ] [ 'ok' ]
```

`new Queue()` is the case from the generic classes section — a constructor with nothing to infer from — and the default replaces the unhelpful `unknown`.

There is one trap when explicit type arguments meet defaults. Because explicit arguments are all or nothing, providing *some* of them means the rest take their **defaults**; they are not inferred from the arguments:

```typescript title="partial-explicit.ts"
function tagged<T, TTag = string>(value: T, tag: TTag): [T, TTag] {
  return [value, tag];
}

tagged(1, 2);           // fine: T = number, TTag = number (both inferred)
tagged<number>(1, 2);   // error: TTag is the default, string, not inferred
```

```output
error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
```

### Where you meet defaults

Library types use defaults heavily, because their authors cannot know what every caller needs. React's type definitions declare class components as `Component<P = {}, S = {}>` so that a component with no props or state can extend plain `Component`, and declare the no-argument form of `useState` with a default so that `useState()` returns a value typed `undefined` until you provide a type argument. In your own code, defaults are most useful for result and error types (`Result<T, E = Error>`), for optional metadata (`ApiError<TDetails = unknown>`), and for containers created empty (`Queue<T = string>` when one element type is overwhelmingly common).

A default is part of a public API: changing it changes the meaning of every use that omitted the argument. Document what the default means, and treat changing it as a breaking change.

## Worked example: a typed `groupBy`

Grouping a list by some key is a common task in UI code — orders by status, messages by day, products by category. A generic version shows several ideas at once: two type parameters, a callback whose types come from the generic signature, and a result type built with a generic built-in.

```typescript title="group-by.ts"
function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = keyOf(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

interface Order {
  id: number;
  status: "pending" | "shipped" | "cancelled";
  total: number;
}

const orders: Order[] = [
  { id: 1, status: "pending", total: 30 },
  { id: 2, status: "shipped", total: 12 },
  { id: 3, status: "pending", total: 55 },
];

const byStatus = groupBy(orders, (o) => o.status);
// byStatus: Partial<Record<"pending" | "shipped" | "cancelled", Order[]>>

console.log(byStatus.pending?.map((o) => o.id));
console.log(byStatus.cancelled);
```

```output
[ 1, 3 ]
undefined
```

Walk through what the compiler does with `groupBy(orders, (o) => o.status)`:

1. `orders` is `Order[]` and the parameter is `readonly T[]`, so the first candidate is `T = Order`. (Accepting `readonly T[]` means callers can pass both mutable and readonly arrays; see [[b2-readonly-arrays]].)
2. The callback is **contextually typed** from `(item: T) => K` with `T` already known, so `o` is an `Order` without any annotation.
3. The callback returns `o.status`, whose type is the union `"pending" | "shipped" | "cancelled"`. That becomes `K`. The constraint `K extends PropertyKey` (that is, `string | number | symbol`) is what allows `K` to be used as an object key; constraints are the topic of the next lesson.
4. The return type `Partial<Record<K, T[]>>` becomes an object whose keys are the three statuses and whose values are `Order[]`, each optional — because a status with no orders produces no group, as `byStatus.cancelled` shows. [[b2-record-utility|Record]] and [[b2-partial|Partial]] are built-in utility types covered in [[b2-utility-types]].

The payoff is at the call site: `byStatus.pending` autocompletes, `byStatus.delivered` is a compile error, and the compiler reminds you that any group might be missing. A non-generic version typed with `any` would have offered none of that.

## In real systems

Generics are the backbone of typed library code, and most of the time you consume them rather than write them.

- **Collections and async values.** `Array<T>`, `ReadonlyArray<T>`, `Map<K, V>`, `Set<T>` and `Promise<T>` carry element types through every method. `await` on a `Promise<User>` gives a `User` because `Promise` is generic.
- **React.** `useState<User | null>(null)` is the standard case for an explicit type argument: the initial value `null` alone would infer the useless type `null`. `useRef<HTMLInputElement>(null)`, `createContext<Theme>(…)` and generic components follow the same pattern. See [[b2-hooks-typing]].
- **API clients.** A `request<T>(path, schema)` function that validates the response with a schema and returns `Promise<T>` gives every endpoint a typed result while keeping runtime validation; see [[b2-type-safe-apis]].
- **Data access.** `Repository<T>`, `Cache<K, V>`, `EventEmitter<Events>` and `Result<T, E>` are common generic classes and interfaces in backend and frontend code alike.
- **Validation libraries.** Schema libraries define a schema value once and derive the static type from it with a generic helper, so the runtime check and the compile-time type cannot drift apart.

## Trade-offs and alternatives

Generics give you reuse without losing type information, and they have no runtime cost. Their costs are on the human side. Signatures with several type parameters and constraints become hard to read, and error messages for generic code can run to many lines because they print fully instantiated types. Over-generic APIs — functions with four type parameters to cover cases no caller needs — are harder to use correctly than two plain functions.

Prefer the simpler alternative when it fits:

- **A concrete type** when there is only one type in practice. Generalise when a second real use appears, not before.
- **A union or overloads** when a function handles a small fixed set of types *differently*. Generics are for code that treats every type the same way.
- **`unknown`** when the function genuinely does not care about the type and returns nothing derived from it.

A practical rule of thumb: **a type parameter should appear at least twice** in a signature — for example once in a parameter and once in the return type, or in two parameters. A type parameter used only once relates nothing to anything; `function log<T>(value: T): void` is just `function log(value: unknown): void` written in a more complicated way. And a type parameter used only in the return type is the unsound cast shown in `parseAs`.

## Common mistakes

> [!MISTAKE] Treating a type argument as runtime validation
> `fetchJson<User>(url)` does not check that the response is a `User`. The type argument is a claim the compiler believes. Validate external data at runtime (a type guard or schema) and derive the type from the validator.

**Explicit `<any>` on a generic call.** Writing `useState<any>([])` or `parse<any>(text)` turns off checking for everything that touches the result, and `any` spreads into every value derived from it. Use the real type, or `unknown` and narrow.

**Creating an empty container without a type argument.** `new Map()`, `new Set()` and your own `new Stack()` with no constructor arguments infer from nothing. Built-in `Map` and `Set` fall back to `Map<any, any>` and `Set<unknown>` respectively in current lib typings, and your own classes fall back to `unknown`. Write `new Map<string, User>()`.

**Reading properties of an unconstrained `T`.** The error "Property 'x' does not exist on type 'T'" means the function promised to work for every `T`, including types without `x`. Add a constraint ([[b2-generic-constraints]]) rather than casting.

**Expecting `T` to exist at runtime.** `new T()`, `typeof x === T` and `instanceof T` cannot compile. Pass a constructor, a type guard or a schema as a normal argument.

**Using the class's `T` in a static member.** Give the static method its own type parameter, as in `Result.success<T>`.

**Adding type parameters that relate nothing.** If `T` appears only once, replace it with its constraint or `unknown`; the signature becomes easier to read and no less safe.

## Interview perspective

Interviewers use generics to check whether you understand that types describe relationships, not just individual values. The most common opener is "why not just use `any`?" A strong answer names the relationship: "With `any`, the caller loses the type of the result and nothing is checked. A type parameter ties the output type to the input type, so `first(users)` returns a `User` and misuse is caught at compile time. `unknown` is safe but forces the caller to narrow."

> [!INTERVIEW] "Do generics exist at runtime?"
> No. TypeScript erases type parameters and type arguments, so `Stack<string>` and `Stack<number>` are one JavaScript class and `new T()` is impossible. Mention the consequence: a type argument on something like `fetchJson<User>()` is an unchecked assertion, so external data still needs runtime validation.

Other questions to prepare:

- **How does inference choose `T`?** It collects candidates from arguments where `T` appears, combines them, and checks the call against the instantiated signature. Conflicting candidates are reported rather than merged into a union.
- **When do you write type arguments explicitly?** When there is nothing to infer from (`useState<User | null>(null)`, `new Map<string, number>()`), or when inference picks a narrower or wider type than intended.
- **Why can't a static member use the class's type parameter?** There is one class object shared by all instantiations; the type parameter belongs to instances.
- **What does a default type parameter do, and where must it go?** It applies when the argument is omitted and nothing can be inferred; defaulted parameters must follow required ones and must satisfy the constraint.
- **Implement a generic `Stack<T>` or `Result<T, E>`.** Show `private items: T[]`, methods returning `T | undefined`, and static factories with their own type parameters.

A follow-up worth anticipating: *"How is this different from Java generics?"* Both are checked at compile time and erased, but TypeScript is structural ([[b2-structural-typing]]), infers type arguments far more aggressively, and supports literal and union types as type arguments.

## Practice

1. **`last` and `zip`.** Write `last<T>(items: readonly T[]): T | undefined` and `zip<A, B>(a: A[], b: B[]): [A, B][]`. Check in your editor that `zip([1, 2], ["a", "b"])` is typed `[number, string][]`.
2. **Spot the useless parameter.** Rewrite `function printAll<T>(items: T[]): void` and `function toJson<T>(value: T): string` without type parameters and explain why nothing was lost.
3. **Typed queue.** Implement `class Queue<T>` with `enqueue`, `dequeue` and `size`, then give it a default so `new Queue()` is `Queue<string>`. Write one line that shows what goes wrong without the default.
4. **Safe JSON.** Change `parseAs<T>(json)` to `parseAs<T>(json: string, isT: (v: unknown) => v is T): T` and make it throw when validation fails. Explain why this version is sound and the original was not.
5. **Result type.** Extend the `Result<T, E>` class with a method `map<U>(fn: (value: T) => U): Result<U, E>`.

```quiz
Q: Why is `function first<T>(items: T[]): T | undefined` better than `function first(items: any[]): any`?
- [ ] The generic version runs faster because the compiler specialises it for each type
- [x] The generic version keeps the relationship between the element type and the result, so callers get a precise type and misuse is caught
- [ ] The `any` version does not compile under `strict`
- [ ] The generic version validates at runtime that every element has type `T`
> A type parameter connects input and output: `first(["a"])` returns `string | undefined`. With `any`, the result is `any` and checking stops. Generics are erased, so there is no specialisation or runtime validation, and `any[]` is perfectly legal under `strict`.
```

```quiz
Q: `class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } }` — what is the type of `s` in `const s = new Stack();`?
- [ ] A compile error: the type argument is required
- [ ] `Stack<any>`
- [x] `Stack<unknown>`
- [ ] `Stack<never>`
> The constructor takes no arguments, so there is nothing to infer `T` from, and with no default the compiler falls back to the constraint of `T`, which is `unknown`. It is not an error, which is why the bug is easy to miss. Pass `new Stack<string>()` or give `T` a default.
```

```quiz
Q: Given `function tagged<T, TTag = string>(value: T, tag: TTag)`, why does `tagged<number>(1, 2)` fail?
- [ ] Explicit type arguments are not allowed when a default exists
- [ ] `T` must always be inferred
- [x] Supplying some type arguments stops inference, so `TTag` takes its default `string` and `2` does not match
- [ ] Defaulted type parameters must come first
> Explicit type arguments are all or nothing: once you write any, the rest are not inferred — they use their defaults. `tagged(1, 2)` with no type arguments works because both are inferred. Defaulted parameters must come *last*, which this signature already does.
```

## Quick revision {#quick-revision}

- A type parameter (`<T>`) is a placeholder for a type, filled by an explicit type argument or by inference.
- Generics express a relationship between types (input → output); `any` loses it, `unknown` forces narrowing, unions cover a fixed list only.
- Inference collects candidates from arguments; conflicting candidates are an error, not an automatic union.
- `const` declarations keep literal types (`identity(42)` → `42`); `let` widens; `<const T>` (TS 5.0) keeps literals like `as const`.
- Explicit type arguments are all or nothing (TS2558); omitted ones take defaults, not inferred types.
- Generic types (interfaces, aliases) never infer; you apply them: `ApiResponse<User>`.
- `type F<T> = (x: T) => T` is a generic alias; `type F = <T>(x: T) => T` is a generic function.
- Inside the body, a bare `T` has no known members; use a constraint to access properties.
- Erasure: no runtime `T`, no per-type code, no `new T()`; a type argument is an unchecked promise.
- Generic classes: `T` fixed per instance, inferred only from constructor arguments, otherwise `unknown`; static members cannot use `T` (TS2302).
- Defaults (`<T = unknown>`): after required parameters (TS2706), must satisfy the constraint (TS2344), may refer to earlier parameters; inference beats the default.
- Rule of thumb: a type parameter should appear at least twice in a signature.

## Key takeaways {#key-takeaways}

- Generics let one implementation serve many types while keeping the link between the types going in and coming out.
- Let inference supply type arguments; write them explicitly only when there is nothing to infer from or inference picks the wrong type.
- A generic implementation must work for every allowed `T`, so it cannot use members of `T` until a constraint guarantees them.
- Generic classes fix their type parameter per instance; static members need their own type parameters.
- Default type parameters make simple uses short, apply only when nothing is inferred, and must come last.
- Generics are erased: they cost nothing at runtime and check nothing at runtime, so external data still needs validation.
