---
summary: Observer lets one object announce "something happened" to any number of interested objects without knowing who they are. You will learn how to implement it correctly — including unsubscription, failure isolation and safe iteration — and how it relates to event emitters, Spring application events and publish/subscribe messaging.
difficulty: intermediate
minutes: 45
objectives:
  - Explain the problem Observer solves and identify the subject, observer interface and concrete observers
  - Implement a subject with subscribe/unsubscribe, isolated failures and iteration that survives listeners detaching mid-notification
  - Compare push and pull notification, and synchronous and asynchronous delivery
  - Diagnose the classic Observer bugs — lapsed-listener memory leaks, notifying before commit, cascades and ordering assumptions
  - Distinguish in-process Observer from publish/subscribe through a message broker and choose between them
---

## Introduction

When an order is placed, many things should happen. The customer gets a confirmation email. Inventory is reserved. Analytics records the sale. The loyalty programme awards points. Next quarter, fraud scoring will want to know too, and after that a recommendation engine.

The direct way to write this is for `placeOrder` to call each of them in turn: `emailService.sendConfirmation(order); inventory.reserve(order); analytics.track(order); ...`. That works, but it means the order service knows about, depends on and must be edited for every single reaction. Its job is placing orders; it has become the switchboard for half the company. A bug in analytics can now break checkout, and adding fraud scoring means changing and redeploying the most critical code in the system.

The **Observer** pattern removes that knowledge. The order service — the **subject** — keeps a list of **observers** (also called listeners or subscribers) that have asked to be told about new orders. When an order is placed, it walks the list and notifies each one through a common interface. It does not know what they do with the news. Adding fraud scoring means writing a new observer and subscribing it; the order service does not change.

This is one of the most widely used ideas in software. Every `addEventListener` in a browser, every `EventEmitter` in Node.js, every Spring `@EventListener`, every UI framework that redraws when data changes, and every reactive library builds on it. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) defines it as a one-to-many dependency in which, when one object changes state, all its dependents are notified automatically.

## Before you start

- **Interfaces and lambdas** — observers are usually implementations of a one-method interface, often written as lambdas. See [[c1-interfaces]] and [[c1-lambdas]].
- **Coupling** — what it means for one module to depend on another, and why less is better. See [[d1-coupling-cohesion]].
- **Open/Closed principle** from [[d1-solid]] — Observer lets you add reactions without modifying the subject.
- For the concurrency sections: what a race condition is and why shared collections need care. See [[c3-thread-safety]].

## The intuition

Think of a newspaper subscription. You tell the publisher you want the paper, and from then on it arrives every morning. The publisher does not know whether you read it over breakfast, use it for the crossword or line a birdcage with it. It knows only that you are on the delivery list and how to deliver. You can cancel at any time and the deliveries stop. A thousand other people get the same paper, and none of them knows about you.

The pieces map directly. The publisher is the **subject**. "Something that can receive a newspaper at an address" is the **observer interface**. Each household is a **concrete observer**. Subscribing and cancelling are **attach** and **detach**. The morning delivery is **notification**.

Two details of the analogy matter for code. First, cancellation is your job: if you move house without cancelling, papers keep piling up at the old address. In software that is a memory leak, and it is the most common Observer bug. Second, a real paper is delivered to everyone more or less at once; in the simplest code, the subject notifies observers one after another, *on its own thread*, and waits for each — which has consequences we will look at closely.

## The structure

```mermaid title="Observer: the subject depends only on the observer interface"
classDiagram
  class OrderService {
    -listeners: List~OrderListener~
    +subscribe(l: OrderListener) Subscription
    +placeOrder(order)
  }
  class OrderListener {
    <<interface>>
    +onOrderPlaced(order)
  }
  class EmailListener
  class AnalyticsListener
  class LoyaltyListener
  OrderListener <|.. EmailListener
  OrderListener <|.. AnalyticsListener
  OrderListener <|.. LoyaltyListener
  OrderService --> OrderListener : notifies
```

The arrow points one way. `OrderService` depends on `OrderListener`, an interface it defines. The concrete listeners depend on that interface and on whatever they need to do their job (an email client, an analytics client). The subject never names a concrete listener. That inversion is the whole point: the stable, important code does not depend on the volatile, peripheral code.

## A correct implementation

The textbook version of Observer is a dozen lines: a list, an `attach` method, and a loop. Production code needs three more things — a way to unsubscribe, isolation so one failing observer does not break the others, and iteration that survives the list changing during notification. Here is a version with all three.

```java title="OrderEventsDemo.java"
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class OrderEventsDemo {

    record Order(String id, String customer, long totalCents) {}

    /** The observer interface: what the subject promises to call. */
    interface OrderListener {
        void onOrderPlaced(Order order);
    }

    /** A handle the subscriber keeps so it can unsubscribe later. */
    interface Subscription extends AutoCloseable {
        @Override void close();   // no checked exception
    }

    /** The subject: owns the listener list and the moment of notification. */
    static final class OrderService {
        private final List<OrderListener> listeners = new CopyOnWriteArrayList<>();

        Subscription subscribe(OrderListener listener) {
            listeners.add(listener);
            return () -> listeners.remove(listener);
        }

        void placeOrder(Order order) {
            System.out.println("saved " + order.id());
            for (OrderListener l : listeners) {
                try {
                    l.onOrderPlaced(order);
                } catch (RuntimeException e) {
                    // One broken listener must not stop the others or fail the order.
                    System.out.println("listener failed: " + e.getMessage());
                }
            }
        }
    }

    public static void main(String[] args) {
        OrderService orders = new OrderService();

        orders.subscribe(o -> System.out.println("email: thanks " + o.customer()));
        Subscription analytics =
                orders.subscribe(o -> System.out.println("analytics: +" + o.totalCents()));
        orders.subscribe(o -> { throw new IllegalStateException("inventory service down"); });
        orders.subscribe(o -> System.out.println("loyalty: points for " + o.customer()));

        orders.placeOrder(new Order("A-17", "ana", 4_200));

        analytics.close();   // analytics no longer wants events
        orders.placeOrder(new Order("A-18", "ben", 1_000));
    }
}
```

```output
saved A-17
email: thanks ana
analytics: +4200
listener failed: inventory service down
loyalty: points for ana
saved A-18
email: thanks ben
listener failed: inventory service down
loyalty: points for ben
```

Trace the first order. The service saves it, then visits the four listeners in the order they subscribed. The third throws an exception, which is caught and logged; the loyalty listener after it still runs. Before the second order, the analytics subscription is closed, and the second notification skips it.

Three design decisions are worth examining one by one.

### Subscribing returns a handle

`subscribe` returns a `Subscription` whose `close()` removes the listener. The alternative, a separate `unsubscribe(listener)` method, requires the caller to keep a reference to the *exact same* listener object — which is easy to get wrong with lambdas, because writing the same lambda twice creates two different objects, and removing the second does nothing. Returning a handle makes "undo this subscription" a single, obvious call. Browser APIs, RxJS (`subscription.unsubscribe()`) and many Java libraries use this design. Making the handle `AutoCloseable` also allows try-with-resources for short-lived subscriptions.

### Each observer is isolated

Without the `try`/`catch` inside the loop, one exception escapes the loop. Here is what that looks like:

```java title="NoIsolation.java"
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class NoIsolation {
    public static void main(String[] args) {
        List<Consumer<String>> listeners = new ArrayList<>();
        listeners.add(id -> System.out.println("email sent for " + id));
        listeners.add(id -> { throw new IllegalStateException("inventory down"); });
        listeners.add(id -> System.out.println("loyalty points for " + id));

        try {
            for (Consumer<String> l : listeners) l.accept("A-17");   // no try/catch per listener
        } catch (RuntimeException e) {
            System.out.println("placeOrder failed: " + e.getMessage());
        }
    }
}
```

```output
email sent for A-17
placeOrder failed: inventory down
```

The loyalty listener never ran, and the exception reached the caller of `placeOrder`, which would probably report the order as failed — even though it was saved and the customer was already emailed. The outcome now depends on the order listeners happened to subscribe in. Catching per listener makes each reaction independent. In production, "log it" should mean structured logging with the event's identifier, and often a retry or a dead-letter record so the failed reaction can be replayed.

Whether to catch is a deliberate choice, not a rule. If a listener's work is part of the same business operation — "the order must not be accepted unless stock is reserved" — then it is not really an optional reaction, and it should be called explicitly rather than hidden behind Observer.

### Iteration survives changes to the list

The listener list is a `CopyOnWriteArrayList`. To see why, consider a common kind of listener: one that unsubscribes itself after the first event (a "once" listener).

```java title="DetachDuringNotify.java"
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

public class DetachDuringNotify {

    static void run(List<Consumer<String>> listeners) {
        // A one-shot listener that removes itself the first time it runs.
        AtomicReference<Consumer<String>> once = new AtomicReference<>();
        once.set(e -> {
            System.out.println("  once: " + e);
            listeners.remove(once.get());
        });
        listeners.add(once.get());
        listeners.add(e -> System.out.println("  b: " + e));
        listeners.add(e -> System.out.println("  c: " + e));
        try {
            for (Consumer<String> l : listeners) l.accept("event");
        } catch (RuntimeException ex) {
            System.out.println("  " + ex.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        System.out.println("ArrayList:");
        run(new ArrayList<>());
        System.out.println("CopyOnWriteArrayList:");
        run(new CopyOnWriteArrayList<>());
    }
}
```

```output
ArrayList:
  once: event
  ConcurrentModificationException
CopyOnWriteArrayList:
  once: event
  b: event
  c: event
```

With an `ArrayList`, the for-each loop uses an iterator, and the listener removes an element from the list while that iterator is still walking it. The iterator detects the structural change on its next step and throws `ConcurrentModificationException` — despite there being only one thread. Listeners `b` and `c` never run. (With some list sizes the `ArrayList` iterator ends early without throwing and silently skips a listener, which is worse.)

A `CopyOnWriteArrayList` makes a fresh copy of its internal array on every add or remove, and an iterator walks the array that existed when iteration began. The removal therefore does not disturb the notification in progress, and it takes effect from the next event. The same property makes it safe when one thread subscribes while another is notifying. Copying on every write is expensive, but listener lists are read on every event and changed rarely, which is exactly the workload this class is designed for. See [[c3-copyonwritearraylist]].

The alternative, common in hand-written code and in other languages, is to copy the list before notifying: `for (var l : List.copyOf(listeners))`.

## Push and pull

There are two ways to give observers the information they need.

In the **push model**, the subject sends the relevant data with the notification: `onOrderPlaced(Order order)`. Observers have everything they need and do not call back into the subject. This is the usual choice today, and it works well when the event is an immutable record of what happened. The risk is that the subject must guess what every observer needs; events tend to grow fields over time.

In the **pull model**, the notification says only that something changed — `onChanged(subject)` or even `onChanged()` — and each observer asks the subject for whatever state it cares about. The subject stays simpler and observers fetch only what they need. The risks are that observers become coupled to the subject's query methods, and that by the time an observer pulls, the state may have changed again, so it sees a later state than the one that triggered the notification.

A practical middle ground is to push a small, immutable **event object** — the order's identifier, its total and the time it happened — and let observers that need more fetch it. Making events immutable matters: every observer receives the same object, and if one modified it, the observers after it would see altered data.

## Synchronous and asynchronous delivery

In everything above, notification is **synchronous**: `placeOrder` calls each observer on its own thread and waits for it to return before calling the next and before returning to its own caller. That has three consequences that are easy to overlook.

**The subject is only as fast as its slowest observer.** If the email listener takes two seconds to talk to the mail server, every `placeOrder` takes at least two seconds.

**Observers run inside the subject's context.** In a transactional service they run inside the same database transaction, holding its locks for longer, and if the transaction later rolls back, the observers have already acted on an order that does not exist.

**Order is implicit.** Observers run in subscription order, and code silently starts depending on it — the analytics listener assumes the loyalty listener has already updated the customer's tier. That is a hidden coupling between observers the pattern was supposed to keep independent. If order matters, make it explicit or do not use Observer for that interaction.

**Asynchronous** delivery hands each notification to another thread or a queue and returns at once. The subject is no longer slowed down, but there are new questions: errors can no longer be reported to the caller, events may be processed out of order or after the process crashes (and therefore lost), and observers see the world slightly later than the subject did.

```mermaid title="Synchronous notification: placeOrder waits for every observer"
sequenceDiagram
  participant C as Caller
  participant S as OrderService
  participant E as EmailListener
  participant A as AnalyticsListener
  C->>S: placeOrder(order)
  S->>S: save order
  S->>E: onOrderPlaced(order)
  E-->>S: returns
  S->>A: onOrderPlaced(order)
  A-->>S: returns
  S-->>C: returns
```

Node.js shows the synchronous default clearly. `EventEmitter.emit` calls every listener before it returns, on the same call stack:

```javascript title="emitter.mjs"
import { EventEmitter } from 'node:events';

const orders = new EventEmitter();

function onPlaced(order) {
  console.log('listener: email for', order.id);
}
orders.on('placed', onPlaced);
orders.once('placed', (order) => console.log('listener: first order ever', order.id));

console.log('before emit');
orders.emit('placed', { id: 'A-17' });
console.log('after emit');

orders.emit('placed', { id: 'A-18' });
orders.off('placed', onPlaced);
console.log('listeners left:', orders.listenerCount('placed'));
```

```output
before emit
listener: email for A-17
listener: first order ever A-17
after emit
listener: email for A-18
listeners left: 0
```

"after emit" prints after both listeners, so emitting is synchronous. The `once` listener fires for the first event only. `off` needs the same function reference that was passed to `on`, which is why `onPlaced` is a named function rather than an inline arrow. Node also prints a `MaxListenersExceededWarning` when more than ten listeners are added for one event name on one emitter, by default — not because eleven is wrong, but because a steadily growing count is the classic sign of a leak. A full implementation of an emitter is a common interview exercise; see [[b1-impl-event-emitter]].

## Notify after commit

The most damaging Observer bug in backend code is notifying too early. Suppose `placeOrder` runs inside a database transaction, notifies observers synchronously, and the email observer sends "your order is confirmed". Then a constraint check at commit fails and the transaction rolls back. The customer has an email for an order that does not exist.

The fix is to notify only after the transaction has **committed**. Spring supports this directly. An application publishes an event with `ApplicationEventPublisher.publishEvent(...)`; a method annotated `@EventListener` receives it synchronously, in the publisher's thread and transaction; a method annotated `@TransactionalEventListener` is, by default, called only after the surrounding transaction commits (its default phase is `AFTER_COMMIT`), and not at all if it rolls back.

```java title="Spring listeners (fragment)"
@Service
class OrderService {
    private final ApplicationEventPublisher events;
    OrderService(ApplicationEventPublisher events) { this.events = events; }

    @Transactional
    public void placeOrder(Order order) {
        repository.save(order);
        events.publishEvent(new OrderPlaced(order.id(), order.totalCents()));
    }
}

@Component
class ConfirmationEmailer {
    @TransactionalEventListener   // runs after commit; skipped on rollback
    void on(OrderPlaced event) { mail.sendConfirmation(event.orderId()); }
}
```

This is still in-process: if the application crashes between the commit and the email, the email is never sent. When a reaction must not be lost, the standard answer is the **transactional outbox**: write the event to an outbox table in the same transaction as the order, and have a separate process deliver it to a message broker. See [[c5-application-events]], [[c5-event-listener]] and [[c11-transactional-outbox]].

## Memory leaks: the lapsed listener

A subject holds a strong reference to every subscribed observer. As long as the subject is alive, so are its observers — and everything they reference. If a short-lived object subscribes to a long-lived subject and is never unsubscribed, it can never be garbage collected. This is called the **lapsed listener problem**.

A typical case: a screen in a desktop or single-page application subscribes to a global "user changed" event when it opens. The user navigates away and the screen is closed, but the subscription remains. Every time the screen is opened again, another subscription is added. Memory grows, and every event now runs the handler of every screen that was ever opened, each updating UI that no longer exists.

The rule is simple to state: **whoever subscribes is responsible for unsubscribing**, at the end of its own lifetime. In React, an effect that subscribes returns a cleanup function that unsubscribes, and React calls it when the component unmounts (and before re-running the effect):

```javascript title="React subscription (fragment)"
useEffect(() => {
  const subscription = userStore.subscribe(setUser);
  return () => subscription.unsubscribe(); // cleanup on unmount
}, []);
```

Weak references (`WeakReference` in Java, `WeakRef` in JavaScript) are sometimes suggested as an automatic fix, so the subject does not keep observers alive. They have their own trap: a listener written as a lambda that nothing else references can be collected immediately, and it silently stops receiving events. Explicit unsubscription is more predictable. See [[b4-effect-cleanup]], [[b1-memory-leaks]] and [[c2-memory-leaks]].

```quiz
Q: A page component subscribes to a global event store each time it mounts but never unsubscribes. After the user opens and closes the page five times, what happens when the store emits one event?
- [ ] Nothing, because closed components are garbage collected automatically
- [x] The handler runs five times, and the five closed components stay in memory
- [ ] Only the most recent subscription runs, because the store replaces old listeners
- [ ] The store throws an exception because the components are unmounted
> The store's listener list holds a strong reference to each handler, and each handler references its component, so none can be collected. Every emission calls all five. This is the lapsed listener problem; the fix is to unsubscribe in the component's cleanup.
```

## Cascades and cycles

Observers often change state themselves, and that state may have its own observers. A change to the cart notifies the price display, which recalculates a discount, which updates the cart, which notifies the price display again. If nothing breaks the loop, the program recurses until it overflows the stack, or oscillates forever.

Three defences are common. Notify only on a *real* change, comparing old and new values and skipping notification when they are equal — UI frameworks do this for state updates. Guard against re-entrancy with a flag that ignores notifications triggered while one is already in progress. And restructure: if two components keep each other in sync, a single owner of the state, or a **Mediator** — one object that coordinates the others, so they talk to it instead of to each other — is clearer than mutual observation.

A related problem is high-frequency events: a price feed that changes a thousand times a second, or a text box that fires on every keystroke. Notifying every observer each time wastes work. Batching, **debouncing** (waiting until changes stop for a moment) or **throttling** (at most one notification per interval) reduce the load.

## Observer versus publish/subscribe

Observer is often equated with publish/subscribe ("pub/sub"), and they share the same idea, but they are different in ways that matter in system design.

In **Observer**, the subject holds direct references to its observers, in the same process. Delivery is usually synchronous, nothing is stored, and if the process dies, in-flight notifications are lost.

In **publish/subscribe**, publishers send messages to a named **topic** on a **broker** — Kafka, RabbitMQ, Amazon SNS, Redis pub/sub — and subscribers receive from the topic. Publishers and subscribers do not know about each other at all, may be in different services and languages, and are usually decoupled in time as well: depending on the broker, messages can be stored durably, retried, replayed and consumed at the subscriber's own pace.

| | Observer | Publish/subscribe |
|---|---|---|
| Who knows whom | Subject holds observer references | Neither side knows the other; both know the topic |
| Where | One process | Across processes and services |
| Delivery | Usually synchronous method calls | Usually asynchronous messages through a broker |
| Durability | None — lost on crash | Depends on broker: from none (Redis pub/sub) to durable log (Kafka) |
| Failure of a consumer | Affects the subject unless isolated | Isolated; messages wait or retry |
| Typical use | UI updates, in-process domain events | Cross-service reactions, analytics pipelines |

A common evolution path: a system starts with in-process observers for order-placed reactions, then moves the reactions that must not be lost or that belong to other teams onto a broker. See [[d5-queue-vs-pubsub]] and [[c11-point-to-point-vs-pubsub]].

## In real systems

**User interfaces.** The Model–View–Controller idea rests on Observer: the model notifies views when it changes, and views redraw. Browser DOM events (`element.addEventListener('click', handler)`) are Observer with a twist — events also propagate through the element tree. Reactive state libraries and signals in modern front-end frameworks track which components read which state and notify exactly those when it changes. See [[b1-reactivity-concept]].

**Server frameworks.** Spring application events, Node's `EventEmitter` (which streams, servers and sockets all extend), and hooks in build tools and test runners are all Observer.

**Reactive streams.** RxJS `Observable`s and Java's `java.util.concurrent.Flow` (Java 9+) extend Observer with composition operators (map, filter, merge) and, in `Flow` and Reactive Streams libraries, **backpressure** — a way for a slow subscriber to tell the publisher to send less.

**The JDK's own history.** `java.util.Observable` and `java.util.Observer` were deprecated in Java 9. `Observable` is a class, so a subject had to extend it and could not extend anything else; its notification model was limited and it was not well suited to concurrent use. `java.beans.PropertyChangeSupport` and listener interfaces, or a small hand-written subject like the one in this lesson, are the usual replacements.

## Trade-offs and alternatives

Observer's benefits: the subject is decoupled from its reactions, reactions can be added or removed without changing the subject, subscriptions can change at runtime, and the core logic stays separate from side effects.

Its costs are mostly about visibility and control. The flow of control is no longer written in one place: reading `placeOrder` does not tell you what happens when an order is placed — you have to find every subscriber, which makes debugging harder. Notification order is implicit. Synchronous observers slow the subject and share its transaction. Forgotten subscriptions leak memory. And without care, one failing observer affects the others.

Alternatives, depending on the need:

- **Explicit calls in an application service** when there are two or three reactions, they are part of the same business operation, or their order matters. Being able to read the whole workflow in one method is valuable.
- **Domain events with a transactional outbox and a message broker** when reactions are in other services, must survive crashes, or are owned by other teams.
- **Reactive streams** when events are continuous and need transformation, combination or backpressure.
- **Mediator** when many objects need to coordinate with one another rather than one object broadcasting to many.

## Common mistakes

> [!MISTAKE] Notifying before the transaction commits
> Observers that send emails, publish messages or call other services from inside an uncommitted transaction act on data that may be rolled back. Notify after commit (`@TransactionalEventListener` in Spring) or use a transactional outbox.

**Forgetting to unsubscribe.** Every subscription made by a shorter-lived object needs a matching unsubscription at the end of that object's life — component unmount, session end, request completion.

**Letting one observer's exception break the rest.** Catch and log per observer, and decide deliberately whether a failure should fail the operation.

**Modifying the listener list during iteration.** Use a copy-on-write list or iterate over a snapshot, or a listener that detaches itself will throw `ConcurrentModificationException` or cause others to be skipped.

**Heavy work in synchronous observers.** Network calls in a synchronous observer make every subject operation slow. Hand slow work to an executor or a queue.

**Passing mutable event objects.** If observers receive the subject's own mutable state and one modifies it, the rest see altered data. Pass immutable events, such as records.

**Relying on notification order.** If observer B must run after observer A, that dependency is invisible and fragile. Make the sequence explicit in code instead.

## Interview perspective

Observer appears in interviews as a direct question ("implement a stock price notifier", "Observer versus pub/sub?") and inside design problems: notifying waiting members when a book is returned in [[d3-library]], notifying users of booking changes in [[d3-movie-ticket-booking]], or the subscriber model of [[d3-notification-service]].

> [!INTERVIEW] Going beyond the textbook
> "The subject keeps a list of listeners behind an interface and notifies them when an order is placed, so adding fraud scoring doesn't touch the order service. For production I'd return a subscription handle for unsubscribing, catch exceptions per listener, and use a `CopyOnWriteArrayList` so listeners can detach during notification. Notifications are synchronous by default, so slow listeners go async, and anything that must not be lost — like the confirmation email — goes through an outbox to a broker after the transaction commits."

Questions to prepare:

- **Observer versus pub/sub?** Direct references in one process versus a broker and topics across services, usually asynchronous and possibly durable.
- **Push versus pull?** Data sent with the notification versus observers querying the subject; mention the stale-read risk of pull and the value of immutable events.
- **Where is the memory leak?** A long-lived subject strongly referencing observers of shorter-lived objects that never unsubscribed.
- **How do you make the listener list thread-safe?** `CopyOnWriteArrayList`, or synchronise modifications and iterate over a snapshot.
- **Observer versus Mediator?** Observer broadcasts from one subject to many observers; a Mediator coordinates interactions among many peers.
- **Sync observers or a queue for order placed?** In-process for UI and cheap reactions; outbox plus broker for reactions that must survive crashes or live in other services.

## Practice

1. **Stock ticker.** Write a `StockTicker` subject that notifies observers of price changes for symbols they subscribed to. Notify only when the price actually changes, and let an observer subscribe to several symbols.
2. **Find the leak.** Write a long-lived `EventBus` and a `Screen` class that subscribes in its constructor. Create and discard 1,000 screens and count the listeners. Fix it with a `close()` method on `Screen`.
3. **Async observers.** Change `OrderService` to deliver notifications through an `ExecutorService`. What happens to error handling, ordering and the output order of the program? Explain why the output can now vary between runs.
4. **Cycle guard.** Build two observable values that keep each other in sync (Celsius and Fahrenheit). Show the infinite loop, then fix it by notifying only on real changes.
5. **Implement an emitter.** In JavaScript, implement `on`, `off`, `once` and `emit`, including correct behaviour when a listener removes itself during `emit`.

## Quick revision {#quick-revision}

- Observer: a subject keeps a list of observers behind an interface and notifies them when something happens; one-to-many, subject unaware of concrete observers.
- Benefits: open/closed for new reactions, runtime subscription, core logic separate from side effects.
- Production checklist: subscription handle for unsubscribing, try/catch per observer, `CopyOnWriteArrayList` or snapshot iteration, immutable event objects.
- Push sends data with the event; pull lets observers query the subject (may see later state).
- Default delivery is synchronous: subject waits for each observer, shares its thread and transaction, order is implicit.
- Notify after commit (`@TransactionalEventListener`, default `AFTER_COMMIT`); use a transactional outbox when reactions must not be lost.
- Lapsed listener: long-lived subject keeps unsubscribed observers alive; the subscriber must unsubscribe (React effect cleanup).
- Guard against cascades: notify only on real change, re-entrancy guards, debounce or throttle high-frequency events.
- Observer is in-process with direct references; pub/sub uses a broker and topics, usually async and possibly durable.
- `java.util.Observable` is deprecated since Java 9; Node's `EventEmitter` is synchronous and warns above ten listeners per event.

## Key takeaways {#key-takeaways}

- Observer decouples "something happened" from "who reacts", so new reactions do not require changing the subject.
- The textbook loop is not enough for production: add unsubscription handles, failure isolation and iteration that tolerates changes.
- Synchronous notification means observers share the subject's speed, thread, transaction and failures; move slow or must-not-lose work elsewhere.
- Most Observer bugs are lifecycle bugs — notifying before commit, and subscribing without unsubscribing.
- Pub/sub through a broker is the cross-service, durable relative of Observer; choose by process boundaries and how much a lost event costs.
