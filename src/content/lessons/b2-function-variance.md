---
summary: Variance answers a precise question — when can a function of one type be used where a function of another type is expected? You will learn why return types are covariant, why parameter types are contravariant under strictFunctionTypes, where TypeScript deliberately stays unsound (methods and mutable arrays), and how variance extends to generic types.
difficulty: advanced
minutes: 40
objectives:
  - Explain covariance, contravariance, bivariance and invariance using concrete subtype examples
  - Predict whether one function type is assignable to another by checking parameters and return types in the right direction
  - Explain what strictFunctionTypes changes and why method-syntax members are still checked bivariantly
  - Demonstrate the unsound cases TypeScript allows (mutable array covariance, method bivariance) and how to avoid the bugs they permit
  - Read and write the in and out variance annotations on generic type parameters
---

## Introduction

Every time you pass a callback, assign a handler or store a function in a typed variable, TypeScript asks one question: is this function's type **assignable** to the expected function type? For plain values the answer is intuitive — a `Dog` can go where an `Animal` is expected. For functions it is not, and the rules point in different directions for inputs and outputs.

Take a slot typed `(value: string | number) => void`. Is a function that accepts only `string` allowed there? It feels as if it should be — `string` is "part of" `string | number`. It is not, and getting this wrong leads to a crash the moment the slot passes a number. Meanwhile a function that accepts `unknown` *is* allowed, even though `unknown` looks "bigger" than what the slot asks for.

**Variance** is the name for how subtyping of a composite type — a function type, an array, a generic `Box<T>` — follows the subtyping of its parts. Understanding it explains a whole family of confusing compiler errors around callbacks and generics, and it explains the few places where TypeScript deliberately lets unsafe code through.

## Before you start

- **Typed functions and function types** — `(a: A) => R`, callbacks, and the rule that fewer parameters are acceptable. See [[b2-typed-functions]].
- **Structural typing and assignability** — a type is assignable to another if it has at least the required members. See [[b2-structural-typing]].
- **Union types** — `string` is a subtype of `string | number`. See [[b2-unions]].
- **Generics** — for the section on generic types. See [[b2-generics]].
- **Compiler options** — `strict` and its member flags. See [[b2-strict-compiler-options]].

Examples use `"strict": true` and TypeScript 6.0; `strictFunctionTypes` exists since TypeScript 2.6 and variance annotations since 4.7.

## The intuition

Think of a function type as a job description for a slot in a system. The slot says: "you will be **given** a parcel of kind P, and you must **hand back** a result of kind R."

- **Handing back** (the return type): if the slot needs any animal back and you hand back a dog, everyone downstream is satisfied. You may promise *more specific* than required. Return types vary in the **same direction** as the slot's requirement.
- **Being given** (the parameter type): if the slot will hand you any animal, you must be able to handle cats too. A worker who handles only dogs would fail on the first cat. A worker who handles *any* living thing is fine. You may accept *more general* than required. Parameter types vary in the **opposite direction**.

That is the whole idea: **outputs may narrow, inputs may widen.** The rest of this lesson makes it precise and shows where TypeScript bends the rule.

## Subtypes: a quick recap

A type `S` is a **subtype** of `T` (written `S <: T`) when every value of `S` is also a valid `T`, so an `S` can be used wherever a `T` is expected. In TypeScript's structural type system:

```typescript title="subtypes.ts"
type Animal = { name: string };
type Dog = { name: string; bark(): string };

const rex: Dog = { name: "Rex", bark: () => "woof" };
const someAnimal: Animal = rex;      // Dog <: Animal: it has every Animal member
const literal: string = "ok";        // "ok" <: string
const wide: string | number = 42;    // number <: string | number

console.log(someAnimal.name, literal, wide);
```

```output
Rex ok 42
```

The question for this lesson is how that relation carries over to composite types. If `Dog <: Animal`, what is the relationship between `() => Dog` and `() => Animal`? Between `(a: Dog) => void` and `(a: Animal) => void`? Between `Dog[]` and `Animal[]`? There are four possible answers, and each has a name:

| Variance | Meaning, for a type constructor `F<T>` | Example in TypeScript |
|---|---|---|
| **Covariant** | `Dog <: Animal` implies `F<Dog> <: F<Animal>` (same direction) | Return types, `readonly` arrays |
| **Contravariant** | `Dog <: Animal` implies `F<Animal> <: F<Dog>` (reversed) | Parameter types under `strictFunctionTypes` |
| **Bivariant** | Assignable in both directions | Method parameters; all parameters without the flag |
| **Invariant** | Assignable in neither direction unless the types are identical | A generic type that both reads and writes `T` |

## Return types are covariant

A function that returns a `Dog` can be used where a function returning an `Animal` is expected, because a dog satisfies anyone expecting an animal:

```typescript title="covariant-returns.ts"
type Animal = { name: string };
type Dog = { name: string; bark(): string };

type MakeAnimal = () => Animal;
type MakeDog = () => Dog;

const makeDog: MakeDog = () => ({ name: "Rex", bark: () => "woof" });
const makeAnimal: MakeAnimal = () => ({ name: "Generic" });

const ok: MakeAnimal = makeDog;
const bad: MakeDog = makeAnimal;

console.log(ok().name);
```

```output
covariant-returns.ts(11,7): error TS2322: Type 'MakeAnimal' is not assignable to type 'MakeDog'.
Rex
```

`ok` is fine: the caller expects an `Animal` and gets a `Dog`, which has a `name`. `bad` is rejected because a caller of `MakeDog` would call `.bark()` on something that has no `bark`. The function types vary **in the same direction** as their return types — covariance.

## Parameter types are contravariant

Now the input side. Here is the example from the introduction, in the direction TypeScript accepts and the direction it rejects:

```typescript title="contravariant-params.ts"
type Handler = (value: string | number) => void;

const handleAnything: (value: unknown) => void = (v) => console.log("got", v);
const handleStringOnly: (value: string) => void = (s) => console.log(s.toUpperCase());

const safe: Handler = handleAnything;
const unsafe: Handler = handleStringOnly;

safe(42);
```

```output
contravariant-params.ts(7,7): error TS2322: Type '(value: string) => void' is not assignable to type 'Handler'.
got 42
```

`Handler` will be called with strings *or* numbers. `handleAnything` accepts every value, so whatever `Handler`'s callers pass is fine. `handleStringOnly` accepts only strings; if the assignment were allowed, `unsafe(42)` would run `(42).toUpperCase()` and throw `TypeError: s.toUpperCase is not a function`.

So for parameters, the relationship is reversed: `string <: string | number`, yet `(value: string | number) => void <: (value: string) => void`, not the other way round. That is **contravariance**. The check that enforces it is the compiler flag `strictFunctionTypes`, which is on whenever `strict` is on.

> [!MISTAKE] Thinking a narrower parameter is "more specific, therefore safer"
> For return values, narrower is safer. For parameters it is the opposite: a function that accepts *less* can be handed something it cannot handle. When checking assignability by hand, flip the direction for every parameter.

A common misstatement is that `(value: string) => void` is assignable to `(value: string | number) => void` "because the parameter accepts a wider domain". That has the direction backwards, as the error above shows: it is the *target* slot that has the wider domain, and the *source* function must accept at least that much.

### Putting both rules together

To decide whether a function type `S` is assignable to a function type `T`, check:

1. **Each parameter of `T` is assignable to the corresponding parameter of `S`** (contravariant: the source must accept everything the target's callers send).
2. **`S`'s return type is assignable to `T`'s return type** (covariant: the source must produce something the target's callers accept).
3. **`S` has no more *required* parameters than `T` supplies** — fewer is fine, since extra arguments are ignored (see [[b2-typed-functions]]).

```mermaid title="Assignability of function types, checked in two directions"
flowchart LR
  subgraph Target["Expected: (a: Dog) => Animal"]
    TP["param: Dog"]
    TR["return: Animal"]
  end
  subgraph Source["Given: (a: Animal) => Dog"]
    SP["param: Animal"]
    SR["return: Dog"]
  end
  TP -- "Dog fits Animal: OK" --> SP
  SR -- "Dog fits Animal: OK" --> TR
```

The arrows show the direction of each check: target parameter into source parameter, source return into target return. `(a: Animal) => Dog` is therefore assignable to `(a: Dog) => Animal` — it accepts more and promises more.

## Bivariance: the flag and the method exception

Before TypeScript 2.6, parameters were checked **bivariantly**: an assignment was accepted if the parameter types were related in *either* direction. That let `handleStringOnly` into a `Handler` slot. It was a pragmatic choice — many real-world patterns relied on it — but it hid genuine bugs, so 2.6 introduced `strictFunctionTypes` to make parameters contravariant.

The flag has a deliberate exception: it applies to **function type** syntax, but not to **method** syntax. Members written as methods in interfaces, object types and classes are still checked bivariantly:

```typescript title="method-bivariance.ts"
interface WithMethod {
  handle(value: string | number): void;
}
interface WithProperty {
  handle: (value: string | number) => void;
}

const stringOnly = {
  handle(value: string) {
    console.log(value.toUpperCase());
  },
};

const a: WithMethod = stringOnly;
const b: WithProperty = stringOnly;

try {
  a.handle(42);
} catch (e) {
  console.log("runtime:", (e as Error).message);
}
```

```output
method-bivariance.ts(15,7): error TS2322: Type '{ handle(value: string): void; }' is not assignable to type 'WithProperty'.
runtime: value.toUpperCase is not a function
```

`WithMethod` and `WithProperty` describe the same runtime shape, yet only the property-syntax version catches the bug. The assignment to `a` compiles and crashes when called with a number.

Why keep this hole? Mainly for **arrays and other built-in generic types**. `Array<T>` declares methods such as `push(...items: T[]): number` and `indexOf(searchElement: T): number`, with `T` in parameter positions. If those parameters were contravariant, `Dog[]` would no longer be assignable to `Animal[]`, and a great deal of everyday code — passing a `Dog[]` to a function that reads `Animal[]` — would stop compiling. Method bivariance keeps that working, at the cost of soundness.

> [!TIP] Choosing syntax on purpose
> In your own interfaces, use property syntax (`handle: (value: T) => void`) for callbacks and handlers so `strictFunctionTypes` protects them. Many teams enforce this with the lint rule `@typescript-eslint/method-signature-style` set to `"property"`.

## The array hole: covariance of mutable arrays

Because of method bivariance, mutable arrays are treated covariantly — `Dog[]` is assignable to `Animal[]`. Reading is safe, but writing is not:

```typescript title="array-covariance.ts"
type Animal = { name: string };
type Dog = Animal & { bark(): string };
type Cat = Animal & { meow(): string };

const dogs: Dog[] = [{ name: "Rex", bark: () => "woof" }];
const animals: Animal[] = dogs;          // allowed: arrays are covariant
const tom: Cat = { name: "Tom", meow: () => "meow" };
animals.push(tom);                       // allowed: a Cat is an Animal

try {
  dogs.forEach((d) => console.log(d.name, d.bark()));
} catch (e) {
  console.log("runtime:", (e as Error).message);
}
```

```output
Rex woof
runtime: d.bark is not a function
```

`animals` and `dogs` are the same array. Pushing a `Cat` through the `Animal[]` view puts a value with no `bark` into what the type system still believes is a `Dog[]`. Java has the same problem with arrays but catches it at runtime with an `ArrayStoreException`; JavaScript has no such check, so the failure surfaces later and somewhere else.

The fix is to say what you mean. A function that only reads should take a **readonly** array:

```typescript title="readonly-param.ts"
type Animal = { name: string };
type Dog = Animal & { bark(): string };

function names(list: readonly Animal[]): string[] {
  return list.map((a) => a.name);
}

const dogs: Dog[] = [{ name: "Rex", bark: () => "woof" }];
console.log(names(dogs));
```

```output
[ 'Rex' ]
```

`readonly Animal[]` has no `push`, so covariance is genuinely safe for it, and passing a `Dog[]` is allowed. A function that needs to add items should be generic over the element type (`function addAll<T>(list: T[], items: T[])`) so the element type cannot be silently widened. See [[b2-readonly-arrays]].

## Variance of generic types

The same reasoning applies to your own generic types. TypeScript works out the variance of each type parameter from **where it appears**:

- Used only in output positions (return types, readonly properties) → **covariant**.
- Used only in input positions (function-type parameters) → **contravariant**.
- Used in both → **invariant**.

```typescript title="generic-variance.ts"
type Animal = { name: string };
type Dog = { name: string; bark(): string };

type Producer<T> = { get: () => T };
type Consumer<T> = { accept: (value: T) => void };
type Box<T> = { get: () => T; set: (value: T) => void };

declare const dogProducer: Producer<Dog>;
declare const animalConsumer: Consumer<Animal>;
declare const dogBox: Box<Dog>;
declare const animalBox: Box<Animal>;

const p: Producer<Animal> = dogProducer;    // covariant: OK
const c: Consumer<Dog> = animalConsumer;    // contravariant: OK
const b1: Box<Animal> = dogBox;             // invariant: error
const b2: Box<Dog> = animalBox;             // invariant: error
```

```output
generic-variance.ts(15,7): error TS2322: Type 'Box<Dog>' is not assignable to type 'Box<Animal>'.
generic-variance.ts(16,7): error TS2322: Type 'Box<Animal>' is not assignable to type 'Box<Dog>'.
```

(The `declare const` lines describe values without creating them, so this snippet is for the type checker only; running it would fail because the variables do not exist.)

`Box<T>` is invariant because both mistakes are possible: a `Box<Dog>` viewed as `Box<Animal>` could be `set` with a cat; a `Box<Animal>` viewed as `Box<Dog>` could `get` a cat where a dog is expected. Had `set` been written with method syntax (`set(value: T): void`), the method-bivariance exception would make `Box` covariant instead — and the first assignment would compile, unsoundly.

Internally, TypeScript **measures** each type parameter's variance once per generic type by checking marker types, then caches the result, so comparing `Box<Dog>` with `Box<Animal>` does not need a full structural comparison every time. For deeply recursive types the measurement can be imprecise or expensive, which is the motivation for the next feature.

### Variance annotations: in and out (TypeScript 4.7+)

You can state a type parameter's variance explicitly with `out` (covariant), `in` (contravariant) or `in out` (invariant). This is allowed on type parameters of type aliases for object or function types, interfaces and classes:

```typescript title="variance-annotations.ts"
interface Source<out T> {
  read(): T;
}
interface Sink<in T> {
  write(value: T): void;
}
interface Wrong<out T> {
  write: (value: T) => void;
}
```

```output
variance-annotations.ts(7,17): error TS2636: Type 'Wrong<sub-T>' is not assignable to type 'Wrong<super-T>' as implied by variance annotation.
```

The annotations are **checked**: `Wrong` claims to be covariant but uses `T` as a parameter of a function-typed property, so the compiler rejects the claim. Their value is documentation and performance — the checker can skip measuring variance — and correctness for complex recursive types where measurement would guess wrongly. The TypeScript team advises using them only when they match the structure and you have a reason (usually performance in large libraries); they cannot make an unsound type sound.

## Where you meet variance in everyday code

**Event handlers.** A React `onChange` prop expecting `(e: React.ChangeEvent<HTMLInputElement>) => void` accepts a handler typed with a *wider* event, such as `(e: React.SyntheticEvent) => void`, because the handler accepts more than it will receive. A handler typed for a *narrower* or different event is rejected.

**Comparators and predicates.** `dogs.sort(compareAnimalsByName)` works if `compareAnimalsByName` takes `(a: Animal, b: Animal) => number`. A comparator for animals can compare dogs. The reverse — an animal list sorted with a dog-only comparator — is caught.

**Generic callbacks.** If a utility must keep the exact parameter type flowing through, make it generic rather than widening: `function on<T>(handler: (value: T) => void)` lets the caller's handler type determine `T`, and each call is checked contravariantly against what will actually be passed.

**Library types.** Types such as `Promise<T>` and `ReadonlyArray<T>` are covariant. `Map<K, V>` and `Set<T>` are mutable and declared with methods, so they are checked bivariantly in their parameters and behave covariantly in practice — with the same push-style hole as arrays.

## Worked example: a plugin registry that cannot be fooled

A registry stores validators for different field types. Each validator must accept every value its slot may pass. This example shows the compiler catching an unsafe validator, and how a generic signature keeps types precise.

```typescript title="validators.ts"
type FieldValue = string | number | boolean;
type Validator<T> = (value: T) => string | null;  // null means valid

const registry: Record<string, Validator<FieldValue>> = {};

function register(name: string, validator: Validator<FieldValue>): void {
  registry[name] = validator;
}

const notEmpty: Validator<unknown> = (v) =>
  v === "" || v === null || v === undefined ? "required" : null;
const maxLength10: Validator<string> = (v) => (v.length > 10 ? "too long" : null);

register("notEmpty", notEmpty);
register("maxLength10", maxLength10);

function validateWith<T>(value: T, validators: Validator<T>[]): string[] {
  return validators.map((v) => v(value)).filter((m): m is string => m !== null);
}

console.log(validateWith("", [notEmpty]));
console.log(validateWith("a very long name", [notEmpty, maxLength10]));
```

```output
validators.ts(15,25): error TS2345: Argument of type 'Validator<string>' is not assignable to parameter of type 'Validator<FieldValue>'.
[ 'required' ]
[ 'too long' ]
```

Step by step:

- `register` accepts `Validator<FieldValue>`: the registry may later call each validator with a string, a number or a boolean.
- `notEmpty` is a `Validator<unknown>`. It accepts *more* than the slot sends, so registering it is safe — contravariance at work.
- `maxLength10` is a `Validator<string>`. If the registry called it with `5`, `v.length` would be `undefined` and the comparison silently `false` — a bug that returns "valid" for bad input. The compiler stops it at line 15.
- `validateWith<T>` is generic. For a string value, `T` is `string`, so both `notEmpty` (`Validator<unknown>`, which is assignable to `Validator<string>` by contravariance) and `maxLength10` fit, and the call is fully checked.

The fix for the registry is the generic approach: keep validators typed by the field they belong to instead of erasing them into one wide slot. The emitted JavaScript still runs line 15 if you ignore the error, which is why the program prints normally — the problem would surface only when a number reached `maxLength10`.

## In real systems

- **Strict mode in production codebases** turns on `strictFunctionTypes`; disabling it to silence callback errors trades a handful of compile errors for runtime crashes that are hard to trace.
- **Library authors** think about variance when designing public generic types — making container types `readonly` where possible keeps them safely covariant, and some large libraries add `in`/`out` annotations to speed up type checking.
- **Event systems and Redux-style reducers** depend on contravariance to ensure a handler registered for an event union can actually handle every member.
- **Lint rules** such as `method-signature-style` exist specifically because of the method bivariance exception.

## Trade-offs and alternatives

TypeScript's design goal is usefulness, not complete soundness. Strict contravariance everywhere would make arrays invariant and break enormous amounts of reasonable code; full bivariance everywhere would miss real bugs in callbacks. The compromise — contravariant function-type parameters, bivariant methods, covariant mutable arrays — catches the most common callback bugs while keeping familiar patterns compiling.

What that means for you: you can opt into more safety by choice of syntax (property-style function members, `readonly` arrays and properties) and by API design (generics that preserve exact types instead of widening). You cannot make the compiler catch the array-push hole for mutable arrays; only `readonly` and careful design do.

## Common mistakes

**Getting the parameter direction backwards.** Assuming `(x: string) => void` fits a `(x: string | number) => void` slot. It does not: the slot will pass numbers. Flip the direction for parameters.

**Turning off `strictFunctionTypes` to fix errors.** The errors it reports are usually real bugs. Fix the handler's parameter type, or make the API generic.

**Declaring callbacks with method syntax.** `onChange(value: string): void` in an interface is checked bivariantly and lets unsafe handlers through. Use `onChange: (value: string) => void`.

**Passing a mutable `Dog[]` to a function that pushes `Animal`s.** The compiler allows it. Take `readonly` arrays in functions that only read, and use generics in functions that write.

**Adding `in`/`out` annotations to "fix" an error.** Annotations are checked against the structure and cannot change what is sound; a wrong annotation is a compile error, and an annotation that hides intended variance confuses readers.

## Interview perspective

**"Explain covariance and contravariance with function types."** Return types are covariant (a function returning `Dog` fits where one returning `Animal` is needed); parameter types are contravariant (a function accepting `Animal` fits where one accepting `Dog` is needed). Strong candidates explain *why* with a crash scenario rather than reciting the rule.

**"What does `strictFunctionTypes` do, and what does it not cover?"** It makes parameters of function-type syntax contravariant instead of bivariant. It does not apply to method-syntax members, which stay bivariant so that arrays and other built-in generics remain covariant.

**"Are TypeScript arrays sound?"** No: mutable arrays are covariant, so pushing a `Cat` through an `Animal[]` alias of a `Dog[]` compiles. Mention `readonly` arrays as the safe alternative and Java's runtime `ArrayStoreException` as a contrast.

**"What makes a generic type invariant?"** Using the type parameter in both input and output positions, as in a `Box<T>` with `get` and `set` function properties.

**"What are `in` and `out` on type parameters?"** Explicit variance annotations (TypeScript 4.7+), checked against the type's structure, used for documentation and checker performance.

## Practice

1. Without compiling, decide which assignments are allowed: `(a: Animal) => Animal` to `(a: Dog) => Animal`; `(a: Dog) => Dog` to `(a: Animal) => Dog`; `() => "ok"` to `() => string`; `(a: string) => void` to `(a: "x") => void`. Then check with the compiler.
2. Write an interface with a callback in method syntax and the same callback in property syntax. Find an unsafe assignment the first allows and the second rejects.
3. Reproduce the array hole with your own types, then rewrite the receiving function so the compiler prevents it.
4. Define `type Reader<T>`, `type Writer<T>` and `type Channel<T>` and predict the variance of each; confirm by assignment. Then add `in`/`out` annotations and try one wrong annotation.
5. A `useEventHandler(handler: (e: KeyboardEvent) => void)` hook is called with a `(e: Event) => void` handler and with a `(e: MouseEvent) => void` handler. Which compiles, and why?

```quiz
Q: With `strictFunctionTypes` on, which is assignable to `(value: string | number) => void`?
- [ ] `(value: string) => void`
- [ ] `(value: number) => void`
- [x] `(value: unknown) => void`
- [ ] None of them; parameter types must match exactly
> The slot will be called with strings and numbers, so the source must accept at least
> `string | number`. `unknown` accepts everything, so it is safe. The string-only and number-only
> functions would receive values they cannot handle. Exact matching is not required — a wider
> parameter is fine; that is contravariance.
```

```quiz
Q: Why does TypeScript still check method-syntax members bivariantly under `strictFunctionTypes`?
- [ ] Methods cannot have their parameters checked at all
- [x] So that types like `Array<T>`, whose methods take `T` as a parameter, remain covariant and everyday code keeps compiling
- [ ] Because methods are always called with `this` and functions are not
- [ ] It is a bug that will be fixed in a future version
> If method parameters were contravariant, `Dog[]` would not be assignable to `Animal[]` because
> of methods like `push(item: T)`. Keeping methods bivariant preserves that common pattern, at
> the cost of letting some unsafe handlers through — which is why property syntax is recommended
> for callbacks you want checked strictly.
```

```quiz
Q: `type Box<T> = { get: () => T; set: (value: T) => void }`. What is the variance of `T`?
- [ ] Covariant
- [ ] Contravariant
- [ ] Bivariant
- [x] Invariant
> `T` appears in an output position (`get`'s return) and in an input position (`set`'s parameter,
> written with function-type syntax so it is checked contravariantly). Each use rules out one
> direction, so neither `Box<Dog>` nor `Box<Animal>` is assignable to the other.
```

## Quick revision {#quick-revision}

- Variance = how subtyping of `F<T>` follows subtyping of `T`: covariant (same direction), contravariant (reversed), bivariant (both), invariant (neither).
- Function return types: covariant. Function parameter types: contravariant under `strictFunctionTypes` (part of `strict`, since TS 2.6).
- `S` assignable to `T` (functions): each `T` parameter assignable to the `S` parameter; `S` return assignable to `T` return; `S` may have fewer parameters.
- Method syntax (`m(x: T): void`) stays bivariant; property syntax (`m: (x: T) => void`) is strict. Prefer property syntax for callbacks.
- Mutable arrays are covariant and unsound (`Dog[]` → `Animal[]` → push a `Cat`); use `readonly` arrays for read-only parameters.
- Generic parameter variance is measured from usage: output only → covariant, input only → contravariant, both → invariant.
- `out T`, `in T`, `in out T` annotations (TS 4.7+) are checked against structure; for documentation and checker performance.
- Mnemonic: outputs may narrow, inputs may widen.

## Key takeaways {#key-takeaways}

- A function can replace another if it accepts at least as much and returns at most as much: parameters are contravariant, returns covariant.
- `strictFunctionTypes` enforces contravariant parameters for function-type syntax; keep it on, because its errors are usually real bugs.
- TypeScript keeps two deliberate holes — bivariant method parameters and covariant mutable arrays — to stay compatible with everyday JavaScript patterns.
- You control how much safety you get through syntax and API design: property-style callbacks, `readonly` collections and generics that preserve exact types.
- Generic types inherit variance from how they use their type parameters, and `in`/`out` annotations can state it explicitly.
