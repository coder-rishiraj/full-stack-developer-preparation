---
summary: '`JSON.stringify` and `JSON.parse` accept hooks that let you decide how each value is written and rebuilt: a replacer and `toJSON` on the way out, a reviver on the way in. You will learn the exact order in which they run, what `this` and the key are at each call, and how to use them for redaction, dates, `BigInt`, `Map`/`Set` and class instances without corrupting data.'
difficulty: intermediate
minutes: 40
objectives:
  - Trace the order in which `toJSON`, a replacer function and a reviver are called, including the root call with key `""`
  - Write replacers that redact, convert or drop values, and explain what returning `undefined` does in objects and arrays
  - Use an array replacer as a key allowlist and explain its limits
  - Implement `toJSON` and a matching reviver to round-trip dates, `BigInt`, `Map`, `Set` and class instances
  - Identify reviver pitfalls such as false-positive date detection, the falsy root key and trusting type tags from input
---

## Introduction

[[b1-json]] showed that JSON has only six types, so `JSON.stringify` drops functions and `undefined`, turns `Map` and `Set` into `{}`, writes dates as strings and throws on `BigInt`, and `JSON.parse` returns only plain objects and primitives. Often that default is not what you want. You may need to hide a password before logging an object, send a `BigInt` balance, keep a `Set` of tags, or get `Date` objects back from an API response instead of strings.

The JSON functions provide three **hooks** for this, without changing the JSON format itself:

- A **replacer** — the second argument of `JSON.stringify` — is called for every value being serialised and can substitute or omit it. It can also be an array of allowed keys.
- A **`toJSON` method** on an object tells `stringify` what to serialise in place of that object. `Date` already has one.
- A **reviver** — the second argument of `JSON.parse` — is called for every value after parsing and can substitute or delete it.

Together they form a small protocol: the sending side encodes richer values into plain JSON, and the receiving side decodes them. Getting it right depends on knowing exactly when each hook runs and what it receives, which is what this lesson teaches.

## Before you start

- **`JSON.stringify` / `JSON.parse`** and what happens to unsupported values. See [[b1-json-stringify-parse]] and [[b1-json-unsupported]].
- **`this` in functions** — hooks receive the containing object as `this`; arrow functions ignore that. See [[b1-this]] and [[b1-this-arrow]].
- **`Map`, `Set` and `BigInt`** — the types you will encode. See [[b1-map]], [[b1-set]] and [[b1-bigint]].
- **Dates** — ISO 8601 strings and UTC. See [[b1-date-basics]].

## The intuition

Picture `stringify` as a packer walking through your data item by item. Before packing each item, it first asks the item itself, "do you have packing instructions?" — that is `toJSON`. Then it shows the result to you, the supervisor, and you may say "pack this instead" or "leave it out" — that is the replacer. Only then does it write the item down.

`parse` is the unpacker at the other end. It unpacks everything first, from the innermost boxes outward, and hands you each item as it finishes, with the box it came from. You may say "replace this with something else" or "throw it away" — that is the reviver. Because it works from the inside out, by the time you see a box, everything inside it has already been through your hands.

## The replacer function

A replacer is a function `(key, value) => newValue`. `stringify` calls it once for the root value and once for every property and array element it visits, with `this` set to the object or array that **holds** the current key. Whatever it returns is serialised in place of the value.

```javascript title="trace-replacer.js"
const data = { user: 'ada', profile: { age: 36 }, ids: [10, 20] };
JSON.stringify(data, function (key, value) {
  const holder = Array.isArray(this) ? 'array' : this[''] === data ? 'wrapper' : 'object';
  console.log(`key=${JSON.stringify(key).padEnd(9)} holder=${holder.padEnd(7)} value=${JSON.stringify(value)}`);
  return value;
});
```

```output
key=""        holder=wrapper value={"user":"ada","profile":{"age":36},"ids":[10,20]}
key="user"    holder=object  value="ada"
key="profile" holder=object  value={"age":36}
key="age"     holder=object  value=36
key="ids"     holder=object  value=[10,20]
key="0"       holder=array   value=10
key="1"       holder=array   value=20
```

Four facts are visible here.

1. **The first call is for the root, with key `""`.** `stringify` wraps your value in a temporary object `{ "": value }` and starts there, so `this` for the first call is that wrapper. Your replacer can replace the entire value at this step.
2. **The walk is top-down.** The replacer sees `profile` *before* `age`. If it returns a different object for `profile`, `stringify` walks into the *returned* object, not the original. That is how a replacer can restructure nested data.
3. **Array indices arrive as strings.** The keys for array elements are `"0"`, `"1"` and so on.
4. **`this` is the holder.** That is why the trace uses a `function`, not an arrow function: an arrow function does not receive `this`.

### Returning `undefined`: omit or `null`

Returning `undefined` from a replacer means "this value is not serialisable", and the usual rules apply: in an object the property is **omitted**; in an array the element becomes **`null`**, so positions do not shift.

```javascript title="redact.js"
const data = { user: 'ada', password: 'hunter2', profile: { password: 'x', age: 36 }, ids: [10, 20] };

console.log(JSON.stringify(data, (key, value) => (key === 'password' ? undefined : value)));
console.log(JSON.stringify({ ids: [10, 20] }, (key, value) => (key === '0' ? undefined : value)));
```

```output
{"user":"ada","profile":{"age":36},"ids":[10,20]}
{"ids":[null,20]}
```

The redaction removed `password` at every depth, because the replacer is called for every key in the structure. This is the standard way to keep secrets out of logs. A safer production version redacts *by default* — an allowlist of fields that may be logged — because a denylist misses the next sensitive field someone adds (`apiKey`, `token`, `ssn`).

### Converting values the format does not support

A replacer is the natural place to encode types that JSON lacks:

```javascript title="bigint-replacer.js"
const balance = { account: 'acct-1', cents: 12345678901234567890n };
console.log(JSON.stringify(balance, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
```

```output
{"account":"acct-1","cents":"12345678901234567890"}
```

Without the replacer this line throws `TypeError: Do not know how to serialize a BigInt`. With it, the value travels as a string, which the receiver can turn back into a `BigInt` exactly. Encoding it as a JSON number would be legal text, but most parsers would round it to a double.

### The replacer sees values *after* `toJSON`

`toJSON` runs before the replacer. For a `Date`, that means the replacer receives the ISO string, not the `Date` object:

```javascript title="after-tojson.js"
const event = { name: 'launch', at: new Date(Date.UTC(2026, 0, 1)) };
JSON.stringify(event, function (key, value) {
  if (key === 'at') console.log(typeof value, this[key] instanceof Date);
  return value;
});
```

```output
string true
```

`value` is already a string. To see the original object, read it from the holder: `this[key]` is still the `Date`. Replacers that need to detect dates, or any class with a `toJSON`, must use `this[key]` — and must therefore be `function`s, not arrow functions.

## The array replacer: an allowlist of keys

If the second argument is an array of strings (and numbers, which are converted to strings), `stringify` includes only properties whose names are in the list. The list applies to **every object at every depth**, and it does not filter array elements.

```javascript title="allowlist.js"
console.log(JSON.stringify({ a: { a: 1, b: 2 }, b: [{ a: 3, c: 4 }] }, ['a', 'b']));
console.log(JSON.stringify({ 1: 'one', 2: 'two' }, [1]));
```

```output
{"a":{"a":1,"b":2},"b":[{"a":3}]}
{"1":"one"}
```

In the first line, `c` disappears from the object inside the array, and both `a` and `b` are kept inside the nested object because they are allowed names everywhere. The order of keys in the output follows the order of the allowlist, not the object. That global, name-based behaviour is the array replacer's limit: you cannot say "`id` at the top level but not inside `owner`". For path-sensitive filtering, write a replacer function, or better, build the exact object you want to send (`{ id: user.id, name: user.name }`) before stringifying.

```quiz
Q: A replacer is written as `(key, value) => value instanceof Date ? value.getTime() : value`. What happens to a `Date` property?
- [ ] It is written as a millisecond timestamp
- [x] It is written as an ISO string, because `toJSON` already converted it before the replacer ran
- [ ] It is omitted, because the replacer returned a number
- [ ] It throws, because `getTime` is not available on the value
> `stringify` calls `Date.prototype.toJSON` first, so the replacer's `value` is already a string and `instanceof Date` is false. To see the original object, use a `function` replacer and check `this[key] instanceof Date`.
```

## toJSON: letting objects describe themselves

If a value being serialised is an object with a `toJSON` method, `stringify` calls it and serialises the return value instead. The method receives the key under which the object appears (`""` at the root). This keeps the encoding logic next to the class that owns the data, instead of in every replacer.

```javascript title="money.js"
class Money {
  #cents;
  constructor(cents, currency) {
    this.#cents = cents;
    this.currency = currency;
  }
  toJSON(key) {
    console.log(`toJSON called for key "${key}"`);
    return { cents: this.#cents, currency: this.currency };
  }
  static fromJSON(data) {
    return new Money(data.cents, data.currency);
  }
  format() {
    return `${(this.#cents / 100).toFixed(2)} ${this.currency}`;
  }
}

const order = { id: 'A-17', total: new Money(4599, 'EUR') };
const text = JSON.stringify(order);
console.log(text);

const parsed = JSON.parse(text, (key, value) => (key === 'total' ? Money.fromJSON(value) : value));
console.log(parsed.total.format(), parsed.total instanceof Money);
```

```output
toJSON called for key "total"
{"id":"A-17","total":{"cents":4599,"currency":"EUR"}}
45.99 EUR true
```

Without `toJSON`, the private `#cents` field would be invisible to `stringify` (private fields are not properties) and the output would be `{"currency":"EUR"}` — the amount silently lost. With it, the class decides its own wire format. On the way back, `Money.fromJSON` rebuilds a real instance with methods. Pairing `toJSON` with a static `fromJSON` is a common convention, though the language only knows about `toJSON`; you must call `fromJSON` yourself, here from a reviver.

`toJSON` can return anything, including another object that itself has `toJSON` (it is *not* called again on the result) or a primitive. Built-ins that define it: `Date` (returns `toISOString()`, or `null` for an invalid date) and, in browsers, some Web API objects such as `URL` (returns the `href`). Since the replacer runs after `toJSON`, a replacer can still override what `toJSON` produced.

## The reviver

A reviver is a function `(key, value) => newValue` passed to `JSON.parse`. After the text has been parsed into plain values, `parse` walks the result and calls the reviver for every value, with `this` set to the holder. The walk is **bottom-up**: children are revived before their parent, and the root is last, with key `""`.

```javascript title="trace-reviver.js"
const text = '{"name":"Ada","meta":{"created":"2026-01-15T09:30:00.000Z"},"scores":[1,2]}';
JSON.parse(text, (key, value) => {
  console.log(JSON.stringify(key), JSON.stringify(value));
  return value;
});
```

```output
"name" "Ada"
"created" "2026-01-15T09:30:00.000Z"
"meta" {"created":"2026-01-15T09:30:00.000Z"}
"0" 1
"1" 2
"scores" [1,2]
"" {"name":"Ada","meta":{"created":"2026-01-15T09:30:00.000Z"},"scores":[1,2]}
```

`created` is visited before `meta`, and `meta` before the root. This order is useful: when the reviver sees an object, all its children have already been converted, so building a `Map` from an array of entries gets entries that are already revived.

Return values work like this: whatever the reviver returns replaces the value in its holder. Returning `undefined` **deletes** the property; in an array it deletes the element, leaving a hole rather than shifting later elements.

```javascript title="reviver-delete.js"
console.log(JSON.parse('{"a":1,"secret":2}', (k, v) => (k === 'secret' ? undefined : v)));
console.log(JSON.parse('[1,2,3]', (k, v) => (k === '1' ? undefined : v)));
```

```output
{ a: 1 }
[ 1, <1 empty item>, 3 ]
```

### Reviving dates

The most common reviver turns date strings back into `Date` objects. Since JSON gives no type information, the reviver must recognise dates by key name or by format:

```javascript title="dates.js"
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const text = '{"title":"Launch","at":"2026-01-15T09:30:00.000Z","note":"2026-01-15T09:30:00Z"}';
const event = JSON.parse(text, (key, value) =>
  typeof value === 'string' && ISO_DATE.test(value) ? new Date(value) : value);
console.log(event.at instanceof Date, event.note instanceof Date, event.title);
```

```output
true true Launch
```

`at` was meant to be a date and became one. But `note` — imagine it is free text a user typed, which happens to look like a timestamp — also became a `Date`. Format-based revivers convert *every* matching string, including user content, which then breaks code that expects a string (`note.trim()` would throw). The safer design is to revive **by key** (`key === 'at' || key.endsWith('At')`) or by a schema that knows each field's type, and to keep the format check as a second guard.

### Rebuilding exact values with `context.source`

Because `parse` converts numbers to doubles before the reviver runs, a reviver cannot normally recover a large integer: by the time it sees `9007199254740993`, the value is already `9007199254740992`. A newer feature, **JSON.parse source text access**, passes a third argument, `context`, whose `source` property is the original text of a primitive value:

```javascript title="source-text.js"
const order = JSON.parse('{"id": 9007199254740993}', (key, value, context) =>
  key === 'id' ? BigInt(context.source) : value);
console.log(order.id);
console.log(JSON.stringify({ id: JSON.rawJSON('9007199254740993') }));
```

```output
9007199254740993n
{"id":9007199254740993}
```

The companion `JSON.rawJSON(text)` creates a value that `stringify` writes verbatim, so you can emit a large number without quotes. Both work in Node 22 (verified here) and in Chromium-based browsers since version 114; support in other engines arrived later, so check your targets before depending on them. Where they are unavailable, send large integers as strings.

### The falsy root key

Revivers often need to skip the root call. Because the root key is `""`, which is falsy, `if (!key) return value` does exactly that — and `"0"`, the first array index, is a non-empty string and therefore truthy, so array elements are *not* accidentally skipped:

```javascript title="root-key.js"
console.log(JSON.parse('[5,6]', (k, v) => (k ? v * 10 : v)));
console.log(JSON.parse('{"a":{"b":1}}', (k, v) => (k === '' ? 'replaced root' : v)));
```

```output
[ 50, 60 ]
replaced root
```

The second line is the real trap: whatever the reviver returns for key `""` *is* the result of `JSON.parse`. A reviver that returns `undefined` for unrecognised keys turns the whole parse into `undefined`. Always end with `return value`.

```quiz
Q: A reviver converts arrays of `[key, value]` pairs into `Map`s, and the pairs' values are tagged `BigInt` objects that another branch of the same reviver converts. Why are the `Map`s built with real `BigInt` values rather than tagged objects?
- [ ] `JSON.parse` calls the reviver twice for nested values
- [x] The reviver runs bottom-up, so nested values are revived before the array that contains them
- [ ] `Map` automatically converts tagged objects
- [ ] It only works if the `BigInt` branch appears first in the reviver code
> `JSON.parse` walks the parsed result depth-first and calls the reviver on children before their parent. By the time the reviver sees the array of pairs, each inner value has already been replaced by a `BigInt`. The order of branches inside the function does not matter; the order of calls does.
```

## How it works internally

The specification describes `stringify` with `SerializeJSONProperty(state, key, holder)`. For each property it reads `value = holder[key]`; if `value` is an object or `BigInt` with a callable `toJSON`, it sets `value = value.toJSON(key)`; if there is a replacer function, it sets `value = replacer.call(holder, key, value)`; then it serialises by type, recursing into objects and arrays with the *current* value as the new holder. An array replacer is turned into a property list once, up front, and is used instead of the object's own keys for every object. A `BigInt` can therefore be handled either by a replacer or by defining `BigInt.prototype.toJSON` — the latter works, but patching a built-in prototype affects the whole program and is best avoided in libraries.

`parse` first parses the whole text into plain values without calling anything. If a reviver was given, it then runs `InternalizeJSONProperty(holder, name, reviver)` starting from the wrapper `{ "": result }`: for an object or array it recurses into every own property first, writing back or deleting each result, and only then calls `reviver.call(holder, name, value)` for the current value. That is why the walk is bottom-up and why deletions show up as holes in arrays.

Both hooks run in your code for every single value, so a slow replacer or reviver multiplies across large payloads. Keep them simple, avoid allocating per call when you can, and do expensive work (schema validation, for example) once after parsing instead of inside the reviver.

## Worked example: a typed round trip

An app stores state that contains a `Date`, a `Map` of `BigInt` balances and a `Set` of flags. Each unsupported value is encoded as a tagged object `{ "$type": …, "value": … }` and decoded on the way back.

```javascript title="typed-json.js"
function replacer(key, value) {
  const raw = this[key]; // the value before toJSON ran
  if (raw instanceof Date) return { $type: 'Date', value: raw.toISOString() };
  if (raw instanceof Map) return { $type: 'Map', value: [...raw] };
  if (raw instanceof Set) return { $type: 'Set', value: [...raw] };
  if (typeof raw === 'bigint') return { $type: 'BigInt', value: raw.toString() };
  return value;
}

function reviver(key, value) {
  if (value === null || typeof value !== 'object' || !('$type' in value)) return value;
  switch (value.$type) {
    case 'Date': return new Date(value.value);
    case 'Map': return new Map(value.value);
    case 'Set': return new Set(value.value);
    case 'BigInt': return BigInt(value.value);
    default: return value;
  }
}

const state = {
  updatedAt: new Date(Date.UTC(2026, 10, 12)),
  balances: new Map([['acct-1', 1999n], ['acct-2', 250n]]),
  flags: new Set(['beta']),
};

const text = JSON.stringify(state, replacer);
console.log(text);

const back = JSON.parse(text, reviver);
console.log(back.updatedAt instanceof Date, back.balances.get('acct-1'), back.flags.has('beta'));
```

```output
{"updatedAt":{"$type":"Date","value":"2026-11-12T00:00:00.000Z"},"balances":{"$type":"Map","value":[["acct-1",{"$type":"BigInt","value":"1999"}],["acct-2",{"$type":"BigInt","value":"250"}]]},"flags":{"$type":"Set","value":["beta"]}}
true 1999n true
```

Walk through the decisions. The replacer is a `function` and reads `this[key]`, because the `Date` has already been turned into a string by `toJSON` by the time `value` arrives. When it returns `{ $type: 'Map', value: [...raw] }`, `stringify` walks into that new object and calls the replacer on its contents — that is how the `BigInt`s inside the `Map` get tagged too. On the way back, the reviver's bottom-up order means each `["acct-1", {$type: "BigInt"…}]` pair already holds a real `BigInt` by the time the surrounding `Map` tag is revived. The `switch` acts as an **allowlist**: unknown tags are left as plain data rather than being used to look up and construct arbitrary classes, which would let crafted input instantiate things you did not intend.

One limitation remains: a real object in your data that happens to have a `$type` key would be misinterpreted. Libraries that do this for you, such as `superjson` (used by tRPC), store type information in a separate metadata section instead, which avoids collisions.

## In real systems

Replacers appear most often in **logging**, to redact secrets and to make `Error` objects readable (`if (this[key] instanceof Error) return { name, message, stack }`). Frameworks use `toJSON` on model classes to control API output: ORM entities expose public fields and hide internal ones, and Express's `res.json()` simply calls `JSON.stringify`, so `toJSON` decides what clients see. Revivers are common at **API client boundaries** to turn timestamps into `Date` objects, though many teams now prefer schema libraries (Zod's `z.coerce.date()`, for example) that validate and convert in one step with knowledge of each field's type. Some HTTP clients accept a custom parser so you can plug in a reviver or a big-number-aware parser.

## Trade-offs and alternatives

Hooks keep the wire format plain JSON — any other language can still read it — while letting JavaScript code work with richer types. The cost is that both sides must agree on the conventions, and the conventions are invisible in the JSON itself: a Python client sees `{"$type": "Date", …}` and must implement the same decoding.

Alternatives: build the exact payload object yourself before stringifying (often clearer than a clever replacer); validate and convert after parsing with a schema (safer than format-guessing revivers); use `superjson` or similar for full type fidelity between JavaScript programs; or use `structuredClone` when the data never leaves the process ([[b1-structured-clone]]).

## Common mistakes

- **Using an arrow function when you need `this`.** Arrow functions do not receive the holder, so `this[key]` fails. Use `function` for replacers and revivers that inspect the original value.
- **Checking `value instanceof Date` in a replacer.** `toJSON` already converted it. Check `this[key]`.
- **Forgetting `return value`.** A replacer that returns nothing serialises everything as omitted (the root becomes `undefined`); a reviver that returns nothing makes `JSON.parse` return `undefined`.
- **Expecting an array replacer to filter by path.** It allows names at every depth and never filters array elements.
- **Reviving by format alone.** User text that looks like a date becomes a `Date`. Revive by key or schema.
- **Trusting type tags in untrusted input.** Only construct types from an allowlist, never by looking up a class name from the data.
- **Patching `BigInt.prototype.toJSON` in a library.** It changes behaviour for every consumer. Use a replacer.

## Interview perspective

Interviewers use this topic to check whether you know the exact algorithm, not just that hooks exist.

> [!INTERVIEW] What a strong answer sounds like
> "For each value, `stringify` calls `toJSON` first, then the replacer with the holder as `this`, starting with the root under the key empty string, and walks top-down into whatever the replacer returns. Returning `undefined` omits an object property or writes `null` in an array. `parse` builds plain values first, then calls the reviver bottom-up, children before parents, root last; returning `undefined` deletes the property. I use replacers for redaction and `BigInt`, `toJSON` for class wire formats, and revivers by key for dates."

Questions to expect:

- **In what order do `toJSON` and the replacer run?** `toJSON` first, then the replacer on its result.
- **What is the first key a replacer or reviver sees?** For the replacer, `""` (the root) first; for the reviver, the deepest leaf first and `""` last.
- **How do you serialise a `BigInt`?** A replacer that converts to a string (or `JSON.rawJSON` where supported) and a reviver that calls `BigInt`.
- **How would you keep passwords out of logs?** A replacer — preferably an allowlist of loggable fields.
- **Follow-up: why might a reviver turn a user's comment into a `Date`?** Format-based detection; fix by reviving known keys.

## Practice

1. **Redacting logger.** Write `logSafe(obj)` that stringifies with two-space indentation, replaces the values of `password`, `token` and `authorization` (case-insensitive) with `"[REDACTED]"`, and serialises `Error` objects as `{ name, message }`.
2. **Allowlist by path.** Write a replacer that keeps only `id` and `name` at the top level but all fields inside `address`. Explain why an array replacer cannot do this.
3. **`toJSON` / `fromJSON`.** Give a `Temperature` class with a private `#kelvin` field a `toJSON` that emits `{ celsius }` and a `fromJSON` that rebuilds it. Round-trip an array of them.
4. **Key-based date reviver.** Revive every key ending in `At` into a `Date`, leave other strings alone, and test it with a `note` field that looks like a date.
5. **Extend the typed round trip.** Add support for `RegExp` (`source` and `flags`) and `undefined` values inside arrays.

## Quick revision {#quick-revision}

- `JSON.stringify(value, replacer, space)`: per value → `toJSON(key)` if present → replacer `(key, value)` with `this` = holder → serialise.
- Root call uses key `""` and a wrapper holder `{ "": value }`; replacer walks top-down into whatever it returns.
- Replacer returning `undefined`: property omitted in objects, `null` in arrays.
- Replacer sees post-`toJSON` values (dates are strings); use `this[key]` in a `function` to see the original.
- Array replacer: allowlist of property names applied at every depth; does not filter array elements; sets key order.
- `toJSON(key)`: object describes its own JSON form; built into `Date`; pair with a static `fromJSON` by convention.
- `JSON.parse(text, reviver)`: parse fully, then reviver bottom-up, root (`""`) last; `this` = holder.
- Reviver returning `undefined` deletes the property (holes in arrays); its return value for `""` is the final result.
- Revive dates by key or schema, not by format alone; treat type tags as an allowlist.
- `context.source` (reviver third argument) and `JSON.rawJSON` give exact number text; available in Node 22 and Chromium 114+.

## Key takeaways {#key-takeaways}

- Hooks customise conversion without changing the JSON format: `toJSON` and a replacer on the way out, a reviver on the way in.
- `stringify` applies `toJSON` before the replacer and walks top-down; `parse` revives bottom-up with the root last.
- Returning `undefined` removes a value — omitted or `null` when serialising, deleted when reviving.
- Encode unsupported types deliberately (strings for `BigInt`, tagged objects or known keys for dates, maps and sets) and decode them with matching rules.
- Revivers must be conservative: convert known fields, allowlist type tags, and always return the value they do not handle.
