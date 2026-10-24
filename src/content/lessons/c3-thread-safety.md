---
summary: Code is thread-safe when it keeps behaving correctly no matter how the scheduler interleaves the threads that use it. You will learn why shared mutable state is the root of every thread-safety bug, how to recognise it, and the three ways to remove the danger — do not share, do not mutate, or coordinate access.
difficulty: intermediate
minutes: 50
objectives:
  - Define thread safety in terms of a class's specification and invariants
  - Identify shared mutable state in real code, including Spring singletons and static fields
  - Explain how lost updates, stale reads and broken invariants arise from unsynchronised access
  - Apply stack confinement, thread confinement and immutability to avoid synchronisation
  - Choose between confinement, immutability and locking for a given piece of state
---

## Introduction

A counter class works perfectly in every unit test. It goes into a web service, where it counts page views, and the numbers in production are always a little low — a few hundred views missing out of every million, more on busy days, never in a way anyone can reproduce on a laptop. Nothing throws an exception. Nothing appears in the logs. The class is simply not **thread-safe**: it was written for one thread, and it is being used by many.

That is what thread-safety bugs are like. They depend on *timing* — on exactly which instruction each thread happens to be executing when the scheduler switches between them — so they appear rarely, under load, and disappear when you add a print statement or attach a debugger. You cannot test your way out of them reliably. You have to be able to look at code and reason about whether it is safe.

This lesson gives you that reasoning. It defines what thread safety actually means, shows exactly how unsafe code goes wrong, and teaches the first two (and cheapest) tools for making code safe: keeping state confined to one thread, and making it immutable. Locks, atomic variables and concurrent collections — the tools for state that genuinely must be shared and changed — build on this foundation in later modules.

## Before you start

- **Processes vs threads** — threads in one JVM share the heap; each has its own stack. See [[c3-processes-vs-threads]].
- **Starting and joining threads** — the examples call `start()` and `join()`. See [[c3-thread-lifecycle]].
- **Immutability in Java** — `final` fields and defensive copies. See [[c1-immutability]] and [[c1-defensive-copies]].
- **Records** — used for immutable value types. See [[c1-records]].

## The intuition

Imagine a shared whiteboard showing a number, and two people asked to add one to it whenever a customer arrives. Each person reads the number, works out the next one in their head, rubs the old number out and writes the new one. If two customers arrive at once, both people read `41`, both compute `42`, and both write `42`. Two customers arrived; the board went up by one. Nobody made an arithmetic mistake — each person's steps were individually correct. The problem is that "read, compute, write" is three steps, and the other person's steps slipped in between.

There are three ways to stop this from happening, and they are the whole of this lesson in miniature. You can give each person **their own whiteboard** and add the totals at the end of the day — don't share. You can stop rubbing out numbers and instead **write each new total on a fresh card** that nobody ever changes — don't mutate, which turns the problem into making sure everyone looks at the latest card. Or you can put **a single marker pen** next to the board and agree that only the person holding it may update the number — coordinate. Each option has a cost; choosing well is the skill.

## What "thread-safe" means

A useful definition, from Brian Goetz's *Java Concurrency in Practice*: a class is **thread-safe** if it behaves correctly when accessed from multiple threads, regardless of how the runtime schedules or interleaves those threads, and with no additional synchronisation or coordination required from the calling code.

Three parts of that definition matter.

**"Behaves correctly"** means it meets its specification: its **invariants** (facts that must always be true about its state, such as "lower ≤ upper" or "size equals the number of elements") hold, and each method does what it promises. Thread safety is therefore relative to what the class claims to do. A class with no specification cannot be called thread-safe or unsafe — there is nothing to measure against.

**"Regardless of scheduling"** means correctness cannot depend on luck. If there exists *any* interleaving of the threads' instructions that produces a wrong result, the class is not thread-safe — even if that interleaving happens once in a billion calls.

**"No additional synchronisation from callers"** means the safety is encapsulated. If callers must remember to lock something before calling, the class is at best *conditionally* thread-safe, and that requirement must be documented.

Joshua Bloch's *Effective Java* gives a vocabulary for documenting where a class sits:

| Level | Meaning | Examples |
|---|---|---|
| Immutable | State never changes after construction; no coordination ever needed | `String`, `Integer`, `LocalDate`, `List.of(...)` |
| Unconditionally thread-safe | Mutable, but every method is safe to call concurrently | `AtomicLong`, `ConcurrentHashMap` |
| Conditionally thread-safe | Individual calls are safe, but some sequences need external locking | `Collections.synchronizedList` (iteration must be done inside `synchronized (list)`) |
| Not thread-safe | Callers must provide all coordination, or confine it to one thread | `ArrayList`, `HashMap`, `StringBuilder`, `SimpleDateFormat` |
| Thread-hostile | Unsafe even with external locking, usually because it mutates static state without protection | Rare; a bug to be fixed |

Most classes you write are "not thread-safe", and that is fine — provided they are only ever used by one thread at a time. The danger is never the class on its own; it is a non-thread-safe object *reached by more than one thread*.

## Shared Mutable State {#c3-shared-mutable-state}

**Shared mutable state** is data that is both reachable by more than one thread (*shared*) and can change after it is created (*mutable*). Every thread-safety problem in Java needs both ingredients. Data that only one thread can reach is safe however it is changed. Data that never changes is safe however many threads read it. Only when the two combine — and at least one thread writes — do you need coordination.

That observation gives you a checklist for any field or object: *Who can reach it? Can it change?* If the answers are "more than one thread" and "yes", you must make every access to it coordinated, or redesign so one of the answers becomes "no".

### Where shared state hides

State becomes shared whenever a reference to it can reach a second thread. The common routes are:

- **Static fields.** A `static` field is reachable from every thread in the JVM. A `static SimpleDateFormat` or `static HashMap` cache is shared by definition.
- **Fields of singletons.** In Spring, beans are singletons by default: one `@Service` instance handles every request, and every request runs on its own thread. Any mutable instance field in a controller, service or repository is shared by all concurrent requests.
- **Objects passed to another thread.** Anything captured by a lambda given to `new Thread(...)`, an `ExecutorService` or a `CompletableFuture`, or put into a queue, is now reachable from the thread that runs it.
- **Escaping references.** Returning an internal mutable collection from a getter, or registering `this` as a listener inside a constructor, lets other threads reach state you thought was private.

Here is the Spring version, which is one of the most common production bugs of this kind:

```java title="ReportService.java"
@Service
public class ReportService {
    // One instance of this bean serves every request thread at once.
    private final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
    private int reportsGenerated;                // also shared and mutable

    public String header(Date date) {
        reportsGenerated++;                      // lost updates under load
        return "Report for " + format.format(date);  // SimpleDateFormat is not thread-safe
    }
}
```

`SimpleDateFormat` keeps intermediate results in internal fields while it formats, so two threads using one instance can produce garbled or wrong dates. The fix is not to add locks but to remove the shared mutable state: use `java.time.format.DateTimeFormatter`, which is immutable and safe to share, and count with an `AtomicInteger` or a metrics library.

### What goes wrong: three failure modes

Unsynchronised access to shared mutable state goes wrong in three distinct ways. Knowing which one you are looking at tells you which fix is needed.

**1. Lost updates from non-atomic compound actions.** `count++` looks like one operation but is three: read `count`, add one, write `count`. Two threads can both read the same value and both write the same result, losing one increment. This is a **read-modify-write** race. Its cousin is **check-then-act**: `if (!map.containsKey(k)) map.put(k, v)` — between the check and the act, another thread can put its own value. Both are taught in detail in [[c3-check-then-act]].

```java title="LostUpdates.java"
public class LostUpdates {
    static int count = 0;                        // shared and mutable

    public static void main(String[] args) throws InterruptedException {
        Runnable work = () -> {
            for (int i = 0; i < 100_000; i++) {
                count++;                         // read, add, write: three steps
            }
        };
        Thread a = new Thread(work);
        Thread b = new Thread(work);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("expected 200000, got " + count);
    }
}
```

```output
expected 200000, got 131877
```

The number you get will differ from run to run, and occasionally it will be exactly 200,000 — which is precisely why such bugs survive testing. Here is one interleaving that loses an update:

| Time | Thread A | Thread B | `count` in memory |
|---|---|---|---|
| 1 | reads `count` → 41 | | 41 |
| 2 | | reads `count` → 41 | 41 |
| 3 | computes 42 | | 41 |
| 4 | | computes 42 | 41 |
| 5 | writes 42 | | 42 |
| 6 | | writes 42 | 42 |

Two increments ran; the counter went up by one.

**2. Stale reads from missing visibility.** Without synchronisation, Java does not promise that a value written by one thread is ever seen by another. Each core has caches, and both the Just-In-Time (JIT) compiler and the CPU are allowed to reorder and cache memory accesses as long as a *single* thread cannot tell the difference. The classic symptom is a loop that never stops:

```java title="StopFlag.java"
public class StopFlag {
    static boolean stopRequested = false;        // not volatile: no visibility guarantee

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            long spins = 0;
            while (!stopRequested) {             // JIT may read the field once and reuse it
                spins++;
            }
            System.out.println("stopped after " + spins + " spins");
        });
        worker.start();
        Thread.sleep(1_000);
        stopRequested = true;                    // this write may never be seen by worker
        System.out.println("stop requested");
    }
}
```

On a HotSpot JVM this program commonly prints `stop requested` and then hangs forever: the JIT compiler sees that the loop body never writes `stopRequested`, so it is entitled to read the field once and turn the loop into `while (true)`. Declaring the field `volatile` fixes it, because a `volatile` write is guaranteed to be visible to subsequent `volatile` reads. Visibility is a separate problem from atomicity — `volatile` fixes this program but would *not* fix `LostUpdates`. The rules are the [[c3-jmm|Java Memory Model]]; the tool is [[c3-volatile]].

**3. Broken invariants across several variables.** Sometimes each individual variable is safe on its own, but a rule *connecting* them is not:

```java title="NumberRange.java"
import java.util.concurrent.atomic.AtomicInteger;

public class NumberRange {
    // Invariant: lower <= upper. Each field is atomic; the pair is not.
    private final AtomicInteger lower = new AtomicInteger(0);
    private final AtomicInteger upper = new AtomicInteger(10);

    public void setLower(int value) {
        if (value > upper.get()) throw new IllegalArgumentException("lower > upper");
        lower.set(value);
    }

    public void setUpper(int value) {
        if (value < lower.get()) throw new IllegalArgumentException("upper < lower");
        upper.set(value);
    }
}
```

Starting from `(0, 10)`, thread A calls `setLower(5)` and thread B calls `setUpper(4)` at the same moment. A checks `5 > 10` — false, fine. B checks `4 < 0` — false, fine. A sets lower to 5; B sets upper to 4. The range is now `(5, 4)`, which the class promised could never happen. Using thread-safe building blocks did not make the class thread-safe, because the invariant spans both fields and the check-then-set on each is not atomic with respect to the other. Either both fields must be updated under one lock, or — as you will see shortly — both must live in a single immutable object replaced in one atomic step.

### The three ways out

Every fix for shared mutable state removes one of its ingredients or coordinates the access:

| Strategy | Removes | How | Cost |
|---|---|---|---|
| Confinement | "Shared" | Only one thread ever reaches the object | Design discipline; data must be handed over or merged |
| Immutability | "Mutable" | The object cannot change after construction | A new object per change; allocation |
| Synchronisation | Neither — coordinates access | Locks, `volatile`, atomics, concurrent collections | Contention, deadlock risk, complexity |

The first two are preferable when they fit, because they make the problem disappear instead of managing it. They are the subject of the next section.

> [!IMPORTANT] Every access, the same lock
> If you do choose locking, *every* read and write of a piece of shared mutable state must be guarded by the *same* lock. Synchronising only the writes is not enough: an unsynchronised reader can see stale or half-updated values. Which lock guards which state is part of the class's design and should be written down.

## Thread Confinement & Immutability {#c3-thread-confinement}

**Thread confinement** means arranging for an object to be reachable by only one thread, so it needs no synchronisation at all even though it is mutable. **Immutability** means making an object impossible to change after construction, so any number of threads can read it without coordination. Both remove the danger of shared mutable state by removing one of its ingredients, which makes them simpler and usually faster than locking.

### Stack confinement

The strongest and most common form of confinement is **stack confinement**: the object is reachable only through local variables. Each thread has its own stack, and local variables live in stack frames, so primitive locals are always confined. A local *reference* is confined as long as the object it points to never **escapes** — is never stored in a field, returned, or passed to code that keeps it.

```java title="Stats.java"
import java.util.ArrayList;
import java.util.List;

public class Stats {
    // Safe to call from any number of threads at once: every mutable object is local.
    public static double median(List<Integer> input) {
        List<Integer> sorted = new ArrayList<>(input);   // private copy, never escapes
        sorted.sort(null);
        int n = sorted.size();
        return n % 2 == 1
                ? sorted.get(n / 2)
                : (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;
    }

    public static void main(String[] args) {
        System.out.println(median(List.of(7, 1, 5, 3)));
        System.out.println(median(List.of(9, 2, 6)));
    }
}
```

```output
4.0
6.0
```

`ArrayList` is not thread-safe, yet `median` is, because each call creates its own `ArrayList` and nothing else can reach it. This is why **stateless** classes — no fields, only locals — are always thread-safe, and why Spring services that keep all per-request data in local variables and parameters are safe as singletons. The moment `sorted` were assigned to a field "for reuse", the method would become unsafe.

### Thread confinement beyond the stack

Sometimes an object needs to live longer than one method call but still belong to one thread.

**Single-threaded designs** confine a whole subsystem to one thread by rule. Swing and JavaFX require all user-interface objects to be touched only from the UI thread. Netty assigns each connection to one event-loop thread, so the handler's state for that connection needs no locks. An `Executors.newSingleThreadExecutor()` used as an actor — every update to some state is submitted as a task to that one thread — is the same idea in plain Java.

**`ThreadLocal`** gives each thread its own instance of a value, stored with the thread itself. It is how frameworks keep per-request data such as the current user, transaction or logging context without passing it through every method. It has sharp edges with thread pools, covered in [[c3-threadlocal]].

**Serial confinement**, also called *ownership transfer*, lets an object move between threads as long as only one owns it at a time. A producer thread fills an object, puts it on a `BlockingQueue`, and never touches it again; the consumer takes it and becomes the sole owner. The queue's internal locking both hands the object over safely and makes the producer's writes visible to the consumer. Confinement here is a convention the code must honour — if the producer keeps using the object after handing it off, the guarantee is gone. See [[c3-producer-consumer]].

### Immutability

An **immutable** object's state cannot change after its constructor finishes. Immutable objects are always thread-safe: there are no writes, so there are no lost updates, no stale values and no broken invariants once construction has established them.

To make a class properly immutable in Java:

- Make every field `final` (records do this for you).
- Provide no methods that change state; "modifying" methods return a new object instead.
- Do not let `this` escape during construction — do not register it as a listener or start a thread with it inside the constructor.
- If a field refers to a mutable object, such as a `List` or an array, take a **defensive copy** on the way in and never hand out the original.

The `final` keyword does more than prevent reassignment. The Java Memory Model gives `final` fields a special guarantee ([[c3-final-field-semantics]]): once a constructor finishes, any thread that obtains a reference to the object sees the correct values of its `final` fields — and of objects reachable through them as of construction — even if the reference was passed without any synchronisation. Non-final fields have no such guarantee; another thread could see their default values. That is why `String` is safe to pass around freely.

```java title="Order.java"
import java.util.List;

// Records are shallowly immutable: final fields, no setters.
public record Order(String id, List<String> items) {
    public Order {
        items = List.copyOf(items);   // defensive copy, and the copy itself is unmodifiable
    }

    public Order withItem(String item) {
        var next = new java.util.ArrayList<>(items);
        next.add(item);
        return new Order(id, next);   // "change" = a new object
    }
}
```

Without the `List.copyOf` in the compact constructor, the record would store whatever list the caller passed. The caller could keep modifying it, and so could any thread it shared that list with — the record's fields would be `final`, but the list behind them would not be. Records are only **shallowly** immutable; deep immutability is your job.

### Combining immutability with one atomic reference

Immutability solves the broken-invariant problem from `NumberRange`. Put the related values in one immutable object whose constructor checks the invariant, keep the current object in a single `AtomicReference`, and replace it atomically:

```java title="SafeRange.java"
import java.util.concurrent.atomic.AtomicReference;

public class SafeRange {
    record Range(int lower, int upper) {
        Range {
            if (lower > upper) throw new IllegalArgumentException(lower + " > " + upper);
        }
    }

    private final AtomicReference<Range> current = new AtomicReference<>(new Range(0, 10));

    public void setLower(int value) {
        // Builds a new Range from the latest one; retries if another thread got in first.
        current.updateAndGet(r -> new Range(value, r.upper()));
    }

    public void setUpper(int value) {
        current.updateAndGet(r -> new Range(r.lower(), value));
    }

    public Range get() {
        return current.get();
    }

    public static void main(String[] args) {
        SafeRange range = new SafeRange();
        range.setLower(5);
        System.out.println(range.get());
        try {
            range.setUpper(4);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
        System.out.println(range.get());
    }
}
```

```output
Range[lower=5, upper=10]
rejected: 5 > 4
Range[lower=5, upper=10]
```

`updateAndGet` reads the current `Range`, applies the function to build a new one, and installs it only if no other thread replaced the reference in the meantime; otherwise it re-reads and tries again. The check and the update now happen on one consistent snapshot, so the two-thread interleaving that broke `NumberRange` cannot produce `(5, 4)`: whichever update goes second sees the first one's result and fails validation. Because the function may run more than once, it must have no side effects other than building the new value. This compare-and-set technique is explained in [[c3-cas]]; the pattern of publishing immutable snapshots is [[c3-immutable-state]].

### Effectively immutable objects

An object that is technically mutable but that nobody modifies after publishing it is **effectively immutable** — for example a `HashMap` built at start-up and then only read. It can be read by many threads without locks, but only if it was **safely published**: the reference must reach other threads through a `volatile` field, a `final` field, a lock, a concurrent collection, or the start of the threads that read it. Otherwise another thread may see the reference before it sees the map's contents. When in doubt, wrap it with `Map.copyOf`, which gives a truly immutable map. See [[c3-safe-publication]].

## In real systems

**Spring beans.** Singleton beans must be stateless or hold only immutable or thread-safe fields: injected dependencies (`final`, set once in the constructor), configuration values, `DateTimeFormatter`, concurrent caches. Per-request data belongs in parameters, local variables, or request-scoped beans.

**Value objects everywhere.** `String`, `BigDecimal`, the `java.time` types, records and `List.of` / `Map.of` collections are immutable, which is why they can be cached, used as map keys and shared across threads freely. Configuration objects are best loaded once into an immutable record and published at start-up.

**Copy-on-write configuration.** Services that reload configuration or routing tables at run time typically build a new immutable snapshot and swap it in with one `volatile` or `AtomicReference` write. Readers never lock, and each request sees one consistent version.

**Event loops and actors.** Netty, Vert.x, and actor frameworks such as Akka confine each piece of mutable state to one thread or actor and communicate by messages, which removes locking from application code.

## Trade-offs and alternatives

Confinement is the cheapest option at run time — no locks, no extra allocation — but it is enforced only by design discipline; nothing in the language stops a reference from escaping. It also forces results to be combined at the end (per-thread counters summed after `join()`), or work to be handed over through queues.

Immutability makes reasoning simple and is safe by construction, but every change allocates a new object. For small value objects this is negligible on modern garbage collectors; for a large collection that changes constantly, copying it on every update is too expensive, and a concurrent collection is the better tool.

Synchronisation — locks, atomics, concurrent collections — is the general solution when state must be shared *and* changed frequently. Its costs are contention (threads waiting for each other), the risk of deadlock, and the burden of making sure every access uses the right lock. The usual order of preference is: avoid sharing; if you must share, share immutable data; if it must change, use a well-tested concurrent class; write your own locking last.

## Common mistakes

> [!MISTAKE] "I only read it, so it's safe"
> Reads are safe without coordination only if *no thread* ever writes the data after publishing it. One writer plus many unsynchronised readers is still a data race: readers may see stale values, or a half-built object.

**Assuming thread-safe parts make a thread-safe whole.** Two `AtomicInteger` fields, or a `ConcurrentHashMap` used with `get` followed by `put`, can still violate invariants. Use a single atomic operation (`merge`, `compute`, `updateAndGet`) or one lock around the whole compound action.

**Mutable fields in singleton beans.** Counters, caches in plain `HashMap`s, `SimpleDateFormat`, or "current request" fields in a `@Service` are shared by every request thread. Move per-request data into locals and use immutable or concurrent types for the rest.

**Shallow immutability.** A record or a class with `final` fields that holds a caller's `ArrayList` is not immutable. Copy mutable inputs with `List.copyOf` or similar, and never return internal arrays.

**Leaking `this` from a constructor.** Starting a thread or registering a listener in a constructor lets another thread see the object before its fields are set — even `final` fields lose their guarantee if `this` escapes during construction.

**Testing for thread safety by running it a few times.** A correct result on ten runs proves nothing. Reason about every interleaving, or use stress-testing tools such as JCStress ([[c3-concurrency-testing]]).

## Interview perspective

Interviewers ask "what does thread-safe mean?" to see whether you can go beyond "it uses `synchronized`". A strong answer defines it by correctness under any interleaving, names shared mutable state as the cause, and lists the strategies in order of preference.

> [!INTERVIEW] What a strong answer sounds like
> "A class is thread-safe if it stays correct — its invariants hold and its methods meet their contracts — however threads are interleaved, without callers adding their own locking. Problems need shared mutable state, so I first try to avoid sharing, by keeping data in locals or confined to one thread, then to avoid mutation with immutable objects. Only when state really must be shared and changed do I use a concurrent collection, atomics or a lock, guarding every access to the same state with the same lock."

Questions to be ready for:

- **Is a class with only `synchronized` methods always thread-safe?** No — callers combining two calls (check-then-act) can still race, and invariants spanning several objects may need a broader lock.
- **Why is `count++` not thread-safe even on a `volatile` field?** It is read-modify-write; `volatile` gives visibility, not atomicity. Use `AtomicInteger` or a lock.
- **Are Spring singleton beans thread-safe?** Only if their fields are immutable, thread-safe or absent. Spring does not add any synchronisation.
- **Why are immutable objects thread-safe?** No writes after construction, plus `final`-field guarantees that make correctly constructed objects visible without synchronisation.
- **What is stack confinement?** Objects reachable only through local variables, which live on one thread's stack; safe as long as the reference never escapes.
- **Follow-up: how would you make a mutable cache of configuration safe?** Build immutable snapshots and swap them in through a `volatile` or `AtomicReference` field.

## Practice

1. Fix `LostUpdates` three ways: with `synchronized`, with `AtomicInteger`, and by confinement (each thread counts into its own local variable and `main` adds the totals after `join()`). Which version does no coordination inside the loop?
2. Review a Spring `@Service` or `@RestController` in a project you know. List every instance field and classify it as immutable, thread-safe, or shared mutable state.
3. Make this class immutable and thread-safe: `class Team { String name; List<String> members; Date created; }`. Explain each change.
4. Rewrite `NumberRange` using a single lock instead of `AtomicReference`. Which methods must hold the lock, and why must `getLower()` hold it too?
5. Explain why `Stats.median` would become unsafe if `sorted` were made a field reused between calls, and describe an interleaving that produces a wrong answer.

```quiz
Q: Which of these is guaranteed to need no synchronisation, even when called by many threads at once?
- [ ] A method that increments a `static int` counter
- [x] A method that builds a new `ArrayList` in a local variable, fills it and returns its size
- [ ] A Spring service method that stores the current user in an instance field before using it
- [ ] Reading a `HashMap` field while another thread occasionally adds entries
> The local `ArrayList` is stack-confined: each call creates its own and no other thread can reach it, so its lack of thread safety does not matter. The static counter and the instance field are shared mutable state, and reading a `HashMap` while another thread writes it is a data race even though the reader never writes.

Q: A class keeps `lower` and `upper` in two `AtomicInteger` fields with the invariant `lower <= upper`. Why can the invariant still break?
- [ ] `AtomicInteger` is not visible across threads
- [ ] Atomic classes are slower than locks
- [x] Each field is updated atomically, but the check against the other field and the update are separate steps, so two threads can each pass their check
- [ ] `AtomicInteger.set` is not atomic
> Atomicity of each field does not make the pair atomic. Thread A checks lower against upper while thread B checks upper against lower; both pass, both write, and the pair ends up inconsistent. One lock around both fields, or one immutable pair swapped atomically, fixes it.

Q: A worker loop checks a plain `boolean stop` field that another thread sets to `true`. The loop sometimes never ends. What is the cause and fix?
- [ ] `boolean` writes are not atomic; use `AtomicBoolean` for atomicity
- [x] Without `volatile` or a lock there is no visibility guarantee, and the JIT may hoist the read out of the loop; declare the field `volatile`
- [ ] The loop is too fast for the CPU; add `Thread.sleep`
- [ ] The setting thread must call `notify()`
> Writes to a `boolean` are already atomic; the problem is visibility. Nothing forces the worker to re-read the field from memory, so the compiler may read it once. A `volatile` write is guaranteed visible to later `volatile` reads. Adding `sleep` may hide the bug but does not fix it.

Q: A record `Team(String name, List<String> members)` is shared between threads. Under what condition is it truly immutable?
- [ ] Always, because record fields are final
- [ ] Only if it is declared `final`
- [x] Only if the compact constructor copies `members` into an unmodifiable list such as `List.copyOf(members)`
- [ ] Only if every access is synchronised
> Record fields are final, so the reference to the list cannot change, but the list itself can if it is the caller's `ArrayList`. Records are shallowly immutable; copying into an unmodifiable list makes the whole object immutable.
```

## Quick revision {#quick-revision}

- Thread-safe = correct (invariants and contracts hold) under any interleaving, with no extra coordination from callers.
- Levels: immutable, unconditionally safe, conditionally safe, not thread-safe, thread-hostile.
- Danger requires shared + mutable + at least one writer. Remove one ingredient or coordinate.
- Sharing routes: static fields, singleton bean fields, objects captured by tasks or put on queues, escaping references.
- Failure modes: lost updates (read-modify-write, check-then-act), stale reads (visibility), broken multi-variable invariants.
- `volatile` fixes visibility, not atomicity; atomics fix single-variable atomicity, not multi-variable invariants.
- Guard every access to the same state with the same lock.
- Stack confinement: locals are private; safe while references do not escape. Stateless classes are thread-safe.
- Other confinement: single-threaded designs (UI thread, event loop), `ThreadLocal`, ownership transfer through queues.
- Immutable: all fields final, no mutators, no `this` escape, defensive copies. `final` fields are visible after construction without synchronisation.
- Records are shallowly immutable; copy mutable components (`List.copyOf`).
- Multi-field invariants: one immutable object in an `AtomicReference`, updated with `updateAndGet` (side-effect-free function).
- Effectively immutable objects still need safe publication.

## Key takeaways {#key-takeaways}

- Thread safety is about correctness against a specification under every possible interleaving, not about which keywords appear in the code.
- Every thread-safety bug needs shared mutable state; asking "who can reach it, and can it change?" finds them.
- Lost updates, stale reads and broken invariants are different failures with different fixes.
- Confinement and immutability remove the problem instead of managing it, and should be your first choice.
- Thread-safe building blocks do not automatically make a thread-safe whole; compound actions need one atomic step or one lock.
- Timing bugs rarely show in tests, so safety has to be reasoned about, not observed.
