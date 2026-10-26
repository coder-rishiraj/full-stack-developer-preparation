---
summary: typeof is the operator that tells you, at run time, which broad category a value belongs to. You will learn its eight possible answers, the special cases (null, functions, undeclared variables), what it cannot tell you, and which tools to combine it with for reliable type checks.
difficulty: beginner
minutes: 40
objectives:
  - List the eight strings typeof can return and predict the result for any value
  - Explain why typeof null is "object" and write null-safe object checks
  - Use typeof safely on undeclared variables for feature detection, and explain why it throws in the temporal dead zone
  - Choose between typeof, Array.isArray, instanceof and Object.prototype.toString for a given check
  - Write a runtime type-describing helper that handles null, arrays and built-in objects correctly
---

## Introduction

JavaScript is dynamically typed: a variable can hold a number now and a string later, and a function parameter can receive anything the caller passes. Code that handles user input, JSON from a server, optional arguments or library callbacks therefore often needs to ask, while running, *what kind of value is this?*

The `typeof` operator answers that question. You write `typeof` followed by an expression, and it returns a **string** naming the value's category:

```javascript title="first-look.js"
console.log(typeof 42, typeof 'hi', typeof true, typeof undefined);
```

```output
number string boolean undefined
```

`typeof` is fast, built into the language, never throws for ordinary values, and works even on variables that were never declared — which makes it the standard tool for checking primitives and for detecting whether an environment provides some feature. But it is deliberately coarse. It cannot tell an array from a plain object, it reports `null` as `"object"` because of a 1995 bug, and it groups dates, maps, regular expressions and class instances under the same label. Knowing exactly what `typeof` does and does not tell you is what separates reliable type checks from ones that crash on the first `null`.

## Before you start

- **Primitive types** — the seven primitives and the object type. See [[b1-primitive-types]]; `typeof` is essentially a reporter for those categories.
- **Objects as values** — that arrays, functions and dates are all objects. See [[b1-objects-as-values]].
- **The temporal dead zone** — why a `let` variable cannot be read before its declaration. See [[b1-tdz]]; it explains one case where `typeof` throws.

## The intuition

Think of `typeof` as the coarse label a baggage handler sticks on a suitcase: "fragile", "heavy", "liquid". It tells you which pile the item goes in, not what is inside. Every primitive gets its own label. Every object gets the generic label `"object"` — except callable objects, which get a special `"function"` label because "can I call this?" is such a common question. And one item, `null`, was mislabelled long ago and nobody is allowed to fix the sticker.

When you need more detail than the label gives — "is this an array?", "is this a `Date`?" — you open the suitcase with a more specific tool.

## The eight possible results

`typeof` always returns one of exactly eight strings:

| Value | `typeof` result | Notes |
|---|---|---|
| `undefined` | `"undefined"` | Also for undeclared variables |
| `true`, `false` | `"boolean"` | |
| `42`, `3.14`, `NaN`, `Infinity` | `"number"` | `NaN` is a number |
| `42n` | `"bigint"` | ES2020 |
| `'hi'` | `"string"` | |
| `Symbol('s')` | `"symbol"` | ES2015 |
| `null` | `"object"` | Historical bug — see below |
| any callable object | `"function"` | Functions, arrow functions, classes, async functions, methods |
| any other object | `"object"` | Plain objects, arrays, dates, regexes, maps, wrapper objects |

Here it is across a wide range of real values:

```javascript title="typeof-table.js"
const samples = [
  ['undefined', undefined], ['true', true], ['42', 42], ['42n', 42n],
  ["'hi'", 'hi'], ["Symbol('s')", Symbol('s')], ['null', null], ['{}', {}],
  ['[]', []], ['new Date()', new Date(0)], ['/re/', /re/], ['new Map()', new Map()],
  ['function () {}', function () {}], ['() => {}', () => {}], ['class A {}', class A {}],
  ['async () => {}', async () => {}], ['Math.max', Math.max], ["new String('x')", new String('x')],
];
for (const [label, v] of samples) console.log(label.padEnd(16), typeof v);
```

```output
undefined        undefined
true             boolean
42               number
42n              bigint
'hi'             string
Symbol('s')      symbol
null             object
{}               object
[]               object
new Date()       object
/re/             object
new Map()        object
function () {}   function
() => {}         function
class A {}       function
async () => {}   function
Math.max         function
new String('x')  object
```

Three rows deserve attention. Classes report `"function"` because a class *is* a special kind of constructor function. `new String('x')` reports `"object"` because `new` creates a wrapper object rather than a primitive — one more reason never to use wrapper constructors. And `null` reports `"object"`, which has its own section below.

Older editions of the specification let host objects return implementation-defined strings — old Internet Explorer's ActiveX objects famously returned `"unknown"`. Current editions limit the results to the eight strings above, with one browser-only exception: `document.all` reports `"undefined"` even though it is an object. That is a deliberate compatibility hack for very old websites, documented in the HTML specification; it was not run here and you are unlikely ever to need it.

## How the operator behaves

`typeof` is a **unary operator**, like `!` or `-`, not a function. You can write `typeof x` or `typeof (x)`; the parentheses only group the expression. Because it binds tightly, it applies to the nearest operand:

```javascript title="operator-details.js"
console.log(typeof notDeclaredAnywhere);
try { console.log(notDeclaredAnywhere); } catch (e) { console.log(e.name + ': ' + e.message); }
try { console.log(typeof later); let later = 1; } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(typeof typeof 42);
console.log(typeof 1 + 2, typeof (1 + 2));
console.log(typeof NaN, typeof Infinity);
```

```output
undefined
ReferenceError: notDeclaredAnywhere is not defined
ReferenceError: Cannot access 'later' before initialization
string
number2 number
number number
```

Go through the lines in order.

**Undeclared variables are safe.** Reading a name that was never declared anywhere normally throws a `ReferenceError`. `typeof` is the one operator with a special exemption: for an unresolvable name it returns `"undefined"` instead of throwing. This exemption exists so scripts can check for globals that may not exist — `typeof window`, `typeof require`, `typeof jQuery` — without crashing.

**The temporal dead zone is not safe.** `later` *is* declared, with `let`, further down the block. Between the start of the block and the declaration, it exists but is uninitialised, and any access — including `typeof` — throws. The exemption covers names that do not exist at all, not names that exist but are not ready ([[b1-tdz]]).

**The result is always a string.** So `typeof typeof 42` is `typeof "number"`, which is `"string"`. This also means comparisons must use string literals: `typeof x === 'undefined'`, never `typeof x === undefined` (which is always `false`).

**Precedence matters.** `typeof 1 + 2` is `(typeof 1) + 2`, which is `'number' + 2`, which is the string `'number2'`. Parenthesise when you want the type of a whole expression.

**`NaN` and `Infinity` are numbers.** `typeof` is no help in deciding whether a number is valid; use `Number.isFinite` or `Number.isNaN` ([[b1-nan-infinity]]).

### How typeof decides

The specification defines `typeof` with a short table keyed on the value's internal type: Undefined → `"undefined"`, Null → `"object"`, Boolean → `"boolean"`, Number → `"number"`, String → `"string"`, Symbol → `"symbol"`, BigInt → `"bigint"`. For an Object it asks one more question: does the object have an internal `[[Call]]` method — can it be called? If yes, `"function"`; if no, `"object"`. That is why a `Proxy` wrapping a function reports `"function"` and a `Proxy` wrapping a plain object reports `"object"`: proxies inherit callability from their target. It is also why `typeof` is extremely fast — it reads a tag, it does not inspect contents.

## typeof null {#b1-typeof-null}

`typeof null` returns `"object"`. This is not because `null` is an object — it is a primitive, the only value of the Null type — but because of a bug in the very first JavaScript implementation that can never be fixed. It is probably the most famous quirk in the language, and it matters in everyday code because it makes the obvious "is this an object?" check wrong.

### Where the bug came from

In the original 1995 Netscape engine, values were stored as 32-bit units with a small **type tag** in the lowest bits. The tag for objects was `000`, and the rest of the bits pointed to the object. `null` was represented as the machine's null pointer — all bits zero. When `typeof` read the tag of `null`, it saw `000` and answered `"object"`. (This account comes from Brendan Eich, the language's creator, and from later analysis of the old source code.)

By the time the behaviour was noticed, real websites depended on it. A proposal to make `typeof null` return `"null"` was considered for the ES2015 era and rejected because it broke existing code. The specification now states the behaviour explicitly: the `typeof` table maps Null to `"object"`. So the result is not a philosophical statement that null is an "empty object reference"; it is a frozen implementation accident.

### Why it bites

Because `null` passes a `typeof … === 'object'` test, any code that uses that test alone and then reads a property will crash on `null`:

```javascript title="typeof-null-crash.js"
function getName(maybeUser) {
  if (typeof maybeUser === 'object') {
    return maybeUser.name;            // crashes when maybeUser is null
  }
  return 'guest';
}
console.log(getName({ name: 'Ada' }), getName(undefined));
try { getName(null); } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
Ada guest
TypeError: Cannot read properties of null (reading 'name')
```

`null` is everywhere this code might be used: `JSON.parse` produces it for missing fields, `document.querySelector` returns it when nothing matches, and databases return it for empty columns. The check looked correct and passed every test that used a real object.

### Checking for null correctly

Test for `null` directly with strict equality, and combine it with `typeof` when you need "a real object":

```javascript title="null-safe-checks.js"
function isObjectLike(v) {
  return typeof v === 'object' && v !== null;             // excludes functions
}
function isNonNullObject(v) {
  return v !== null && (typeof v === 'object' || typeof v === 'function');
}
const cases = [null, {}, [], () => {}, 'str'];
console.log(cases.map(isObjectLike).join(' '));
console.log(cases.map(isNonNullObject).join(' '));
console.log(null instanceof Object, typeof null, Object.prototype.toString.call(null));
try { Object.keys(null); } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
false true true false false
false true true true false
false object [object Null]
TypeError: Cannot convert undefined or null to object
```

`isObjectLike` is the common "can I read properties from this as data?" check: objects and arrays pass, `null`, functions and primitives fail. `isNonNullObject` also admits functions, which matters when you want "anything that can hold properties" — remember that functions are objects too. Which one you want depends on the question; write it down rather than reaching for `typeof` alone.

The third line shows two other tools that tell the truth about `null`: `null instanceof Object` is `false` (it has no prototype chain), and `Object.prototype.toString.call(null)` returns `"[object Null]"`. The last line confirms `null` is not an object in any practical sense: functions that need an object, such as `Object.keys`, throw.

For the common case of "is it missing?", you often want to treat `null` and `undefined` together. `value == null` is `true` for exactly those two values and nothing else, and `??` and `?.` handle both ([[b1-undefined-vs-null]]). With [[b2-strict-null-checks|TypeScript's strictNullChecks]], the compiler also knows that `typeof x === 'object'` leaves `null` possible and forces you to handle it ([[b2-typeof-narrowing]]).

> [!INTERVIEW] "Why is typeof null 'object'?"
> "It's a bug from the first implementation: values carried a type tag in their low bits, objects had tag zero, and null was the all-zeros null pointer, so typeof read it as an object. Fixing it would have broken existing sites, so the spec kept it. null is actually a primitive; I check for it with `=== null`, or `== null` when I want to include undefined."

## What typeof cannot tell you

For any object that is not callable, `typeof` returns `"object"` — arrays, dates, regexes, maps, sets, promises, errors, class instances and `null` all look the same. For those questions, use a more specific tool:

```javascript title="beyond-typeof.js"
const tag = (v) => Object.prototype.toString.call(v);
console.log(tag([]), tag(null), tag(undefined), tag(new Date(0)));
console.log(tag(/x/), tag(new Map()), tag(1n), tag(Promise.resolve()));
class Temperature { get [Symbol.toStringTag]() { return 'Temperature'; } }
console.log(tag(new Temperature()), tag({ [Symbol.toStringTag]: 'Fake' }));
console.log(Array.isArray([]), Array.isArray({ length: 0 }));
console.log([] instanceof Array, new Date(0) instanceof Object, Object.create(null) instanceof Object);
```

```output
[object Array] [object Null] [object Undefined] [object Date]
[object RegExp] [object Map] [object BigInt] [object Promise]
[object Temperature] [object Fake]
true false
true true false
```

**`Array.isArray(v)`** is the correct array check. It reads an internal marker that only real arrays have, so array-like objects such as `{ length: 0 }` are rejected ([[b1-array-from-isarray]]).

**`v instanceof C`** asks whether `C.prototype` appears on `v`'s prototype chain. It works well for your own classes and for built-ins in the same page. It fails for objects with no prototype (`Object.create(null) instanceof Object` is `false`) and, more surprisingly, across **realms** — separate global environments such as iframes or Node's `vm` contexts — because each realm has its own `Array`, `Object` and so on ([[b1-instanceof]]):

```javascript title="realms.js"
const vm = require('node:vm');
const fromOtherRealm = vm.runInNewContext('[1, 2, 3]');
console.log(fromOtherRealm instanceof Array, Array.isArray(fromOtherRealm));
console.log(typeof new Proxy(function () {}, {}), typeof new Proxy({}, {}));
```

```output
false true
function object
```

The array was created in a different realm, so its prototype is that realm's `Array.prototype`, and `instanceof Array` is `false`. `Array.isArray` still answers correctly. `typeof` is also realm-independent, because it reads a type tag rather than walking prototypes.

**`Object.prototype.toString.call(v)`** returns `"[object Tag]"` for any value, including `null` and `undefined`. For built-ins the tag identifies the kind of object. It can be customised by any object through the well-known symbol `Symbol.toStringTag` — useful for your own classes, but it also means the tag can be spoofed, as `{ [Symbol.toStringTag]: 'Fake' }` shows ([[b1-object-tostring]], [[b1-tostringtag]]).

**`Number.isNaN`, `Number.isFinite`, `Number.isInteger`** refine `"number"` results.

| Question | Best tool | Why not typeof alone |
|---|---|---|
| Is it a string / number / boolean / bigint / symbol? | `typeof` | — `typeof` is ideal here |
| Is it `undefined` (or is a global defined)? | `typeof x === 'undefined'` or `x === undefined` | `typeof` is needed only for possibly undeclared names |
| Is it `null`? | `x === null` | `typeof null` is `"object"` |
| Can I call it? | `typeof x === 'function'` | — `typeof` is ideal here |
| Is it an array? | `Array.isArray(x)` | Arrays report `"object"` |
| Is it an instance of my class? | `x instanceof MyClass` | Instances report `"object"` |
| Which built-in object is it? | `Object.prototype.toString.call(x)` | Everything reports `"object"` |
| Is it a usable number? | `Number.isFinite(x)` | `NaN` and `Infinity` report `"number"` |

## Worked example: a precise type describer

Logging, validation and debugging tools often need a single function that names a value's type more precisely than `typeof`. Building one shows how the tools combine.

```javascript title="describe.js"
function describe(value) {
  if (value === null) return 'null';
  const t = typeof value;
  if (t !== 'object') return t;                 // primitives and functions
  if (Array.isArray(value)) return 'array';
  const tag = Object.prototype.toString.call(value).slice(8, -1);
  return tag === 'Object' ? 'object' : tag.toLowerCase();
}

const inputs = [null, undefined, 0, 'x', 1n, Symbol(), () => {}, [], {},
  new Date(0), /a/, new Map(), new Set(), Promise.resolve(), new Error('e'),
  Object.create(null), new String('boxed')];
console.log(inputs.map(describe).join(', '));
```

```output
null, undefined, number, string, bigint, symbol, function, array, object, date, regexp, map, set, promise, error, object, string
```

The order of checks is the design. `null` comes first because it is the one value `typeof` misreports. Next, any result other than `"object"` is already precise — the six primitive labels and `"function"` — so it is returned directly; this is the fast path and covers most values. Only genuine objects reach the remaining checks. `Array.isArray` handles arrays even across realms. For other objects, the `toString` tag (with `"[object "` and `"]"` sliced off) names the built-in kind, and plain objects — including the prototype-free `Object.create(null)` — come out as `'object'`.

Look at the last result. `new String('boxed')` is described as `'string'` because its `toString` tag is `"String"`, even though `typeof` says `"object"`. Whether that is right depends on what the function is for: a debugging helper might prefer to say "boxed string". This is a good reminder that "the type" of a value is not one fixed answer; it depends on which question you are asking. Also note that a class instance would come out as `'object'` unless the class defines `Symbol.toStringTag`; a describer for your own domain would check `instanceof` or a discriminating property first.

```quiz
Q: What does `typeof typeof null` evaluate to?
- [ ] "object"
- [ ] "null"
- [x] "string"
- [ ] It throws
> `typeof null` is the string "object", and `typeof` of any string is "string". `typeof` always returns a string, so applying it twice always gives "string".

Q: In a module that has no declaration of `jQuery` anywhere, which line runs without throwing?
- [ ] `if (jQuery === undefined) {}`
- [x] `if (typeof jQuery === 'undefined') {}`
- [ ] `if (jQuery == null) {}`
- [ ] All three throw
> Reading an undeclared name throws a ReferenceError, whatever comparison follows. `typeof` has a special exemption for unresolvable names and returns "undefined", which is why it is used for feature detection.

Q: Which check correctly reports `true` for an array created inside an iframe and passed to the parent page?
- [ ] `value instanceof Array`
- [ ] `typeof value === 'array'`
- [x] `Array.isArray(value)`
- [ ] `value.constructor === Array`
> Each realm has its own `Array` constructor, so `instanceof Array` and the constructor comparison use the wrong one and fail. `typeof` never returns "array". `Array.isArray` checks an internal marker that every real array has, in any realm.
```

## In real systems

**Feature detection.** Code that runs in several environments — browser, Node.js, Deno, Bun, web workers, server-side rendering — checks for globals before using them:

```javascript title="feature-detection.js"
const isServer = typeof window === 'undefined';
const canFetch = typeof fetch === 'function';
const hasStructuredClone = typeof structuredClone === 'function';
console.log(isServer, canFetch, hasStructuredClone);
function area(shape) {
  if (typeof shape === 'number') return shape * shape;        // a square's side
  if (typeof shape === 'string') return area(Number(shape));
  if (typeof shape === 'object' && shape !== null) return shape.w * shape.h;
  throw new TypeError(`unsupported shape: ${typeof shape}`);
}
console.log(area(3), area('4'), area({ w: 2, h: 5 }));
try { area(null); } catch (e) { console.log(e.message); }
```

```output
true true true
9 16 10
unsupported shape: object
```

Run in Node.js 22, there is no `window`, so `isServer` is `true`, while `fetch` (Node 18+) and `structuredClone` (Node 17+) exist. In a browser, `isServer` would be `false`. The `typeof` form is required here: writing `window === undefined` would throw a `ReferenceError` in Node, because `window` is not declared at all. React and Next.js code uses exactly this check to avoid touching browser APIs during server rendering. The `area` function shows the other everyday use, accepting several input shapes; note that the error message for `null` says `object`, another small reminder of the quirk.

**Validating untrusted input.** API handlers and form processors check `typeof body.email === 'string'` before calling string methods on it. Schema libraries such as Zod are built on these primitive checks plus `Array.isArray` and null tests.

**TypeScript narrowing.** TypeScript understands `typeof` guards: inside `if (typeof x === 'string')`, `x` has type `string`. It also knows that `typeof x === 'object'` includes `null` and makes you exclude it ([[b2-typeof-narrowing]]). The guard runs at run time; TypeScript uses it to refine the static type.

**Optional callbacks.** Libraries accept optional function arguments and check `typeof callback === 'function'` before calling them.

## Trade-offs and alternatives

`typeof` is the fastest and most robust check available: it never throws on declared values, cannot be spoofed, works across realms and works on undeclared globals. Its weakness is resolution — it sorts values into eight buckets, and one of them (`"object"`) is huge and also contains `null`.

`instanceof` gives class-level precision and works with inheritance, but breaks across realms and for prototype-free objects, and can be customised with `Symbol.hasInstance`. `Object.prototype.toString` gives built-in precision for every value but can be spoofed through `Symbol.toStringTag`. **Duck typing** — checking for the method you need, such as `typeof value.then === 'function'` for "promise-like" — is often the most useful check of all, because it tests capability rather than ancestry; it is how `await` decides whether to treat a value as a thenable.

A practical approach: use `typeof` for primitives and functions, `=== null` for null, `Array.isArray` for arrays, and either `instanceof` or a capability check for everything else.

## Common mistakes

**Using `typeof x === 'object'` as a null-safe object check.** It is true for `null`. Add `&& x !== null`.

**Expecting `typeof [] === 'array'`.** There is no `"array"` result. Use `Array.isArray`.

**Comparing with `undefined` instead of `'undefined'`.** `typeof x === undefined` compares a string with the undefined value and is always `false`. Quote it.

> [!MISTAKE] Precedence surprises
> `typeof a + b` is `(typeof a) + b`. `typeof value === 'string' || 'number'` is always truthy because `'number'` is a non-empty string. Write `typeof v === 'string' || typeof v === 'number'`.

**Using `typeof` to validate numbers.** `typeof NaN` is `"number"`. Add `Number.isFinite`.

**Relying on `typeof` before a `let` declaration.** In the temporal dead zone it throws like any other access.

## Interview perspective

`typeof` questions are usually quick-fire "what does this return?" items, often combined with the null quirk. Being exact matters more than being elaborate.

- **List the possible results of `typeof`.** `"undefined"`, `"boolean"`, `"number"`, `"bigint"`, `"string"`, `"symbol"`, `"function"`, `"object"`.
- **`typeof null`?** `"object"`; a legacy bug from type tags. Check with `=== null`.
- **`typeof []`, `typeof class {}`, `typeof NaN`?** `"object"`, `"function"`, `"number"`.
- **How do you check for an array?** `Array.isArray`, which also works across iframes, unlike `instanceof Array`.
- **Why does `typeof undeclared` not throw?** A deliberate exemption so code can feature-detect globals. Follow-up: it does throw in the temporal dead zone.
- **`typeof typeof 1`?** `"string"`, because `typeof` always returns a string.

A strong answer adds *what you would use instead* whenever `typeof` is not enough.

## Practice

1. **Predict.** Write the result of `typeof` for: `-0`, `0n`, `''`, `null`, `[]`, `new Number(5)`, `Symbol.iterator`, `Math`, `JSON.parse`, `class {}`, `new (class {})()`, `document` (in a browser). Check the ones you can run.
2. **Safe property reader.** Write `getIn(obj, key)` that returns `obj[key]` if `obj` can hold properties and `undefined` otherwise — never throwing for `null`, `undefined` or primitives.
3. **Extend `describe`.** Make it report `'boxed string'`, `'boxed number'` and `'boxed boolean'` for wrapper objects, and the class name for instances of user-defined classes (hint: `Object.getPrototypeOf(value).constructor.name`, with care for prototype-free objects).
4. **Realm check.** Using `node:vm`, show that `instanceof Date` fails across realms and find a check that works.
5. **Fix the validator.** `if (typeof input === 'object') return input.items.length;` crashes in production. List every input that breaks it and rewrite it.

## Quick revision {#quick-revision}

- `typeof` returns one of eight strings: `undefined`, `boolean`, `number`, `bigint`, `string`, `symbol`, `function`, `object`.
- Objects with `[[Call]]` (functions, arrows, classes, async functions) → `"function"`; all other objects → `"object"`.
- `typeof null === 'object'` — legacy type-tag bug kept for compatibility; null is a primitive. Check with `=== null` (or `== null` to include undefined).
- Null-safe object check: `typeof v === 'object' && v !== null` (add `|| typeof v === 'function'` to include functions).
- `typeof undeclaredName` returns `"undefined"` without throwing; a `let`/`const` in its TDZ still throws.
- Result is a string: compare with `'undefined'`, and `typeof typeof x` is `"string"`. Precedence: `typeof a + b` is `(typeof a) + b`.
- `typeof NaN` and `typeof Infinity` are `"number"`; `typeof new String('')` is `"object"`.
- Beyond typeof: `Array.isArray` (realm-safe), `instanceof` (class-level, realm-sensitive), `Object.prototype.toString.call` (built-in tag, spoofable via `Symbol.toStringTag`), `Number.isFinite`/`isNaN`.
- Feature detection: `typeof window === 'undefined'` for server code; `typeof fn === 'function'` for optional callbacks.

## Key takeaways {#key-takeaways}

- `typeof` is a fast, coarse label: precise for primitives and functions, vague for every other object.
- `typeof null` is `"object"` because of a 1995 implementation bug; always exclude `null` explicitly.
- `typeof` is the only safe way to probe a possibly undeclared global, which makes it the basis of feature detection.
- Combine `typeof` with `Array.isArray`, `instanceof`, `Object.prototype.toString` or capability checks when you need more precision.
- Order your checks — null first, then `typeof`, then object-specific tools — and decide which question "type" is answering.
