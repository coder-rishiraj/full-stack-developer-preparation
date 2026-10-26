---
summary: JavaScript conditions accept any value, not only `true` and `false`, and decide with a fixed rule that sorts every value into "truthy" or "falsy". You will learn the exact falsy list, every place the rule is applied, why `&&`, `||` and `??` return values rather than booleans, and how to avoid the bugs that come from treating `0` and `''` as "missing".
difficulty: beginner
minutes: 35
objectives:
  - List the eight falsy values from memory and explain why every object, including `[]` and `new Boolean(false)`, is truthy
  - Identify every construct that applies the truthiness rule and the ones that do not, such as `==` and `switch`
  - Predict the value returned by `||`, `&&` and `??` and choose the right one for defaults
  - Debug conditions that wrongly reject valid data such as `0`, `''` or an index of `0`
  - Write explicit checks for empty strings, empty arrays, empty objects and missing values
---

## Introduction

A shop's cart page shows "Quantity required" when a line item has no quantity. The code looks reasonable:

```javascript title="cart-bug.js"
function quantityLabel(qty) {
  if (qty) return `Quantity: ${qty}`;
  return 'Quantity required';
}
console.log(quantityLabel(3));
console.log(quantityLabel(undefined));
console.log(quantityLabel(0));
```

```output
Quantity: 3
Quantity required
Quantity required
```

The last line is wrong: zero is a perfectly valid quantity (the user removed every item), but the code treats it like a missing value. The bug comes from a rule that every JavaScript condition applies silently. `if` does not require a boolean; it accepts any value and converts it to `true` or `false` first. Values that convert to `false` are called **falsy**; every other value is **truthy**. `0` happens to be falsy, so the `if` skipped it.

Truthiness is everywhere in JavaScript: `if`, loops, the ternary operator, `!`, `&&`, `||`, array methods such as `filter`, React's conditional rendering and TypeScript's narrowing all use it. Used deliberately it makes code short and readable — `if (user)` reads naturally. Used carelessly it produces exactly the bug above, where real data that happens to be "empty-looking" is mistaken for no data. This lesson gives you the exact rule, so you never have to guess.

## Before you start

- **The boolean type** — the two values `true` and `false`, and comparisons that produce them. See [[b1-type-boolean]].
- **Primitive types** — strings, numbers, bigints, `null`, `undefined`, `NaN` as a number value. See [[b1-primitive-types]] and [[b1-nan-infinity]].
- **Wrapper objects** — what `new Boolean(false)` is. See [[b1-autoboxing]]; this lesson recaps the part you need.

## The intuition

Think of a short guest list at a door, but inverted: it lists the people who are turned away. There are only eight names on it. Anyone whose name is not on the list gets in — no matter how empty, odd or suspicious they look.

The falsy values are that list. JavaScript does not ask "does this value look empty?" or "would a human call this nothing?". It checks whether the value is one of eight specific values. An empty array looks empty to a human, but it is not on the list, so it is truthy. The string `'false'` reads as false to a human, but it is a non-empty string, so it is truthy.

This is the most useful mental shift: **truthiness is a lookup in a fixed table, not a judgement about meaning.** Once you know the table, there are no surprises left.

## The falsy values

The specification defines an abstract operation called **ToBoolean** that converts any value to a boolean. It returns `false` for exactly these values and `true` for everything else:

| Falsy value | Type | Why it is on the list |
|---|---|---|
| `false` | boolean | It already is false |
| `0` | number | Zero is the "no amount" number |
| `-0` | number | Negative zero is a distinct number value that equals `0` |
| `0n` | bigint | The bigint zero, added with bigint in ES2020 |
| `''` | string | The empty string, with length 0 |
| `null` | null | Deliberate "no object" |
| `undefined` | undefined | "No value assigned" |
| `NaN` | number | "Not a number": the result of failed arithmetic |

That is the complete list for the language itself. Browsers add one historical oddity, described under "How it works internally": the object `document.all`.

You can check the table directly with `Boolean(value)`, which applies ToBoolean and returns the result:

```javascript title="falsy-list.js"
const falsy = [false, 0, -0, 0n, '', null, undefined, NaN];
console.log(falsy.map(Boolean));
```

```output
[
  false, false,
  false, false,
  false, false,
  false, false
]
```

Notice what is *not* on the list: whitespace strings, the strings `'0'` and `'false'`, negative numbers, `Infinity`, and every object.

## Everything else is truthy

The values people most often guess wrong are the "empty-looking" ones. Each of these is truthy:

```javascript title="truthy-surprises.js"
const samples = [
  ['"0"', '0'],
  ['"false"', 'false'],
  ['" " (a space)', ' '],
  ['[] (empty array)', []],
  ['{} (empty object)', {}],
  ['new Map()', new Map()],
  ['-1', -1],
  ['Infinity', Infinity],
  ['1n', 1n],
  ['Symbol()', Symbol()],
  ['() => {}', () => {}],
  ['new Boolean(false)', new Boolean(false)],
  ['new Date("nope")', new Date('nope')],
];
for (const [label, value] of samples) {
  console.log(label.padEnd(20), Boolean(value));
}
```

```output
"0"                  true
"false"              true
" " (a space)        true
[] (empty array)     true
{} (empty object)    true
new Map()            true
-1                   true
Infinity             true
1n                   true
Symbol()             true
() => {}             true
new Boolean(false)   true
new Date("nope")     true
```

Three groups explain the whole output:

- **Non-empty strings are truthy, whatever they say.** `'0'`, `'false'` and `' '` all have length 1 or more. This matters because form fields, URL query parameters and `localStorage` always give you strings: a text input containing `0` gives you `'0'`, which is truthy.
- **Every non-zero, non-NaN number is truthy**, including negatives and `Infinity`.
- **Every object is truthy.** Arrays, plain objects, maps, functions, dates — even an invalid date and a wrapper object holding `false`. ToBoolean never looks inside an object. An empty array is still an array object, so it is truthy; to ask whether it is empty, ask about its `length`.

> [!WARNING] `new Boolean(false)` is truthy
> A wrapper object created with `new Boolean(false)` is an object, so every condition treats it as true. This is why you convert with `Boolean(x)` (no `new`), which returns a primitive. See [[b1-autoboxing]].

## Where truthiness is applied

ToBoolean runs whenever the language needs a yes/no answer from an arbitrary value. Knowing the exact places tells you where `0` and `''` can be silently rejected.

| Construct | Example | Uses ToBoolean on |
|---|---|---|
| `if` / `else if` | `if (user)` | the condition |
| Loops | `while (node)`, `do … while (x)`, `for (; i;)` | the loop condition |
| Ternary | `name ? name : 'Guest'` | the part before `?` |
| Logical NOT | `!value`, `!!value` | its operand |
| Logical AND / OR | `a && b`, `a \|\| b` | the left operand, to decide which side to return |
| `Boolean()` | `Boolean(value)` | its argument |
| Array predicates | `filter`, `find`, `findIndex`, `some`, `every` | the callback's return value |

Equally important are the places where truthiness is **not** used:

- **Loose equality `==`** does not ask whether a value is truthy. It converts operands to numbers or strings by a separate set of rules. So `'2' == true` is `false` (it compares `2` with `1`) even though `'2'` is truthy, and `[] == false` is `true` even though `[]` is truthy. Never write `if (x == true)`; write `if (x)` or, better, an explicit check. The rules are in [[b1-abstract-equality]].
- **`switch`** compares with strict equality (`===`), so `case true:` matches only the boolean `true`, not a truthy value.
- **`??` (nullish coalescing)** checks only for `null` and `undefined`, as the next section shows.
- **Default parameters** apply only when the argument is `undefined`; `0`, `''` and even `null` are kept.

```javascript title="not-truthiness.js"
console.log('2' == true, '1' == true, [] == false, Boolean([]));

switch (1) {
  case true: console.log('matched true'); break;
  default: console.log('switch uses ===');
}

function withDefault(qty = 1) { return qty; }
console.log(withDefault(0), withDefault(undefined), withDefault(null));
```

```output
false true true true
switch uses ===
0 1 null
```

## Getting a real boolean: `Boolean(x)` and `!!x`

Sometimes you need an actual `true` or `false` rather than "a truthy value" — to store a flag in JSON, to return from a predicate function, or to compare with `===`. Two expressions apply ToBoolean and return a primitive boolean:

- `Boolean(x)` — reads clearly and is the usual choice.
- `!!x` — the first `!` converts and negates, the second negates back. Common in older code and short expressions.

Both give the same result for every value. `new Boolean(x)` does not belong in this list: it creates a truthy object.

## `||`, `&&` and `??` return operands, not booleans

The logical operators use truthiness to *decide*, but they return one of their operands unchanged. This is called **short-circuit evaluation**: the right side is not even evaluated if the left side already determines the result.

- `a || b` returns `a` if `a` is truthy, otherwise `b`.
- `a && b` returns `a` if `a` is falsy, otherwise `b`.
- `a ?? b` returns `a` if `a` is anything other than `null` or `undefined`, otherwise `b`.

```javascript title="logical-operands.js"
console.log(0 || 'default', '' || 'empty', 'Ada' || 'anon');
console.log(0 && 'never', 'yes' && 'second', null && missing.prop);
console.log(0 ?? 'default', '' ?? 'empty', null ?? 'fallback');
console.log(JSON.stringify(null || undefined || 0 || ''));
```

```output
default empty Ada
0 second null
0  fallback
""
```

Read the second line carefully: `null && missing.prop` returns `null` without ever evaluating `missing.prop`, which would throw a `ReferenceError` because `missing` does not exist. Short-circuiting is what makes guards like `user && user.name` safe. In the third line, `'' ?? 'empty'` returns the empty string — the output shows two spaces between `0` and `fallback` because an empty string was printed between them. The last line shows that a chain of `||` with no truthy operand returns the *last* operand, here `''` (wrapped in `JSON.stringify` so the empty string is visible).

This is why `||` is a tempting but dangerous way to provide defaults. `qty || 1` replaces a real `0` with `1`; `title || 'Untitled'` replaces a deliberately empty title. Since ES2020, `??` provides "default only when missing", which is almost always what you mean:

| Value of `x` | `x \|\| 10` | `x ?? 10` |
|---|---|---|
| `undefined` | `10` | `10` |
| `null` | `10` | `10` |
| `0` | `10` | `0` |
| `''` | `10` | `''` |
| `false` | `10` | `false` |
| `NaN` | `10` | `NaN` |
| `5` | `5` | `5` |

Use `||` when every falsy value really should be replaced (for example, `name.trim() || 'Guest'` deliberately treats an empty name as missing), and `??` when only absence should be. The operators themselves are covered in depth in [[b1-logical-operators]], [[b1-short-circuit]] and [[b1-nullish-coalescing]].

## Checking for "empty" explicitly

Because truthiness answers "is this one of eight values?", it cannot answer most real questions about emptiness. Ask the question you mean:

| You want to know | Write | Not |
|---|---|---|
| Is the value missing? | `x == null` or `x === undefined` | `!x` (also rejects `0`, `''`, `false`) |
| Is the string empty? | `s === ''` or `s.length === 0` | `!s` (also rejects `null`) |
| Is the string blank? | `s.trim() === ''` | `!s` (`' '` is truthy) |
| Is the array empty? | `arr.length === 0` | `!arr` (arrays are always truthy) |
| Is the object empty? | `Object.keys(obj).length === 0` | `!obj` (objects are always truthy) |
| Is the Map or Set empty? | `map.size === 0` | `!map` |
| Is the number valid? | `Number.isFinite(n)` | `n` (rejects `0`, accepts `Infinity`) |
| Did the search find something? | `i !== -1`, `found !== undefined` | `if (i)`, `if (found)` |

The `x == null` form is the one sanctioned use of loose equality in many style guides: it is true exactly for `null` and `undefined`, and nothing else.

The last row hides a classic bug. `str.indexOf('a')` returns `0` when the match is at the start, which is falsy, so `if (str.indexOf('a'))` fails exactly when the match is first and passes when there is no match at all (`-1` is truthy). Use `str.includes('a')`, which returns a real boolean. Similarly, `arr.find(...)` returns the element itself, so finding a `0` or `''` looks like "not found":

```javascript title="search-pitfalls.js"
const word = 'apple';
console.log(word.indexOf('a') ? 'found' : 'not found');   // wrong
console.log(word.includes('a') ? 'found' : 'not found');  // right

const scores = [7, 0, 9];
const zero = scores.find((s) => s === 0);
console.log(zero ? 'has a zero' : 'no zero');             // wrong
console.log(zero !== undefined ? 'has a zero' : 'no zero');
```

```output
not found
found
no zero
has a zero
```

## How it works internally

ToBoolean is one of the simplest operations in the specification: a table keyed by type. Booleans return themselves; numbers return `false` for `+0`, `-0` and `NaN`; bigints return `false` for `0n`; strings return `false` for the empty string; `undefined` and `null` return `false`; symbols and objects return `true`.

The object row deserves attention because it differs from the other conversions. Converting an object to a number or a string calls its `valueOf`, `toString` or `Symbol.toPrimitive` methods (see [[b1-to-primitive]]). **ToBoolean calls nothing.** It does not inspect the object at all, which is why no object can make itself falsy, however it is written:

```javascript title="no-hooks.js"
const sneaky = { valueOf() { return false; }, toString() { return ''; } };
console.log(Boolean(sneaky), sneaky == false);
```

```output
true true
```

The object is truthy, yet `sneaky == false` is `true`, because `==` converts it with `valueOf` while ToBoolean does not. This pair is the clearest demonstration that truthiness and loose equality are separate rules. It also makes ToBoolean cheap and side-effect free: engines can test truthiness without running user code, and JIT compilers specialise `if (x)` on the types they observe.

**The one exception: `document.all`.** In browsers, the legacy object `document.all` is falsy, and `typeof document.all` is `"undefined"`, even though it is an object. Ancient pages used `if (document.all)` to detect Internet Explorer; making it falsy let modern browsers support those pages' DOM calls without being routed down IE-only code paths. The specification describes this with an internal slot called `[[IsHTMLDDA]]`, which only hosts may give to objects. It does not exist in Node.js, so this behaviour was not run for this lesson; you will never need it, but it is a known interview trivia question and the reason the statement "every object is truthy" has one asterisk.

## Worked example: validating a form without rejecting valid input

A product editor sends `{ name, price, discount, tags }`. Price may legitimately be `0` (a free item), discount may be `0`, and tags may be an empty array. Here is a first version written with truthiness, followed by a fixed version:

```javascript title="validate-product.js"
function validateLoose(p) {
  const errors = [];
  if (!p.name) errors.push('name missing');
  if (!p.price) errors.push('price missing');
  if (!p.tags) errors.push('tags missing');
  const discount = p.discount || 10;          // default discount of 10%
  return { errors, discount };
}

function validateStrict(p) {
  const errors = [];
  if (typeof p.name !== 'string' || p.name.trim() === '') errors.push('name missing');
  if (!Number.isFinite(p.price) || p.price < 0) errors.push('price invalid');
  if (!Array.isArray(p.tags)) errors.push('tags missing');
  const discount = p.discount ?? 10;          // default only when absent
  return { errors, discount };
}

const freeItem = { name: 'Sticker', price: 0, discount: 0, tags: [] };
const blankName = { name: '   ', price: 5, tags: ['promo'] };

console.log(validateLoose(freeItem));
console.log(validateStrict(freeItem));
console.log(validateLoose(blankName));
console.log(validateStrict(blankName));
```

```output
{ errors: [ 'price missing' ], discount: 10 }
{ errors: [], discount: 0 }
{ errors: [], discount: 10 }
{ errors: [ 'name missing' ], discount: 10 }
```

Walk through the loose version on `freeItem`. `!p.name` is `!'Sticker'`, which is `false`, so no error. `!p.price` is `!0`, which is `true`, so a free item is rejected as "price missing". `!p.tags` is `![]`, which is `false` — the empty array passes, but only by accident, because arrays are always truthy; the check would also pass for `tags: {}` or `tags: 'oops'`. Finally `p.discount || 10` turns the deliberate `0` discount into `10`.

On `blankName` the loose version has the opposite problem: `'   '` is a non-empty string, so it is truthy and the blank name passes.

The strict version asks each real question. It checks the type and the trimmed content of the name, uses `Number.isFinite` (which rejects `NaN`, `Infinity` and non-numbers but accepts `0`), uses `Array.isArray` for tags, and uses `??` so only a missing discount gets the default. Each line now states what valid input looks like, instead of relying on which values happen to be falsy.

## In real systems

**React conditional rendering.** In JSX, `{items.length && <List items={items} />}` looks harmless, but when the array is empty, `&&` returns its left operand, `0`, and React DOM renders the number as visible text — a stray "0" on the page. (This is React behaviour described from its documentation; it was not run here.) Write `{items.length > 0 && <List />}` or use a ternary. See [[b4-conditional-rendering]].

**TypeScript narrowing.** TypeScript understands truthiness: inside `if (name)`, a `string | undefined` is narrowed to `string`. But the narrowing also drops `''`, and in the `else` branch the type is still `string | undefined`, so TypeScript will not tell you that an empty string went down the "missing" path. The same applies to `number | undefined` and `0`. See [[b2-narrowing]].

**Linked-list and DOM traversal.** `while (node) { …; node = node.next; }` is idiomatic and correct, because nodes are objects (always truthy) and the end is `null` (falsy). Truthiness is the right tool when the only possible values are "an object" or "nothing".

**Configuration and environment variables.** Environment variables are strings, so `process.env.DEBUG = 'false'` is truthy, and `if (process.env.DEBUG)` turns debugging on. Parse flags explicitly: `process.env.DEBUG === 'true'`.

**Cleaning arrays.** `values.filter(Boolean)` removes `null`, `undefined` and `''`, but also `0` and `false`. It is fine for a list of optional strings; it is a bug for a list of numbers.

## Trade-offs and alternatives

Truthiness exists because early JavaScript was written for small form-handling scripts, where `if (input.value)` meaning "the user typed something" was exactly right. It keeps code short, and for values that are either an object or `null`/`undefined` it is precise: there is no falsy object to confuse things (outside `document.all`).

The cost appears when a value's legitimate range includes a falsy value: counts, prices, indices, booleans, and strings that may be empty. There, truthiness conflates "absent" with "zero/empty/false", and the bug only shows up for the edge-case data.

A practical policy that many teams follow:

- Use truthiness for **object-or-nothing** values (`if (user)`, `while (node)`) and for genuine booleans.
- Use **explicit comparisons** for numbers, strings and collections (`count === 0`, `s.trim() === ''`, `arr.length > 0`).
- Use `??` for **defaults** unless you deliberately want every falsy value replaced.
- Return **real booleans** from predicate functions, so callers can rely on `===`.

Some lint configurations go further: typescript-eslint's `strict-boolean-expressions` rule rejects non-boolean conditions entirely, forcing explicit comparisons. It catches the bugs in this lesson at the cost of more verbose code.

## Common mistakes

**Treating `0` as missing.** `if (!price)` rejects free items; `count || 1` replaces a real zero. Use `price == null` or `??`.

**Testing an array or object for emptiness with `!`.** `if (!results)` never fires for an empty array. Use `results.length === 0`.

**Trusting strings from the outside world.** Inputs, query strings and environment variables are strings: `'0'` and `'false'` are truthy. Parse first: `Number(value)`, `value === 'true'`.

**Using `indexOf` as a condition.** A match at index `0` is falsy and "not found" (`-1`) is truthy. Use `includes`, or compare with `-1`.

**Comparing with `== true` or `== false`.** These use loose equality, not truthiness: `'2' == true` is `false`. Write the condition directly or compare explicitly.

**Rendering `count && <Component />` in React.** A zero count renders a visible `0`. Compare with `> 0`.

> [!MISTAKE] "An empty array is falsy, like in Python"
> In Python, empty lists, dicts and strings are all falsy. In JavaScript only the empty *string* is falsy; empty arrays, objects, maps and sets are truthy because every object is truthy. Developers moving between the two languages hit this constantly.

## Interview perspective

**"List the falsy values."** `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN` — eight. Mention `document.all` as the browser exception if you want to show depth, and say that every other value, including every object, is truthy.

**"Is `[]` truthy? Then why is `[] == false` true?"** Yes, `[]` is truthy because it is an object. `==` does not use truthiness: it converts `false` to `0` and `[]` to `''` and then to `0`, so the comparison is `0 == 0`. A strong answer names the two separate algorithms.

**"What does `0 || 'x'` return? And `0 ?? 'x'`?"** `'x'` and `0`. `||` falls back on any falsy value; `??` only on `null`/`undefined`. Explain when you would pick each.

**"Spot the bug"** — any snippet of the form `if (arr.indexOf(x))`, `if (!user.age)`, `const n = input || 10`. Interviewers want you to name the falsy value that breaks it and give the explicit fix.

**Follow-up: "Does `if (obj)` call `valueOf`?"** No. ToBoolean never runs user code, so no object can be falsy. Converting to a number or string is different.

```quiz
Q: Which of these values is falsy?
- [ ] `'0'`
- [ ] `[]`
- [x] `NaN`
- [ ] `new Boolean(false)`
> NaN is one of the eight falsy values. `'0'` is a non-empty string, `[]` is an object, and `new Boolean(false)` is a wrapper object; every object is truthy regardless of what it contains.

Q: What does `const shown = 0 || 'none'; const kept = 0 ?? 'none';` give for `shown` and `kept`?
- [ ] `0` and `0`
- [x] `'none'` and `0`
- [ ] `'none'` and `'none'`
- [ ] `false` and `0`
> `||` returns its right operand when the left one is falsy, and 0 is falsy. `??` returns its right operand only when the left is null or undefined, so it keeps 0. Neither operator returns a boolean; they return one of the operands.

Q: `const i = 'apple'.indexOf('a');` Why does `if (i) { … }` skip the block?
- [ ] `indexOf` returns `false` when the match is at the start
- [x] The match is at index 0, and 0 is falsy
- [ ] `indexOf` returns -1, which is falsy
- [ ] `if` cannot test numbers
> indexOf returns the position of the first match, which is 0 here, and 0 is falsy. The opposite case is just as bad: "not found" returns -1, which is truthy. Use `includes`, which returns a real boolean.

Q: An object defines `valueOf() { return false; }`. What does `Boolean(obj)` return?
- [x] `true`
- [ ] `false`
- [ ] It throws a `TypeError`
- [ ] It depends on whether the object also defines `toString`
> ToBoolean returns true for every object without calling any of its methods. `valueOf` is used when converting to a number or string, for example by `==` or arithmetic, but never by conditions or `Boolean()`.
```

## Practice

1. **Classify.** Without running anything, mark each value truthy or falsy: `'  '`, `-0`, `0n`, `[0]`, `{}`, `'null'`, `NaN`, `Infinity`, `new Number(0)`, `document.all` (in a browser). Then check the ones you can in Node.js.
2. **Fix the defaults.** Rewrite `function paginate(page, size) { page = page || 1; size = size || 20; … }` so that `page` `0` is rejected with an error but `size` keeps an explicit value, and an omitted argument still gets its default. Decide where default parameters, `??` and explicit checks fit.
3. **React fix.** A component renders `{unread && <Badge count={unread} />}`. Describe what appears when `unread` is `0` and write two different fixes.
4. **Environment flags.** Write `parseFlag(value)` that returns `true` for `'true'`, `'1'`, `'yes'` (any case) and `false` for `undefined`, `''`, `'false'`, `'0'`, `'no'`, and throws for anything else.
5. **Explain the pair.** In your own words, explain why `[]` is truthy but `[] == false` is `true`, naming both conversion algorithms.

## Quick revision {#quick-revision}

- Falsy (8): `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Everything else is truthy.
- Every object is truthy: `[]`, `{}`, `new Map()`, functions, invalid dates, `new Boolean(false)`. Browser-only exception: `document.all`.
- Non-empty strings are truthy whatever they contain: `'0'`, `'false'`, `' '`.
- ToBoolean is used by `if`, loops, `?:`, `!`, `&&`, `||`, `Boolean()`, and array predicates (`filter`, `find`, `some`, `every`).
- Not truthiness: `==` (numeric/string conversion), `switch` (`===`), `??` (null/undefined only), default parameters (undefined only).
- `||` returns the first truthy operand (or the last); `&&` returns the first falsy operand (or the last); `??` returns the left unless it is `null`/`undefined`.
- Real boolean: `Boolean(x)` or `!!x`; never `new Boolean(x)`.
- ToBoolean never calls `valueOf`/`toString`, so no object can make itself falsy.
- Explicit checks: `x == null`, `s.trim() === ''`, `arr.length === 0`, `Object.keys(o).length === 0`, `Number.isFinite(n)`, `includes` instead of `indexOf`.
- React: `{count && <X />}` renders `0` when the count is zero.

## Key takeaways {#key-takeaways}

- Truthiness is a fixed lookup: eight falsy values, and everything else — every object included — is truthy.
- Use truthiness for values that are either an object or nothing; use explicit comparisons when `0`, `''` or `false` are valid data.
- `||` and `&&` return operands, not booleans; prefer `??` for defaults so real zeros and empty strings survive.
- `==` and truthiness are different algorithms, which is why `[]` is truthy yet `[] == false`.
- Strings from inputs, URLs and environment variables are truthy unless empty; parse them before deciding.
- Return real booleans from predicates and convert with `Boolean(x)`, never `new Boolean(x)`.
