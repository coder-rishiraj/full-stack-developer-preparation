---
summary: A proxy stands in for another object, implements the same interface, and decides whether, when and how calls reach the real thing — loading it lazily, checking permissions, caching results or forwarding over a network. You will learn the kinds of proxy, how to write them by hand and generate them at runtime with java.lang.reflect.Proxy, and how the same idea powers Hibernate lazy loading, RPC stubs and Spring's @Transactional.
difficulty: intermediate
minutes: 45
objectives:
  - Explain what a proxy is and how its intent differs from Decorator, Adapter and Facade
  - Implement virtual, protection and caching proxies, including thread-safe lazy initialisation
  - Build a dynamic proxy with java.lang.reflect.Proxy and explain why self-invocation bypasses it
  - Recognise proxies in Hibernate lazy loading, remote stubs and Spring AOP, and predict their pitfalls
  - Choose the order of proxy layers and avoid common proxy bugs such as hidden network failures and broken identity
---

## Introduction

A document management system lists thousands of documents. Each document's full content is large and lives in object storage, so loading it takes tens of milliseconds and a lot of memory. The list screen only needs titles. If every `Document` object loads its content when it is created, opening the list loads gigabytes that nobody reads.

The same system has confidential documents that only some users may open, and some documents live in another data centre and are reached through a network call. In each case, client code wants to hold "a document" and call `body()` on it — without caring whether the content is loaded yet, whether access is being checked, or whether the call crosses a network.

The **Proxy** pattern handles all of these with one structure. A proxy is an object that implements the *same interface* as the real object — the **real subject** — and stands in its place. When a client calls the proxy, the proxy decides what happens: it might create the real object only now, check the caller's permissions first, return a cached answer, or send the call over the network. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes Proxy as providing a surrogate or placeholder for another object to control access to it.

"Control access" is the phrase to remember. A proxy is about *whether, when and how* the real object is reached. That separates it from a decorator, which has the same shape but exists to add behaviour.

You use proxies constantly, often without seeing them. Hibernate returns proxies for lazily loaded entities. A gRPC client stub is a proxy for a service on another machine. When Spring applies `@Transactional` or `@Cacheable` to a bean, the object injected into your controller is a generated proxy wrapped around your class. Many of the surprising behaviours of those frameworks — `LazyInitializationException`, `@Transactional` not working on internal calls — are easiest to understand once you see the proxy.

## Before you start

- **Interfaces and polymorphism** — a proxy works because clients depend on an interface that both the proxy and the real object implement. See [[c1-interfaces]] and [[c1-polymorphism]].
- **Decorator** — the same structure with a different intent; this lesson compares them directly. See [[d2-decorator]].
- **Thread safety basics** — lazy initialisation must be safe when several threads call the proxy at once. See [[c3-double-checked-locking]].
- **Spring proxies** — the framework-generated proxies covered in [[c5-proxies]] build on this lesson.

## The intuition

Think of a busy executive's assistant. Callers ask the assistant for things, and the assistant decides what to do: answer simple questions from the calendar without disturbing anyone, check whether the caller is on the approved list, write down the request and pass it on later, or put the caller through. To the caller, the assistant is the way to reach the executive; they make the same requests either way.

The assistant is the proxy; the executive is the real subject. The assistant does not do the executive's job — that is what distinguishes a proxy from a facade or an adapter — but controls access to the person who does.

Where the analogy stops: a caller knows they are talking to an assistant. In software, the point is usually that the client *cannot tell* — the proxy has the same interface, so client code is written exactly as if it held the real object. That transparency is powerful, and it is also the source of most proxy pitfalls, as you will see.

## The structure

```mermaid title="Proxy: same interface as the real subject, controls access to it"
classDiagram
  class Document {
    <<interface>>
    +title() String
    +body() String
  }
  class StoredDocument {
    +title() String
    +body() String
  }
  class LazyDocument {
    -real: StoredDocument
    +title() String
    +body() String
  }
  Document <|.. StoredDocument
  Document <|.. LazyDocument
  LazyDocument --> StoredDocument : creates on demand
```

There are three roles:

- The **subject interface** (`Document`) is what clients depend on.
- The **real subject** (`StoredDocument`) does the actual work.
- The **proxy** (`LazyDocument`) implements the same interface and holds — or knows how to obtain — the real subject. Each method decides whether and how to forward the call.

A difference from Decorator shows up already: a proxy often **manages the real subject's lifecycle**. A decorator is handed a finished object to wrap; a virtual proxy is handed only what it needs to *create* the real object later (an ID, a path), and a remote proxy never holds a local real object at all.

## Kinds of proxy

The GoF book names several kinds, distinguished by *what* access the proxy controls. They are worth knowing by name because interviewers ask about them and because real proxies often combine several.

| Kind | What it controls | Example |
|---|---|---|
| **Virtual proxy** | *When* the real object is created — not until it is needed | Lazily loaded images, Hibernate entity proxies |
| **Protection proxy** | *Whether* a caller may reach it — permission checks | Role-checked document access, read-only views |
| **Remote proxy** | *Where* it is — a local stand-in for an object in another process | gRPC and Java RMI client stubs |
| **Caching proxy** | *Whether the real call is needed* — reuses earlier results | A caching client for an expensive service |
| **Smart reference** | Extra bookkeeping on access — counting, locking, logging | Reference counting, access auditing |

## Virtual and protection proxies, step by step

The program below implements the document example with two proxies. `LazyDocument` is a virtual proxy that knows a document's title from a cheap index but loads its body only on demand. `SecuredDocument` is a protection proxy that checks the user's roles before allowing the body to be read.

```java title="DocumentProxies.java"
import java.util.List;
import java.util.Set;

public class DocumentProxies {

    interface Document {
        String title();
        String body();
    }

    /** Real subject: expensive to create, because it loads the content. */
    static final class StoredDocument implements Document {
        private final String title;
        private final String body;

        StoredDocument(String id, String title) {
            System.out.println("    (loading " + id + " from storage)");
            this.title = title;
            this.body = "content of " + id;
        }

        public String title() { return title; }
        public String body()  { return body; }
    }

    /** Virtual proxy: answers title() itself, creates the real document on first body(). */
    static final class LazyDocument implements Document {
        private final String id;
        private final String title;                  // known from a cheap index
        private volatile StoredDocument real;        // volatile: safe publication

        LazyDocument(String id, String title) {
            this.id = id;
            this.title = title;
        }

        public String title() { return title; }

        public String body() { return realDocument().body(); }

        private StoredDocument realDocument() {
            StoredDocument r = real;
            if (r == null) {                         // first check, without locking
                synchronized (this) {
                    r = real;
                    if (r == null) {                 // second check, with the lock held
                        r = new StoredDocument(id, title);
                        real = r;
                    }
                }
            }
            return r;
        }
    }

    /** Protection proxy: checks permissions before delegating. */
    static final class SecuredDocument implements Document {
        private final Document inner;
        private final Set<String> userRoles;

        SecuredDocument(Document inner, Set<String> userRoles) {
            this.inner = inner;
            this.userRoles = userRoles;
        }

        public String title() { return inner.title(); }    // titles are not secret

        public String body() {
            if (!userRoles.contains("LEGAL")) {
                throw new SecurityException("LEGAL role required to read " + inner.title());
            }
            return inner.body();
        }
    }

    public static void main(String[] args) {
        List<Document> docs = List.of(
                new LazyDocument("d1", "Q3 report"),
                new LazyDocument("d2", "Hiring plan"),
                new LazyDocument("d3", "Merger terms"));

        System.out.println("list screen:");
        docs.forEach(d -> System.out.println("  " + d.title()));

        System.out.println("open Q3 report twice:");
        System.out.println("  " + docs.get(0).body());
        System.out.println("  " + docs.get(0).body());

        System.out.println("viewer opens Merger terms:");
        Document forViewer = new SecuredDocument(docs.get(2), Set.of("VIEWER"));
        try {
            forViewer.body();
        } catch (SecurityException e) {
            System.out.println("  denied: " + e.getMessage());
        }

        System.out.println("lawyer opens Merger terms:");
        Document forLawyer = new SecuredDocument(docs.get(2), Set.of("LEGAL"));
        System.out.println("  " + forLawyer.body());
    }
}
```

```output
list screen:
  Q3 report
  Hiring plan
  Merger terms
open Q3 report twice:
    (loading d1 from storage)
  content of d1
  content of d1
viewer opens Merger terms:
  denied: LEGAL role required to read Merger terms
lawyer opens Merger terms:
    (loading d3 from storage)
  content of d3
```

The list screen calls `title()` on three proxies, and nothing is loaded: the proxy answers from the data it was created with. The first `body()` call on the Q3 report creates the real `StoredDocument` — the "loading" line appears — and the second call reuses it. "Hiring plan" is never opened, so it is never loaded. Client code called the same two methods it would call on real documents and never knew the difference.

The protection proxy wraps the lazy proxy. When the viewer, who lacks the `LEGAL` role, asks for the body, `SecuredDocument` refuses *before* calling the inner object — so the merger document is not even loaded for an unauthorised request. When the lawyer asks, the check passes, the call reaches the lazy proxy, and only then is the document loaded. The order of the layers matters: with the protection proxy on the outside, denied requests cost nothing. Reversed, every denied request would still trigger a load.

### Making lazy initialisation thread-safe

The `realDocument()` method is more involved than a simple `if (real == null) real = new ...`, for a reason. Proxies are often shared between threads — a Spring bean, an entity in a cache — and two threads calling `body()` at the same moment could both see `null` and both create the real object. For a document that means loading it twice; for a proxy that opens a connection pool, it means two pools and a leak.

The code uses **double-checked locking**. The first check, without a lock, makes the common case (already loaded) fast. Only if it sees `null` does a thread take the lock, check again — another thread may have finished the load while it waited — and create the object. The `volatile` keyword is essential: without it, the Java Memory Model allows another thread to see a non-null reference to an object whose constructor has not visibly finished. See [[c3-double-checked-locking]] and [[c3-volatile]].

When the lazily created object is a static singleton rather than a per-instance field, the **initialisation-on-demand holder** idiom is simpler — a nested class whose static field the JVM initialises lazily and safely on first use. For per-instance laziness, double-checked locking with `volatile`, or a plain `synchronized` method when the call is not hot, are the standard choices.

```quiz
Q: In `DocumentProxies`, why is the protection proxy placed outside the lazy proxy rather than inside it?
- [ ] Because Java requires security checks to be the outermost object
- [x] So that a denied request is rejected before it reaches the lazy proxy, and the document is never loaded for it
- [ ] Because a lazy proxy cannot be wrapped by another proxy
- [ ] So that the title becomes secret as well as the body
> A proxy only affects calls that reach it. With the permission check outermost, unauthorised callers are stopped before the lazy proxy runs, so they cannot trigger an expensive load. With the order reversed, the load would happen first and only then would the permission check fail.
```

## Caching proxies

A **caching proxy** returns a stored result when it has one and calls the real subject only on a miss. It is structurally the same as the caching decorator shown in [[d2-decorator]], and both names are used for it. What makes it proxy-like is the intent — avoiding access to an expensive real subject — and the consequences that come with it: the proxy is now responsible for deciding when a cached answer is too old.

Three questions decide whether a caching proxy is correct:

- **Invalidation.** When the real data changes, how does the proxy find out? Time-based expiry (time to live, TTL) is simple but serves stale data until it expires; explicit invalidation on writes is fresher but requires every write path to know about the cache. See [[d5-cache-invalidation]].
- **Keys.** The cache key must include *everything* that affects the result. A caching proxy in front of a per-user service whose key omits the user ID will serve one user's data to another.
- **Placement relative to protection.** As with the document example, a cache must sit *behind* the permission check, or cached data will be served to callers who should be denied.

## Dynamic proxies

Writing a proxy class by hand for every interface is repetitive, especially for cross-cutting behaviour such as logging or timing that is identical for every method. Java can generate proxy classes at runtime. `java.lang.reflect.Proxy.newProxyInstance` creates an object that implements any interfaces you name and sends every method call to a single `InvocationHandler`, which receives the method being called and its arguments.

```java title="DynamicProxyDemo.java"
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Proxy;
import java.util.Arrays;

public class DynamicProxyDemo {

    interface Catalog {
        long priceCents(String sku);
        long priceWithTaxCents(String sku);
    }

    static final class RealCatalog implements Catalog {
        public long priceCents(String sku) { return 1_000; }

        public long priceWithTaxCents(String sku) {
            return priceCents(sku) * 120 / 100;      // calls a method on 'this'
        }
    }

    /** Wraps any object implementing 'type' in a proxy that logs every call. */
    @SuppressWarnings("unchecked")
    static <T> T logged(T target, Class<T> type) {
        InvocationHandler handler = (proxy, method, args) -> {
            System.out.println("  call " + method.getName() + Arrays.toString(args));
            try {
                return method.invoke(target, args);  // forward to the real object
            } catch (InvocationTargetException e) {
                throw e.getCause();                  // rethrow the real exception
            }
        };
        return (T) Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[] {type}, handler);
    }

    public static void main(String[] args) {
        Catalog catalog = logged(new RealCatalog(), Catalog.class);

        System.out.println("priceCents -> " + catalog.priceCents("MUG"));
        System.out.println("priceWithTaxCents -> " + catalog.priceWithTaxCents("MUG"));

        System.out.println("is a Catalog?     " + (catalog instanceof Catalog));
        System.out.println("is a RealCatalog? " + (catalog instanceof RealCatalog));
        System.out.println("proxy class?      " + Proxy.isProxyClass(catalog.getClass()));
    }
}
```

```output
  call priceCents[MUG]
priceCents -> 1000
  call priceWithTaxCents[MUG]
priceWithTaxCents -> 1200
is a Catalog?     true
is a RealCatalog? false
proxy class?      true
```

The `logged` method works for *any* interface: the handler does not mention `Catalog` at all. Each call on the proxy arrives at the handler as a `Method` object plus arguments; the handler logs it and forwards it to the real object with reflection. The `catch` block unwraps `InvocationTargetException`, which reflection uses to wrap exceptions thrown by the target — without it, callers would see a reflection exception instead of the real one.

Now look closely at the second call. `priceWithTaxCents` was logged, but the `priceCents` call it makes internally was **not**. The proxy intercepted the client's call and forwarded it to `RealCatalog`. Inside `RealCatalog`, `priceCents(sku)` means `this.priceCents(sku)`, and `this` is the real object, not the proxy. The internal call never passes through the proxy, so the proxy cannot see it. This is called **self-invocation**, and it is exactly why a Spring `@Transactional` method called from another method in the same class runs without a transaction: Spring's transaction logic lives in a proxy, and internal calls bypass it. See [[c5-self-invocation]].

The last three lines show the identity consequences. The proxy is a `Catalog` but not a `RealCatalog` — it is an instance of a generated class. Code that checks or casts to the concrete class breaks when a proxy is introduced.

```quiz
Q: A Spring service has a public `placeOrder()` method that calls `this.saveAudit()`, and `saveAudit()` is annotated `@Transactional(propagation = REQUIRES_NEW)`. A controller calls `placeOrder()`. Does `saveAudit()` run in a new transaction?
- [ ] Yes, because the annotation is always applied when the method runs
- [x] No, because the call goes from the real object to itself and never passes through the proxy that starts transactions
- [ ] Yes, but only if `saveAudit()` is `private`
- [ ] No, because Spring ignores `REQUIRES_NEW` on public methods
> Spring's transaction logic lives in the proxy around the bean. The controller's call reaches the proxy, but the internal `this.saveAudit()` call is made on the real object, exactly like `priceCents` inside `priceWithTaxCents` in the demo above. Making the method `private` would make things worse, since proxies do not intercept private methods at all.
```

JDK dynamic proxies have one major limit: they can only implement **interfaces**. To proxy a class that has no interface, libraries generate a *subclass* at runtime that overrides each method — CGLIB and Byte Buddy do this. Subclass proxies cannot intercept `final` methods, cannot extend `final` classes, and do not intercept `private` methods. Spring uses JDK proxies or subclass proxies depending on the bean and configuration — Spring Boot defaults to subclass (CGLIB) proxies. See [[c5-jdk-vs-cglib]] and [[c5-final-methods-aop]].

## Proxies in frameworks

**Spring AOP.** For beans with `@Transactional`, `@Cacheable`, `@Async` or custom aspects, Spring creates a proxy around your object at startup and injects the proxy wherever the bean is used. A call from a controller goes to the proxy, which starts a transaction (or checks the cache, or submits to a thread pool), then calls your method, then commits or rolls back. Everything you saw above applies: only calls through the proxy are intercepted, self-invocation bypasses it, and `final` or `private` methods are not advised. Whether to call these proxies or decorators is a matter of taste — they add behaviour (decorator intent) through a generated proxy that controls access to the target. See [[c5-aop]] and [[c5-transactional-as-aop]].

**Hibernate lazy loading.** When an entity has a lazily loaded association, Hibernate gives you a proxy — a generated subclass of the entity, or a special collection — instead of loading the related rows. The first time you call a method on it, the proxy runs a query through the open persistence context. If the session has already been closed by then, the proxy has nothing to load with and throws `LazyInitializationException`. `EntityManager.getReference(...)` returns such a proxy deliberately, without hitting the database. Lazy proxies are also behind the classic N+1 query problem: looping over 100 orders and touching each one's lazy customer proxy runs 100 extra queries. See [[c8-lazy-proxies]] and [[c8-lazy-initialization-exception]].

**Remote proxies.** A gRPC client stub generated from a `.proto` file has a method for every Remote Procedure Call (RPC) the service offers. Calling `stub.getOrder(request)` looks like a local method call, but the stub serialises the request, sends it over HTTP/2, waits, and deserialises the response. Java RMI stubs worked the same way. See [[d6-grpc]].

> [!WARNING] A remote proxy must not hide the network
> A local method call takes nanoseconds and fails only on bugs. A remote call takes milliseconds or seconds, can time out, can fail halfway, and can succeed on the server while the response is lost. A remote proxy that makes these look identical encourages code that calls it in a loop or without timeouts. Good remote proxies expose deadlines, throw distinct network exceptions, and are documented as remote. Retries, timeouts and circuit breakers are then added around them deliberately. See [[c12-circuit-breakers]].

**Collections.** `Collections.unmodifiableList(list)` returns a protection proxy: reads are forwarded to the real list, and every mutating method throws `UnsupportedOperationException`. Changes made to the underlying list are still visible through it, which is the difference between an unmodifiable *view* and an immutable copy such as `List.copyOf`.

**Network proxies.** A reverse proxy such as nginx or a load balancer is the same idea at the network level: clients send requests to it as if it were the server, and it controls access — terminating TLS, checking authentication, caching, routing to a backend. See [[d4-forward-reverse-proxy]].

## Proxy compared with similar patterns

| Pattern | Interface | Relationship to the wrapped object | Purpose |
|---|---|---|---|
| Proxy | Same as the real subject | Often creates or locates it; may never hold it locally | Control access: when, whether, where |
| [[d2-decorator]] | Same as the wrapped object | Given a finished object; stacked by the client | Add behaviour |
| [[d2-adapter]] | Different from the wrapped object | Translates calls | Make an incompatible interface fit |
| [[d2-facade]] | New, simpler interface | Coordinates many objects | Simplify a subsystem |

**Proxy versus Decorator** is the comparison interviewers ask most, because the code can be identical. The distinction is intent and lifecycle. A decorator exists to add responsibilities — logging, compression, retries — and is usually composed by the client, often several layers deep. A proxy exists to control access to its subject — deferring its creation, checking permission, reaching it remotely — and frequently owns that subject's lifecycle; the client is usually unaware it holds a proxy at all. A caching wrapper or Spring's AOP proxies sit on the boundary, and either name is defensible as long as you can explain the intent.

**Proxy versus Facade**: a facade invents a new, simpler interface over several classes; a proxy keeps the exact interface of one object.

## Trade-offs and alternatives

Proxies let you add lazy loading, access control, caching and remote access without changing the real class or its clients, keep that control logic in one place, and — with dynamic proxies — apply the same behaviour to many interfaces with one handler.

The costs are mostly consequences of transparency. Behaviour is hidden: a method that looks like a field read may run a database query or a network call. Identity changes: `==`, `getClass()` and `instanceof` see the proxy, not the real object. Self-invocation bypasses the proxy. Generated proxies add startup cost and produce stack traces full of framework frames. Each layer adds a small per-call overhead, and a lazy proxy moves the cost of loading to an unpredictable later moment — possibly when a resource needed for loading is no longer available.

Alternatives:

- **Load eagerly** when the object is almost always needed; laziness only pays when much of the data is never used.
- **Explicit APIs** — a `DocumentSummary` for lists and a separate `loadDocument(id)` call for full content — make cost visible instead of hiding it, which is often clearer than a virtual proxy.
- **Decorator or AOP** when the goal is adding behaviour rather than controlling access.
- **Check permissions at the service layer** instead of wrapping individual objects, when access rules depend on more context than a single object has.

## Common mistakes

> [!MISTAKE] Thread-unsafe lazy initialisation
> `if (real == null) real = new RealSubject();` in a shared proxy lets two threads create two real objects, and without `volatile` a thread can see a partially constructed one. Use double-checked locking with a `volatile` field, a `synchronized` accessor, or the holder idiom for static singletons.

**Expecting self-invocation to go through the proxy.** Internal calls on `this` reach the real object directly. Move the method to another bean, call through the proxy explicitly, or restructure so the intercepted method is called from outside.

**Leaking the real object.** A protection proxy that has a method returning its inner object, or a real object that passes `this` to a callback, lets callers bypass the proxy's checks entirely.

**Relying on concrete types.** `instanceof RealCatalog`, casts to the implementation class, and `getClass().equals(...)` in `equals` methods break when a proxy is introduced. Hibernate entities whose `equals` compares `getClass()` are a well-known source of bugs for this reason.

**Hiding remote failures.** Treating a remote proxy as a local object leads to calls without timeouts and loops of network calls. Make the remote nature visible and handle network errors explicitly.

**Cache before authorisation.** A caching proxy outside a protection proxy serves cached data to callers who would have been denied.

**Proxying final methods.** Subclass-based proxies silently fail to intercept `final` methods — the call runs without the transaction or check you expected, and nothing warns you at runtime.

## Interview perspective

Interviewers ask "what is the Proxy pattern?", "Proxy versus Decorator?", "how does lazy loading work in Hibernate?", and "why doesn't `@Transactional` work when I call the method from the same class?". A strong answer names the kinds of proxy, writes a thread-safe virtual proxy, and explains self-invocation from the proxy's point of view. In design problems, proxies appear as caching layers in [[d3-cache]], protection layers in [[d3-library]] (members versus librarians), and rate-limited client wrappers in [[d3-rate-limiter-lld]].

> [!INTERVIEW] Connecting the pattern to Spring
> "A proxy implements the same interface as the real object and controls access to it — lazily creating it, checking permissions, caching, or forwarding over the network. Spring uses this for `@Transactional`: the bean I inject is a proxy that begins a transaction, calls my method on the real object, then commits or rolls back. That explains self-invocation: if one method calls another `@Transactional` method on `this`, the call goes straight to the real object and never passes through the proxy, so no new transaction starts. Hibernate's lazy associations are virtual proxies that query on first access, which is why they fail with `LazyInitializationException` once the session is closed."

Questions to prepare:

- **Name the kinds of proxy.** Virtual (lazy creation), protection (access checks), remote (stand-in for a remote object), caching, smart reference.
- **Proxy versus Decorator?** Same structure; a proxy controls access and often manages the subject's lifecycle, a decorator adds behaviour and is stacked by the client.
- **How do you make a virtual proxy thread-safe?** Double-checked locking with a `volatile` field, or synchronisation; explain why `volatile` is needed.
- **JDK dynamic proxy versus CGLIB?** JDK proxies implement interfaces; CGLIB generates subclasses, so it works on classes but cannot intercept `final` or `private` methods.
- **Why does self-invocation bypass `@Transactional`?** The internal call targets `this`, the real object, not the proxy holding the transaction logic.
- **What causes `LazyInitializationException`?** Touching a lazy Hibernate proxy after its persistence context has closed.

## Practice

1. **Caching proxy.** Add a `CachingDocument` proxy that caches `body()` results for 30 seconds, using an injectable clock so the expiry can be tested. Decide where it belongs relative to `SecuredDocument`.
2. **Audit proxy.** Use `java.lang.reflect.Proxy` to write `audited(target, type, user)` that records which user called which method, and apply it to the `Document` interface without writing a `Document`-specific class.
3. **Break and fix laziness.** Remove `synchronized` and `volatile` from `LazyDocument`, call `body()` from 50 threads started together (use a `CountDownLatch`), and count how many times "loading" prints. Then restore the fix.
4. **Self-invocation.** Modify `RealCatalog` so `priceWithTaxCents` goes through the proxy for its internal call, by giving it a reference to the proxy. Discuss why this is usually a design smell and what the cleaner alternative is.
5. **Read-only view.** Show with a small program that changes to a list are visible through `Collections.unmodifiableList` but not through `List.copyOf`, and explain which one is a proxy.

## Quick revision {#quick-revision}

- Proxy: a stand-in with the same interface as the real subject that controls whether, when and how calls reach it.
- Roles: subject interface, real subject, proxy (holds or can obtain the real subject; often manages its lifecycle).
- Kinds: virtual (lazy creation), protection (permission checks), remote (RPC/RMI stubs), caching, smart reference (counting, locking, auditing).
- Thread-safe lazy init: double-checked locking with a `volatile` field, a `synchronized` accessor, or the holder idiom for static singletons.
- Layer order matters: protection outside lazy loading and caching, so denied calls do no work and never see cached data.
- Dynamic proxies: `java.lang.reflect.Proxy` + `InvocationHandler`; interfaces only; unwrap `InvocationTargetException`. CGLIB/Byte Buddy subclass proxies work on classes but not `final`/`private` methods.
- Self-invocation: calls on `this` inside the real object bypass the proxy — why internal `@Transactional` calls get no transaction.
- Frameworks: Spring AOP proxies, Hibernate lazy proxies (`LazyInitializationException`, N+1), gRPC stubs, `Collections.unmodifiableList`, reverse proxies at the network level.
- vs Decorator (adds behaviour, client-stacked), Adapter (changes interface), Facade (new simpler interface over many classes).
- Pitfalls: hidden cost and remote failures, broken identity and `instanceof`, leaked real object, cache before auth.

## Key takeaways {#key-takeaways}

- A proxy keeps the real subject's interface and controls access to it, which lets lazy loading, security, caching and remote calls be added without changing clients.
- Proxy and Decorator share a structure; the difference is intent — controlling access and lifecycle versus adding behaviour.
- A proxy only sees calls that pass through it, which explains both layer ordering and the self-invocation problem in Spring.
- Transparency is a double-edged sword: hidden queries, network calls and identity changes are the source of most proxy bugs.
- Knowing how Spring, Hibernate and RPC stubs use proxies turns several confusing framework behaviours into predictable consequences of one pattern.
