---
summary: Abstraction lets code work with a simple model of a capability — "save this document", "send this notification" — without knowing how it is done underneath. You will learn how to choose what an abstraction exposes and hides, how abstractions leak, and when adding one makes a design worse instead of better.
difficulty: beginner
minutes: 40
objectives:
  - Explain abstraction as separating what a component does from how it does it, and contrast it with encapsulation
  - Design an interface that exposes a capability in domain terms and hides technology details
  - Identify leaky abstractions and fix them with exception translation and domain-level types
  - Decide when an abstraction is premature or wrong, and when duplication is the better choice
  - Keep each function at a single level of abstraction
---

## Introduction

Your program needs to store invoices. Today they go to a folder on disk. Next quarter the team plans to move them to Amazon S3, and the test suite would like them to go nowhere at all so that tests run fast. If the invoice code calls `Files.write(Path.of("/var/invoices/" + id + ".pdf"), bytes)` directly, every one of those changes means editing the invoice code, and the invoice code has to know about paths, folders, buckets and credentials — none of which have anything to do with invoices.

**Abstraction** is the technique of giving the invoice code a simpler thing to depend on: a `DocumentStore` with two operations, `save(key, content)` and `load(key)`. The invoice code knows *what* a document store can do. It does not know *how* — whether bytes go to a disk, a bucket or a `HashMap`. That knowledge lives in the implementations, and swapping one for another does not touch the invoice code.

More generally, an abstraction is a simplified model of something that keeps the details that matter for the task and deliberately drops the rest. Software is built from layers of them. HTTP lets you think in requests and responses instead of TCP segments; TCP lets you think in reliable byte streams instead of lost and reordered IP packets; SQL lets you say which rows you want instead of how to walk a B-tree. Each layer lets the person above it work at the level of the problem they are solving.

For an engineer, abstraction is two skills. The first is *using* abstractions well — knowing what a layer promises and what it hides, so that you are not surprised when the hidden part shows through. The second is *designing* them — choosing boundaries in your own code so that change in one place does not ripple through everything else. This lesson covers both, and it pays particular attention to the second skill's failure modes, because a bad abstraction is often worse than none.

## Before you start

- [[d1-encapsulation]] — abstraction and encapsulation work together, and this lesson contrasts them.
- **Java interfaces and abstract classes** — the syntax is covered in [[c1-interfaces]] and [[c1-abstract-classes]]. Here we use them as design tools.
- **`Optional`** appears in an example; [[c1-optional]] explains it if it is new.

## The intuition

When you drive a car, you use a steering wheel, two or three pedals and a gear selector. You do not think about fuel injection timing, how the brake fluid transmits pressure, or whether the car is petrol, diesel or electric. The controls are an abstraction of "a vehicle you can steer, speed up and slow down", and because the abstraction is the same across cars, you can drive one you have never seen before.

The analogy shows the two properties of a good abstraction. It is **simpler than what it hides** — three pedals instead of an engine management system. And it is **stable while the implementation changes** — the same controls work for engines that are completely different inside.

It also shows where abstractions **leak**. Drive an electric car for the first time and you discover regenerative braking: lifting off the accelerator slows the car much more than you expect. The details the abstraction was supposed to hide have become visible, and you now have to know something about the implementation to drive well. Every abstraction leaks somewhere; good ones leak rarely and in documented ways.

## What, not how

The core move in abstraction is to separate two questions that are easy to mix up:

- **What** does this component do for its callers? This is the abstraction — the contract.
- **How** does it do it? This is the implementation — the mechanism.

Callers should depend only on the answer to the first question. Here is the invoice example as an abstraction:

```java
public interface DocumentStore {
    void save(String key, String content);
    Optional<String> load(String key);
}
```

Read the interface and ask what a caller learns. Documents are identified by a string key; you can save one and later load it; a load may find nothing. That is all. There is no mention of files, buckets, regions, connection pools or retries. The words are about documents because the callers think about documents.

The choice of what to leave out is the actual design work. Suppose we had written `void save(Path folder, String fileName, byte[] content)`. It still looks like an abstraction — it is an interface — but it has decided that storage is a filesystem. An S3 implementation would have to invent fake folders, and an in-memory one would ignore half its parameters. **An abstraction is defined by what it hides, not by the `interface` keyword.**

### Essential and incidental detail

A useful way to decide what belongs in an abstraction is to sort details into two kinds. **Essential** details are part of the problem: an invoice has an amount and a customer; a document has a key and content; a payment can be declined. **Incidental** details come from the solution you happen to have chosen: the SQL dialect, the HTTP client library, the bucket name. Essential details belong in the abstraction. Incidental details belong behind it, because they are the ones most likely to change.

This is not always obvious. Is "a payment may take several seconds" essential? For a checkout page, yes — the user interface needs to show progress — so an honest payment abstraction might return a result asynchronously. Hiding a real characteristic that callers must handle produces an abstraction that looks clean and behaves badly.

## Abstraction and encapsulation

These two ideas are often confused because they usually appear together. They answer different questions.

| | Encapsulation | Abstraction |
|---|---|---|
| Question it answers | Who may change this state, and under what rules? | What do callers need to know to use this? |
| What it hides | An object's fields and representation | How a capability is implemented, often across many classes |
| Typical tool | `private` fields plus methods that enforce invariants | Interfaces, abstract classes, facades, API contracts |
| Failure mode | Callers break the object's rules | Callers have to know the hidden details anyway |

A `BankAccount` with a private balance and a checked `withdraw` method is encapsulated, but it is not much of an abstraction — callers deal with one concrete class. A `PaymentGateway` interface with Stripe and PayPal implementations is an abstraction; each implementation should *also* be encapsulated, keeping its API keys and retry state private. Good designs use both: abstraction to choose the boundary, encapsulation to guard what is behind it.

## The tools of abstraction

Abstraction is not tied to one language feature. These are the common forms you will design and meet:

| Form | What it hides | Example |
|---|---|---|
| Interface | Which implementation runs, and how | `DocumentStore`, `PaymentGateway`, `java.util.List` |
| Abstract class | The varying steps of a fixed algorithm | A report exporter whose `export` method is fixed but whose `write` step varies |
| Facade | A whole subsystem behind one entry point | A `CheckoutFacade` coordinating inventory, tax and payment — see [[d2-facade]] |
| Function with a good name | A sequence of steps | `applyLoyaltyDiscount(cart)` |
| Module or package boundary | Internal classes and structure | A `billing` package exposing one public service |
| Network API | Services, databases and topology behind it | `GET /users/{id}` — see [[d6-api-foundations]] |

The humblest one, a well-named function, is the one you use most. `applyLoyaltyDiscount(cart)` lets the reader skip twelve lines of arithmetic until they actually care. If a reader has to open a method to understand what it does, its name has failed as an abstraction.

The interface-versus-abstract-class decision is covered in [[d1-interfaces]]. The short version: an interface states a contract with no shared state; an abstract class is for when implementations share a fixed skeleton or real code.

## Worked example: one service, interchangeable stores

The program below defines a `DocumentStore` abstraction, two implementations, and an `InvoiceService` that depends only on the abstraction. One implementation simulates a remote store that sometimes fails, to show how an abstraction should report errors.

```java title="AbstractionDemo.java"
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class AbstractionDemo {

    /** What callers need: save and load documents by key. Nothing about where. */
    interface DocumentStore {
        void save(String key, String content);
        Optional<String> load(String key);
    }

    /** One error type for every store, so callers never see IOException or SDK errors. */
    static final class StorageException extends RuntimeException {
        StorageException(String message, Throwable cause) { super(message, cause); }
    }

    static final class InMemoryStore implements DocumentStore {
        private final Map<String, String> data = new HashMap<>();
        public void save(String key, String content) { data.put(key, content); }
        public Optional<String> load(String key) { return Optional.ofNullable(data.get(key)); }
    }

    /** Stands in for a network store; uploads to keys under "tmp/" fail. */
    static final class RemoteStore implements DocumentStore {
        private final Map<String, String> remote = new HashMap<>();

        public void save(String key, String content) {
            try {
                upload(key, content);
            } catch (IOException e) {
                // Translate the transport error into the abstraction's own vocabulary.
                throw new StorageException("could not save " + key, e);
            }
        }

        public Optional<String> load(String key) { return Optional.ofNullable(remote.get(key)); }

        private void upload(String key, String content) throws IOException {
            if (key.startsWith("tmp/")) throw new IOException("connection reset");
            remote.put(key, content);
        }
    }

    static final class InvoiceService {
        private final DocumentStore store;

        InvoiceService(DocumentStore store) { this.store = store; }

        String issue(String folder, String customer, long amountCents) {
            String key = folder + "/" + customer;
            store.save(key, customer + " owes " + amountCents + " cents");
            return key;
        }

        String show(String key) { return store.load(key).orElse("(no such invoice)"); }
    }

    public static void main(String[] args) {
        for (DocumentStore store : new DocumentStore[] { new InMemoryStore(), new RemoteStore() }) {
            InvoiceService invoices = new InvoiceService(store);
            String key = invoices.issue("invoices", "acme", 12_500);
            System.out.println(store.getClass().getSimpleName() + ": " + invoices.show(key));
        }

        InvoiceService remote = new InvoiceService(new RemoteStore());
        try {
            remote.issue("tmp", "acme", 1);
        } catch (StorageException e) {
            System.out.println("failed: " + e.getMessage() + " (cause: " + e.getCause().getMessage() + ")");
        }
        System.out.println(remote.show("invoices/nobody"));
    }
}
```

```output
InMemoryStore: acme owes 12500 cents
RemoteStore: acme owes 12500 cents
failed: could not save tmp/acme (cause: connection reset)
(no such invoice)
```

Start with `InvoiceService`. Its constructor receives a `DocumentStore`, and nothing in the class names a concrete store. The loop in `main` hands it two completely different implementations and gets the same behaviour, which is the practical meaning of "depend on what, not how". In production the same service would be wired with an S3-backed store; in a unit test it gets the in-memory one and runs in microseconds.

Now look at error handling, because this is where most abstractions quietly fail. `RemoteStore.upload` throws `IOException`, a detail of how it talks to the network. If `save` let that propagate (or declared `throws IOException` on the interface), every caller of `DocumentStore` would have to handle network errors — including callers using the in-memory store, which has no network. Instead, `save` catches the low-level exception and throws `StorageException`, an error that belongs to the abstraction's vocabulary. The original exception is kept as the **cause**, so nothing is lost for debugging. This technique is called **exception translation**, and Spring applies it to databases: repository code throws Spring's `DataAccessException` hierarchy rather than raw JDBC `SQLException`s.

Finally, `load` returns `Optional<String>` rather than `null` or a thrown exception for a missing key. "The document might not exist" is an essential fact about document stores, so the abstraction states it in its return type, and `show` handles it with `orElse`.

```mermaid title="InvoiceService depends on the abstraction, never on an implementation"
flowchart TB
    S["InvoiceService"] --> I["DocumentStore (interface)"]
    M["InMemoryStore"] -. implements .-> I
    R["RemoteStore"] -. implements .-> I
    R --> N["network SDK, IOException"]
```

## Leaky abstractions

In 2002 Joel Spolsky named a rule every engineer eventually discovers: all non-trivial abstractions leak to some degree. A **leaky abstraction** is one whose hidden details affect callers anyway, so that using it correctly requires knowing what it was supposed to hide.

Some leaks are unavoidable because they come from physics or from real failure modes. A remote call can be slow or fail; a "simple" ORM call such as `order.getItems()` can trigger a separate SQL query for every order (the N+1 query problem); a file write can fail because the disk is full. You cannot design these away. What you can do is make them visible in the abstraction's contract — document them, model them in return types, give them domain-level exceptions — so that callers handle them deliberately.

Other leaks are design mistakes, and these you can fix:

- **Technology types in the signature.** A repository interface whose methods throw `SQLException` or return a JDBC `ResultSet` has tied every caller to relational databases. Return domain objects and throw domain exceptions.
- **Implementation details in identifiers.** A storage API that returns full S3 URLs makes callers parse bucket names. Return an opaque key or your own `DocumentId` type.
- **Raw low-level errors reaching users.** An HTTP endpoint that returns a stack trace containing a SQL error leaks both the implementation and, often, sensitive information. Translate at each boundary.
- **Required call order nobody mentions.** If `init()` must be called before `send()`, the abstraction either does it itself or makes it impossible to forget — for example, by requiring everything in the constructor.

> [!TIP] A quick leak test
> Imagine replacing the implementation with a completely different technology. List everything callers would need to change. Each item is a leak; decide whether it is essential (keep it, but document it) or incidental (move it behind the boundary).

## When abstraction makes things worse

Abstraction has a cost: every layer is one more place a reader must look and one more thing that can be wrong. Three failure modes are common enough to name.

**Premature abstraction.** A developer creates `NotificationChannel`, `NotificationChannelFactory` and `AbstractNotificationChannel` while the system sends exactly one kind of email. The abstraction is shaped by guesses about future needs, and when the real second channel arrives — push notifications, which need device tokens and silent delivery — it does not fit the guess. A widely used heuristic is the **rule of three**: write the code concretely the first time, notice the duplication the second time, and extract an abstraction when the third case shows you what actually varies.

**The wrong abstraction.** Two pieces of code look similar, so someone merges them into one shared function. Later each caller needs something slightly different, and each change adds a parameter or a flag: `formatReport(data, true, false, null, "legacy")`. The function now serves nobody well, and every caller depends on every other caller's special case. Sandi Metz's well-known advice applies: duplication is far cheaper than the wrong abstraction. When an abstraction has become a pile of conditionals, the fix is often to inline it back into its callers and let the real shared shape reappear.

**Too many layers.** A request goes from controller to facade to service to manager to helper to repository, each layer passing the call to the next with no added meaning. Debugging means stepping through six files to find the one line that does something. A layer earns its place by hiding something — a decision, a technology, a rule. A layer that only forwards calls hides nothing.

None of this means abstractions should be avoided. It means they should be introduced when there is a reason: a second real implementation, a boundary to an external system, a test that needs a substitute, or a team boundary where a stable contract lets two groups work independently.

```quiz
Q: A `UserRepository` interface declares `User findById(long id) throws SQLException`. What is the main design problem?
- [ ] The method should be static
- [x] The signature leaks a relational-database detail, so every caller is tied to SQL even if the implementation changes
- [ ] Interfaces cannot declare checked exceptions
- [ ] `long` is too small for user IDs
> Callers must now handle SQLException, and a MongoDB or in-memory implementation would have to fake one. The fix is to throw a domain-level exception (or return an Optional) and translate SQL errors inside the implementation. Interfaces can declare checked exceptions; that is what makes the leak possible.

Q: Two methods share eight similar lines. A teammate merges them into one helper with three boolean flags to handle the differences. What is the most likely long-term result?
- [ ] Easier maintenance, because the code exists only once
- [x] A "wrong abstraction" that every caller depends on and that grows a new flag for each new difference
- [ ] Better performance from less duplicated code
- [ ] No effect either way
> Flags signal that the callers do not actually share one concept. Every new difference adds another branch, and a change for one caller risks breaking the others. Keeping the duplication until the real shared shape is clear is often cheaper.
```

## A single level of abstraction

Abstraction also applies inside a single method. Read this:

```java
public void placeOrder(Cart cart) {
    validate(cart);
    Money total = pricing.totalFor(cart);
    String sql = "INSERT INTO orders (customer_id, total_cents) VALUES (?, ?)";
    try (PreparedStatement ps = connection.prepareStatement(sql)) {
        ps.setLong(1, cart.customerId());
        ps.setLong(2, total.cents());
        ps.executeUpdate();
    } catch (SQLException e) {
        throw new StorageException("could not save order", e);
    }
    notifier.orderPlaced(cart.customerId());
}
```

The first two lines and the last line speak in business terms. The middle switches abruptly to SQL strings, parameter indexes and JDBC exceptions. A reader has to change mental gears twice to follow one method. The guideline called **single level of abstraction** says that the statements in a function should all be at the same level of detail. The fix is to move the middle into `orders.save(order)`, so `placeOrder` reads as four business steps, and the SQL lives in a repository where SQL is the expected level of detail.

This is the same skill as designing interfaces, at a smaller scale: decide what the reader of this code needs to know, and push everything else one level down.

## In real systems

**Database access.** Spring Data's repository interfaces let service code call `orders.findByCustomerId(id)` without writing SQL, and JDBC itself is an abstraction that lets the same code talk to PostgreSQL or MySQL through different drivers. Both leak: query performance, transaction boundaries and lazy loading still matter, which is why experienced engineers learn what SQL their ORM produces.

**Third-party providers.** Payment, email, SMS and storage providers are classic abstraction points. Wrapping Stripe behind a `PaymentGateway` means that adding a second provider for a new country, or replacing one, touches one adapter instead of every service that takes payments. The adapter pattern, [[d2-adapter]], is how the provider's API is translated to yours.

**Cloud and infrastructure.** Containers abstract the machine, Kubernetes abstracts the cluster, and managed databases abstract the server. Each one simplifies the common case and leaks in the hard cases — network partitions, noisy neighbours, failover behaviour — which is why system design interviews probe what happens when the layer below misbehaves.

**Observability across boundaries.** Every abstraction boundary is a place where context can be lost. Production systems pass correlation or trace IDs through each layer so that a failure deep inside an implementation can be traced back to the request that caused it.

## Trade-offs and alternatives

Abstraction reduces what callers must understand, lets implementations change and be tested in isolation, and lets teams work in parallel behind a stable contract. It costs indirection, extra types and the risk of choosing the wrong boundary.

Use an abstraction when there is a real reason: more than one implementation now (or a test double), an external system whose details you want to contain, or a boundary between teams or modules. Prefer concrete code when there is one stable implementation, the code is short-lived, or you cannot yet tell what will vary. Simple alternatives often suffice: a well-named function instead of an interface, a configuration value instead of a class hierarchy, or a single-method functional interface (a lambda) instead of a named strategy type.

The performance cost of an interface call in Java is negligible in almost all code — the JIT compiler inlines calls when only one or two implementations are in use at a call site — so do not avoid abstraction for speed without measuring. The real cost is in human understanding.

## Common mistakes

**Equating abstraction with the `interface` keyword.** An interface that mirrors one class method-for-method, including its technology choices, abstracts nothing. Design the interface from what callers need.

**Naming abstractions after technology.** `S3Uploader` as the interface name ties the abstraction to S3. Name it after the capability (`DocumentStore`) and put the technology in the implementation's name (`S3DocumentStore`).

**Letting low-level exceptions escape.** Translate errors at the boundary into the abstraction's own vocabulary, keeping the original as the cause.

> [!MISTAKE] Abstracting before the variation exists
> An interface with one implementation "for the future", a factory for one class, a base class with one subclass — each adds a layer readers must navigate and usually guesses wrong about what will vary. Introduce the abstraction when the second case, a test double or a real boundary gives you evidence. The exception is a genuine boundary to an external system, which is worth abstracting from the start.

**Mixing levels in one function.** Business steps and low-level mechanics in the same method make both harder to read. Push the mechanics down a level.

## Interview perspective

Interviewers use abstraction questions to see whether you can explain design reasoning, not just vocabulary.

> [!INTERVIEW] Abstraction versus encapsulation in one breath
> "Abstraction decides what callers see — a `PaymentGateway` with `charge` and `refund`, regardless of provider. Encapsulation protects what is behind it — each gateway keeps its API key and retry state private and enforces its own rules. One chooses the boundary; the other guards it."

Questions to prepare:

- **What is abstraction?** Exposing what a component does while hiding how, so callers work at the level of their problem. Give a concrete swap story: storage moved from disk to S3 without touching business code.
- **Give an example of a leaky abstraction.** ORM lazy loading causing N+1 queries; a storage API returning raw S3 URLs; a repository throwing `SQLException`. Then say how you would fix or document it.
- **When is abstraction harmful?** When it is premature, wrong (a pile of flags), or adds layers that hide nothing.
- **When would you introduce an interface?** A second implementation, a test double, an external system, or a team boundary.
- **How does abstraction relate to Dependency Inversion?** High-level policy should depend on abstractions, and the abstractions should be shaped by the high-level code's needs, not by the low-level details. See [[d1-solid]].

## Practice

1. **Find the leaks.** Write down the interface of a `FileUploader` that takes a `java.io.File` and returns an S3 URL. List every implementation detail it exposes and redesign it in domain terms.
2. **Translate errors.** Add a `delete(String key)` operation to `DocumentStore`. Decide what it should do for a missing key, and implement exception translation for a simulated network failure.
3. **Undo a wrong abstraction.** Given a `send(String to, String body, boolean isSms, boolean isUrgent, String templateId)` method, describe how you would split it into honest abstractions, and what the callers would look like afterwards.
4. **Level check.** Take a 40-line method from a project you know and rewrite it so that the top-level method reads as five or fewer steps at the same level of detail.

## Quick revision {#quick-revision}

- Abstraction = depend on *what* a component does, not *how*; hide incidental detail, keep essential detail.
- An abstraction is defined by what it hides, not by using `interface`.
- Encapsulation guards an object's state; abstraction chooses the boundary callers see. Good designs use both.
- Tools: interfaces, abstract classes, facades, well-named functions, package boundaries, network APIs.
- All non-trivial abstractions leak; make unavoidable leaks explicit (types, docs, domain exceptions), remove avoidable ones.
- Exception translation: catch low-level errors at the boundary, throw a domain error, keep the cause.
- Harmful abstraction: premature, wrong (flags piling up), or layers that only forward calls.
- Rule of three; duplication is cheaper than the wrong abstraction.
- Single level of abstraction: each function's statements at the same level of detail.
- Name abstractions by capability (`DocumentStore`), implementations by technology (`S3DocumentStore`).

## Key takeaways {#key-takeaways}

- Abstraction lets callers think in terms of their problem by hiding how a capability is provided.
- The design work is choosing what to hide; technology details that may change belong behind the boundary.
- Abstractions leak, so state the essential limitations in the contract and translate low-level errors at the boundary.
- Add an abstraction when you have evidence for it — a second implementation, a test double, an external system or a team boundary.
- A wrong abstraction is worse than duplication; when flags pile up, consider inlining and starting again.
- Apply the same thinking inside functions by keeping each one at a single level of detail.
