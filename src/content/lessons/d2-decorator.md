---
summary: Decorator adds behaviour to an object by wrapping it in another object with the same interface, so features such as caching, retries, logging or compression can be stacked in any combination at runtime. You will learn how to build decorators, why their order matters, where they appear in Java I/O, web middleware and Spring, and how they differ from Adapter and Proxy.
difficulty: intermediate
minutes: 45
objectives:
  - Explain how Decorator avoids the subclass explosion that inheritance causes for combinable features
  - Implement decorators that wrap a component, keep its interface and add behaviour before or after delegating
  - Predict how the order of stacked decorators changes behaviour, and choose an order deliberately
  - Recognise decorators in Java I/O streams, function wrappers, HTTP middleware and Spring proxies
  - Avoid decorator pitfalls — unforwarded methods, broken identity, resource handling and substitutability — and distinguish Decorator from Adapter, Proxy and Chain of Responsibility
---

## Introduction

A service looks up product prices from a remote pricing system. Over time it needs more around that call: a cache, because the same prices are asked for constantly; retries, because the remote system times out now and then; logging, for debugging; metrics, for dashboards. Some deployments want the cache but not the logging; tests want neither.

If you add these features by inheritance, you get `CachingPriceService extends RemotePriceService`, then `LoggingCachingPriceService`, `RetryingCachingPriceService`, `LoggingRetryingCachingPriceService`... With four optional features there are sixteen combinations, and each new feature doubles the count. Every combination is fixed at compile time, and each class duplicates behaviour from the others.

The **Decorator** pattern takes a different route. Each feature becomes a small class that implements the *same* interface as the thing it wraps, holds a reference to that thing, and adds its behaviour before or after passing the call on. Because every layer has the same interface, layers can wrap one another in any combination:

```java
PriceService prices = new Logging(new Caching(new Retrying(new RemotePriceService(), 3)), "prices");
```

The caller sees one `PriceService`. It does not know how many layers there are. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes Decorator as attaching additional responsibilities to an object dynamically — a flexible alternative to subclassing for extending functionality.

You have used decorators if you have written `new BufferedReader(new FileReader(...))` in Java, wrapped a function with another function in JavaScript, or added middleware to an Express or Spring application. Spring's `@Transactional` and `@Cacheable` work by wrapping your beans in decorator-like proxies.

## Before you start

- **Interfaces and polymorphism** — every decorator implements the same interface as what it wraps. See [[c1-interfaces]] and [[c1-polymorphism]].
- **Composition versus inheritance**, especially the combinatorial-explosion argument. See [[d1-composition-vs-inheritance]].
- **Single Responsibility and Open/Closed** from [[d1-solid]] — each decorator does one thing, and new features are new classes.
- **Java I/O streams** help for the I/O section. See [[c1-byte-char-streams]] and [[c1-buffered-io]].
- **Higher-order functions** for the JavaScript section — functions that take or return functions. See [[b1-first-class-functions]].

## The intuition

Think of wrapping a present. The gift is in a box. You put the box in wrapping paper, add a ribbon, and attach a card. Each layer adds something — protection, appearance, a message — without changing the gift. Whoever receives it still unwraps it to get the same gift, and you could have skipped the ribbon or added a second layer of paper without the gift being any different.

A decorator is a layer of wrapping: it surrounds the original, adds one thing, and leaves the original's interface intact. The **component** is the gift; each **decorator** is a layer; the stack can be built in any combination.

Where the analogy stops is the most important property of real decorators: **order matters**. Wrapping paper then ribbon looks the same as ribbon then paper from the inside, but in software a cache outside a logger behaves very differently from a logger outside a cache, as you will see. And unlike paper, every software layer participates in every call — a request goes in through each layer and the result comes back out through each layer in reverse.

## The structure

```mermaid title="Decorator: every layer implements the component interface and wraps one"
classDiagram
  class PriceService {
    <<interface>>
    +priceCents(sku) long
  }
  class RemotePriceService
  class Caching {
    -inner: PriceService
  }
  class Retrying {
    -inner: PriceService
  }
  class Logging {
    -inner: PriceService
  }
  PriceService <|.. RemotePriceService
  PriceService <|.. Caching
  PriceService <|.. Retrying
  PriceService <|.. Logging
  Caching --> PriceService : wraps
  Retrying --> PriceService : wraps
  Logging --> PriceService : wraps
```

There are three roles. The **component interface** (`PriceService`) is what clients call. The **concrete component** (`RemotePriceService`) does the core work. Each **decorator** both *is* a `PriceService` (it implements the interface) and *has* a `PriceService` (the `inner` field). That double relationship is what makes stacking possible: a decorator can wrap the concrete component or another decorator, and it cannot tell the difference.

## Building a stack of decorators

The program below implements the three decorators and the remote service, then stacks them in two different orders. The remote service is simulated: its first call fails with a timeout and later calls succeed, so retries are visible.

```java title="PriceDecorators.java"
import java.util.HashMap;
import java.util.Map;

public class PriceDecorators {

    /** The component interface every layer implements. */
    interface PriceService {
        long priceCents(String sku);
    }

    /** The concrete component: a slow, occasionally failing remote call (simulated). */
    static final class RemotePriceService implements PriceService {
        private int calls = 0;
        @Override public long priceCents(String sku) {
            calls++;
            if (calls == 1) throw new IllegalStateException("timeout");  // first call fails
            return 1_000 + sku.length() * 100L;
        }
    }

    /** Decorator: retries failed calls. Same interface, wraps another PriceService. */
    static final class Retrying implements PriceService {
        private final PriceService inner;
        private final int maxAttempts;
        Retrying(PriceService inner, int maxAttempts) {
            this.inner = inner;
            this.maxAttempts = maxAttempts;
        }
        @Override public long priceCents(String sku) {
            for (int attempt = 1; ; attempt++) {
                try {
                    return inner.priceCents(sku);
                } catch (IllegalStateException e) {
                    if (attempt == maxAttempts) throw e;
                    System.out.println("    retry after: " + e.getMessage());
                }
            }
        }
    }

    /** Decorator: remembers answers so repeated lookups skip the inner layers. */
    static final class Caching implements PriceService {
        private final PriceService inner;
        private final Map<String, Long> cache = new HashMap<>();
        Caching(PriceService inner) { this.inner = inner; }
        @Override public long priceCents(String sku) {
            return cache.computeIfAbsent(sku, inner::priceCents);
        }
    }

    /** Decorator: logs each call that reaches it. */
    static final class Logging implements PriceService {
        private final PriceService inner;
        private final String label;
        Logging(PriceService inner, String label) {
            this.inner = inner;
            this.label = label;
        }
        @Override public long priceCents(String sku) {
            long price = inner.priceCents(sku);
            System.out.println("    [" + label + "] " + sku + " = " + price);
            return price;
        }
    }

    static void lookUpTwice(String title, PriceService service) {
        System.out.println(title);
        for (int i = 1; i <= 2; i++) {
            System.out.println("  lookup " + i + " -> " + service.priceCents("MUG"));
        }
    }

    public static void main(String[] args) {
        lookUpTwice("logging outside the cache:",
                new Logging(new Caching(new Retrying(new RemotePriceService(), 3)), "outer"));
        lookUpTwice("logging inside the cache:",
                new Caching(new Logging(new Retrying(new RemotePriceService(), 3), "inner")));
    }
}
```

```output
logging outside the cache:
    retry after: timeout
    [outer] MUG = 1300
  lookup 1 -> 1300
    [outer] MUG = 1300
  lookup 2 -> 1300
logging inside the cache:
    retry after: timeout
    [inner] MUG = 1300
  lookup 1 -> 1300
  lookup 2 -> 1300
```

Each decorator follows the same recipe: implement the interface, take the wrapped object in the constructor, and in each method do something extra around a call to `inner`. `Retrying` wraps the call in a loop and catches failures. `Caching` checks its map first and calls `inner` only on a miss. `Logging` calls `inner` and then prints the result. None of them knows what is inside it — `Caching` does not know a retry layer exists, and `Retrying` does not know it is being cached.

Notice also that `RemotePriceService` was not modified at all. Caching, retries and logging were added without touching it, which is the Open/Closed principle in its most literal form.

## Why the order matters

Both stacks contain the same three decorators and return the same prices. Their behaviour differs.

In the first stack, `Logging` is the outermost layer, so *every* lookup passes through it — including the second, which the cache answers without calling the remote service. The log shows two entries. That log describes what callers asked for.

In the second stack, `Logging` sits *inside* the cache. The second lookup is answered by `Caching` and never reaches the logger, so only one entry appears. That log describes what actually went to the remote service — a cache-miss log.

Neither is wrong; they answer different questions. That is the general lesson: **a decorator affects only the calls that reach it, and sees results only from the layers beneath it.** A few orderings come up again and again in practice:

| Pair | Order | Effect |
|---|---|---|
| Cache and retry | Cache outside retry | Cache hits never retry; misses get retried. Usually what you want. |
| Cache and retry | Retry outside cache | Retries re-check the cache first, harmless but pointless. |
| Metrics and retry | Metrics outside retry | One measurement per caller request, including all retry time. |
| Metrics and retry | Metrics inside retry | One measurement per attempt; shows how often the remote fails. |
| Auth and cache | Auth outside cache | Every request is authorised before cached data is returned. Correct. |
| Auth and cache | Cache outside auth | Cached data can be served to unauthorised callers. A security bug. |

The last row is why ordering is not a detail. Write down the intended order where the stack is assembled, and test it.

```quiz
Q: A stack is built as `new Caching(new Metrics(new RemotePriceService()))`. What does the request count recorded by `Metrics` measure?
- [ ] Every call made by clients of the stack
- [x] Only calls that miss the cache and therefore reach the remote service
- [ ] Nothing, because `Metrics` is hidden behind `Caching`
- [ ] Twice the number of client calls, because both layers forward the call
> A decorator sees only the calls that reach it. `Caching` is outermost, so cache hits return before `Metrics` is called; only misses pass through `Metrics` to the remote service. To count every client request, `Metrics` would have to be outside `Caching`.
```

## Java I/O: the canonical decorator

The `java.io` library is the textbook example of Decorator, and it is easier to read once you see it as one. `InputStream` is the component interface (an abstract class here). `FileInputStream` and `ByteArrayInputStream` are concrete components that read from a source. `BufferedInputStream`, `GZIPInputStream`, `DataInputStream` and others are decorators: each extends `FilterInputStream`, takes another `InputStream` in its constructor, and adds one capability — buffering, decompression, reading primitive types. The same structure exists for output streams, readers and writers.

```java title="StreamLayers.java"
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class StreamLayers {
    public static void main(String[] args) throws IOException {
        String text = "order,A-17,shipped\n".repeat(1_000);

        // Write: characters -> bytes (UTF-8) -> compressed bytes -> memory.
        ByteArrayOutputStream memory = new ByteArrayOutputStream();
        try (Writer out = new OutputStreamWriter(new GZIPOutputStream(memory), StandardCharsets.UTF_8)) {
            out.write(text);
        }   // closing the outermost layer flushes and closes every layer beneath it

        byte[] compressed = memory.toByteArray();
        System.out.println("original bytes:   " + text.getBytes(StandardCharsets.UTF_8).length);
        System.out.println("compressed < 1%: " + (compressed.length * 100 < text.length()));

        // Read: memory -> decompress -> decode to characters -> buffer into lines.
        try (BufferedReader in = new BufferedReader(new InputStreamReader(
                new GZIPInputStream(new ByteArrayInputStream(compressed)), StandardCharsets.UTF_8))) {
            System.out.println("first line:       " + in.readLine());
            System.out.println("remaining lines:  " + in.lines().count());
        }
    }
}
```

```output
original bytes:   19000
compressed < 1%: true
first line:       order,A-17,shipped
remaining lines:  999
```

Read the writing stack from the outside in: `OutputStreamWriter` turns characters into UTF-8 bytes, `GZIPOutputStream` compresses those bytes, and `ByteArrayOutputStream` stores them in memory. The reading stack reverses it: bytes from memory are decompressed by `GZIPInputStream`, decoded into characters by `InputStreamReader`, and buffered into lines by `BufferedReader`. The highly repetitive input compresses to under one percent of its size. (Strictly, `InputStreamReader` and `OutputStreamWriter` are adapters — they convert between byte streams and character streams, changing the interface — while the buffering and compression layers are decorators. See [[d2-adapter]].)

Two practical points follow from the decorator structure. First, **closing the outermost layer closes everything beneath it**, because each decorator's `close` calls its inner stream's `close`. That is why one try-with-resources on the outer object is enough, and why closing the outer layer matters: `GZIPOutputStream` only writes the end of the compressed data when it is finished or closed, so forgetting to close it produces a truncated file. Second, the order is fixed by meaning: decompressing must happen before decoding characters, and buffering is usually outermost so that it batches the small reads made by the code above it.

## Decorators as functions

When the component interface has a single method, a decorator can be a plain function that takes a function and returns a new function with the same signature. JavaScript and TypeScript code uses this constantly.

```javascript title="fnDecorators.mjs"
// Function decorators: each takes a function and returns a function with the same signature.
const withLogging = (name, fn) => async (...args) => {
  const start = performance.now();
  try {
    return await fn(...args);
  } finally {
    console.log(`${name}(${args.join(', ')}) took ${Math.round(performance.now() - start)}ms`);
  }
};

const withRetry = (attempts, fn) => async (...args) => {
  for (let i = 1; ; i++) {
    try {
      return await fn(...args);
    } catch (err) {
      if (i === attempts) throw err;
      console.log(`attempt ${i} failed: ${err.message}`);
    }
  }
};

let calls = 0;
async function fetchPrice(sku) {
  calls++;
  if (calls === 1) throw new Error('timeout');
  return 1300;
}

const getPrice = withLogging('getPrice', withRetry(3, fetchPrice));
console.log('price:', await getPrice('MUG'));
```

```output
attempt 1 failed: timeout
getPrice(MUG) took 1ms
price: 1300
```

The timing figure depends on the machine and varies between runs. `withRetry(3, fetchPrice)` returns a new function that behaves like `fetchPrice` but retries; `withLogging` wraps that. `getPrice` has the same signature as `fetchPrice`, so callers cannot tell it has been decorated — the same property as the class-based version. Java can do the same with functional interfaces: `Function.andThen` and `compose` combine functions, and a method `static <T, R> Function<T, R> logged(Function<T, R> f)` is a function decorator.

**HTTP middleware** is the same idea applied to request handlers. In Express, each middleware receives the request and a `next` function and decides what to do before and after calling it; in Java servlets, a `Filter` wraps the rest of the chain. Authentication, compression, logging and CORS headers are all layers around the real handler, and their order matters exactly as in the table above — the authentication layer must come before anything that returns data. Middleware chains are also close to the Chain of Responsibility pattern, discussed below. See [[c6-filters]].

> [!NOTE] Decorator syntax is not always the Decorator pattern
> Python's `@decorator` syntax is sugar for wrapping a function with another function, which is very close to the pattern. TypeScript's `@decorator` syntax (standard decorators, supported since TypeScript 5.0) is a more general metaprogramming feature that can replace or annotate classes and members. Java annotations such as `@Transactional` are only metadata; it is Spring's proxy, not the annotation, that does the decorating. See [[b2-decorators]].

## Spring: decorators generated for you

When a Spring bean has methods annotated `@Transactional`, `@Cacheable` or `@Async`, Spring does not modify your class. At start-up it creates a **proxy** — a generated object with the same interface (or a generated subclass) — that wraps your bean. Calls from other beans go to the proxy, which starts a transaction, checks the cache or hands off to a thread pool, then delegates to your real object. That is decorator structure, generated automatically through Aspect-Oriented Programming (AOP). See [[c5-aop]] and [[c5-transactional-as-aop]].

The decorator view explains Spring's most famous surprise. If a method inside your bean calls another `@Transactional` method *on `this`*, the call goes directly to the real object, not through the proxy — so no transaction is started. A decorator only affects calls that pass through it, and a call from the inner object to itself never does. See [[c5-self-invocation]].

## How it works internally: forwarding every method

A decorator must implement *every* method of the component interface, and for most of them it only forwards to `inner`. For a one-method interface that is trivial. For an interface with twenty methods — a `Repository`, a `List`, an `InputStream` — it is tedious, and a common solution is a **forwarding base class** that implements every method by delegation, so concrete decorators override only what they change. Java's `FilterInputStream` plays exactly this role for I/O decorators, and libraries such as Guava provide `ForwardingList`, `ForwardingMap` and similar.

Forwarding has a subtle trap when an interface evolves. Suppose a `default` method is added to the interface later, and the real component overrides it with an efficient version, but an older decorator does not know about it:

```java title="DefaultMethodTrap.java"
import java.util.List;
import java.util.stream.Collectors;

public class DefaultMethodTrap {

    interface PriceService {
        long priceCents(String sku);

        // Added later as a default method, so existing implementations still compile.
        default List<Long> pricesCents(List<String> skus) {
            return skus.stream().map(this::priceCents).collect(Collectors.toList());
        }
    }

    static final class Remote implements PriceService {
        int requests = 0;
        public long priceCents(String sku) { requests++; return 500; }
        @Override public List<Long> pricesCents(List<String> skus) {
            requests++;                       // one batched request for all SKUs
            return skus.stream().map(s -> 500L).collect(Collectors.toList());
        }
    }

    /** Written before pricesCents existed: forwards only priceCents. */
    static final class Logging implements PriceService {
        private final PriceService inner;
        Logging(PriceService inner) { this.inner = inner; }
        public long priceCents(String sku) { return inner.priceCents(sku); }
    }

    public static void main(String[] args) {
        Remote remote = new Remote();
        remote.pricesCents(List.of("A", "B", "C", "D"));
        System.out.println("direct:    " + remote.requests + " request(s)");

        Remote wrapped = new Remote();
        new Logging(wrapped).pricesCents(List.of("A", "B", "C", "D"));
        System.out.println("decorated: " + wrapped.requests + " request(s)");
    }
}
```

```output
direct:    1 request(s)
decorated: 4 request(s)
```

The decorator does not override `pricesCents`, so it inherits the interface's default, which calls `priceCents` once per SKU — on the decorator, which forwards each one to the remote service. The remote service's batched implementation is never used, and one request becomes four. The result is still correct, which is exactly why this kind of bug survives review. The fix is for decorators to forward *every* method, including defaults, and to revisit them whenever the interface changes. A decorator that adds behaviour, such as logging, must decide for each method whether to add the behaviour there too.

## Identity, equality and substitutability

Wrapping an object creates a new object, which has consequences beyond method calls.

**Identity.** A decorated object is not `==` to the original, and `decorated.equals(original)` is usually false. Code that stores objects in sets or uses them as map keys can be surprised when the "same" service appears twice — once bare and once wrapped.

**Type checks.** Code that checks `if (service instanceof RemotePriceService)` fails once the service is decorated, because the outer object is a `Logging`. Decorators work only when clients depend on the interface, not on concrete types. Code that needs a concrete type's special method is a sign that the abstraction is incomplete.

**Substitutability.** A decorator must be usable anywhere the undecorated component is — the Liskov Substitution principle from [[d1-solid]]. A decorator that rejects inputs the component accepted (for example, a validating layer that refuses SKUs longer than ten characters when the interface promised to price any SKU) or that changes the meaning of results breaks callers that relied on the original contract. Adding behaviour is fine; changing the contract is not.

**Double application.** Because layers can be stacked freely, they can be stacked twice by accident — two retry layers multiply attempts (three attempts inside three attempts is nine remote calls), and two "charge a fee" decorators double the fee. Assemble stacks in one place, not piecemeal across the codebase.

## Decorator compared with similar patterns

| Pattern | Interface | Purpose | Typical example |
|---|---|---|---|
| Decorator | Same as the wrapped object | Add behaviour, stackable | Buffering, caching, retries, logging |
| [[d2-proxy]] | Same as the wrapped object | Control access to the real object | Lazy loading, access checks, remote stubs |
| [[d2-adapter]] | Different from the wrapped object | Make an incompatible interface fit | Vendor SDK behind your own interface |
| [[d2-chain-of-responsibility]] | Handlers share a handler interface | Pass a request along until handled, or through every handler | Servlet filter chains, approval workflows |
| [[d2-strategy]] | Context delegates to a strategy | Replace the core algorithm | Pricing rules |

Decorator and Proxy have the same structure; the difference is intent. A decorator adds responsibilities and is usually stacked by the client; a proxy controls *whether and when* the real object is reached, and usually manages that object's lifecycle (creating it lazily, connecting to it remotely). Spring's AOP proxies sit between the two, which is why both names are used for them.

Decorator versus Strategy is the "skin versus guts" distinction from the GoF book: a decorator changes behaviour from the outside by wrapping, while a strategy changes the inside by replacing the algorithm the object uses. If the core behaviour itself varies, Strategy is usually clearer; if optional features are layered around stable core behaviour, Decorator fits.

## In real systems

**I/O and compression.** Java streams, as shown; similar layered stream designs exist in .NET and Node.js.

**Resilience and observability.** Clients for remote services are routinely wrapped with retry, circuit-breaker, timeout, metrics and tracing layers. Resilience4j's decorators work exactly this way — `Decorators.ofSupplier(call).withCircuitBreaker(cb).withRetry(retry)` builds a stack around a function — and the library's documentation discusses ordering. See [[c12-circuit-breakers]] and [[d7-retry-strategies]].

**Caching.** A caching decorator around a repository or client is one of the simplest ways to add caching without changing either the caller or the data source. It must also handle invalidation, which the decorator cannot solve on its own.

**Web frameworks.** Servlet filters, Spring's `OncePerRequestFilter` and interceptors, Express and Koa middleware, and React higher-order components (functions that take a component and return an enhanced one) are all decorator-shaped.

**Collections.** `Collections.unmodifiableList(list)` and `Collections.synchronizedList(list)` wrap a list and keep its interface, adding read-only enforcement or locking. (Read-only wrappers are often described as protection proxies; either name is defensible.)

## Trade-offs and alternatives

Decorators let you compose features at runtime in any combination, keep each feature in one small class with one responsibility, and add behaviour without modifying existing classes or building a subclass for every combination. They are an excellent fit for cross-cutting concerns such as logging, metrics, caching and retries.

The costs: many small classes, and stack traces that pass through several layers; behaviour that depends on order, which is easy to get wrong silently; difficulty removing or reordering a layer in the middle of an already-built stack; the forwarding burden for wide interfaces; and broken identity and type checks.

Alternatives:

- **Aspect-Oriented Programming** (Spring AOP, AspectJ) applies cross-cutting behaviour declaratively to many classes at once, at the cost of making the behaviour less visible in the code.
- **An explicit pipeline or middleware list** when the steps form an ordered chain that is configured as data.
- **Subclassing** when there is one fixed extension and no combinations — a single subclass is simpler than a decorator.
- **Strategy** when the core algorithm varies rather than the features around it.

## Common mistakes

> [!MISTAKE] Changing the interface in a decorator
> A "decorator" that adds new public methods callers must use, or changes method signatures, is no longer interchangeable with the component; clients have to know it is there. If the interface must change, that is an Adapter. If new capabilities are needed, add them to the interface or provide them separately.

**Getting the order wrong.** Caching outside authorisation, metrics inside a retry loop when you meant per request, compression outside encryption when the protocol expects the opposite. Decide the order deliberately and assemble it in one place.

**Not forwarding every method.** Missing a method — especially a newly added `default` method — silently bypasses the inner object's implementation of it. Use a forwarding base class and revisit decorators when the interface grows.

**Business logic in decorators.** A decorator that applies discounts or validates domain rules hides essential behaviour in infrastructure wiring, where it can be accidentally omitted from one stack. Keep decorators for cross-cutting concerns; keep domain rules in the domain.

**Forgetting resource handling.** A decorator that wraps a resource must close the inner resource when it is closed, and should not close a resource it does not own.

**Relying on concrete types.** `instanceof` checks and casts to the concrete component break as soon as a decorator is added.

## Interview perspective

Interviewers ask "Decorator versus inheritance?", "Decorator versus Proxy or Adapter?", and "implement a logging or caching decorator for a repository". The Java I/O example and a clear story about ordering are strong signals. In design problems, decorators appear naturally in [[d3-logging-framework]] (formatting and filtering layers), [[d3-cache]] (a caching layer around a data source) and pricing add-ons such as toppings or extras.

> [!INTERVIEW] Explaining Decorator with ordering
> "A decorator implements the same interface as the object it wraps, holds a reference to it, and adds behaviour around delegation. That gives me caching, retries and logging as separate classes I can combine at runtime instead of a subclass per combination. Order matters: I'd put the cache outside the retry layer so hits never retry, and metrics outside the retry layer if I want per-request latency. Java's I/O streams are the classic example — `BufferedReader` around `InputStreamReader` around `FileInputStream`."

Questions to prepare:

- **Decorator versus inheritance?** Runtime composition of independent features versus a compile-time subclass per combination.
- **Decorator versus Proxy?** Same structure; a decorator adds behaviour, a proxy controls access and often the real object's lifecycle.
- **Decorator versus Adapter?** A decorator keeps the interface; an adapter changes it.
- **Decorator versus Chain of Responsibility?** In a decorator stack, every layer normally handles every call; in Chain of Responsibility, a handler may stop the request from going further (filter chains blur the line).
- **Implement a logging decorator for a repository.** Implement the interface, delegate every method, log around each call, and include failures (log in a `finally` or catch, log, and rethrow).
- **Is `@Transactional` a decorator?** Effectively yes — Spring wraps the bean in a proxy that adds transaction handling — which explains why self-invocation bypasses it.

## Practice

1. **Coffee shop.** Model a `Beverage` interface with `cost()` and `description()`, an `Espresso` component, and `Milk`, `Syrup` and `ExtraShot` decorators. Print the description and cost of an espresso with two shots and syrup.
2. **Metrics decorator.** Add a `Timing` decorator to `PriceDecorators` that counts calls and total time. Place it in two positions and explain the difference in what it measures.
3. **Forwarding base class.** Write `ForwardingPriceService` that forwards both `priceCents` and `pricesCents`, rebuild `Logging` on top of it, and confirm that `DefaultMethodTrap` now makes one request.
4. **Function decorators.** In JavaScript, write `withTimeout(ms, fn)` and `withCache(fn)`, then compose them with `withRetry`. Decide and justify an order.
5. **Spot the bug.** A team builds `new Caching(new Authorizing(service))`. Explain the security problem and the correct order.

## Quick revision {#quick-revision}

- Decorator: a wrapper that implements the same interface as the object it wraps, delegates to it, and adds behaviour before or after.
- Solves subclass explosion: n optional features become n classes combined at runtime, not 2ⁿ subclasses.
- Roles: component interface, concrete component, decorators that both implement and hold the interface.
- Order matters: a decorator sees only calls that reach it and results from layers beneath. Cache outside retry; auth outside cache.
- Java I/O: `FilterInputStream` subclasses (`BufferedInputStream`, `GZIPInputStream`) are decorators; closing the outer stream closes all layers; `InputStreamReader` is an adapter.
- Function decorators and middleware: a function that takes and returns a function of the same signature; Express middleware, servlet filters.
- Spring `@Transactional`/`@Cacheable` use decorator-like proxies; self-invocation bypasses them.
- Pitfalls: unforwarded (default) methods, broken identity and `instanceof`, LSP violations, double application, resource closing.
- vs Proxy (same interface, controls access), Adapter (changes interface), Chain of Responsibility (may stop the request), Strategy (replaces the core algorithm).

## Key takeaways {#key-takeaways}

- Decorator adds responsibilities by wrapping rather than subclassing, so independent features can be combined freely at runtime.
- Every decorator keeps the component's interface, which is what makes layers interchangeable and invisible to callers.
- The order of decorators is part of the design: it decides which calls each layer sees, with consequences for correctness, measurement and security.
- Java I/O, function wrappers, web middleware and Spring proxies are all the same idea, so learning it once explains a lot of everyday code.
- Use decorators for cross-cutting concerns around stable behaviour; use Strategy when the core behaviour varies and Adapter when the interface must change.
