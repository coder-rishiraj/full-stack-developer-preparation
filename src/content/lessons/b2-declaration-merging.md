---
summary: Declaration merging is TypeScript's rule for combining several declarations that share a name into one entity — interfaces merging their members, namespaces adding properties to functions, classes and enums, and module and global augmentations extending types you do not own. You will learn which declarations can merge, how conflicts and overloads are resolved, and how to safely extend library and global types such as Express's `Request` or `Window`.
difficulty: intermediate
minutes: 50
objectives:
  - Explain the three declaration spaces (value, type, namespace) and predict which same-name declarations merge or conflict
  - Predict the result of interface merging, including property conflicts and overload order
  - Use namespace merging to attach properties to functions, classes and enums
  - Extend global types with `declare global` and library types with module augmentation
  - Debug augmentations that silently do nothing or fail with "invalid module name"
---

## Introduction

Most languages treat two declarations with the same name in the same scope as an error. TypeScript usually does too — but for some kinds of declarations it does something more useful: it **merges** them into a single definition.

```typescript title="first-look.ts"
interface User {
  id: string;
}

interface User {
  email: string;
}

const u: User = { id: "u1", email: "ada@example.com" }; // needs both
console.log(Object.keys(u));
```

```output
[ 'id', 'email' ]
```

The two `interface User` blocks are combined into one interface with both members. This is **declaration merging**: when the compiler finds several declarations with the same name that are allowed to merge, it builds one entity from all of them.

Why would anyone want this? Because it lets you **add to a type you do not control**. TypeScript's own library files use it to add newer JavaScript methods to `Array` in later ECMAScript versions. Browser code uses it to declare a property your app puts on `window`. Server code uses it to add `req.user` to Express's `Request` type. Libraries such as Vue, i18next and MUI are designed around it: they ship an interface for your application to extend. Without merging, each of these would require forking type definitions or casting everywhere.

This lesson explains which declarations merge and how, then covers the two forms of merging into code you don't own: **global augmentation** and **module augmentation**.

## Before you start

- **Interfaces** — declaring object shapes. See [[b2-interfaces]].
- **Type aliases** and how they differ from interfaces. See [[b2-type-aliases]] and [[b2-interface-vs-type-when]].
- **Modules** — `import`/`export`, and the difference between a module and a script file. See [[b2-ts-modules]].
- **Function overloads** — several call signatures for one function. See [[b2-function-overloading]].
- Helpful: **declaration files** (`.d.ts`). See [[b2-declaration-files]].

## The intuition

Picture an interface as a set of transparent sheets stacked in a binder under one label. Each `interface User { ... }` block is a sheet. When the compiler needs `User`, it looks down through the whole stack and sees every member drawn on any sheet. Adding a sheet later — even in another file — changes what the stack shows.

The analogy stops working at conflicts: two sheets cannot draw *different* types for the same property. And it only applies to declarations that are designed to be open, such as interfaces and namespaces. A type alias is a single sealed card; a second card with the same label is an error, not an extra sheet.

## Declaration spaces: what a name can mean

To understand what merges, you need one idea first. Every TypeScript declaration creates a name in one or more of three **declaration spaces**:

- the **value** space — things that exist at runtime (variables, functions, classes, enums);
- the **type** space — things usable after a colon (interfaces, type aliases, classes, enums);
- the **namespace** space — containers accessed with a dot in types (`Express.Request`).

| Declaration | Namespace | Type | Value |
|---|---|---|---|
| `namespace N {}` (with values) | yes | | yes |
| `class C {}` | | yes | yes |
| `enum E {}` | | yes | yes |
| `interface I {}` | | yes | |
| `type T = ...` | | yes | |
| `function f() {}` | | | yes |
| `const v = ...` | | | yes |

Two declarations with the same name **only conflict if they claim the same space in an incompatible way**. That is why a `const OrderStatus` and a `type OrderStatus` can coexist (one is a value, the other a type — a pattern used in [[b2-keyof-typeof-patterns]]), and why a class can be merged with an interface (the interface adds to the class's type).

What may merge with what:

| First \ Second | Interface | Namespace | Class | Enum | Function | Type alias |
|---|---|---|---|---|---|---|
| **Interface** | merges | merges | merges | no | coexists (separate spaces) | no |
| **Namespace** | merges | merges | merges | merges | merges | coexists (separate spaces) |
| **Class** | merges | merges | no | no | no | no |
| **Enum** | no | merges | no | merges | no | no |

Type aliases never merge with anything that also claims the type space; a second `type T` is `error TS2300: Duplicate identifier 'T'`. They can share a name with a value or a namespace, because those live in other spaces — that is coexistence, not merging. Two classes cannot merge either.

## Merging interfaces

### Members are combined

All non-function members of same-name interfaces are combined into one interface. A property may appear in more than one declaration only if it has **the same type** each time:

```typescript title="interface-conflict.ts"
interface Box { width: number }
interface Box { height: number }   // fine: Box has width and height
interface Box { width: string }    // error
```

```output
error TS2717: Subsequent property declarations must have the same type.  Property 'width' must be of type 'number', but here has type 'string'.
```

Merging never overrides — it only adds. If you need a property with a different type, use a new interface with `extends` and `Omit` ([[b2-extending-interfaces]], [[b2-omit]]).

### Methods become overloads

Methods with the same name are not a conflict; each declaration's signatures become **overloads** of one method. The order matters, because overloads are tried top to bottom:

```typescript title="overload-order.ts"
interface Factory { create(kind: string): object }
interface Factory { create(kind: "button"): HTMLButtonElement; create(kind: number): object }

declare const factory: Factory;
const btn = factory.create("button"); // HTMLButtonElement
```

The rule: **later interface declarations' overloads come first** (so later declarations can refine earlier ones), and the relative order inside each declaration is kept. One exception: signatures whose parameter is a single string literal type are moved to the top, so specific overloads like `create(kind: "button")` win over general ones like `create(kind: string)`. The merged order here is `create("button")`, `create(number)`, `create(string)`. This is how the DOM's `createElement("div")` returns `HTMLDivElement` while `createElement(someString)` returns `HTMLElement`.

### Generic interfaces must agree

Every declaration of a generic interface must use identical type parameter names and constraints (`interface Array<T>` everywhere). That is how TypeScript's own library is assembled: `lib.es5.d.ts` declares `interface Array<T>` with the original methods, `lib.es2015.core.d.ts` declares `interface Array<T>` again with `find` and `fill`, and `lib.es2023.array.d.ts` adds `findLast` and `toSorted`. The `lib` and `target` options decide which files load, so the methods you can call depend on configuration ([[b2-tsconfig]]).

## Merging namespaces with functions, classes and enums

A **namespace** is TypeScript's older way of grouping code under a name (see [[b2-namespaces]]). Namespaces merge with each other, and — more usefully today — with functions, classes and enums to attach extra properties. This models a very common JavaScript pattern: a function that also has properties.

```typescript title="function-namespace.ts"
function greet(name: string) {
  return `Hello, ${name}`;
}

namespace greet {
  export const version = "1.2.0";
  export function shout(name: string) {
    return greet(name).toUpperCase();
  }
}

console.log(greet("Ada"));
console.log(greet.version, greet.shout("Lin"));
```

```output
Hello, Ada
1.2.0 HELLO, LIN
```

The function is the value; the namespace adds `version` and `shout` as properties of that same function object. The compiled JavaScript is an ordinary function followed by an IIFE that assigns the properties. Only `export`ed namespace members are visible from outside.

The same works for enums (adding helper functions) and classes (adding nested types or static-like members):

```typescript title="enum-namespace.ts"
enum Color { Red = "red", Green = "green" }

namespace Color {
  export function parse(s: string): Color | undefined {
    return (Object.values(Color) as string[]).includes(s) ? (s as Color) : undefined;
  }
}

console.log(Color.parse("green"), Color.parse("blue"));
```

```output
green undefined
```

Note a side effect: because the namespace stores `parse` on the same runtime object as the enum members, `Object.values(Color)` returns `["red", "green", parse]`. The `includes` check compares against strings, so the extra function does no harm here, but code that iterates over an enum's values must allow for merged members. The namespace must come *after* the function, class or enum it merges with, because at runtime it adds properties to an object that must already exist.

> [!NOTE] Modern alternative
> In ES-module code, many teams avoid namespaces and write `greet.version = "1.2.0"` directly after the function: TypeScript recognises property assignments to a function declaration and adds them to its type. Namespaces are not supported by "erasable syntax only" tools such as Node's built-in type stripping, because they generate code.

## Merging a class with an interface

An interface with the same name as a class merges into the class's instance type:

```typescript title="class-interface.ts"
class Car {
  drive() { return "driving"; }
}
interface Car {
  honk(): string;
}

const car = new Car();
console.log(car.drive());
console.log(typeof car.honk); // the type says it exists...
```

```output
driving
undefined
```

The compiler now believes every `Car` has `honk()`, but no implementation was written, so calling `car.honk()` would throw `TypeError: car.honk is not a function` at runtime. This merge is legitimate in declaration files, where it describes something a mixin or a library adds at runtime ([[b2-mixins]]). In application code it is a way to lie to the compiler; prefer `implements` and a real method.

## Global augmentation

Global types — `Window`, `globalThis`, `Array`, `String`, `ImportMeta` — are declared in TypeScript's library files as interfaces, which means you can merge into them. How you do it depends on whether your file is a **script** or a **module**:

- A **script** is a file with no top-level `import` or `export`. Its top-level declarations are global, so writing `interface Window { ... }` in it merges directly with the global `Window`.
- A **module** has at least one `import` or `export`. Its declarations are local to the module, so an `interface Window` there would be a *new, unrelated* local interface. To reach the global scope from a module, wrap the declarations in **`declare global { ... }`**.

```typescript title="globals.d.ts"
export {}; // makes this file a module, so `declare global` is allowed

declare global {
  interface Window {
    __APP_CONFIG__: { apiUrl: string; release: string };
  }
}
```

```typescript title="config.ts"
export function apiUrl(): string {
  return window.__APP_CONFIG__.apiUrl; // typed, no cast
}
```

The empty `export {}` exists only to make the file a module; `declare global` in a script file is `error TS2669: Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.` The augmentation must be part of the compilation — included by `tsconfig.json`'s `include` or `files`, or imported — otherwise it has no effect. (This snippet needs the DOM library; it was type-checked but not run in a browser.)

A global augmentation is a promise: something must actually set `window.__APP_CONFIG__` (for example, an inline script in the HTML page) before the code runs. Making the property optional (`__APP_CONFIG__?: ...`) is more honest when you are not sure.

## Module augmentation {#b2-module-augmentation}

**Module augmentation** is declaration merging into the exports of another module — typically a library from `node_modules`. You write `declare module "module-name" { ... }` inside a module file, and the interfaces you declare inside it merge with the interfaces of that name exported by the target module. It is how you add fields to a library's types without forking them: a property your middleware adds to an HTTP request, a custom colour in a UI theme, extra fields on a session object.

### The basic pattern

Express is the classic example. Authentication middleware sets `req.user`, but Express's `Request` type has no `user` property, so every handler would need a cast. Express's types declare `Request` in the package `express-serve-static-core`, and that is where the augmentation must go:

```typescript title="types/express.d.ts"
import "express-serve-static-core"; // makes this a module and loads the target

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; roles: string[] };
  }
}
```

```typescript title="routes.ts"
import express from "express";

const app = express();
app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).end();
  res.json({ id: req.user.id }); // typed by the augmentation
});
```

(These two files need the `express` and `@types/express` packages and were not run here; the rules they demonstrate are verified in the self-contained example below.)

Three rules make this work:

1. **The file must be a module.** The `import` at the top does that. In a script file (including a `.d.ts` file with no top-level `import` or `export`), `declare module "x"` is instead an *ambient module declaration* — the tool for describing an untyped JavaScript package from scratch ([[b2-declaration-files]]). For a package that already has types, that is harmful: in a check with TypeScript 6.0, the ambient declaration **replaced** the package's own types, so every other export of the package disappeared. (The `moduleDetection: "force"` option, which Vite's templates set, treats every non-declaration `.ts` file as a module, but `.d.ts` files are still detected by their imports and exports.)
2. **The module name must resolve** exactly as an `import` of that name would. If it cannot be found, TypeScript reports `error TS2664: Invalid module name in augmentation, module 'x' cannot be found.`
3. **You can only add declarations, not implementations.** An augmentation adds types; any runtime value it describes must be provided by real code (the middleware that sets `req.user`). Augmentations also cannot target a module's default export, only named exports.

### Designed-in augmentation: a registry interface

Many libraries ship an intentionally empty interface for applications to fill in. The library's functions are written against `keyof` that interface, so once your app augments it, the library's API becomes typed with *your* names. Here is a complete, runnable version of the pattern with a tiny event bus:

```typescript title="bus.ts"
// An empty interface that applications fill in through module augmentation.
export interface EventMap {}

type Listener<T> = (payload: T) => void;
const listeners = new Map<string, Listener<any>[]>();

export function on<K extends keyof EventMap>(name: K, fn: Listener<EventMap[K]>): void {
  listeners.set(name as string, [...(listeners.get(name as string) ?? []), fn]);
}

export function emit<K extends keyof EventMap>(name: K, payload: EventMap[K]): void {
  for (const fn of listeners.get(name as string) ?? []) fn(payload);
}
```

```typescript title="app.ts"
import { emit, on } from "./bus.js";

declare module "./bus.js" {
  interface EventMap {
    "cart:add": { sku: string; qty: number };
    "user:login": { userId: string };
  }
}

on("cart:add", p => console.log(`added ${p.qty} x ${p.sku}`));
on("user:login", p => console.log(`login ${p.userId}`));

emit("cart:add", { sku: "A1", qty: 2 });
emit("user:login", { userId: "u7" });
// emit("cart:remove", { sku: "A1" });  // error: not a known event
// emit("cart:add", { sku: "A1" });     // error: qty is missing
```

```output
added 2 x A1
login u7
```

Before the augmentation, `keyof EventMap` is `never`, so no event can be emitted. After it, `EventMap` has two members, `on` and `emit` accept exactly those names, and each payload is checked through `EventMap[K]` ([[b2-keyof]], [[b2-indexed-access]]). Relative module names work in augmentations too; here `"./bus.js"` resolves to `bus.ts` under `module: nodenext`. Uncommenting the last two lines gives:

```output
error TS2345: Argument of type '"cart:remove"' is not assignable to parameter of type 'keyof EventMap'.
error TS2345: Argument of type '{ sku: string; }' is not assignable to parameter of type '{ sku: string; qty: number; }'.
```

Real libraries that use this design include Vue (`ComponentCustomProperties` for global properties), i18next (`CustomTypeOptions` for typed translation keys), MUI (`Palette` and `Theme` in `@mui/material/styles` for custom theme values) and Auth.js (`Session`). Their documentation names the module and interface to augment.

### When an augmentation silently does nothing

The worst failure is an augmentation that compiles but has no visible effect. It happens when you merge into an interface that has the right *name* but is not the one the library's functions use. Libraries sometimes declare a public interface that `extends` an internal one, and type their callbacks with the internal one:

```typescript title="wrong-target.ts"
// Inside the library (simplified):
//   core.d.ts:  export interface Request { url: string }
//   index.d.ts: export interface Request extends core.Request {}
//               export declare function handle(cb: (r: core.Request) => void): void;

import { handle } from "lib3";
declare module "lib3" {
  interface Request { userId?: string }  // merges into the *public* Request
}
handle(r => r.userId);                   // r is core.Request: no userId
```

```output
error TS2339: Property 'userId' does not exist on type 'Request'.
```

The augmentation merged successfully — into the wrong interface. This is exactly why Express augmentations target `express-serve-static-core` rather than `express`. When an augmentation seems to be ignored, go to the definition of the type your code actually receives (in an editor, "Go to Type Definition" on `req`) and augment the module where *that* interface is declared. Also check that the augmentation file is included in the compilation (`include` in `tsconfig.json`), since a `.d.ts` file that nothing includes has no effect.

## How it works internally

During binding — the compiler phase that creates **symbols** for declarations — the binder looks up each new declaration's name in the current scope. If a symbol already exists and the two declarations' flags are compatible (interface with interface, namespace with function, and so on), the binder adds the new declaration to the *existing* symbol instead of creating another. One symbol with several declarations is what "merged" means. If the flags are incompatible (two classes, two type aliases, a type alias and an interface), it reports a duplicate identifier.

When the checker later needs the type of that symbol, it collects members from every declaration: properties are united (and compared for identical types), methods are gathered into an ordered overload list. For augmentations, the checker resolves the module name (or the global scope), finds the target module's symbol, and merges the augmentation's declarations into that module's export symbols the same way.

Interface merging is purely a type-level operation and emits nothing. Namespace merging with functions, classes and enums *does* emit code — the namespace body becomes runtime assignments onto the existing object — which is why namespaces must follow the value they extend.

## In real systems

- **TypeScript's own `lib` files** build `Array`, `Promise`, `String` and others by merging interfaces per ECMAScript edition.
- **Environment typing.** Vite's `vite/client` types declare `ImportMetaEnv`; projects add their `VITE_*` variables by declaring `interface ImportMetaEnv { readonly VITE_API_URL: string }` in an `env.d.ts` file ([[b2-vite-typescript]]).
- **Server frameworks.** Express (`express-serve-static-core`), Fastify (`FastifyRequest`) and Koa use module augmentation for request decorations added by plugins ([[b2-express-typing]]).
- **UI and i18n libraries.** Theme and translation-key registries, as described above.
- **Polyfills.** A polyfill for a new built-in method pairs the runtime implementation with a global interface augmentation so the method type-checks.

## Trade-offs and alternatives

Merging is the only way to change types you do not own without forking them, and registry interfaces give libraries a clean extension point. The costs come from its invisibility: an augmentation in one file changes a type everywhere, nobody reading `req.user` sees where it came from, and a merged member is a promise that runtime code must keep. Accidental merging is also possible — declaring an `interface Request` in a script file merges with the DOM's global `Request` (the Fetch API type).

Alternatives:

- **Extend instead of merge** — `interface AuthedRequest extends Request { user: User }` — when only some code paths have the property; it makes the requirement explicit at the call site.
- **Wrap** a library function with your own typed function.
- **Use type aliases** when you want a type to be closed; they cannot be reopened.

As a rule: use module augmentation when a library documents it or when the property is truly present everywhere; use `extends` when it is only sometimes present.

## Common mistakes

> [!MISTAKE] Augmenting from a script file
> Without a top-level `import` or `export`, `declare module "lib" { ... }` declares an ambient module that replaces the library's types instead of extending them, and `declare global` is an error. Add an `import` of the target (or `export {}`) to make the file a module.

- **Expecting type aliases to merge.** A second `type X` is a duplicate identifier. Use an interface when you need openness.
- **Conflicting property types.** Merged properties must have identical types; merging cannot override.
- **Augmenting the wrong module.** Find the module where the interface your code receives is declared; for Express, `express-serve-static-core`.
- **Augmentation file not included.** Check `include` in `tsconfig.json`; a stray `.d.ts` outside it does nothing.
- **Declaring members nobody implements.** Merging an interface into a class or global adds types, not behaviour. Make uncertain additions optional.
- **Putting a namespace before its function or class.** The namespace's runtime code needs the object to exist first.

## Interview perspective

- *"What is declaration merging?"* — Same-name declarations combined into one; give the interface example, then the real use: extending library and global types.
- *"Interface or type alias for a public library type?"* — Interfaces, if consumers should be able to augment them; a type alias cannot be extended by merging. A strong answer mentions that this is the main practical difference between the two ([[b2-interface-vs-type-when]]).
- *"How do you add `user` to Express's `Request`?"* — Module augmentation of `express-serve-static-core` in a module file that the compilation includes; mention middleware must actually set it.
- *"Why is my augmentation ignored?"* — Script vs module, wrong target interface, file not included.
- Follow-ups: overload order of merged methods, `declare global`, and namespace merging with functions.

## Practice

1. Declare `interface Settings` in two blocks and predict which object literals are assignable. Then add a conflicting property and read the error.
2. Write a function `formatPrice` with a merged namespace exposing `currency` and `withSymbol()`. Then rewrite it without a namespace using direct property assignment.
3. Add a typed `window.analytics` object with `track(event: string): void` via `declare global`, and explain why making it optional might be safer.
4. Using the event-bus example, add a second module that augments `EventMap` with its own events, and confirm both sets are available everywhere.
5. In a project with Express installed, augment `Request` with `requestId: string` and write middleware that sets it. Then try augmenting `"express"` instead and observe what changes.

## Quick revision {#quick-revision}

- Merging = same-name declarations become one symbol. Interfaces, namespaces and enums merge with their own kind; namespaces merge with functions, classes and enums; interfaces merge with classes.
- Type aliases and classes never merge with their own kind: duplicate identifier.
- Three spaces: value, type, namespace; a `const X` and a `type X` can coexist.
- Interface merge: properties must have identical types; methods become overloads, later declarations first, single string-literal signatures hoisted.
- Namespace + function/class/enum adds runtime properties; the namespace must come after.
- Class + interface: types only, no implementation.
- Global augmentation: script files merge directly; modules use `declare global` (plus `export {}` if needed).
- Module augmentation: `declare module "name" { interface X { ... } }` in a module file; name must resolve (else TS2664); add declarations only; no default exports. In a script file the same syntax replaces the module's types.
- Silent failures: wrong target interface, file not in `include`.

## Key takeaways {#key-takeaways}

- Declaration merging lets several same-name declarations form one type, which is how TypeScript models open, extensible definitions.
- Interfaces merge; type aliases do not — choose interfaces for types others should be able to extend.
- Namespaces can attach properties to functions, classes and enums, mirroring a common JavaScript pattern.
- `declare global` and module augmentation extend types you do not own, but they only describe what runtime code must actually provide.
- Most augmentation bugs are a script-vs-module mistake, the wrong target interface, or a file the compiler never sees.

```quiz
Q: A file contains `type Theme = { color: string }` and later `type Theme = { font: string }`. What happens?
- [ ] `Theme` becomes `{ color: string; font: string }`
- [ ] The second declaration replaces the first
- [x] A compile error: duplicate identifier `Theme`
- [ ] `Theme` becomes a union of the two shapes
> Only declarations that are allowed to merge, such as interfaces, are combined. Type aliases are closed, so a second one with the same name is a duplicate identifier. With `interface Theme` twice, the first answer would be right.
```

```quiz
Q: Two interface declarations both define a method `get`. Declaration 1 has `get(k: string): unknown`, declaration 2 (later) has `get(k: number): number`. What is the order of the merged overloads?
- [x] `get(k: number)` first, then `get(k: string)`
- [ ] `get(k: string)` first, then `get(k: number)`
- [ ] A compile error because the method is declared twice
- [ ] Only the later signature is kept
> Later interface declarations contribute their overloads first, so they can refine earlier ones. Neither signature uses a single string literal parameter, so no hoisting applies. Methods with the same name become overloads rather than conflicting.
```

```quiz
Q: In `types/session.d.ts` you write `declare module "auth-lib" { interface Session { orgId: string } }` with no imports or exports in the file. Now every other import from `auth-lib` is an error. What is the most likely fix?
- [ ] Rename the interface to `SessionAugment`
- [x] Make the file a module (for example `import "auth-lib";` at the top) so the block is treated as an augmentation
- [ ] Change `interface` to `type`
- [ ] Use `declare global` instead of `declare module`
> In a script file, `declare module "auth-lib"` is an ambient module declaration that replaces the package's types, so only `Session` remains. An import or export turns the file into a module, so the block becomes an augmentation that merges with the library's `Session`. Type aliases cannot merge at all, and `declare global` targets global types, not a package's exports.
```
