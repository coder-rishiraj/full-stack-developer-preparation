---
summary: The singleton pattern guarantees that a class has exactly one instance and gives the whole program one way to reach it. You will learn the classic TypeScript implementation with a private constructor, why ES modules are usually a simpler singleton, where "only one" quietly breaks — async initialisation, duplicated modules, server-side rendering — and why many teams prefer dependency injection.
difficulty: intermediate
minutes: 35
objectives:
  - Implement a lazily created singleton in TypeScript with a private constructor and a static accessor
  - Explain why an ES module's top-level values already behave as singletons, and when that guarantee fails
  - Debug the async-initialisation race that creates two "singletons", and fix it by caching the promise
  - Evaluate the testing and server-side costs of global singletons and choose dependency injection where appropriate
---

## Introduction

Some objects should exist only once in a program. An application has one configuration. A browser tab usually needs one WebSocket connection to the server, not one per component. A Node.js process should share one database connection pool rather than opening a fresh pool in every module that runs a query. Creating a second instance of these objects is at best wasteful (two pools, twice the connections) and at worst wrong (two caches that disagree about the same data).

The **singleton pattern** is the classic object-oriented answer. A singleton class:

1. makes sure only **one instance** can ever be created, and
2. provides a **global access point** — usually a static method like `getInstance()` — through which every part of the program gets that same instance.

It is one of the original "Gang of Four" design patterns, and it appears constantly in interviews, partly because it is easy to write and partly because it is easy to criticise. In TypeScript there is an additional twist: the language's module system already gives you singletons for free, so the class-based version is needed less often than in Java or C#. This lesson covers the classic implementation, the module-based alternative, the ways "exactly one" fails in real JavaScript environments, and the design costs that lead many teams to avoid global singletons.

## Before you start

- **Access modifiers** — in particular `private` constructors, and the fact that TypeScript's `private` is compile-time only. See [[b2-public-private-protected]].
- **Static members** — properties and methods that belong to the class rather than to instances. See [[b1-instance-static]].
- **ES modules** — `import`, `export` and module scope. See [[b1-modules]] and [[b1-module-scope]].
- **Promises and `async`/`await`** — for the asynchronous singleton section. See [[b1-promises]] and [[b1-async-await]].

## The intuition

Think of a country's central bank. There is one; everyone who needs it knows how to reach it; nobody is allowed to open a second one. A singleton is the same arrangement in code: one instance, a well-known address, and a rule that forbids creating another.

The analogy also hints at the cost. Because everyone reaches the central bank directly, everything depends on it, and you cannot easily test how a shop behaves under a *different* bank. Global access is convenient and it is also a hidden dependency. Keep both halves in mind.

## The classic implementation

Three ingredients make a class a singleton: a **private constructor** so outside code cannot call `new`, a **private static field** that holds the one instance, and a **public static accessor** that creates the instance on first use and returns it every time after.

```typescript title="config.ts"
class Config {
  private static instance: Config | undefined;

  private constructor(readonly env: string) {
    console.log('creating Config');
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config('production');
    }
    return Config.instance;
  }
}

const a = Config.getInstance();
const b = Config.getInstance();
console.log(a === b, a.env);
```

```output
creating Config
true production
```

The constructor ran once. The second call found `Config.instance` already set and returned the same object, so `a === b`. This is **lazy initialisation**: nothing is created until the first caller asks, which matters when construction is expensive and might not be needed at all.

The private constructor is what turns "please use `getInstance`" from a convention into a compile-time rule:

```typescript title="config-errors.ts"
new Config('test');
// error TS2673: Constructor of class 'Config' is private and only accessible within
// the class declaration.

class TestConfig extends Config {}
// error TS2675: Cannot extend a class 'Config'. Class constructor is marked as private.
```

The second error is a useful side effect: a class with a private constructor cannot be subclassed, so nobody can create a second instance by inheriting.

The explicit return type `Config` on `getInstance()` is optional — inference gives the same result — but it states the contract for callers and keeps the method's type stable if the implementation changes.

### Eager initialisation

If the instance is cheap to build and always needed, create it when the class is defined, using a static field initialiser:

```typescript title="id-generator.ts"
class IdGenerator {
  static readonly instance = new IdGenerator();   // runs once, when the class is evaluated

  private next = 0;
  private constructor() {}

  nextId(): number {
    return ++this.next;
  }
}

console.log(IdGenerator.instance.nextId(), IdGenerator.instance.nextId());
```

```output
1 2
```

`readonly` stops anyone from replacing the instance, and there is no `if` check on every access. The trade-off is that construction happens at import time even if no caller ever uses it, and any error thrown by the constructor surfaces when the module is first imported, which can be confusing to debug.

## How it works internally, and where the guarantee ends

The private constructor is enforced by the type checker only. TypeScript erases `private`, so the emitted class has an ordinary constructor, and any code that bypasses type checking can call it. Appended to `config.ts`, after the calls above (so the real instance already exists):

```typescript title="bypass.ts"
const sneaky = new (Config as any)('sneaky');
console.log(sneaky === Config.getInstance());
```

```output
creating Config
false
```

The constructor ran a second time and produced a different object.

Within a well-typed codebase this rarely matters — `as any` is visible in code review. When you need a runtime guarantee, for example in a library used from plain JavaScript, keep the instance in a `static #instance` field and make the constructor throw if an instance already exists. That uses a native private field, which the engine enforces (see [[b2-public-private-protected]]).

Note what the pattern does *not* need in JavaScript: locks. In Java, two threads calling `getInstance()` at the same moment can both see `instance == null` and create two objects, so Java singletons need synchronisation or holder idioms. JavaScript runs your code on one thread per realm, and `getInstance()` is synchronous, so the check-then-create sequence cannot be interrupted. The JavaScript equivalent of that race appears only when initialisation is **asynchronous**, which is the next section.

## The async singleton race

Many real singletons need asynchronous setup — connecting to a database, loading configuration from a server. The obvious translation is wrong:

```typescript title="async-race.ts"
let connections = 0;
const pause = () => new Promise((r) => setTimeout(r, 10));

class NaiveDb {
  private static instance: NaiveDb | undefined;
  private constructor(readonly id: number) {}

  static async get(): Promise<NaiveDb> {
    if (!NaiveDb.instance) {
      await pause();                                  // simulate connecting
      NaiveDb.instance = new NaiveDb(++connections);
    }
    return NaiveDb.instance;
  }
}

class Db {
  private static pending: Promise<Db> | undefined;
  private constructor(readonly id: number) {}

  private static async connect(): Promise<Db> {
    await pause();
    return new Db(++connections);
  }

  static get(): Promise<Db> {
    Db.pending ??= Db.connect();                      // cache the promise, not the result
    return Db.pending;
  }
}

const [n1, n2] = await Promise.all([NaiveDb.get(), NaiveDb.get()]);
console.log('naive:', n1.id, n2.id, n1 === n2);

const [d1, d2] = await Promise.all([Db.get(), Db.get()]);
console.log('promise-cached:', d1.id, d2.id, d1 === d2);
```

```output
naive: 1 2 false
promise-cached: 3 3 true
```

Trace the naive version. The first call sees no instance and reaches `await pause()`, which suspends it. Control returns to the event loop, and the second call starts: it *also* sees no instance, because the first call has not finished, so it too begins connecting. Both eventually assign `NaiveDb.instance`, and the program ends up with two connections — exactly what the singleton was meant to prevent. The window is the `await`.

The fixed version stores the **promise** synchronously, before any `await`. The second caller finds the pending promise and waits on the same one. `??=` assigns only when the field is `null` or `undefined`. One refinement for production code: if `connect()` rejects, the rejected promise stays cached forever. Clear `Db.pending` in a `catch` so the next caller can retry. See [[b1-promises]] for how promises can be shared by many awaiters.

## Modules are already singletons

In JavaScript, an ES module is evaluated **once** per module record — in practice, once per resolved URL or file path — and every `import` of it receives the same bindings. Top-level values in a module are therefore shared by every importer, which is the essence of a singleton, with no class required:

```typescript title="counter.ts"
console.log('evaluating counter.ts');
let count = 0;
export const counter = {
  increment: (): number => ++count,
};
```

```typescript title="main.ts"
import { counter as a } from './counter.js';
import { counter as b } from './counter.js';

a.increment();
b.increment();
console.log(a === b, a.increment());
```

```output
evaluating counter.ts
true 3
```

The module body ran once, both imports refer to the same object, and the shared `count` reached 3. Because `count` is not exported, it is private to the module — runtime privacy without `#` fields. (The log says `counter.ts` because that is what the source file prints; at runtime Node.js loads the compiled `counter.js`.)

For most TypeScript applications this is the idiomatic singleton: `export const config = loadConfig()` or `export const queryClient = new QueryClient()`. It is shorter than the class version and cannot be bypassed by a cast. Use a class with `getInstance()` when you need lazy creation behind a stable API, or when a framework expects a class.

### When "once per module" is not once per program

The guarantee is "once per module record", and several ordinary situations create more than one record:

- **Different specifiers for the same file.** Node.js keys modules by URL, so `import('./counter.js?copy')` loads and evaluates the file a second time, producing a separate `count`. Mixed-case paths on case-insensitive file systems can do the same.
- **Duplicate packages.** If `node_modules` contains two versions of a library (one nested under another dependency), each copy has its own module-level state. Libraries that rely on a singleton (React's hooks dispatcher is the famous case) break with confusing errors.
- **Hot module replacement (HMR).** In development, Vite and Next.js re-evaluate edited modules. A module-level database client is recreated on every save, leaking connections. The widely used fix stores the instance on `globalThis` in development:

  ```typescript title="db.ts (pattern)"
  const globalForDb = globalThis as unknown as { db?: DbClient };
  export const db = globalForDb.db ?? createDbClient();
  if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
  ```

  `globalThis` survives module re-evaluation, so the second evaluation reuses the existing client. (`DbClient` and `createDbClient` stand for your database library's types.)
- **Separate realms.** Each browser tab, iframe and Web Worker has its own JavaScript realm and its own module instances. A "singleton" WebSocket in a page is one per tab; sharing across tabs needs a `SharedWorker` or `BroadcastChannel`.

## Singletons on the server: shared across users

On a Node.js server, a module-level or static singleton lives for the whole process and is shared by **every request from every user**. That is exactly right for a connection pool, and dangerous for anything holding per-user data. A classic server-side rendering (SSR) bug: a store created once at module level, filled with the current user's data during one request, and then served — still containing that data — to the next user. Next.js and similar frameworks document this pitfall. Per-request state must be created per request (or kept in request-scoped storage such as Node's `AsyncLocalStorage`), never in a singleton.

## Worked example: a testable settings service

This example keeps the convenience of a single shared instance while avoiding the testing problems of a hard-wired global. The class takes its dependency in the constructor; the module exports one shared instance; tests construct their own.

```typescript title="settings.ts"
export interface SettingsSource {
  read(): Record<string, string>;
}

export class Settings {
  private cache: Record<string, string> | undefined;

  constructor(private readonly source: SettingsSource) {}

  get(key: string, fallback: string): string {
    this.cache ??= this.source.read();          // lazy: read once, on first use
    return this.cache[key] ?? fallback;
  }
}

// The application's single shared instance.
const envSource: SettingsSource = {
  read: () => ({ THEME: 'dark' }),              // stands in for reading process.env
};
export const settings = new Settings(envSource);
```

```typescript title="settings-demo.ts"
import { settings, Settings } from './settings.js';

console.log(settings.get('THEME', 'light'));

// In a test: an independent instance with a controlled source.
let reads = 0;
const testSettings = new Settings({ read: () => { reads++; return {}; } });
console.log(testSettings.get('THEME', 'light'), testSettings.get('LANG', 'en'), reads);
```

```output
dark
light en 1
```

Walk through it. `settings` is the program-wide instance, created once by the module system: every module that imports it shares the same cache. The constructor is public on purpose, so tests can build a fresh `Settings` with a fake source instead of reaching into private static state or adding a `resetForTests()` hook. The `reads` counter shows the lazy cache working: two `get` calls, one read. Compare this with a classic `getInstance()` singleton that reads `process.env` internally — testing that requires mutating global environment variables and somehow resetting the hidden instance between tests.

## In real systems

- **Shared clients.** Database connection pools, Redis clients, HTTP clients with connection reuse, and React Query's `QueryClient` are typically created once and exported from a module.
- **Framework-managed singletons.** Angular's `@Injectable({ providedIn: 'root' })` and NestJS's default provider scope make a service a singleton *within the injector*. Spring's default bean scope is the same idea on the JVM (see [[c5-singleton-scope]]). The framework owns "only one"; your class keeps a normal constructor.
- **Logging and telemetry.** One logger or tracing provider per process, configured at start-up.
- **Browser-wide resources.** One WebSocket connection or one IndexedDB handle per tab, created lazily on first use.

## Trade-offs and alternatives

The singleton's strength is simplicity: one shared object, reachable from anywhere, created at most once. Its costs come from the "reachable from anywhere" half.

- **Hidden dependencies.** A function that calls `Config.getInstance()` internally depends on configuration, but its signature does not say so. Readers and tests cannot see the dependency.
- **Hard to test.** Every test shares one instance, so state leaks between tests, and substituting a fake requires reset hooks or module mocking.
- **Global mutable state.** If the singleton holds mutable state, any code anywhere can change behaviour everywhere else.

**Dependency injection (DI)** keeps the "one instance" property but removes the global access: create the instance once at the program's entry point (the *composition root*) and pass it to the code that needs it, usually through constructors. Frameworks automate this. The worked example above is a lightweight version. See [[c5-di]] for the full idea.

A practical rule: use a module-level instance for genuinely global infrastructure (a connection pool, a logger); use DI for anything business logic depends on; reach for the class-based `getInstance()` pattern mainly when lazy creation behind a fixed API is required.

## Common mistakes

> [!MISTAKE] Awaiting before storing the instance
> An `async getInstance()` that checks, awaits, then assigns can create several instances when called concurrently. Store the promise synchronously and return it to every caller.

> [!WARNING] Per-user data in a server-side singleton
> A singleton lives as long as the server process and is shared by all requests. Never keep the current user's data in it.

**Believing the private constructor is a runtime guarantee.** It is erased; `new (Config as any)()` works. Use a `#` field and a constructor check if you need enforcement.

**Adding `resetInstance()` for tests and leaving it public.** Production code can then call it. Prefer designs that let tests construct their own instances.

**Making everything a singleton.** A service that happens to have one instance today does not need to *forbid* a second. Restricting construction makes testing and future change harder for no benefit.

## Interview perspective

**"Implement a singleton in TypeScript."** Write the private constructor, private static instance and static accessor; then add the follow-ups unprompted: TypeScript's `private` is compile-time only; ES modules are simpler; async initialisation needs a cached promise.

**"Is the singleton thread-safe in JavaScript?"** Synchronous `getInstance()` is, because a realm runs one piece of JavaScript at a time. The async version has an interleaving race at each `await`. Separate workers and tabs have separate instances altogether.

**"Why is the singleton called an anti-pattern?"** Because it combines a global variable with a hidden dependency: it hurts testability and couples code to a concrete class. A good answer then says when it is still appropriate (process-wide infrastructure) and offers DI as the alternative.

**"What can break a module-level singleton?"** Duplicate package copies, different module specifiers, HMR re-evaluation, and separate realms.

## Practice

1. Implement a `FeatureFlags` singleton with lazy initialisation and a `isEnabled(name)` method. Then rewrite it as a module export. Compare line counts and testability.
2. Write an async `getConnection()` singleton that fails on its first attempt and succeeds on the second. Make sure a failed attempt does not stay cached.
3. In a Node.js project, import the same module with and without a `?v=2` query string and log a module-level counter from each. Explain the result.
4. Find a `getInstance()` call in code you know. What would it take to pass that dependency in through a constructor instead?

```quiz
Q: Two components call `await Db.get()` at the same moment, and `get` checks `if (!instance)`, then awaits a connection, then assigns `instance`. What happens?
- [ ] One call blocks until the other finishes, as with a lock
- [x] Both see no instance before either assignment happens, so two connections are created
- [ ] TypeScript reports a compile error for the race
- [ ] The second call throws because the constructor is private
> JavaScript does not block; `await` suspends the first call and lets the second run its check while `instance` is still unset. Storing the connection promise synchronously, before any `await`, makes both callers share one connection attempt.
```

```quiz
Q: Why does `export const client = new ApiClient()` behave like a singleton?
- [ ] `const` prevents a second `ApiClient` from being constructed anywhere
- [x] The module is evaluated once per module record, and every importer receives the same binding
- [ ] Exported values are frozen by the module system
- [ ] Bundlers deduplicate all objects with the same class
> Module evaluation happens once, so `new ApiClient()` runs once and all imports share that object. `const` only prevents reassignment of the binding; other code could still call `new ApiClient()`. The guarantee breaks if the module is loaded under two different specifiers or from two package copies.
```

## Quick revision {#quick-revision}

- Singleton: one instance plus a global access point.
- Classic TypeScript: `private constructor`, `private static instance`, `static getInstance()`; private constructor also blocks subclassing (TS2673, TS2675).
- Lazy (create in `getInstance`) versus eager (`static readonly instance = new X()` at class evaluation).
- TypeScript `private` is erased: `new (X as any)()` works; use `static #instance` plus a constructor check for runtime enforcement.
- No locks needed for synchronous access; async initialisation must cache the promise (`pending ??= connect()`), and clear it on failure.
- ES modules evaluate once per module record, so module-level exports are natural singletons.
- Breaks "only one": different specifiers (`?query`), duplicate packages, HMR (use `globalThis` in dev), separate tabs, iframes and workers.
- Server-side singletons are shared by all requests; never store per-user data.
- Costs: hidden dependencies, test coupling, global mutable state; alternative is dependency injection.

## Key takeaways {#key-takeaways}

- A singleton gives the program one shared instance and one way to reach it; the private constructor makes that a compile-time rule, not a runtime one.
- In TypeScript, a module-level `export const` is usually the simplest correct singleton.
- Asynchronous initialisation needs the promise cached synchronously, or concurrent callers create duplicates.
- "Exactly one" is per module record and per realm; duplicate packages, HMR and multiple tabs each break it in their own way.
- Use singletons for process-wide infrastructure, and prefer passing dependencies explicitly for everything else.
