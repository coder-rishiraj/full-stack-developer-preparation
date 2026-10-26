---
summary: Every JavaScript value is either one of seven primitive types — string, number, bigint, boolean, undefined, null, symbol — or an object. You will learn what each primitive represents, how it behaves at its edges, and why knowing the exact type of a value prevents a large class of everyday bugs.
difficulty: beginner
minutes: 60
objectives:
  - Name the seven primitive types and the one non-primitive type, and give a literal for each
  - Explain what makes a value primitive and how property access on a primitive works through autoboxing
  - Predict the edge-case behaviour of each primitive, such as string length with emoji, 0.1 + 0.2, mixing bigint with number, and truthiness of wrapper objects
  - Choose the right primitive for real data such as IDs, money, flags and "no value" markers
  - Debug bugs caused by treating a primitive as if it were a mutable object
---

## Introduction

Every program manipulates values: a user's name, a cart total, whether a checkbox is ticked, the ID of the row you are about to delete. Before JavaScript can add, compare or display any of those values it has to know what *kind* of value it is holding, because the rules differ. Adding two numbers produces a sum; "adding" two strings glues them together; adding a number to a bigint throws an error.

The kind of a value is called its **type**. The ECMAScript specification (the standard that defines JavaScript, as of ES2023) says there are exactly eight types, and every value belongs to exactly one of them:

| Type | Example values | What it represents |
|---|---|---|
| string | `'Ada'`, `""`, `` `Hi ${name}` `` | Text |
| number | `42`, `3.14`, `-0`, `NaN`, `Infinity` | Numbers, stored as 64-bit floating point |
| bigint | `42n`, `2n ** 64n` | Integers of any size (ES2020) |
| boolean | `true`, `false` | Yes/no |
| undefined | `undefined` | "No value has been given" |
| null | `null` | "Deliberately empty" |
| symbol | `Symbol('id')` | A unique, unforgeable key (ES2015) |
| object | `{}`, `[]`, `function () {}`, `new Date()` | Everything else: structured, mutable data |

The first seven are the **primitive types**, and their values are called **primitives**. The eighth, object, is the only non-primitive type: arrays, functions, dates, maps, regular expressions and class instances are all objects. So the slogan "everything in JavaScript is an object" is wrong — seven of the eight types are not.

This lesson teaches the seven primitives one at a time: what each is for, how it behaves, and where it surprises people. Objects get their own lesson, [[b1-objects-as-values]], and the consequences of the primitive/object split — copying, mutation, passing to functions — are covered in [[b1-primitive-vs-reference]].

## Before you start

- **Variables and assignment** — how `let` and `const` give a name to a value. See [[b1-variables]]; this lesson is about the values those names hold.
- **Expressions** — that `1 + 2` and `'a' === 'b'` are expressions that produce a value. See [[b1-statements-expressions]].

You do not need to know anything about objects or prototypes yet. When a section touches them it explains the one fact it needs.

## The intuition

Think of primitives as **atoms** and objects as **containers**. An atom such as the number `7` or the string `'red'` has no parts you can change. You can combine atoms to make new atoms — `7 + 1` gives `8`, `'red'.toUpperCase()` gives `'RED'` — but the original `7` and `'red'` are untouched. A container such as `{ colour: 'red' }` holds other values, and you can open it and swap what is inside.

This one picture explains three properties that every primitive shares:

1. **Primitives are immutable.** No operation changes a primitive in place; every "change" produces a new value. Details in [[b1-immutability-primitives]].
2. **Primitives are compared by value.** Two strings with the same characters are equal (`'red' === 'red'` is `true`), no matter where they came from. Two separately created objects are never `===`, even if their contents match.
3. **Primitives have no properties of their own.** Yet you can write `'red'.length`. The next section explains how.

Where the analogy stops: "atom" says nothing about *where* the value lives in memory. Many engines store long strings and many numbers on the heap, as they do objects. What makes a value primitive is how the language lets you use it, not where the engine keeps it.

## How primitives get methods: autoboxing

If primitives have no properties, how does `'hello'.toUpperCase()` work? When you access a property on a string, number, bigint, boolean or symbol, JavaScript temporarily wraps the primitive in a matching **wrapper object** — `String`, `Number`, `BigInt`, `Boolean` or `Symbol` — looks the property up on that wrapper (which finds `toUpperCase` on `String.prototype`), and then throws the wrapper away. This is called **autoboxing**; the full story is in [[b1-autoboxing]].

Because the wrapper is discarded immediately, writing a property onto a primitive goes nowhere:

```javascript title="autobox-sloppy.js"
const s = 'hi';
s.extra = 1;               // written to a temporary wrapper, then lost
console.log(s.extra);
(true).x = 1;
console.log((true).x);
console.log('hi'.length, 'hi'.toUpperCase());
```

```output
undefined
undefined
2 HI
```

In sloppy (non-strict) mode the write silently disappears. In [[b1-strict-mode|strict mode]] — which ES modules and class bodies use automatically — the same writes throw, which is much easier to debug:

```javascript title="autobox-strict.js"
'use strict';
const s = 'hi';
try { s.extra = 1; } catch (e) { console.log(e.name + ': ' + e.message); }
try { s[0] = 'X'; } catch (e) { console.log(e.name + ': ' + e.message); }
try { null.x; } catch (e) { console.log(e.name + ': ' + e.message); }
try { undefined.length; } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
TypeError: Cannot create property 'extra' on string 'hi'
TypeError: Cannot assign to read only property '0' of string 'hi'
TypeError: Cannot read properties of null (reading 'x')
TypeError: Cannot read properties of undefined (reading 'length')
```

The last two lines show the exception to autoboxing: **`null` and `undefined` have no wrapper type**, so reading *any* property on them throws a `TypeError` in every mode. "Cannot read properties of undefined" is probably the most common runtime error in JavaScript, and it always means the same thing: a value you expected to be an object was one of the two "empty" primitives. (Error messages in this lesson come from Node.js 22, which uses the V8 engine; other engines word them differently.)

> [!WARNING] Never construct wrappers yourself
> `new String('a')`, `new Number(1)` and `new Boolean(false)` create real objects. They are not `===` to their primitive, `typeof` reports `"object"`, and `new Boolean(false)` is truthy. Calling the same functions *without* `new` — `String(x)`, `Number(x)`, `Boolean(x)` — is fine: that converts `x` to a primitive.

## string {#b1-type-string}

A **string** is JavaScript's type for text: a sequence of characters such as `'Ada'`, a URL, a JSON document or an empty `''`. Strings are primitives, so they are immutable and compared by their contents. Nearly everything the web exchanges — HTML, form input, HTTP headers, JSON keys — arrives as strings, so this is the primitive you will handle most.

You can write a string literal three ways. Single and double quotes are identical; pick one and be consistent. Backticks create a **template literal**, which allows interpolation with `${…}` and can span several lines (see [[b1-template-literals]]).

```javascript title="string-basics.js"
const name = 'Ada';
const greeting = `Hello, ${name}.`;
console.log(greeting, greeting.length);
console.log(greeting[0], greeting[99]);
console.log(greeting.toUpperCase());
console.log(greeting);
```

```output
Hello, Ada. 11
H undefined
HELLO, ADA.
Hello, Ada.
```

Indexing with `[i]` returns a one-character string, or `undefined` if the index is out of range — never an error. `toUpperCase()` returns a *new* string; the last line proves `greeting` itself did not change. This is true of every string method: `trim`, `replace`, `slice`, `padStart` and the rest all return new strings. If you forget to store the result, the "change" is lost:

```javascript title="trim-trap.js"
let input = '  ada@example.com ';
input.trim();                 // result thrown away
console.log(`[${input}]`);
input = input.trim();         // store the new string
console.log(`[${input}]`);
```

```output
[  ada@example.com ]
[ada@example.com]
```

### What length really counts

JavaScript strings are sequences of **UTF-16 code units** — 16-bit numbers. Most characters you type (Latin letters, digits, most Chinese and Arabic characters) fit in one code unit. Characters outside the Basic Multilingual Plane, including most emoji, need two code units, called a **surrogate pair**. `length` counts code units, not the characters a human sees:

```javascript title="unicode-length.js"
const face = '😀';
console.log(face.length);                       // code units
console.log([...face].length);                  // code points
console.log(face.codePointAt(0).toString(16));  // U+1F600
console.log(face.slice(0, 1) === face);         // slicing cut the pair in half
console.log(['b', 'a', 'Z', '10', '9'].sort());
console.log(['b', 'a', 'Z'].sort((x, y) => x.localeCompare(y)));
```

```output
2
1
1f600
false
[ '10', '9', 'Z', 'a', 'b' ]
[ 'a', 'b', 'Z' ]
```

Spreading a string (`[...face]`) or looping with `for...of` iterates by **code point**, which keeps surrogate pairs together; `slice`, `[i]` and `length` work on code units and can split them. Even code points are not always what a person calls one character — a flag or a family emoji is several code points joined together. For user-facing limits such as "maximum 20 characters", `Intl.Segmenter` counts grapheme clusters; [[b1-unicode-strings]] covers this properly.

The last two lines show how strings compare. `<`, `>` and the default `sort()` compare code unit by code unit, so every uppercase letter sorts before every lowercase letter, and `'10'` sorts before `'9'` because `'1'` comes before `'9'`. For text shown to people, use `localeCompare` or `Intl.Collator`, which follow the user's language rules.

### Truthiness and conversion

The empty string `''` is the only falsy string. `'0'`, `' '` and `'false'` are all truthy because they are non-empty. Converting other values to strings happens with `String(x)`, template literals, or `+` when one side is a string (`'a' + 1` is `'a1'`); those rules belong to [[b1-string-conversion]] and [[b1-type-coercion]].

## number {#b1-type-number}

A **number** in JavaScript is a 64-bit floating-point value in the IEEE 754 "double precision" format. There is no separate integer type: `42` and `42.5` have the same type, and `7 / 2` is `3.5`, not `3`. One type for all arithmetic kept the original 1995 language small; the cost is a handful of behaviours every JavaScript developer must know.

A double stores a number like scientific notation in binary: a sign, an 11-bit exponent and a 52-bit fraction (53 bits of precision counting an implied leading bit). That gives roughly 15–17 significant decimal digits and a huge range, but two consequences follow.

**Most decimal fractions are not exact.** `0.1` cannot be written as a finite binary fraction, any more than 1/3 can be written as a finite decimal. The stored value is the nearest representable double, and small errors show up when you combine them:

```javascript title="number-basics.js"
console.log(7 / 2, 2 ** 10, 10 % 3);
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 === 2 ** 53 + 1);
console.log(1 / 0, -1 / 0, 0 / 0);
```

```output
3.5 1024 1
0.30000000000000004
false
true
9007199254740991
true
Infinity -Infinity NaN
```

This is not a JavaScript bug — Java's `double`, Python's `float` and C's `double` print the same thing. The practical rules: never compare computed fractions with `===`; compare with a tolerance suited to your data, and for money store **integer cents** (or use a decimal library) so arithmetic stays exact. [[b1-floating-point]] explains the rounding in depth.

**Integers are exact only up to 2⁵³ − 1.** Every integer from −(2⁵³ − 1) to 2⁵³ − 1 (`Number.MAX_SAFE_INTEGER`, 9,007,199,254,740,991) is represented exactly. Beyond that, the gaps between representable doubles grow larger than 1, so `2 ** 53 + 1` rounds back to `2 ** 53`. Database IDs, Twitter-style snowflake IDs and nanosecond timestamps can exceed that limit, which is why APIs often send them as strings and why [[b1-type-bigint|bigint]] exists. See [[b1-safe-integers]].

**Some results are special values.** Division by zero gives `Infinity` or `-Infinity` rather than throwing, and undefined operations such as `0 / 0` or `Number('abc')` give `NaN` ("Not a Number"), which is still of type number. There is also a negative zero, `-0`, which `===` treats as equal to `0`. These are covered in [[b1-nan-infinity]].

### Writing and parsing numbers

Number literals can be decimal (`255`), hexadecimal (`0xff`), binary (`0b1111_1111`), octal (`0o377`) or exponential (`2.5e3`). Since ES2021 you can put underscores between digits for readability: `1_000_000`.

Turning text into a number is a frequent source of bugs:

```javascript title="number-parsing.js"
console.log(Number('42'), Number('42px'), parseInt('42px', 10), Number(''));
console.log(Number.isInteger(5.0), Number.isInteger(5.5));
console.log((1234.5678).toFixed(2), typeof (1234.5678).toFixed(2));
console.log(2 ** 32 | 0, (2 ** 31) | 0);
```

```output
42 NaN 42 0
true false
1234.57 string
0 -2147483648
```

`Number(text)` is strict: the whole string must be numeric, otherwise `NaN` — except that the empty string converts to `0`, a trap when validating form fields. `parseInt` reads digits until it hits something else, so `'42px'` gives `42`, which is helpful for CSS values and dangerous for validation. Always pass the radix (`10`): modern engines no longer treat a leading `0` as octal, but the radix documents intent and handles strings like `'0x1A'` predictably. `toFixed` returns a *string*, not a rounded number. The last line shows that **bitwise operators convert their operands to 32-bit signed integers** first, so `| 0` is not a safe way to truncate large numbers. Conversions are taught fully in [[b1-parseint-parsefloat]] and [[b1-number-conversion]].

For validation, prefer the `Number.` methods, which do not coerce: `Number.isFinite`, `Number.isInteger`, `Number.isSafeInteger` and `Number.isNaN`.

## bigint {#b1-type-bigint}

A **bigint** is an integer of arbitrary size. Added in ES2020, it exists because the number type cannot represent every integer above 2⁵³ − 1. You create one by putting `n` after an integer literal (`10n`) or by calling `BigInt(value)`.

The classic motivating bug: an API returns the order ID `9007199254740993`. If that ever passes through a number, it silently becomes a different ID.

```javascript title="bigint-basics.js"
console.log(9007199254740993);    // number literal: rounded at parse time
console.log(9007199254740993n);   // bigint literal: exact
console.log(2n ** 64n);
console.log(7n / 2n, -7n / 2n, 7n % 2n);
try { console.log(1n + 1); } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(1n + BigInt(1), Number(1n) + 1);
console.log(1n == 1, 1n === 1, 2n > 1, typeof 1n);
```

```output
9007199254740992
9007199254740993n
18446744073709551616n
3n -3n 1n
TypeError: Cannot mix BigInt and other types, use explicit conversions
2n 2
true false true bigint
```

Look at the first line carefully. The number literal is rounded *while the source code is parsed* — the value `9007199254740993` never exists as a number at all. That is why large IDs must be sent as strings in JSON and converted with `BigInt('9007199254740993')`, never with `BigInt(9007199254740993)`.

Bigint arithmetic is integer arithmetic. Division **truncates toward zero** (`7n / 2n` is `3n`, `-7n / 2n` is `-3n`), and there is no fractional part to lose. There is no bigint `NaN` or `Infinity`: dividing by `0n` throws a `RangeError`.

The most important rule is that **bigint and number never mix in arithmetic**. `1n + 1` throws instead of guessing, because any automatic conversion could lose information in one direction or the other: a bigint may be too large for a number, and a number may have a fraction a bigint cannot hold. You convert explicitly — `BigInt(1)` or `Number(1n)` — and accept the consequences. Comparisons are allowed across the two types: `1n == 1` and `2n > 1` are `true`, but `1n === 1` is `false` because the types differ.

A few more edges, all verified in Node.js 22:

```javascript title="bigint-edges.js"
try { JSON.stringify({ id: 1n }); } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(JSON.stringify({ id: 1n }, (k, v) => typeof v === 'bigint' ? v.toString() : v));
try { BigInt(1.5); } catch (e) { console.log(e.name + ': ' + e.message); }
try { Math.max(1n, 2n); } catch (e) { console.log(e.name + ': ' + e.message); }
try { +1n; } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(0n ? 'truthy' : 'falsy', 5n >> 1n, 1n << 70n);
```

```output
TypeError: Do not know how to serialize a BigInt
{"id":"1"}
RangeError: The number 1.5 cannot be converted to a BigInt because it is not an integer
TypeError: Cannot convert a BigInt value to a number
TypeError: Cannot convert a BigInt value to a number
falsy 2n 1180591620717411303424n
```

Read the last line slowly: `5n >> 1n` is `2n`, and `1n << 70n` produces a 71-bit value with no overflow, because bitwise operators on bigints work at arbitrary width rather than truncating to 32 bits. `JSON.stringify` refuses bigints, so you need a replacer (as shown) or a `toJSON` convention agreed with whoever parses the output. `Math` functions and unary `+` accept only numbers. `0n` is falsy like `0`. The unsigned shift `>>>` is not defined for bigints and throws.

When should you use bigint? For integers that may exceed 2⁵³ − 1 — 64-bit database IDs, cryptographic values, exact counters — and when talking to APIs such as `BigInt64Array` or Node's `process.hrtime.bigint()`. Do not use it for ordinary counting or array indexes: bigint arithmetic is slower than number arithmetic, and array methods expect numbers. The dedicated lesson is [[b1-bigint]].

## boolean {#b1-type-boolean}

A **boolean** has exactly two values, `true` and `false`. It is the type of every yes/no answer: comparisons (`5 > 3`, `a === b`), the `!` operator, `Array.isArray(x)`, `instanceof` and most `is…`/`has…` methods produce booleans.

What makes booleans interesting is that conditions do not require them. `if`, `while`, the ternary `?:` and the `!` operator accept *any* value and convert it with an internal rule called ToBoolean. Values that convert to `false` are called **falsy**; everything else is **truthy**. The falsy list is short and worth memorising:

| Falsy value | Type |
|---|---|
| `false` | boolean |
| `0`, `-0` | number |
| `0n` | bigint |
| `''` (empty string) | string |
| `null` | null |
| `undefined` | undefined |
| `NaN` | number |

Every object is truthy — including empty arrays, empty objects and wrapper objects:

```javascript title="boolean-basics.js"
console.log(Boolean('false'), Boolean([]), Boolean({}), Boolean('0'));
const boxed = new Boolean(false);
if (boxed) console.log('boxed false is truthy');
console.log(typeof boxed, boxed.valueOf());
console.log(5 > 3, !0, !!'text');
console.log(0 || 'default', 'set' && 'second', null ?? 'fallback');
console.log(true + true, true == 1, true === 1);
```

```output
true true true true
boxed false is truthy
object false
true true true
default second fallback
2 true false
```

`new Boolean(false)` is an object wrapping `false`, and because all objects are truthy the `if` runs. This is a classic interview question and the reason never to construct wrappers. To convert a value to a real boolean, use `Boolean(x)` or `!!x` — both apply ToBoolean and return a primitive.

The `||`, `&&` and `??` operators do **not** return booleans; they return one of their operands. `0 || 'default'` returns `'default'` because `0` is falsy. That is useful for defaults, but it is also a bug when `0` or `''` is a legitimate value — a quantity of zero would be replaced. `??` (nullish coalescing) only falls through for `null` and `undefined`, so `count ?? 1` keeps a real `0`. See [[b1-logical-operators]] and [[b1-nullish-coalescing]].

The last line shows that booleans convert to `1` and `0` in arithmetic and with loose equality `==`, but `===` never equates values of different types. Two practical guidelines follow. When a value might legitimately be `0`, `''` or `null`, test for the exact thing you mean (`count === 0`, `name === ''`) instead of relying on truthiness. And when you design an API, return real booleans from predicate functions rather than `0`/`1` or a truthy object, so callers can use `===` safely. The full truthiness rules are in [[b1-truthy-falsy]].

## undefined {#b1-type-undefined}

**undefined** is a type with a single value, also written `undefined`. It is the language's default "no value": JavaScript produces it automatically whenever something has not been given a value. You will rarely need to write `undefined` yourself, but you will read it constantly.

```javascript title="undefined-sources.js"
let notYetSet;
const user = { name: 'Ada' };
function greet(name) { return name; }
function noReturn() {}
const [first, second] = [10];

console.log(notYetSet);        // declared, never assigned
console.log(user.email);       // property does not exist
console.log(greet());          // argument not passed
console.log(noReturn());       // function without return
console.log(second);           // destructuring found nothing
console.log(void 0);           // the void operator
```

```output
undefined
undefined
undefined
undefined
undefined
undefined
```

Each line is a different situation, but the meaning is the same: *nothing was provided here*. Reading a missing property does not throw; it returns `undefined`. That forgiving behaviour is convenient, but it lets typos travel: `user.emial` is `undefined` rather than an error, and the crash happens later when something calls `.toLowerCase()` on it.

Three behaviours depend on `undefined` specifically, and they surprise people because `null` does not trigger them:

```javascript title="undefined-behaviour.js"
function withDefault(pageSize = 20) { return pageSize; }
console.log(withDefault(), withDefault(undefined), withDefault(null), withDefault(0));
const o = { a: undefined };
console.log(o.a, o.b, 'a' in o, 'b' in o, Object.hasOwn(o, 'a'));
console.log(JSON.stringify({ a: undefined, b: null }), JSON.stringify([undefined, null]));
```

```output
20 20 null 0
undefined undefined true false true
{"b":null} [null,null]
```

**Default parameters** (and destructuring defaults) apply only when the value is `undefined`; passing `null` or `0` keeps that value. **A property can exist and hold `undefined`**, which reads the same as a missing property; use `'a' in o` or `Object.hasOwn(o, 'a')` when the difference matters (see [[b1-object-hasown]]). **JSON has no `undefined`**: `JSON.stringify` drops properties whose value is `undefined` and turns `undefined` array elements into `null`.

Two historical notes. `undefined` is not a keyword; it is a read-only property of the global object (read-only since ES5). Inside a function you can still declare a *local* variable named `undefined`, which is why older code wrote `void 0` — the `void` operator evaluates its operand and always returns the real `undefined`. Modern linters forbid shadowing `undefined`, so you can write `x === undefined` with confidence.

Finally, do not confuse an `undefined` *value* with an *undeclared* variable. Reading a variable that was never declared does not give `undefined`; it throws a `ReferenceError`. That distinction, and when to choose `undefined` or `null`, is the subject of [[b1-undefined-vs-null]].

## null {#b1-type-null}

**null** is a type with a single value, `null`, meaning "intentionally empty". Where `undefined` usually means *nobody provided a value*, `null` means *somebody deliberately said there is no value*. The language itself almost never produces `null` on its own; it comes from code — yours, the DOM's, or a server's JSON.

```javascript title="null-basics.js"
let selectedUser = null;            // nothing selected yet, on purpose
console.log(selectedUser, typeof selectedUser);
console.log('abc'.match(/x/));      // no match
console.log(Object.getPrototypeOf(Object.prototype));
console.log(JSON.parse('{"middleName":null}').middleName);
console.log(selectedUser === null, selectedUser == undefined);
console.log(selectedUser ?? 'nobody', selectedUser?.name);
console.log(Object.prototype.toString.call(null));
```

```output
null object
null
null
null
true true
nobody undefined
[object Null]
```

The second line of output contains the famous quirk: **`typeof null` is `"object"`**. That is a bug from the first implementation of JavaScript, kept forever because fixing it would break existing websites. `null` is a primitive — you cannot put properties on it, and reading one throws. Test for it with `=== null`; the history and safe checking patterns are in [[b1-typeof-null]]. `Object.prototype.toString.call(null)` gives the honest answer `"[object Null]"`.

You meet `null` in standard APIs whenever a lookup can legitimately find nothing: `document.querySelector` and `getElementById` return `null` when no element matches (a browser-only API, described here from the DOM specification), `String.prototype.match` returns `null` when the pattern does not match, `localStorage.getItem` returns `null` for a missing key, and the prototype chain ends at `null`. In JSON, `null` is the only way to send "no value", because JSON has no `undefined`.

Under loose equality, `null == undefined` is `true` and neither is loosely equal to anything else — not `0`, not `''`, not `false`. That makes `value == null` a compact, well-known idiom for "is it `null` or `undefined`?". With `===`, they are different. The operators `??` and `?.` treat `null` and `undefined` the same way: `selectedUser ?? 'nobody'` supplies a fallback, and `selectedUser?.name` short-circuits to `undefined` instead of throwing (see [[b1-optional-chaining]]).

When should your own code use `null`? A useful convention: use `null` for "this has been looked at and there is nothing", such as a selected item, a cleared form field, or a database column with no value, and let `undefined` mean "not provided". Initialising a variable to `null` is reasonable when it will later hold an object; for numbers and strings, a real starting value such as `0` or `''` often removes the need for null checks entirely. Whatever you choose, be consistent within an API so that callers know which one to test for.

## symbol {#b1-type-symbol-overview}

A **symbol** is a primitive whose only job is to be **unique**. Every call to `Symbol()` produces a brand-new value that is equal to nothing except itself. Symbols were added in ES2015 so that code could create object property keys that can never collide with anyone else's keys — not with the object's normal properties, and not with keys added by other libraries.

```javascript title="symbol-basics.js"
const a = Symbol('id');
const b = Symbol('id');
console.log(a === b, a.description, typeof a);
const user = { name: 'Ada', [a]: 7 };
console.log(user[a], Object.keys(user), JSON.stringify(user));
console.log(Object.getOwnPropertySymbols(user), Reflect.ownKeys(user));
console.log(Symbol.for('app.id') === Symbol.for('app.id'));
try { console.log('key: ' + a); } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(String(a));
for (const k in user) console.log('for-in sees', k);
```

```output
false id symbol
7 [ 'name' ] {"name":"Ada"}
[ Symbol(id) ] [ 'name', Symbol(id) ]
true
TypeError: Cannot convert a Symbol value to a string
Symbol(id)
for-in sees name
```

The string passed to `Symbol('id')` is only a **description** for debugging; two symbols with the same description are still different values. You use a symbol as a key with computed-property syntax `[a]: 7` and read it with `user[a]` — there is no dot syntax for symbol keys, because the dot always means a string key.

Symbol-keyed properties are **hidden from the usual enumeration**: `Object.keys`, `for...in` and `JSON.stringify` all skip them. They are not private — `Object.getOwnPropertySymbols` and `Reflect.ownKeys` list them — but they will not show up by accident or be serialised. This is useful for attaching metadata to objects you do not own, and a trap if you expected that data to survive a JSON round trip.

Symbols refuse implicit conversion to strings: `'key: ' + a` throws, which prevents a symbol from silently turning into a string key such as `"Symbol(id)"`. Explicit `String(a)` or `a.toString()` works. `Symbol` cannot be called with `new`.

Two more ideas complete the overview. `Symbol.for('app.id')` looks the key up in a **global symbol registry** and returns the same symbol every time for the same string, even across iframes or modules — useful when separate pieces of code must agree on a key (see [[b1-symbol-for]]). And JavaScript itself defines **well-known symbols** such as `Symbol.iterator`, `Symbol.toPrimitive` and `Symbol.toStringTag`; when an object has a method under one of those keys, the language calls it to customise built-in behaviour. That is how `for...of` knows how to loop over your object. These are taught in [[b1-symbols]] and [[b1-well-known-symbols]].

In everyday application code you rarely create symbols. Plain string keys are clearer for public data. Symbols earn their place in libraries and frameworks that need a key nobody else can accidentally use.

```quiz
Q: Which line throws a TypeError?
- [ ] `const n = 1n == 1;`
- [x] `const n = 1n + 1;`
- [ ] `const n = Number(1n) + 1;`
- [ ] `const n = 2n > 1;`
> Arithmetic between bigint and number is forbidden because any automatic conversion could lose information. Comparisons (`==`, `>`) across the two types are allowed, and `Number(1n)` is an explicit conversion, so only `1n + 1` throws.

Q: What does `'😀'.length` evaluate to?
- [ ] 1, because it is one character
- [x] 2, because the emoji is stored as a surrogate pair of UTF-16 code units
- [ ] 4, because it takes four bytes in UTF-8
- [ ] It throws, because emoji are not valid in strings
> `length` counts UTF-16 code units. Characters outside the Basic Multilingual Plane, such as most emoji, take two. UTF-8 byte counts are irrelevant to JavaScript strings; `[...'😀'].length` gives 1 code point.

Q: `function f(limit = 10) { return limit; }` — what does `f(null)` return?
- [ ] 10
- [x] null
- [ ] undefined
- [ ] It throws
> Default parameters apply only when the argument is `undefined`. `null` is a real value that the caller passed on purpose, so it is kept. Use `limit ?? 10` inside the body if `null` should also fall back.
```

## How it works internally

The specification describes values abstractly: there is an operation called `Type(x)` that returns one of the eight type names, and every operator is defined by cases on those types. For example, the `+` operator converts both operands to primitives, then concatenates if either is a string, throws if one is a bigint and the other a number, and otherwise adds numerically. When you wonder why an operator behaved a certain way, the answer is always "which types were the operands?".

Engines are free to store values however they like, as long as the observable behaviour matches. As an illustration, V8 (Chrome, Node.js, Deno) does roughly this:

- Small integers (31 or 32 bits depending on platform and build) are stored directly inside the value slot as **Smis** ("small integers") — no allocation at all. Other numbers are boxed as heap numbers or kept unboxed in optimised code. All of them report `typeof` `"number"`; the difference is invisible to your program.
- Strings live on the heap. V8 has several internal string representations — flat strings, concatenation "ropes" built by `+`, and slices — and may **internalise** (deduplicate) strings used as property names. None of this makes strings mutable; it only makes them cheaper.
- `undefined`, `null`, `true` and `false` are single preallocated values (V8 calls them oddballs), so every `undefined` in the program is the same bit pattern.
- Bigints are heap objects holding an array of digits, which is why their arithmetic is slower.

The lesson to draw is not the details, which change between versions. It is that **"primitive" is a language-level guarantee** — immutable, compared by value, no own properties — and not a statement about stack versus heap. The engine internals are explored in [[b1-v8-architecture]].

## Worked example: typing an API payload

A realistic task: a checkout page receives an order from a server as JSON and needs to turn it into values the rest of the code can trust. Each field calls for a different primitive.

```javascript title="order.js"
// A JSON payload from an order API. The id is sent as a string on purpose.
const body = '{"orderId":"9007199254740993","totalCents":1999,"paid":false,"coupon":null}';
const raw = JSON.parse(body);

const order = {
  id: BigInt(raw.orderId),               // too large for number: keep it exact
  totalCents: raw.totalCents,             // integer cents avoid 0.1 + 0.2 problems
  paid: raw.paid === true,                // a real boolean, never a truthy string
  coupon: raw.coupon,                     // null: the API says "no coupon"
  note: raw.note,                         // undefined: the field was not sent
  tag: Symbol('order'),                   // a private, collision-free marker
};

for (const [key, value] of Object.entries(order)) {
  const shown = typeof value === 'symbol' ? value.toString() : String(value);
  console.log(key.padEnd(11), (value === null ? 'null' : typeof value).padEnd(10), shown);
}
console.log('total:', `$${(order.totalCents / 100).toFixed(2)}`);
console.log('next id:', order.id + 1n);
console.log('lossy id:', Number(raw.orderId));
```

```output
id          bigint     9007199254740993
totalCents  number     1999
paid        boolean    false
coupon      null       null
note        undefined  undefined
tag         symbol     Symbol(order)
total: $19.99
next id: 9007199254740994n
lossy id: 9007199254740992
```

Walk through the decisions. The server sends `orderId` as a string because a JSON number would be parsed into a JavaScript number and rounded — the final line shows exactly the wrong ID you would get. `BigInt(raw.orderId)` keeps it exact, and `order.id + 1n` stays in bigint arithmetic. The total is an integer number of cents, so sums and discounts stay exact; it is divided by 100 only for display, and `toFixed(2)` returns a string because it is formatting, not arithmetic.

`paid` uses `raw.paid === true` rather than `Boolean(raw.paid)`. If a buggy server ever sent `"false"` as a string, `Boolean("false")` would be `true` and the order would show as paid; the strict comparison accepts only a real `true`. `coupon` keeps the server's `null`, which means "checked, no coupon", while `note` is `undefined` because the field was never sent — two different kinds of absence that [[b1-undefined-vs-null]] explores. The type column needed `value === null ? 'null' : typeof value`, because `typeof null` would have printed `object`. And the symbol had to be converted with `toString()`, because symbols refuse implicit string conversion.

## In real systems

**JSON boundaries decide your types.** JSON has strings, numbers, booleans, `null`, arrays and objects — no `undefined`, bigint, symbol, `NaN` or `Infinity`. Every value that crosses an HTTP boundary passes through that filter: `undefined` fields vanish, `NaN` becomes `null`, and large integers lose precision unless sent as strings. Well-designed APIs (for example, many payment and social-media APIs) send 64-bit IDs as strings for exactly this reason. See [[b1-json-unsupported]].

**Money is integers.** Payment systems store amounts in the smallest currency unit (cents, pence, paise) as integers, or use a decimal type on the server. Front-end code that formats prices uses `Intl.NumberFormat`, not hand-written rounding.

**Form input is always a string.** `input.value` is a string even for `<input type="number">`, so every numeric form needs an explicit, validated conversion — usually `Number(value)` plus `Number.isFinite`, with a separate check for the empty string, which `Number` turns into `0`.

**Flags should be booleans.** Feature flags, permissions and toggles that are sometimes `0`/`1`, sometimes `'true'`/`'false'` strings, cause bugs at every truthiness check. Normalise them to real booleans at the boundary.

**Symbols in frameworks.** Libraries use symbols for internal markers that must not clash with user data. React, for example, tags its element objects with a `$$typeof` property whose value is a symbol, which helps protect against injected JSON masquerading as an element, since JSON cannot contain symbols.

## Trade-offs and alternatives

| Need | Good choice | Why | Avoid |
|---|---|---|---|
| Counts, indexes, measurements | number | Fast, works with every API | bigint (slower, incompatible with `Math` and indexes) |
| Integers beyond 2⁵³ − 1, 64-bit IDs | bigint, or keep as string | Exact | number (silently rounds) |
| Money | integer number of cents, or a decimal library | Exact arithmetic | fractional numbers |
| Text, keys, identifiers from outside | string | Universal, JSON-safe | — |
| Yes/no state | boolean | Unambiguous with `===` | `0`/`1`, `'true'`/`'false'` |
| "Not provided" | undefined | Language default; triggers default params | — |
| "Deliberately empty" | null | Explicit; survives JSON | an empty-string or `-1` sentinel |
| Collision-free metadata key | symbol | Unique; hidden from JSON and `Object.keys` | strings like `'__internal'` |

The deeper trade-off is JavaScript's design itself: one floating-point number type and loose conversions keep simple scripts short, but push precision and type checks onto you. TypeScript (see [[b2-narrowing]]) moves many of those checks to compile time, but it cannot change runtime behaviour — `0.1 + 0.2` is still `0.30000000000000004` in TypeScript.

## Common mistakes

**Expecting a string method to modify the string.** `name.trim()` alone does nothing visible. Assign the result: `name = name.trim()`.

**Comparing floating-point results with `===`.** `0.1 + 0.2 === 0.3` is `false`. Use integer units or a tolerance.

**Passing large IDs through numbers.** `Number('9007199254740993')` and the number literal `9007199254740993` both round. Keep IDs as strings, or convert with `BigInt(string)`.

**Mixing bigint and number.** `total + 1` throws when `total` is a bigint. Convert one side explicitly, and think about which direction is safe.

**Using `||` for defaults when zero or the empty string is valid.** `quantity || 1` turns a real `0` into `1`. Use `quantity ?? 1`.

> [!MISTAKE] Constructing wrapper objects
> `new Boolean(false)` is truthy, `new String('a') === 'a'` is `false`, and `typeof new Number(1)` is `"object"`. Use the primitive literals, and call `Boolean(x)`, `String(x)`, `Number(x)` without `new` to convert.

**Assuming `typeof` tells you everything.** `typeof null` is `"object"` and `typeof []` is `"object"`. Use `=== null` and `Array.isArray`. See [[b1-typeof]].

**Counting characters with `length`.** User-visible character limits break on emoji and accented characters built from combining marks. Count code points with `[...s].length`, or grapheme clusters with `Intl.Segmenter`.

## Interview perspective

Interviewers use this topic to check that you know the language's foundations precisely rather than approximately. Short, exact answers score well.

> [!INTERVIEW] "What are JavaScript's data types?"
> "There are eight types. Seven are primitives — string, number, bigint, boolean, undefined, null and symbol — and the eighth is object, which covers arrays, functions, dates and everything else. Primitives are immutable and compared by value; objects are mutable and compared by identity. Two quirks worth mentioning: `typeof null` returns `'object'` for historical reasons, and `typeof` a function returns `'function'` even though functions are objects."

Questions to be ready for:

- **How can `'abc'.length` work if primitives have no properties?** Autoboxing: the engine wraps the primitive in a temporary `String` object for the property lookup and discards it.
- **Why is `0.1 + 0.2 !== 0.3`?** Numbers are IEEE 754 doubles; 0.1 and 0.2 are stored as the nearest binary fractions, and their sum rounds to a double slightly above 0.3. Mention integer cents for money.
- **What is `Number.MAX_SAFE_INTEGER` and why does it matter?** 2⁵³ − 1; above it not every integer is representable, so IDs can silently change. Use bigint or strings.
- **Why does `1n + 1` throw?** Implicit conversion could lose precision either way, so the language requires an explicit `BigInt()` or `Number()`.
- **List the falsy values.** `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Follow-up: is `[]` falsy? No — every object is truthy.
- **What are symbols for?** Unique property keys that cannot collide and are skipped by `Object.keys` and JSON; well-known symbols let objects hook into language protocols such as iteration.

A good follow-up to anticipate: *"Is `undefined` a keyword?"* No — it is a read-only global property, which is why `void 0` was historically used as a guaranteed `undefined`.

## Practice

1. **Classify by hand.** For each value, write its type before running the code: `'0'`, `0`, `0n`, `-0`, `NaN`, `null`, `[]`, `Symbol()`, `` `${1}` ``, `void 0`, `new String('')`, `2 ** 53 + 1`. Then check which are falsy.
2. **Price parser.** Write `parsePrice(text)` that turns strings like `'19.99'` into an integer number of cents (`1999`) and returns `null` for empty or invalid input. Make sure `''` does not become `0`, and that `'19.999'` is rejected.
3. **ID safety check.** Write `isSafeId(text)` that returns `true` only if a numeric string can be converted to a number without losing precision. Use `BigInt` and `Number.isSafeInteger`.
4. **Strict mode experiment.** Run the autoboxing example with and without `'use strict'`, then as an ES module (`.mjs`). Explain each difference.
5. **Symbol metadata.** Attach a symbol-keyed `createdAt` to a plain object, then show which of `Object.keys`, `JSON.stringify`, `{ ...obj }` and `Reflect.ownKeys` see it.

## Quick revision {#quick-revision}

- Eight types: string, number, bigint, boolean, undefined, null, symbol (primitives) + object. Arrays and functions are objects.
- Primitives: immutable, compared by value, no own properties. Property access autoboxes into a temporary wrapper; `null`/`undefined` cannot be boxed and throw on property access.
- Writes to a primitive's property: silently lost in sloppy mode, `TypeError` in strict mode.
- string: UTF-16 code units; `length` counts units (emoji = 2); methods return new strings; `''` is the only falsy string; default comparison is by code unit.
- number: IEEE 754 double; `0.1 + 0.2 !== 0.3`; exact integers only to 2⁵³ − 1; `NaN`, `±Infinity`, `-0` are numbers; bitwise ops truncate to 32 bits; `Number('')` is `0`.
- bigint: `10n` or `BigInt('…')`; arbitrary size; division truncates toward zero; no mixing with number in arithmetic; comparisons across types allowed; `JSON.stringify` throws.
- boolean: falsy = `false, 0, -0, 0n, '', null, undefined, NaN`; all objects truthy, including `new Boolean(false)`; `||`/`&&`/`??` return operands.
- undefined: automatic "no value"; triggers default params; dropped by JSON; read-only global, not a keyword.
- null: deliberate "empty"; `typeof null === 'object'` (legacy bug); `null == undefined` only; use `=== null`.
- symbol: unique key; description is only a label; skipped by `Object.keys`, `for...in`, JSON; `Symbol.for` shares via a global registry; well-known symbols hook language behaviour.

## Key takeaways {#key-takeaways}

- JavaScript has seven primitive types and one object type; "everything is an object" is false.
- Primitives are immutable atoms compared by value; methods on them work through temporary wrapper objects.
- `number` is a 64-bit float: expect rounding in fractions and loss of precision above 2⁵³ − 1, and use integer cents or bigint where exactness matters.
- `bigint` gives exact integers of any size but refuses to mix with `number` without an explicit conversion.
- Conditions use truthiness; memorise the eight falsy values and prefer explicit comparisons when `0` or `''` are valid.
- `undefined` means "not provided" and `null` means "deliberately empty"; they behave differently with default parameters and JSON.
- Symbols create collision-free keys and power the language's built-in protocols.
