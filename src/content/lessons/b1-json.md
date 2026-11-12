---
summary: JSON is a text format for data that looks like JavaScript object syntax but follows much stricter rules and supports far fewer types. You will learn exactly what JSON can express, how `JSON.stringify` and `JSON.parse` convert between text and values, and what silently disappears, changes or throws along the way.
difficulty: beginner
minutes: 50
objectives:
  - Distinguish JSON text from JavaScript object literals and list the syntax rules that make text invalid JSON
  - Use `JSON.stringify` and `JSON.parse`, including indentation, error handling and key order
  - Predict how `undefined`, functions, symbols, `NaN`, dates, `Map`, `Set`, `BigInt` and class instances are serialised
  - Detect and handle circular references and shared references when serialising object graphs
  - Choose between JSON, `structuredClone` and other formats for transport, storage and copying
---

## Introduction

A JavaScript object lives in memory. It has references to other objects, a prototype, maybe methods, and it disappears when the program ends. Sooner or later you need that data *outside* the program: sent to a server in an HTTP request, saved in the browser's `localStorage`, written to a log file, read from a configuration file, or passed to a service written in Python or Java. All of those channels carry **text** (or bytes), not live objects. You need an agreed way to turn data into text and back.

**JSON (JavaScript Object Notation)** is that agreement for most of the web. Douglas Crockford popularised it in the early 2000s by taking the literal syntax JavaScript already used for objects and arrays, removing everything that was not plain data, and writing down the rules. It is now an international standard (ECMA-404 and RFC 8259), every mainstream language can read and write it, and it is the default body format of REST APIs.

The name causes the most common misunderstanding in this topic: **JSON is not JavaScript**. It is a text format whose syntax resembles a small subset of JavaScript literals. A JavaScript object is a value in memory; a JSON document is a string. Converting between them — **serialisation** (value → text) with `JSON.stringify` and **deserialisation** (text → value) with `JSON.parse` — is lossy, because JavaScript has many more kinds of values than JSON has types.

This lesson teaches the JSON format, the two conversion functions ([[b1-json-stringify-parse]]), and the values that do not survive the trip ([[b1-json-unsupported]]). Customising the conversion with replacer, reviver and `toJSON` hooks is covered in [[b1-json-replacer-reviver]].

## Before you start

- **Objects, arrays and literals** — you should be comfortable writing `{ name: 'Ada', tags: ['x'] }`. See [[b1-object-literals]] and [[b1-array-basics]].
- **Primitive types** — strings, numbers, booleans, `null`, `undefined`, symbols, `BigInt`. See [[b1-primitive-types]].
- **References** — two variables can point at the same object. See [[b1-primitive-vs-reference]].
- **Number precision** — why very large integers lose accuracy. See [[b1-safe-integers]].
- **`try`/`catch`** — `JSON.parse` throws on bad input. See [[b1-throw-try-catch]].

## The intuition

Think of JSON as a shipping form with a fixed set of boxes: text, number, true/false, empty (`null`), a list, and a labelled group of boxes. Anything you want to ship has to be written into those boxes. A date has no box of its own, so it gets written as text and arrives as text. A function — a piece of behaviour — cannot be written on a form at all, so it is left behind. A structure that refers back to itself would need an infinitely long form, so the clerk refuses it.

When the form arrives, the receiver rebuilds the data from what is written. They get plain objects, arrays, strings, numbers, booleans and `null`, and nothing else. Whatever extra meaning the original values had — "this string is a date", "this object was a `User` with methods" — has to be agreed between sender and receiver separately.

## What JSON can express

A JSON document is exactly one **value**, and a value is one of six things:

| JSON type | Example | Becomes in JavaScript |
|---|---|---|
| object | `{"id": 7, "name": "Ada"}` | plain object (`Object.prototype`) |
| array | `[1, "two", false]` | array |
| string | `"he said \"hi\""` | string |
| number | `-12.5e3` | number (a 64-bit floating-point double) |
| boolean | `true`, `false` | boolean |
| null | `null` | `null` |

There is no `undefined`, no date, no function, no `Map`, `Set`, regular expression, `BigInt`, `NaN` or `Infinity`, and no way to express that two places in the document refer to the same object. The top-level value does not have to be an object: `42`, `"text"` and `null` are complete JSON documents.

### The rules that make text valid JSON

JSON's grammar is stricter than JavaScript's literal syntax. Each of these is valid JavaScript but rejected by `JSON.parse` with a `SyntaxError`:

| Invalid JSON | Why |
|---|---|
| `{name: 'Ada'}` | Keys must be strings in double quotes |
| `{'name': 'Ada'}` | Strings use double quotes only, never single quotes or backticks |
| `{"a": 1,}` and `[1, 2,]` | No trailing commas |
| `// note` or `/* … */` | No comments |
| `{"a": undefined}` | `undefined` is not a JSON value |
| `{"n": NaN}` | No `NaN` or `Infinity` |
| `0x1F`, `01`, `.5`, `+1` | Numbers are decimal, with no leading zeros, no leading `+`, and at least one digit before the point |

Whitespace between tokens is free, so pretty-printed and minified JSON parse identically. Strings must escape `"`, `\` and control characters such as newlines (`\n`); any character can be written as `\uXXXX`.

The rules exist for **interoperability**. A format that every language must parse identically cannot have optional quotes, two string syntaxes or comments that different parsers treat differently. The price is that JSON is awkward to write by hand, which is why configuration formats such as JSON5, JSONC (JSON with comments, used by VS Code and `tsconfig.json`) and YAML exist. Those are *not* JSON, and `JSON.parse` rejects their extra syntax.

### Numbers are doubles

JSON itself puts no limit on numbers, but `JSON.parse` converts every number to a JavaScript number, a 64-bit IEEE 754 double. Integers above `Number.MAX_SAFE_INTEGER` (2⁵³ − 1 = 9,007,199,254,740,991) cannot all be represented exactly:

```javascript title="big-ids.js"
console.log(JSON.parse('{"id": 9007199254740993}').id);
console.log(JSON.parse('{"id": "9007199254740993"}').id);
console.log(JSON.parse('1e400'), JSON.parse('-0'));
```

```output
9007199254740992
9007199254740993
Infinity -0
```

The first ID silently became a different number — a real bug when IDs come from a database using 64-bit integers, as Twitter's API famously did. The standard remedy is for the server to send large IDs as strings, as on the second line. A number too large for a double becomes `Infinity`. (Newer engines can also read the original digits through the reviver's `context.source`; see [[b1-json-replacer-reviver]].)

### Duplicate keys and `__proto__`

The JSON standard does not say what duplicate keys mean. `JSON.parse` keeps the **last** one, so `JSON.parse('{"a": 1, "a": 2}')` is `{ a: 2 }`. Other languages may keep the first or reject the document, which has been used to smuggle values past validators that use a different parser.

A key named `"__proto__"` becomes an ordinary own property; `JSON.parse` does not set the object's prototype. That is safe by itself, but the danger comes later: copying that object into another with `Object.assign` or a naive recursive merge *does* trigger the `__proto__` setter. This is the root of many **prototype pollution** vulnerabilities ([[b1-prototype-pollution]]), and why untrusted JSON should be validated before it is merged into anything.

### JSON and JavaScript source

Since ES2019, every valid JSON text is also a valid JavaScript expression (earlier, two invisible line-separator characters were allowed in JSON strings but not in JavaScript strings). That does not make `eval` an acceptable parser: `eval` runs *any* JavaScript, so a malicious "JSON" response would execute code. `JSON.parse` only ever builds data. Always use it.

## JSON.stringify / parse {#b1-json-stringify-parse}

`JSON.stringify(value, replacer?, space?)` converts a JavaScript value to a JSON string. `JSON.parse(text, reviver?)` converts a JSON string back to a JavaScript value. They are the language's built-in serialiser and deserialiser, available in every browser and in Node.js on the global `JSON` object.

```javascript title="roundtrip.js"
const user = { id: 7, name: 'Ada', tags: ['admin'], active: true, manager: null };

const text = JSON.stringify(user);
console.log(text);
console.log(typeof text, text.length);

const back = JSON.parse(text);
console.log(back.tags[0], back === user);
```

```output
{"id":7,"name":"Ada","tags":["admin"],"active":true,"manager":null}
string 67
admin false
```

`text` is an ordinary 67-character string — exactly what you would send in a request body or store in a file. Parsing it builds a **new** object graph that is equal in content but has no connection to `user`: `back === user` is `false`, and changing `back.tags` would not affect `user.tags`. That independence is why `JSON.parse(JSON.stringify(x))` is sometimes used as a quick deep copy — with the serious limits described in the next section and in [[b1-json-clone-limits]].

### Pretty-printing with `space`

By default, `stringify` produces the most compact text. The third argument adds line breaks and indentation for humans:

```javascript title="pretty.js"
const user = { id: 7, tags: ['admin'], manager: null };
console.log(JSON.stringify(user, null, 2));
```

```output
{
  "id": 7,
  "tags": [
    "admin"
  ],
  "manager": null
}
```

A number means that many spaces per level (capped at 10); a string, such as `'\t'`, is used as the indent itself (only its first 10 characters). The `null` in the middle is the replacer slot, left empty. Use indentation for logs, files people read and debugging; send compact JSON over the network, where the extra whitespace is pure overhead.

### What `stringify` does, step by step

For every value it visits, starting with the root, `JSON.stringify` follows the same steps:

1. If the value is an object with a `toJSON` method, call it and use the result instead. This is how a `Date` becomes an ISO string.
2. If a replacer function was given, call it with the key and value, and use its result.
3. Serialise the result by type: strings are quoted and escaped; finite numbers are written as numbers; `NaN` and `±Infinity` become `null`; booleans and `null` are written as is; `String`, `Number` and `Boolean` wrapper objects are unwrapped to their primitive; `BigInt` throws; `undefined`, functions and symbols are *not serialisable*.
4. For arrays, serialise each index from `0` to `length - 1`; a non-serialisable element is written as `null` so positions stay aligned.
5. For other objects, serialise each **own, enumerable, string-keyed** property in order; a property whose value is not serialisable is left out entirely.

Two details from step 5 matter in practice. Inherited properties, non-enumerable properties and symbol-keyed properties are never included. And the order of keys is the object's own property order: integer-like keys first in ascending numeric order, then other string keys in insertion order. So `JSON.stringify({ b: 1, 2: 'two', a: 2, 1: 'one' })` produces `{"1":"one","2":"two","b":1,"a":2}`. Do not compare JSON strings to test whether two objects are equal: the same data built in a different order produces different text.

If the root value itself is not serialisable, `stringify` returns `undefined` — not a string: `JSON.stringify(undefined)`, `JSON.stringify(() => {})` and `JSON.stringify(Symbol())` all return `undefined`. Code that then calls `.length` on the result crashes.

### What `parse` does

`JSON.parse` reads the whole string, and if any part violates the grammar it throws a `SyntaxError` and returns nothing — there is no partial result. Leading and trailing whitespace is allowed. Objects come back as plain objects whose prototype is `Object.prototype`, arrays as arrays, and everything else as primitives. If a reviver function is given, it is called for every value after parsing, from the innermost values outward, and can transform them; that is how you turn date strings back into `Date` objects (see [[b1-json-replacer-reviver]]).

Because input to `parse` usually comes from outside your program — a network response, a file, user storage — always assume it can be malformed:

```javascript title="safe-parse.js"
function parseOr(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log(`${err.name}: ignoring bad JSON`);
    return fallback;
  }
}

console.log(parseOr('{"ok": true}', {}));
console.log(parseOr("{'ok': true}", {}));
```

```output
{ ok: true }
SyntaxError: ignoring bad JSON
{}
```

Valid syntax is not the same as valid data. `JSON.parse` happily returns `{"age": "forty"}` or `[]` when you expected a user object. For anything from an untrusted source, validate the *shape* after parsing — with hand-written checks or a schema library such as Zod or Ajv — before the rest of the program relies on it.

### Not a perfect inverse

`parse(stringify(x))` gives back `x` only when `x` contains nothing but JSON types. Otherwise properties disappear, dates become strings, `NaN` becomes `null`, and class instances lose their class. `stringify(parse(text))` also need not reproduce `text`: whitespace, duplicate keys (only the last survives), number formatting (`1.0` becomes `1`, `1e2` becomes `100`) and escape choices can change. Treat JSON as a way to carry data, not as a faithful snapshot of memory.

### Where you meet them every day

- `fetch` responses: `await response.json()` reads the body and runs `JSON.parse` on it; sending JSON means `body: JSON.stringify(data)` plus a `Content-Type: application/json` header.
- `localStorage` and `sessionStorage` store only strings, so objects are stringified on the way in and parsed on the way out.
- Node.js reads `package.json` and other config with `JSON.parse(fs.readFileSync(…, 'utf8'))`, or imports it directly with `import pkg from './package.json' with { type: 'json' }` (import attributes, supported in Node 22).
- Structured logs are one JSON object per line, so log tools can search fields.

```quiz
Q: What does `JSON.stringify({ a: undefined, b: [undefined], c: NaN })` return?
- [ ] `{"a":undefined,"b":[undefined],"c":NaN}`
- [ ] `{"a":null,"b":[null],"c":null}`
- [x] `{"b":[null],"c":null}`
- [ ] It throws a TypeError
> In an object, a property whose value is `undefined` is omitted. In an array, the element becomes `null` so the other elements keep their indices. `NaN` has no JSON form and is written as `null`. Nothing here throws; only `BigInt` values and circular references make `stringify` throw.
```

## Unsupported Values & Circular Refs {#b1-json-unsupported}

JSON supports six types; JavaScript has many more kinds of values. **Unsupported values** are the JavaScript values that have no JSON representation. `JSON.stringify` deals with each one in one of four ways — it drops it, replaces it with `null`, converts it to something else, or throws — and it does so silently except for the throws. **Circular references**, where an object contains a path back to itself, cannot be written as finite text at all, so they always throw. Knowing these rules is what separates "my save feature works" from "my save feature quietly loses the user's data".

Here is almost every case in one object:

```javascript title="unsupported.js"
const value = {
  title: 'Report',
  missing: undefined,
  fn() { return 1; },
  [Symbol('id')]: 123,
  sym: Symbol('x'),
  nan: NaN,
  inf: -Infinity,
  negZero: -0,
  created: new Date(Date.UTC(2026, 0, 15, 9, 30)),
  tags: new Set(['a', 'b']),
  lookup: new Map([['k', 1]]),
  regex: /ab+c/g,
  list: [undefined, () => {}, Symbol('s'), NaN],
  err: new Error('boom'),
  boxed: new String('hi'),
};
console.log(JSON.stringify(value));
```

```output
{"title":"Report","nan":null,"inf":null,"negZero":0,"created":"2026-01-15T09:30:00.000Z","tags":{},"lookup":{},"regex":{},"list":[null,null,null,null],"err":{},"boxed":"hi"}
```

Go through it property by property; each line is a rule:

| Value | Result | Reason |
|---|---|---|
| `undefined`, functions, symbols as property values | Property **omitted** | Not serialisable, so the key is skipped |
| Symbol-keyed properties | Omitted | Only string keys are serialised |
| Same values as array elements | `null` | Arrays keep their positions |
| `NaN`, `Infinity`, `-Infinity` | `null` | JSON numbers must be finite |
| `-0` | `0` | JSON has no negative zero |
| `Date` | ISO 8601 string | `Date.prototype.toJSON` calls `toISOString()`; an invalid date gives `null` |
| `Set`, `Map` | `{}` | Their entries live in internal slots, not in enumerable properties |
| `RegExp`, `Error` | `{}` | No own enumerable properties (an error's `message` and `stack` are non-enumerable) |
| `new String('hi')` and other wrappers | Primitive (`"hi"`) | Unwrapped before serialising |
| Array holes (`[, 1]`) | `null` | `[null,1]` |
| `BigInt` | **Throws** `TypeError` | Silently converting could lose precision, so the language refuses |
| Circular reference | **Throws** `TypeError` | The text would be infinite |

Notice how much is lost *without an error*. A `Set` of tags turns into `{}`, and a parsed result has no idea there were ever tags. Errors serialise as `{}`, which is why logged errors often appear empty in JSON logs. Dates survive as strings but come back as strings: `JSON.parse` has no way to know that `"2026-01-15T09:30:00.000Z"` was a date.

### Converting before you serialise

The robust approach is to convert unsupported values into JSON types yourself, deliberately, and convert them back after parsing:

```javascript title="convert.js"
const lookup = new Map([['a', 1], ['b', 2]]);
const tags = new Set([1, 2, 2]);
const err = new Error('boom');

console.log(JSON.stringify({
  lookup: Object.fromEntries(lookup),   // Map with string keys → object
  tags: [...tags],                      // Set → array
  error: { name: err.name, message: err.message },
}));
```

```output
{"lookup":{"a":1,"b":2},"tags":[1,2],"error":{"name":"Error","message":"boom"}}
```

A `Map` with non-string keys is better converted to an array of entries (`[...map]`), because object keys are always strings. For `BigInt`, convert to a string (`value.toString()`) and back with `BigInt(text)`. A replacer function or a `toJSON` method can apply these conversions automatically across a whole structure ([[b1-json-replacer-reviver]]).

### Class instances lose their class

```javascript title="class-loss.js"
class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  dist() { return Math.hypot(this.x, this.y); }
}
const copy = JSON.parse(JSON.stringify(new Point(3, 4)));
console.log(copy, copy instanceof Point, typeof copy.dist);
```

```output
{ x: 3, y: 4 } false undefined
```

Only the own data properties travel; the prototype, and with it every method, does not. After parsing you have a plain object. Rebuild instances explicitly — `new Point(data.x, data.y)` or a static `Point.fromJSON(data)` — at the boundary where the data enters your program. Private `#fields` and getters defined on the class are not own enumerable properties, so they are not serialised either.

### Circular references

A **circular reference** exists when following properties from an object eventually leads back to that same object. They are common: a tree node with a `parent` pointer, a DOM element, a user whose `team` lists the user as a member. `stringify` keeps a stack of the objects it is currently inside, and if it meets one of them again it throws:

```javascript title="circular.js"
const node = { name: 'root' };
node.self = node;
try {
  JSON.stringify(node);
} catch (e) {
  console.log(e.name + ': ' + e.message.split('\n')[0]);
}

const shared = { x: 1 };
console.log(JSON.stringify({ a: shared, b: shared }));
```

```output
TypeError: Converting circular structure to JSON
{"a":{"x":1},"b":{"x":1}}
```

The second case is easy to confuse with a cycle but is different. `shared` is referenced twice, but neither reference leads back to an object that contains it, so it is a **shared reference**, not a cycle. `stringify` writes it twice, and after parsing `a` and `b` are two *separate* objects — the fact that they were one object is lost. (V8's real error message continues on further lines describing the path; the snippet prints only the first line.)

To serialise a structure that may contain cycles, track the chain of objects currently being serialised and replace any repeat with a marker:

```javascript title="safe-stringify.js"
function safeStringify(value, space) {
  const ancestors = [];
  return JSON.stringify(value, function (key, val) {
    if (typeof val !== 'object' || val === null) return val;
    // `this` is the object that holds `key`; drop ancestors we have left
    while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop();
    if (ancestors.includes(val)) return '[Circular]';
    ancestors.push(val);
    return val;
  }, space);
}

const team = { name: 'core', members: [] };
const ada = { name: 'Ada', team };
team.members.push(ada);
team.lead = ada;
console.log(safeStringify(team));
```

```output
{"name":"core","members":[{"name":"Ada","team":"[Circular]"}],"lead":{"name":"Ada","team":"[Circular]"}}
```

The replacer is called with `this` set to the object that holds the current key, so popping the stack until its top is `this` keeps exactly the current path from the root. Only an object that appears on that path is a true cycle. `ada` appears twice (in `members` and as `lead`) but is serialised both times, because the second occurrence is a shared reference, not a cycle. A simpler `WeakSet` of "every object seen so far" would wrongly mark `lead` as circular. For a general-purpose tool, libraries such as `flatted` encode cycles so they can be restored; for logging, Node's `util.inspect` already prints `[Circular *1]`.

The deeper fix is often to not serialise the graph at all: send IDs instead of nested back-references (`{ teamId: 'core' }` instead of `team: { … }`), which is also how relational data is normally shaped in APIs.

### When JSON is the wrong tool

If the goal is to **copy** a value inside one program, not to send it anywhere, use `structuredClone` ([[b1-structured-clone]]). It supports `Date`, `Map`, `Set`, `BigInt`, typed arrays, errors and circular references, preserving shared references too. It still cannot clone functions or keep class prototypes, but it avoids almost every loss in the table above. The full comparison is in [[b1-json-clone-limits]].

```quiz
Q: A settings object contains `{ theme: 'dark', recent: new Set(['a.txt']) }`. You save it with `localStorage.setItem('s', JSON.stringify(settings))` and later load it with `JSON.parse`. What is `loaded.recent`?
- [ ] A `Set` containing `'a.txt'`
- [ ] The array `['a.txt']`
- [x] An empty plain object `{}`
- [ ] `undefined`, because the property was dropped
> A `Set` keeps its members in an internal slot, not in enumerable properties, so `stringify` sees an object with no properties and writes `{}`. The data is lost without any error. Convert with `[...set]` before saving and `new Set(array)` after loading.
```

## How it works internally

`JSON.stringify` is a recursive walk, defined in the specification by the abstract operations `SerializeJSONProperty`, `SerializeJSONObject` and `SerializeJSONArray`. It maintains a stack of the objects currently being serialised (for cycle detection) and the current indentation string. For each property it applies `toJSON`, then the replacer, then a type switch, and appends text to a buffer. Engines heavily optimise the common case — V8 has a fast path for plain objects with simple properties and no replacer — so `stringify` is fast, but it is still proportional to the size of the data and runs on the main thread.

`JSON.parse` is a hand-written parser for a small grammar. It scans the text once, builds values as it goes, and creates plain objects with `Object.prototype` and arrays with `Array.prototype`. It never calls any of your code during parsing (unless you pass a reviver) and never evaluates the text as JavaScript, which is what makes it safe for untrusted input. "Safe" means no code execution, not unlimited input: parsing a 200 MB response blocks the main thread and allocates memory proportional to the data, so size limits belong at the boundary.

Large payloads have specific costs in browsers. Both functions are synchronous, so stringifying or parsing megabytes of data can freeze the page for tens of milliseconds or more ([[b1-long-tasks]]). Options include sending less data, paginating, moving the work to a Web Worker, or using streaming formats such as JSON Lines (one JSON value per line) that can be processed incrementally.

## Worked example: saving a draft

A writing app autosaves a draft to `localStorage`. The draft holds a `Date`, a `Set` of tags and an optional author. Here the browser's `localStorage` is replaced by a small stand-in with the same behaviour — it stores only strings — so the example runs in Node.

```javascript title="draft.js"
// A stand-in for the browser's localStorage, which only stores strings
const storage = new Map();
const localStorage = {
  setItem: (k, v) => storage.set(k, String(v)),
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
};

const draft = {
  title: 'Quarterly report',
  savedAt: new Date(Date.UTC(2026, 10, 12, 8, 0)),
  tags: new Set(['finance', 'q3']),
  wordCount: 1250,
  author: undefined,
};

localStorage.setItem('draft', draft);
console.log(localStorage.getItem('draft'));

localStorage.setItem('draft', JSON.stringify({ ...draft, tags: [...draft.tags] }));
console.log(localStorage.getItem('draft'));

function loadDraft() {
  const text = localStorage.getItem('draft');
  if (text === null) return null;
  try {
    const data = JSON.parse(text);
    return { ...data, savedAt: new Date(data.savedAt), tags: new Set(data.tags) };
  } catch {
    return null; // corrupted or hand-edited storage: start fresh
  }
}

const restored = loadDraft();
console.log(restored.savedAt.getUTCHours(), restored.tags.has('q3'), 'author' in restored);
localStorage.setItem('draft', '{"title": "half-written');
console.log(loadDraft());
```

```output
[object Object]
{"title":"Quarterly report","savedAt":"2026-11-12T08:00:00.000Z","tags":["finance","q3"],"wordCount":1250}
8 true false
null
```

The first save shows the classic mistake: storing an object without stringifying it calls `String(draft)`, which saves the useless text `[object Object]` (real `localStorage` does the same). The second save converts the `Set` to an array explicitly; the `Date` is converted by its `toJSON`; `author: undefined` is dropped. `loadDraft` reverses the conversions it knows about — `new Date(...)` for the timestamp, `new Set(...)` for the tags — so the rest of the app gets the same types it saved. `'author' in restored` is `false`: the key itself is gone, which matters if other code checks for the key rather than the value. Finally, truncated text (as can happen if storage is hand-edited or a write is interrupted) makes `JSON.parse` throw, and the loader recovers instead of crashing the app on start-up.

## In real systems

JSON is the default body format for REST and most HTTP APIs, the payload format of webhooks and many message queues, the storage format of document databases such as MongoDB (as BSON, a binary relative) and of PostgreSQL's `jsonb` columns, and the format of configuration files like `package.json`. Teams settle a few conventions early because JSON itself does not: dates as ISO 8601 strings in UTC, large integer IDs and money amounts as strings or integer minor units (cents), `null` versus omitted keys meaning different things (or not), and `camelCase` versus `snake_case` keys.

At API boundaries, production code parses and then **validates** — with JSON Schema, Zod, or generated types — and converts to domain types (dates, `BigInt`, class instances) in one place. Logging libraries emit one JSON object per line and use custom serialisers so that errors include their message and stack rather than `{}`.

## Trade-offs and alternatives

JSON's strengths are universality, readability, and a parser in every language and browser. Its weaknesses follow from its tiny type set and text encoding: no dates, binary data or large integers without conventions; no comments; no references or cycles; field names repeated in every record; and parsing cost proportional to text size.

Alternatives exist for each weakness. **structuredClone** for copies inside one program; **YAML** or **JSON5/JSONC** for hand-edited configuration; **Protocol Buffers**, **MessagePack** or **CBOR** for compact, typed, binary messages between services where bandwidth or parsing speed matters; **XML** in older enterprise systems. For a web API that people and browsers consume, JSON remains the sensible default.

## Common mistakes

- **Treating JSON as JavaScript.** Single quotes, unquoted keys, comments and trailing commas make `JSON.parse` throw. Generate JSON with `JSON.stringify`, never by string concatenation.
- **Not catching parse errors.** Any external text can be malformed. Wrap `JSON.parse` in `try`/`catch` and decide on a fallback.
- **Trusting the shape of parsed data.** Valid JSON can still be the wrong data. Validate before use.
- **Storing objects without stringifying.** `localStorage.setItem('k', obj)` stores `"[object Object]"`.
- **Expecting dates back.** Dates become strings and stay strings unless you convert them after parsing.
- **Losing `Map`, `Set` and errors silently.** They become `{}`. Convert them explicitly.
- **Sending large integers as numbers.** IDs above 2⁵³ − 1 are rounded. Send them as strings.
- **Comparing objects with `JSON.stringify(a) === JSON.stringify(b)`.** Key order and dropped values make it unreliable.
- **Using `eval` to parse.** It executes code. Use `JSON.parse`.

## Interview perspective

JSON questions test precision: knowing exactly what is dropped, converted or thrown, and why.

> [!INTERVIEW] What a strong answer sounds like
> "JSON is a text format with six types, not JavaScript. `stringify` omits `undefined`, functions and symbols in objects but writes `null` for them in arrays, turns `NaN` and `Infinity` into `null`, calls `toJSON` so dates become ISO strings, writes `Map` and `Set` as `{}`, and throws on `BigInt` and circular references. `parse` builds plain objects only, so dates and class instances have to be rebuilt, and it throws a `SyntaxError` on invalid text, which I always catch at the boundary."

Questions to expect:

- **Difference between a JavaScript object and JSON?** One is an in-memory value with prototypes and references; the other is a string in a strict, language-neutral format.
- **Is `JSON.parse(JSON.stringify(obj))` a good deep clone?** Only for plain JSON-compatible data; it loses dates, `Map`/`Set`, `undefined`, functions, prototypes and shared references, and throws on cycles and `BigInt`. Prefer `structuredClone`.
- **How do you stringify an object with cycles?** A replacer that tracks the current ancestor path, a library, or restructuring the data to use IDs.
- **Why might an ID change after parsing?** Numbers become doubles; integers above 2⁵³ − 1 lose precision.
- **Follow-up: why is JSON safer than `eval`?** `JSON.parse` only builds data from a fixed grammar; `eval` runs arbitrary code.

## Practice

1. **Predict, then run.** Write down what `JSON.stringify` returns for `[undefined, function () {}, null, NaN, new Date(0), new Map()]`, then check.
2. **Fix the API client.** A function sends `body: data` to `fetch` and the server receives `[object Object]`. Fix it and add the correct header.
3. **Safe storage helper.** Write `save(key, value)` and `load(key, fallback)` for `localStorage` that stringify, parse, catch errors and return the fallback when anything goes wrong.
4. **Cycle-safe logger.** Modify `safeStringify` to print `[Circular → name]` using the `name` property of the repeated object when it has one.
5. **Big IDs.** Given `'{"orderId": 12345678901234567890}'`, explain the number you get after parsing and propose two server-side fixes.

## Quick revision {#quick-revision}

- JSON = text format with six types: object, array, string, number, boolean, `null`. Not JavaScript.
- Strict syntax: double-quoted keys and strings, no trailing commas, no comments, no `undefined`/`NaN`/`Infinity`, decimal numbers only.
- `JSON.stringify(value, replacer, space)` → string (or `undefined` for a non-serialisable root); `space` up to 10.
- `JSON.parse(text, reviver)` → new plain values; throws `SyntaxError` on invalid text; never executes code.
- Objects: `undefined`/function/symbol values are omitted; symbol keys, non-enumerable and inherited properties skipped.
- Arrays: unsupported elements and holes become `null`.
- `NaN`, `±Infinity` → `null`; `-0` → `0`; `Date` → ISO string via `toJSON`; `Map`/`Set`/`RegExp`/`Error` → `{}`.
- Throws `TypeError`: `BigInt`, circular references. Shared (non-circular) references are duplicated.
- Parsed numbers are doubles: integers above 2⁵³ − 1 lose precision — send big IDs as strings.
- Duplicate keys: last wins. `"__proto__"` becomes an own property; merging it later can pollute prototypes.
- Not a perfect round trip: types, key order and formatting can change. For in-memory copies use `structuredClone`.

## Key takeaways {#key-takeaways}

- JSON is a strict, language-neutral text format; a JavaScript object is a value in memory, and converting between them is lossy.
- `stringify` silently drops or rewrites anything outside JSON's six types, and throws only for `BigInt` and cycles.
- `parse` produces plain objects, arrays and primitives — dates, sets, maps and class instances must be rebuilt deliberately.
- Every `JSON.parse` of external text needs error handling and, for untrusted data, shape validation.
- Agree on conventions JSON does not define: date format, big-number encoding, and what `null` versus a missing key means.
- Use JSON to move data between programs; use `structuredClone` to copy data within one.
