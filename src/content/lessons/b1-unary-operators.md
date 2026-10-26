---
summary: Unary operators take a single operand — `+`, `-`, `!`, `~`, `typeof`, `void`, `delete`, and the increment and decrement operators `++` and `--`. You will learn which conversion each one applies, what it returns, the precedence rules that make `-2 ** 2` illegal and `!a instanceof B` wrong, and the prefix/postfix difference that drives so many puzzle questions.
difficulty: beginner
minutes: 40
objectives:
  - Name every JavaScript unary operator and the conversion it applies (ToNumber, ToNumeric, ToBoolean, ToInt32 or none)
  - Predict the results of `+x`, `-x`, `!x`, `~x`, `typeof x`, `void x` and `delete obj.key` for common operands
  - Explain the difference between prefix and postfix `++`/`--` and trace expressions that use them
  - Use unary operators safely around precedence, `const`, strict mode and automatic semicolon insertion
  - Choose readable alternatives such as `Number()`, `includes()` and rest destructuring where a unary trick hurts clarity
---

## Introduction

Most operators sit between two values: `a + b`, `x < y`. A **unary operator** takes just one operand. JavaScript has more of them than most languages, and they do very different jobs:

| Operator | Example | What it does | Conversion applied |
|---|---|---|---|
| `+` | `+'42'` | converts to a number | ToNumber |
| `-` | `-x` | converts and negates | ToNumeric (number or bigint) |
| `!` | `!x` | converts to boolean and inverts | ToBoolean |
| `~` | `~x` | bitwise NOT | ToInt32 (or bigint) |
| `typeof` | `typeof x` | returns the type's name as a string | none |
| `void` | `void x` | evaluates, then returns `undefined` | none |
| `delete` | `delete obj.k` | removes a property, returns a boolean | none |
| `++` / `--` | `i++`, `--i` | adds or subtracts 1 and writes back | ToNumeric |
| `await` | `await p` | waits for a promise (in async code) | none |

The first four are **converters**: each one coerces its operand with a specific rule and then applies one transformation. The next three — `typeof`, `void` and `delete` — are **keyword operators** that exist because JavaScript is dynamic: you can ask what type something is, throw a value away, or remove a property at runtime. The increment and decrement operators are **updaters**: they change a variable as well as producing a value.

Knowing which conversion each one uses explains almost every surprising result: why `+[]` is `0` but `+{}` is `NaN`, why `!'0'` is `false`, why `~~3000000000` is negative, and why `typeof undeclaredVariable` does not throw. This lesson covers each operator, then the prefix/postfix behaviour of `++` and `--` in its own section. `await` belongs with asynchronous code and is taught in [[b1-async-await]].

## Before you start

- **Type coercion** — the idea that operators convert operands, and the ToNumber rules for strings, `null` and objects. See [[b1-type-coercion]].
- **Truthy and falsy values** — needed for `!`. See [[b1-truthy-falsy]].
- **Arithmetic and assignment operators** — `++` combines both. See [[b1-arithmetic-operators]] and [[b1-assignment-operators]].
- **Objects and properties** — needed for `delete`. See [[b1-object-literals]].

## The intuition

Picture each unary operator as a small machine with one input slot. The converters all work in two steps — **coerce, then transform** — and the only thing you need to remember about each is which coercion it uses:

- `+` and `-` turn the operand into a number (as if by `Number(x)`), then `-` flips the sign.
- `!` turns the operand into a boolean (as if by `Boolean(x)`), then flips it.
- `~` turns the operand into a 32-bit integer, then flips every bit.

The keyword operators are different: they do not convert their operand at all. `typeof` inspects it, `void` discards it, and `delete` acts on the *property reference* rather than on the value.

`++` and `--` are "read, convert to a number, add or subtract one, write back". The only extra question is which value the expression hands to its surroundings: the new one (prefix) or the old one (postfix).

## Unary plus `+`: convert to number

`+x` converts `x` to a number using the same rules as `Number(x)` and returns it. It does nothing else.

```javascript title="unary-plus.js"
console.log(+'3', +'', +' 12 ', +'12px', +'0x1f', +'1e3');
console.log(+true, +null, +undefined, +[], +[7], +{}, +new Date(0));
try { +1n; } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
3 0 12 NaN 31 1000
1 0 NaN 0 7 NaN 0
TypeError: Cannot convert a BigInt value to a number
```

String conversion ignores surrounding whitespace, treats an empty string as `0`, accepts hex (`'0x1f'` is 31) and exponent notation, and returns `NaN` for anything with stray characters like `'12px'`. Objects are converted to primitives first: `[]` becomes `''` and then `0`, `[7]` becomes `'7'` and then `7`, `{}` becomes `'[object Object]'` and then `NaN`, and a `Date` becomes its timestamp — `+new Date()` is a well-known shorthand for `Date.now()`.

The last line is the one place unary `+` differs from `Number()`: `Number(1n)` returns `1`, but `+1n` throws a `TypeError`. The language designers made `+` reject bigints for compatibility with asm.js, a subset of JavaScript that relies on `+x` always producing a `number`.

Unary `+` is concise, which makes it popular in code golf and in older codebases, but `Number(x)` says the same thing in words. In shared code, prefer `Number(x)` unless your team's style already uses `+`. The full comparison of conversion functions is in [[b1-unary-plus]] and [[b1-explicit-conversion]].

## Unary minus `-`: convert and negate

`-x` converts `x` with **ToNumeric** — so bigints stay bigints — and returns the negation.

```javascript title="unary-minus.js"
console.log(-'3', -true, -null, -'abc', -(-5));
const zero = 0;
console.log(-zero, 0 - zero, Object.is(-zero, -0), Object.is(0 - zero, -0));
console.log(-5n, typeof -5n);
```

```output
-3 -1 -0 NaN 5
-0 0 true false
-5n bigint
```

Note `-null`: `null` converts to `0`, and negating `0` gives **negative zero**. The second line shows that `-x` and `0 - x` are not the same: `-0` is negative zero, while `0 - 0` is positive zero. The two compare equal with `===`, so the difference only shows through `Object.is`, division (`1 / -0` is `-Infinity`) or console output. `-(-5)` needs the parentheses; `--5` would be parsed as the decrement operator, which is a syntax error on a literal.

Unlike `+`, unary `-` accepts bigints, because negating an integer can never lose precision. That is why negative bigint literals like `-5n` work.

## Logical NOT `!`: convert to boolean and invert

`!x` applies the truthiness rule and returns the opposite boolean. It is covered with the other logical operators in [[b1-logical-operators]]; the unary-specific points are:

- It **always returns a boolean**, unlike `&&` and `||`.
- `!!x` is the idiomatic short form of `Boolean(x)`.
- It binds tighter than every binary operator, so it applies only to the operand directly after it.

That last point causes a classic bug:

```javascript title="not-precedence.js"
class A {}
const a = new A();
console.log(!a instanceof A, !(a instanceof A));
console.log(!'' + 1, -'2' * 3, typeof typeof 1);
```

```output
false false
2 -6 string
```

`!a instanceof A` is parsed as `(!a) instanceof A`, which asks whether `false` is an instance of `A`. It happens to print `false` here, matching the correct form — but it would print `false` for *every* object, including ones that are not instances of `A`. Always parenthesise: `!(a instanceof A)`. The same applies to `!key in obj`. The second line shows unary operators binding before binary ones: `!'' + 1` is `true + 1`, which is `2`; `-'2' * 3` is `(-2) * 3`. And `typeof` always returns a string, so `typeof typeof x` is always `'string'`.

## Bitwise NOT `~`: flip the bits of a 32-bit integer

`~x` converts `x` to a **32-bit signed integer** (dropping any fraction and wrapping values outside about ±2.1 billion), then inverts every bit. Because of how negative numbers are stored in two's complement, inverting all the bits of `n` always gives `-(n + 1)`.

```javascript title="bitwise-not.js"
console.log(~0, ~5, ~-1, ~2.7);
console.log(~~7.9, ~~-7.9, Math.trunc(-7.9), ~~2147483648.5, Math.trunc(2147483648.5));
const list = ['a', 'b'];
console.log(~list.indexOf('a'), ~list.indexOf('z'), list.includes('z'));
console.log(~5n);
```

```output
-1 -6 0 -3
7 -7 -7 -2147483648 2147483648
-1 0 false
-6n
```

You will meet two tricks built on `~` in existing code. **`~~x` as truncation**: applying `~` twice gets back the original integer, with the fractional part removed by the ToInt32 conversion. It matches `Math.trunc` for small numbers but gives garbage for values beyond 2³¹ − 1, as the second line shows. **`~arr.indexOf(x)` as a "found" test**: `indexOf` returns `-1` when the element is missing, and `~-1` is `0`, the only falsy result. So `if (~list.indexOf(x))` means "if found". Both tricks save a few characters and cost every reader a mental conversion; `Math.trunc` and `includes` say what they mean. `~` on a bigint works with arbitrary precision (`~5n` is `-6n`). Bitwise operators in general are covered in [[b1-bitwise-operators]].

## `typeof`: ask for the type

`typeof x` returns a string naming the type of `x`: `'undefined'`, `'boolean'`, `'number'`, `'bigint'`, `'string'`, `'symbol'`, `'function'` or `'object'`.

```javascript title="typeof.js"
console.log(typeof 42, typeof 'hi', typeof null, typeof undefined, typeof (() => {}), typeof 10n);
console.log(typeof notDeclaredAnywhere);
try { console.log(typeof later); let later = 1; } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(typeof 1 + 2, typeof (1 + 2));
```

```output
number string object undefined function bigint
undefined
ReferenceError: Cannot access 'later' before initialization
number2 number
```

Three behaviours deserve attention. `typeof null` is `'object'`, a bug from the first implementation of JavaScript that can never be fixed without breaking the web ([[b1-typeof-null]]). `typeof` on a name that was **never declared** returns `'undefined'` instead of throwing a `ReferenceError` — the only operator with this privilege, which is why `typeof window !== 'undefined'` is the standard way to detect a browser environment in code that also runs on a server. But a `let` or `const` variable in its **temporal dead zone** (declared later in the same scope) still throws ([[b1-tdz]]). Finally, `typeof` binds tightly: `typeof 1 + 2` is `(typeof 1) + 2`, which concatenates to `'number2'`. The full lesson is [[b1-typeof]].

## `void`: evaluate and discard

`void expr` evaluates `expr` — including any side effects — and then returns `undefined`, whatever the expression produced.

```javascript title="void.js"
console.log(void 0, void 'anything', void (1 + 2));
let ran = false;
const r = void (ran = true);
console.log(r, ran);
const arr = [];
const pushReturns = () => arr.push(1);
const pushVoid = () => void arr.push(1);
console.log(pushReturns(), pushVoid());
```

```output
undefined undefined undefined
undefined true
1 undefined
```

The assignment inside `void (ran = true)` still happened; only its value was discarded. `void` has three practical uses today:

- **`void 0` as a guaranteed `undefined`.** Before ES5, the global `undefined` could be reassigned, so libraries wrote `void 0`. Minifiers still emit it because it is shorter than `undefined`.
- **Arrow functions that must not return a value.** An expression-bodied arrow returns its expression. `() => arr.push(1)` returns the new length. Writing `() => void arr.push(1)` makes it return `undefined`, which matters for callbacks whose return value means something — for example, a React effect callback must return either nothing or a cleanup function.
- **Marking a promise as deliberately not awaited.** `void saveDraft()` tells readers (and the `@typescript-eslint/no-floating-promises` rule, which accepts `void` by default) that ignoring the promise is intentional.

You may also see `href="javascript:void(0)"` on links in old markup, used to make a link do nothing when clicked. A `<button>` is the accessible alternative. `void` is covered with `in` and `delete` in [[b1-in-delete-void]].

## `delete`: remove a property

`delete obj.key` (or `delete obj[key]`) removes the **own property** `key` from `obj` and returns `true` if the property no longer exists afterwards.

```javascript title="delete.js"
const o = { a: 1, b: 2 };
console.log(delete o.a, o, delete o.missing);
const arr = ['x', 'y', 'z'];
console.log(delete arr[1], arr, arr.length, 1 in arr);
const frozen = Object.freeze({ k: 1 });
console.log(delete frozen.k, frozen);
const proto = { inherited: true };
const child = Object.create(proto);
console.log(delete child.inherited, child.inherited);
const user = { name: 'Ada', password: 'secret', role: 'admin' };
const { password, ...safeUser } = user;
console.log(safeUser, user);
```

```output
true { b: 2 } true
true [ 'x', <1 empty item>, 'z' ] 3 false
false { k: 1 }
true true
{ name: 'Ada', role: 'admin' } { name: 'Ada', password: 'secret', role: 'admin' }
```

Each line shows a rule:

- Deleting a property that does not exist still returns `true` — `delete` reports "the property is not there now", not "I removed something".
- Deleting an **array element** leaves a hole. The length stays 3 and index 1 becomes empty (a **sparse array**, [[b1-sparse-arrays]]). To remove an element and shift the rest, use `splice` or `filter`.
- A **non-configurable** property (every property of a frozen object, or built-ins like `Math.PI`) cannot be deleted. In sloppy mode `delete` returns `false`; in strict mode it throws `TypeError: Cannot delete property 'k' of #<Object>`.
- `delete` only affects **own** properties. Deleting `child.inherited` succeeds (there was no own property), and the inherited value is still visible through the prototype ([[b1-prototype-chain]]).

`delete` does **not** free memory directly. It removes the property, and the value it held becomes eligible for garbage collection only if nothing else references it ([[b1-garbage-collection]]). It also cannot remove variables: `delete someVariable` returns `false` in sloppy mode and is a `SyntaxError: Delete of an unqualified identifier in strict mode.` in strict code.

The last line shows the usual modern alternative. When you want an object without some properties, **rest destructuring** builds a new object and leaves the original untouched, which is what immutable state updates in React and Redux need. In engines like V8, deleting properties from an object can also move it off its optimised "hidden class" representation into a slower dictionary mode ([[b1-hidden-classes]]); setting the property to `undefined` avoids that, at the cost of keeping the key (`'key' in obj` is still `true`).

## Increment / Decrement {#b1-increment-decrement}

The **increment operator** `++` adds 1 to a variable or property and stores the result back; the **decrement operator** `--` subtracts 1. Each comes in two forms: **prefix** (`++i`) evaluates to the *new* value, and **postfix** (`i++`) evaluates to the *old* value. In both forms the variable ends up changed by exactly 1; the only difference is what the expression hands to the code around it.

### Prefix versus postfix

```javascript title="prefix-postfix.js"
let i = 0;
console.log(i++, i);
console.log(++i, i);
console.log(i--, i);
console.log(--i, i);
```

```output
0 1
2 2
2 1
0 0
```

Follow `i` through each line:

| Line | Expression | Value of expression | `i` afterwards |
|---|---|---|---|
| 1 | `i++` | 0 (old) | 1 |
| 2 | `++i` | 2 (new) | 2 |
| 3 | `i--` | 2 (old) | 1 |
| 4 | `--i` | 0 (new) | 0 |

A useful way to remember it: the operator's position tells you *when* the change is visible to the surrounding expression. `++` before the name means "increment, then use"; `++` after means "use, then increment". Both forms write the new value immediately — "then" refers only to which value the expression yields.

When the result is not used — as a standalone statement `i++;` or in the update clause of a `for` loop — prefix and postfix are identical. `for (let i = 0; i < n; i++)` and `for (let i = 0; i < n; ++i)` run the same iterations, and modern engines generate the same code for both.

### What `++` does with non-numbers

`x++` is not the same as `x += 1`. `+=` uses the `+` operator, which concatenates strings; `++` always converts to a numeric value first.

```javascript title="increment-conversion.js"
let s = '5';
const old = s++;
console.log(old, typeof old, s, typeof s);
let t = '5';
t += 1;
console.log(t);
let u;
u++;
console.log(u);
let nl = null;
nl++;
console.log(nl);
let b = 9007199254740993n;
b++;
console.log(b);
const o = { n: 1 };
console.log(o.n++, o.n);
const v = { valueOf() { return 41; } };
let w = v;
w++;
console.log(w, typeof v);
try { const c = 1; c++; } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
5 number 6 number
51
NaN
1
9007199254740994n
1 2
42 object
TypeError: Assignment to constant variable.
```

The first line is subtle: postfix returns the old value **after conversion**, so `s++` on the string `'5'` returns the *number* 5, and `s` becomes the number 6. Compare `t += 1`, which produces the string `'51'`. `undefined` converts to `NaN`, and `null` to `0`, so `nl++` gives 1. Bigints increment exactly (`++` adds `1n`), properties work like variables, and an object is converted with `valueOf` — after `w++`, the variable `w` holds the number 42, while the original object `v` is untouched.

Because `++` writes back, its operand must be something that can be assigned to — a variable or a property. `const` bindings throw a `TypeError` at runtime, and a literal is rejected by the parser: `5++` is `SyntaxError: Invalid left-hand side expression in postfix operation`.

### Increments inside larger expressions

Using `++` inside a bigger expression is legal and well defined, because JavaScript always evaluates operands left to right. It is also where nearly every increment bug and puzzle lives.

```javascript title="increment-in-expressions.js"
const arr = [0, 0, 0];
let i = 0;
arr[i++] = i;
console.log(arr, i);
let j = 1;
const k = j++ + ++j;
console.log(j, k);
```

```output
[ 1, 0, 0 ] 1
3 4
```

For `arr[i++] = i`, the assignment target is resolved first: `i++` yields 0 (so the target is `arr[0]`) and sets `i` to 1. Then the right-hand side reads `i`, which is now 1. So `arr[0]` becomes 1 — the old `i` was used as the index, the new `i` as the value.

For `j++ + ++j`, trace left to right:

| Step | Evaluates | Yields | `j` after |
|---|---|---|---|
| 1 | `j++` | 1 (old) | 2 |
| 2 | `++j` | 3 (new) | 3 |
| 3 | `1 + 3` | 4 | 3 |

In C and C++, modifying a variable twice in one expression like this is undefined behaviour; in JavaScript (and Java) the result is fully specified. But "specified" is not "readable". Interviewers use these expressions to test your model of evaluation order; in real code, put the increment on its own line. Many style guides, including Airbnb's, enable ESLint's `no-plusplus` rule and write `i += 1` instead.

### Idioms where `++` is clear

Some uses of `++` inside expressions are idiomatic enough to read at a glance:

```javascript title="increment-idioms.js"
const queue = ['a', 'b', 'c'];
let head = 0;
const next = () => queue[head++];
console.log(next(), next(), head);
const out = [];
let len = 0;
out[len++] = 'x';
out[len++] = 'y';
console.log(out, len);
for (let n = 3; n-- > 0; ) console.log('countdown', n);
```

```output
a b 2
[ 'x', 'y' ] 2
countdown 2
countdown 1
countdown 0
```

`queue[head++]` means "take the current item, then advance" — the standard way to consume a buffer with a read pointer. `out[len++] = value` appends and tracks the length. The countdown loop uses postfix in the condition: `n-- > 0` compares the old value, then decrements, so the body sees 2, 1, 0. Each of these is a recognisable pattern; anything more complicated deserves separate statements.

### How increment works internally

For postfix `x++`, the specification says: evaluate `x` to a reference; read its value with `GetValue`; convert with `ToNumeric` to get `oldValue`; compute `oldValue + 1` (using `Number::add` or `BigInt::add`); write it back with `PutValue`; return `oldValue`. Prefix `++x` does the same steps but returns the new value. The target expression is evaluated **once**, so a getter is called once and a setter once:

```javascript title="increment-getter.js"
let reads = 0, writes = 0;
const counter = {
  _v: 0,
  get v() { reads += 1; return this._v; },
  set v(x) { writes += 1; this._v = x; },
};
counter.v++;
console.log(counter._v, 'reads:', reads, 'writes:', writes);
```

```output
1 reads: 1 writes: 1
```

The grammar adds one restriction that matters if you omit semicolons. Postfix `++` and `--` are **restricted productions**: no line break is allowed between the operand and the operator. If one appears, automatic semicolon insertion ends the statement before the operator, and the `++` attaches to the next line as a prefix operator:

```javascript title="asi-increment.js"
let a = 1
let b = 1
a
++b
console.log(a, b)
```

```output
1 2
```

`a` was not incremented; `b` was. The code is parsed as `a; ++b;`. See [[b1-asi]].

## Precedence: unary binds tightly, with one exception

All unary operators have higher precedence than every binary operator except `**`, and they group right to left (`!!x` is `!(!x)`, `- -x` is `-(-x)`). In practice this means a unary operator applies to the smallest operand directly after it:

| You write | Parsed as | Pitfall |
|---|---|---|
| `typeof a + b` | `(typeof a) + b` | concatenates a type name |
| `!a instanceof B` | `(!a) instanceof B` | always `false` for objects |
| `!key in obj` | `(!key) in obj` | checks for `'true'` or `'false'` |
| `-x * y` | `(-x) * y` | usually what you want |
| `-2 ** 2` | `SyntaxError` | parenthesise: `(-2) ** 2` or `-(2 ** 2)` |

The exponent case is deliberate: mathematicians read −2² as −(2²), many programmers read it as (−2)², so the grammar refuses to guess ([[b1-arithmetic-operators]]). The full table is in [[b1-precedence]].

## How it works internally

Each converter operator is specified as "evaluate the operand, call `GetValue`, apply one abstract operation, compute":

- `+x` → `ToNumber(value)`
- `-x` → `ToNumeric(value)`, then `Number::unaryMinus` or `BigInt::unaryMinus`
- `!x` → `ToBoolean(value)`, then negate
- `~x` → `ToNumeric(value)`, then `Number::bitwiseNOT` (via `ToInt32`) or `BigInt::bitwiseNOT`

The keyword operators work on the **reference** rather than the value. `typeof` checks first whether the reference is unresolvable (a name that does not exist anywhere in the scope chain) and returns `'undefined'` without calling `GetValue`, which is what would throw. `delete` takes a property reference and calls the object's internal `[[Delete]]` method, which removes the property if it is configurable; `delete` on an unqualified name is rejected in strict mode at parse time. `void` calls `GetValue` (so getters run and errors are thrown) and then returns `undefined`.

## Worked example: normalising form data

Browser forms submit every value as a string, and an unchecked checkbox is not submitted at all. Unary operators are a compact way to normalise such data, as long as each one is used for what it does well.

```javascript title="normalize-form.js"
// Entries as a browser form would submit them: every value is a string,
// and an unchecked checkbox is simply absent.
const raw = { age: '34', quantity: '', newsletter: 'on', password: 'pw', confirm: 'pw' };

function normalize(fields) {
  const { confirm, ...rest } = fields;          // drop a field without mutating input
  const out = { ...rest };
  out.age = +out.age;                            // '34' -> 34
  out.quantity = out.quantity === '' ? null : +out.quantity;
  out.newsletter = !!out.newsletter;             // present -> true, absent -> false
  out.marketing = !!fields.marketing;
  delete out.password;                           // never keep secrets in app state
  return out;
}

const clean = normalize(raw);
console.log(clean);
console.log(typeof clean.age, Number.isNaN(+'thirty'));
console.log(raw.password, 'confirm' in raw);
```

```output
{ age: 34, quantity: null, newsletter: true, marketing: false }
number true
pw true
```

Walk through it. Rest destructuring removes `confirm` from a new object, leaving the caller's `raw` untouched. `+out.age` converts the age string to a number. The quantity needs more care: `+''` is `0`, which would turn "the user left this blank" into "the user ordered zero", so the empty string is checked first and mapped to `null`. `!!` turns "present with any value" into `true` and "absent" (`undefined`) into `false`, which is exactly the checkbox rule — but note it only works because the field is either missing or `'on'`; `!!'false'` would be `true`. `delete` removes the password from the copy, which is safe here because `out` is a fresh object that nothing else references. The last lines confirm the types and that the input object was not modified. The snippet simulates form data in Node.js; in a browser you would get these strings from `new FormData(form)`.

In production you would add validation after `+out.age` — `Number.isNaN(+'thirty')` shows what a bad entry becomes — and many teams would use `Number(...)` instead of `+` for readability.

## In real systems

**Environment detection** uses `typeof`: `typeof window === 'undefined'` in code shared between server-side rendering and the browser, and `typeof structuredClone === 'function'` for feature checks.

**Loop counters and pointers** use `++` and `--`; parsers, tokenizers and ring buffers use `buf[pos++]` heavily because it reads exactly like the algorithm.

**Fire-and-forget calls** use `void`: `void analytics.track('click')` in event handlers documents that the promise is intentionally ignored.

**Data shaping** uses rest destructuring rather than `delete` for immutable updates (Redux reducers, React state), and `delete` for objects you own and are building, such as a request body before sending.

**Minified bundles** are full of `void 0` and `!0`/`!1` (for `true`/`false`); knowing these makes production stack traces and bundle output readable.

## Trade-offs and alternatives

| Trick | Readable alternative | When the trick is acceptable |
|---|---|---|
| `+x` | `Number(x)` | Team convention; `+new Date()` |
| `!!x` | `Boolean(x)` | Widely understood; fine in most codebases |
| `~~x`, `x \| 0` | `Math.trunc(x)` | Never for values that might exceed 2³¹ − 1 |
| `~arr.indexOf(x)` | `arr.includes(x)` | Avoid |
| `delete obj.k` | `const { k, ...rest } = obj` | Mutating an object you own |
| `i++` in expressions | `i += 1` on its own line | Recognised idioms like `arr[len++] = v` |
| `void 0` | `undefined` | Generated code |

## Common mistakes

> [!MISTAKE] Using `delete` to remove array elements
> `delete arr[i]` leaves a hole and keeps the length. Use `arr.splice(i, 1)` to mutate, or `arr.filter((_, j) => j !== i)` to create a new array.

**Forgetting how `typeof` combines with other operators.** `typeof a + b` concatenates a type name, and `typeof x === 'string' || 'number'` is always truthy because it means `(typeof x === 'string') || 'number'`. Write each comparison in full.

**`!a instanceof B` and `!key in obj`.** Parenthesise the whole test after `!`.

**Expecting `x++` on a string to concatenate.** `++` converts to a number; `'5'++` style code gives `6`, not `'51'`.

**Using the result of postfix as if it were the new value.** `return count++` returns the old count. Use `return ++count` or increment first.

**`~~` for large numbers.** It wraps above 2,147,483,647. Use `Math.trunc` or `Math.floor`.

**Trusting `+` on user input.** `+''` is `0`, `+' '` is `0`, and `+'12px'` is `NaN`. Check for empty input and validate with `Number.isFinite`.

## Interview perspective

> [!INTERVIEW] Prefix versus postfix
> "Both forms add one and store it immediately. The difference is the value of the expression: `i++` yields the old value, `++i` the new one. As a standalone statement or in a `for` update they're interchangeable. Inside a bigger expression, I trace left to right — in `arr[i++] = i`, the index uses the old `i` and the value the new `i` — but I'd split that into two lines in real code."

Common questions:

- **What is `typeof null`, and why?** `'object'`; a bug from the original implementation kept for compatibility.
- **Why doesn't `typeof undeclared` throw?** `typeof` checks for an unresolvable reference before reading it; but a `let` in its temporal dead zone still throws.
- **What does `delete` return, and when is it `false`?** `true` unless the property exists and is non-configurable (in sloppy mode; strict mode throws).
- **What is `~5`? Why does `~indexOf` work?** `-6`, because `~n === -(n + 1)`; `~-1` is the only falsy result.
- **What is `+[]`, `+{}`, `+'  '`?** `0`, `NaN`, `0`.
- **Let `x = 5`. What is `x++ + ++x`?** `5 + 7 = 12`, and `x` is 7.
- **When would you use `void`?** Discarding an arrow function's return value or marking an intentionally unawaited promise.

```quiz
Q: After `let a = 3; const b = a++ * 2 + --a;`, what are `a` and `b`?
- [x] `a` is 3, `b` is 9
- [ ] `a` is 4, `b` is 11
- [ ] `a` is 3, `b` is 10
- [ ] `a` is 2, `b` is 8
> Left to right: `a++` yields the old value 3 and sets a to 4, so the product is 6. Then `--a` sets a back to 3 and yields the new value 3. So b is 6 + 3 = 9 and a ends at 3. Reading `a++` as if it yielded 4 gives the tempting 11.

Q: What does `typeof undeclaredName` do when `undeclaredName` was never declared anywhere?
- [ ] Throws a ReferenceError
- [x] Returns the string `'undefined'`
- [ ] Returns `undefined` (the value, not a string)
- [ ] Returns `'object'`
> `typeof` checks whether the reference can be resolved before reading it, and returns the string 'undefined' for an unresolvable name. Every other way of reading an undeclared name throws. `typeof` always returns a string. A `let` variable in its temporal dead zone is different: it is declared, so `typeof` on it does throw.

Q: What is the state of `arr` after `const arr = [1, 2, 3]; delete arr[0];`?
- [ ] `[2, 3]` with length 2
- [x] An empty slot followed by 2 and 3, with length 3
- [ ] `[undefined, 2, 3]` where index 0 exists and holds undefined
- [ ] It throws, because array elements cannot be deleted
> `delete` removes the property '0' but does not re-index or change length, leaving a hole: `0 in arr` is false. That differs from an element that exists and holds undefined. To remove and shift elements, use `splice` or `filter`.

Q: Which expression correctly checks that `obj` is NOT an instance of `Date`?
- [ ] `!obj instanceof Date`
- [x] `!(obj instanceof Date)`
- [ ] `obj !instanceof Date`
- [ ] `~obj instanceof Date`
> Unary `!` binds tighter than `instanceof`, so `!obj instanceof Date` means `(!obj) instanceof Date`, which tests a boolean and is always false. Parentheses make `!` apply to the whole test. There is no `!instanceof` operator.
```

## Practice

1. Predict, then run: `+'  '`, `+'1,000'`, `-'-3'`, `!'false'`, `~-6`, `typeof typeof null`, `void 'x' ?? 'y'`.
2. Write `removeKey(obj, key)` that returns a new object without `key`, without using `delete`. Then write a mutating version that uses `delete` and returns whether a property was removed.
3. Trace `let i = 1; i = i++ + i++;` on paper with a table, then run it. Explain why `i` ends at 3 even though it was incremented twice and then assigned.
4. Replace every unary trick in this line with a readable equivalent: `if (~names.indexOf(n) && !!flag) total = ~~(+input * 1.5);`
5. In a strict-mode file, try `delete Math.PI`, `delete Object.prototype`, and `delete` on a variable. Record each outcome and explain it.

## Quick revision {#quick-revision}

- Converters: `+` ToNumber (throws on bigint); `-` ToNumeric (bigint ok); `!` ToBoolean; `~` ToInt32 (bigint ok).
- `+''` → 0, `+[]` → 0, `+{}` → `NaN`, `+'12px'` → `NaN`, `+new Date()` → timestamp.
- `-0` exists: `-null` and `-0` give negative zero; `0 - 0` gives positive zero.
- `~n === -(n + 1)`; `~~x` truncates only within 32-bit range.
- `typeof` returns a string; `typeof null === 'object'`; undeclared → `'undefined'` (TDZ still throws).
- `void expr` runs `expr`, returns `undefined`; uses: `void 0`, `() => void f()`, `void promise`.
- `delete obj.k` removes own configurable property; returns `true` if absent afterwards; arrays get holes; strict mode throws for non-configurable and rejects `delete name`.
- Unary binds tighter than binary operators (except `**`): `typeof a + b`, `!a instanceof B` pitfalls; `-2 ** 2` is a SyntaxError.
- `++`/`--`: read, ToNumeric, ±1, write back. Prefix yields new value, postfix old (converted) value.
- `'5'++` gives number 6 (unlike `+= 1`); `undefined++` → `NaN`; `null++` → 1; `const` → `TypeError`; `5++` → SyntaxError.
- Target evaluated once; left-to-right order makes `arr[i++] = i` and `j++ + ++j` well defined.
- No newline allowed before postfix `++` (ASI).

## Key takeaways {#key-takeaways}

- Each converter unary operator applies one specific coercion — ToNumber, ToNumeric, ToBoolean or ToInt32 — and knowing which explains its results.
- `typeof`, `void` and `delete` act on references rather than converted values, which is why `typeof` tolerates undeclared names and `delete` returns a boolean.
- Unary operators bind tightly; parenthesise when `!` or `typeof` should apply to more than the next token.
- `++` and `--` always produce numbers; prefix yields the new value and postfix the old one, and both write immediately.
- Evaluation order makes increment puzzles predictable, but real code should keep increments on their own lines or in well-known idioms.
- Prefer readable equivalents — `Number()`, `includes()`, `Math.trunc()`, rest destructuring — over unary tricks in shared code.
