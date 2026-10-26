---
summary: Builder lets you assemble a complex object one named step at a time and only hands it over, validated and usually immutable, when you call build(). You will learn the problems it fixes — telescoping constructors and half-built mutable objects — how to write a correct builder in Java, and when records, withers or named parameters are the better choice.
difficulty: intermediate
minutes: 40
objectives:
  - Explain the telescoping-constructor and JavaBeans problems and how Builder solves both
  - Implement a fluent builder with required parameters, defaults, defensive copies and validation in build()
  - Compare Builder with Factory, records with compact constructors, and withers, and choose between them
  - Describe the original GoF Builder with a director and multiple representations, and recognise a step builder
  - Recognise builders in the JDK and common libraries and avoid the usual builder bugs
---

## Introduction

Some objects are simple to create: a point needs an `x` and a `y`. Others have a few required pieces and many optional ones. An email has a sender, recipients and a subject, and may have a body, carbon copies, a priority, attachments and a reply-to address. An HTTP request has a URI, and may have a method, headers, a body, a timeout and a protocol version. A database connection has a host, and may have a port, credentials, a pool size, TLS settings and timeouts.

Java has no named or default parameters, so creating such objects with constructors gets ugly fast. You either write a constructor with ten parameters — where the caller must remember which `true` means "HTML" and which `3` means "priority" — or you create an empty object and call setters, leaving it half-built and mutable in between.

The **Builder** pattern solves this with a separate object whose only job is to collect the pieces. You call one clearly named method per piece, in any order, skipping the optional ones, and finish with `build()`. The builder checks that the combination is valid and returns the finished object, which is typically **immutable** — it cannot change after construction.

```java
EmailMessage msg = EmailMessage.builder("shop@example.com")
        .to("ana@example.com")
        .subject("Order A-17 shipped")
        .priority(Priority.HIGH)
        .build();
```

You meet builders constantly in Java: `HttpRequest.newBuilder()` in the JDK's HTTP client, `StringBuilder`, Spring's `WebClient.builder()` and `UriComponentsBuilder`, Lombok's `@Builder`, Protocol Buffers' generated message builders, and the query builders in most database libraries.

## Before you start

- **Constructors and overloading** in Java — how one constructor can call another with `this(...)`. See [[c1-polymorphism]] for overloading.
- **Immutability** — why objects that cannot change are easier to share and reason about. See [[d1-immutability]] and [[c1-immutability]].
- **Records** (Java 16+) — compact immutable data classes, used in the comparison sections. See [[c1-records]].
- **Static nested classes** — the builder is usually a `static` class inside the product. See [[c1-static-nested]].

## The intuition

Think of ordering a sandwich at a counter. You do not shout one long sentence in a fixed order — "bread, filling, cheese, salad, sauce, toasted, cut" — with blanks for the things you do not want. You say each choice as it comes to mind: "sourdough... chicken... no cheese... add pickles... toasted, please." The person making it collects your choices. Only when you say "that's it" do they assemble the sandwich, and if you asked for something impossible — toasted salad with no bread — they tell you before making it.

The counter worker is the builder. Each instruction is a named step. Steps you skip get sensible defaults. "That's it" is `build()`, the single moment where the combination is checked and the finished product is handed over. And once the sandwich is wrapped, you do not modify it; you order another.

The analogy breaks in one place: the counter worker forgets your order once the sandwich is made, but a builder object keeps its accumulated state after `build()`. Whether calling `build()` twice is safe depends on how the builder is written, which we will look at closely.

## Problem 1: telescoping constructors

The traditional Java answer to optional parameters is a chain of overloaded constructors, each adding one more parameter and delegating to the next. It is called the **telescoping constructor** pattern, because the parameter lists extend like a telescope — and it is generally considered an anti-pattern.

```java title="Telescoping.java"
public class Telescoping {

    static final class Email {
        final String to, subject, body;
        final boolean html;
        final int priority;

        Email(String to, String subject) { this(to, subject, ""); }
        Email(String to, String subject, String body) { this(to, subject, body, false); }
        Email(String to, String subject, String body, boolean html) {
            this(to, subject, body, html, 3);
        }
        Email(String to, String subject, String body, boolean html, int priority) {
            this.to = to; this.subject = subject; this.body = body;
            this.html = html; this.priority = priority;
        }
    }

    public static void main(String[] args) {
        // Subject and body swapped by mistake: same types, so it compiles.
        Email e = new Email("ana@example.com", "Your order has shipped and will arrive...",
                "Order A-17", true, 1);
        System.out.println("subject = " + e.subject);
    }
}
```

```output
subject = Your order has shipped and will arrive...
```

The call site in `main` is the problem. Three `String`s in a row, a bare `true` and a bare `1`: nothing tells the reader which is which, and the compiler cannot help because the types match. The body has ended up in the subject, and the program happily prints it. With five parameters this is irritating; with twelve it produces real production bugs. The constructors also force an order: to set the priority you must also pass a body and an HTML flag, even if you want their defaults. And the number of overloads grows with every new optional field.

## Problem 2: JavaBeans setters

The other traditional answer is the **JavaBeans** style: a no-argument constructor followed by setters.

```java
Email e = new Email();
e.setTo("ana@example.com");
e.setSubject("Order A-17 shipped");
e.setHtml(true);
```

This reads well — each value is labelled — but it trades one problem for three others. Between the constructor and the last setter the object exists in an **inconsistent state**: if any code uses it before `setSubject` runs, it sees an email without a subject. The class cannot enforce rules such as "subject is required", because there is no single moment at which construction is "finished". And the object must be **mutable**, so it cannot be safely shared between threads or used as a map key, and anyone holding a reference can change it later.

Builder combines the readability of setters with the safety of a constructor: values are labelled, but the real object is created in one step, already complete.

## The fluent builder

Here is a complete builder in the style popularised by Joshua Bloch's *Effective Java*. It is the form you should be able to write from memory.

```java title="EmailBuilderDemo.java"
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class EmailBuilderDemo {

    enum Priority { LOW, NORMAL, HIGH }

    /** The product: immutable and always valid once constructed. */
    static final class EmailMessage {
        private final String from;
        private final List<String> to;
        private final List<String> cc;
        private final String subject;
        private final String body;
        private final Priority priority;

        // Private: the only way in is through the builder, so validation cannot be skipped.
        private EmailMessage(Builder b) {
            this.from = b.from;
            this.to = List.copyOf(b.to);    // defensive copies: later builder edits
            this.cc = List.copyOf(b.cc);    // cannot leak into this object
            this.subject = b.subject;
            this.body = b.body;
            this.priority = b.priority;
        }

        static Builder builder(String from) { return new Builder(from); }

        @Override public String toString() {
            return "Email[from=" + from + ", to=" + to + ", cc=" + cc + ", subject=" + subject
                    + ", priority=" + priority + ", body=" + body.length() + " chars]";
        }

        static final class Builder {
            private static final int MAX_RECIPIENTS = 50;

            private final String from;                 // required: taken up front
            private final List<String> to = new ArrayList<>();
            private final List<String> cc = new ArrayList<>();
            private String subject;
            private String body = "";                  // optional, with defaults
            private Priority priority = Priority.NORMAL;

            private Builder(String from) {
                this.from = Objects.requireNonNull(from, "from");
            }

            Builder to(String address) { to.add(address); return this; }
            Builder cc(String address) { cc.add(address); return this; }
            Builder subject(String subject) { this.subject = subject; return this; }
            Builder body(String body) { this.body = Objects.requireNonNull(body); return this; }
            Builder priority(Priority p) { this.priority = Objects.requireNonNull(p); return this; }

            EmailMessage build() {
                // Rules that involve several fields can only be checked here.
                if (to.isEmpty()) throw new IllegalStateException("at least one 'to' required");
                if (subject == null || subject.isBlank()) {
                    throw new IllegalStateException("subject required");
                }
                if (to.size() + cc.size() > MAX_RECIPIENTS) {
                    throw new IllegalStateException("more than " + MAX_RECIPIENTS + " recipients");
                }
                return new EmailMessage(this);
            }
        }
    }

    public static void main(String[] args) {
        EmailMessage.Builder builder = EmailMessage.builder("shop@example.com")
                .to("ana@example.com")
                .subject("Order A-17 shipped")
                .priority(Priority.HIGH);

        EmailMessage first = builder.build();
        EmailMessage second = builder.cc("support@example.com").body("Tracking: 1Z999").build();
        System.out.println(first);
        System.out.println(second);

        try {
            EmailMessage.builder("shop@example.com").to("ana@example.com").build();
        } catch (IllegalStateException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
```

```output
Email[from=shop@example.com, to=[ana@example.com], cc=[], subject=Order A-17 shipped, priority=HIGH, body=0 chars]
Email[from=shop@example.com, to=[ana@example.com], cc=[support@example.com], subject=Order A-17 shipped, priority=HIGH, body=15 chars]
rejected: subject required
```

Each part of this code is doing a specific job.

**The product's constructor is private.** The only way to obtain an `EmailMessage` is through `Builder.build()`, so the validation in `build()` cannot be bypassed. A public constructor alongside the builder would let callers skip every rule — a common mistake.

**All product fields are `final`.** Once constructed, an `EmailMessage` cannot change. It can be passed between threads, cached and logged without anyone worrying that it will be modified underneath them.

**Required values go through `builder(from)`, optional ones through methods.** The sender is required, so it is a parameter of the method that creates the builder; you cannot get a builder without one. Optional values have defaults (`body = ""`, `priority = NORMAL`), so callers set only what they care about. Putting *every* required field in the builder's constructor would bring back the telescoping problem, so many designs take only the one or two most essential values up front and check the rest in `build()`, as this one does for `to` and `subject`.

**Each setter returns `this`.** That is what makes calls chain — the style called a **fluent interface**. It is a convenience, not the essence of the pattern; the essence is collecting state separately and producing the object in one validated step.

**`build()` validates the whole combination.** Some rules involve one field and could be checked in its setter, like `requireNonNull` on `body`. Others involve several — "to plus cc must not exceed 50" — and can only be checked once all values are known. Checking everything in `build()` gives one clear place for the rules and guarantees that every `EmailMessage` in the system satisfies them. Rules are checked against the builder's fields *before* the product is constructed; the product's constructor can also re-check them if other code paths create it.

**The product copies the lists.** Look at the output: `first` was built, then the same builder had a `cc` and a `body` added before building `second`. `first` still shows `cc=[]` and an empty body. That is because the product's constructor used `List.copyOf`, which makes an unmodifiable copy. Without the copy, `first.cc` and the builder's `cc` would be the same `ArrayList`, and adding `support@example.com` for the second email would silently add it to the first — an email that has already been "built" and perhaps already queued for sending. **Defensive copying** is what makes a builder safe to reuse as a template.

> [!WARNING] Builders are not thread-safe
> The builder is a mutable object with no synchronisation. Fill and build it within one thread, typically within one method. The product is what you share between threads, not the builder.

## Builders in the JDK

The JDK's own HTTP client (Java 11+) is a good example of a production builder.

```java title="JdkBuilders.java"
import java.net.URI;
import java.net.http.HttpRequest;
import java.time.Duration;

public class JdkBuilders {
    public static void main(String[] args) {
        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.example.com/orders"))
                .timeout(Duration.ofSeconds(5))
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"sku\":\"A-1\"}"))
                .build();
        System.out.println(request.method() + " " + request.uri());
        System.out.println(request.timeout());
        System.out.println(request.headers().map());

        try {
            // The builder validates each step, not only build().
            HttpRequest.newBuilder(URI.create("https://api.example.com")).header("Host", "x");
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 3; i++) sb.append(i).append(i < 3 ? "," : "");
        System.out.println(sb.toString());
    }
}
```

```output
POST https://api.example.com/orders
Optional[PT5S]
{Accept=[application/json]}
rejected: restricted header name: "Host"
1,2,3
```

No network call happens here; `build()` only creates the immutable request object. Notice three design choices. The required piece, the URI, is a parameter of `newBuilder`. The optional timeout is exposed as an `Optional<Duration>` on the product, because "no timeout set" is a meaningful state. And some validation happens *in the setter*: the HTTP client manages the `Host` header itself, so `header("Host", ...)` is rejected immediately (by default; a system property, `jdk.httpclient.allowRestrictedHeaders`, can relax this). Validate early when a single value is invalid on its own; validate in `build()` when the rule needs several values.

`StringBuilder` is named after the pattern and shares its shape — accumulate pieces with `append`, produce the final immutable `String` with `toString()`. It is less a "complex object with options" builder than an efficient mutable buffer: building a `String` by repeated `+` in a loop creates a new string each time, while `StringBuilder` appends into one growing array.

## The original GoF Builder: director and representations

The fluent builder above is the version most developers mean today. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) described a broader idea: **separate the construction process from the representation, so that the same process can create different representations.** It involves two roles beyond the product:

- A **builder interface** with one method per construction step, and several concrete builders that produce different outputs from the same steps.
- A **director** that knows the *order* of steps for a particular kind of product, and drives any builder through them.

```java title="ReceiptDirector.java"
import java.util.List;

public class ReceiptDirector {

    record Line(String item, int qty, long unitCents) {}

    /** GoF-style builder interface: the same steps, different representations. */
    interface ReceiptBuilder {
        void title(String shop);
        void line(Line line);
        void total(long cents);
        String result();
    }

    static final class TextReceipt implements ReceiptBuilder {
        private final StringBuilder out = new StringBuilder();
        public void title(String shop) { out.append("== ").append(shop).append(" ==\n"); }
        public void line(Line l) {
            out.append(String.format("%-8s x%d %8s%n", l.item(), l.qty(), money(l.qty() * l.unitCents())));
        }
        public void total(long cents) { out.append(String.format("TOTAL %15s", money(cents))); }
        public String result() { return out.toString(); }
    }

    static final class HtmlReceipt implements ReceiptBuilder {
        private final StringBuilder out = new StringBuilder();
        public void title(String shop) { out.append("<h1>").append(shop).append("</h1><ul>"); }
        public void line(Line l) {
            out.append("<li>").append(l.item()).append(" x").append(l.qty()).append("</li>");
        }
        public void total(long cents) { out.append("</ul><p>Total: ").append(money(cents)).append("</p>"); }
        public String result() { return out.toString(); }
    }

    /** The director: knows the order of steps, not the output format. */
    static String buildReceipt(ReceiptBuilder b, String shop, List<Line> lines) {
        b.title(shop);
        long total = 0;
        for (Line l : lines) {
            b.line(l);
            total += l.qty() * l.unitCents();
        }
        b.total(total);
        return b.result();
    }

    static String money(long cents) { return String.format("$%d.%02d", cents / 100, cents % 100); }

    public static void main(String[] args) {
        List<Line> lines = List.of(new Line("Coffee", 2, 350), new Line("Bagel", 1, 275));
        System.out.println(buildReceipt(new TextReceipt(), "Corner Cafe", lines));
        System.out.println(buildReceipt(new HtmlReceipt(), "Corner Cafe", lines));
    }
}
```

```output
== Corner Cafe ==
Coffee   x2    $7.00
Bagel    x1    $2.75
TOTAL           $9.75
<h1>Corner Cafe</h1><ul><li>Coffee x2</li><li>Bagel x1</li></ul><p>Total: $9.75</p>
```

The director, `buildReceipt`, contains the logic of *what a receipt consists of* — title, one line per item, total — and computes the total once. It does not know whether it is producing text or HTML. Each builder knows one output format and nothing about receipts' structure. Adding a PDF receipt is a new builder; adding a "discount" line to every receipt is one change in the director.

In fluent-builder code, a director appears in a lighter form: a method that applies a preset recipe to a builder, such as `EmailTemplates.passwordReset(EmailMessage.builder(noReply), user)`, which sets the subject, body and priority every password-reset email shares. Use a director when the same sequence of steps is repeated in several places or when the order of steps encodes domain knowledge.

## Step builders: required fields at compile time

The fluent builder checks required fields at runtime, in `build()`. A **step builder** (also called a staged builder) moves that check to compile time. Each required step returns an interface that offers *only the next step*, and `build()` appears only once every required step has been called.

```java title="StepBuilder.java"
public class StepBuilder {

    record Connection(String host, int port, String user, boolean tls) {}

    // Each required step returns an interface that offers only the next step.
    interface HostStep { PortStep host(String host); }
    interface PortStep { UserStep port(int port); }
    interface UserStep { OptionalStep user(String user); }
    interface OptionalStep {
        OptionalStep tls(boolean tls);
        Connection build();
    }

    static HostStep connection() {
        return new Steps();
    }

    private static final class Steps implements HostStep, PortStep, UserStep, OptionalStep {
        private String host, user;
        private int port;
        private boolean tls = true;
        public PortStep host(String host) { this.host = host; return this; }
        public UserStep port(int port) { this.port = port; return this; }
        public OptionalStep user(String user) { this.user = user; return this; }
        public OptionalStep tls(boolean tls) { this.tls = tls; return this; }
        public Connection build() { return new Connection(host, port, user, tls); }
    }

    public static void main(String[] args) {
        Connection c = connection().host("db.internal").port(5432).user("app").build();
        System.out.println(c);
        // connection().host("db.internal").build();  // does not compile: no build() on PortStep
    }
}
```

```output
Connection[host=db.internal, port=5432, user=app, tls=true]
```

The commented-out line would not compile, because `host(...)` returns a `PortStep`, which has no `build()` method. IDE autocompletion also guides the caller through the required fields in order. The price is an interface per required step and a fixed order, so step builders suit APIs with a few required fields used by many callers — public library APIs especially — and are overkill inside an application.

## Builder versus records, withers and named parameters

Builder is not the only way to construct objects with many fields, and in modern Java it is often not the best.

**Records with compact constructors.** If an object has only a few fields and all are required, a record is shorter and equally safe: the compact constructor validates every creation path.

```java title="RecordWithers.java"
import java.time.Duration;

public class RecordWithers {

    record RetryPolicy(int maxAttempts, Duration initialDelay, double multiplier) {
        static final RetryPolicy DEFAULT = new RetryPolicy(3, Duration.ofMillis(200), 2.0);

        RetryPolicy {   // compact constructor: validates every way of creating one
            if (maxAttempts < 1) throw new IllegalArgumentException("maxAttempts < 1");
            if (initialDelay.isNegative()) throw new IllegalArgumentException("negative delay");
            if (multiplier < 1.0) throw new IllegalArgumentException("multiplier < 1");
        }

        RetryPolicy withMaxAttempts(int n) { return new RetryPolicy(n, initialDelay, multiplier); }
        RetryPolicy withInitialDelay(Duration d) { return new RetryPolicy(maxAttempts, d, multiplier); }
    }

    public static void main(String[] args) {
        RetryPolicy aggressive = RetryPolicy.DEFAULT
                .withMaxAttempts(5)
                .withInitialDelay(Duration.ofMillis(50));
        System.out.println(RetryPolicy.DEFAULT);
        System.out.println(aggressive);
        try {
            RetryPolicy.DEFAULT.withMaxAttempts(0);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
```

```output
RetryPolicy[maxAttempts=3, initialDelay=PT0.2S, multiplier=2.0]
RetryPolicy[maxAttempts=5, initialDelay=PT0.05S, multiplier=2.0]
rejected: maxAttempts < 1
```

**Withers** — methods like `withMaxAttempts` that return a modified copy — combine well with a `DEFAULT` instance: start from sensible defaults and change only what differs. `java.time` uses this style (`date.withYear(2027)`). Every wither goes through the compact constructor, so validation still holds. The downside is that each wither creates an intermediate object and can only validate rules on the full set of fields at each step, which makes cross-field rules awkward when two fields must change together.

**Named and default parameters.** Kotlin, Python, C# and TypeScript (through options objects) let callers write `Email(to = "...", subject = "...", priority = HIGH)` with defaults for the rest. That removes most of the reason for builders in those languages. In JavaScript and TypeScript, a single options object — `sendEmail({ to, subject, priority: 'high' })` — is the idiomatic equivalent, with validation at the top of the function.

**Code generation.** Lombok's `@Builder` and the Immutables library generate builder classes from an annotated type, removing the boilerplate of duplicating every field. They are widely used in Spring codebases; know what code they generate (a static nested builder, setter-style methods, a `build()` that calls an all-arguments constructor) and that validation still has to be added yourself.

| Situation | Good choice |
|---|---|
| 2–4 fields, all required | Constructor or record with compact-constructor validation |
| Many optional fields, cross-field rules | Builder with validation in `build()` |
| Start from defaults, change one or two settings | Record with a `DEFAULT` and withers |
| Same step sequence repeated in several places | Builder plus a director or preset method |
| Public API whose required fields must be enforced by the compiler | Step builder |
| Kotlin, Python or TypeScript | Named or default parameters, or an options object |

## Builder versus Factory

Both are creational patterns, so they are often confused. They answer different questions. A **factory** ([[d2-factory]]) answers *which* object to create — given a key or configuration, which implementation of an interface — and hides how. A **builder** answers *how* to assemble one specific, complex object from many parts. A factory call usually takes a few arguments and returns immediately; a builder is a conversation of several calls ending with `build()`.

They combine naturally: a factory may use a builder internally to assemble the product it chose, and a builder may be obtained from a factory method (`HttpRequest.newBuilder()` is a static factory method that returns a builder).

```quiz
Q: A builder stores recipients in an `ArrayList` and the product's constructor assigns `this.to = b.to` without copying. What goes wrong?
- [ ] Nothing, because the product's field is declared `final`
- [x] Adding a recipient to the builder after `build()` also changes the already-built product
- [ ] The code does not compile, because a builder cannot pass a list to the product
- [ ] `build()` can only be called once
> `final` stops the field from pointing to a different list, but the list itself is still mutable and shared with the builder. Any later `builder.to(...)` call adds to the same `ArrayList`, so a supposedly immutable product changes. `List.copyOf` in the product's constructor makes an independent, unmodifiable copy.
```

## In real systems

**HTTP and API clients.** `HttpRequest.newBuilder()`, Spring's `WebClient.builder()` and `RestClient.builder()`, and the AWS SDK's request builders (`PutObjectRequest.builder().bucket(...).key(...).build()`) all use builders, because requests have many optional settings and must be immutable to be retried or logged safely.

**Configuration objects.** Thread pools, connection pools, caches and retry policies are configured with builders in many libraries — Caffeine's `Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(...)`, for example — and the built object is shared across the application.

**Queries.** SQL and search query builders (jOOQ, Criteria API, Elasticsearch clients) build a query tree step by step, which is far safer than concatenating strings, because values are bound as parameters rather than spliced into SQL — closing the door to SQL injection.

**Tests.** The **test data builder** is a common testing technique: `anOrder().withStatus(PAID).withItems(2).build()` creates valid test objects with sensible defaults, so each test states only what it cares about. When a new required field is added to `Order`, only the builder's default changes, not hundreds of tests.

**Serialisation formats.** Protocol Buffers generates an immutable message class plus a builder for each message type; the builder is the only way to set fields, and with proto2 `required` fields, `build()` throws if one is missing (proto3 has no required fields).

## Trade-offs and alternatives

A builder makes construction of complex objects readable, with every value labelled; centralises validation so every product satisfies the rules; lets the product be immutable; and supports defaults and presets. With a director, it also separates the order of construction from the output format.

The costs: boilerplate, because every field is declared twice (once in the builder, once in the product) unless generated; an extra object allocated per construction (rarely significant); errors for missing required fields arrive at runtime rather than compile time, unless you use a step builder; and for objects with a handful of required fields, a builder is ceremony with no benefit.

## Common mistakes

> [!MISTAKE] A public constructor next to the builder
> If the product also has a public constructor, callers can bypass `build()` and every validation rule with it. Make the product's constructor private, so the builder is the only way in.

**Not validating in `build()`.** A builder that only stores values and passes them on gives readability but none of the safety. Missing required fields then surface far away from the code that forgot them, as `NullPointerException`s in whatever uses the product.

**Sharing mutable state between builder and product.** Assigning collections or arrays without copying lets later builder calls modify a built product. Copy in the product's constructor (`List.copyOf`, `Map.copyOf`, `array.clone()`).

**Reusing a builder across threads.** Builders are mutable and unsynchronised. Create one per construction, or per thread.

**Builder for a two-field object.** `Point.builder().x(1).y(2).build()` is longer than `new Point(1, 2)` and adds nothing. Reach for a builder when there are many optional fields or real validation rules.

**Exposing the builder after `build()`.** Some designs keep a reference to the builder inside the product, for example to support "copy and modify". If the builder is mutable and reachable, the product is no longer truly immutable. Offer a `toBuilder()` method that creates a *new* builder pre-filled from the product instead.

## Interview perspective

Interviewers typically ask "when would you use a builder?", "what is the telescoping constructor problem?", and "builder versus factory?". In low-level design problems, builders show up for configuration-heavy objects: a `Notification` with channels, priority and template variables in [[d3-notification-service]], or a `Logger` configuration in [[d3-logging-framework]].

> [!INTERVIEW] What a strong answer covers
> "I use a builder when an object has several optional fields or cross-field validation. It fixes telescoping constructors, where the caller can't tell which positional argument is which, and the JavaBeans problem of half-built mutable objects. The product has a private constructor and final fields; required values go into the builder's creation method, optional ones get defaults; `build()` validates and the product makes defensive copies, so it's immutable and safe to share. For a few required fields I'd use a record instead."

Questions to prepare:

- **Builder versus Factory?** Builder assembles one complex object step by step; Factory decides which implementation to create.
- **How do you make required fields mandatory?** Take them in the builder's creation method, check them in `build()`, or use a step builder for compile-time enforcement.
- **Is a builder thread-safe?** No — it is mutable. The immutable product is what is shared.
- **What is the director for?** It encodes the order of construction steps for a kind of product, independent of which builder (representation) is used.
- **Why not setters?** Inconsistent intermediate states, no single validation point, and mutability.
- **Builder versus records?** Records suit small all-required types; builders suit many optional fields and cross-field rules.

## Practice

1. **Pizza builder.** Build an immutable `Pizza` with a required size, optional crust (default `CLASSIC`), and a list of toppings. Reject more than eight toppings and reject `GLUTEN_FREE` crust with `EXTRA_LARGE` size in `build()`.
2. **Find the leak.** Remove `List.copyOf` from `EmailMessage` and write a short program that shows the first email changing after the second is built. Then restore the copy.
3. **`toBuilder()`.** Add a `toBuilder()` method to `EmailMessage` that returns a new builder pre-filled with the message's values, and use it to create a reply.
4. **Test data builder.** Write `OrderTestBuilder` with defaults for every field and three `with...` methods. Use it to create three orders that differ only in status.
5. **Choose the tool.** For each of these — `Money(amount, currency)`, an HTTP client configuration with fifteen settings, a `DateRange(start, end)` that requires start before end, and a library API with three mandatory connection parameters — choose constructor, record, builder or step builder, and justify it.

## Quick revision {#quick-revision}

- Builder: a separate object collects values through named steps; `build()` validates and returns the finished, usually immutable, product.
- Fixes telescoping constructors (unreadable positional arguments, forced ordering) and JavaBeans setters (half-built, mutable, no validation point).
- Fluent builder checklist: private product constructor, final fields, required values in `builder(...)`, defaults for optional values, setters return `this`, validation in `build()`, defensive copies of collections.
- Validate single values early in setters when useful; validate cross-field rules in `build()`.
- Builders are mutable and not thread-safe; share the product, not the builder.
- GoF Builder: builder interface with several representations plus a director that owns the step order.
- Step builder: interfaces per required step give compile-time enforcement, at the cost of more types and a fixed order.
- Alternatives: records with compact constructors, `DEFAULT` plus withers, named parameters or options objects, Lombok/Immutables code generation.
- Builder answers "how is this one object assembled?"; Factory answers "which implementation?".
- JDK and library examples: `HttpRequest.newBuilder()`, `StringBuilder`, `WebClient.builder()`, AWS SDK request builders, Protocol Buffers builders.

## Key takeaways {#key-takeaways}

- Builder exists because Java constructors cannot name or default their parameters, and setters leave objects half-built and mutable.
- A correct builder makes the product's constructor private, validates the full combination in `build()`, and copies mutable inputs so the product is truly immutable.
- The original GoF form separates the order of construction (the director) from the output format (the builders); the fluent form is what most modern code uses.
- For small all-required types, prefer records; for compile-time enforcement of required fields in public APIs, consider a step builder.
- Factory and Builder are complementary: one chooses the type, the other assembles a complex instance.
