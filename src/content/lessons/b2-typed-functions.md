---
summary: A typed function states what it accepts and what it returns, and TypeScript checks every call and every implementation against that contract. You will learn to annotate parameters and return values, write function types, use optional, default and rest parameters, and type arrow functions — including the places where the compiler is more lenient than you might expect.
difficulty: beginner
minutes: 55
objectives:
  - Annotate parameters and return types and explain which ones TypeScript can infer
  - Write function type expressions and call signatures, and use them to type callbacks
  - Explain why a function with fewer parameters, or a callback typed to return void, is still assignable
  - Choose between optional parameters, default parameters, union types and rest parameters, including tuple-typed rest
  - Type arrow functions correctly and explain how their lexical this changes class and callback code
---

## Introduction

In JavaScript a function accepts whatever it is given. Call `add(1, 2)` and you get `3`; call `add("1", 2)` and you get `"12"`; call `add(1)` and you get `NaN`. None of these is an error until somebody notices the wrong number on screen. The function's real expectations — two numbers in, one number out — live only in the author's head or in a comment.

A **typed function** writes those expectations down in a form the compiler can check. Each parameter gets a type, the function gets a return type, and from then on TypeScript checks two things on every edit: that each **call** passes the right number and kinds of arguments, and that the **body** really returns what the signature promises. The JavaScript that runs is unchanged — the types are erased — but the mistakes are caught before the code runs.

Functions are the main unit of abstraction in TypeScript code: utility helpers, React components, event handlers, API clients and array callbacks are all functions. That makes function types the contracts that most of a codebase depends on. If you type them well, errors show up where the bad call is written instead of three files later where the bad value finally breaks something.

This lesson covers the core rules. Two nested sections go deeper: [[b2-optional-rest-parameters|optional and rest parameters]] and [[b2-arrow-functions-ts|arrow functions]]. Functions with several distinct call shapes are covered in [[b2-function-overloading]], and the rules for when one function type can stand in for another are in [[b2-function-variance]].

## Before you start

- **JavaScript functions** — declarations, expressions, and calling with arguments. See [[b1-function-declaration]] and [[b1-function-expression]].
- **Arrow functions and `this` in JavaScript** — needed for the arrow-function section. See [[b1-arrow-functions]] and [[b1-this]].
- **Type annotations and inference** — the `name: Type` syntax and when TypeScript works types out for you. See [[b2-type-annotations]] and [[b2-type-inference]].
- **Union types and `void`** — `string | number`, and what `void` means as a return type. See [[b2-unions]] and [[b2-special-types]].

All examples assume `"strict": true` in `tsconfig.json` and were checked with TypeScript 6.0. The rules shown have been stable since TypeScript 4.x.

## The intuition

Think of a function signature as the label on a socket. The label says "accepts a three-pin plug, delivers 230 volts". Anyone plugging something in can read the label without opening the wall, and the electrician wiring the socket must make sure it really delivers what the label says.

A function signature has the same two audiences. **Callers** read it to know what to pass and what they will get back; TypeScript checks their calls against it. The **implementation** must honour it; TypeScript checks the body against it. Most of what follows is about which side of that contract a rule protects.

The analogy stops at runtime. A real socket physically rejects the wrong plug; a TypeScript signature rejects nothing once the code is compiled. Plain JavaScript callers, or data that arrives from a network, can still pass anything. Types describe and check your own code; they do not validate input at runtime.

## Annotating parameters and return types

A parameter annotation goes after the parameter name; the return type goes after the parameter list:

```typescript title="add.ts"
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2));
console.log(add("1", 2));
console.log(add(1));
```

```output
add.ts(6,17): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
add.ts(7,13): error TS2554: Expected 2 arguments, but got 1.
3
12
NaN
```

The first two lines are compile errors; the last three are what the emitted JavaScript prints if you run it anyway (TypeScript still emits JavaScript by default, which is why the bad calls produce `"12"` and `NaN`). Notice that TypeScript checks the **number of arguments** as well as their types. JavaScript silently fills missing arguments with `undefined` and ignores extra ones; TypeScript treats both as errors unless the signature says a parameter is optional or variadic.

### Parameters are not inferred from the body

TypeScript does not look at how a parameter is used to guess its type. A parameter without an annotation, and without context to infer from (explained below), is implicitly `any`, and `noImplicitAny` — part of `strict` — reports it:

```typescript title="no-annotation.ts"
function double(x) {
  return x * 2;
}
```

```output
no-annotation.ts(1,17): error TS7006: Parameter 'x' implicitly has an 'any' type.
```

This is deliberate. Guessing parameter types from the body would make a function's contract change silently whenever someone edits its implementation. Parameters are the inputs of the contract, so you state them. See [[b2-noimplicitany]] for the flag itself.

### Return types are inferred — but annotating them is often worth it

Return types, on the other hand, are inferred from the `return` statements. Remove `: number` from `add` and its type is still `(a: number, b: number) => number`. So why annotate?

Because an annotation turns the return type from a *description* of what the body happens to do into a *requirement* the body must meet. Compare:

```typescript title="return-type.ts"
type User = { id: number; name: string };
const users: User[] = [{ id: 1, name: "Ada" }];

function findInferred(id: number) {
  return users.find((u) => u.id === id);
}

function findChecked(id: number): User {
  return users.find((u) => u.id === id);
}
```

```output
return-type.ts(9,3): error TS2322: Type 'User | undefined' is not assignable to type 'User'.
```

`findInferred` compiles and its return type is quietly `User | undefined` — every caller now has to deal with `undefined`, perhaps far away from here. `findChecked` states the intended contract and the compiler points at the exact line that breaks it. The fix might be to throw when nothing is found, or to change the declared type to `User | undefined` on purpose; either way the decision is made here, deliberately.

A good rule used in many codebases: let inference handle small local functions and callbacks, and annotate the return type of **exported** functions and anything with several `return` paths. Exported signatures are the API other modules rely on, and an explicit return type also speeds up type checking and makes declaration files more readable. [[b2-when-explicit-vs-inferred]] discusses the trade-off in general.

One case forces an annotation. If a function's return expression refers to the function itself, inference has nothing to start from:

```typescript title="recursive.ts"
function sumTo(n: number) {
  return n <= 0 ? 0 : n + sumTo(n - 1);
}
```

```output
recursive.ts(1,10): error TS7023: 'sumTo' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.
```

Writing `function sumTo(n: number): number` fixes it.

### void and never as return types

A function that is called only for its side effects returns `void`. A function that never finishes normally — it always throws or loops forever — returns `never`:

```typescript title="void-never.ts"
function logLine(message: string): void {
  console.log(`[app] ${message}`);
}

function fail(message: string): never {
  throw new Error(message);
}

logLine("started");
const port = Number("80a");
if (Number.isNaN(port)) {
  try {
    fail("bad port");
  } catch (e) {
    console.log((e as Error).message);
  }
}
```

```output
[app] started
bad port
```

Both are covered in depth in [[b2-special-types]]. The point here is that they are ordinary return-type annotations; `void` is about a *missing* useful result, `never` about a result that can never exist.

## Function types

Functions are values in JavaScript — you pass them as arguments, store them in variables and return them from other functions. So TypeScript needs a way to write the type *of a function*, separate from any particular function.

### Function type expressions

The most common form looks like an arrow function with types instead of a body:

```typescript title="compare.ts"
type Compare = (a: number, b: number) => number;

const ascending: Compare = (a, b) => a - b;
const descending: Compare = (a, b) => b - a;

console.log([3, 1, 2].sort(ascending));
console.log([3, 1, 2].sort(descending));
```

```output
[ 1, 2, 3 ]
[ 3, 2, 1 ]
```

`Compare` describes any function that takes two numbers and returns a number. `ascending` and `descending` do not annotate `a` and `b`, yet they are not `any`: because the variable is declared as `Compare`, the arrow functions take their parameter types from it. This is **contextual typing** — the type flows *into* the function from where it is used, instead of out of it.

The parameter names in a function type are for documentation only; `(x: number, y: number) => number` is the same type as `Compare`. But the names are **required**. This is a classic trap:

```typescript title="name-trap.ts"
type Formatter = (string) => string;
```

```output
name-trap.ts(1,19): error TS7051: Parameter has a name but no type. Did you mean 'arg0: string'?
```

Inside a function type, `(string) => string` means "one parameter *named* `string`, of type `any`". Without `noImplicitAny` this compiles and silently accepts anything; with it you get the helpful error above. Write `(value: string) => string`.

### Callbacks: contextual typing in everyday code

Contextual typing is why you rarely annotate callback parameters. Library signatures already say what the callback will receive:

```typescript title="callbacks.ts"
const prices = [19.5, 5, 120];

const labels = prices.map((p) => p.toFixed(2));
const cheap = prices.filter((p) => p < 20);

console.log(labels, cheap);

setTimeout(() => console.log("timer fired"), 0);
```

```output
[ '19.50', '5.00', '120.00' ] [ 19.5, 5 ]
timer fired
```

`map`'s declaration says the callback receives a `number` (for a `number[]`), so `p` is a `number` and `p.toFixed` is checked. If you write your own higher-order function, give the callback parameter a function type and your callers get the same benefit:

```typescript title="retry.ts"
function retry(times: number, task: (attempt: number) => boolean): boolean {
  for (let attempt = 1; attempt <= times; attempt++) {
    if (task(attempt)) return true;
  }
  return false;
}

const ok = retry(3, (attempt) => {
  console.log(`attempt ${attempt}`);
  return attempt === 2;
});
console.log(ok);
```

```output
attempt 1
attempt 2
true
```

### Call signatures: functions with properties

JavaScript functions are objects and can carry properties. A function type expression cannot describe those, so TypeScript also lets you write a **call signature** inside an object type: the parameter list and return type, separated by a colon instead of `=>`.

```typescript title="call-signature.ts"
type Validator = {
  (value: string): boolean;
  description: string;
};

function makeMinLength(min: number): Validator {
  const check = (value: string) => value.length >= min;
  return Object.assign(check, { description: `at least ${min} characters` });
}

const v = makeMinLength(3);
console.log(v("ab"), v("abc"), v.description);
```

```output
false true at least 3 characters
```

A `Validator` is something you can call *and* read `.description` from. Interfaces can contain call signatures the same way. A related form, the **construct signature** `new (name: string) => Animal`, describes something you call with `new` — a class constructor — and comes up in [[b2-classes-ts]].

### Methods in object types

An object type can declare a function-valued member in two ways:

```typescript
type Store = {
  save(item: string): void;          // method syntax
  load: (key: string) => string;     // property syntax
};
```

Both describe a callable member and are interchangeable for most code. They differ in one subtle checking rule — method syntax is checked more loosely when you assign one function type to another — which is explained in [[b2-function-variance]].

## Assignability: when one function can stand in for another

Callers of `retry` pass functions they wrote. When is such a function acceptable? Three rules cover nearly every case you will meet.

**Fewer parameters is fine.** A function that ignores some of the arguments it is given is still safe to call with them:

```typescript title="fewer-params.ts"
type Listener = (event: string, timestamp: number) => void;

const logOnlyEvent: Listener = (event) => console.log(event);
logOnlyEvent("click", Date.now());

["a", "b"].forEach((item) => console.log(item));
```

```output
click
a
b
```

`forEach` passes three arguments (item, index, array), and the callback uses one. If TypeScript demanded matching parameter counts, almost every callback in JavaScript would need dummy parameters. Extra *arguments* in a direct call are still an error, as you saw with `add`; extra *parameters in the target type* are not.

**Return types must be compatible.** A function returning `"ok"` (a string literal type) can be used where a function returning `string` is expected, because every `"ok"` is a string. The reverse is not allowed.

**Parameter types must accept what the caller will pass.** If a slot is typed `(value: string | number) => void`, a function that accepts only `string` would receive numbers it cannot handle, so TypeScript rejects it under `strict`. These last two rules are the subject of [[b2-function-variance]].

### A callback returning void may still return a value

There is one rule that surprises almost everyone. When a *function type* says it returns `void`, a function that returns something else is still assignable to it:

```typescript title="void-callback.ts"
const seen: string[] = [];
["x", "y"].forEach((s) => seen.push(s)); // push returns a number

type Handler = () => void;
const h: Handler = () => 42;
const result = h();
console.log(seen, result);
```

```output
[ 'x', 'y' ] 42
```

`forEach` expects a callback returning `void`, but `seen.push(s)` returns the new length. Rejecting this would break a very common, harmless style. So `void` in a function *type* means "the caller will not use the result", not "the function returns nothing". Note that `result` is typed `void` even though it holds `42` at runtime — the type system has promised to ignore it.

This leniency applies only to contextual typing from a function type. A function *declaration* or expression whose own annotation says `: void` must not return a value:

```typescript title="void-declared.ts"
function save(): void {
  return 42;
}
```

```output
void-declared.ts(2,3): error TS2322: Type 'number' is not assignable to type 'void'.
```

## Generic functions, briefly

Some functions work for many types while keeping a relationship between input and output. `first` should return a `string` for a `string[]` and a `number` for a `number[]`. Using `any` would lose that; a **type parameter** keeps it:

```typescript title="generic-first.ts"
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const name = first(["Ada", "Linus"]);
const n = first([10, 20]);
console.log(name?.toUpperCase(), n?.toFixed(1));
```

```output
ADA 10.0
```

TypeScript infers `T` from the argument, so `name` is `string | undefined` and `n` is `number | undefined`. Generics deserve their own lesson: see [[b2-generics]]. Arrow-function generics have one syntax quirk, covered in the arrow section below.

## How it works internally

All of this is a compile-time layer. When `tsc` emits JavaScript, it deletes annotations, function types and type parameters, and leaves the function itself untouched:

```typescript title="erase.ts"
type Compare = (a: number, b: number) => number;
export function greet(name: string, excited: boolean = false): string {
  return excited ? `${name}!` : name;
}
export const byLength: Compare = (a, b) => a - b;
```

Compiled with `target: "es2022"`, this becomes:

```javascript title="erase.js"
export function greet(name, excited = false) {
    return excited ? `${name}!` : name;
}
export const byLength = (a, b) => a - b;
```

The `Compare` alias has vanished entirely, and the default value `= false` is left for JavaScript to handle, because default parameters are a JavaScript feature (ES2015). With an older target such as ES5 (deprecated in TypeScript 6.0), `tsc` rewrites the default into an `if (excited === void 0) { excited = false; }` check; the behaviour is the same.

The consequence: argument-count and argument-type checks happen only where TypeScript can see the call. A call from plain JavaScript, from `JSON.parse` output passed through, or through a value typed `any` reaches the function with whatever it contains. At trust boundaries — network responses, `localStorage`, user input — validate at runtime and use [[b2-unknown|unknown]] for the raw value.

The checker's work on a call is simple to describe. It finds the callee's signature, checks the argument count against required, optional and rest parameters, then checks each argument against its parameter type — and while doing so, it pushes parameter types *into* any function-literal arguments (contextual typing) and infers type arguments for generics. The call's type is the signature's return type.

## Optional & Rest Parameters {#b2-optional-rest-parameters}

**Optional parameters** are parameters a caller may leave out, and **rest parameters** collect any number of remaining arguments into an array. JavaScript functions have always allowed both — any argument can be missing, and `...args` gathers the extras — but because TypeScript checks argument counts exactly, you must say which parameters are optional and how variadic arguments are typed. Getting this right is what lets helpers such as loggers, formatters and `fetch` wrappers be both flexible and checked.

### Optional parameters with ?

Put `?` after the parameter name. Callers may then omit it, and inside the function its type includes `undefined`:

```typescript title="optional.ts"
function greet(name: string, greeting?: string): string {
  // greeting: string | undefined
  return `${greeting ?? "Hello"}, ${name}`;
}

console.log(greet("Ada"));
console.log(greet("Ada", "Welcome"));
console.log(greet("Ada", undefined));
```

```output
Hello, Ada
Welcome, Ada
Hello, Ada
```

Because the type is `string | undefined`, `strictNullChecks` forces the body to handle the missing case — here with `??`. Calling `greeting.toUpperCase()` directly would be an error. Passing `undefined` explicitly is allowed and behaves exactly like omitting the argument.

Optional parameters must come **after** all required ones, because arguments are matched by position:

```typescript title="order.ts"
function range(start?: number, end: number): number[] {
  return [];
}
```

```output
order.ts(1,32): error TS1016: A required parameter cannot follow an optional parameter.
```

If a leading parameter is genuinely optional, reorder the parameters, give it a default value (below), or switch to a single options object, which is usually the clearest design once there are more than two optional values.

### Optional parameter versus a union with undefined

`greeting?: string` and `greeting: string | undefined` look similar and are not the same:

```typescript title="optional-vs-union.ts"
function a(x?: string) {}
function b(x: string | undefined) {}

a();
b();
b(undefined);
```

```output
optional-vs-union.ts(5,1): error TS2554: Expected 1 arguments, but got 0.
```

Inside both functions `x` has the type `string | undefined`. The difference is for callers: with `?` they may leave the argument out; with the union they must pass *something*, even if it is `undefined`. Use the union when you want every caller to make a conscious choice — for example `setSelected(id: string | undefined)` where `undefined` means "clear the selection".

### Default parameters

A **default parameter** supplies a value when the argument is missing. TypeScript infers the parameter's type from the default, makes it optional for callers, and — unlike `?` — removes `undefined` inside the body:

```typescript title="defaults.ts"
function paginate(items: string[], pageSize = 2, page = 1): string[] {
  // pageSize: number, page: number  (no undefined)
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

const items = ["a", "b", "c", "d", "e"];
console.log(paginate(items));
console.log(paginate(items, 2, 3));
console.log(paginate(items, undefined, 2));
console.log(paginate.length);
```

```output
[ 'a', 'b' ]
[ 'e' ]
[ 'c', 'd' ]
1
```

The third call shows the JavaScript rule underneath: a default applies when the argument is `undefined`, whether omitted or passed explicitly. That is the only way to skip a defaulted parameter that is not last. `null` does *not* trigger the default — and TypeScript would reject `null` here anyway, since the type is `number`.

The last line is a runtime detail worth knowing: a function's `length` property counts only the parameters before the first one with a default (or the rest parameter). Libraries that inspect `fn.length` — some test frameworks and middleware systems do — see `1` here, not `3`.

Unlike `?` parameters, defaulted parameters *may* appear before required ones. Callers then have to pass `undefined` to use the default, which reads poorly; keep defaults at the end unless there is a strong reason.

You cannot combine the two: `pageSize?: number = 2` is an error (TS1015, "Parameter cannot have question mark and initializer"), because the default already makes the parameter optional.

### Rest parameters

A **rest parameter** gathers all remaining arguments into a real array. Its annotation is the array type:

```typescript title="rest.ts"
function log(level: "info" | "warn", ...messages: string[]): void {
  console.log(`[${level}] ${messages.join(" ")}`);
}

log("info");
log("warn", "disk", "almost", "full");
log("info", "server", "started");
```

```output
[info] 
[warn] disk almost full
[info] server started
```

Each call is checked: every argument after the first must be a `string`. The rest parameter must be the **last** parameter, there can be only one, and it cannot be marked optional or given a default — it is already "zero or more", so an empty call produces an empty array.

Avoid a pattern common in older code: typing variadic arguments as a long list of optional parameters (`(a?: string, b?: string, c?: string)`). That caps the number of arguments arbitrarily and forces the body to check each one. A rest parameter states the real intent.

Rest parameters also replace the old `arguments` object. `arguments` is not a real array (no `map` or `join`), is not available in arrow functions, and is typed loosely as `IArguments`. In TypeScript code there is no reason to use it.

### Tuple-typed rest parameters

The annotation of a rest parameter can be a **tuple** instead of an array, which lets you describe a fixed prefix, labels and optional positions:

```typescript title="tuple-rest.ts"
function point(...coords: [x: number, y: number, z?: number]): string {
  const [x, y, z = 0] = coords;
  return `(${x}, ${y}, ${z})`;
}

function command(name: string, ...args: [string, ...number[]]): string {
  return `${name} ${args.join(" ")}`;
}

console.log(point(1, 2));
console.log(point(1, 2, 3));
console.log(command("move", "north", 3, 4));
```

```output
(1, 2, 0)
(1, 2, 3)
move north 3 4
```

`point` behaves exactly as if it had been written `(x: number, y: number, z?: number)` — editors even show the labels `x`, `y`, `z` in hints. `command` requires a string as its second argument followed by any number of numbers. Tuple rest types matter most in generic code, where a wrapper needs to accept "the same arguments as some other function". The built-in `Parameters<F>` utility extracts exactly that tuple:

```typescript title="forward.ts"
function createUser(name: string, age: number, admin = false) {
  return { name, age, admin };
}

function logged<A extends unknown[], R>(fn: (...args: A) => R) {
  return (...args: A): R => {
    console.log("calling with", args);
    return fn(...args);
  };
}

const createUserLogged = logged(createUser);
type CreateArgs = Parameters<typeof createUser>;
const args: CreateArgs = ["Grace", 85];
console.log(createUserLogged(...args));
```

```output
calling with [ 'Grace', 85 ]
{ name: 'Grace', age: 85, admin: false }
```

`logged` captures `createUser`'s parameter list as the tuple type `A` (`[name: string, age: number, admin?: boolean]`) and gives the wrapper the identical signature, so `createUserLogged("Grace")` would be a compile error. See [[b2-parameters-type]] for `Parameters` and [[b2-tuples]] for tuple types.

### Spreading arrays into calls

The opposite operation — spreading an array into separate arguments — has one trap. An ordinary array type says nothing about its length, so TypeScript cannot prove it fills fixed parameters:

```typescript title="spread-call.ts"
function area(width: number, height: number): number {
  return width * height;
}

const dims = [3, 4];
console.log(area(...dims));

const fixed = [3, 4] as const;
console.log(area(...fixed));
```

```output
spread-call.ts(6,18): error TS2556: A spread argument must either have a tuple type or be passed to a rest parameter.
12
12
```

`dims` is `number[]` — it could have zero or ten elements. `[3, 4] as const` is the tuple `readonly [3, 4]`, which TypeScript knows has exactly two numbers. Spreading into a rest parameter (such as `Math.max(...dims)`) is always fine, because a rest parameter accepts any count. See [[b2-as-const-assertion]] for `as const`.

> [!TIP] When parameter lists grow
> Two or more optional parameters, or booleans whose meaning is unclear at the call site (`paginate(items, true, false)`), are a sign to switch to a single options object: `paginate(items, { pageSize: 20, includeArchived: true })`. Each option is named at the call site, any subset can be passed, and adding a new option never shifts positions. Combine it with destructuring and defaults — see [[b2-parameter-destructuring]].

## Arrow Functions {#b2-arrow-functions-ts}

**Arrow functions** are the compact `(params) => result` syntax for function expressions. In TypeScript they are typed with exactly the same rules as other functions — annotated parameters, optional return type, optional, default and rest parameters — but they behave differently at runtime: an arrow function has no `this`, `arguments` or `prototype` of its own and cannot be called with `new`. Those runtime differences change how you type and use them, especially in classes and callbacks. The JavaScript side is covered in [[b1-arrow-functions]] and [[b1-this-arrow]]; this section is about the typed version.

### Annotating an arrow function

There are two places to put types, and they are equivalent for most purposes:

```typescript title="arrow-annotate.ts"
// 1. Annotate the function itself.
const double = (x: number): number => x * 2;

// 2. Annotate the variable with a function type; parameters are contextually typed.
type Transform = (x: number) => number;
const triple: Transform = (x) => x * 3;

console.log(double(4), triple(4));
```

```output
8 12
```

The return-type annotation in form 1 sits between the parameter list and the arrow: `(x: number): number =>`. Form 2 is the better choice when many functions share one shape — every handler of a given kind, or an exported API where the type is documented once. For a long arrow body with several branches, add an explicit return type in either form so a wrong `return` is reported where it is written.

### Returning an object literal

Braces after `=>` start a function body, not an object. This line does not return an object:

```typescript title="object-return.ts"
type Point = { x: number; y: number };

const broken = () => { x: 1 };
const fixed = (): Point => ({ x: 1, y: 2 });

console.log(broken(), fixed());
```

```output
undefined { x: 1, y: 2 }
```

In `broken`, `{ x: 1 }` is a block containing the *label* `x:` followed by the expression `1` — legal JavaScript that returns nothing. TypeScript infers the return type `void` and, unless you then use the result as an object, compiles it without complaint. Wrapping the literal in parentheses makes it an expression. Adding a return type (`(): Point =>`) is the safety net: then the broken form becomes a compile error instead of a silent `undefined`.

### No own this — and why that matters for types

An arrow function takes `this` from the scope where it is *written* (lexical `this`), not from how it is called. This is the main reason arrows are the default for callbacks:

```typescript title="lexical-this.ts"
class Countdown {
  remaining = 3;

  startArrow(): void {
    const tick = () => {
      this.remaining--; // `this` is the Countdown instance
      console.log("arrow", this.remaining);
    };
    tick();
  }

  startFunction(): void {
    const tick = function () {
      this.remaining--;
    };
    tick();
  }
}

new Countdown().startArrow();
```

```output
lexical-this.ts(14,7): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
arrow 2
```

Inside the `function` expression, `this` depends on the call — a plain call `tick()` gives `undefined` in strict-mode code — so TypeScript cannot know its type and, under `noImplicitThis` (part of `strict`), reports it. The arrow version has no such problem: the checker knows `this` is a `Countdown`, exactly as the runtime will.

Because arrows have no `this` of their own, you cannot declare a `this` parameter on one. Regular functions may (`function onClick(this: HTMLButtonElement, e: MouseEvent)`), but `const f = (this: Window) => {}` is error TS2730, "An arrow function cannot have a 'this' parameter." See [[b2-this-types]] for `this` parameters.

### Arrow functions as class fields

In UI code you often pass a method as a callback — `button.addEventListener("click", this.handleClick)`. A normal method loses its `this` when detached like that. An arrow function stored in a **class field** keeps it, because the field initialiser runs inside the constructor where `this` is the instance:

```typescript title="class-field-arrow.ts"
class Toggle {
  on = false;

  flipMethod() {
    this.on = !this.on;
  }

  flipArrow = (): void => {
    this.on = !this.on;
  };
}

const t = new Toggle();
const detachedArrow = t.flipArrow;
detachedArrow();
console.log("after arrow:", t.on);

const detachedMethod = t.flipMethod;
try {
  detachedMethod();
} catch (e) {
  console.log("method lost this:", (e as Error).constructor.name);
}
console.log("on prototype:", "flipMethod" in Toggle.prototype, "flipArrow" in Toggle.prototype);
```

```output
after arrow: true
method lost this: TypeError
on prototype: true false
```

Note that TypeScript did *not* stop `const detachedMethod = t.flipMethod` — reading a method as a value is legal, and the checker does not track `this` for it. That gap is why the arrow-field pattern exists. Its cost is shown on the last line: `flipMethod` lives once on the prototype and is shared by all instances, while `flipArrow` is a separate function object created **per instance**, and subclasses cannot call it through `super.flipArrow()`. For a few UI objects that is negligible; for thousands of instances, bind at the call site instead (`() => t.flipMethod()`). [[b2-classes-ts]] covers class fields in detail.

### Generic arrow functions

Type parameters go before the parameter list:

```typescript title="generic-arrow.ts"
const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[];
const map: Mapper = (items, fn) => items.map(fn);

console.log(pair("id", 7));
console.log(map([1, 2, 3], (n) => `#${n}`));
```

```output
[ 'id', 7 ]
[ '#1', '#2', '#3' ]
```

In a `.tsx` file, `<T>(x: T) => x` is ambiguous — the parser reads `<T>` as the start of a JSX element. Write `<T,>(x: T) => x` (the trailing comma signals a type-parameter list) or `<T extends unknown>(x: T) => x`. See [[b2-ts-vs-tsx]].

### Not hoisted

A `function` declaration is hoisted: it can be called above the line where it appears. An arrow function assigned to `const` is not — the variable is in its temporal dead zone until its line runs. TypeScript catches direct uses:

```typescript title="hoisting.ts"
console.log(declared(2));
console.log(arrow(2));

function declared(n: number) {
  return n + 1;
}
const arrow = (n: number) => n + 1;
```

```output
hoisting.ts(2,13): error TS2448: Block-scoped variable 'arrow' used before its declaration.
hoisting.ts(2,13): error TS2454: Variable 'arrow' is used before being assigned.
3
ReferenceError: Cannot access 'arrow' before initialization
```

The two errors are the compiler's; the last two lines come from running the emitted JavaScript anyway, where the call to `arrow` throws and stops the program. The compiler can only catch uses it can see are executed before the declaration; a use inside another function that happens to be called too early is not detected. See [[b1-let-const-hoisting]].

### Choosing between arrow and function

| Situation | Prefer | Why |
|---|---|---|
| Inline callback (`map`, `then`, event handler) | Arrow | Short, and `this` stays the surrounding one |
| Top-level exported helper | Either; many teams use `function` | Hoisted, named in stack traces, can have overloads directly |
| Function that needs overload signatures | `function` declaration | Overloads are written as stacked declarations; see [[b2-function-overloading]] |
| Object/class method that uses dynamic `this` | Method syntax | Arrows cannot receive a `this` from the call |
| Class method passed as a callback | Arrow class field, or bind at call site | Keeps `this` bound |
| Constructor | `class` | Arrows cannot be called with `new`: a `TypeError` at runtime, and error TS7009 under `strict` because an arrow type has no construct signature |

## Worked example: a typed event bus

This example combines the pieces: a function type for listeners, a generic method keyed by event name, rest parameters for emitting, an optional parameter and arrow-function callbacks.

```typescript title="event-bus.ts"
type Events = {
  login: [userId: string];
  cart: [itemId: string, quantity: number];
};

type Listener<Args extends unknown[]> = (...args: Args) => void;

class EventBus {
  private listeners: { [K in keyof Events]: Listener<Events[K]>[] } = {
    login: [],
    cart: [],
  };

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const list = this.listeners[event];
    list.push(listener);
    return () => {
      const index = list.indexOf(listener);
      if (index !== -1) list.splice(index, 1);
    };
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]): number {
    const list = this.listeners[event];
    list.forEach((l) => l(...args));
    return list.length;
  }
}

const bus = new EventBus();
const off = bus.on("cart", (itemId, quantity) => {
  console.log(`cart: ${quantity} x ${itemId}`);
});
bus.on("login", (userId) => console.log(`login: ${userId}`));

console.log(bus.emit("cart", "sku-42", 2));
console.log(bus.emit("login", "u1"));
off();
console.log(bus.emit("cart", "sku-42", 1));
```

```output
cart: 2 x sku-42
1
login: u1
1
0
```

Walk through it from the top. `Events` maps each event name to a **labelled tuple** of its arguments. `Listener<Args>` turns such a tuple into a function type using a rest parameter, so `Listener<Events["cart"]>` is `(itemId: string, quantity: number) => void`. In `on`, the type parameter `K` is inferred from the event name, which is why the callback for `"cart"` gets `itemId: string` and `quantity: number` by contextual typing with no annotations. `on` returns an arrow function that unsubscribes; it closes over the event's array, so the caller can store it and call it later as plain `off()` with no `this` involved at all.

`emit` uses the same tuple as a rest parameter type, so `bus.emit("cart", "sku-42")` (missing quantity) and `bus.emit("login", 5)` (wrong type) are compile errors. Edge cases: emitting an event with no listeners returns `0`, because every event starts with an empty array; unsubscribing twice is harmless because `indexOf` returns `-1` the second time.

The `listeners` field is a mapped type, `{ [K in keyof Events]: Listener<Events[K]>[] }`, initialised with an array for every event. That shape matters: *reading* it with a generic `K` gives exactly `Listener<Events[K]>[]`, so `push(listener)` type-checks. *Writing* a whole new array back through `this.listeners[event] = ...` would not compile — TypeScript checks a write through a generic key against every possible key at once — which is why unsubscribing mutates the array in place with `splice`. Mapped types are covered in [[b2-mapped-types]]; you do not need them to follow the function typing here.

## In real systems

- **React components and hooks** are typed functions: props are a parameter type, the return is JSX, and event handlers are typed with function types such as `(event: React.ChangeEvent<HTMLInputElement>) => void`. Inline handlers are almost always arrows, contextually typed from the prop. See [[b2-react-component-props]].
- **API client layers** annotate return types explicitly — `function getUser(id: string): Promise<User>` — so a change in the implementation cannot silently change what dozens of screens receive. The runtime response is still validated, because the annotation does not check network data.
- **Logging and formatting helpers** use rest parameters (`logger.info(message, ...meta)`), and middleware or decorator-style wrappers use `Parameters<F>` and generic rest tuples to forward arguments without losing types.
- **Library type definitions** for things like `addEventListener`, `Array.prototype.map` and `setTimeout` are mostly function types and call signatures. Reading `lib.dom.d.ts` becomes straightforward once you can read these forms.
- **Lint rules** encode the conventions from this lesson: `@typescript-eslint/explicit-module-boundary-types` (annotate exported signatures), `prefer-rest-params` (no `arguments`) and `@typescript-eslint/no-floating-promises` (which catches async callbacks passed where `void` is expected). See [[b2-eslint-typescript]].

## Trade-offs and alternatives

Explicit annotations cost a little typing and can drift into noise when they repeat what inference already knows; inferred types cost nothing but can change silently when a body changes. The balance most teams settle on is: annotate parameters always (required), annotate return types at module boundaries and in complex functions, rely on inference and contextual typing everywhere else.

For flexible inputs, you have several tools, and they are not interchangeable:

| Need | Tool | Watch out for |
|---|---|---|
| One trailing value that may be absent | `?` or a default | `?` keeps `undefined` in the body; a default removes it |
| Caller must decide explicitly | `x: T \| undefined` | Every call must pass an argument |
| Many optional settings | Options object | Slightly more verbose call sites, much clearer ones |
| Any number of same-typed values | Rest `...xs: T[]` | Must be last; arrays need a tuple type to spread into fixed params |
| Different return type per input shape | Overloads or generics | See [[b2-function-overloading]] |

Function types themselves have a soundness gap you should know about: the `void`-return leniency and the looser checking of method-syntax members (see [[b2-function-variance]]) both trade strictness for compatibility with common JavaScript patterns.

## Common mistakes

**Writing `(string) => string` in a function type.** That declares a parameter *named* `string`. Always name parameters in function types: `(value: string) => string`.

**Relying on an inferred return type for an exported function.** The function quietly starts returning `T | undefined` or a wider union after a refactor, and the error appears in some caller. Annotate the return type so the error points at the cause.

**Typing optional values as `x?: T` when `undefined` is meaningful.** If "no value" and "omitted" mean different things, or every caller should decide, use `x: T | undefined` or an options object.

**Putting a required parameter after an optional one.** TypeScript rejects it (TS1016). Reorder, use a default, or use an options object.

**Spreading a plain array into fixed parameters.** `fn(...arr)` with `arr: number[]` fails (TS2556). Give the array a tuple type, with `as const` or an annotation, or make the function take a rest parameter.

**Returning an object literal from an arrow without parentheses.** `() => { id: 1 }` returns `undefined`. Use `() => ({ id: 1 })`, and add a return type so the compiler catches the mistake.

**Passing a method as a callback.** `setTimeout(this.tick, 100)` loses `this`, and TypeScript does not report it. Use an arrow (`() => this.tick()`) or an arrow class field.

**Assuming types protect against bad runtime input.** A parameter typed `number` happily receives a string from untyped code or `JSON.parse`. Validate data at the boundary.

## Interview perspective

**"What is the difference between `x?: string` and `x: string | undefined` as a parameter?"** Inside the function both are `string | undefined`. For callers, the optional form may be omitted; the union form must be passed. A strong answer adds that defaults (`x = "a"`) also make the parameter optional but remove `undefined` from the body type.

**"Why can I pass a function with one parameter where a two-parameter callback is expected?"** Because ignoring arguments is safe, and JavaScript callbacks commonly do it (`forEach`, `map`). Contrast it with direct calls, where *extra arguments* are an error.

**"A callback type returns `void`, but my function returns a number and it compiles. Why?"** `void` in a function type means the result will be ignored, so any return is allowed when assigning; this keeps `arr.forEach(x => list.push(x))` legal. A declaration annotated `: void` cannot return a value. Good candidates mention that `Promise`-returning callbacks passed to `void` slots are a real bug source caught by lint rules.

**"When do you annotate return types?"** Exported functions, recursive functions (required), functions with several return paths, and anywhere you want the error at the implementation rather than at the caller.

**"How would you type a wrapper that accepts exactly the arguments of another function?"** With a generic rest tuple: `<A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R`, or with `Parameters<typeof fn>` and `ReturnType<typeof fn>` for a specific function.

Follow-ups often go to [[b2-function-variance]] ("why is `(x: string) => void` not assignable to `(x: string | number) => void`?") and [[b2-function-overloading]] ("how would you type `createElement` so the return type depends on the tag?").

## Practice

1. Write `clamp(value: number, min = 0, max = 1): number` and explain the type of `min` inside the body and as seen by callers. What does `clamp.length` return, and why?
2. Type a function `sum(...values: number[])` and call it with an array of numbers using spread. Then write `average(a: number, b: number)` and make `average(...pair)` compile.
3. Write a type `Comparator<T>` and a function `sortBy<T>(items: T[], compare: Comparator<T>): T[]` that does not mutate the input. Call it with an inline arrow comparator and confirm the arrow's parameters are inferred.
4. Convert `function format(template: string, a?: string, b?: string, c?: string)` into a version that accepts any number of values, typed as `(string | number)[]`, replacing `{0}`, `{1}` and so on.
5. Find the bug: `class Clock { time = 0; start() { setInterval(this.tick, 1000); } tick() { this.time++; } }`. Fix it two different ways and describe the memory cost of each.
6. Write a generic `once<A extends unknown[], R>(fn: (...args: A) => R)` that returns a function with the same parameters, running `fn` only on the first call and returning the cached result afterwards.

```quiz
Q: Inside `function f(a: number, b = 10) {}`, what is the type of `b`, and can callers omit it?
- [ ] `number | undefined`; callers may omit it
- [x] `number`; callers may omit it
- [ ] `number`; callers must pass it
- [ ] `any`, because it has no annotation
> The default makes the parameter optional for callers, and TypeScript infers `number` from the
> value `10`. Inside the body the default has already been applied, so `undefined` is removed —
> that is the difference from `b?: number`, which stays `number | undefined`.
```

```quiz
Q: `type Handler = () => void; const h: Handler = () => 42;` — what happens?
- [ ] Compile error: `number` is not assignable to `void`
- [x] It compiles; `h()` returns 42 at runtime but is typed `void`
- [ ] It compiles and `h()` is typed `number`
- [ ] It compiles but returns `undefined` at runtime
> A `void` return in a function type means "the caller ignores the result", so a function that
> returns something is still assignable. Nothing changes at runtime — 42 is returned — but the
> type of `h()` is `void`. The error only applies to a function whose own declaration says `: void`.
```

```quiz
Q: Why does `area(...dims)` fail when `dims` is `number[]` and `area` takes `(w: number, h: number)`?
- [ ] Spread syntax is not supported in TypeScript calls
- [ ] `area` must be declared with a rest parameter to be called with spread
- [x] `number[]` has no known length, so TypeScript cannot prove it supplies exactly two arguments
- [ ] Spreading requires the array to be `readonly`
> TypeScript only allows a spread into fixed parameters when the argument has a tuple type, whose
> length is known. `[3, 4] as const` or an annotation like `[number, number]` fixes it. Spreading
> into a rest parameter always works, which is why `Math.max(...dims)` is fine; readonly by itself
> is not the point — the known length is.
```

```quiz
Q: What does `const make = () => { id: 1 };` return when called?
- [ ] `{ id: 1 }`
- [x] `undefined`
- [ ] It is a syntax error
- [ ] `1`
> The braces are parsed as a function body containing a statement labelled `id` whose expression
> is `1`. Nothing is returned, so the result is `undefined` and the inferred type is `void`.
> Wrap the literal in parentheses — `() => ({ id: 1 })` — to return an object.
```

## Quick revision {#quick-revision}

- Parameters must be annotated (or contextually typed); return types are inferred but worth annotating on exported, recursive or multi-branch functions.
- TypeScript checks argument **count** and types; missing or extra arguments are errors unless parameters are optional or rest.
- Function type: `(a: number, b: number) => number`; parameter names are required (`(string) => string` names a parameter `string`).
- Call signature in an object type: `{ (x: string): boolean; description: string }`; construct signature: `new (...) => T`.
- Contextual typing: callbacks get parameter types from the expected function type.
- Fewer parameters is assignable; a function type returning `void` accepts functions returning anything; a declaration typed `: void` cannot return a value.
- `x?: T` — omittable, `T | undefined` inside; `x: T | undefined` — must be passed; `x = v` — omittable, no `undefined` inside; `undefined` triggers defaults, `null` does not.
- Optional parameters cannot precede required ones (TS1016); `?` and a default cannot be combined.
- Rest: `...xs: T[]`, last, only one, no `?` or default; tuple rest `...args: [a: string, b?: number]`; `Parameters<F>` gives a function's parameter tuple.
- Spreading into fixed parameters needs a tuple type (`as const`), else TS2556.
- Arrows: no own `this`/`arguments`/`prototype`, not constructable, not hoisted; wrap object returns in `()`; `<T,>` in `.tsx`; no `this` parameter.
- Arrow class fields keep `this` when detached but are created per instance and not on the prototype.

## Key takeaways {#key-takeaways}

- A function signature is a contract with two sides: TypeScript checks callers against it and the body against it, and erases it all at runtime.
- Annotate parameters always and return types where they define an API; let contextual typing handle callbacks.
- Assignability of functions is deliberately lenient in two places — fewer parameters and `void` returns — because common JavaScript callback patterns rely on them.
- Optional (`?`), default and `T | undefined` parameters differ in what callers may omit and what the body must handle; pick by meaning, and move to an options object when lists grow.
- Rest parameters with array or tuple types describe variadic functions precisely, and generic rest tuples let wrappers forward arguments without losing types.
- Arrow functions are typed like any function but take `this` lexically, which makes them the natural choice for callbacks and the reason for the arrow-class-field pattern.
