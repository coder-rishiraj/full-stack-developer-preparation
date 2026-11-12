---
summary: A symbol is a primitive value that is guaranteed to be unique, used as a property key that cannot clash with any other. You will learn how symbols behave as keys, when to share them through the global registry, and how the built-in "well-known" symbols let your objects plug into `for...of`, `instanceof`, type conversion and other language features.
difficulty: intermediate
minutes: 40
objectives:
  - Explain what makes a symbol unique and why that prevents property-name collisions
  - Predict which operations see symbol-keyed properties and which skip them
  - Choose between `Symbol()` and `Symbol.for()`, and use `Symbol.keyFor()` correctly
  - Implement well-known symbols such as `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag` and `Symbol.hasInstance` on your own classes
  - Compare symbols with private class fields and `WeakMap` for hiding data
---

## Introduction

Every property of a JavaScript object has a **key**. For most of the language's history, keys were always strings: even `arr[0]` is stored under the string `"0"`. Strings have one weakness as keys: anyone can type the same string. If your code adds a property called `id` to an object, and a library you use also adds `id` to the same object, one silently overwrites the other. The bigger the codebase and the more libraries share objects, the more likely this becomes.

ES2015 (the 2015 edition of the language standard, often called ES6) added a new primitive type, **`symbol`**, to solve this. A symbol is a value whose only important property is its identity: every symbol you create is different from every other value, including every other symbol. Use one as a property key and no other code can produce that key by accident, because no other code can produce that symbol unless you hand it over.

The language itself needed exactly this. When ES2015 introduced iteration, it needed a method name meaning "give me an iterator" that could not break existing objects that happened to have a property called `iterator`. The answer was a symbol, `Symbol.iterator`. A whole family of such built-in symbols — the **well-known symbols** — now act as hooks into language behaviour: iteration, type conversion, `instanceof`, string matching and more.

This lesson covers symbols as values and keys, the shared **global symbol registry** (`Symbol.for` and `Symbol.keyFor`), and the well-known symbols. You will meet symbols mostly in two places: library code that attaches metadata to objects, and classes that integrate with built-in behaviour such as `for...of`.

## Before you start

- **Primitive types** — `symbol` is one of the seven primitive types, next to `string`, `number`, `bigint`, `boolean`, `undefined` and `null`. See [[b1-primitive-types]] and the short overview in [[b1-type-symbol-overview]].
- **Objects and property keys** — dot and bracket access, and computed keys in object literals (`{ [key]: value }`). See [[b1-dot-vs-bracket]] and [[b1-computed-properties]].
- **Enumerable properties** — what `Object.keys` and `for...in` list. See [[b1-enumerable-properties]].
- **Classes** — for the examples that define symbol-keyed methods. See [[b1-classes]].

## The intuition

Imagine a shared office fridge. Everyone labels their lunch by writing a name on it. Two people called Sam will eventually eat each other's lunch, because a written name can be copied by anyone. Now imagine everyone instead gets a unique numbered seal from a machine that never issues the same seal twice. Only the person holding a seal can find or claim what is under it, and two seals that happen to have the same note written on them ("Sam's lunch") are still different seals.

A symbol is that seal. The note — called the symbol's **description** — is only for humans reading debug output. Identity comes from the seal, not the note.

The analogy has a limit worth stating now: a symbol is not a lock. Anyone who can see the object can list its symbol keys and read the values. Symbols prevent *accidental* collisions; they do not provide privacy. Real privacy uses private class fields or closures, compared later in this lesson.

## Creating symbols and using them as keys

You create a symbol by calling `Symbol()`, optionally with a description. Each call returns a new, unique value:

```javascript title="unique.js"
const a = Symbol('id');
const b = Symbol('id');
console.log(typeof a, a === b, a.description, a.toString());

const user = { name: 'Ada' };
user[a] = 101;
console.log(user[a], user[b]);
console.log(Object.keys(user), JSON.stringify(user));
console.log(Object.getOwnPropertySymbols(user));
console.log(Reflect.ownKeys(user));
```

```output
symbol false id Symbol(id)
101 undefined
[ 'name' ] {"name":"Ada"}
[ Symbol(id) ]
[ 'name', Symbol(id) ]
```

Read this line by line. `typeof` reports `'symbol'`, a type of its own. `a` and `b` have the same description but are not equal. Storing a value under `a` and reading it under `b` finds nothing, because they are different keys. `Object.keys` and `JSON.stringify` do not see the symbol-keyed property at all. It is still there, though: `Object.getOwnPropertySymbols` lists symbol keys, and `Reflect.ownKeys` lists every own key of both kinds ([[b1-reflect]]).

Because symbols must be used through brackets, there is no `user.a` shortcut: `user.a` means the *string* key `"a"`. In object literals and classes, put the symbol in square brackets as a computed key:

```javascript title="literal-keys.js"
const ID = Symbol('id');
const record = {
  name: 'invoice',
  [ID]: 7,
  [Symbol.iterator]() { /* covered later */ },
};
```

### Which operations see symbol keys

The rule behind the first example is simple: **APIs that return keys as strings skip symbols; APIs that copy or describe properties include them.** Symbol-keyed properties are ordinary properties — they can be enumerable, writable and configurable — but most iteration over keys was defined to return strings only, so that old code would not suddenly start receiving symbols.

```javascript title="who-sees-symbols.js"
const secret = Symbol('secret');
const obj = { visible: 1, [secret]: 2 };
for (const k in obj) console.log('for...in:', k);
console.log(Object.assign({}, obj));
console.log({ ...obj });
console.log(Object.getOwnPropertyDescriptor(obj, secret));
console.log(obj[Object.getOwnPropertySymbols(obj)[0]]);
console.log(structuredClone(obj));
```

```output
for...in: visible
{ visible: 1, [Symbol(secret)]: 2 }
{ visible: 1, [Symbol(secret)]: 2 }
{ value: 2, writable: true, enumerable: true, configurable: true }
2
{ visible: 1 }
```

| Operation | Includes symbol keys? |
|---|---|
| `Object.keys`, `Object.values`, `Object.entries`, `for...in` | no |
| `JSON.stringify` | no — symbol keys are dropped, and a symbol *value* is dropped or becomes `null` in an array |
| `Object.getOwnPropertyNames` | no |
| `Object.getOwnPropertySymbols` | only symbols |
| `Reflect.ownKeys` | yes, strings then symbols |
| `Object.assign`, object spread `{ ...obj }` | yes, enumerable ones |
| `structuredClone` | no — symbol-keyed properties are not cloned |
| `in`, `Object.hasOwn`, `obj[sym]` | yes, if you have the symbol |

The last line of the example shows the important consequence: anyone can fetch the symbol with `Object.getOwnPropertySymbols` and read the value. A symbol key is **hidden from casual enumeration**, not secret. That is exactly what you want for metadata that should not show up in `Object.keys`, in JSON payloads or in a `for...in` loop written by someone else, and it is not enough for anything security-sensitive. Details of JSON's behaviour are in [[b1-json-unsupported]].

### Symbols resist accidental conversion

A symbol has no sensible automatic string or number form, so implicit conversion throws instead of producing something misleading:

```javascript title="conversion.js"
const tag = Symbol('tag');
try { console.log('tag: ' + tag); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
try { console.log(`${tag}`); } catch (e) { console.log(e.constructor.name); }
try { console.log(+tag); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
console.log(String(tag), tag.description, Boolean(tag), !!Symbol());
try { new Symbol(); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
console.log(Symbol().description, Symbol('').description);
```

```output
TypeError: Cannot convert a Symbol value to a string
TypeError
TypeError: Cannot convert a Symbol value to a number
Symbol(tag) tag true true
TypeError: Symbol is not a constructor
undefined 
```

Concatenation and template literals throw, which catches bugs such as building a cache key string from a symbol by mistake. Explicit `String(sym)` or `sym.toString()` is allowed and gives `Symbol(tag)`; `sym.description` gives the bare description. Every symbol is truthy. `Symbol` is not a constructor: `new Symbol()` throws, because a symbol is a primitive and should not be wrapped in an object by accident. The last line shows that a symbol created without a description has `description` `undefined`, which is different from an empty-string description.

### Why collisions matter: a concrete case

```javascript title="collision.js"
// Two libraries both want to tag DOM-like objects with their own metadata.
const node = { id: 'n1' };

// With string keys, the second library silently overwrites the first.
node.meta = { owner: 'analytics' };
node.meta = { owner: 'drag-and-drop' };
console.log(node.meta.owner);

// With symbols, each library owns a key that nobody else can name by accident.
const analyticsMeta = Symbol('analytics.meta');
const dndMeta = Symbol('dnd.meta');
node[analyticsMeta] = { owner: 'analytics' };
node[dndMeta] = { owner: 'drag-and-drop' };
console.log(node[analyticsMeta].owner, node[dndMeta].owner);
```

```output
drag-and-drop
analytics drag-and-drop
```

Each library keeps its symbol in a module-level `const` and never exports it, so no other code can even name its key. The libraries cannot interfere with each other or with the object's own `id`, and neither tag appears when the object is logged with `Object.keys` or sent as JSON.

```quiz
Q: An object has `{ name: 'a', [Symbol('id')]: 1 }`. Which call returns an array containing the symbol key?
- [ ] `Object.keys(obj)`
- [ ] `Object.getOwnPropertyNames(obj)`
- [x] `Reflect.ownKeys(obj)`
- [ ] `Object.entries(obj)`
> `Reflect.ownKeys` returns every own key, strings first and then symbols. `Object.keys`, `Object.getOwnPropertyNames` and `Object.entries` were all defined to return string keys only, so that code written before ES2015 would never receive a symbol it did not expect. The property is enumerable; it is skipped because of its key type, not its flags.
```

## Symbol.for / keyFor {#b1-symbol-for}

`Symbol.for(key)` returns a symbol from a **global symbol registry**: a runtime-wide table that maps string keys to symbols. The first call with a given string creates the symbol and records it; every later call with the same string, from anywhere in the program, returns that same symbol. `Symbol.keyFor(sym)` does the reverse lookup and returns the string a registered symbol was created with. Together they let separate pieces of code agree on one symbol without importing it from each other.

### Shared versus unique

The difference from `Symbol()` is the whole point:

```javascript title="registry.js"
const a = Symbol.for('app.id');
const b = Symbol.for('app.id');
console.log(a === b, Symbol.keyFor(a));

const local = Symbol('app.id');
console.log(local === a, Symbol.keyFor(local), local.description);

console.log(Symbol.keyFor(Symbol.iterator));
console.log(Symbol.for(42) === Symbol.for('42'));
try { Symbol.keyFor('app.id'); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
```

```output
true app.id
false undefined app.id
undefined
true
TypeError: app.id is not a symbol
```

`a` and `b` are the same symbol because both came from the registry under `'app.id'`. `local` has the same *description* but was never registered, so it is a different symbol and `Symbol.keyFor` returns `undefined` for it. Well-known symbols such as `Symbol.iterator` are not in the registry either. The key is converted to a string first, so `Symbol.for(42)` and `Symbol.for('42')` are the same symbol. `Symbol.keyFor` only accepts symbols; passing a string throws.

A useful way to hold the two apart: `Symbol()` gives you a key **nobody else can produce**; `Symbol.for()` gives you a key **anybody can produce if they know the name**. That makes a registered symbol closer to a string key than to an ordinary symbol. It still has the symbol advantages — it cannot collide with string keys, it is skipped by `Object.keys` and JSON — but any code that types `Symbol.for('app.id')` gets it.

### Why a registry is needed

Unique symbols work well when one module creates the symbol and everyone who needs it imports it. That breaks down when there are several *copies* of the code. It happens more often than it sounds: a page can load two bundles that each include their own copy of a library, `node_modules` can contain two versions of the same package, and micro-frontends ship separately built bundles. Each copy runs `Symbol('mylib.plugin')` and gets its own symbol, so an object marked by one copy is not recognised by the other.

```javascript title="two-copies.js"
// Simulates two separately bundled copies of the same library.
function loadPluginBundle() {
  const MARK = Symbol.for('mylib.plugin'); // registry: same symbol in every copy
  const LOCAL = Symbol('mylib.plugin');     // unique to this copy
  return {
    isPlugin: (x) => x != null && x[MARK] === true,
    isPluginLocal: (x) => x != null && x[LOCAL] === true,
    make: () => ({ [MARK]: true, [LOCAL]: true }),
  };
}
const v1 = loadPluginBundle();
const v2 = loadPluginBundle();
const plugin = v1.make();
console.log(v2.isPlugin(plugin), v2.isPluginLocal(plugin));
```

```output
true false
```

The registry symbol is recognised across copies; the local one is not. React uses this technique: its element objects carry a `$$typeof` property whose value is `Symbol.for('react.element')` (React 19 uses `Symbol.for('react.transitional.element')`), so elements created by one copy of React can be recognised by tooling and by other code that checks the same registered symbol. A useful side effect for security: JSON cannot contain symbols, so a JSON payload injected into the page cannot forge something that passes this check.

The registry is also shared across **realms** — separate global environments with their own built-ins, such as the main page and an iframe inside it: an iframe's `Symbol.for('x')` returns the same symbol as the parent page's, which unique symbols cannot do.

### Naming registered symbols

Because the registry is one global namespace, registered keys can collide just like global variables. Use a prefix that identifies your package, such as `'mylib.plugin'` or `'@acme/forms.fieldMeta'`, never a generic word like `'id'`. If two packages register `Symbol.for('id')`, they share a key and the collision problem is back.

### Registered symbols cannot be weak keys

Since ES2023, unregistered symbols can be used as `WeakMap` keys and `WeakSet` values, alongside objects ([[b1-weakmap]]). Registered symbols cannot, because they can always be re-created from their string, so they never become unreachable:

```javascript title="weak-keys.js"
const wm = new WeakMap();
const local = Symbol('cache-key');
wm.set(local, 'ok');
console.log(wm.get(local));
try {
  wm.set(Symbol.for('cache-key'), 'no');
} catch (e) {
  console.log(e.constructor.name + ': ' + e.message);
}
```

```output
ok
TypeError: Invalid value used as weak map key
```

The error message is V8's (Node.js 22); other engines word it differently.

### Choosing between them

| You want | Use |
|---|---|
| A key private to your module, impossible to reproduce elsewhere | `Symbol('desc')` kept in a non-exported `const` |
| A key several copies of a library, or several packages, must agree on | `Symbol.for('namespaced.key')` |
| A language hook (iteration, conversion…) | the well-known symbol, e.g. `Symbol.iterator` |
| To find out whether a symbol is registered, and under what name | `Symbol.keyFor(sym)` — `undefined` means not registered |

The most common bug with the registry is mixing the two forms: storing a value under `Symbol('x')` and reading it with `Symbol.for('x')` finds nothing, because they are different symbols. The descriptions match, which makes the bug hard to see in logs.

```quiz
Q: Module A runs `obj[Symbol('token')] = 1`. Module B later runs `obj[Symbol.for('token')]`. What does B read?
- [ ] `1`, because both symbols have the description `'token'`
- [x] `undefined`, because a registered symbol is never equal to an unregistered one
- [ ] It throws, because `Symbol.for` cannot be used as a key
- [ ] `1`, but only if A ran first
> `Symbol('token')` creates a new symbol that is not in the registry; `Symbol.for('token')` returns the registered symbol for that string, creating it if needed. They are different values, so they are different keys. A description is a label for debugging, never part of a symbol's identity.
```

## Well-known Symbols {#b1-well-known-symbols}

The **well-known symbols** are a fixed set of symbols, stored as static properties of `Symbol` (`Symbol.iterator`, `Symbol.toPrimitive` and so on), that the language itself looks up on objects when performing certain operations. If an object has a method under one of these keys, the language calls it instead of using the default behaviour. They are how you customise iteration, type conversion, `instanceof`, string matching and other built-in operations for your own classes, without risk of clashing with ordinary method names.

The specification writes them as `@@iterator`, `@@toPrimitive` and so on (recent editions write `%Symbol.iterator%`); you will see that notation in documentation. The same well-known symbols are shared by all realms (separate global environments, such as a page and its iframes), so an iframe's `Symbol.iterator` is identical to the main page's. They are not in the global registry, so `Symbol.keyFor(Symbol.iterator)` is `undefined`.

| Symbol | Language operation that looks it up |
|---|---|
| `Symbol.iterator` | `for...of`, spread, destructuring, `Array.from`, `yield*` |
| `Symbol.asyncIterator` | `for await...of` |
| `Symbol.toPrimitive` | converting an object to a primitive (`+obj`, `` `${obj}` ``, `obj == 1`) |
| `Symbol.toStringTag` | `Object.prototype.toString` — the `Foo` in `[object Foo]` |
| `Symbol.hasInstance` | `x instanceof C` |
| `Symbol.isConcatSpreadable` | `Array.prototype.concat` — whether to flatten an argument |
| `Symbol.species` | which constructor derived-object methods such as `map` and `then` use |
| `Symbol.match`, `matchAll`, `replace`, `search`, `split` | the `String.prototype` methods of the same names |
| `Symbol.unscopables` | which properties a `with` statement hides |
| `Symbol.dispose`, `Symbol.asyncDispose` | `using` / `await using` declarations (newer; see below) |

### `Symbol.iterator` and `Symbol.asyncIterator`

These are the most used by far: an object with a `[Symbol.iterator]()` method that returns an iterator works with `for...of`, spread and destructuring, and `[Symbol.asyncIterator]()` does the same for `for await...of`. They are taught in full, with examples, in [[b1-symbol-iterator]] and [[b1-async-iterators]].

### `Symbol.toPrimitive`

When JavaScript needs a primitive from an object — for arithmetic, string interpolation, comparison — it first looks for a `[Symbol.toPrimitive](hint)` method. The **hint** tells the method what the context wants: `'number'` for arithmetic and relational comparison, `'string'` for template literals and `String()`, and `'default'` for `+` and `==`, where either could make sense. Without the method, the engine falls back to `valueOf()` and `toString()` ([[b1-to-primitive]]).

```javascript title="to-primitive.js"
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount.toFixed(2)} ${this.currency}`;
    return this.amount; // 'default': used by + and ==
  }
}

const price = new Money(9.5, 'EUR');
console.log(`${price}`);
console.log(price * 2);
console.log(price + 1);
console.log(price > 5, String(price));
```

```output
9.50 EUR
19
10.5
true 9.50 EUR
```

The template literal asked for a string, multiplication and `>` asked for numbers, and `+` asked with the `'default'` hint, which this class treats as numeric. The method must return a primitive; returning an object throws a `TypeError`. Use this sparingly: implicit conversion makes code harder to read, and for money in particular an explicit `format()` method is usually clearer. [[b1-symbol-toprimitive]] goes deeper.

### `Symbol.toStringTag` and `Symbol.hasInstance`

`Object.prototype.toString` produces strings like `[object Map]`, which some code uses for type checks ([[b1-object-tostring]]). A `Symbol.toStringTag` property supplies the name in that string. Built-ins such as `Map`, `Promise` and generator objects define it, which is where `[object Map]` comes from ([[b1-tostringtag]]).

`instanceof` normally walks the prototype chain ([[b1-instanceof]]). If the right-hand side has a `Symbol.hasInstance` method, `instanceof` calls it instead and uses its result:

```javascript title="tag-and-instanceof.js"
class Temperature {
  get [Symbol.toStringTag]() {
    return 'Temperature';
  }
}
console.log(Object.prototype.toString.call(new Temperature()));
console.log(Object.prototype.toString.call(new Map()), Object.prototype.toString.call(null));
console.log(String(new Temperature()));

class Even {
  static [Symbol.hasInstance](value) {
    return Number.isInteger(value) && value % 2 === 0;
  }
}
console.log(4 instanceof Even, 3 instanceof Even, '4' instanceof Even);
```

```output
[object Temperature]
[object Map] [object Null]
[object Temperature]
true false false
```

`Even` shows how far `Symbol.hasInstance` can go: `4 instanceof Even` is true even though `4` is a primitive and was never constructed by `Even`. That power is also the reason to avoid it in application code — readers expect `instanceof` to mean "was built by this class". It is mostly useful for libraries that need "is this a valid X?" checks across several implementations.

The method must be defined with `static` in a class (or with `Object.defineProperty`). Plain assignment, `Even[Symbol.hasInstance] = fn`, silently does nothing in sloppy mode and throws in strict mode, because every function inherits a non-writable `Symbol.hasInstance` from `Function.prototype`.

### `Symbol.isConcatSpreadable` and `Symbol.species`

`concat` flattens array arguments one level and appends other values as single items. `Symbol.isConcatSpreadable` overrides that decision for one object. `Symbol.species` is a static getter on a constructor that tells methods which create a new object of "the same kind" — `map`, `filter` and `slice` on arrays, `then` on promises — which constructor to use instead:

```javascript title="concat-and-species.js"
const extra = { length: 2, 0: 'c', 1: 'd', [Symbol.isConcatSpreadable]: true };
console.log(['a', 'b'].concat(extra));

const noSpread = ['x', 'y'];
noSpread[Symbol.isConcatSpreadable] = false;
console.log(['a'].concat(noSpread).length);

class Stack extends Array {
  static get [Symbol.species]() {
    return Array; // map/filter return plain arrays, not Stacks
  }
}
const s = Stack.from([1, 2, 3]);
const doubled = s.map((n) => n * 2);
console.log(s instanceof Stack, doubled instanceof Stack, doubled);
```

```output
[ 'a', 'b', 'c', 'd' ]
2
true false [ 2, 4, 6 ]
```

The array-like object was spread into the result; the array marked `false` was added as a single nested element, giving a length of 2. Without the `species` getter, `s.map(...)` would have returned a `Stack`. `Symbol.species` has been criticised for complicating built-ins and creating security problems, and newer methods such as `toSorted` deliberately ignore it, so you are unlikely to need it outside subclassing built-ins.

### String-matching symbols

`String.prototype.match`, `matchAll`, `replace`, `search` and `split` do not have regular-expression logic built in. They check whether their first argument has the corresponding symbol method and, if so, delegate to it. `RegExp.prototype` defines all five, which is how regular expressions work with these methods. Any object can do the same:

```javascript title="match-symbols.js"
const startsWithHash = {
  [Symbol.match](str) {
    return str.startsWith('#') ? [str] : null;
  },
};
console.log('#tag'.match(startsWithHash), 'tag'.match(startsWithHash));

const vowels = { [Symbol.replace]: (str, rep) => str.replace(/[aeiou]/g, rep) };
console.log('banana'.replace(vowels, '*'));
try { '/path'.startsWith(/\//); } catch (e) { console.log(e.constructor.name + ': ' + e.message); }
```

```output
[ '#tag' ] null
b*n*n*
TypeError: First argument to String.prototype.startsWith must not be a regular expression
```

The last line is a side use of `Symbol.match`: `startsWith`, `endsWith` and `includes` treat any object whose `Symbol.match` property is truthy as a regular expression and throw, to prevent the confusion of passing a pattern to a method that only takes plain text. The wording of the message is V8's.

### `Symbol.unscopables`, `Symbol.dispose` and `Symbol.asyncDispose`

`Symbol.unscopables` exists for backward compatibility: when new array methods such as `flat` were added, old code inside `with (array) { ... }` blocks could have started resolving names like `flat` to the method. `Array.prototype[Symbol.unscopables]` lists those methods so that `with` skips them. `with` is forbidden in strict mode and modules, so you will only meet this when reading the specification.

`Symbol.dispose` and `Symbol.asyncDispose` belong to the newer **explicit resource management** feature. An object with a `[Symbol.dispose]()` method can be declared with `using res = open()`, and the method is called automatically when the block exits, much like `try...finally`. Support arrived in Chrome 134 and Node.js 24; Node.js 22 defines the symbols but does not support the `using` syntax. Check your target environments before using it.

### Rules for using well-known symbols

Implement them on **your own classes** to integrate with the language. Do not add or override them on built-in prototypes — for example, assigning `Array.prototype[Symbol.iterator]` or `Object.prototype[Symbol.toStringTag]`. That changes the behaviour of every array or object in the program, including inside libraries, and engines de-optimise code that relies on modified built-ins.

A related cross-realm point is often misattributed to symbols. An array created in an iframe fails `arr instanceof Array` in the parent page. The cause is not the symbols — `Symbol.hasInstance` and the other well-known symbols are shared across realms — but that each realm has its own `Array` constructor and `Array.prototype`, so the prototype-chain check fails. `Array.isArray(arr)` works across realms and is the right check.

```quiz
Q: A class defines `[Symbol.toPrimitive](hint) { return hint === 'string' ? 'text' : 42; }`. What does `` `${obj}` + (obj + 1) `` evaluate to?
- [ ] `'texttext1'`, because `obj + 1` uses the `'string'` hint
- [x] `'text43'`, because the template literal uses the `'string'` hint and `obj + 1` uses `'default'`, which returns `42`
- [ ] `'4243'`, because every conversion uses the `'number'` hint
- [ ] It throws, because `toPrimitive` must handle all three hints explicitly
> A template literal requests a string, so it gets `'text'`. Binary `+` uses the `'default'` hint, which this method maps to `42`, giving `43`. Then `'text' + 43` is `'text43'`. Binary `+` never passes the `'string'` hint, even when the other operand is a string. A method does not have to handle every hint separately; it only has to return a primitive.
```

## How symbols work internally

A symbol is a primitive like a number, but with no visible content: the engine represents it as a unique internal value plus its description. Comparing two symbols compares identity, so `===` is cheap. When a symbol is used as a property key, the engine stores it in the object's property table next to string keys; lookups by symbol are as fast as lookups by string, and engines such as V8 handle symbol-keyed properties in the same hidden-class machinery as string keys ([[b1-hidden-classes]]).

Symbols are primitives, so they are immutable and passed by value. Like strings, they have a wrapper object type: `sym.description` works because the engine temporarily boxes the symbol in a `Symbol` object to look up the getter on `Symbol.prototype` ([[b1-autoboxing]]). You can create the wrapper explicitly with `Object(sym)`, though there is rarely a reason to.

The global symbol registry is a list of `{ key, symbol }` pairs held by the runtime and shared by all realms in it. Its entries are never removed, which is why registered symbols cannot be weak keys. Unregistered symbols are garbage-collected like any other value once nothing refers to them.

## In real systems

- **Language hooks.** Every iterable collection — built-in or from libraries like Immutable.js — defines `Symbol.iterator`. Streams and paginated SDK results define `Symbol.asyncIterator`.
- **Framework type tags.** React marks elements with `$$typeof: Symbol.for('react.transitional.element')` (React 19), and portals, fragments and context use similar registered symbols. The registry lets separate copies agree, and JSON's inability to carry symbols blocks forged elements.
- **Library metadata.** Observability and state libraries attach bookkeeping to user objects under module-private symbols, so the data does not appear in `Object.keys`, serialised payloads or the user's own loops. Some proxy-based state libraries use a symbol to reach the raw object behind a proxy ([[b1-proxy]]).
- **Node.js customisation.** Node's `util.inspect` checks for a method under `Symbol.for('nodejs.util.inspect.custom')`, which controls how an object prints in `console.log`. Because the symbol is registered, a library can implement it without importing `util`.
- **Debugging labels.** `Symbol.toStringTag` gives custom classes readable `[object Name]` output in logs and type-checking utilities.

## Trade-offs and alternatives

Symbols are often suggested for "private" properties. Compare the options:

| Technique | Collision-proof | Hidden from `Object.keys` / JSON | Truly inaccessible from outside | Notes |
|---|---|---|---|---|
| String key, e.g. `_internal` | no | no | no | Convention only |
| `Symbol()` key | yes | yes | **no** — `getOwnPropertySymbols` reveals it | Good for metadata on objects you do not own |
| Private class field `#x` | yes | yes | yes | Only inside a class body; cannot be added to arbitrary objects ([[b1-public-private-fields]]) |
| `WeakMap` keyed by object | yes | yes | yes, if the map is not exported | Works for objects you do not own; data is collected with the object ([[b1-weakmap]]) |
| Closure variable | yes | yes | yes | Not attached to an object at all ([[b1-private-state]]) |

Choose symbols when you need a property that other code must not hit by accident, especially on objects you did not create, and when it is acceptable for determined code to read it. Choose `#private` fields for real encapsulation inside your own classes. Choose `WeakMap` to associate private data with objects you do not control. Do not reach for symbols when a normal string key works: symbol keys are invisible to JSON and `structuredClone`, so data stored under them silently disappears when objects are serialised, sent to a worker or stored.

## Common mistakes

- **Treating symbols as private.** `Object.getOwnPropertySymbols` and `Reflect.ownKeys` expose every symbol key. Use `#private` fields or a `WeakMap` when the data must be hidden.
- **Expecting two symbols with the same description to be equal.** `Symbol('id') !== Symbol('id')`. The description is a label only.
- **Mixing `Symbol()` and `Symbol.for()`.** A value stored under one is not found with the other, and both print as `Symbol(x)`.
- **Assuming `Symbol.for` creates a new symbol each time.** It returns the existing registered symbol; use generic names and you share keys with strangers. Namespace the string.
- **Losing data in serialisation.** `JSON.stringify` and `structuredClone` drop symbol-keyed properties without warning. Keep data that must travel under string keys.
- **Building strings from symbols.** `'key:' + sym` throws a `TypeError`. Use `sym.description` or `String(sym)` explicitly.
- **Writing `new Symbol()`.** Symbols are created by calling `Symbol()` as a function.
- **Assigning `C[Symbol.hasInstance] = fn`.** The inherited property is non-writable, so the assignment is ignored (or throws in strict mode). Use `static [Symbol.hasInstance]` or `Object.defineProperty`.
- **Patching well-known symbols on built-in prototypes.** It changes behaviour for every library in the program. Implement them on your own classes only.

## Interview perspective

**"What is a Symbol and why was it added?"** A primitive type whose values are unique, used mainly as property keys that cannot collide with strings or with each other. It was added in ES2015 to give the language extension points (`Symbol.iterator` and friends) that could not clash with existing property names, and to let libraries attach metadata safely. A strong answer gives the collision example and names a well-known symbol.

**"Are symbol properties private?"** No. They are skipped by `Object.keys`, `for...in` and JSON, but `Object.getOwnPropertySymbols` and `Reflect.ownKeys` list them. For privacy, use `#private` fields, closures or a `WeakMap`. Interviewers ask this to see whether you confuse "non-enumerable by default APIs" with "inaccessible". Bonus: symbol-keyed properties are usually enumerable — `Object.assign` and object spread copy them.

**"`Symbol()` versus `Symbol.for()`?"** `Symbol()` always creates a new unique symbol. `Symbol.for(key)` looks up a runtime-wide registry and returns the same symbol for the same string, across modules, bundle copies and realms; `Symbol.keyFor` returns that string. Mention a real use, such as React's `$$typeof` tag.

**"Name some well-known symbols and what they do."** `Symbol.iterator` (for `for...of`), `Symbol.asyncIterator` (for `for await`), `Symbol.toPrimitive` (conversion with hints), `Symbol.toStringTag` (`[object X]`), `Symbol.hasInstance` (`instanceof`). Being able to implement `Symbol.iterator` on a class on the spot is the most valuable follow-up.

Trap questions: `typeof Symbol()` (`'symbol'`), `Symbol('a') == Symbol('a')` (false), `` `${Symbol()}` `` (throws), and `JSON.stringify({ [Symbol()]: 1 })` (`'{}'`).

## Practice

1. **Metadata without collisions.** Write a module that exports `tag(obj, label)` and `getTag(obj)`, storing the label under a non-exported symbol. Show that `Object.keys(obj)` and `JSON.stringify(obj)` are unchanged after tagging, and that `Reflect.ownKeys` still reveals the key.
2. **Registry across copies.** Extend the two-copies example so that one copy marks an object and the other copy recognises it. Then switch both to `Symbol()` and explain the failure.
3. **Conversion hooks.** Give a `Duration` class (milliseconds) a `Symbol.toPrimitive` method so that `` `${d}` `` prints `"1m 30s"` and `d1 + d2` adds milliseconds. Then argue whether an explicit `format()` method would be better.
4. **Readable type tags.** Add `Symbol.toStringTag` to a class and check the result of `Object.prototype.toString.call(instance)`.
5. **Privacy comparison.** Implement a counter's hidden count three ways — symbol key, `#count` field and `WeakMap` — and for each, try to read the count from outside the class.

## Quick revision {#quick-revision}

- `symbol` is a primitive type; `Symbol(desc)` returns a new unique value every call. `typeof` → `'symbol'`. Not a constructor (`new Symbol()` throws).
- The description is for debugging only: `sym.description`, `String(sym)` → `Symbol(desc)`. Implicit string/number conversion (`+`, template literal) throws `TypeError`.
- Symbol keys need brackets: `obj[sym]`, `{ [sym]: v }`, `[sym]() {}` in classes.
- Skipped by: `Object.keys/values/entries`, `for...in`, `Object.getOwnPropertyNames`, `JSON.stringify`, `structuredClone`.
- Seen by: `Object.getOwnPropertySymbols`, `Reflect.ownKeys`, `Object.assign`, object spread, `in`, `Object.hasOwn`.
- Not private: anyone can list symbol keys. Real privacy → `#private` fields, `WeakMap`, closures.
- `Symbol.for(key)`: global registry, same symbol for same string across modules, bundles and realms. `Symbol.keyFor(sym)` → key or `undefined`. Namespace your keys.
- `Symbol('x') !== Symbol.for('x')`. Registered symbols cannot be `WeakMap` keys; unregistered ones can (ES2023).
- Well-known symbols are language hooks, shared across realms, not in the registry: `iterator`, `asyncIterator`, `toPrimitive` (hints `number`/`string`/`default`), `toStringTag`, `hasInstance`, `isConcatSpreadable`, `species`, `match`/`matchAll`/`replace`/`search`/`split`, `unscopables`, `dispose`/`asyncDispose`.
- Implement well-known symbols on your own classes; never patch them on built-in prototypes. Define `hasInstance` with `static`, not assignment.

## Key takeaways {#key-takeaways}

- A symbol's only job is to be unique, which makes it a property key that cannot collide with strings or with other code's keys.
- Symbol-keyed properties are hidden from key-listing APIs and serialisation, but they are not private; use `#private` fields or a `WeakMap` for that.
- `Symbol()` makes a key nobody else can reproduce; `Symbol.for()` makes one anybody can reproduce by name, which is what separate copies of a library need to agree.
- Well-known symbols are how the language exposes its own behaviour for customisation: iteration, conversion, `instanceof`, string matching and resource disposal all look one up.
- Serialisation silently drops symbol keys, so keep data that must be saved or sent under string keys.
