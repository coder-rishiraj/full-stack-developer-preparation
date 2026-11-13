---
summary: TypeScript describes every JavaScript value as either a primitive (string, number, boolean, bigint, symbol, null, undefined) or an object. You will learn how each primitive type maps to real runtime values, why lowercase `string` and uppercase `String` are different things, and how the primitive/object split explains copying, comparison and mutation.
difficulty: beginner
minutes: 45
objectives:
  - Name the seven primitive types and the TypeScript type that describes each one
  - Explain the difference between primitive and object values in terms of copying, comparison and mutation
  - Choose between `string`, `number`, `boolean`, `bigint` and literal types for a given piece of data
  - Explain why `String`, `Number`, `Boolean`, `Object` and `{}` are almost never the type you want
  - Debug common primitive-type bugs such as float rounding, `NaN`, mixing `bigint` with `number`, and booleans that arrive as strings
---

## Introduction

Every program moves data around: a user's name, the price of an item, whether a checkbox is ticked, a list of orders, a function to call when a button is clicked. JavaScript does not care what kind of value a variable holds — the same variable can contain a number on one line and a string on the next. That freedom is convenient for small scripts and painful for large codebases, because nothing stops `"42"` from reaching a function that expected `42`.

TypeScript adds **types**: names for sets of values, checked by the compiler before the code runs. The very first types you meet are the ones that describe JavaScript's built-in kinds of value. JavaScript divides all values into two families. **Primitive values** are simple, indivisible pieces of data — a piece of text, a number, `true` or `false`. **Objects** are everything else: plain objects, arrays, functions, dates, maps, class instances. TypeScript mirrors that split exactly, with one lowercase type per primitive (`string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`) and a family of ways to describe object shapes.

This lesson matters for two reasons. First, these types appear in nearly every line of TypeScript you will read or write, so you need to know precisely which values each one admits. Second, the primitive/object split is not just a TypeScript classification — it decides how values are copied, compared and changed at runtime, which is the source of many real bugs. TypeScript cannot hide that runtime behaviour; it can only describe it.

## Before you start

- **JavaScript primitives** — what a string, number and boolean are in plain JavaScript. See [[b1-primitive-types]].
- **Value vs reference** — the idea that objects are shared through references. See [[b1-primitive-vs-reference]]; this lesson recaps it briefly.
- **`typeof`** — the runtime operator that reports a value's kind. See [[b1-typeof]].
- **What TypeScript is** — that it is JavaScript plus a compile-time type checker whose types are erased. See [[b2-what-is-typescript]].

You will see the colon syntax `name: type` throughout. It is a **type annotation**, taught fully in [[b2-type-annotations]]; for now read `const age: number = 36` as "`age` is a constant whose type is `number`".

## The intuition

Think of a type as a **set of allowed values**. The type `boolean` is a set with two members, `true` and `false`. The type `number` is a very large set containing every JavaScript number. The type `string` contains every possible piece of text. When you write `const age: number = 36`, you are telling the compiler "only values from the `number` set may live here", and the compiler checks that `36` belongs to that set.

The primitive/object split is about *what a variable holds*. A variable holding a primitive holds the value itself, like a sticky note with "36" written on it; copying the variable writes the same thing on a fresh note. A variable holding an object holds a **reference** — something closer to an address of a shared whiteboard. Copying the variable copies the address, so both variables now point at the same whiteboard, and writing on it through one is visible through the other. The analogy has a limit: engines do not literally store every primitive inline (long strings, for instance, live on the heap), but primitives *behave* as if copied because they can never be changed in place.

## The seven primitive types

JavaScript (as of ES2020) has exactly seven primitive types, and TypeScript has a lowercase type for each.

| TypeScript type | Example values | `typeof` at runtime |
|---|---|---|
| `string` | `"Ada"`, `''`, `` `Hi ${name}` `` | `"string"` |
| `number` | `36`, `-0.5`, `NaN`, `Infinity` | `"number"` |
| `boolean` | `true`, `false` | `"boolean"` |
| `bigint` | `10n`, `2n ** 64n` | `"bigint"` |
| `symbol` | `Symbol("cache")` | `"symbol"` |
| `null` | `null` | `"object"` (a historical bug) |
| `undefined` | `undefined` | `"undefined"` |

The following program annotates one value of each primitive type and then asks the runtime what it thinks each value is. It compiles under TypeScript's `strict` settings, which TypeScript 6 enables by default.

```typescript title="primitives.ts"
const title: string = "Ada";
const age: number = 36;
const isAdmin: boolean = false;
const accountId: bigint = 9007199254740993n;
const cacheKey: symbol = Symbol("cache");
const cleared: null = null;
const notSetYet: undefined = undefined;

const values = [title, age, isAdmin, accountId, cacheKey, cleared, notSetYet];
console.log(values.map((v) => typeof v).join(" "));
```

```output
string number boolean bigint symbol object undefined
```

Two things are worth noticing. The annotations disappear when the file is compiled — `typeof` is a JavaScript operator that inspects real values at runtime, and TypeScript's types never reach it. And `typeof null` reports `"object"`, a bug from the first version of JavaScript that can never be fixed without breaking the web. TypeScript knows about this quirk: `null` has its own type, and to test for it you write `value === null`, never `typeof value === "object"`.

The four primitives you will use constantly — `string`, `number`, `boolean`, and the less common but important `bigint` — get their own sections below. `symbol` creates unique property keys and is covered in [[b1-symbols]]. `null` and `undefined` represent absence; how TypeScript treats them depends on the `strictNullChecks` setting, which has its own lessons in [[b2-null-undefined-ts]] and [[b2-strict-null-checks]]. Under strict settings, `null` and `undefined` are *not* members of `string` or `number`: a variable of type `string` can never hold `undefined` unless you say so with a union such as `string | undefined`.

## Primitives are immutable values

**Immutable** means a primitive value can never be changed in place. Methods that look like they modify a string — `toUpperCase`, `trim`, `replace` — all return a *new* string and leave the original untouched. Reassigning a variable is different: it does not change the old value, it makes the variable hold a different one.

Because primitives cannot change, copying one is safe and comparing two of them compares their contents.

```typescript title="value-vs-reference.ts"
let a = 5;
let b = a;
b = 10;
console.log(a, b);

const first = { count: 1 };
const second = first;
second.count = 2;
console.log(first.count, first === second);
const copy = { count: 2 };
console.log(first === copy);

const word = "hello";
const shout = word.toUpperCase();
console.log(word, shout);
```

```output
5 10
2 true
false
hello HELLO
```

Walk through it. `b = a` copies the number 5 into `b`; reassigning `b` has no effect on `a`. With objects, `second = first` copies the *reference*, so `second.count = 2` changes the single object both names point at — `first.count` is now 2 and the two variables are `===` equal because they hold the same reference. `copy` has identical contents but is a different object, so `===` says `false`: **objects are compared by identity, not by contents**. Finally, `toUpperCase` returned a new string and `word` is unchanged.

TypeScript understands this rule well enough to warn you. If you write `{ count: 2 } === { count: 2 }` directly, the compiler reports error TS2839: *"This condition will always return 'false' since JavaScript compares objects by reference, not value."* For comparing contents you need a deep-equality helper or, for simple cases, a comparison of specific fields.

> [!NOTE] Methods on primitives
> If primitives are not objects, how does `"hello".toUpperCase()` work? When you access a property on a primitive, JavaScript temporarily wraps it in a matching wrapper object (`String`, `Number`, `Boolean`, `BigInt`, `Symbol`), looks the method up on that wrapper's prototype, calls it, and discards the wrapper. This is called **autoboxing**. TypeScript models it by giving `string` all the methods declared on the global `String` interface.

## Object types

Anything that is not a primitive is an object, and TypeScript describes objects by their **shape**: what properties they have and what type each property is. You will meet many ways to write object types in later lessons; here are the main forms, so you can recognise them.

```typescript title="object-types.ts"
const user: { name: string; age: number } = { name: "Ada", age: 36 };
const tags: string[] = ["math", "engines"];
const greet: (who: string) => string = (who) => `Hello, ${who}`;
console.log(typeof user, typeof tags, typeof greet);
console.log(Array.isArray(tags), user === null);
```

```output
object object function
true false
```

`{ name: string; age: number }` is an **object type literal**: it says the value must have a `name` that is a string and an `age` that is a number. `string[]` is an array whose elements are strings (see [[b2-typed-arrays]]). `(who: string) => string` is a function type. At runtime all three are objects — `typeof` reports arrays as `"object"` and functions specially as `"function"` — which is why `Array.isArray` exists. Naming and reusing object shapes is the job of [[b2-object-types]], [[b2-type-aliases]] and [[b2-interfaces]].

TypeScript's object types are **structural**: a value matches the type if it has the required properties with the right types, regardless of how it was created. A plain literal, a class instance and the result of `JSON.parse` (once validated) can all satisfy `{ name: string; age: number }`. This is covered in [[b2-structural-typing]].

### `object`, `Object`, `{}` and the wrapper types

TypeScript has several types whose names sound like "any object" or "any string". Only one of them is commonly useful, and mixing them up is a frequent beginner mistake.

```typescript title="wrappers.ts"
const boxed: String = new String("hi");
const plain: string = boxed;   // error TS2322

let o1: object = { a: 1 };
let o2: object = 42;           // error TS2322
let e1: {} = 42;               // allowed
let e2: {} = null;             // error TS2322
```

```output
wrappers.ts(2,7): error TS2322: Type 'String' is not assignable to type 'string'.
  'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.
wrappers.ts(5,5): error TS2322: Type 'number' is not assignable to type 'object'.
wrappers.ts(7,5): error TS2322: Type 'null' is not assignable to type '{}'.
```

The output above is from `tsc --noEmit`, not from running the program. Here is what each type means:

| Type | Meaning | Use it? |
|---|---|---|
| `string`, `number`, `boolean`, `bigint`, `symbol` | The primitive values | Yes — always for primitive data |
| `String`, `Number`, `Boolean` | The *wrapper object* interfaces | No — they describe `new String("x")`, which you should never create |
| `object` (lowercase) | Any non-primitive value | Occasionally, when you accept "some object" and do not read its properties |
| `Object` (uppercase) | Almost anything with `Object.prototype` methods, including primitives | No |
| `{}` | Any value except `null` and `undefined` — *not* "empty object" | Rarely; it surprises readers |

The surprising row is `{}`. It reads like "an empty object", but it actually means "anything that has no required properties", and every primitive except `null` and `undefined` qualifies. If you really mean "an object with no properties", use `Record<string, never>`; otherwise write the specific object type you expect.

> [!MISTAKE] Capitalised primitive types
> Writing `name: String` instead of `name: string` usually compiles at first, then fails as soon as the value reaches code expecting a `string`. The uppercase names are for wrapper objects. Use lowercase for primitive types every time.

## string {#b2-type-string}

The `string` type describes every JavaScript text value: anything written with single quotes, double quotes or backticks, and anything a string method returns. Internally a JavaScript string is a sequence of **UTF-16 code units**, and TypeScript's `string` matches that model exactly — it adds no new runtime behaviour, it only checks that text goes where text is expected.

A typical use is any human-readable text, identifier or URL: names, labels, messages, IDs whose format you do not control. Annotating a parameter as `string` gives you two things: the compiler rejects non-text arguments, and your editor can autocomplete every method declared on the built-in `String` interface.

```typescript title="initials.ts"
function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0].toUpperCase())
    .join("");
}
console.log(initials("  ada   lovelace "));
const greeting = `Hi, ${initials("grace hopper")}`;
console.log(greeting, greeting.length);
```

```output
AL
Hi, GH 6
```

Every call in the chain is type-checked: `trim` returns `string`, `split` returns `string[]`, `map` with a callback returning `string` produces `string[]`, and `join` returns `string`, which matches the declared return type. A template literal such as `` `Hi, ${...}` `` always produces a `string`, whatever you interpolate.

If you call a method that strings do not have, the compiler stops you before the code runs:

```typescript title="string-errors.ts"
const input: string = "42";
input.toFixed(2);
const id = 42;
const label: string = id;
const label2: string = String(id);
```

```output
string-errors.ts(2,7): error TS2551: Property 'toFixed' does not exist on type 'string'. Did you mean 'fixed'?
string-errors.ts(4,7): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript does not convert between types for you. Line 4 is an error; line 5 is fine because `String(id)` is an explicit conversion that returns a `string`. This is the main value of `string` at a boundary: data from a form field is always text, and the compiler forces you to decide where and how to convert it to a number.

### There is no `char` type

Languages such as Java and C have a separate character type. TypeScript does not, because JavaScript does not. Indexing a string gives you another `string`:

```typescript title="chars.ts"
const letter = "abc"[1];
console.log(letter, typeof letter);
console.log("abc"[5]);
console.log("😀".length, [..."😀"].length);
```

```output
b string
undefined
2 1
```

Two lessons hide here. First, `"abc"[5]` is typed `string` but is `undefined` at runtime. By default TypeScript assumes an index is in range; the `noUncheckedIndexedAccess` compiler option (see [[b2-tsconfig]]) changes the type of indexed reads to `string | undefined` so you are forced to handle the missing case. Second, `length` counts UTF-16 code units, not visible characters. The emoji is one character to a human but two code units, so `.length` is 2; spreading the string iterates by code point and gives 1. TypeScript's types say nothing about this — `string` is "any UTF-16 text" — so length limits on user input need care.

### String literal types

`string` is a very wide set. Often a value can only be one of a few specific strings: a theme is `"light"` or `"dark"`, an HTTP method is `"GET"` or `"POST"`. TypeScript lets a single string be a type of its own — a **string literal type** — and lets you combine them with `|`:

```typescript title="theme.ts"
type Theme = "light" | "dark";
let theme: Theme = "dark";
theme = "blue"; // error TS2322: Type '"blue"' is not assignable to type 'Theme'.
```

A typo in a literal is now a compile error rather than a silent bug. Literal types are the subject of [[b2-literal-types]] and [[b2-unions]], and patterns built from strings (such as `` `on${string}` `` for event names) are covered in [[b2-template-literal-types]]. When the format of a string matters but cannot be listed — a user ID versus an order ID, both plain strings — teams use **branded types** ([[b2-branded-types]]) so the compiler can tell them apart.

> [!TIP] Prefer `string` to `any` for unknown text
> If a value is text but you do not know its exact format, `string` is still far safer than `any`: it rules out numbers, objects and `undefined`, and it keeps method calls checked.

## number {#b2-type-number}

The `number` type describes every JavaScript number. JavaScript has a single numeric type for ordinary arithmetic: a **64-bit IEEE 754 double-precision floating-point** value. Integers, decimals, negative zero, `NaN` ("not a number") and `Infinity` are all members of the same type. TypeScript mirrors this honestly: there is no `int`, `float`, `long` or `double`, because the runtime would not enforce any of them.

```typescript title="numbers.ts"
const count: number = 3;
const price: number = 19.99;
const ratio: number = 0.1 + 0.2;
const parsed: number = Number("12px");
const tooBig: number = 1 / 0;
console.log(count, price, ratio, parsed, tooBig);
console.log(Number.isNaN(parsed), parsed === parsed);
console.log(Number.MAX_SAFE_INTEGER, 2 ** 53 === 2 ** 53 + 1);
console.log(Number.isInteger(count), Number.isInteger(price));
```

```output
3 19.99 0.30000000000000004 NaN Infinity
true false
9007199254740991 true
true false
```

Every value here type-checks as `number`, including the surprising ones, and each line of output teaches something the type cannot:

- **Floating-point rounding.** `0.1 + 0.2` is not exactly `0.3`, because neither decimal has an exact binary representation. Compare with a tolerance (`Math.abs(a - b) < Number.EPSILON` for values near 1), or store money as integer cents. See [[b1-number-representation]].
- **`NaN` is a `number`.** `Number("12px")` fails to parse and produces `NaN`, which TypeScript still types as `number`. `NaN` is the only value not equal to itself, so `parsed === parsed` is `false`; test with `Number.isNaN`. See [[b1-nan-infinity]].
- **Safe integers stop at 2⁵³ − 1.** Beyond `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991), not every integer can be represented, so `2 ** 53` and `2 ** 53 + 1` are the same double.
- **Integer-ness is a runtime fact.** `Number.isInteger` answers at runtime, but the type stays `number` either way. If integer-only matters (array indexes, quantities), validate at runtime or use a branded type such as `type Int = number & { readonly __brand: "Int" }`.

### `bigint` for integers beyond 2⁵³

For integers that must be exact at any size — database IDs from systems that use 64-bit keys, cryptography, money in the smallest unit at very large scale — JavaScript (ES2020) added the `bigint` primitive, written with an `n` suffix. TypeScript gives it its own type, `bigint`, and it is deliberately **not** assignable to or mixable with `number`.

```typescript title="bigint.ts"
const big: bigint = 2n ** 64n;
console.log(big, typeof big, big + 1n);
console.log(Number(big) === 2 ** 64, BigInt(3) * 10n);

const total: bigint = 10n;
const fee: number = 2;
console.log(total + fee); // error TS2365
```

```output
18446744073709551616n bigint 18446744073709551617n
true 30n
```

The last line does not compile: *"Operator '+' cannot be applied to types 'bigint' and 'number'."* JavaScript would throw a `TypeError` at runtime here, so the compiler catching it early is a real win. Convert explicitly with `BigInt(fee)` or `Number(total)`, knowing that `Number(...)` loses precision above 2⁵³. Using `bigint` literals requires your compile target to be ES2020 or later. More detail is in [[b1-bigint]].

### Numeric literal types

As with strings, a single number can be a type, and unions of numbers describe fixed sets:

```typescript title="status.ts"
type HttpStatus = 200 | 404 | 500;
const code: HttpStatus = 404;  // fine
const other: HttpStatus = 201; // error TS2322: Type '201' is not assignable to type 'HttpStatus'.
```

This is often clearer than a bare `number` for values like status codes, dice faces or zoom levels. When you write `const code = 404` without an annotation, TypeScript infers the literal type `404`; `let code = 404` widens to `number`. That rule, called **widening**, is explained in [[b2-type-inference]].

> [!WARNING] `number` says nothing about validity
> `parseInt("abc")` returns `NaN`, and `NaN` is a perfectly good `number` to the compiler. Any number that came from user input or text needs a runtime check (`Number.isFinite`, range checks) — the type only tells you it is *some* double.

## boolean {#b2-type-boolean}

The `boolean` type has exactly two members, `true` and `false`. It is the type of every comparison (`a > b`, `x === y`), of the `!` operator's result, and of flags such as `isLoading`, `isOpen` or `hasPermission`. In TypeScript `boolean` is literally defined as the union `true | false`, which is why you can also use `true` or `false` alone as a type when a value can only ever be one of them.

A function that answers a yes/no question — a **predicate** — should declare `boolean` as its return type so every caller can rely on it:

```typescript title="booleans.ts"
function isEven(n: number): boolean {
  return n % 2 === 0;
}
const items: string[] = ["a", "b"];
const hasItems: boolean = items.length > 0;
const hasItems2: boolean = !!items.length;
console.log(isEven(4), hasItems, hasItems2, Boolean(""), Boolean("false"));
```

```output
true true true false true
```

### Truthy values are not booleans

JavaScript lets any value appear in an `if` condition: `0`, `""`, `null`, `undefined` and `NaN` are **falsy**, almost everything else is **truthy** (see [[b1-truthy-falsy]]). TypeScript keeps that permission for conditions — `if (items.length)` compiles — but it does *not* treat truthy values as booleans when you assign them:

```typescript title="not-boolean.ts"
const items: string[] = [];
const bad: boolean = items.length; // error TS2322: Type 'number' is not assignable to type 'boolean'.
const yes: boolean = "yes";        // error TS2322: Type 'string' is not assignable to type 'boolean'.
```

If you want a boolean from another value, convert deliberately: `items.length > 0` says exactly what you mean, `!!value` and `Boolean(value)` apply JavaScript's truthiness rules. Note in the earlier output that `Boolean("false")` is `true` — every non-empty string is truthy, including the text `"false"`.

### Booleans that arrive as strings

That last point causes a classic production bug. Query strings, environment variables, HTML attributes and some APIs deliver `"true"` and `"false"` as text. If the value is typed `any` (for example the result of `JSON.parse`), an annotation of `boolean` is accepted without any check:

```typescript title="server-flag.ts"
const fromServer = JSON.parse('{"enabled":"false"}');
const enabledWrong: boolean = fromServer.enabled; // compiles: fromServer is any
const enabled: boolean = fromServer.enabled === "true";
console.log(enabledWrong ? "on" : "off", enabled ? "on" : "off");
```

```output
on off
```

`enabledWrong` holds the string `"false"`, which is truthy, so the feature turns *on*. The annotation was a promise the compiler could not verify, because `any` switches checking off. The fix is to parse explicitly at the boundary, as the `enabled` line does, or to type the raw data as `unknown` and validate it (see [[b2-special-types]]).

### Avoid `new Boolean`

The wrapper object is even more dangerous for booleans than for strings, because objects are always truthy:

```typescript title="wrapper-boolean.ts"
const flag = new Boolean(false);
console.log(flag ? "truthy object" : "falsy", typeof flag);
```

```output
truthy object object
```

A `Boolean` object wrapping `false` still passes an `if`. Use `boolean` as the type and `Boolean(x)` (without `new`) only as a conversion function.

Booleans also combine with other literal types in unions, which lets the compiler narrow on them: a result type such as `{ ok: true; value: number } | { ok: false; error: string }` uses `true` and `false` as discriminants, a pattern taught in [[b2-discriminated-unions]].

## How it works internally

TypeScript's type checker runs only at compile time. When it sees `const age: number = 36`, it computes the type of the expression `36` (the literal type `36`), checks that `36` is **assignable** to `number` (every numeric literal is a member of `number`), and records `number` as the declared type of `age`. When you later write `age.toUpperCase()`, it looks up `toUpperCase` on the `Number` interface from the standard library declarations (`lib.es5.d.ts` and friends), does not find it, and reports an error. That is also how methods on primitives are typed: the compiler resolves `"x".trim` through the global `String` interface, mirroring the runtime's autoboxing.

When the compiler emits JavaScript, all annotations are removed. `const age: number = 36` becomes `const age = 36`. Nothing about `number` survives to runtime, which is why runtime checks (`typeof`, `Number.isNaN`, `Array.isArray`) remain necessary whenever data comes from outside your program.

At runtime, engines such as V8 store small integers directly in a tagged machine word (called a "Smi" in V8), larger or fractional numbers as heap-allocated doubles, and strings in several internal representations. None of that is visible to your code or to TypeScript; the language guarantees only the observable behaviour — immutability and comparison by value.

## In real systems

In a React form component, the `value` of a text input is always a `string`, even for `<input type="number">`. Typing your state as `number` while storing `event.target.value` straight into it is exactly the mismatch TypeScript is designed to catch; the fix is a deliberate `Number(...)` plus a `NaN` check.

In an API client, response bodies arrive as `any` from `JSON.parse` or `response.json()`. Teams declare the expected shape — `{ id: string; total: number; paid: boolean }` — but validate it at runtime with a schema library, because the primitive annotations cannot check data that was never seen by the compiler. IDs from 64-bit database columns are usually sent as strings precisely because a JSON number cannot safely hold values beyond 2⁵³.

For configuration flags read from environment variables, which are always strings, a small parser that turns `"true"`/`"false"` into `boolean` at startup keeps the rest of the codebase working with real booleans.

## Trade-offs and alternatives

The primitive types are deliberately broad. `string` accepts any text, `number` accepts `NaN`. Narrower options exist — literal unions, branded types, template literal types — and each adds precision at the cost of more ceremony. Use the plain primitive when any value of that kind is genuinely acceptable (a display name, a coordinate), and narrow it when only some values are meaningful (a role, a status code, a validated email).

`bigint` is exact but slower than `number`, cannot be mixed with it, and is not supported by `JSON.stringify` (it throws). Use it only when you truly need integers beyond 2⁵³; otherwise `number` is simpler.

## Common mistakes

- **Using `String`, `Number`, `Boolean` or `Object` as types.** They describe wrapper objects. Use the lowercase primitive types.
- **Reading `{}` as "empty object".** It accepts any non-nullish value, including `42`. Use a specific object type.
- **Testing for `null` with `typeof`.** `typeof null` is `"object"`. Compare with `=== null`.
- **Comparing objects with `===` expecting equal contents.** Objects compare by reference; compare fields or use a deep-equality helper.
- **Trusting `number` to mean "a valid number".** `NaN` and `Infinity` are numbers. Validate parsed input.
- **Mixing `bigint` and `number` in arithmetic.** Convert explicitly with `BigInt()` or `Number()`.
- **Annotating an `any` value as `boolean` and assuming it is one.** `"false"` from a server is truthy. Parse at the boundary.

## Interview perspective

**"What are the primitive types in JavaScript and TypeScript?"** Name all seven — `string`, `number`, `bigint`, `boolean`, `symbol`, `null`, `undefined` — and say that everything else is an object. A strong answer adds that primitives are immutable and compared by value, while objects are mutable and compared by reference.

**"What is the difference between `string` and `String`?"** `string` is the primitive type; `String` is the interface of the wrapper object created by `new String()`. A `string` is assignable to `String` but not the other way round, and the compiler explicitly recommends `string`.

**"Does TypeScript have an integer type?"** No. `number` is an IEEE 754 double, matching the runtime. For exact large integers use `bigint`; for "integer-only" semantics use runtime checks or a branded type. Interviewers then often ask about `0.1 + 0.2` and `Number.MAX_SAFE_INTEGER`.

**Follow-up: "Why is `typeof null` `'object'`?"** It is a bug from the original JavaScript implementation, kept for compatibility. TypeScript gives `null` its own type, and narrowing uses `=== null`.

```quiz
Q: Which annotation is the correct choice for a variable that holds a user's display name?
- [ ] `name: String`
- [x] `name: string`
- [ ] `name: {}`
- [ ] `name: object`
> `string` is the primitive text type. `String` describes the wrapper object from `new String()` and is not assignable to `string`, so it breaks as soon as the value meets normal string APIs. `{}` would accept numbers too, and `object` rejects primitives entirely.
```

```quiz
Q: What does this print? `const a = { n: 1 }; const b = a; b.n = 5; console.log(a.n);`
- [ ] `1`, because `b` is a copy of `a`
- [x] `5`, because `a` and `b` refer to the same object
- [ ] A compile error, because `a` is `const`
> Assigning an object copies the reference, not the object, so the mutation through `b` is visible through `a`. `const` only prevents reassigning the variable `a`; it does not freeze the object it points to.
```

```quiz
Q: A value from `JSON.parse` is the string `"false"`, and you assign it to `const enabled: boolean`. What happens?
- [ ] A compile error, because `"false"` is not a boolean
- [ ] It is converted to `false` automatically
- [x] It compiles, because `JSON.parse` returns `any`, and `enabled` holds the truthy string `"false"`
> `any` disables checking, so the annotation is an unverified promise. TypeScript never converts values; at runtime the variable still holds the string, which is truthy, so `if (enabled)` takes the "on" branch.
```

```quiz
Q: Why does `const total: bigint = 10n; total + 2;` fail to compile?
- [ ] `bigint` values cannot be added at all
- [x] `bigint` and `number` cannot be mixed in arithmetic; JavaScript would throw a TypeError
- [ ] `2` must be written as a string
> `bigint` supports `+`, but only with another `bigint`. Mixing kinds throws at runtime, so TypeScript reports TS2365 up front. Write `total + 2n` or convert explicitly.
```

## Practice

1. Write `parseQuantity(input: string): number` that returns a positive integer or throws. Make sure `"abc"`, `"2.5"`, `"-1"` and `""` are all rejected, and explain why the return type alone cannot express "positive integer".
2. Write `parseFlag(value: string | undefined): boolean` for environment variables that accepts `"true"`, `"1"`, `"false"`, `"0"` (case-insensitive) and treats anything else as an error.
3. Predict, then check, the output of `console.log(typeof null, typeof [], typeof (() => 1), typeof 1n)`.
4. Rewrite `function sum(a: Number, b: Number): Number` correctly and explain what goes wrong with the original if you try `const x: number = sum(1, 2)`.
5. Model a dice roll as a type that only allows 1 to 6, and write a function that returns a random roll of that type.

## Quick revision {#quick-revision}

- Seven primitives: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`. Everything else is an object.
- Primitives are immutable and compared by value; objects are mutable and compared by reference (`{a:1} === {a:1}` is `false`).
- Always use lowercase types. `String`/`Number`/`Boolean` are wrapper objects; `{}` means "any non-nullish value".
- `string`: any UTF-16 text; no `char` type; `.length` counts code units; literal unions like `"light" | "dark"` narrow it.
- `number`: IEEE 754 double — no int/float split; includes `NaN` and `Infinity`; exact integers only up to 2⁵³ − 1.
- `bigint`: exact integers with `n` suffix; cannot be mixed with `number` (TS2365); ES2020+.
- `boolean` = `true | false`; truthy values are not booleans; convert with comparisons, `!!` or `Boolean()`.
- Types are erased at compile time — use `typeof`, `Number.isNaN`, `=== null` and validation at runtime.

## Key takeaways {#key-takeaways}

- TypeScript's primitive types mirror JavaScript's seven primitives one to one; it adds checking, not new runtime kinds.
- The primitive/object split decides runtime behaviour: copying a primitive copies the value, copying an object shares it.
- Use lowercase `string`, `number` and `boolean`; the capitalised names and `{}` are traps.
- `number` admits `NaN`, `Infinity` and rounding errors, and `string` admits any text — the type says what kind of value, not whether it is valid.
- Reach for `bigint` only when integers must be exact beyond 2⁵³, and convert explicitly when mixing.
- Data from outside the program (JSON, forms, environment variables) needs runtime parsing; an annotation on an `any` value proves nothing.
