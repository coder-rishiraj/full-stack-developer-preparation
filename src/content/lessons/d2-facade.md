---
summary: Facade gives clients one simple entry point to a subsystem made of many cooperating classes, so a multi-step workflow such as checkout is written once instead of being re-assembled by every caller. You will learn how to design a facade's methods, keep it a thin coordinator rather than a god class, handle partial failure inside it, and tell it apart from Adapter, Mediator, Proxy and an API gateway.
difficulty: intermediate
minutes: 45
objectives:
  - Explain the coupling problem Facade solves and what a facade does and does not hide
  - Implement a facade that sequences several subsystem classes behind one use-case method
  - Design facade methods around client tasks and keep business rules in the subsystem, not the facade
  - Handle partial failure in a facade with compensation, transaction boundaries and idempotency
  - Compare Facade with Adapter, Mediator, Proxy and an API gateway, and recognise facades in real libraries
---

## Introduction

An online shop's checkout touches six parts of the system. The inventory service must reserve the items. The pricing component works out the subtotal, and the tax calculator adds tax for the customer's country. The payment gateway charges the card. The shipping service creates a label, and the notifier sends a confirmation email. Each of these is a reasonable, focused class.

Now look at who calls them. The web controller performs checkout. So does the mobile API, and so does a batch job that retries abandoned carts. Each caller has to know all six classes, call them in the right order, pass the right values between them, and remember that if payment fails the reservation must be released. When the shop adds fraud screening between pricing and payment, all three callers have to change, and one of them will be forgotten.

The **Facade** pattern fixes this by putting one class in front of the subsystem with a method shaped like the task the client wants done:

```java
CheckoutResult result = checkout.checkout(cart);
```

Behind that call, the facade talks to inventory, pricing, tax, payment, shipping and notifications in the correct order. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes Facade as providing a unified interface to a set of interfaces in a subsystem — a higher-level interface that makes the subsystem easier to use.

Facade is the most common structural pattern in everyday backend code, often without the name. A Spring `@Service` called `CheckoutService` that a controller calls is usually a facade. So is the "application service" or "use case" class of layered and Domain-Driven Design (DDD) architectures, and so is a library's convenience class that hides a dozen lower-level types. Learning the pattern by name helps you design those classes well — in particular, keeping them thin and handling failure properly.

## Before you start

- **Encapsulation** — a facade hides how a task is carried out behind a small public surface. See [[d1-encapsulation]].
- **Coupling and cohesion** — the facade's main job is to reduce how many classes each client depends on. See [[d1-coupling-cohesion]].
- **Abstraction and interfaces** — the facade offers a higher-level abstraction than the classes it uses. See [[d1-abstraction]] and [[c1-interfaces]].
- **Single Responsibility** from [[d1-solid]] — useful for judging when a facade has started doing too much.

## The intuition

Think of a hotel concierge. You ask for "dinner for two at eight and tickets to the show afterwards". The concierge phones the restaurant, books the theatre, arranges a taxi and puts everything on your room bill. You talk to one person with one request; the concierge knows which departments to contact and in which order. The restaurant and the theatre do not know or care that a concierge exists — they would take a booking from anyone.

That maps closely onto the pattern. The **client** is the guest. The **facade** is the concierge. The **subsystem** is the set of departments that do the real work. The concierge coordinates but does not cook the dinner or perform the show.

Two details of the analogy are worth keeping. First, a guest who wants something unusual can still phone the restaurant directly; the concierge is a convenience, not a locked door. A facade is the same — it simplifies the common path and usually leaves the subsystem available to callers who need finer control. Second, a concierge who started deciding the restaurant's menu would be overstepping. A facade that starts making the subsystem's decisions has stopped being a facade, as you will see.

## The structure

```mermaid title="Facade: clients call one class, which coordinates the subsystem"
flowchart LR
    Web["Web controller"] --> F["CheckoutFacade"]
    Mobile["Mobile API"] --> F
    Job["Retry job"] --> F
    F --> Inv["Inventory"]
    F --> Pri["Pricing"]
    F --> Tax["TaxCalculator"]
    F --> Pay["PaymentGateway"]
    F --> Shp["Shipping"]
    F --> Ntf["Notifier"]
```

There are three roles:

- The **facade** (`CheckoutFacade`) offers a small number of task-shaped methods. It holds references to the subsystem objects it needs and implements each method by calling them in order.
- The **subsystem classes** do the actual work. They have no reference to the facade, which means they can be tested, reused and changed without it.
- The **clients** call the facade instead of the subsystem. Each client now depends on one class rather than six.

The dependency arrows only point one way: clients know the facade, the facade knows the subsystem, and nothing points back. That one-way direction is what makes the pattern safe to add to an existing codebase — introducing a facade does not require changing any subsystem class.

Count the dependencies to see the benefit. Without the facade, three clients each depend on six classes: eighteen dependencies, each one a place that breaks when the checkout sequence changes. With the facade, there are three dependencies on the facade and six from the facade to the subsystem. More importantly, the *sequence* — which step comes first and what to do when one fails — now lives in exactly one place.

## A checkout facade, step by step

The program below builds a small checkout subsystem and a facade over it. The subsystem classes are deliberately simple stand-ins for real services, but the facade is written the way you would write a real one: it sequences the steps, converts between the subsystem's types and the client's result type, and undoes earlier work when a later step fails.

```java title="CheckoutDemo.java"
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CheckoutDemo {

    record Line(String sku, int qty, long unitCents) {}
    record Cart(String customerId, String country, List<Line> lines) {}
    record CheckoutResult(boolean ok, String message) {}

    // ---- Subsystem: each class knows nothing about the facade ----

    static final class Inventory {
        private final Map<String, Integer> stock = new HashMap<>(Map.of("MUG", 5, "TEE", 1));

        void reserve(List<Line> lines) {
            for (Line l : lines) {
                if (stock.getOrDefault(l.sku(), 0) < l.qty()) {
                    throw new IllegalStateException("out of stock: " + l.sku());
                }
            }
            lines.forEach(l -> stock.merge(l.sku(), -l.qty(), Integer::sum));
            System.out.println("  inventory: reserved " + lines.size() + " line(s)");
        }

        void release(List<Line> lines) {
            lines.forEach(l -> stock.merge(l.sku(), l.qty(), Integer::sum));
            System.out.println("  inventory: released reservation");
        }

        int available(String sku) { return stock.getOrDefault(sku, 0); }
    }

    static final class Pricing {
        long subtotalCents(List<Line> lines) {
            return lines.stream().mapToLong(l -> l.qty() * l.unitCents()).sum();
        }
    }

    static final class TaxCalculator {
        long taxCents(long subtotalCents, String country) {
            int ratePercent = country.equals("DE") ? 19 : 0;   // toy rule for the demo
            return subtotalCents * ratePercent / 100;
        }
    }

    static final class PaymentGateway {
        void charge(String customerId, long amountCents) {
            if (customerId.startsWith("blocked")) {
                throw new IllegalStateException("card declined");
            }
            System.out.println("  payment: charged " + amountCents + " cents");
        }
    }

    static final class Shipping {
        void schedule(String customerId, List<Line> lines) {
            System.out.println("  shipping: label created for " + customerId);
        }
    }

    static final class Notifier {
        void orderConfirmed(String customerId, long totalCents) {
            System.out.println("  email: order confirmed, total " + totalCents);
        }
    }

    // ---- The facade: one use-case method that sequences the subsystem ----

    static final class CheckoutFacade {
        private final Inventory inventory;
        private final Pricing pricing;
        private final TaxCalculator tax;
        private final PaymentGateway payments;
        private final Shipping shipping;
        private final Notifier notifier;

        CheckoutFacade(Inventory inventory, Pricing pricing, TaxCalculator tax,
                       PaymentGateway payments, Shipping shipping, Notifier notifier) {
            this.inventory = inventory;
            this.pricing = pricing;
            this.tax = tax;
            this.payments = payments;
            this.shipping = shipping;
            this.notifier = notifier;
        }

        CheckoutResult checkout(Cart cart) {
            try {
                inventory.reserve(cart.lines());
            } catch (IllegalStateException e) {
                return new CheckoutResult(false, e.getMessage());
            }
            long subtotal = pricing.subtotalCents(cart.lines());
            long total = subtotal + tax.taxCents(subtotal, cart.country());
            try {
                payments.charge(cart.customerId(), total);
            } catch (IllegalStateException e) {
                inventory.release(cart.lines());          // undo the step that succeeded
                return new CheckoutResult(false, e.getMessage());
            }
            shipping.schedule(cart.customerId(), cart.lines());
            notifier.orderConfirmed(cart.customerId(), total);
            return new CheckoutResult(true, "total " + total);
        }
    }

    public static void main(String[] args) {
        Inventory inventory = new Inventory();
        CheckoutFacade checkout = new CheckoutFacade(inventory, new Pricing(),
                new TaxCalculator(), new PaymentGateway(), new Shipping(), new Notifier());

        List<Line> twoMugs = List.of(new Line("MUG", 2, 1_200));

        System.out.println("alice:");
        System.out.println("  -> " + checkout.checkout(new Cart("alice", "DE", twoMugs)));

        System.out.println("blocked-bob:");
        System.out.println("  -> " + checkout.checkout(new Cart("blocked-bob", "US", twoMugs)));

        System.out.println("carol:");
        System.out.println("  -> " + checkout.checkout(
                new Cart("carol", "US", List.of(new Line("TEE", 3, 2_000)))));

        System.out.println("mugs left: " + inventory.available("MUG"));
    }
}
```

```output
alice:
  inventory: reserved 1 line(s)
  payment: charged 2856 cents
  shipping: label created for alice
  email: order confirmed, total 2856
  -> CheckoutResult[ok=true, message=total 2856]
blocked-bob:
  inventory: reserved 1 line(s)
  inventory: released reservation
  -> CheckoutResult[ok=false, message=card declined]
carol:
  -> CheckoutResult[ok=false, message=out of stock: TEE]
mugs left: 3
```

Walk through the three checkouts.

**Alice** follows the happy path. The facade reserves two mugs, asks `Pricing` for the subtotal (2 × 1,200 = 2,400 cents), asks `TaxCalculator` for German tax (19% of 2,400 = 456), charges 2,856 cents, schedules shipping and sends the email. The client wrote one line; the facade made six calls in a fixed order.

**Bob's** card is declined. By the time payment fails, the inventory reservation has already succeeded, so leaving things as they are would lock two mugs that nobody is buying. The facade catches the failure, calls `inventory.release(...)` to undo the earlier step, and returns a failed result. This is the most valuable thing the facade does: the rule "if payment fails, release the stock" is written once instead of in every client.

**Carol** asks for three T-shirts when only one is in stock. The first step fails, nothing else runs, and there is nothing to undo.

The final line confirms the bookkeeping. Five mugs were in stock, Alice bought two, and Bob's two were reserved and then released, leaving three.

Notice what the facade does *not* do. It does not decide the tax rate, compute the subtotal, or check stock levels itself — each of those is a subsystem decision. The facade only knows the *order* of the steps, how to pass values between them, and what to do when one fails. That restraint is what keeps a facade useful as the system grows.

```quiz
Q: In the checkout facade, why is the call to `inventory.release(...)` placed in the facade rather than inside `PaymentGateway`?
- [ ] Because `PaymentGateway` cannot call methods on other classes in Java
- [x] Because the facade owns the sequence of steps, so it is the only class that knows a reservation was made before payment
- [ ] Because releasing stock is a tax calculation and belongs with pricing
- [ ] Because facades must catch every exception in the system
> The payment gateway should know only about charging cards; it has no idea that a reservation came first, and coupling it to inventory would make it harder to reuse. The facade is the class that put the steps in order, so it is the natural place to undo earlier steps when a later one fails.
```

## Designing the facade's interface

A facade is only as good as its methods. A few design principles make the difference between a facade that simplifies and one that merely moves code around.

**Shape methods around client tasks, not subsystem calls.** `checkout(cart)`, `cancelOrder(orderId)` and `refund(orderId, amount)` are tasks a client wants done. Methods such as `reserveThenPrice(cart)` or `chargeAndShip(...)` leak the subsystem's internal steps into the facade's names, and every change to those steps becomes a change to the facade's interface. A good test: could a product manager describe what the method does without mentioning any class behind it?

**Accept and return the client's types.** The facade above takes a `Cart` and returns a `CheckoutResult`. It does not return the payment gateway's transaction object or the inventory service's reservation record. If it did, clients would start depending on those subsystem types, and the coupling the facade was meant to remove would come back through the return values. Converting to and from simple data types — often records called Data Transfer Objects (DTOs) — is a normal part of a facade's job.

**Expose the common path and leave the rest reachable.** A facade usually does not try to support every option of every subsystem class. If a rare client needs to reserve stock without charging — say, an internal tool for holding items for a photo shoot — it can call `Inventory` directly. The GoF book is explicit that a facade does not prevent direct use of the subsystem. Whether you *allow* it is an architectural choice: in a modular monolith you might make the subsystem classes package-private so the facade is the module's only public entry point, which turns the facade into an enforced boundary.

**One facade per audience if needs differ.** A storefront checkout facade, an admin order-management facade and a warehouse fulfilment facade may all use the same subsystem. Splitting them by audience keeps each one small and stops one client's needs from complicating everyone else's interface.

**Receive the subsystem through the constructor.** The facade above is given its six collaborators rather than creating them with `new`. That lets a dependency-injection container such as Spring wire it (see [[c5-ioc]]) and lets tests substitute fakes.

## Thin coordinator, not a god class

The most common way a facade goes wrong is by slowly absorbing the subsystem's decisions. It starts as a coordinator. Then someone adds "orders over 50 euros ship free" directly to `checkout`, because that was the easiest place. Then a loyalty discount, then a fraud rule, then a special case for one country. Two years later, the facade has 1,500 lines, every feature touches it, and the subsystem classes are anaemic shells that the facade reaches into. This is a **god class** — one class that knows and decides too much — and it is the opposite of what Facade was for.

The guard against it is a clear rule about what belongs where:

| Belongs in the facade | Belongs in the subsystem |
|---|---|
| The order of steps in a workflow | Calculating prices, discounts and tax |
| Passing data between steps and converting types | Validating domain rules ("quantity must be positive") |
| Undoing earlier steps when a later one fails | Deciding whether shipping is free |
| Starting and ending a transaction | Fraud scoring |
| Logging, metrics and tracing for the whole task | Stock-level checks |

When a new rule arrives, ask whether it is a decision about the domain or about the sequence. "Free shipping over 50 euros" is a domain decision — it belongs in `Pricing` or `Shipping`, where it can be tested on its own and reused by any other caller. "Run fraud screening after pricing and before payment" is a sequence decision — that line belongs in the facade, while the screening logic itself lives in a `FraudScreening` class.

A useful warning sign is the facade's dependency list. A facade that needs fifteen collaborators is probably serving several unrelated tasks and should be split, either by audience as described above or by grouping steps into smaller facades that a top-level facade composes.

## Failure handling and transaction boundaries

Because a facade sequences several steps, it is the natural owner of the question "what happens if step four fails after steps one to three succeeded?". The worked example handled one case by hand. Real systems have three tools, and which one fits depends on where the steps run.

**Local transactions.** If every step writes to the same database, the facade method can be the transaction boundary: in Spring, annotate it with `@Transactional`, and a failure in any step rolls back all the writes together. This is one reason the application-service layer is the conventional home for `@Transactional` — it is the layer that knows where a business operation begins and ends. See [[c8-transactional-boundaries]].

**Compensation.** Remote calls — a card charge at a payment provider, a label from a shipping company — cannot be rolled back by your database. If payment succeeds and shipping then fails, the facade must run a **compensating action**: refund the charge, release the stock. Compensation is not a true undo — the customer may see a charge and a refund on their statement — so the facade should order steps to make compensation rare, typically doing cheap, reversible steps (reserving stock) before expensive, hard-to-reverse ones (charging money). When a workflow spans several services and must survive crashes halfway through, the facade's sequence becomes a **saga**, usually run by a workflow engine. See [[d4-compensation]] and [[d4-saga]].

**Idempotency.** Clients retry. A mobile app that loses its connection after tapping "Pay" will send the checkout again, and a facade that blindly repeats every step will charge the customer twice. The usual fix is an **idempotency key**: the client sends a unique ID with the request, and the facade records the outcome under that key so a repeated request returns the stored result instead of running the workflow again. See [[c12-idempotency]].

> [!WARNING] A facade that hides failure is worse than no facade
> Returning `ok=true` because "most steps worked", or swallowing an exception from the email step without recording it, leaves the system in a state nobody can see. Decide for each step whether its failure aborts the task (payment), triggers compensation (shipping after payment), or is acceptable and retried later (the confirmation email) — and make that decision visible in code and logs.

## Testing a facade

A facade has two kinds of logic worth testing: the sequence of calls and the failure handling. The subsystem classes should be tested separately; the facade's tests should not re-check tax arithmetic.

The simplest approach is to construct the facade with **fakes** — small in-memory implementations of the subsystem's interfaces, like the ones in the example — and assert on outcomes: after a declined payment, stock is back to its original level and no email was sent. Mocking libraries such as Mockito can verify call order directly, but tests that assert on exact call sequences break whenever the sequence legitimately changes, so prefer asserting on observable results where you can.

If a facade needs a dozen mocks to test, that is design feedback, not a testing problem: the facade is coordinating too many things and should be split.

## In real systems

**Application services.** In a layered Spring application, controllers call services, and services coordinate repositories, domain objects and clients for other systems. A service method such as `placeOrder` is a facade over the domain and infrastructure, and it is where transactions, authorisation checks and tracing for the use case usually live. DDD calls the same thing an application service; hexagonal architecture calls its methods use cases.

**Logging.** SLF4J — the Simple Logging Facade for Java — gives application code one small API, `LoggerFactory.getLogger(...)` and `log.info(...)`, while the actual logging is done by a backend such as Logback or Log4j 2 that is chosen at deployment time. Since SLF4J 2.0 the backend is discovered through Java's `ServiceLoader`. Your code never refers to the backend's classes, so switching backends does not change it. See [[c6-logging-facade-backend]].

**Library convenience APIs.** Many libraries expose a small "front door" class over a large set of lower-level types. Spring's `JdbcTemplate`, for example, hides connection handling, statement creation, exception translation and resource cleanup behind methods such as `query` and `update`. Java's `java.net.http.HttpClient` offers `send` over connection pooling, protocol negotiation and redirects. These are facades in spirit even when the library documentation does not use the word.

**Migrating legacy systems.** Wrapping an old subsystem in a facade gives new code a clean interface to depend on. Later, the implementation behind the facade can be replaced piece by piece without changing its clients. This is the code-level version of the strangler approach described in [[d7-strangler-migration]].

**At the system level.** An API gateway or a Backend-for-Frontend (BFF) service that combines several microservice calls into one response for a mobile app plays a facade-like role across the network. It also takes on concerns a class-level facade does not — authentication, rate limiting, routing — so treat the resemblance as an analogy rather than an identity. See [[d6-api-edge]].

## Facade compared with similar patterns

| Pattern | What it wraps | Interface it offers | Purpose |
|---|---|---|---|
| Facade | Many classes in a subsystem | A new, simpler, task-level interface | Make a subsystem easy to use; reduce client coupling |
| [[d2-adapter]] | Usually one class | The interface a client already expects | Make an incompatible interface fit |
| [[d2-proxy]] | One object | The same interface as that object | Control access to it (lazy loading, security, remote calls) |
| [[d2-decorator]] | One object | The same interface as that object | Add behaviour around it |
| Mediator | Peer objects that talk to each other | Peers talk to the mediator instead | Remove many-to-many links between collaborating objects |

**Facade versus Adapter** is the most frequently asked comparison. Both wrap existing code, but an adapter *converts* one interface into another one that a client already depends on, while a facade *defines a new, simpler* interface over many classes. A practical tell: an adapter is written to satisfy an interface that existed before it; a facade's interface is invented for the facade. A facade may use adapters internally — wrapping a vendor's payment SDK in an adapter, then calling that adapter from the checkout facade.

```quiz
Q: A team wraps a vendor's payment SDK in a class that implements their existing `PaymentGateway` interface, translating `charge(order)` into the SDK's `createIntent` and `confirm` calls. Which pattern is this?
- [ ] Facade, because it hides the SDK's details
- [x] Adapter, because it makes one class fit an interface the client already depends on
- [ ] Proxy, because it has the same interface as the SDK
- [ ] Mediator, because it sits between two objects
> The class exists to satisfy an interface that existed before it — `PaymentGateway` — by translating calls to one incompatible class. That is the definition of an adapter. A facade would invent a new, simpler interface over several classes. It is not a proxy, because its interface differs from the SDK's.
```

**Facade versus Mediator** is subtler. A mediator sits between objects that would otherwise call each other — for example, form widgets that enable and disable one another — and those objects know the mediator and send it messages. Communication is two-way. In a facade, the subsystem does not know the facade exists, and calls flow in one direction only, from client to facade to subsystem.

## Trade-offs and alternatives

A facade reduces the number of classes each client must understand, puts each workflow's sequence and failure handling in one place, documents the common use cases of a subsystem as named methods, and lets the subsystem change behind a stable interface. It is cheap to add because nothing in the subsystem has to change.

The costs are real but manageable. A facade is another layer to read through. It can grow into a god class if business rules leak into it. It can hide capabilities that some clients need, pushing them either to bypass it or to request ever more facade methods. And a facade with a very wide interface simplifies nothing — it is the subsystem again with one more indirection.

Alternatives and neighbours:

- **Calling the subsystem directly** is fine when there is one caller and the workflow is two steps long. Introduce a facade when a sequence is repeated or failure handling becomes non-trivial.
- **A workflow engine** (such as Temporal or Camunda) suits long-running processes that span hours or days, need durable state and retries, and must survive restarts — a facade method is the wrong tool for a process that waits three days for a warehouse.
- **Domain events** can decouple steps that do not need to happen synchronously: the facade completes the core transaction and publishes `OrderPlaced`, and the email and analytics handlers react on their own. See [[d2-observer]].

## Common mistakes

> [!MISTAKE] Putting business rules in the facade
> Discount logic, validation and eligibility checks written inside facade methods cannot be reused by other callers and are tested only through the whole workflow. Move each decision into the subsystem class that owns that concept, and leave the facade with the sequence.

**Returning subsystem types.** A facade that returns the payment provider's response object or a JPA entity re-couples its clients to the subsystem. Return the client's own types.

**Ignoring partial failure.** Writing the happy path as a straight sequence of calls and assuming every step succeeds leaves reserved stock, orphan charges or half-created records whenever something fails midway. For each step, decide what happens if it fails and what must be undone.

**No idempotency on retried operations.** Network retries will repeat a checkout. Without an idempotency key, the customer is charged twice.

**A facade for a single class.** Wrapping one class with a facade that forwards every method adds a layer and simplifies nothing. Facade earns its place when it coordinates several classes or hides a genuinely complicated sequence.

**One facade for everything.** A single `ShopFacade` with sixty methods for storefront, admin and warehouse use is a subsystem-sized class in disguise. Split facades by audience or task.

## Interview perspective

Expect "What is the Facade pattern?", "Facade versus Adapter?", and, in low-level design rounds, being asked to sketch the class that ties a design together. In problems such as [[d3-movie-ticket-booking]], [[d3-food-delivery]] or [[d3-atm]], a booking or ordering service that coordinates seat locking, pricing, payment and notifications is a facade, and saying so — then explaining what stays out of it — is a strong signal.

> [!INTERVIEW] A good answer in four sentences
> "A facade gives clients one simple, task-level interface over a subsystem of several classes, like a `CheckoutService.checkout(cart)` that coordinates inventory, pricing, payment and shipping. It owns the sequence and the failure handling — for example, releasing stock if payment fails — but not the business rules, which stay in the subsystem so the facade doesn't become a god class. Unlike an adapter, which converts one existing interface into another, a facade invents a simpler interface over many classes. Clients can still use the subsystem directly when they need finer control."

Questions to prepare:

- **Facade versus Adapter?** Adapter converts one class to an interface the client already expects; Facade defines a new simplified interface over many classes.
- **Facade versus Mediator?** In Mediator, the peers know the mediator and communication is two-way; in Facade, the subsystem does not know the facade and calls flow one way.
- **Facade versus API gateway?** Similar idea at a different level: a gateway is a network component that aggregates services and also handles cross-cutting concerns such as authentication and rate limiting.
- **Where do transaction boundaries go?** Usually on the facade or application-service method, because it is the unit of work the business cares about; remote steps need compensation instead.
- **Checkout fails after payment — what does the facade do?** Run compensating actions (refund, release stock), record the failure, and make the operation idempotent so retries are safe.
- **How do you stop a facade from becoming a god class?** Keep it to sequencing and coordination, push decisions into the subsystem, and split it by audience when its interface grows.

## Practice

1. **Add a step.** Add a `FraudScreening` class to `CheckoutDemo` that rejects totals above 100,000 cents. Insert it into the facade in the right place and decide what, if anything, must be undone when it rejects.
2. **Compensation after payment.** Make `Shipping.schedule` fail for one country. Add a `refund` method to `PaymentGateway` and update the facade so a shipping failure refunds the charge and releases the stock. Print the sequence of actions for a failing order.
3. **Idempotent checkout.** Add an `idempotencyKey` field to `Cart`. Store each key's `CheckoutResult` in a map inside the facade so that a repeated checkout with the same key returns the first result without charging again.
4. **Spot the god class.** Take a controller from a project you know that calls more than four services in sequence. Sketch the facade you would extract, listing which lines move to the facade and which belong in a subsystem class.
5. **Home theatre.** Design a `HomeTheatreFacade` with `watchMovie(title)` and `endMovie()` over a projector, amplifier, streaming player and lights. Which steps must `endMovie` perform, and in what order?

## Quick revision {#quick-revision}

- Facade: one class with a simple, task-level interface over a subsystem of several classes; clients call it instead of sequencing the subsystem themselves.
- Roles: client → facade → subsystem classes. The subsystem does not know the facade; arrows point one way.
- Benefits: lower client coupling, one home for each workflow's sequence and failure handling, a stable interface while the subsystem changes.
- Design: methods named after client tasks; accept and return client types (DTOs), not subsystem types; constructor-injected collaborators; one facade per audience when needs differ.
- Keep it thin: the facade owns order, data passing, compensation, transactions and observability; domain decisions (pricing, validation, eligibility) stay in the subsystem.
- Failure: local DB steps → one transaction on the facade method; remote steps → compensating actions (sagas for long workflows); retries → idempotency keys.
- Real examples: Spring application services, SLF4J over Logback/Log4j 2, `JdbcTemplate`, legacy wrappers; API gateways and BFFs are a network-level analogy.
- vs Adapter (converts one interface to an expected one), Mediator (two-way peer coordination), Proxy/Decorator (same interface as one wrapped object).

## Key takeaways {#key-takeaways}

- Facade exists so that a multi-step task is assembled once, behind a method named after the task, instead of by every client.
- The facade coordinates; the subsystem decides. Keeping business rules out of the facade is what stops it becoming a god class.
- Because it owns the sequence, the facade is the right place for transaction boundaries, compensation and idempotency.
- A facade simplifies without necessarily hiding: the subsystem can stay available for callers that need finer control, unless you deliberately make the facade a module boundary.
- Adapter changes one interface to fit; Facade invents a simpler one over many classes — the most common interview distinction for this pattern.
