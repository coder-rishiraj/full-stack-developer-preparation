---
summary: Destructuring unpacks values from arrays and properties from objects into variables with a pattern that mirrors the shape of the data. You will learn array and object patterns, defaults, renaming and nesting, how destructuring works in function parameters, and the exact rules that decide when it throws.
difficulty: beginner
minutes: 45
objectives:
  - Unpack arrays by position and objects by property name, in declarations, assignments, loops and parameters
  - Rename properties, supply defaults and destructure nested data, and read such patterns correctly
  - Predict when a default applies, including the difference between undefined and null
  - Explain how array destructuring uses the iterable protocol and object destructuring uses property lookup
  - Write function signatures with destructured, defaulted options and avoid the errors they can throw
---

## Introduction

A function receives a response from a server and needs four pieces of it. Written with ordinary property access, the code is mostly repetition:

```javascript
const response = {
  status: 200,
  data: { user: { id: 7, name: 'Ada' }, roles: ['admin', 'editor'] },
};

const status = response.status;
const user = response.data.user;
const name = response.data.user.name;
const primaryRole = response.data.roles[0];

console.log(status, user.id, name, primaryRole);
```

```output
200 7 Ada admin
```

Each line names a variable, then repeats the path to the value, and usually repeats the variable's name as the last step of that path. **Destructuring** is a syntax, added in ES2015, that lets you describe the *shape* you expect and the names you want, in one statement:

```javascript
const response = {
  status: 200,
  data: { user: { id: 7, name: 'Ada' }, roles: ['admin', 'editor'] },
};

const { status, data: { user, user: { name }, roles: [primaryRole] } } = response;

console.log(status, user.id, name, primaryRole);
```

```output
200 7 Ada admin
```

The left-hand side looks like an object literal, but it is not creating an object. It is a **pattern**: a template laid over the value on the right, saying "there is a `status` property — put it in a variable called `status`; there is a `data` property containing a `roles` array — put its first element in `primaryRole`". Destructuring creates no new data structure and does not modify the source. It is a compact way to declare variables and assign to them.

You will meet destructuring in nearly every modern JavaScript file: in `import { useState } from 'react'`-style code, in `const [count, setCount] = useState(0)`, in function signatures that take an options object, and in loops over `Object.entries`. This lesson covers array patterns, object patterns, the details of defaults, renaming and nesting, parameters, and the failure cases.

## Before you start

- **Variables** — `const` and `let` declarations. See [[b1-var-let-const]].
- **Objects and arrays** — property access with dot and brackets, and array indexes. See [[b1-object-literals]] and [[b1-array-basics]].
- **`undefined` versus `null`** — they are different values, and destructuring treats them differently. See [[b1-undefined-vs-null]].
- **Function parameters and default values** — helpful for the parameter section. See [[b1-parameters]].

## The intuition

Imagine a paper form with labelled boxes, and a stencil cut to fit over it. The stencil has holes over the boxes you care about, each hole labelled with the name you want to use. Lay the stencil over a filled-in form and you can read off exactly those values; everything else is hidden.

A destructuring pattern is the stencil. For an object, the holes are found by **label** (property name), so their order in the pattern does not matter. For an array, the holes are found by **position**, so order is everything and the names are entirely yours. If the stencil has a hole where the form has no box, you read "nothing there" — `undefined` — unless the stencil has a fallback written beside the hole.

The analogy fails in one important case: laying a stencil over a missing form is harmless, but destructuring `undefined` or `null` throws an error. That case gets its own section.

## Array destructuring

An array pattern is a list of targets in square brackets on the left of `=`. Each target receives the element at the same position.

```javascript
const rgb = [255, 128, 0];

const [red, green, blue] = rgb;
console.log(red, green, blue);

const [first, , third] = rgb;            // an empty slot skips an element
console.log(first, third);

const [a, b, c, d] = rgb;                // more targets than elements
console.log(d);

const [head, ...tail] = rgb;             // rest collects what is left
console.log(head, tail);
```

```output
255 128 0
255 0
undefined
255 [ 128, 0 ]
```

Four rules are visible here. Targets are matched strictly by position. A comma with nothing before it skips that position. A target with no corresponding element receives `undefined`, with no error — exactly as `rgb[3]` would. And a final target written `...name`, the **rest element**, collects all remaining elements into a new array; it is always an array, empty if nothing is left. The rest element must come last: `[a, ...b, c]` is a `SyntaxError`, because the pattern would be ambiguous. Rest is covered together with its mirror image, spread, in [[b1-spread-rest]].

### Swapping, and assigning without declaring

Destructuring is not limited to declarations. A pattern can appear on the left of an assignment to variables that already exist, which gives the well-known swap without a temporary variable:

```javascript
let low = 9;
let high = 2;

[low, high] = [high, low];
console.log(low, high);
```

```output
2 9
```

The right-hand side `[high, low]` is evaluated first, producing a new array `[2, 9]`; only then are its elements assigned. One practical warning: a statement that *begins* with `[` continues the previous line if that line has no semicolon. Without the semicolon after `let high = 2`, the engine would read `2[low, high] = ...`. Code written without semicolons must start such lines with one ([[b1-asi]]).

### It works on any iterable

Array destructuring does not require an array. It asks the right-hand value for an **iterator** and pulls values from it one at a time ([[b1-iterable-protocol]]). Anything that works with `for...of` therefore works here.

```javascript
const [initial, second] = 'hi';
const [firstEntry] = new Map([['theme', 'dark'], ['size', 14]]);
const [, year, month] = /(\d{4})-(\d{2})/.exec('released 2024-03');

console.log(initial, second);
console.log(firstEntry);
console.log(year, month);
```

```output
h i
[ 'theme', 'dark' ]
2024 03
```

A string yields characters, a [[b1-map|Map]] yields `[key, value]` pairs, and a regular-expression match is an array whose element `0` is the whole match — skipped here with a leading comma. The pattern takes only as many values as it has targets and then closes the iterator, so destructuring the first two values of a long or infinite generator is safe ([[b1-generators]]).

The other side of this rule is that a plain object is not iterable, so `const [x] = { 0: 'a', length: 1 }` throws `TypeError: ... is not iterable`, even though the object looks array-like.

## Object destructuring

An object pattern is a list of property names in curly braces. Each name is looked up on the right-hand value, and a variable of the same name receives the result.

```javascript
const product = { sku: 'A-100', title: 'Lamp', price: 40, stock: 0 };

const { title, price } = product;        // order in the pattern is irrelevant
console.log(title, price);

const { colour } = product;              // no such property
console.log(colour);

const { sku, ...details } = product;     // rest collects the other properties
console.log(sku, details);
```

```output
Lamp 40
undefined
A-100 { title: 'Lamp', price: 40, stock: 0 }
```

`{ title, price }` is shorthand for `{ title: title, price: price }`: "read property `title` into variable `title`". It is the pattern counterpart of the shorthand used when *building* objects ([[b1-property-shorthand]]). A property that does not exist gives `undefined`. The **rest property** `...details` gathers the remaining properties into a new plain object.

Two details distinguish the ordinary targets from rest. An ordinary target performs a normal property read, so it finds inherited properties and runs getters — `const { length } = 'hello'` gives `5`, and `const { toString } = {}` gives the inherited function. The rest property is stricter: it copies only the source's **own, enumerable** properties that were not already named. The object it creates is a shallow copy, so nested objects inside it are shared with the original ([[b1-copying-objects]]).

Pulling one property out and keeping the rest is the standard way to *omit* a field without mutating anything:

```javascript
const account = { id: 1, name: 'Ada', passwordHash: 'x9f...' };

const { passwordHash, ...publicProfile } = account;
console.log(publicProfile);
```

```output
{ id: 1, name: 'Ada' }
```

### Assignment needs parentheses

To destructure into existing variables with an object pattern, wrap the whole statement in parentheses:

```javascript
let width;
let height;

({ width, height } = { width: 640, height: 480 });
console.log(width, height);
```

```output
640 480
```

Without the parentheses, a line starting with `{` is parsed as a block statement, and `{ width, height } = ...` is a `SyntaxError` ([[b1-statements-expressions]]). Array patterns do not have this problem. Assignment targets can also be anything assignable, not only plain variables — `({ a: settings.first } = source)` writes into a property — though this is rarely the clearest way to write it.

## Defaults / Renaming / Nested {#b1-destructure-defaults}

Three additions make destructuring patterns expressive enough for real data: a **default** supplies a value when one is missing, a **rename** stores a property under a different variable name, and a **nested pattern** reaches into inner objects and arrays. They can be combined freely, and reading the combinations fluently is the main skill this section teaches.

### Defaults apply only to `undefined`

Write `= expression` after a target to give it a default.

```javascript
const [size = 'M', colour = 'black'] = ['L'];
console.log(size, colour);

const settings = { volume: 0, theme: null, name: '', muted: undefined };
const { volume = 5, theme = 'light', name = 'anon', muted = false, lang = 'en' } = settings;

console.log(volume, theme, name, muted, lang);
```

```output
L black
0 null  false en
```

The rule is exact: **a default is used when, and only when, the value read is `undefined`.** A missing property and a property explicitly set to `undefined` both trigger it (`lang`, `muted`). Every other value is kept, including the falsy ones: `0`, `''`, `false` — and `null`. `theme` stays `null`.

This matches default function parameters ([[b1-parameters]]), and the reasoning is the same. `undefined` means "nothing was provided"; `null` is a value someone provided on purpose ([[b1-undefined-vs-null]]). The practical trouble is that many APIs and databases send `null` for absent fields, so a destructuring default will not protect you from them. When `null` should also fall back, apply `??` afterwards ([[b1-nullish-coalescing]]):

```javascript
const { theme: rawTheme } = { theme: null };
const theme = rawTheme ?? 'light';
console.log(theme);
```

```output
light
```

A default is an expression, not only a constant, and it is evaluated **lazily** — only if it is needed. Targets are processed left to right, so a default may refer to a variable bound earlier in the same pattern, but not to one bound later.

```javascript
let calls = 0;
const makeId = () => `id-${++calls}`;

const { id = makeId(), label = makeId() } = { id: 'given' };
console.log(id, label, calls);

const [width = 100, height = width / 2] = [];
console.log(width, height);
```

```output
given id-1 1
100 50
```

`makeId` ran once, for `label` only. `height`'s default used `width`, which had already been initialised. Reversing the dependency — `const [a = b, b = 1] = []` — throws `ReferenceError: Cannot access 'b' before initialization`, because `b` is still in its temporal dead zone when `a`'s default runs ([[b1-tdz]]).

### Renaming

In an object pattern, `property: variable` reads the property and stores it under a different name.

```javascript
const apiUser = { first_name: 'Ada', id: 7, class: 'admin' };

const { first_name: firstName, id: userId, class: role, plan: tier = 'free' } = apiUser;
console.log(firstName, userId, role, tier);
```

```output
Ada 7 admin free
```

Read the colon as "into": property `first_name` *into* variable `firstName`. Only the name on the right becomes a variable; `first_name` and `id` are not declared at all. Renaming is needed when the property name is not a convenient identifier, is a reserved word such as `class`, or would collide with a variable already in scope. A rename and a default combine as `property: variable = default`, as `plan: tier = 'free'` shows.

> [!MISTAKE] Reading the rename backwards
> `const { data: items } = response` creates a variable named `items` holding `response.data`. It does not create `data`, and it does not read `response.items`. The direction is the opposite of an object literal, where `{ data: items }` puts the *variable* `items` under the *key* `data`. In a pattern, the left of the colon is where to look and the right is where to put it. TypeScript users hit a second trap: `{ id: number }` in a pattern is a rename to a variable called `number`, not a type annotation ([[b2-parameter-destructuring]]).

The property name can also be computed at run time with square brackets, in which case a rename is mandatory because there is no fixed name to reuse ([[b1-computed-properties]]):

```javascript
const field = 'email';
const { [field]: contact } = { email: 'ada@example.com' };
console.log(contact);
```

```output
ada@example.com
```

### Nested patterns

Wherever a pattern expects a variable name, you may put another pattern. The inner pattern is applied to whatever value was found at that position.

```javascript
const order = {
  id: 'o-17',
  customer: { name: 'Lin', address: { city: 'Oslo' } },
  lines: [{ sku: 'A-100', qty: 2 }, { sku: 'B-200', qty: 1 }],
};

const {
  customer: { name, address: { city } },
  lines: [{ sku: firstSku }, ...otherLines],
} = order;

console.log(name, city, firstSku, otherLines.length);
```

```output
Lin Oslo A-100 1
```

In `customer: { name, address: { city } }`, the names `customer` and `address` are only *paths*; the variables created are `name`, `city`, `firstSku` and `otherLines`. If you also want `customer` itself as a variable, list it separately: `{ customer, customer: { name } }`.

Nesting introduces the one way destructuring fails at run time. If an intermediate value is `undefined` or `null`, the inner pattern has nothing to read from and throws. A default on the intermediate level prevents that for the `undefined` case:

```javascript
const sparse = { id: 'o-18' };

const { customer: { name = 'guest' } = {} } = sparse;
console.log(name);

try {
  const { customer: { name: n } } = sparse;
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
guest
TypeError: Cannot read properties of undefined (reading 'name')
```

Read `customer: { name = 'guest' } = {}` from the outside in: take `customer`; if it is `undefined`, use `{}` instead; then from that object take `name`, defaulting to `'guest'`. There are two defaults doing two jobs — the outer `= {}` makes the inner pattern safe, the inner `= 'guest'` supplies the value.

Because defaults ignore `null`, `= {}` does not help when `customer` is `null`; that still throws. For data where any level may be `null`, optional chaining reads more safely than a deep pattern: `const name = order.customer?.name ?? 'guest'` ([[b1-optional-chaining]]).

> [!TIP] Keep patterns shallow
> Two levels of nesting are usually readable. Beyond that, the reader has to count braces to work out which names are variables. Destructure in steps — `const { customer } = order; const { name } = customer;` — or use optional chaining for a single deep value.

## Destructuring function parameters

A parameter can be a pattern. The argument passed in that position is destructured as the function starts.

```javascript title="connect.js"
function connect({ host = 'localhost', port = 5432, ssl: { enabled = false } = {} } = {}) {
  return `${host}:${port} ssl=${enabled}`;
}

console.log(connect());
console.log(connect({ port: 6000, ssl: { enabled: true } }));
console.log(connect({ host: null }));

try {
  connect(null);
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
localhost:5432 ssl=false
localhost:6000 ssl=true
null:5432 ssl=false
TypeError: Cannot read properties of null (reading 'host')
```

This is the **options object** pattern, and it has clear advantages over a list of positional parameters. Callers name what they pass, in any order, and omit what they do not care about. Adding an option later does not break existing calls. The signature documents the accepted options and their defaults in one place.

The trailing `= {}` is essential. It is a default for the *whole parameter*: when `connect()` is called with no argument, the parameter is `undefined`, the default `{}` is substituted, and every inner default then applies. Without it, `connect()` would try to destructure `undefined` and throw. The last two calls show the limits already discussed: `host: null` is kept as `null`, and an explicit `null` argument is not replaced by `{}`.

Parameter patterns are also what make callbacks over pairs and records readable:

```javascript
const stock = { apple: 12, pear: 0, fig: 7 };

const lines = Object.entries(stock)
  .filter(([, qty]) => qty > 0)
  .map(([item, qty]) => `${item}: ${qty}`);
console.log(lines);

const people = [{ name: 'Ada', langs: ['en', 'fr'] }, { name: 'Lin' }];
for (const { name, langs: [firstLang = 'unknown'] = [] } of people) {
  console.log(name, firstLang);
}
```

```output
[ 'apple: 12', 'fig: 7' ]
Ada en
Lin unknown
```

`Object.entries` produces `[key, value]` arrays, which the arrow functions unpack directly in their parameter lists; note the parentheses around the pattern, which are required. The `for...of` loop destructures each element as it goes. React components use exactly this form for their props — `function Button({ label, onClick, disabled = false })` ([[b4-props-destructuring]]) — and hooks return arrays so that callers can choose their own names: `const [count, setCount] = useState(0)`.

## How it works internally

Destructuring is defined in the specification as a sequence of ordinary operations, and knowing them explains every behaviour above.

For an **object pattern**, the engine first checks that the right-hand value is not `undefined` or `null`; if it is, it throws a `TypeError`. Any other value is acceptable — primitives are temporarily wrapped, which is why `const { length } = 'abc'` works ([[b1-autoboxing]]). Then, for each target in source order, it performs a normal property get (the same operation as `value.prop`, so the prototype chain is searched and getters run), substitutes the default if the result is `undefined`, and binds the variable or recurses into a nested pattern. A rest property is processed last: it creates a new object and copies the own enumerable properties not already consumed.

For an **array pattern**, the engine calls the value's `Symbol.iterator` method to obtain an iterator — throwing `TypeError: ... is not iterable` if there is none — and then calls `next()` once per target. A skipped slot still consumes one value. A rest element drains the iterator into a new array. If the pattern finishes before the iterator is exhausted, the engine calls the iterator's `return()` method so that generators and other resources can clean up.

Both forms are evaluated left to right, one target at a time. That ordering is why a default can use an earlier variable, and it means that if a getter or default throws halfway, the earlier targets have already been assigned.

The cost is that of the equivalent property reads. Array patterns pay for the iterator protocol, though engines optimise the common case of a real array. Destructuring is rarely a performance concern; the exception is a hot inner loop, where a profiler may show that indexing an array directly is cheaper than creating an iterator each time.

```quiz
Q: What does this log? `const { a = 1, b = 2, c = 3 } = { a: null, b: 0 }; console.log(a, b, c);`
- [ ] `1 2 3`
- [ ] `1 0 3`
- [x] `null 0 3`
- [ ] `null 2 3`
> A default applies only when the value read is `undefined`. `a` is `null` and `b` is `0`; both are real values and are kept. Only `c`, which is missing and therefore `undefined`, takes its default. Treating `null` or falsy values as "missing" is the most common misconception about defaults.

Q: After `const { id: userId } = { id: 42 };`, which variables exist?
- [ ] `id` only
- [x] `userId` only
- [ ] Both `id` and `userId`
- [ ] Neither; this is a syntax error
> In a pattern, `property: variable` reads the property on the left into the variable on the right. `id` is only the place to look; no variable called `id` is created, and using it would throw a ReferenceError.

Q: `function draw({ size = 10 }) { return size; }` is called as `draw()`. What happens?
- [ ] It returns `10`
- [ ] It returns `undefined`
- [x] It throws a TypeError, because `undefined` cannot be destructured
- [ ] It throws a SyntaxError when the function is defined
> With no argument the parameter is `undefined`, and destructuring `undefined` throws before the inner default is ever considered. The fix is a default for the whole parameter: `function draw({ size = 10 } = {})`.

Q: Which statement about `const [x, y] = value` is true?
- [ ] `value` must be an array
- [ ] It reads `value[0]` and `value[1]`, so any object with those properties works
- [x] `value` must be iterable; strings, Sets, Maps and generators work, plain objects do not
- [ ] It throws if `value` has fewer than two elements
> Array patterns use the iterator protocol, not index access. Any iterable works, a plain object such as `{ 0: 'a', 1: 'b' }` throws "is not iterable", and a short iterable leaves the extra targets `undefined` without an error.
```

## In real systems

**API handlers and data mapping.** Server responses use names such as `created_at` and nest data several levels deep. A single pattern with renames converts one record into local variables in the application's naming style, with defaults for optional fields.

**React.** Components destructure props in the parameter list, hooks are consumed with array patterns, and the rest property forwards unknown props: `function Input({ label, ...inputProps })` passes everything except `label` on to the underlying element.

**Modules.** `const { readFile, writeFile } = require('node:fs/promises')` is ordinary object destructuring of the module's exports object. The ES module form `import { readFile } from ...` looks similar but is separate syntax: it creates live bindings, uses `as` and not `:` for renaming, and supports neither defaults nor nesting ([[b1-export-import]]).

**Multiple return values.** A function that needs to return more than one thing returns an object (`return { data, error }`) when callers will pick by name, or an array (`return [value, setValue]`) when callers will choose their own names and the order is short and fixed.

## Trade-offs and alternatives

Destructuring removes repetition and puts a function's expectations in its signature. Its costs are about readability and failure behaviour. Deep patterns are hard to scan, and a rename hides where a value came from. A pattern states an expectation about shape; when the data does not match, the result is either silent `undefined`s or a `TypeError` whose message names a property, not the pattern.

| Situation | Better choice |
|---|---|
| Several fields from one object, known shape | Destructuring |
| One deep value from data that may have `null` levels | Optional chaining: `a?.b?.c ?? fallback` |
| A value used once | Plain access: `user.name` |
| Many positional values | Return an object instead; long array patterns with skipped slots are fragile |
| Removing fields from an object immutably | Rest property: `const { secret, ...rest } = obj` |

## Common mistakes

**Destructuring `undefined` or `null`.** `const { a } = undefined` throws, as does a parameter pattern with no argument and a nested pattern over a missing level. Give the parameter or the intermediate level a `= {}` default, and remember that this does not cover `null`.

**Expecting defaults to replace `null`, `0` or `''`.** Only `undefined` triggers a default. Use `??` when `null` should fall back too.

**Reading renames backwards.** `{ a: b }` creates `b`.

**Forgetting parentheses in object assignment.** `{ a, b } = obj;` is a syntax error; write `({ a, b } = obj);`.

**Treating the rest object as a deep copy.** `const { id, ...rest } = obj` copies one level; `rest.nested` is the same object as `obj.nested`.

**Destructuring a method off its object.** `const { push } = list; push(1)` loses the method's `this` and throws ([[b1-this-lost]]). Destructure data, and call methods on their objects.

**Destructuring reactive or mutable state too early.** A destructured variable is a snapshot of the value at that moment. If the property is later reassigned, the variable does not follow.

## Interview perspective

Destructuring questions are usually "what does this print?" puzzles on defaults and renames, or a request to write a clean options-object signature.

> [!INTERVIEW] What a strong answer sounds like
> "Array destructuring is positional and uses the iterator protocol, so it works on any iterable. Object destructuring is by property name using normal property lookup. Defaults apply only when the value is `undefined` — not `null` or other falsy values — and are evaluated lazily, left to right. For optional options objects I default the whole parameter to `{}` so calling with no argument doesn't throw."

Questions to prepare:

- **Swap two variables without a temporary.** `[a, b] = [b, a]`; the right side is built first.
- **What does `const { a: b } = obj` do?** Reads `obj.a` into `b`; `a` is not declared.
- **When does a default apply?** Only for `undefined`; show `null` and `0` being kept.
- **Why does `function f({ x }) {}` throw for `f()`?** The parameter is `undefined`; add `= {}`.
- **How do you omit a property immutably?** `const { password, ...rest } = user`.
- **Is the rest object a deep clone?** No, shallow; own enumerable properties only.
- **Can you destructure a string? A Map? A plain object with an array pattern?** Yes, yes (entries), no.
- **How would you safely read a deep optional value?** Intermediate `= {}` defaults for `undefined`, or optional chaining when `null` is possible.

## Practice

1. Given `const point = [3, 4]`, write one statement that declares `x` and `y`, and another that swaps them.
2. From `{ id: 5, profile: { displayName: 'Lin', links: ['a.dev', 'b.dev'] } }`, extract `id`, `displayName` renamed to `name`, the first link as `homepage`, and a `bio` defaulting to `''` — in one pattern. Then rewrite it in two shorter steps and decide which you would rather maintain.
3. Write `createUser({ name, role = 'viewer', active = true } = {})` that returns the resulting object. What does `createUser({ role: null })` return, and how would you make `null` fall back to `'viewer'`?
4. Predict the output: `const [a = 1, b = a * 2, c = b * 2] = [5, undefined, null]; console.log(a, b, c);`
5. Write `omit(obj, key)` using a computed property name and the rest property.
6. Explain why `const { length } = [1, 2, 3]` works and what `const [length] = [1, 2, 3]` gives instead.

## Quick revision {#quick-revision}

- A pattern on the left of `=` unpacks the value on the right; nothing is copied or mutated.
- Array pattern `[a, b]`: by position; `,` skips; missing elements are `undefined`; works on any iterable; plain objects throw.
- Object pattern `{ a, b }`: by property name, order irrelevant; missing properties are `undefined`; inherited properties and getters are read.
- Rest: `[first, ...others]` gives a new array; `{ id, ...others }` gives a new object of the remaining own enumerable properties; must be last; shallow.
- Rename: `{ prop: variable }` — only `variable` is declared. Computed: `{ [expr]: variable }`.
- Default: `{ a = 1 }`, `[a = 1]`, `{ prop: variable = 1 }` — used only when the value is `undefined`; `null`, `0`, `''`, `false` are kept; evaluated lazily, left to right.
- Nested: `{ a: { b } }`, `{ list: [first] }`; an `undefined`/`null` intermediate throws; guard `undefined` with `= {}` or `= []`.
- Parameters: `function f({ a = 1, b } = {})`; the outer `= {}` makes the argument optional.
- Assignment to existing variables: `[a, b] = [b, a]`; objects need parentheses `({ a } = obj)`.
- Destructuring `undefined` or `null` throws a `TypeError`.

## Key takeaways {#key-takeaways}

- Destructuring declares variables from the shape of data: arrays by position, objects by name.
- In an object pattern the left of a colon is where to look and the right is the variable created.
- Defaults fire for `undefined` only; `null` and falsy values pass through unchanged.
- Give optional object parameters a `= {}` default so the function can be called with no argument.
- Use the rest property to omit fields without mutation, remembering that the copy is shallow.
- Prefer shallow patterns; for deep, possibly-null data, optional chaining is safer and easier to read.
