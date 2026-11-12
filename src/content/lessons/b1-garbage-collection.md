---
summary: Garbage collection is how a JavaScript engine finds unreachable objects and reuses their memory without stopping your page for long. You will learn why engines trace from roots instead of counting references, how mark-and-sweep and generational collection work, and what that means for the code you write.
difficulty: intermediate
minutes: 45
objectives:
  - Explain what a tracing garbage collector does and why reference counting alone is not enough
  - Trace mark-and-sweep on an object graph, including cycles
  - Describe the generational hypothesis and how V8's young and old generations exploit it
  - Explain how incremental and concurrent collection reduce main-thread pauses and why they need write barriers
  - Read basic garbage-collection traces and choose code changes that reduce collection cost
---

## Introduction

[[b1-memory-management]] established the rule: an object may be reclaimed once no chain of references leads to it from a root. A rule is not a mechanism, though. Somebody has to discover which objects are unreachable, and do it while a page is animating at 60 frames per second or a server is answering thousands of requests. That somebody is the **garbage collector (GC)**, a component of the JavaScript engine that periodically finds unreachable objects and makes their memory available for new allocations.

How the collector works matters to you for two practical reasons. First, collection is not free: it uses CPU time and some of that time is spent on the main thread, where it competes with your code, rendering and input handling. Code that allocates heavily causes more collection work. Second, understanding the mechanism removes several myths — that cycles leak, that `null` frees memory immediately, that JavaScript never pauses — which otherwise lead to wrong fixes for real problems.

All major engines (V8 in Chrome, Edge and Node; SpiderMonkey in Firefox; JavaScriptCore in Safari) use **tracing** collectors that start from roots, and all of them are generational and do much of their work incrementally or on background threads. The details differ; this lesson uses V8 as the concrete example and says so where something is V8-specific.

## Before you start

- **Reachability and roots** — what makes an object live. See [[b1-reachability]] in the memory-management lesson.
- **The heap** — where objects are allocated. See [[b1-heap]].
- **The JavaScript engine** — the parser, interpreter and compiler that run your code. See [[b1-js-engine]].

## The intuition

Imagine cleaning out a warehouse full of boxes connected by string. One approach is to keep a counter on every box showing how many strings are tied to it, and throw a box away when its counter hits zero. Another approach is to start from the front door, follow every string, put a sticker on every box you reach, and at the end throw away every box without a sticker.

The first approach is **reference counting**; the second is **tracing**, specifically **mark-and-sweep**. The counting approach sounds cheaper, because you never walk the whole warehouse. But two boxes tied only to each other will each show a count of one forever, even if no string leads to them from the door. The sticker approach handles that case naturally, because it asks the question that actually matters: can I get there from the door?

Now notice something about this warehouse: most boxes arrive and are thrown out within minutes, while a few stay for years. It would be wasteful to walk the whole building every time the loading dock fills up. A smarter crew checks the loading dock often and the long-term storage rarely. That observation is the basis of **generational** collection.

## Why not count references?

Reference counting keeps, for each object, the number of references pointing to it, and frees the object when the count drops to zero. It releases memory promptly and is used by some systems (CPython uses it as its primary mechanism, Swift uses automatic reference counting). Its weakness is cycles. Here is a small simulation that counts references for a closed modal and its form, which point at each other.

```javascript title="refcount-cycle.mjs"
// Toy reference counting: free an object when its count reaches zero.
const counts = new Map([['oldModal', 0], ['oldForm', 0]]);
const refs = new Map([['oldModal', ['oldForm']], ['oldForm', ['oldModal']]]);

function addRef(name) { counts.set(name, counts.get(name) + 1); }
function release(name) {
  counts.set(name, counts.get(name) - 1);
  if (counts.get(name) === 0) {
    console.log('freed', name);
    for (const child of refs.get(name)) release(child);
  }
}

addRef('oldModal');            // the page holds the modal
addRef('oldForm');             // modal -> form
addRef('oldModal');            // form -> modal (the cycle)
release('oldModal');           // the page lets go of the modal
console.log(Object.fromEntries(counts));   // neither reached zero
```

```output
{ oldModal: 1, oldForm: 1 }
```

Nothing is ever printed as freed. After the page lets go, each object is held only by the other, so both counts stay at one and pure reference counting keeps them forever. Cyclic structures are everywhere in JavaScript — parent and child DOM nodes, doubly linked lists, objects that store a back-pointer to their owner, closures stored on the object they capture — so a JavaScript engine that only counted references would leak constantly. (CPython adds a separate cycle detector for exactly this reason.) Early Internet Explorer versions had a version of this problem: the DOM was reference-counted while JavaScript was traced, and cycles crossing the boundary leaked. Modern engines trace everything.

## Mark-and-sweep and generational collection {#b1-mark-and-sweep}

**Mark-and-sweep** is the basic tracing algorithm: starting from the roots, *mark* every object you can reach by following references, then *sweep* through the heap and reclaim every object that was not marked. **Generational collection** is a refinement that splits the heap by object age and collects the young part far more often than the old part, because most objects die young. Together they are the foundation of every major JavaScript collector.

### The mark phase

Marking is a graph traversal. The collector keeps a worklist of objects it has discovered but not yet scanned. It starts with the roots, and repeatedly takes an object from the worklist, marks it, and adds every object it references. An object that is already marked is skipped, which is what makes cycles terminate.

Collector literature describes this with three colours, the **tri-colour abstraction**:

- **White** — not yet discovered. At the end of marking, white objects are garbage.
- **Grey** — discovered (reachable) but its outgoing references have not been scanned yet. These are the worklist.
- **Black** — discovered and fully scanned.

Marking starts with roots grey and everything else white, and finishes when no grey objects remain.

### The sweep phase

Sweeping visits the heap and treats every white object's memory as free, typically by adding it to free lists that the allocator uses for future objects. Sweeping does not need to follow references, so it is simple and can run lazily or on another thread.

### A runnable model

The following program simulates both phases on a small object graph. Object names stand in for objects, and each entry lists the objects it references.

```javascript title="mark-and-sweep.mjs"
// A toy heap: each object has a name and a list of outgoing references.
const heap = new Map([
  ['window',   ['app']],
  ['app',      ['store', 'router']],
  ['store',    ['users']],
  ['router',   []],
  ['users',    []],
  ['oldModal', ['oldForm']],     // closed modal: nothing points to it now
  ['oldForm',  ['oldModal']],    // ...but it forms a cycle with its form
  ['tmp',      []],              // a temporary that went out of scope
]);
const roots = ['window'];

function markAndSweep(heap, roots) {
  const marked = new Set();
  const worklist = [...roots];          // grey objects: found, not yet scanned
  while (worklist.length > 0) {
    const name = worklist.pop();
    if (marked.has(name)) continue;     // already black: cycles stop here
    marked.add(name);
    for (const child of heap.get(name)) worklist.push(child);
  }
  const swept = [];
  for (const name of heap.keys()) {
    if (!marked.has(name)) {
      heap.delete(name);
      swept.push(name);
    }
  }
  return { marked: [...marked], swept };
}

console.log(markAndSweep(heap, roots));
console.log('left in heap:', [...heap.keys()].join(', '));
```

```output
{
  marked: [ 'window', 'app', 'router', 'store', 'users' ],
  swept: [ 'oldModal', 'oldForm', 'tmp' ]
}
left in heap: window, app, store, router, users
```

Trace the run. The worklist starts as `[window]`. Popping `window` marks it and pushes `app`; popping `app` marks it and pushes `store` and `router`. Because the worklist is a stack, `router` is popped next (it has no children), then `store`, which pushes `users`, which is then marked. The worklist is empty, so marking ends. The sweep finds three unmarked objects. The cycle between `oldModal` and `oldForm` was never visited, because no path from `window` reaches it, so it is swept — exactly the case reference counting could not handle.

Two properties follow directly from this algorithm. Marking cost is proportional to the number of **live** objects and references, because the collector never visits garbage while marking. And the collector never frees anything that is reachable, so a "leak" in a JavaScript program is never the sweep forgetting something; it is always a path from a root that the programmer did not intend.

### Compaction

After many sweeps, free memory is scattered in small gaps between surviving objects. This **fragmentation** can make it impossible to place a large object even when plenty of memory is free in total. A **compacting** collector moves surviving objects together and updates every reference to them, leaving one contiguous free region. Moving objects is expensive, so V8's old-generation collector, called **Mark-Compact**, compacts only the most fragmented pages and sweeps the rest.

### The generational hypothesis

Watch what typical JavaScript allocates: the objects returned by `map` and `filter`, strings built while formatting a message, the event object passed to a handler, intermediate results in a loop. Almost all of them are garbage within microseconds or milliseconds. A smaller set — the application state, cached data, the component tree — lives for the whole session. This pattern is called the **generational hypothesis**: most objects die young.

A generational collector exploits it by dividing the heap:

- The **young generation** (V8 calls it the *new space*, other engines the *nursery*) is small. All new objects are allocated here, and it is collected often.
- The **old generation** is large. Objects that survive a few young collections are **promoted** (moved) into it, and it is collected rarely.

If most young objects are dead by the time the young generation fills up, collecting it means dealing with very few survivors, which is cheap.

### Young-generation collection: scavenging

V8 collects the young generation with a **scavenger**, a copying algorithm based on Cheney's algorithm. The young generation is split into two halves called semi-spaces. Allocation happens in one half by bumping a pointer, which is about as cheap as allocation can be. When that half is full, the scavenger traces from the roots, copies every live young object into the other half (or promotes it to the old generation if it has already survived an earlier scavenge — in V8 an object is promoted after surviving two), updates the references to the moved objects, and then treats the entire old half as empty. Dead objects are never visited at all; the cost depends only on the survivors.

There is one complication. The roots for a young collection must include references *from old objects into the young generation*, otherwise a young object referenced only by a long-lived cache would be wrongly collected. Scanning the whole old generation each time would defeat the purpose. Instead, the engine runs a small piece of code called a **write barrier** on every pointer write: when an old object is made to point at a young one, the barrier records that slot in a **remembered set**, and the scavenger treats the recorded slots as extra roots.

### Watching it happen

Node can print a line for every collection with `--trace-gc`. This program allocates five million short-lived objects and keeps one in ten.

```javascript title="churn.mjs"
// Run with: node --trace-gc churn.mjs
// Lots of short-lived objects plus a slowly growing long-lived list.
const survivors = [];
for (let i = 0; i < 5_000_000; i++) {
  const temp = { i, label: `item-${i}` };       // dies almost immediately
  if (i % 10 === 0) survivors.push(temp);       // 10% live on
}
console.log('survivors:', survivors.length);
```

```output
[39862:0x781280c000]       12 ms: Scavenge 4.3 (4.9) -> 3.6 (5.9) MB, pooled: 0 MB, 0.46 / 0.00 ms  (average mu = 1.000, current mu = 1.000) allocation failure;
[39862:0x781280c000]       13 ms: Scavenge 4.3 (5.9) -> 3.8 (6.4) MB, pooled: 0 MB, 0.38 / 0.00 ms  (average mu = 1.000, current mu = 1.000) allocation failure;
... 19 more Scavenge lines ...
[39862:0x781280c000]       52 ms: Mark-Compact 15.1 (45.7) -> 12.2 (45.5) MB, pooled: 0 MB, 4.54 / 0.00 ms  (+ 0.1 ms in 0 steps since start of marking, ...) finalize incremental marking via stack guard; GC in old space requested
... 25 more Scavenge lines ...
survivors: 500000
[39862:0x781280c000]      160 ms: Mark-Compact 54.4 (82.5) -> 3.8 (36.9) MB, pooled: 34 MB, 0.96 / 0.00 ms  (+ 0.0 ms in 0 steps since start of marking, ...) finalize incremental marking via task; GC in old space requested
```

This is an abridged run on Node 22; the exact line format changes between V8 versions, and the process ids, timings and line counts differ per run. Each `Scavenge` line shows heap use before and after the collection and the pause it caused — a fraction of a millisecond. There were 46 scavenges but only one `Mark-Compact` while the loop ran, and it took several times longer than a scavenge because it had to mark everything still alive in the old generation. The last line is a second major collection that ran after the script's synchronous work finished; the top-level code had finished and nothing used `survivors` any more, so the heap shrank to under 4 MB. That ratio is the generational hypothesis paying off: frequent, tiny young collections, rare larger old ones. The phrase `allocation failure` is not an error; it means the young generation was full, which is the normal trigger for a scavenge.

### Reducing pauses: incremental, concurrent and parallel collection

A simple collector stops the program (a **stop-the-world** pause) for the entire collection. With a heap of hundreds of megabytes, marking can take long enough to drop frames or delay input. V8's collector, developed under the project name **Orinoco**, uses three techniques to shrink the time spent on the main thread:

- **Parallel** collection uses several helper threads during a pause, so the pause is shorter. The scavenger works this way.
- **Incremental** marking splits marking into small steps interleaved with JavaScript execution.
- **Concurrent** marking and sweeping run on background threads *while* JavaScript keeps running on the main thread.

Incremental and concurrent marking create a new problem: the program (the *mutator*, in collector terms) keeps changing references while marking is in progress. Suppose marking has finished scanning object A (black) and the program then stores a reference to a still-white object C into A, while removing the only other reference to C from a grey object. The collector will never scan A again and will never see C through the old path, so C would be swept while still in use. The write barrier prevents this: during marking, writing a reference into an object also marks the target grey, so it cannot be missed. The final step of marking still happens in a short pause to process anything that changed at the last moment.

These techniques reduce pauses; they do not eliminate them. Under heavy allocation or a very large old generation you can still see collection in a performance profile as `Minor GC` and `Major GC` entries on the main thread. [[b1-long-tasks]] explains why anything on the main thread longer than about 50 ms is a problem for responsiveness.

| Collection | Region | Algorithm (V8) | Frequency | Typical cost |
|---|---|---|---|---|
| Minor GC (Scavenge) | Young generation | Parallel copying | Very often | Proportional to survivors; usually sub-millisecond to a few ms |
| Major GC (Mark-Compact) | Whole heap | Concurrent/incremental mark, concurrent sweep, selective compaction | Rarely | Proportional to live objects; main-thread portion kept short |

## How collection timing affects your code

The engine decides when to collect, usually because a region filled up or because the heap grew past a limit it computed after the last major collection. Browsers may also collect during idle time between frames. The consequences are worth spelling out.

**Release is non-deterministic.** You cannot know when an unreachable object will be reclaimed. This is why `WeakRef.deref()` may keep returning an object after you dropped your references, and why `FinalizationRegistry` callbacks run at an unspecified later time, if ever:

```javascript title="finalization.mjs"
// Run with: node --expose-gc finalization.mjs
const registry = new FinalizationRegistry((label) => {
  console.log('cleanup callback for', label);
});

let session = { id: 42 };
registry.register(session, 'session 42');

session = null;
console.log('reference dropped');
await new Promise((resolve) => setTimeout(resolve, 0));
globalThis.gc();
console.log('gc() returned');
await new Promise((resolve) => setTimeout(resolve, 0));
console.log('next macrotask');
```

```output
reference dropped
gc() returned
cleanup callback for session 42
next macrotask
```

Even with a forced collection, the callback did not run inside `gc()`; it was queued as a separate task and ran later. Without `--expose-gc` and the forced collection, a short script like this typically exits without the callback ever running, because no collection happened. Resources that must be released — file handles, sockets, locks — need explicit cleanup (`close()`, `try`/`finally`, or `using` declarations where your runtime supports explicit resource management).

**Allocation rate drives collection cost.** Every allocation brings the next scavenge closer. In hot paths that run every frame — animation loops, scroll handlers, canvas drawing — creating many temporary objects or arrays per call shows up as frequent minor collections. Reusing objects or using typed arrays can help there. In ordinary code, short-lived allocation is exactly what the young generation is optimised for, so clear code should win over premature pooling.

**Heap size drives major collection cost.** Marking visits every live object. A service that keeps millions of objects in memory pays for that on every major collection, even if nothing leaks.

**There is a ceiling.** In Node, V8 limits the old generation based on available system memory. `--max-old-space-size=<MB>` changes it. When live data cannot fit after a full collection, the process aborts with a heap out-of-memory error; a GC cannot reclaim reachable objects, however hard it tries.

## In real systems

Front-end performance profiles in Chrome DevTools show collection as `Minor GC` and `Major GC` blocks in the main-thread track. A sawtooth heap graph — memory climbs as you allocate, drops sharply at each collection — is healthy. A sawtooth whose lowest points keep rising is the classic sign of a leak, investigated with the tools in [[b1-memory-leaks]].

On servers, teams watch heap-used and GC-pause metrics from `process.memoryUsage()`, `v8.getHeapStatistics()` and the `perf_hooks` GC performance entries. A sudden increase in major-GC time usually means the live heap has grown, often through an unbounded cache. Container memory limits must leave headroom above the V8 heap limit, because the process also uses memory outside the JavaScript heap (buffers, native modules, the engine itself).

Game and animation code is the main place where developers design around the collector deliberately, preallocating objects and reusing them so that steady-state frames allocate almost nothing.

## Trade-offs and alternatives

| Technique | Strength | Weakness |
|---|---|---|
| Reference counting | Frees memory promptly; work spread evenly | Cannot reclaim cycles alone; counter updates on every reference change |
| Mark-and-sweep | Handles cycles; cost tied to live data | Fragmentation; pauses unless made incremental |
| Copying (scavenge) | Very fast for mostly-dead regions; compacts for free | Needs spare space to copy into; costly if most objects survive |
| Mark-compact | No fragmentation | Moving objects and fixing references is expensive |
| Generational | Matches how JavaScript programs allocate | Needs write barriers and remembered sets |

Engines combine these rather than choosing one. Outside the engine, the alternatives are about *reducing work* for the collector: object pools for hot loops, typed arrays for large numeric data, moving bulk processing into a Worker with its own heap, or using WebAssembly with manually managed linear memory for specialised workloads.

## Common mistakes

**"JavaScript uses reference counting."** Modern engines use tracing collectors. Answering an interview question with reference counting, and then claiming cycles leak, is a common way to lose points.

**"Circular references cause memory leaks."** Cycles that are unreachable from roots are collected. Leaks come from unintended paths from roots.

**"JavaScript has no GC pauses."** It has short ones. Most marking and sweeping is concurrent, but parts of every collection run on the main thread, and heavy allocation makes them more frequent.

**Calling `gc()` in production code.** It is available only with a diagnostic flag, it triggers a full, expensive collection, and the engine's own heuristics are almost always better.

**Relying on finalizers for cleanup.** `FinalizationRegistry` callbacks may run late or never. Use explicit cleanup for anything that matters.

## Interview perspective

**"How does garbage collection work in JavaScript?"** Start with reachability from roots, then describe mark-and-sweep: mark everything reachable, sweep the rest. Add generations (young space collected often by a copying scavenger, survivors promoted to an old space collected by mark-compact), and finish with how V8 keeps pauses short using parallel, incremental and concurrent work. That progression shows you understand both the principle and the engineering.

**"Why generational?"** Because most objects die young, collecting a small young region often is cheap — copying cost depends only on survivors — and avoids repeatedly marking long-lived data.

**"What is a write barrier?"** Code the engine runs on reference writes. It records old-to-young pointers so a young collection does not have to scan the old generation, and during concurrent marking it ensures objects made reachable mid-mark are not missed.

**"Can you force or prevent garbage collection?"** Not from standard JavaScript. Node and Chrome expose `gc()` behind flags for diagnostics only. You influence collection by allocating less and holding fewer references.

## Practice

1. Change the toy collector so that `window` also references `oldModal`. Predict the marked and swept lists before running it.
2. Extend the toy collector with a `young` set of names and implement a "minor collection" that only sweeps young objects, using an explicit remembered set for old-to-young references. Show what goes wrong if you forget the remembered set.
3. Run `churn.mjs` with `--trace-gc` while keeping 50% of objects instead of 10%. Compare the number and duration of scavenges and mark-compacts, and explain the change.
4. Explain in your own words why the scavenger's cost does not depend on how many objects died.

## Quick revision {#quick-revision}

- GC = engine component that reclaims unreachable heap objects. All major JS engines use tracing collectors.
- Reference counting frees at count zero but cannot reclaim cycles alone.
- Mark-and-sweep: mark from roots (white → grey → black), sweep unmarked. Cost of marking ∝ live objects.
- Compaction moves survivors together to fix fragmentation; V8's Mark-Compact compacts selectively.
- Generational hypothesis: most objects die young. Young generation collected often, old rarely.
- V8 young GC: Scavenge, a parallel semi-space copying collector; survivors of two scavenges are promoted.
- Write barriers maintain remembered sets (old → young pointers) and keep concurrent marking correct.
- Orinoco: parallel, incremental and concurrent techniques reduce, not eliminate, main-thread pauses.
- Collection timing is non-deterministic; `WeakRef`/`FinalizationRegistry` expose it, so never rely on them for correctness.
- Node: `--trace-gc` to observe, `--max-old-space-size` to change the old-generation limit.

## Key takeaways {#key-takeaways}

- A tracing collector asks one question — can this object be reached from a root? — which is why cycles are not leaks.
- Mark-and-sweep never frees reachable data, so a JavaScript leak is always a reference you kept, not a collector failure.
- Generational collection makes short-lived allocation cheap, but allocation rate still drives how often collections run.
- Modern engines hide most collection work on background threads; the remaining main-thread pauses are short but real.
- You cannot control when memory is reclaimed, only what remains reachable and how much you allocate.

```quiz
Q: Why can pure reference counting not reclaim two objects that reference only each other?
- [ ] Because the objects are on different generations
- [x] Because each object's count stays at one, so neither ever reaches zero
- [ ] Because reference counting only works for primitives
- [ ] Because cycles are reachable from the global object
> Each object holds a reference to the other, so both counts stay at one after the outside reference is dropped. A tracing collector instead starts from the roots and never reaches the cycle, so it reclaims both. The cycle is, by assumption, not reachable from any root.
```

```quiz
Q: Why is collecting V8's young generation usually cheap?
- [ ] The young generation is collected on a background thread only
- [ ] Young objects are smaller than old objects
- [x] The scavenger only copies surviving objects, and most young objects are already dead
- [ ] Young objects are never referenced from old objects
> A copying collector visits and moves only live objects, then treats the whole source space as free. Since most young objects die quickly, there is little to copy. Old objects can and do reference young ones, which is why write barriers and remembered sets exist.
```

```quiz
Q: During concurrent marking, what problem does the write barrier solve?
- [ ] It stops JavaScript from running until marking finishes
- [x] It ensures an object the program makes reachable from an already-scanned object is not missed and swept
- [ ] It counts references so cycles can be detected
- [ ] It moves objects to reduce fragmentation
> Concurrent marking runs while the program changes references. If a reference to an unscanned object is stored into an already-scanned (black) object, the marker would never see it. The barrier marks the target so it survives. It does not pause the program, count references, or compact memory.
```
