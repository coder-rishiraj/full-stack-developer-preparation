---
summary: An immutable object cannot change after it is created; to "change" it, you create a new one. You will learn why that single rule removes whole categories of bugs — shared-state surprises, broken hash keys, thread races, replay errors — how to build immutable types correctly in Java, and where immutability costs more than it gives.
difficulty: intermediate
minutes: 50
objectives:
  - Explain how immutability prevents aliasing bugs, broken hash-based collections and data races
  - Build a deeply immutable Java class or record, including defensive copies of mutable components
  - Distinguish shallow from deep immutability, and an unmodifiable view from an immutable copy
  - Model domain values as immutable value objects with operations that return new instances
  - Apply immutability at system scale — events, logs, artifacts, cache keys — and judge when mutable state is the better choice
---

## Introduction

A pricing function receives an order's list of items and, to compute a discount, sorts it by price. The caller had shown that same list to the customer in the order they added items, and now the receipt prints in a different order. A configuration object is shared by twenty request handlers; one handler changes a timeout "just for this request", and every other request starts timing out too. A `Point` is stored as a key in a `HashMap`, someone moves the point, and the map can no longer find it. Two threads update the same shopping cart and one item silently disappears.

These bugs look unrelated, but they have the same cause: **an object was changed while someone else was relying on it staying the same**. In Java, variables hold references, so passing an object around does not copy it. Every method, thread and collection that holds a reference is looking at the same object, and any one of them can change it for all the others.

An **immutable object** is one whose state cannot change after construction. If you want a different value, you create a new object and leave the old one untouched. That one rule removes the whole category of bug. A list that cannot change cannot be sorted under your feet. A configuration that cannot change can be shared by any number of handlers. A key that cannot change cannot get lost in a map. An object that never changes needs no locks to be read by many threads.

The Java language mechanics — `final`, `String`, records — are introduced in [[c1-immutability]]. This lesson is about immutability as a *design* choice: which objects should be immutable, how to make them so correctly, how to work with values that "change" without mutation, and how the same idea shapes distributed systems, where immutable events, logs and build artifacts are standard practice.

## Before you start

- [[d1-encapsulation]] — immutability is the strongest form of encapsulation: after construction, there is nothing left to guard.
- **Java references, `final` and records** — see [[c1-immutability]], [[c1-records]] and [[c1-defensive-copies]].
- **`equals` and `hashCode`** — needed to understand the hash-key example. See [[c1-equals]].
- A basic idea of threads helps for the concurrency section; [[c3-shared-mutable-state]] covers it.

## The intuition

Think of a printed receipt. Once it is printed, nobody can edit it. If the shop made a mistake, it issues a *new* receipt — a refund slip, a corrected copy — and the original still says exactly what it said. Because receipts never change, you can photocopy one, hand copies to your accountant and your employer, and file the original, and every copy stays correct forever. Nobody has to coordinate with anybody.

Compare a shared whiteboard. It is convenient to update, but anyone reading it must wonder whether it changed since they last looked, two people writing at once make a mess, and nobody can tell what it said yesterday.

Mutable objects are whiteboards; immutable objects are receipts. The analogy has a limit: issuing a new receipt for every tiny change would be wasteful if the receipt were a thousand pages long. Immutability has a cost when objects are large and change often, and we will look at how real systems manage it.

## What immutable means in Java

An object is **immutable** when no operation, by anyone, can change any part of its observable state after the constructor finishes. The standard recipe, popularised by *Effective Java*, has five rules:

1. **Provide no methods that modify state** — no setters, no `add`, no `increment`.
2. **Prevent subclassing** — make the class `final` (or give it only private constructors). Otherwise a subclass could add mutable state or override methods to behave mutably, and code holding a reference to the base type would be fooled.
3. **Make all fields `final`** — the compiler then guarantees each field is assigned exactly once, and the Java Memory Model gives extra thread-safety guarantees (below).
4. **Make all fields `private`** — so nobody can reach a mutable component directly.
5. **Ensure exclusive access to any mutable components** — if a field refers to a mutable object such as a `List` or an array, copy it when it comes in through the constructor and never hand out the original.

A sixth rule is easy to forget: **do not let `this` escape during construction** — for example, by registering the object as a listener in its constructor. Another thread could then see it before its fields are set.

Java 16+ **records** take care of rules 1 to 4 automatically: a record's fields are `private final`, there are no setters, and records are implicitly `final`. Rule 5 is still your job.

### `final` is not immutability

The most common misunderstanding is that `final` makes an object immutable. `final` makes a *variable* (or field) impossible to reassign. It says nothing about the object the variable refers to.

```java
final List<String> names = new ArrayList<>();
names.add("Ana");          // allowed: the list changed, the variable did not
// names = new ArrayList<>();  // compile error: the variable is final
```

A class whose fields are all `final` but refer to mutable objects is only **shallowly immutable**. To be **deeply immutable**, everything reachable from the object must be immutable too.

## Shallow versus deep: seeing the leak

Records make the shallow trap easy to fall into, because they *look* immutable. The program below compares a record that stores the caller's list with one that copies it.

```java title="ShallowVsDeep.java"
import java.util.ArrayList;
import java.util.List;

public class ShallowVsDeep {

    record LeakyTeam(String name, List<String> members) {}

    record Team(String name, List<String> members) {
        Team {
            members = List.copyOf(members);   // take a private, unmodifiable copy
        }
    }

    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Ana"));
        LeakyTeam leaky = new LeakyTeam("core", names);
        Team safe = new Team("core", names);

        names.add("Bo");                       // the caller keeps using its list
        System.out.println("leaky: " + leaky.members());
        System.out.println("safe:  " + safe.members());

        try {
            safe.members().add("Mallory");
        } catch (UnsupportedOperationException e) {
            System.out.println("safe rejects writes");
        }
    }
}
```

```output
leaky: [Ana, Bo]
safe:  [Ana]
safe rejects writes
```

`LeakyTeam` stored a reference to the caller's `ArrayList`, so when the caller added `"Bo"`, the "immutable" record changed with it. It would also let anyone call `leaky.members().add(...)`. `Team`'s compact constructor replaces the parameter with `List.copyOf(members)` before the field is assigned. That one line does two jobs: the record no longer shares the caller's list, and the stored list is unmodifiable, so the accessor can return it directly without another copy.

Two details are worth knowing. `List.copyOf` (Java 10+) returns the same instance when given a list that is already an unmodifiable list created by `List.of` or `List.copyOf`, so copying immutable input is cheap. And it rejects `null` elements with a `NullPointerException`, which is usually what you want in a domain object.

Contrast this with `Collections.unmodifiableList(list)`, which is a **read-only view**: it blocks writes through the view, but if the underlying list changes, the view shows the change. A view is not immutability. Use `List.copyOf`, `Set.copyOf` and `Map.copyOf` when you need values that will never change.

Finally, `List.copyOf` freezes the *list*, not its elements. A `List<StringBuilder>` copied this way still contains mutable builders. Deep immutability requires the element types to be immutable as well — `String`, `Integer`, `LocalDate`, other records.

## Why immutability removes bugs

### No aliasing surprises

When two parts of a program hold references to the same object, they are **aliases**. With mutable objects, aliasing is the source of the "who changed this?" bugs from the introduction. With immutable objects, aliasing is harmless: sharing a reference is as safe as sharing a copy, and cheaper. You no longer need to copy defensively when passing values around, because nobody can change them.

### Safe keys in hash-based collections

`HashMap` and `HashSet` place each key in a bucket chosen by its `hashCode`, computed when the key is inserted. If a key's fields change afterwards, its hash code changes, and the map looks in the wrong bucket.

```java title="MutableKey.java"
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class MutableKey {

    static final class Point {
        int x;
        int y;

        Point(int x, int y) { this.x = x; this.y = y; }

        @Override public boolean equals(Object o) {
            return o instanceof Point p && p.x == x && p.y == y;
        }

        @Override public int hashCode() { return Objects.hash(x, y); }
    }

    public static void main(String[] args) {
        Map<Point, String> labels = new HashMap<>();
        Point p = new Point(1, 2);
        labels.put(p, "start");

        p.x = 5;                                            // mutate the key in place

        System.out.println(labels.get(p));
        System.out.println(labels.get(new Point(1, 2)));
        System.out.println(labels.size());
    }
}
```

```output
null
null
1
```

The entry is still in the map — `size()` is 1 — but it cannot be found by any key. Looking up `p` computes the hash of `(5, 2)` and searches a different bucket. Looking up a fresh `(1, 2)` finds the right bucket, but the stored key is now `(5, 2)`, so `equals` fails. The entry is lost until the map is rebuilt. Declaring `Point` as `record Point(int x, int y)` makes this bug impossible, because there is no `p.x = 5`. This is why `String`, `Integer` and records make good keys. See [[c1-hashcode]].

### Thread safety without locks

A data race needs two threads accessing the same memory with at least one of them writing. Immutable objects are never written after construction, so any number of threads can read them concurrently with no synchronisation.

The Java Memory Model adds a specific guarantee for `final` fields (Java Language Specification §17.5): once a constructor finishes, any thread that obtains a reference to the object sees the correct values of its `final` fields, even if the reference was passed without synchronisation — provided `this` did not escape during construction. Ordinary, non-final fields carry no such guarantee; another thread might see default values. This is one reason the recipe insists on `final` fields.

Immutability does not remove the need for coordination entirely. If threads must agree on *which* immutable object is current — the latest configuration, say — the reference to it is shared mutable state. The common pattern is to hold the current value in an `AtomicReference` (or a `volatile` field) and replace it with a new immutable object when something changes. Readers always see a complete, consistent snapshot; there is never a half-updated configuration. `CopyOnWriteArrayList` applies the same idea inside a collection. See [[c3-immutable-state]].

### Easier reasoning and replay

When a value cannot change, you can understand a method by reading it alone: the arguments it received are exactly what it will work with until it returns. Debugging is easier because state does not change behind your back. And computations over immutable inputs can be repeated — retried, cached, replayed — with the same result.

```quiz
Q: A record is declared as `record Order(String id, List<Item> items) {}` with no constructor body. Is it immutable?
- [ ] Yes — records are always deeply immutable
- [x] Only shallowly — the `items` field cannot be reassigned, but the list it refers to can still be changed by whoever holds it
- [ ] No — record fields are not final
- [ ] Yes, as long as `Item` is a record
> Record fields are private and final, so the reference cannot change, but the list object can. The caller that passed the list, or anyone calling items(), can add to it. A compact constructor with List.copyOf fixes this. Item being a record makes the elements safe, but not the list itself.

Q: Why does mutating a key after inserting it into a `HashMap` make the entry unreachable?
- [ ] HashMap deletes keys whose fields change
- [x] The entry stays in the bucket chosen by the old hash code, so lookups with the new state search a different bucket, and lookups with the old state fail equals
- [ ] HashMap makes a defensive copy of every key
- [ ] Java prevents mutable objects from being used as keys
> HashMap stores the key's hash at insertion time and never revisits it. After the mutation neither the new nor the old state can find the entry, although size() still counts it. HashMap does not copy keys, which is why immutable keys matter.
```

## Value objects: modelling things that "change"

Many domain concepts are defined entirely by their values: an amount of money, an email address, a date range, a coordinate. Two `Money` objects of 10.00 EUR are interchangeable; it does not matter which one you hold. Such concepts are called **value objects**, and they should almost always be immutable.

What about operations like "add tax" or "extend the date range"? They return a *new* value and leave the original alone, exactly like `String.toUpperCase()` or `LocalDate.plusDays()`.

```java title="MoneyDemo.java"
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class MoneyDemo {

    record Money(BigDecimal amount, String currency) {
        Money {
            Objects.requireNonNull(amount, "amount");
            Objects.requireNonNull(currency, "currency");
            amount = amount.setScale(2, RoundingMode.HALF_EVEN);   // one canonical form
        }

        static Money of(String amount, String currency) {
            return new Money(new BigDecimal(amount), currency);
        }

        Money plus(Money other) {
            if (!currency.equals(other.currency)) {
                throw new IllegalArgumentException(
                        "currency mismatch: " + currency + " vs " + other.currency);
            }
            return new Money(amount.add(other.amount), currency);
        }

        Money times(int quantity) {
            return new Money(amount.multiply(BigDecimal.valueOf(quantity)), currency);
        }

        @Override public String toString() { return amount + " " + currency; }
    }

    public static void main(String[] args) {
        Money price = Money.of("19.99", "EUR");
        Money shipping = Money.of("4.5", "EUR");
        Money total = price.times(3).plus(shipping);

        System.out.println("price " + price);
        System.out.println("total " + total);
        System.out.println(Money.of("10", "EUR").equals(Money.of("10.00", "EUR")));

        try {
            total.plus(Money.of("1", "USD"));
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

```output
price 19.99 EUR
total 64.47 EUR
true
currency mismatch: EUR vs USD
```

Several design decisions are visible. `price.times(3).plus(shipping)` reads like arithmetic, and `price` is still 19.99 afterwards — computing a total cannot corrupt the unit price. The compact constructor validates and **normalises** every value to two decimal places. That matters for equality: `BigDecimal.equals` treats `10` and `10.00` as different because their scales differ, but after normalisation the two `Money` values are equal, which is what the domain means. The currency check lives inside `plus`, so adding euros to dollars is impossible everywhere. Because the type is immutable, all of these guarantees are established once, in the constructor, and can never be undone. (A production `Money` type would use `java.util.Currency` and its default fraction digits rather than a fixed scale of 2; the shape of the design is the same.)

### Changing one field: withers and builders

For records with several fields, the usual way to "change" one field is a **wither** method that returns a copy:

```java
record Address(String street, String city, String postcode) {
    Address withCity(String newCity) { return new Address(street, newCity, postcode); }
}
```

Java 21 records do not generate these automatically; you write them by hand, or use a library such as Lombok (`@With`). For objects with many optional fields, a **builder** collects values in a mutable helper and then constructs the immutable object in one step; the constructor copies any collections, so reusing or mutating the builder afterwards cannot affect objects already built. See [[d2-builder]].

## Immutability in the wider system

The same idea — never change data in place; record new facts instead — shows up at every scale of system design.

**Strings and dates in the JDK.** `String` is immutable, which lets the JVM share identical string literals through the string pool, cache each string's hash code, and safely use strings for class names and file paths that security checks have already validated. Building strings in a loop uses the mutable `StringBuilder` and produces an immutable `String` at the end. The old `java.util.Date` is mutable — a frequent source of leaks — which is one reason the `java.time` types introduced in Java 8 (`Instant`, `LocalDate`, `Duration`) are all immutable. See [[c1-string-pool]].

**Events and messages.** An event such as `OrderPlaced` describes something that happened; it is a fact, and facts do not change. Publishing events as immutable records means a consumer that processes the same event twice, or replays it a week later, sees exactly the same data. Kafka's log is append-only for the same reason. **Event sourcing** takes this to its conclusion: the current state of an entity is derived by folding over its immutable history of events. See [[d5-event-sourcing]].

**Build artifacts and infrastructure.** Deploying a container image by its content digest, rather than a mutable tag like `latest`, guarantees that what you tested is exactly what runs in production. Immutable infrastructure replaces servers rather than patching them in place. See [[c14-immutable-artifacts]].

**Caching.** Web assets with content hashes in their names, such as `app.3f9a2c.js`, never change, so browsers and CDNs can cache them indefinitely; a new version gets a new name. Any cache works best when the cached value cannot change after it is stored.

**User interfaces.** React decides whether to re-render by comparing references, so state must be updated by creating new objects and arrays rather than mutating existing ones. See [[b4-state-immutability]].

```mermaid title="Updating by creating new versions: old readers are unaffected"
flowchart LR
    V1["Cart v1: 2 items"] -->|"addItem"| V2["Cart v2: 3 items"]
    V2 -->|"removeItem"| V3["Cart v3: 2 items"]
    R1["Receipt page holds v1"] --> V1
    R2["Checkout holds v3"] --> V3
```

## The costs, and how systems manage them

**Allocation.** Every "change" creates a new object. For small values this is cheap — modern garbage collectors handle short-lived objects very efficiently — but it is not free in tight loops that update numbers millions of times per second, such as game physics or numerical buffers. There, a mutable object confined to one thread is the right tool.

**Copying large structures.** Adding one element to a 100,000-element immutable list by copying it costs O(n). Functional languages avoid this with **persistent data structures** that use **structural sharing**: the new version reuses most of the old one's internal nodes and allocates only the changed path, so updates cost O(log n) or close to constant. Clojure and Scala build these in; in Java, libraries such as Vavr provide them, and in JavaScript, Immutable.js. Java's own `List.copyOf` performs a full copy.

**Frameworks that expect mutation.** JPA entities are mutable by design: Hibernate tracks changes to loaded objects and writes them back. Forcing entities to be immutable fights the framework. A common compromise keeps entities mutable but well encapsulated, uses immutable value objects (`@Embeddable` types, records) for their parts, and uses immutable records for data that leaves the persistence layer. See [[c8-entity-immutability]].

**Awkward multi-step construction.** Objects with many fields need builders or withers, which is more code than setters. Records and builders reduce the burden considerably.

A practical rule: make **values** immutable by default — money, dates, identifiers, addresses, configuration, messages, events, cache keys, DTOs. Make **entities** with identity and a lifecycle (an order that moves through statuses, a bank account) encapsulated mutable objects, unless your architecture specifically favours immutable snapshots. Keep mutable state as local and as confined to one thread as possible.

## Immutability in other languages

JavaScript's `const` is like Java's `final`: the binding cannot be reassigned, but the object can be changed. `Object.freeze(obj)` prevents changes to the object's own properties, but only one level deep — nested objects remain mutable. TypeScript's `readonly` modifier and `Readonly<T>` type are checked only at compile time and also apply one level deep. See [[b2-readonly-utility]]. Languages such as Clojure, Elm and Haskell make immutability the default, and Kotlin distinguishes `val` from `var` and read-only from mutable collection interfaces.

## Common mistakes

> [!MISTAKE] Believing final fields make an object immutable
> `final` stops reassignment of the field, not mutation of the object it refers to. A `final List` can still be added to, and a `final Date` can still have `setTime` called on it. Copy mutable components in, never hand them out, and prefer immutable component types.

**Storing the caller's collection.** A constructor or record that keeps a reference to a list it was given shares it with the caller. Use `List.copyOf` (or `Set.copyOf`, `Map.copyOf`) in the constructor.

**Returning internal mutable state.** A getter that returns an internal `ArrayList` or array undoes everything. Store unmodifiable copies, or return copies.

**Confusing a view with a copy.** `Collections.unmodifiableList` blocks writes through the view but reflects changes to the original. It is not an immutable value.

**Leaving the class extensible.** A non-final "immutable" class can be subclassed with mutable fields. Make it `final`, use a record, or give it private constructors.

**Mutating an object taken from a cache.** If a cache hands out mutable objects, one caller's change corrupts every later reader. Cache immutable values, or copy on the way out.

**Using legacy mutable types.** `java.util.Date` and `Calendar` are mutable; use `Instant`, `LocalDate` and the rest of `java.time`.

## Interview perspective

> [!INTERVIEW] The checklist answer, with a reason for each rule
> "To make a class immutable: no setters; make it final so subclasses can't add mutability; private final fields, which also gives safe publication under the memory model; and defensive copies of mutable components on the way in and out, usually with `List.copyOf`. A record handles the first three, but I still copy collections in the compact constructor, because records are only shallowly immutable."

Questions to prepare:

- **Why use immutable objects?** No aliasing bugs, safe hash keys, thread safety without locks, simpler reasoning, safe caching and replay.
- **Why is `String` immutable?** String pool sharing, cached hash codes, security of validated values, and thread safety.
- **Shallow versus deep immutability?** Shallow: fields cannot be reassigned but referenced objects can change. Deep: everything reachable is immutable.
- **`String` versus `StringBuilder`?** Build with the mutable builder in one thread, publish the immutable `String`.
- **When does immutability hurt?** Large structures changed frequently, tight numeric loops, and frameworks such as JPA that rely on mutation.
- **How is immutability used in distributed systems?** Immutable events and append-only logs make replay and idempotent processing safe; immutable artifacts make deployments reproducible; content-addressed assets can be cached forever.

## Practice

1. **Fix the record.** Make `record Playlist(String name, List<Song> songs)` deeply immutable, assuming `Song` is a mutable class. What has to change in `Song`?
2. **Write a value object.** Implement an immutable `DateRange(LocalDate start, LocalDate end)` that rejects `end` before `start`, with `contains(LocalDate)`, `overlaps(DateRange)` and `extendBy(Period)`.
3. **Safe configuration reload.** Design an `AppConfig` record and a `ConfigHolder` that lets one thread reload configuration while request threads read it, without locks on the read path. Explain why readers can never see a half-updated configuration.
4. **Find the lost key.** Explain, bucket by bucket, why the `MutableKey` program prints `null` twice, and rewrite `Point` so the bug cannot happen.

## Quick revision {#quick-revision}

- Immutable = no observable state change after construction; changes produce new objects.
- Recipe: no mutators, `final` class, `private final` fields, defensive copies of mutable components in and out, `this` must not escape the constructor.
- Records give the first three automatically; they are only shallowly immutable — copy collections in the compact constructor.
- `final` ≠ immutable. `List.copyOf` = immutable copy; `Collections.unmodifiableList` = live read-only view.
- Benefits: no aliasing bugs, stable hash keys, lock-free sharing between threads (JLS §17.5 final-field guarantee), easy reasoning, safe caching and replay.
- Current-value pattern: immutable snapshot + `AtomicReference`/`volatile` reference swap.
- Value objects (Money, Email, DateRange) are immutable; operations return new instances; normalise in the constructor.
- Withers and builders for "changing" multi-field values.
- System scale: immutable events, append-only logs, event sourcing, image digests, content-hashed assets, React state.
- Costs: allocation, O(n) copies (persistent structures share structure), JPA expects mutable entities.

## Key takeaways {#key-takeaways}

- Most shared-state bugs come from an object changing while someone else relies on it; immutability removes that possibility entirely.
- Making fields `final` is not enough — every mutable component must be copied in and never handed out.
- Immutable values can be shared freely between methods, collections and threads without copying or locking.
- Model values as immutable objects whose operations return new instances, and validate and normalise them once, in the constructor.
- At system scale, recording new facts instead of changing old ones makes replay, caching and deployment reliable.
- Use mutable, well-encapsulated objects where frequent in-place change or frameworks require it, and keep that mutable state confined.
