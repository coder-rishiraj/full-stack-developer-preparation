---
summary: Factories move the decision "which concrete class do I create, and how?" out of the code that uses the object and into one place. You will learn the three factory variants — Simple Factory, Factory Method and Abstract Factory — what problem each solves, and how they relate to static factory methods and dependency injection.
difficulty: intermediate
minutes: 45
objectives:
  - Explain why scattering `new ConcreteClass()` couples callers to implementations and complicates testing
  - Implement a Simple Factory with configuration validation, and extend it with a registry so new types need no edits
  - Distinguish Simple Factory, Factory Method and Abstract Factory by who decides and what is created
  - Use static factory methods and explain what they offer over constructors
  - Decide when a factory, a dependency-injection container or a plain constructor is the right tool
---

## Introduction

An order service needs to send a confirmation message. The first version writes `new SmtpNotifier("mail.internal")` inside `placeOrder`, and it works. Then the team wants a console notifier in local development so nobody emails real customers from a laptop, a recording notifier in tests so they can assert what was sent, and a different email provider in one region. Each change means editing the order service — code whose job is placing orders, not choosing email providers — and the same `if (env == ...)` check starts appearing in every service that sends messages.

The problem is the keyword `new`. A constructor call names a **concrete class**, so the code that calls it depends on that class, on its constructor arguments, and on whatever configuration those arguments come from. A **factory** is an object or method whose job is to create other objects, so that callers ask for "a `Notifier`" and receive the right implementation without knowing which one it is or how it was built.

"Factory" is not one pattern but a family. This lesson covers three that you should be able to tell apart:

- **Simple Factory** — one method that picks and builds the implementation, usually from configuration. It is not one of the patterns in the *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, known as the Gang of Four or GoF book), but it is the most common in practice.
- **Factory Method** — a GoF pattern in which a base class defines a workflow and leaves one creation step to subclasses.
- **Abstract Factory** — a GoF pattern for creating *families* of related objects that must be used together.

It also covers **static factory methods** such as `List.of` and `Integer.valueOf`, which share the name and some of the benefits.

## Before you start

- **Interfaces and polymorphism** — the factory returns an interface type and the caller uses it without knowing the class. See [[c1-interfaces]] and [[c1-polymorphism]].
- **Dependency Inversion** from [[d1-solid]] — high-level code should depend on abstractions; factories are one way to supply the concrete objects.
- **Coupling** — what it means for one class to depend on another's details. See [[d1-coupling-cohesion]].
- [[d2-strategy]] is useful but not required: a factory is often how a strategy gets chosen.

## The intuition

When you order a coffee, you say "a flat white". You do not grind the beans, choose the machine pressure or know which of the three espresso machines behind the counter makes it. The barista — the factory — knows the recipe, which machine is free and which milk is in stock today. If the café replaces a machine, your order does not change.

That is the bargain a factory offers. The caller states *what* it needs, in terms of an interface. The factory owns *which* implementation and *how* it is assembled: reading configuration, supplying credentials, choosing between providers, reusing an existing instance. Construction knowledge lives in one place instead of being copied into every caller.

The analogy stops in one respect: a barista makes a new drink every time, but a factory need not. It can return a shared instance, a cached one, or a pooled one, and the caller cannot tell. That freedom is one of the main reasons factories exist.

## The cost of `new` in the wrong place

Calling a constructor ties the caller to three things at once. It ties it to the **class**, so swapping implementations means editing the caller. It ties it to the **construction details** — the host name, the API key, the timeout — so the caller must know where those come from. And it ties it to the **moment** of creation, so the caller cannot be given a pre-built, shared or fake instance instead.

None of this matters for value objects such as `new Money(500, "EUR")` or `new ArrayList<>()`: there is one sensible implementation and nothing to configure. It matters for objects that talk to the outside world, that have several implementations, or that need expensive or secret-laden setup — database clients, message senders, payment gateways, storage backends. For those, the question "which one and how?" should be answered once, at the edge of the application, not inside business logic.

## Simple Factory

A **Simple Factory** is a single method that takes some input — usually configuration — and returns an implementation of an interface. It is the direct replacement for scattered `if (env == ...)` checks.

```java title="SimpleFactoryDemo.java"
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SimpleFactoryDemo {

    interface Notifier {
        void send(String to, String text);
    }

    static final class SmtpNotifier implements Notifier {
        private final String host;
        SmtpNotifier(String host) { this.host = host; }
        @Override public void send(String to, String text) {
            System.out.println("[smtp " + host + "] " + to + ": " + text);
        }
    }

    static final class ConsoleNotifier implements Notifier {
        @Override public void send(String to, String text) {
            System.out.println("[console] " + to + ": " + text);
        }
    }

    /** Records messages instead of sending them; used by tests. */
    static final class RecordingNotifier implements Notifier {
        final List<String> sent = new ArrayList<>();
        @Override public void send(String to, String text) { sent.add(to + ": " + text); }
    }

    /** Simple Factory: the one place that knows the concrete classes. */
    static final class NotifierFactory {
        static Notifier create(Map<String, String> config) {
            String kind = config.getOrDefault("notifier", "console");
            return switch (kind) {
                case "smtp" -> new SmtpNotifier(require(config, "smtp.host"));
                case "console" -> new ConsoleNotifier();
                case "recording" -> new RecordingNotifier();
                default -> throw new IllegalArgumentException("Unknown notifier: " + kind);
            };
        }

        private static String require(Map<String, String> config, String key) {
            String value = config.get(key);
            if (value == null || value.isBlank()) {
                throw new IllegalStateException("Missing config: " + key);
            }
            return value;
        }
    }

    /** Depends only on the interface; never calls new on a notifier. */
    static final class OrderService {
        private final Notifier notifier;
        OrderService(Notifier notifier) { this.notifier = notifier; }
        void placeOrder(String customer, String orderId) {
            notifier.send(customer, "Order " + orderId + " confirmed");
        }
    }

    public static void main(String[] args) {
        List<Map<String, String>> configs = List.of(
                Map.of("notifier", "smtp", "smtp.host", "mail.internal"),
                Map.of(),
                Map.of("notifier", "smtp"),
                Map.of("notifier", "sms"));

        for (Map<String, String> config : configs) {
            try {
                Notifier notifier = NotifierFactory.create(config);
                new OrderService(notifier).placeOrder("ana@example.com", "A-17");
            } catch (RuntimeException e) {
                System.out.println("startup failed: " + e.getMessage());
            }
        }
    }
}
```

```output
[smtp mail.internal] ana@example.com: Order A-17 confirmed
[console] ana@example.com: Order A-17 confirmed
startup failed: Missing config: smtp.host
startup failed: Unknown notifier: sms
```

The four configurations show the factory's responsibilities. The first is the normal production case. The second has no setting at all, and the factory applies a documented default — the console — rather than guessing at production email. The third asks for SMTP without a host, and the factory refuses to build a half-configured notifier that would fail later on the first order. The fourth names an implementation that does not exist and fails with a message that says which value was wrong.

Notice that `OrderService` receives its `Notifier` through its constructor; it does not call the factory itself. The factory is called once, in `main` — the **composition root**, the place where the application's objects are created and wired together. This matters. If `OrderService` called `NotifierFactory.create(...)` internally, it would depend on the factory and on the configuration format, and a test could not hand it a `RecordingNotifier` directly. Factories belong at the edge; business classes receive what they need.

The return type is the interface, `Notifier`, not `SmtpNotifier`. That is the point of the exercise: if the factory returned a concrete type, callers could start using methods specific to that class and the decoupling would be lost.

> [!TIP] Validate at start-up, not on first use
> Call factories while the application starts, so a missing setting or an unknown provider stops the deployment immediately. A factory invoked lazily on the first request turns a configuration typo into a customer-facing error hours later.

## Registry factories: adding types without editing the switch

The Simple Factory above has a weakness its own notes would admit: every new implementation means another `case`. With fifty providers the factory becomes the very god-switch it was meant to replace, and every team adding a provider edits the same file.

The standard fix is a **registry**: a map from key to a creation function, which implementations register with instead of being hard-coded.

```java title="RegistryDemo.java"
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.function.Supplier;

public class RegistryDemo {

    interface PaymentGateway {
        String name();
    }

    record StripeGateway() implements PaymentGateway {
        public String name() { return "stripe"; }
    }

    record PayPalGateway() implements PaymentGateway {
        public String name() { return "paypal"; }
    }

    /** A factory that new providers register with, instead of editing a switch. */
    static final class GatewayRegistry {
        private final Map<String, Supplier<? extends PaymentGateway>> creators = new TreeMap<>();

        void register(String key, Supplier<? extends PaymentGateway> creator) {
            if (creators.putIfAbsent(key, creator) != null) {
                throw new IllegalStateException("Duplicate gateway key: " + key);
            }
        }

        PaymentGateway create(String key) {
            Supplier<? extends PaymentGateway> creator = creators.get(key);
            if (creator == null) {
                throw new IllegalArgumentException(
                        "Unknown gateway '" + key + "', known: " + creators.keySet());
            }
            return creator.get();
        }

        Set<String> keys() { return creators.keySet(); }
    }

    public static void main(String[] args) {
        GatewayRegistry registry = new GatewayRegistry();
        registry.register("stripe", StripeGateway::new);
        registry.register("paypal", PayPalGateway::new);

        System.out.println(registry.create("paypal").name());
        try {
            registry.create("adyen");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        try {
            registry.register("stripe", StripeGateway::new);
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

```output
paypal
Unknown gateway 'adyen', known: [paypal, stripe]
Duplicate gateway key: stripe
```

The registry stores `Supplier`s — functions that create an object when called — rather than ready-made instances, so each `create` can return a fresh gateway. If gateways were stateless and expensive to build, the registry could store instances instead; the caller would not notice. The error for an unknown key lists the known keys, which turns a support ticket into a one-line fix. Rejecting a duplicate registration catches two modules accidentally claiming the same key, which would otherwise make the winner depend on start-up order.

Registration usually happens at start-up. In a plain Java application, each module can register its providers from an initialisation method; the JDK's `java.util.ServiceLoader` discovers implementations listed in `META-INF/services` files on the classpath, which is how JDBC drivers and many plugin systems are found without the core code naming them. In Spring, injecting a `Map<String, PaymentGateway>` gives you every gateway bean keyed by bean name — a registry the container builds for you.

## Factory Method

**Factory Method** is the GoF pattern, and it is narrower than "a method that creates things". Its definition: a base class defines an operation that needs an object, but leaves the choice of *which class* to instantiate to its subclasses, through an overridable creation method.

The base class is called the **creator** and the object it needs is the **product**. The creator's main logic is written once against the product interface; each subclass overrides only the factory method.

```java title="FactoryMethodDemo.java"
import java.util.List;

public class FactoryMethodDemo {

    interface RowWriter {
        String header(List<String> columns);
        String row(List<String> values);
    }

    static final class CsvWriter implements RowWriter {
        public String header(List<String> columns) { return String.join(",", columns); }
        public String row(List<String> values) { return String.join(",", values); }
    }

    static final class MarkdownWriter implements RowWriter {
        public String header(List<String> columns) {
            return "| " + String.join(" | ", columns) + " |\n"
                    + "|" + "---|".repeat(columns.size());
        }
        public String row(List<String> values) { return "| " + String.join(" | ", values) + " |"; }
    }

    /** The creator: a fixed workflow with one creation step left to subclasses. */
    abstract static class ReportExporter {
        // The factory method. Subclasses decide which RowWriter is created.
        protected abstract RowWriter createWriter();

        public final String export(List<String> columns, List<List<String>> rows) {
            RowWriter writer = createWriter();
            StringBuilder out = new StringBuilder(writer.header(columns));
            for (List<String> r : rows) {
                out.append('\n').append(writer.row(r));
            }
            return out.toString();
        }
    }

    static final class CsvExporter extends ReportExporter {
        @Override protected RowWriter createWriter() { return new CsvWriter(); }
    }

    static final class MarkdownExporter extends ReportExporter {
        @Override protected RowWriter createWriter() { return new MarkdownWriter(); }
    }

    public static void main(String[] args) {
        List<String> cols = List.of("sku", "qty");
        List<List<String>> rows = List.of(List.of("A-1", "3"), List.of("B-7", "12"));
        for (ReportExporter exporter : List.of(new CsvExporter(), new MarkdownExporter())) {
            System.out.println(exporter.export(cols, rows));
            System.out.println();
        }
    }
}
```

```output
sku,qty
A-1,3
B-7,12

| sku | qty |
|---|---|
| A-1 | 3 |
| B-7 | 12 |

```

`export` is `final`: the workflow of header-then-rows cannot be changed by subclasses. The only thing a subclass decides is which `RowWriter` to create. Adding an HTML exporter means one new writer class and one tiny exporter subclass; `export` is not touched.

If this shape looks familiar, it should: Factory Method is a special case of [[d2-template-method]], where the step left to subclasses is object creation. It is most at home in **frameworks**, where the framework owns the workflow and application code plugs in by subclassing. Examples include `Iterable.iterator()`, the classic JDK illustration — code written against `Iterable`, such as the enhanced `for` loop, calls it, and each collection decides which iterator class to return — as well as test-framework base classes that ask subclasses to create the object under test, and UI frameworks where a document class creates its own page type.

In application code, you will often see the same goal achieved with composition instead: pass a `Supplier<RowWriter>` (or the writer itself) into a single `ReportExporter` class. That avoids a subclass per variant and lets the choice be made from configuration — the Strategy approach from [[d2-strategy]]. Use the subclassing form when the creator has several related hooks that naturally vary together, or when you are designing an extension point for a framework.

## Abstract Factory

Sometimes the problem is not choosing one object but choosing **several objects that must match**. A desktop UI toolkit needs buttons, checkboxes and menus that all belong to the same theme; mixing a macOS button with a Windows menu is a bug. A backend may need a blob store and a message queue that come from the same environment: both from AWS in production, both in-memory in tests. Choosing them independently invites the mistake of a test that writes to an in-memory store but publishes to a real queue.

An **Abstract Factory** is an interface with one creation method per product in the family. Each concrete factory produces a whole consistent family, and the client receives one factory instead of several independent choices.

```mermaid title="Abstract Factory: one factory per family, one method per product"
classDiagram
  class InfraFactory {
    <<interface>>
    +blobStore() BlobStore
    +messageQueue() MessageQueue
  }
  class AwsFactory
  class InMemoryFactory
  class BlobStore {
    <<interface>>
  }
  class MessageQueue {
    <<interface>>
  }
  InfraFactory <|.. AwsFactory
  InfraFactory <|.. InMemoryFactory
  InfraFactory ..> BlobStore : creates
  InfraFactory ..> MessageQueue : creates
```

```java title="AbstractFactoryDemo.java"
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;

public class AbstractFactoryDemo {

    // Two product interfaces that must come from the same family.
    interface BlobStore {
        void put(String key, String value);
        String describe();
    }

    interface MessageQueue {
        void publish(String message);
        String describe();
    }

    /** The abstract factory: one method per product in the family. */
    interface InfraFactory {
        BlobStore blobStore();
        MessageQueue messageQueue();
    }

    // Family 1: cloud-backed products (real SDK calls omitted).
    static final class AwsFactory implements InfraFactory {
        private final String region;
        AwsFactory(String region) { this.region = region; }
        public BlobStore blobStore() {
            return new BlobStore() {
                public void put(String key, String value) { /* S3 PutObject */ }
                public String describe() { return "S3 bucket in " + region; }
            };
        }
        public MessageQueue messageQueue() {
            return new MessageQueue() {
                public void publish(String message) { /* SQS SendMessage */ }
                public String describe() { return "SQS queue in " + region; }
            };
        }
    }

    // Family 2: in-memory products for tests and local development.
    static final class InMemoryFactory implements InfraFactory {
        public BlobStore blobStore() {
            Map<String, String> data = new HashMap<>();
            return new BlobStore() {
                public void put(String key, String value) { data.put(key, value); }
                public String describe() { return "in-memory map (" + data.size() + " keys)"; }
            };
        }
        public MessageQueue messageQueue() {
            Queue<String> queue = new ArrayDeque<>();
            return new MessageQueue() {
                public void publish(String message) { queue.add(message); }
                public String describe() { return "in-memory queue (" + queue.size() + " msgs)"; }
            };
        }
    }

    /** Client code: knows only the abstract factory and product interfaces. */
    static void uploadInvoice(InfraFactory infra) {
        BlobStore store = infra.blobStore();
        MessageQueue queue = infra.messageQueue();
        store.put("invoices/42.pdf", "...");
        queue.publish("invoice-uploaded:42");
        System.out.println(store.describe() + " + " + queue.describe());
    }

    public static void main(String[] args) {
        uploadInvoice(new AwsFactory("eu-west-1"));
        uploadInvoice(new InMemoryFactory());
    }
}
```

```output
S3 bucket in eu-west-1 + SQS queue in eu-west-1
in-memory map (1 keys) + in-memory queue (1 msgs)
```

`uploadInvoice` cannot mix families: it receives one factory, and everything it creates comes from that factory. The AWS factory also shares a piece of family-wide configuration, the region, so the store and the queue are guaranteed to be in the same region. The products are anonymous classes here to keep the example short; in real code they would be named classes wrapping the AWS SDK clients (see [[d2-adapter]] for that wrapping).

The cost is rigidity in one direction. Adding a new *family* — say, a Google Cloud factory — is easy: one new class. Adding a new *product* — say, a cache — means adding a method to `InfraFactory` and implementing it in every factory. Abstract Factory is worth it only when the family genuinely must stay consistent and its membership is stable.

## The three variants side by side

| | Simple Factory | Factory Method | Abstract Factory |
|---|---|---|---|
| What it is | One method that picks an implementation | Overridable creation hook in a base class | Interface with one creation method per product |
| Who decides | The factory, from its input (config, key) | The subclass, by overriding | Whoever chooses the concrete factory |
| Creates | One product | One product, inside a larger workflow | A family of related products |
| Mechanism | A `switch` or registry | Inheritance | Composition: the client holds a factory |
| Typical home | Composition root, configuration | Frameworks and extension points | Themes, platforms, environment-wide wiring |

A quick way to tell them apart in a codebase: if there is one method with a `switch` or map, it is a Simple Factory. If an abstract class calls an abstract `createX()` from its own logic, it is Factory Method. If an interface has several `createX()`/`x()` methods whose results are meant to be used together, it is Abstract Factory.

```quiz
Q: A class `Game` has a final `play()` method that calls an abstract `createBoard()`. `ChessGame` and `CheckersGame` override `createBoard()`. Which pattern is this?
- [ ] Simple Factory
- [x] Factory Method
- [ ] Abstract Factory
- [ ] Builder
> The base class owns the workflow and calls an overridable creation method; subclasses decide which product class to instantiate. That is the definition of Factory Method. There is no switch over a key (Simple Factory), and only one product is created rather than a family (Abstract Factory).
```

## Static factory methods

Separately from the GoF patterns, Java code is full of **static factory methods**: static methods that return an instance of their class, used instead of a public constructor. `List.of(...)`, `Integer.valueOf(...)`, `Optional.empty()`, `LocalDate.of(...)` and `Path.of(...)` are all static factories. Joshua Bloch's *Effective Java* opens with the advice to consider them instead of constructors, and the reasons are worth knowing because they are the same reasons factories in general exist.

```java title="StaticFactories.java"
import java.util.List;

public class StaticFactories {
    public static void main(String[] args) {
        // valueOf may return a cached instance instead of creating a new one.
        Integer a = Integer.valueOf(127), b = Integer.valueOf(127);
        Integer c = Integer.valueOf(128), d = Integer.valueOf(128);
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));

        // List.of chooses a concrete class by size; callers only see List.
        System.out.println(List.of(1).getClass().getSimpleName());
        System.out.println(List.of(1, 2, 3).getClass().getSimpleName());
    }
}
```

```output
true
false
true
List12
ListN
```

`Integer.valueOf` returns cached instances for values from −128 to 127 (the range the Java specification requires for autoboxing; the upper bound can be raised with a JVM flag). So `a == b` compares the same object and prints `true`, while `128` falls outside the default cache and produces two distinct objects. A constructor could never do this, because `new` always creates a new object. The output also shows why `==` must not be used to compare boxed numbers — `equals` is the correct test.

`List.of` returns different hidden classes depending on how many elements it receives — in OpenJDK, a compact class for one or two elements and a general one for more. The class names are an implementation detail that may change between versions; what matters is that the caller sees only `List` and the library is free to optimise.

The advantages of static factories over constructors, then, are: they have **names** (`Duration.ofSeconds(5)` versus `Duration.ofMinutes(5)` say what the number means, which two constructors with one `long` parameter could not), they **need not create a new object**, and they **can return any subtype** of the declared return type. The drawbacks are that a class with only private constructors cannot be subclassed, and static factories are harder to spot in documentation than constructors — which is why naming conventions such as `of`, `from`, `valueOf`, `getInstance` and `newInstance` matter.

A static factory is not a substitute for the Simple Factory above when the choice depends on configuration: a static method is hard to replace in tests. Static factories suit value types and library APIs; configurable factories suit infrastructure.

## Factories and dependency injection

If you work with Spring, you may notice that most applications have few hand-written factory classes. That is because a **dependency-injection (DI) container** is, among other things, a very general factory. It reads configuration, decides which implementation of each interface to create, creates it once (by default, beans are singletons), and passes it to every class that declares it as a constructor parameter. See [[c5-ioc]] and [[c5-constructor-injection]].

Factories still appear inside DI-based applications, in three forms:

- **`@Bean` methods** in a `@Configuration` class are factory methods the container calls. A method that reads a property and returns either `SesNotifier` or `ConsoleNotifier` is a Simple Factory managed by Spring. Conditional annotations such as `@ConditionalOnProperty` express the same choice declaratively.
- **`FactoryBean`** is a Spring interface for objects whose job is to create another object with complex setup; see [[c5-factorybean]].
- **Runtime factories** remain necessary when the choice depends on data that only exists per request — the customer's chosen payment provider, the tenant of the current request. The container creates the registry once; the registry creates or looks up the product per request.

In an interview, "I'd register the implementations as beans and inject a `Map<String, PaymentGateway>`" is a strong answer to "how do you pick a gateway per request", because it combines DI with a registry and adds providers without editing a switch.

## In real systems

**Database and HTTP clients.** JDBC's `DriverManager.getConnection(url)` is a factory: the URL prefix (`jdbc:postgresql:`) selects the driver, which was discovered through `ServiceLoader`. HTTP client libraries use factories and builders to hide connection pools and TLS setup.

**Multi-tenant and multi-region systems.** A SaaS product that stores some tenants' data in the EU and others in the US uses a factory keyed by tenant region to return the right storage client. The domain code calls `storage.put(...)` and never mentions regions.

**Test doubles.** Factories make it trivial to substitute in-memory implementations in tests, as the Abstract Factory example showed. Many teams use exactly this split: one wiring for production, one for integration tests.

**Plugin systems.** IDEs, build tools and logging frameworks discover implementations at start-up and register them with a factory. SLF4J's `LoggerFactory.getLogger(...)` finds the logging backend on the classpath and returns a logger from it; your code never names Logback or Log4j.

**Observability.** Because factories are where implementations are chosen, they are the natural place to log the choice once at start-up: "notifier=smtp host=mail.internal". That single line answers many production questions.

## Trade-offs and alternatives

Factories centralise construction rules, validation and configuration, make implementations swappable, keep secrets and infrastructure details out of business code, and make testing with fakes straightforward. They also give the freedom to cache, pool or share instances without callers noticing.

The costs: an extra layer of indirection that is pure overhead for objects with one implementation and no configuration; a switch-based factory that grows with every type unless replaced by a registry; and, for Abstract Factory, a rigid interface that every factory must implement whenever a product is added. A factory that returns a concrete type, or that callers invoke from deep inside the domain, delivers the indirection without the decoupling.

Alternatives and neighbours:

- **A plain constructor** for value objects and classes with a single implementation.
- **A DI container** for wiring the application at start-up; write explicit factories only where the choice is per request or too complex for configuration.
- **[[d2-builder]]** when the problem is assembling one complex object step by step, not choosing which class to create. A factory answers "which?"; a builder answers "how, with these many options?".
- **Prototype** (cloning a configured instance) when creating from scratch is expensive and many similar objects are needed.

## Common mistakes

> [!MISTAKE] A factory for every class
> Wrapping `new Money(...)` or `new OrderLine(...)` in factories adds a layer with nothing to hide. Use a factory where there is a real choice of implementation, real configuration, or expensive or shared construction.

**Returning concrete types.** `static SmtpNotifier create()` lets callers depend on `SmtpNotifier`-specific methods, and swapping later breaks them. Declare the interface as the return type.

**Calling the factory from inside domain classes.** If `OrderService` calls `NotifierFactory.create(System.getenv())`, the service depends on the factory and the environment again, and tests cannot inject a fake. Call factories at the composition root and inject the results.

**The ever-growing switch.** A factory with dozens of cases edited by several teams is a merge-conflict magnet. Switch to a registry with registration at start-up, or let the DI container build the map.

**Validating lazily.** Discovering a missing setting when the first message is sent means discovering it in production. Create infrastructure objects at start-up so configuration errors fail the deployment.

**Confusing Factory Method with "any method that creates things".** In interviews, be precise: Factory Method is the inheritance-based pattern with an overridable creation hook. A static `create(String)` is a Simple Factory or static factory method.

**New instance when a shared one is needed.** A factory that builds a new HTTP client or database pool on every call exhausts connections. Decide deliberately whether a factory returns fresh objects or shared ones, and document it.

## Interview perspective

The most common factory question is deceptively simple: "why not use `new`?" A strong answer names the three couplings — to the class, to the construction details, and to the moment of creation — and then gives a concrete example, such as swapping a real payment gateway for a fake in tests or choosing a storage backend per environment.

> [!INTERVIEW] Distinguishing the variants crisply
> "A Simple Factory is one method that maps a key or config to an implementation. Factory Method is a GoF pattern where a base class calls an abstract `create` method and subclasses decide the class — it's Template Method applied to creation. Abstract Factory creates families of related products so they stay consistent, like a cloud factory that returns a blob store and a queue for the same environment. In a Spring app, most wiring is done by the container, and I'd write an explicit factory or registry only where the choice depends on per-request data."

Questions to prepare:

- **Factory versus Builder?** Factory decides which type (and hides how it is set up); Builder assembles one complex object from many optional parts.
- **How would you add a new provider without editing the factory?** A registry populated at start-up — by modules, `ServiceLoader`, or an injected `Map` of beans — with fail-fast on unknown keys.
- **Design object creation for test versus production.** Factories or DI profiles that produce in-memory implementations in tests; an Abstract Factory when the pieces must match.
- **Why does `Integer.valueOf(128) == Integer.valueOf(128)` print `false`?** The static factory caches only −128 to 127 by default; outside that range it creates new objects, and `==` compares references.
- **Where does Factory Method appear in frameworks?** Base classes with creation hooks that the framework calls from its own workflow.

## Practice

1. **Storage factory.** Define a `FileStore` interface with `LocalDiskStore` and `InMemoryStore` implementations. Write a factory that reads `storage=local|memory` and `storage.dir`, fails clearly when `storage.dir` is missing for local storage, and logs its choice.
2. **From switch to registry.** Convert the `NotifierFactory` switch into a registry. Make each notifier register itself from a single `registerDefaults(registry)` method, and add an `sms` notifier without editing the factory class.
3. **Factory Method to composition.** Rewrite `ReportExporter` as one class that receives a `Supplier<RowWriter>`. Compare the two designs: which is easier to configure from a setting, and which makes it easier to add several related hooks?
4. **Abstract Factory extension.** Add a `Cache` product to `InfraFactory`. Count how many classes you had to change, and explain what that says about when Abstract Factory is a good fit.
5. **Static factory naming.** Design static factories for a `Temperature` value type that can be created from Celsius or Fahrenheit, and explain why two constructors would not work.

## Quick revision {#quick-revision}

- Factories move "which class, and how is it built?" out of callers; callers depend on an interface.
- `new` couples a caller to the class, its construction details and the moment of creation; harmless for value objects, costly for infrastructure.
- Simple Factory: one method maps config or a key to an implementation; validate inputs; return the interface type.
- Registry: map key → `Supplier`; register at start-up; reject duplicates; unknown key lists known keys.
- Factory Method (GoF): base class workflow calls an overridable `createX()`; subclasses choose the product; a special case of Template Method.
- Abstract Factory (GoF): one method per product; each concrete factory yields a consistent family; adding a family is easy, adding a product touches every factory.
- Static factory methods (`List.of`, `Integer.valueOf`): named, may reuse instances, may return subtypes; `Integer` caches −128..127 by default.
- DI containers are general factories; `@Bean` methods and `FactoryBean` are factories inside Spring; per-request choices still need a registry.
- Call factories at the composition root, at start-up; never from deep inside domain logic.

## Key takeaways {#key-takeaways}

- A factory exists to hide the choice and construction of an implementation, so business code depends only on an interface.
- Simple Factory, Factory Method and Abstract Factory differ in who decides and what is created: a keyed method, a subclass hook, or a whole consistent family.
- Registries keep factories open for extension, and start-up validation turns configuration mistakes into deployment failures rather than production incidents.
- Static factory methods earn their place through names, instance reuse and freedom to return subtypes.
- In DI-based applications most wiring is the container's job; write explicit factories where the decision depends on runtime data.
