---
summary: Inheritance and composition are the two ways one class can reuse another — by extending it or by holding it and delegating to it. You will learn what each one really couples you to, why "favour composition over inheritance" became standard advice, and how to recognise the cases where inheritance is still the right tool.
difficulty: intermediate
minutes: 45
objectives:
  - Explain the two things inheritance bundles together — subtyping and implementation reuse — and why that bundling causes problems
  - Demonstrate the fragile base class problem and fix it with composition and delegation
  - Refactor a class hierarchy that explodes combinatorially into composed, swappable behaviours
  - Decide when inheritance is appropriate, using the is-a test and substitutability
  - Design a class either for safe extension or to forbid it, using final and sealed
---

## Introduction

Suppose you need a set that counts how many times callers have tried to add elements. Java already has `HashSet`, so the quickest route is obvious: write `class CountingHashSet extends HashSet`, override `add` and `addAll` to bump a counter, and inherit everything else. Fifteen lines. Then you test it: you add three elements with `addAll` and the counter says six. Nothing in *your* code adds anything twice. The bug comes from a detail inside `HashSet` that you never saw and were never promised.

That bug, which we will reproduce and fix below, is the clearest demonstration of why experienced engineers are wary of inheritance. When a class **extends** another, it depends on how the parent is implemented, not only on what it promises. The alternative is **composition**: the new class *holds* a `HashSet` in a private field and **delegates** to it, depending only on the set's public contract.

Both are ways to reuse code, and both are legitimate. **Inheritance** creates an "is-a" relationship: a `Circle` is a `Shape`, so it can be used anywhere a `Shape` is expected. **Composition** creates a "has-a" relationship: a `Car` has an `Engine`, and it uses the engine without being one. The well-known advice from the *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994) is to *favour object composition over class inheritance*. The word is "favour", not "always": this lesson is about understanding the costs well enough to make the choice deliberately.

You will need this in every low-level design interview — designing a parking lot, a notification service or a chess game invites a class hierarchy, and interviewers watch whether you build a deep one — and in everyday code review, where "why does this extend that?" is one of the most useful questions you can ask.

## Before you start

- **Java inheritance and polymorphism** — `extends`, `super`, overriding and dynamic dispatch. See [[c1-inheritance]] and [[c1-polymorphism]].
- **Interfaces** — the contract-based alternative to a base class. See [[c1-interfaces]] and [[d1-interfaces]].
- **Encapsulation** — composition works because it respects other classes' encapsulation. See [[d1-encapsulation]].
- [[c1-aggregation]] covers the Java-level vocabulary of aggregation and composition between objects.

## The intuition

Think of how a restaurant gets a dessert menu. One option is to *become* a bakery: buy the bakery's whole operation, inherit its staff, recipes, opening hours and suppliers, and then adjust whatever does not fit. The other option is to *contract* a bakery: agree that it delivers cakes every morning, and serve them. In the first case, every change the bakery makes to its internal routines — a new oven schedule, a different flour supplier — is now your problem. In the second case, all you depend on is the delivery agreement. You can also switch bakeries, or contract a second one for gluten-free desserts, without restructuring the restaurant.

Inheritance is buying the bakery: you get everything, including what you did not want and what may change under you. Composition is the contract: you get exactly the service you agreed on, through a narrow interface.

The analogy stops at one point. Sometimes you genuinely are a specialised version of the other thing — a pastry restaurant really is a kind of restaurant and should be treated as one everywhere. That is the case where inheritance fits, and we will define it precisely.

## What inheritance really gives you

When `class B extends A`, the language gives you two different things at once.

1. **Subtyping.** A `B` can be used wherever an `A` is expected. A method that takes an `A` will accept a `B`, and calls dispatch to `B`'s overrides at runtime. This is **polymorphism**.
2. **Implementation reuse.** `B` gets `A`'s fields and method bodies without writing them again, and can call `A`'s code through `super`.

These two are bundled. You cannot take the code without becoming a subtype, and you cannot become a subtype without taking the code. Many inheritance problems come from wanting only one of the two:

- If you extend a class *only to reuse its code*, you also make your class a subtype — so callers can use it in ways that make no sense for it.
- If you extend a class *only to be a subtype*, you also take on its fields and its implementation — so you are coupled to details you did not need.

Composition and interfaces separate the two. An interface gives subtyping with no implementation. A private field gives implementation reuse with no subtyping. You choose each independently.

| Aspect | Inheritance (`extends`) | Composition (field + delegation) |
|---|---|---|
| Relationship | is-a | has-a |
| What you depend on | The parent's implementation, including protected members and internal calls | The collaborator's public contract only |
| When it is decided | Compile time; one parent per class in Java | Construction time or runtime; any number of collaborators |
| Exposes to callers | Every public method of the parent | Only what you choose to forward |
| Typical risk | Fragile base class, broken substitutability | More forwarding code; more objects to wire |

## The fragile base class problem

Here is the counting set from the introduction, written both ways. Read it before looking at the output.

```java title="FragileBase.java"
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class FragileBase {

    // Reuse by inheritance: extend HashSet and override the two add methods.
    static class CountingHashSet<E> extends HashSet<E> {
        private int addAttempts = 0;

        @Override
        public boolean add(E e) {
            addAttempts++;
            return super.add(e);
        }

        @Override
        public boolean addAll(Collection<? extends E> c) {
            addAttempts += c.size();
            return super.addAll(c);
        }

        int addAttempts() { return addAttempts; }
    }

    // Reuse by composition: hold a Set and forward to it.
    static class CountingSet<E> {
        private final Set<E> inner;
        private int addAttempts = 0;

        CountingSet(Set<E> inner) { this.inner = inner; }

        boolean add(E e) {
            addAttempts++;
            return inner.add(e);
        }

        boolean addAll(Collection<? extends E> c) {
            addAttempts += c.size();
            return inner.addAll(c);
        }

        boolean contains(Object o) { return inner.contains(o); }
        int size() { return inner.size(); }
        int addAttempts() { return addAttempts; }
    }

    public static void main(String[] args) {
        CountingHashSet<String> inherited = new CountingHashSet<>();
        inherited.addAll(List.of("a", "b", "c"));
        System.out.println("inheritance: " + inherited.addAttempts());

        CountingSet<String> composed = new CountingSet<>(new HashSet<>());
        composed.addAll(List.of("a", "b", "c"));
        System.out.println("composition: " + composed.addAttempts());
    }
}
```

```output
inheritance: 6
composition: 3
```

Trace the inheritance version. `inherited.addAll(...)` runs our override, which adds 3 to the counter and calls `super.addAll(c)`. `HashSet` does not define `addAll` itself; it inherits the one from `AbstractCollection`, which loops over the argument and calls `add(e)` for each element. Because `add` is overridden and Java dispatches calls dynamically, that internal call runs *our* `add`, which increments the counter again — three more times. Total: 6.

This is called **self-use**: a class's methods calling its own other overridable methods. It is an implementation detail. `AbstractCollection` happens to document it, but `HashSet`'s own documentation does not promise it, and a future version could legitimately change `addAll` to insert elements directly, at which point a "fixed" subclass that removed its `addAll` override would silently start under-counting. Either way, the subclass is correct only by knowing the parent's internals. That is the **fragile base class problem**: a parent class cannot be changed safely because subclasses depend on how it works, and a subclass cannot be written safely without reading the parent's source.

The composition version has no such problem. `CountingSet.addAll` calls `inner.addAll`, and whatever `HashSet` does internally — calling its own `add` or not — stays inside `HashSet`, because `HashSet`'s `add` is not our `add`. `CountingSet` depends only on the documented contract of `Set`. It also works with *any* `Set` passed in — a `TreeSet`, a `LinkedHashSet` — which the inheritance version cannot do.

The cost of composition is visible too: `CountingSet` had to forward `contains` and `size` by hand, and it is not itself a `Set`, so it cannot be passed to methods that expect one. When you need the wrapper to *be* a `Set`, the usual technique is a reusable **forwarding class** that implements `Set<E>` by delegating every method to an inner set; specific wrappers then extend the forwarding class, which is safe because the forwarding class has no hidden self-use. This wrapping is the **Decorator** pattern, taught in [[d2-decorator]].

```mermaid title="Where the extra calls come from in the inheritance version"
sequenceDiagram
    participant C as caller
    participant S as CountingHashSet
    participant A as AbstractCollection.addAll
    C->>S: addAll(a, b, c)
    Note over S: addAttempts += 3
    S->>A: super.addAll(c)
    loop for each element
        A->>S: add(e) dispatches to the override
        Note over S: addAttempts += 1
    end
```

## Inheriting an interface you do not want

The second classic problem is extending a class only to reuse its code, and accidentally publishing its whole interface. The JDK itself contains the best-known example: `java.util.Stack` extends `Vector`.

```java title="StackLeak.java"
import java.util.Stack;

public class StackLeak {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        stack.add(0, 99);            // a Vector method: insert at the bottom
        System.out.println(stack);
        System.out.println(stack.get(1));
        System.out.println(stack.pop());
    }
}
```

```output
[99, 1, 2]
1
2
```

A stack should allow push, pop and peek. Because `Stack` *is a* `Vector`, it also allows inserting at any index, reading any position and removing from the middle — operations that break the last-in, first-out rule the class exists to provide. Its encapsulation was given away by the `extends` clause, and it cannot be taken back without breaking existing code. The Javadoc for `Stack` now recommends `Deque` implementations such as `ArrayDeque` instead.

The composition version exposes exactly the operations a stack should have:

```java
public final class BoundedStack<E> {
    private final java.util.ArrayDeque<E> items = new java.util.ArrayDeque<>();
    private final int capacity;

    public BoundedStack(int capacity) { this.capacity = capacity; }

    public void push(E e) {
        if (items.size() == capacity) throw new IllegalStateException("stack full");
        items.push(e);
    }
    public E pop() { return items.pop(); }
    public E peek() { return items.peek(); }
    public boolean isEmpty() { return items.isEmpty(); }
}
```

Because the `ArrayDeque` is private, there is no way to insert at the bottom, and the class can enforce a capacity — an invariant that an inherited `add(int, E)` would have let callers bypass.

## Combinatorial explosion

The third problem appears when inheritance is used to model features that combine. Suppose a notification system has two channels, email and SMS, and two optional features, retries and logging. With inheritance, each combination is a class: `EmailSender`, `RetryingEmailSender`, `LoggingEmailSender`, `LoggingRetryingEmailSender`, and the same four for SMS. Two channels and two features give eight classes; add push notifications and rate limiting and you have twenty-four, most of them duplicating each other's code. Worse, the combination is fixed at compile time — you cannot decide from configuration to add retries for one customer.

Composition turns each feature into a small object that wraps another sender. You build the combination you need when you construct the objects.

```java title="ComposedSenders.java"
public class ComposedSenders {

    interface Sender {
        void send(String to, String message);
    }

    /** Fails on its first call, to simulate a transient SMTP problem. */
    static final class FlakyEmailSender implements Sender {
        private int calls = 0;

        public void send(String to, String message) {
            calls++;
            if (calls == 1) throw new IllegalStateException("SMTP timeout");
            System.out.println("email to " + to + ": " + message);
        }
    }

    static final class SmsSender implements Sender {
        public void send(String to, String message) {
            System.out.println("sms to " + to + ": " + message);
        }
    }

    /** Adds retries to any sender. */
    static final class RetryingSender implements Sender {
        private final Sender inner;
        private final int maxAttempts;

        RetryingSender(Sender inner, int maxAttempts) {
            this.inner = inner;
            this.maxAttempts = maxAttempts;
        }

        public void send(String to, String message) {
            for (int attempt = 1; ; attempt++) {
                try {
                    inner.send(to, message);
                    return;
                } catch (RuntimeException e) {
                    if (attempt == maxAttempts) throw e;
                    System.out.println("attempt " + attempt + " failed: " + e.getMessage());
                }
            }
        }
    }

    /** Adds logging to any sender. */
    static final class LoggingSender implements Sender {
        private final Sender inner;

        LoggingSender(Sender inner) { this.inner = inner; }

        public void send(String to, String message) {
            System.out.println("[log] sending to " + to);
            inner.send(to, message);
        }
    }

    public static void main(String[] args) {
        Sender email = new LoggingSender(new RetryingSender(new FlakyEmailSender(), 3));
        email.send("ana@example.com", "Your order shipped");

        Sender sms = new LoggingSender(new SmsSender());
        sms.send("+15550100", "Code 4821");
    }
}
```

```output
[log] sending to ana@example.com
attempt 1 failed: SMTP timeout
email to ana@example.com: Your order shipped
[log] sending to +15550100
sms to +15550100: Code 4821
```

Follow the email call from the outside in. `LoggingSender` prints its line and passes the call to `RetryingSender`. The retrying sender calls the flaky email sender, which throws on its first call; the retry loop catches it, prints the failure, and tries again; the second attempt succeeds and the loop returns. The SMS sender gets logging but no retries, simply because it was constructed that way.

Count the classes: two channels plus two features is four classes, not eight, and adding a third feature adds one class, not a doubling. Each feature is written once, can be tested on its own with a fake inner sender, and can be combined at runtime — from configuration, per customer or per environment. This structure is the Decorator pattern again; when the behaviour being swapped is a single algorithm rather than a wrapper, the same idea is called **Strategy** ([[d2-strategy]]).

> [!TIP] Order matters when you compose wrappers
> `new LoggingSender(new RetryingSender(...))` logs once per message. `new RetryingSender(new LoggingSender(...), 3)` logs once per *attempt*. Neither is wrong, but the difference is real, so decide which you want and say it in the code.

## Swapping behaviour at runtime

Because a composed collaborator is just a field, it can be chosen when the object is created and, if the design allows, replaced later. The textbook example models ducks: instead of a `Duck` hierarchy where `RubberDuck` overrides `fly()` to do nothing (a subclass refusing its parent's behaviour, which is a warning sign covered in [[d1-solid]]), each duck *has a* flying behaviour.

```java title="Ducks.java"
public class Ducks {

    interface FlyBehavior {
        String fly();
    }

    static final class Duck {
        private final String name;
        private FlyBehavior flyBehavior;

        Duck(String name, FlyBehavior flyBehavior) {
            this.name = name;
            this.flyBehavior = flyBehavior;
        }

        void setFlyBehavior(FlyBehavior flyBehavior) { this.flyBehavior = flyBehavior; }

        String performFly() { return name + ": " + flyBehavior.fly(); }
    }

    public static void main(String[] args) {
        Duck mallard = new Duck("mallard", () -> "flaps its wings");
        Duck decoy = new Duck("decoy", () -> "cannot fly");
        System.out.println(mallard.performFly());
        System.out.println(decoy.performFly());

        decoy.setFlyBehavior(() -> "rocket-powered");
        System.out.println(decoy.performFly());
    }
}
```

```output
mallard: flaps its wings
decoy: cannot fly
decoy: rocket-powered
```

`FlyBehavior` has a single abstract method, so lambdas implement it directly — in modern Java, many small composed behaviours need no named class at all. A decoy that "cannot fly" is no longer a subclass breaking a promise; it is a duck configured with a behaviour that honestly reports it does not fly.

```quiz
Q: Why did `CountingHashSet.addAll` count six additions for three elements?
- [ ] `HashSet` stores each element twice
- [ ] `List.of` duplicates its arguments
- [x] The inherited `addAll` calls `add` for each element, and that call dispatches to the overridden `add`, which counts again
- [ ] The counter field was declared `static`
> HashSet inherits addAll from AbstractCollection, which loops and calls add. Dynamic dispatch sends those calls to the subclass override. The subclass's correctness depended on an internal detail of its parent — the fragile base class problem.

Q: A team writes `class ReportCache extends HashMap<String, Report>` to reuse the map code. What is the strongest objection?
- [ ] HashMap is final and cannot be extended
- [x] ReportCache now exposes every Map operation — put, remove, clear — so callers can bypass any caching rules it tries to enforce
- [ ] Composition is always faster than inheritance
- [ ] Generic classes cannot be extended
> Extending only to reuse code also makes ReportCache a Map subtype, publishing the whole Map interface. A private HashMap field with a few chosen methods keeps the cache's rules enforceable. HashMap is not final, which is exactly why this mistake is possible.
```

## When inheritance is the right tool

None of this makes inheritance bad. It makes it a tool with a specific job. Inheritance fits when the subclass is genuinely a more specific kind of the parent *and can be used anywhere the parent is used without surprising anyone*. That second condition is the Liskov Substitution Principle, taught in [[d1-solid]]: "is-a" in everyday language is not enough. A square is a rectangle in geometry, but a `Square` that extends a mutable `Rectangle` breaks code that sets width and height independently.

Situations where inheritance is a good fit:

- **Template Method.** A base class fixes the steps of an algorithm and lets subclasses fill in specific steps, as in [[d2-template-method]]. The base class is designed for this, and documents which methods are hooks.
- **Skeletal implementations.** `java.util.AbstractList` asks you to implement `get(int)` and `size()` and provides the rest of the `List` interface. It is designed and documented for extension, including which methods call which.
- **Framework extension points.** Some frameworks are built around subclassing: `HttpServlet` subclasses override `doGet`, and Spring's `OncePerRequestFilter` subclasses override `doFilterInternal`. The framework owns the base class and its contract.
- **Exception hierarchies.** `class InsufficientFundsException extends RuntimeException` is idiomatic: catch clauses rely on the subtype relationship, and exceptions add little behaviour.
- **Closed families of types.** A `sealed interface Shape permits Circle, Square, Triangle` (Java 17) declares the complete set of variants, and the compiler checks that `switch` expressions cover them all. This is subtyping with no implementation inheritance at all — often the best of both. See [[c1-sealed]].

### Design for inheritance, or prohibit it

The fragile base class problem has a matching rule for authors, popularised by Joshua Bloch's *Effective Java*: either design a class for inheritance and document it, or forbid inheritance. Designing for inheritance means documenting self-use (which overridable methods call which — the JDK uses an `@implSpec` section for this), keeping constructors from calling overridable methods (the subclass's override would run before the subclass's fields are initialised), and exposing deliberate `protected` hooks rather than everything.

If you are not prepared to do that, make the class `final`, or give it only private constructors and static factories. Other languages make this the default: Kotlin classes are final unless marked `open`, and C# methods are non-virtual unless marked `virtual`. Java 17's `sealed` classes add a middle ground — extension is allowed, but only by the subclasses you list.

## Multiple inheritance, mixins and default methods

Java allows a class to extend only one class, which avoids the **diamond problem** — what happens when two parents both define the same method or field, and a class inherits from both. It does allow implementing many interfaces, and since Java 8 interfaces can contain `default` methods with bodies. Default methods give a limited, mixin-like reuse: an interface can provide behaviour built entirely from its own abstract methods. If a class inherits two default methods with the same signature from unrelated interfaces, the compiler requires the class to override the method and choose explicitly, so the diamond is resolved in the open. Interfaces still cannot hold instance state, which keeps them far less fragile than base classes. See [[c1-default-methods]].

Other ecosystems lean even harder on composition. React components reuse behaviour by composing components and custom hooks rather than by extending component classes, and Go has no class inheritance at all — it embeds structs and satisfies interfaces implicitly.

## In real systems

**Spring services.** A typical Spring application has almost no inheritance between services. An `OrderService` is composed of an `OrderRepository`, a `PaymentGateway` and a `Notifier`, injected through its constructor. The composition is assembled by the container, which is what makes it easy to substitute fakes in tests and alternative implementations per environment. See [[c5-constructor-injection]].

**Cross-cutting behaviour.** Retries, caching, metrics and authorisation checks are usually added by wrapping objects rather than subclassing them. Spring's AOP proxies wrap your beans; Resilience4j decorates function calls with retry and circuit-breaker behaviour. These are composition, even when a framework generates the wrapper for you.

**Domain models.** Low-level design interviews tempt candidates into hierarchies like `Vehicle → Car → ElectricCar → ElectricSportsCar`. Strong designs keep hierarchies shallow — one level, often an interface with implementations — and model varying features (fuel type, pricing rule, parking spot size) as composed values or strategies.

**JPA entity inheritance.** Hibernate supports mapping class hierarchies to tables, but each strategy has costs (wide tables with many nullable columns, or joins on every query). Many teams prefer composition — an `@Embeddable` value inside an entity — when the variation is in data rather than identity. See [[c8-embeddables]].

## Trade-offs and alternatives

Composition gives flexibility (collaborators chosen at runtime), looser coupling (only public contracts), smaller and testable pieces, and full control over the exposed interface. It costs forwarding code, more objects to wire together, and sometimes harder navigation, since behaviour is spread across collaborators rather than one hierarchy.

Inheritance gives concise code when the subtype relationship is real and stable, polymorphism through a shared base type, and the natural shape for template methods and framework hooks. It costs tight coupling to the parent's implementation, a fixed structure decided at compile time, inherited operations you may not want, and hierarchies that get hard to change once they are deep.

| Situation | Prefer |
|---|---|
| Reusing another class's code with no true subtype relationship | Composition |
| Several independent features that combine | Composition (decorators, strategies) |
| Behaviour chosen by configuration or at runtime | Composition |
| A genuine subtype that honours every promise of its parent | Inheritance or an interface |
| A fixed algorithm with variable steps, designed for extension | Inheritance (Template Method) |
| A closed set of variants checked by the compiler | Sealed interface with records or classes |
| A framework that is designed around subclassing | Inheritance, as the framework expects |

## Common mistakes

**Extending a concrete class to reuse one method.** If you need one helper, call it, compose it or extract it — do not make your class a subtype of something it is not.

**Reciting the slogan as "never inherit".** Interviewers often follow up with "so when *would* you use inheritance?". Have the cases above ready: template method, framework hooks, exceptions, real subtypes, sealed families.

> [!MISTAKE] Overriding a method to throw or do nothing
> A subclass whose override throws `UnsupportedOperationException` or silently does nothing is refusing part of its parent's contract. Callers holding the parent type will be surprised. That is a sign the "is-a" relationship is false; model the varying behaviour as a composed collaborator, or split the parent's interface.

**Deep hierarchies for feature flags.** `PremiumMember extends GoldMember extends Member` breaks as soon as a member is both premium and a student. Use a field for the tier and compose the rules.

**Composition without interfaces.** Holding a concrete `SmtpEmailSender` field is composition, but it still ties the class to one implementation. Hold the abstraction (`Sender`) and inject the concrete one.

**Calling overridable methods from a constructor.** In a class designed for extension, a constructor that calls an overridable method runs the subclass's version before the subclass's own fields are set, which usually means it sees `null` or zero.

## Interview perspective

> [!INTERVIEW] A balanced answer
> "Inheritance couples me to the parent's implementation and publishes its whole interface, so I use it only for true subtypes that honour the parent's contract, template methods and framework hooks. For reuse and for features that vary or combine, I compose: a private field, delegation, and an interface for the collaborator so I can swap it."

Questions to prepare:

- **Composition versus inheritance?** Has-a with delegation versus is-a with implementation reuse; describe coupling, flexibility and exposed interface.
- **What is the fragile base class problem?** Subclasses depend on the parent's internal self-use, so changes to the parent break them. Use the counting-set example.
- **Why is `Stack extends Vector` considered a mistake?** It publishes `Vector`'s random-access operations on a type that should be last-in, first-out only.
- **Fix `Square extends Rectangle`.** Make the shapes immutable, or give them a common `Shape` interface with `area()` and no setters, instead of a parent-child relationship.
- **How do Decorator and Strategy relate to this?** Both are composition in pattern form: Decorator wraps an object to add behaviour; Strategy plugs in an interchangeable algorithm.
- **When would you choose inheritance anyway?** Template method, framework base classes, exceptions, sealed type families, and genuine substitutable subtypes.

## Practice

1. **Forwarding set.** Write a `ForwardingSet<E> implements Set<E>` that delegates every method to an inner set, then rewrite `CountingSet` as a subclass of it. Explain why extending *this* class is safe when extending `HashSet` was not.
2. **Flatten a hierarchy.** A pricing system has `RegularTicket`, `StudentTicket`, `WeekendTicket` and `StudentWeekendTicket`. Redesign it with one `Ticket` class and composed pricing rules, and show how a new "senior" discount is added.
3. **Spot the false is-a.** For each pair decide inheritance, composition or neither, and justify: `Manager`/`Employee`, `Logger`/`FileWriter`, `ElectricCar`/`Car`, `UserList`/`ArrayList`.
4. **Wrapper order.** Add a `RateLimitedSender` to the sender example and describe the behavioural difference between placing it outside and inside the retrying sender.

## Quick revision {#quick-revision}

- Inheritance = is-a; bundles subtyping with implementation reuse. Composition = has-a; a private field plus delegation.
- Favour composition for reuse; use inheritance only when the subtype is substitutable for the parent.
- Fragile base class: a subclass depends on the parent's internal self-use (`HashSet.addAll` calling `add`), so parent changes break it.
- Extending to reuse code publishes the parent's whole interface (`Stack extends Vector`).
- Combinatorial features → composed wrappers (Decorator) or plug-in algorithms (Strategy): N features = N classes, not 2ᴺ.
- Composition lets you choose collaborators at construction or runtime; hold them by interface.
- Good uses of inheritance: template method, skeletal classes (`AbstractList`), framework hooks, exceptions, sealed families.
- Design for inheritance (document self-use, no overridable calls in constructors) or prohibit it (`final`, `sealed`).
- Java: one superclass, many interfaces; default methods give stateless mixin-like reuse; conflicts must be overridden.

## Key takeaways {#key-takeaways}

- Inheritance couples a subclass to how its parent works, not just to what it promises; composition couples only to the contract.
- Extending a class to reuse its code makes your class a subtype too, exposing operations that can break your rules.
- Features that vary or combine are best modelled as small composed objects that can be assembled at runtime.
- Inheritance remains the right tool for genuine, substitutable subtypes and for classes designed and documented for extension.
- If a class is not designed for extension, make that explicit with `final` or `sealed`.
