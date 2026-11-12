---
summary: A WeakSet records which objects belong to a group without keeping those objects alive. You will learn its three-method API, why it accepts only objects and cannot be counted or iterated, and how it is used to mark objects as visited, processed or genuine.
difficulty: intermediate
minutes: 25
objectives:
  - Use add, has and delete on a WeakSet and state which values it accepts
  - Explain why a long-lived Set of objects leaks memory and a WeakSet does not
  - Explain why a WeakSet has no size and cannot be iterated
  - Implement a cycle-safe object traversal and a process-once guard with a WeakSet
  - Choose between Set, WeakSet and WeakMap for a given problem
---

## Introduction

Some questions about an object have a yes-or-no answer that the object itself does not carry. Has this request already been logged? Has this node been visited during the current traversal? Was this object created by my constructor, or is it a look-alike?

The obvious ways to record the answer both have a cost. You can write a flag onto the object — `request._logged = true` — but that modifies something you may not own, shows up in `Object.keys` and JSON output, and fails on frozen objects. Or you can keep the objects in a [[b1-set|Set]]:

```javascript
const logged = new Set();

function logOnce(request) {
  if (logged.has(request)) return;
  logged.add(request);
  console.log('handling', request.url);
}
```

That is clean, and in a server that runs for weeks it is a memory leak. A Set holds a strong reference to everything in it, so every request object ever passed to `logOnce` stays in memory for as long as `logged` exists, long after the request has been answered and forgotten by everything else ([[b1-memory-leaks]]).

A **WeakSet** is a collection of objects that holds its members *weakly*. Membership in a WeakSet does not keep an object alive: when nothing else in the program references the object, the garbage collector may reclaim it, and it leaves the WeakSet automatically. Changing `new Set()` to `new WeakSet()` above removes the leak and nothing else about the function changes.

WeakSet arrived in ES2015 with Set, Map and WeakMap. It is the simplest of the four, and the one you will use least often, but when the problem is "tag these objects without owning them", it is exactly the right tool.

## Before you start

- **Set** — `add`, `has`, `delete`, and objects compared by identity. See [[b1-set]].
- **Strong and weak references, and reachability** — what keeps an object alive. [[b1-weakmap]] explains this in detail, with a diagram and a runnable demonstration; this lesson relies on it and does not repeat it. Background on the collector is in [[b1-garbage-collection]].

## The intuition

Think of the ink stamp some venues put on your hand at the door. The stamp says one thing only: "this person has been admitted". Staff check for it by looking at the hand in front of them. When you go home, the stamp leaves with you; the venue keeps no list of stamped people and could not produce one if asked.

A WeakSet is that stamp. You can stamp an object (`add`), check an object you are holding (`has`) and wipe the stamp off (`delete`). You cannot ask how many objects are stamped or list them. The analogy is inexact in one respect: nothing is written on the object. The record lives in the WeakSet's own internal table, so the object is unchanged and several WeakSets can mark the same object independently.

## The API

```javascript
const seen = new WeakSet();
const node = { name: 'root' };

console.log(seen.add(node) === seen);            // add returns the WeakSet
console.log(seen.has(node), seen.has({ name: 'root' }), seen.has('root'));
console.log(seen.delete(node), seen.delete(node));
console.log(seen.size, typeof seen.clear, typeof seen[Symbol.iterator]);
```

```output
true
true false false
true false
undefined undefined undefined
```

There are three methods. `add(object)` adds a member and returns the WeakSet, so calls can be chained; adding an object twice has no further effect. `has(value)` reports membership by **identity** — a different object with the same contents is not a member — and returns `false` for a primitive without throwing. `delete(value)` removes a member and reports whether it was present. The constructor optionally takes an iterable of objects: `new WeakSet([a, b])`.

The last line shows what does not exist: `size`, `clear`, `forEach`, `keys`, `values`, `entries`, and iteration of any kind.

### Only objects can be members

```javascript
const ids = new WeakSet();

try {
  ids.add('user-42');
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
}
```

```output
TypeError: Invalid value used in weak set
```

A weak member stays "until the object is unreachable". A string or number has no such lifetime — the same value can be written again anywhere, at any time — so it could never be released and holding it weakly would be meaningless. The language therefore rejects primitives with a `TypeError`. Since ES2023, symbols created with `Symbol()` are also accepted, because each is unique; symbols from `Symbol.for()` are not ([[b1-symbol-for]]). For a set of ids, names or numbers, use an ordinary Set.

### Why there is no size and no iteration

Members disappear when the garbage collector reclaims them, and the collector runs at moments the engine chooses. A `size` property would therefore change at unpredictable times, and two runs of the same program could observe different values. Iteration would be worse: listing the members would give the program strong references to objects that were otherwise about to be collected. To keep garbage-collection timing unobservable, the language leaves these features out. The same reasoning, at more length, is in [[b1-weakmap]].

The practical rule: a WeakSet can only answer "is *this* object, which I am holding, a member?". If you need to count the members or do something to each of them, you need a Set.

## How it works internally

The specification gives a WeakSet an internal list, `[[WeakSetData]]`, and requires that membership alone must not make an object count as alive. Engines implement it as a hash table keyed by each object's identity hash, so `add`, `has` and `delete` take constant time on average, and the garbage collector treats the table's references as weak: after marking everything reachable from the roots, it removes table entries whose objects were not marked.

A WeakSet behaves like a [[b1-weakmap|WeakMap]] in which every value is `true`. V8 in fact uses the same weak hash table structure for both. If you find yourself writing `weakMap.set(obj, true)`, a WeakSet states the intent more directly; if you later need to store something about each object, switch to a WeakMap.

## Worked example: walking a structure that contains cycles

Objects can refer to each other in a loop: a tree node with a `parent` link, a user whose `manager` has that user among their `reports`. A naive recursive walk over such a structure never ends. `JSON.stringify` detects the situation and gives up with `TypeError: Converting circular structure to JSON`. The standard remedy is to remember which objects have already been visited.

```javascript title="count-objects.js"
function countObjects(root) {
  const visited = new WeakSet();

  function walk(value) {
    if (value === null || typeof value !== 'object') return 0;   // primitives
    if (visited.has(value)) return 0;                            // already counted
    visited.add(value);

    let count = 1;
    for (const child of Object.values(value)) count += walk(child);
    return count;
  }

  return walk(root);
}

const team = { name: 'platform', members: [] };
const ada = { name: 'Ada', team };
const lin = { name: 'Lin', team, mentor: ada };
team.members.push(ada, lin);

console.log(countObjects(team));
console.log(countObjects({ a: { b: {} }, list: [1, 2] }));
```

```output
4
4
```

Follow the first call. `walk(team)` marks `team` and looks at its values. `'platform'` is a primitive and contributes `0`. The `members` array is an object, so it is marked and counted, and its elements are walked. `ada` is marked and counted; her `team` property leads back to `team`, which is already in `visited`, so that branch returns `0` instead of recursing forever. `lin` is counted; her `team` and `mentor` are both already visited. The total is four distinct objects: `team`, the array, `ada` and `lin`.

The check `typeof value !== 'object'` must come before `visited.has`/`add`, because `add` throws for primitives. Each object is visited once and each `has` is constant time, so the walk is linear in the number of objects and references.

A fair question is whether the WeakSet matters here. `visited` is a local variable; when `countObjects` returns, nothing references it, and an ordinary Set would be collected along with everything it held. For a marker set that lives only for one synchronous call, a Set and a WeakSet behave the same, and either is acceptable. The weak version becomes necessary when the marker set **outlives** the objects — when it is stored in module scope, on a long-lived service object, or across asynchronous steps — as in the next two uses.

## Other uses

### Process once

The introduction's `logOnce` is this pattern. A module-level WeakSet records which objects have been handled, for the life of the program, without accumulating them:

```javascript
const initialised = new WeakSet();
let setups = 0;

function ensureSetup(widget) {
  if (initialised.has(widget)) return;
  initialised.add(widget);
  setups++;                      // stands in for expensive one-time work
}

const widget = { id: 'chart' };
ensureSetup(widget);
ensureSetup(widget);
ensureSetup({ id: 'chart' });

console.log(setups);
```

```output
2
```

The second call with the same object does nothing. The third call passes a different object that merely looks the same, so it is set up separately — membership is by identity. Front-end libraries use this to avoid attaching the same event listeners twice to a DOM element; that browser use is described here, not run.

### Branding: "was this object made by my code?"

`instanceof` checks an object's prototype chain, which anyone can imitate with `Object.create(SomeClass.prototype)` ([[b1-instanceof]]). A WeakSet that only the constructor can add to is a check that cannot be forged:

```javascript
const genuine = new WeakSet();

class Token {
  constructor(value) {
    this.value = value;
    genuine.add(this);
  }
  static isToken(candidate) {
    return genuine.has(candidate);
  }
}

const real = new Token('abc');
const fake = Object.create(Token.prototype);

console.log(fake instanceof Token, Token.isToken(fake), Token.isToken(real));
```

```output
true false true
```

`fake` passes `instanceof` without the constructor ever running, but it was never added to `genuine`. When `genuine` is not exported from its module, outside code has no way to add to it. For classes you write yourself, ES2022 offers the same guarantee more directly: declare a private field and test `#field in candidate` ([[b1-public-private-fields]]).

```quiz
Q: A module holds `const done = new Set()` and adds every incoming request object to it. Why is replacing it with a `WeakSet` an improvement?
- [ ] `WeakSet.has` is faster than `Set.has`
- [x] The Set keeps every request alive for the life of the module; the WeakSet lets a request be collected once nothing else references it
- [ ] A WeakSet removes members after a fixed timeout
- [ ] A WeakSet can also store the request ids as strings
> Both use hash lookups of similar speed. The difference is reference strength: a Set's members are strongly held, so a long-lived Set of short-lived objects grows without bound. A WeakSet's members are collectable as soon as they are otherwise unreachable. WeakSets have no timers and reject strings.

Q: What does `new WeakSet().add('admin')` do?
- [ ] Adds the string and returns the WeakSet
- [ ] Silently ignores the string
- [ ] Converts the string to a String object and adds that
- [x] Throws a TypeError
> Members must be objects (or non-registered symbols). A primitive can always be recreated, so it could never be released, and the language rejects it. Note the asymmetry: `has('admin')` and `delete('admin')` return `false` without throwing.

Q: You need to mark DOM nodes as "already animated" and, at the end, loop over all marked nodes to reset them. Which structure fits?
- [ ] WeakSet, because the nodes are objects
- [ ] WeakMap from node to `true`
- [x] Set, with explicit `delete` or `clear` when finished, because a WeakSet cannot be iterated
- [ ] An object keyed by node
> The requirement to loop over the members rules out both weak collections, which cannot be enumerated. A Set works, at the price of managing its lifetime yourself. An object would convert every node to the same string key.
```

## In real systems

**Reactivity and proxies.** Libraries that wrap objects in proxies need to know whether a given object is already one of their wrappers, or has been marked as "do not wrap". Keeping those marks in a WeakSet avoids both modifying the object and retaining it ([[b1-proxy]]).

**Traversal utilities.** Deep-equality checks, serializers and validators that accept arbitrary user data guard against cycles with a visited set. When they also need the *result* for each visited object — a deep clone must return the copy it already made — they use a WeakMap instead ([[b1-impl-deep-clone]]).

**Private-method checks in compiled code.** When Babel or TypeScript compile private methods for targets older than ES2022, the output adds each instance to a WeakSet in the constructor and checks membership before calling the method, which is the branding pattern above.

## Trade-offs and alternatives

| Need | Use |
|---|---|
| Mark objects; only ever ask "is this one marked?"; the marks outlive the objects | `WeakSet` |
| Members are strings, numbers or other primitives | `Set` |
| Count or iterate the members, or clear them all | `Set`, with explicit cleanup |
| Store data about each object, not only presence | [[b1-weakmap\|`WeakMap`]] |
| Brand instances of your own class | A private `#field` and `#field in obj` |

A WeakSet is deliberately opaque, which makes it awkward to debug: `console.log(weakSet)` in Node.js shows `WeakSet { <items unknown> }`. It also adds a little work to each garbage collection. And it protects against only one cause of retention — if some other structure still references an object, the object stays alive and stays in the WeakSet.

## Common mistakes

**Adding primitives.** `weakSet.add(user.id)` throws. Add the object, or use a Set of ids.

**Reading `size` or iterating.** `weakSet.size` is `undefined` — no error, so a check such as `if (weakSet.size === 0)` is silently always false. `for...of` and spread throw a `TypeError` because a WeakSet is not iterable.

**Expecting equal-looking objects to match.** `ws.add({ id: 1 }); ws.has({ id: 1 })` is `false`. Membership is identity.

**Calling `add` before filtering out primitives** in a generic traversal, which throws on the first string or number.

**Assuming immediate removal.** Dropping the last reference makes the object *eligible* for collection. When it is collected is up to the engine, and code cannot detect it ([[b1-weak-references]]).

## Interview perspective

WeakSet usually appears as part of "explain Set, Map, WeakSet and WeakMap". The interviewer is checking that you know what "weak" means and can name a use that is not contrived.

> [!INTERVIEW] What a strong answer sounds like
> "A WeakSet is a set of objects held weakly — being in it doesn't keep an object alive. It only has `add`, `has` and `delete`; there's no `size` or iteration because the contents depend on garbage collection, which isn't observable by design. I'd use it to tag objects as visited or processed when the tag set lives longer than the objects, like a module-level 'already initialised' set."

Questions to prepare:

- **Set versus WeakSet.** Any value versus objects only; strong versus weak; enumerable versus not.
- **Why can a WeakSet not hold strings?** Primitives have no identity or lifetime to track.
- **Why no `size`?** It would expose garbage-collection timing.
- **WeakSet versus WeakMap.** A WeakSet records presence; a WeakMap records a value per object.
- **Detect a cycle in an object graph.** Depth-first walk with a visited set; mention that detecting a cycle specifically (not merely a shared reference) needs the set of objects on the current path, removing each on the way back out.
- **When is a plain Set fine for visited tracking?** When the set is local to one call and dies with it.

## Practice

1. Write `hasCycle(value)` that returns `true` only for a true cycle. `const shared = {}; hasCycle({ a: shared, b: shared })` must be `false`. Hint: `delete` the object from the set after walking its children.
2. Write `once(fn)` for functions that take one object argument, so that `fn` runs at most once per distinct object.
3. Change `countObjects` to use a WeakMap that records the depth at which each object was first seen, and return the maximum depth.
4. Explain why this "weak" set leaks: `const ws = new WeakSet(); const log = []; function mark(o) { ws.add(o); log.push(o); }`.
5. Rewrite the `Token` example using a private field and the `#field in obj` check.

## Quick revision {#quick-revision}

- WeakSet: a set of objects held weakly; membership does not keep an object alive.
- API: `add` (chainable), `has`, `delete`. Nothing else.
- No `size`, `clear`, `forEach`, `keys`/`values` or iteration — these would expose garbage-collection timing or resurrect members.
- Members must be objects (or, since ES2023, non-registered symbols); adding a primitive throws a `TypeError`, while `has`/`delete` with a primitive return `false`.
- Membership is by identity, not by contents.
- Equivalent to a WeakMap whose values are all `true`; use a WeakMap when you need data per object.
- Uses: visited marks in graph walks, process-once guards, branding genuine instances.
- A local visited set that dies with the function call can be a plain Set; WeakSet matters when the set outlives the objects.
- Strings, counting or looping → use a Set and clean up explicitly.

## Key takeaways {#key-takeaways}

- A WeakSet tags objects without modifying them and without extending their lifetime.
- It answers one question — "is this object I am holding a member?" — and deliberately nothing else.
- Only objects can be members, compared by identity.
- A long-lived Set of short-lived objects is a leak; a WeakSet in the same place is not.
- If you need to count, list or clear members, or store primitives, use a Set; if you need a value per object, use a WeakMap.
- Removal happens when the garbage collector runs, at a time your code cannot observe or rely on.
