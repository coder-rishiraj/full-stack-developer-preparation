---
summary: Adapter wraps a class whose interface does not fit, so your code can use it through the interface it already expects. You will learn how to write an adapter that translates units, data and errors rather than merely renaming methods, where adapters belong in an architecture, and how Adapter differs from Facade, Decorator and Proxy.
difficulty: intermediate
minutes: 40
objectives:
  - Explain the problem Adapter solves and identify the client, target, adapter and adaptee
  - Implement an object adapter for a third-party SDK that translates units, data shapes and errors without leaking vendor types
  - Compare object adapters with class adapters and justify preferring composition
  - Place adapters correctly in a ports-and-adapters (hexagonal) architecture and use them to make code testable
  - Distinguish Adapter from Facade, Decorator and Proxy by what each changes
---

## Introduction

Your application charges customers through an interface you designed: `PaymentGateway.charge(customerId, Money)`, which returns either an approval or a decline. The business picks a new payment provider, and its Java SDK looks nothing like that. It wants the amount as a decimal string in major currency units rather than a number of cents, calls the customer an "account reference", returns a loosely typed map with single-letter status codes, and reports outages by throwing its own checked exception. You cannot change the SDK, and you do not want to change the dozens of places in your code that call `PaymentGateway`.

The **Adapter** pattern solves exactly this. You write one class that implements the interface your code expects and, inside, calls the SDK, translating everything that differs: method names, parameter shapes, units, return values and errors. Your code keeps calling `charge`; only the adapter knows the SDK exists. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes it as converting the interface of a class into another interface clients expect, letting classes work together that could not otherwise.

Adapters are among the most common classes in real codebases, even when they are not named after the pattern. Every integration with a third-party API, every wrapper around a legacy system during a migration, every mapping from an external data format to your domain model is an adapter. The JDK contains several, and an entire architectural style — "ports and adapters", also called hexagonal architecture — is named after them.

## Before you start

- **Interfaces** — the adapter implements an interface the client already depends on. See [[c1-interfaces]] and [[d1-interfaces]].
- **Composition** — the usual adapter holds the adapted object in a field and delegates to it. See [[d1-composition-vs-inheritance]].
- **Exceptions in Java**, including checked versus unchecked, for the error-translation section. See [[c1-exceptions]] and [[c1-custom-exceptions]].
- **Dependency Inversion** from [[d1-solid]] — your core code should define the interfaces it needs, and outside details should conform to them.

## The intuition

A travel plug adapter is the standard picture, and it is a good one. Your laptop charger has a UK plug; the wall in New York has a US socket. You do not rewire the charger or the building. You put a small device between them that accepts the UK plug on one side and fits the US socket on the other. The charger does not know it is in America.

The roles map cleanly:

- The **client** is the code that needs something done — the laptop, or your checkout logic.
- The **target** is the interface the client expects — the UK socket shape, or `PaymentGateway`.
- The **adaptee** is the existing thing with the wrong interface — the US socket, or the vendor SDK.
- The **adapter** implements the target and calls the adaptee — the plug adapter, or `AcmePayAdapter`.

The analogy hides one important detail. A plug adapter only changes the *shape*; it does not convert voltage. Many travellers have destroyed a hair dryer by assuming otherwise. Software adapters regularly have to do both: change the shape of the call *and* convert what flows through it — cents to decimal strings, vendor status codes to your result types, vendor exceptions to your exceptions. An adapter that only renames methods is often the software equivalent of the fried hair dryer: it compiles, and then fails on the first value that means something different on the other side.

## The structure

```mermaid title="Adapter: the client depends only on the target interface"
classDiagram
  class Checkout
  class PaymentGateway {
    <<interface>>
    +charge(customerId, Money) ChargeResult
  }
  class AcmePayAdapter {
    -client: AcmePayClient
    +charge(customerId, Money) ChargeResult
  }
  class AcmePayClient {
    +processPayment(ref, amount, currency) Map
  }
  Checkout --> PaymentGateway
  PaymentGateway <|.. AcmePayAdapter
  AcmePayAdapter --> AcmePayClient : delegates and translates
```

`Checkout` depends on `PaymentGateway` and nothing else. `AcmePayAdapter` implements that interface and holds an `AcmePayClient`. The SDK class is unchanged — the adapter wraps it; it does not modify it. Nothing in the application outside the adapter imports anything from the vendor.

## A complete adapter

The program below contains all four roles. The "vendor SDK" is a small class written here so the example runs without a network, but its shape — decimal strings, a map of codes, a checked exception — is typical of real payment SDKs.

```java title="PaymentAdapterDemo.java"
import java.math.BigDecimal;
import java.util.Currency;
import java.util.HashMap;
import java.util.Map;

public class PaymentAdapterDemo {

    // ---- Our side: the interface the application is written against (the target).
    record Money(long minorUnits, String currency) {}

    sealed interface ChargeResult permits Approved, Declined {}
    record Approved(String transactionId) implements ChargeResult {}
    record Declined(String reason) implements ChargeResult {}

    /** Thrown for failures that are not a decision about the card. */
    static final class PaymentUnavailableException extends RuntimeException {
        PaymentUnavailableException(String message, Throwable cause) { super(message, cause); }
    }

    interface PaymentGateway {
        ChargeResult charge(String customerId, Money amount);
    }

    // ---- Their side: a vendor SDK we cannot change (the adaptee).
    static final class AcmePayClient {
        static final class AcmeException extends Exception {
            final int code;
            AcmeException(int code, String msg) { super(msg); this.code = code; }
        }

        /** Amount as a decimal string in major units; returns a loosely typed map. */
        Map<String, String> processPayment(String accountRef, String amount, String currencyCode)
                throws AcmeException {
            if (accountRef.startsWith("timeout")) throw new AcmeException(503, "gateway timeout");
            Map<String, String> response = new HashMap<>();
            if (new BigDecimal(amount).compareTo(new BigDecimal("10000.00")) > 0) {
                response.put("status", "R");
                response.put("reason_code", "51");
            } else {
                response.put("status", "A");
                response.put("txn", "acme-" + accountRef + "-" + amount);
            }
            return response;
        }
    }

    // ---- The adapter: implements our interface, translates every difference.
    static final class AcmePayAdapter implements PaymentGateway {
        private final AcmePayClient client;

        AcmePayAdapter(AcmePayClient client) { this.client = client; }

        @Override
        public ChargeResult charge(String customerId, Money amount) {
            // Units: our minor units -> their decimal string in major units.
            // Not always /100: JPY has no minor unit, BHD has three digits.
            int digits = Currency.getInstance(amount.currency()).getDefaultFractionDigits();
            String decimal = BigDecimal.valueOf(amount.minorUnits(), digits).toPlainString();
            try {
                Map<String, String> r = client.processPayment(customerId, decimal, amount.currency());
                // Data: their status codes -> our result types.
                return switch (r.get("status")) {
                    case "A" -> new Approved(r.get("txn"));
                    case "R" -> new Declined(declineReason(r.get("reason_code")));
                    default -> throw new IllegalStateException("Unexpected status: " + r);
                };
            } catch (AcmePayClient.AcmeException e) {
                // Errors: their checked exception -> our domain exception.
                throw new PaymentUnavailableException("AcmePay error " + e.code, e);
            }
        }

        private static String declineReason(String code) {
            return switch (code) {
                case "51" -> "insufficient funds";
                case "54" -> "card expired";
                default -> "declined (code " + code + ")";
            };
        }
    }

    // ---- Application code: knows only PaymentGateway.
    static void checkout(PaymentGateway gateway, String customer, Money amount) {
        try {
            System.out.println(customer + " -> " + gateway.charge(customer, amount));
        } catch (PaymentUnavailableException e) {
            System.out.println(customer + " -> retry later: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        PaymentGateway gateway = new AcmePayAdapter(new AcmePayClient());
        checkout(gateway, "cus_1", new Money(4_250, "EUR"));
        checkout(gateway, "cus_2", new Money(1_250_000, "EUR"));
        checkout(gateway, "cus_3", new Money(5_000, "JPY"));
        checkout(gateway, "timeout_4", new Money(999, "EUR"));
    }
}
```

```output
cus_1 -> Approved[transactionId=acme-cus_1-42.50]
cus_2 -> Declined[reason=insufficient funds]
cus_3 -> Approved[transactionId=acme-cus_3-5000]
timeout_4 -> retry later: AcmePay error 503
```

The application's view of payments is small and precise: an amount is a `Money` with an integer number of minor units (cents, pence) and a currency code; a result is a sealed choice between `Approved` and `Declined`; and "the payment system is unavailable" is a distinct exception, because it calls for a different reaction — retry later — than a declined card. The `checkout` method uses only these types.

Now look at what the adapter translates. It is far more than a renamed method.

**Units.** The application stores 4,250 minor units of euros; the vendor wants the string `"42.50"`. The adapter does not divide by 100. It asks `java.util.Currency` how many fraction digits the currency uses — two for EUR, zero for JPY, three for some currencies such as the Bahraini dinar — and builds a `BigDecimal` with that scale. The third call shows why: 5,000 yen is sent as `"5000"`, not `"50.00"`. A naive divide-by-100 adapter would charge a Japanese customer one hundredth of the price, and every test written in euros would pass. Conversions like this are where adapter bugs live.

**Names and shapes.** The vendor's `accountRef` is our `customerId`; three separate parameters come from our two. In real integrations this extends to field names, date formats, time zones and enumerations.

**Return values.** The vendor answers with a `Map` in which `"A"` means approved and `"R"` means rejected, with a numeric reason code. The adapter turns that into `Approved` or `Declined`, and translates reason `"51"` into the readable `"insufficient funds"`. An unknown status is not guessed at; it raises an error naming the unexpected response, because silently treating an unknown status as approval would be a costly bug.

**Errors.** The vendor throws a checked `AcmeException` with a numeric code. If that escaped, every caller would need to catch a vendor type, and swapping vendors would mean changing every `catch`. The adapter catches it and throws the application's own `PaymentUnavailableException`, keeping the original as the **cause** so the stack trace and vendor code are not lost for debugging.

The result is that the vendor can be replaced by writing one new class — a `StripeAdapter` implementing the same `PaymentGateway` — and changing one line where the adapter is constructed. Nothing else in the application changes.

> [!IMPORTANT] Do not leak the adaptee's types
> If any method of the target interface accepts or returns a vendor type — an SDK `Charge` object, a vendor enum, a vendor exception — the adapter has failed at its main job. The vendor's model has leaked into your code, and replacing the vendor now means changing every caller.

## Adapters make code testable

Because the application depends on `PaymentGateway`, tests can supply a different implementation that never touches the network:

```java title="Test fake (fragment)"
final class FakeGateway implements PaymentGateway {
    final List<Money> charged = new ArrayList<>();
    public ChargeResult charge(String customerId, Money amount) {
        charged.add(amount);
        return amount.minorUnits() > 100_000 ? new Declined("limit") : new Approved("fake-1");
    }
}
```

Checkout tests now run in milliseconds, can produce declines and outages on demand, and can assert exactly what was charged. The real adapter gets its own, smaller set of tests: unit tests for the translation logic (including the yen case), and **contract tests** against the vendor's sandbox environment to catch changes in the vendor's behaviour. This split — fast tests of business logic through a fake, focused tests of the adapter against the real thing — is one of the biggest practical benefits of the pattern.

## Object adapters and class adapters

The GoF book describes two forms. The **object adapter** holds the adaptee in a field and delegates to it, as `AcmePayAdapter` does. The **class adapter** inherits from the adaptee and implements the target interface at the same time. In Java this is possible only when the target is an interface, since a class can extend only one class.

```java title="ClassAdapterDemo.java"
public class ClassAdapterDemo {

    interface Logger {                 // target
        void info(String message);
        void error(String message);
    }

    static class LegacyLog {           // adaptee
        public void write(int level, String text) {
            System.out.println("[legacy L" + level + "] " + text);
        }
    }

    /** Object adapter: holds the adaptee. The usual choice. */
    static final class LegacyLogAdapter implements Logger {
        private final LegacyLog legacy;
        LegacyLogAdapter(LegacyLog legacy) { this.legacy = legacy; }
        public void info(String m) { legacy.write(2, m); }
        public void error(String m) { legacy.write(4, m); }
    }

    /** Class adapter: extends the adaptee. Inherits all of its public methods too. */
    static final class LegacyLogClassAdapter extends LegacyLog implements Logger {
        public void info(String m) { write(2, m); }
        public void error(String m) { write(4, m); }
    }

    public static void main(String[] args) {
        Logger a = new LegacyLogAdapter(new LegacyLog());
        Logger b = new LegacyLogClassAdapter();
        a.info("started");
        b.error("disk full");
        ((LegacyLogClassAdapter) b).write(9, "callers can bypass the target interface");
    }
}
```

```output
[legacy L2] started
[legacy L4] disk full
[legacy L9] callers can bypass the target interface
```

Both adapters translate `info` and `error` into the legacy logger's numeric levels. The last line of `main` shows the problem with the class adapter: because it *is a* `LegacyLog`, every public method of the legacy class is part of its interface too, and any code holding a reference can call `write(9, ...)` directly, bypassing the translation. The class adapter also fixes the adaptee at compile time — it cannot wrap a `LegacyLog` instance that was created elsewhere, such as one configured by a framework, or a subclass of it.

The object adapter has neither problem. It exposes only the target interface, and it can wrap any instance it is given, including a fake. That is why the object adapter is the default in Java and in most other languages. The class adapter has one small advantage — it can override adaptee methods or reach `protected` members — which is occasionally useful when adapting a class designed for extension.

## Adapters in the JDK

The JDK contains several adapters, and they illustrate an important property: an adapter can be a **view** over the adaptee rather than a copy of it.

```java title="JdkAdapters.java"
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

public class JdkAdapters {
    public static void main(String[] args) throws IOException {
        // Arrays.asList adapts an array to the List interface. It is a view, not a copy.
        String[] array = {"a", "b", "c"};
        List<String> list = Arrays.asList(array);
        list.set(0, "z");
        System.out.println(array[0]);          // write went through to the array
        try {
            list.add("d");                      // arrays cannot grow
        } catch (UnsupportedOperationException e) {
            System.out.println("add: UnsupportedOperationException");
        }

        // InputStreamReader adapts a byte stream to a character Reader.
        InputStream bytes = new ByteArrayInputStream("héllo\nwörld".getBytes(StandardCharsets.UTF_8));
        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(bytes, StandardCharsets.UTF_8))) {
            System.out.println(reader.readLine());
        }

        // Collections.enumeration adapts a modern collection to the legacy Enumeration interface.
        Enumeration<String> e = Collections.enumeration(List.of("x", "y"));
        while (e.hasMoreElements()) System.out.print(e.nextElement());
        System.out.println();
    }
}
```

```output
z
add: UnsupportedOperationException
héllo
xy
```

`Arrays.asList` adapts an array to the `List` interface without copying it. Setting element 0 of the list changed the array, because both refer to the same storage. And since an array has a fixed length, the adapter cannot support `add`; it throws `UnsupportedOperationException`. This is a frequent source of bugs for people who expect `Arrays.asList` to return an ordinary `ArrayList` — and a lesson about adapters in general: when the adaptee cannot do something the target interface promises, the adapter has to either refuse or emulate it, and callers must know which. Use `new ArrayList<>(Arrays.asList(...))` or `List.of(...)` depending on whether you need a growable copy or an immutable list.

`InputStreamReader` adapts an `InputStream`, which produces bytes, to a `Reader`, which produces characters, decoding with a named character set. Here it decodes the UTF-8 bytes of `"héllo"` correctly; with the wrong charset, the accented letter would come out garbled. Again the adapter does real conversion work, not mere renaming. See [[c1-byte-char-streams]].

`Collections.enumeration` adapts a modern `Collection` to the legacy `Enumeration` interface that some old APIs still require, and `Collections.list` goes the other way.

```quiz
Q: A vendor SDK reports failures by throwing `VendorTimeoutException`. Your adapter declares `charge(...) throws VendorTimeoutException` and passes it straight through. What is the main problem?
- [ ] It does not compile, because adapters cannot throw exceptions
- [x] Callers must now catch a vendor type, so replacing the vendor means changing every caller
- [ ] The exception loses its stack trace when it crosses the adapter
- [ ] Checked exceptions make the adapter slower
> The adapter exists to keep the vendor's model out of the application. Letting a vendor exception through the target interface leaks that model as surely as returning a vendor object would. Catch it in the adapter and throw your own exception, passing the original as the cause so debugging information is kept.
```

## Where adapters live: ports and adapters

Adapters have an architectural role that goes well beyond individual classes. In the **ports and adapters** (or **hexagonal**) architecture, described by Alistair Cockburn, the application core contains business logic and defines **ports** — interfaces describing what it needs from the outside world (`PaymentGateway`, `OrderRepository`, `Notifier`) and what it offers to it. Everything technology-specific lives outside the core, in **adapters** that implement or call those ports: a Postgres repository adapter, an AcmePay adapter, a REST controller that adapts HTTP requests into calls on the core.

```mermaid title="Ports and adapters: the core defines interfaces; adapters plug into them"
flowchart LR
  REST["REST controller adapter"] --> CORE
  subgraph CORE["Application core"]
    direction TB
    S["Checkout logic"] --> P1["PaymentGateway port"]
    S --> P2["OrderRepository port"]
  end
  P1 -.-> A1["AcmePay adapter"]
  P2 -.-> A2["Postgres adapter"]
  A1 --> V["AcmePay SDK"]
  A2 --> DB[("PostgreSQL")]
```

The dependency direction is the key: adapters depend on the core's ports; the core never depends on an adapter or a vendor. This is the Dependency Inversion principle applied at the scale of a whole service. The practical results are that business logic can be tested without databases or networks, and that infrastructure — a database, a payment provider, a message broker — can be replaced by writing a new adapter.

Domain-Driven Design uses a related, larger idea: the **anti-corruption layer**, a boundary module that translates between your domain model and an external or legacy system's model, so the foreign model's concepts and quirks do not seep into your own. An anti-corruption layer is typically built from several adapters plus translation logic, and it is the standard tool when migrating away from a legacy system piece by piece. See [[d7-strangler-migration]].

## In real systems

**Third-party integrations.** Payment providers, email and SMS providers, cloud storage and identity providers are almost always wrapped in adapters. A good rule is one adapter per external system, in an infrastructure package, with vendor imports allowed only there.

**Legacy migration.** During a migration from an old system to a new one, an adapter can make the old system look like the new interface, so callers move to the new interface first and the backing implementation is swapped later.

**Front-end data mapping.** Front-end code often adapts API responses into the shape the UI wants — converting `snake_case` fields, parsing date strings into `Date` objects, flattening nested structures — in one mapping function per endpoint. When the backend changes a field name, one function changes instead of every component.

**Frameworks.** Spring MVC's `HandlerAdapter` lets the dispatcher invoke very different kinds of handlers — annotated controller methods, functional endpoints, plain servlets — through one interface. Logging facades such as SLF4J route calls to Logback, Log4j or `java.util.logging` through binding adapters.

**Resilience at the boundary.** Because every call to the external system passes through the adapter, it is the natural place for timeouts, retries, circuit breakers and metrics on that dependency. See [[c12-circuit-breakers]].

## Adapter, Facade, Decorator and Proxy

Four structural patterns wrap other objects, and interviewers like to ask how they differ. The question to ask is: **what does the wrapper change?**

| Pattern | Interface seen by client | Purpose | Example |
|---|---|---|---|
| Adapter | *Different* from the wrapped object's | Make an incompatible interface fit | `AcmePayAdapter`, `InputStreamReader` |
| [[d2-facade]] | A new, simpler interface over *many* objects | Simplify a subsystem | One `placeOrder()` hiding inventory, payment and shipping calls |
| [[d2-decorator]] | The *same* as the wrapped object's | Add behaviour | `BufferedInputStream` adding buffering |
| [[d2-proxy]] | The *same* as the wrapped object's | Control access | Lazy loading, access checks, remote stubs |

Adapter and Facade both introduce a new interface, but an adapter is driven by an interface the client *already* expects and usually wraps one object, while a facade is a convenience you design to make a complex subsystem easier to use. Decorator and Proxy both keep the interface; a decorator adds responsibilities, while a proxy controls whether and when the real object is reached. The differences are about intent, so the same class can sometimes be described more than one way — an adapter that also adds retries is partly a decorator — and that is fine as long as you can explain what each part does.

## Trade-offs and alternatives

Adapters keep application code on a stable interface you control, isolate vendor and legacy types in one place, make vendors replaceable, and make business logic testable with fakes. They are also the natural home for translation rules, error mapping and resilience policies for a dependency.

The costs: an extra layer and mapping code to write and maintain; a risk that the target interface cannot express something the adaptee offers (or vice versa), so features are lost or awkwardly emulated; and a risk of hiding the adaptee's performance characteristics — a method that looks like a cheap in-memory call may be a slow network request.

Alternatives:

- **Change one side** when you own both. If both interfaces are yours, align them instead of writing a translator between them.
- **Use the SDK directly inside one infrastructure class** when the integration is small. This is still adapter-shaped in spirit — the vendor stays in one place — without a separate interface, though you lose the easy fake for tests.
- **An anti-corruption layer** when the mismatch is between whole models, not single interfaces.
- **A Facade** when the problem is complexity of a subsystem rather than a mismatched interface.

## Common mistakes

> [!MISTAKE] Translating names but not meanings
> An adapter that passes `amount.minorUnits() / 100.0` to a vendor expecting major units works for euros and is wrong for yen; one that maps vendor status `"P"` (pending) to "approved" because both are "not declined" ships unpaid orders. Translate units, enumerations and edge cases deliberately, and fail loudly on values you do not recognise.

**Leaking vendor types.** Returning SDK objects or throwing SDK exceptions through the target interface spreads the vendor through your code. Map them to your own types.

**Business logic in the adapter.** An adapter that decides discounts or fraud rules mixes domain decisions with translation, and those rules disappear when the vendor is replaced. Adapters translate; the core decides.

**Losing the original error.** Throwing a new domain exception without the cause discards the vendor's error code and stack trace. Always pass the original as the cause.

**A god adapter.** One `ExternalSystemsAdapter` with fifty methods for five vendors is hard to change and test. Use one adapter per external system and per port.

**Treating a view as a copy.** `Arrays.asList` writes through to the array and cannot grow; other view adapters behave similarly. Know whether an adapter copies or wraps.

## Interview perspective

In interviews, Adapter comes up as a direct question ("what is it, how is it different from Facade or Decorator?") and as a design move: integrating multiple payment providers, wrapping a legacy inventory API, or making a third-party library testable. In [[d3-food-delivery]], for instance, payment and mapping providers are natural adapter boundaries.

> [!INTERVIEW] A strong answer about payment providers
> "I'd define a `PaymentGateway` port in the domain with our own `Money` and result types, and write one adapter per provider in the infrastructure layer. Each adapter translates amounts using the currency's fraction digits, maps provider status codes to our results, and converts provider exceptions to our own with the original as the cause. Nothing outside the adapter imports the SDK, so switching providers is one new class, and checkout is tested against a fake gateway."

Questions to prepare:

- **Adapter versus Facade?** Adapter fits one object to an interface clients already expect; Facade designs a simpler interface over a whole subsystem.
- **Adapter versus Decorator?** Adapter changes the interface; Decorator keeps it and adds behaviour.
- **Adapter versus Proxy?** Proxy keeps the interface and controls access; Adapter converts it.
- **Object versus class adapter?** Composition versus inheritance; prefer the object adapter because it exposes only the target and can wrap any instance.
- **Where do adapters sit in hexagonal architecture?** Outside the core, implementing or calling the core's ports.
- **What is an anti-corruption layer?** A boundary that translates an external model into your domain model, usually built from adapters.

## Practice

1. **Second provider.** Write a `BetaPayAdapter` for an SDK whose method is `pay(long cents, Currency currency, String customer)` and returns an enum `{ OK, NSF, EXPIRED, ERROR }`. Run the same `checkout` calls through both adapters.
2. **Unknown status.** Extend `AcmePayAdapter` to handle a new vendor status `"P"` (pending). Decide what the application should see — a third result type, or an exception — and justify it.
3. **Legacy logger.** Adapt a legacy `log(String level, String message)` API to SLF4J-style `info`, `warn` and `error` methods, mapping unknown levels safely.
4. **Contract tests.** List five behaviours of a payment adapter that should be verified against the vendor's sandbox rather than with a fake, and explain why each cannot be trusted to a fake.
5. **Spot the pattern.** For `Arrays.asList`, `BufferedReader`, `Collections.unmodifiableList` and a `CustomerService` that wraps three microservice clients behind one method, decide whether each is an Adapter, Decorator, Proxy or Facade, and say what it changes.

## Quick revision {#quick-revision}

- Adapter: implements the interface clients expect (target) and delegates to an existing class with an incompatible interface (adaptee).
- Roles: client, target, adapter, adaptee; the adaptee is wrapped, never modified.
- Translate everything: names and shapes, units (currency fraction digits, time zones), return values and codes, errors (with the original as the cause).
- Never leak adaptee types through the target interface; fail loudly on unrecognised values.
- Object adapter (composition) is the default; class adapter (inheritance) exposes the adaptee's methods and cannot wrap existing instances.
- JDK adapters: `Arrays.asList` (a view: writes through, cannot grow), `InputStreamReader` (bytes to characters), `Collections.enumeration`.
- Testability: business logic against a fake implementing the target; the real adapter covered by translation unit tests and vendor sandbox contract tests.
- Hexagonal architecture: core defines ports; adapters implement or call them; dependencies point inward. Anti-corruption layer translates whole models.
- vs Facade (simplify a subsystem), Decorator (same interface, adds behaviour), Proxy (same interface, controls access).

## Key takeaways {#key-takeaways}

- An adapter lets existing code and an incompatible class work together without changing either, by implementing the interface the client already expects.
- The real work of an adapter is translation of meaning — units, codes and errors — not method names alone, and that is where its bugs hide.
- Keep vendor and legacy types inside the adapter; the moment they cross the interface, replacing the vendor gets expensive.
- Prefer object adapters, place them at the edge of the system, and use them as the seam for fakes in tests.
- Distinguish Adapter from Facade, Decorator and Proxy by asking what the wrapper changes: the interface, the simplicity, the behaviour or the access.
