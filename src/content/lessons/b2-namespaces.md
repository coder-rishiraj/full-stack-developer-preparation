---
summary: "Namespaces are TypeScript's original way to group code under one named object, from before JavaScript had modules. You will learn how they compile, how they merge with each other and with functions, classes and enums, why new application code uses ES modules instead, and where namespaces are still the right tool: declaration files and global type augmentation."
difficulty: intermediate
minutes: 35
objectives:
  - Explain what a namespace compiles to and how exported and non-exported members behave
  - Trace declaration merging between namespaces and with functions, classes and enums
  - Read ambient namespaces, `declare global` augmentations and `export as namespace` in declaration files
  - Compare namespaces with ES modules on tree-shaking, tooling support and erasable syntax
  - Decide when a namespace is appropriate and migrate one to modules
---

## Introduction

Before 2015, JavaScript had no module syntax. A large browser application was a pile of `<script>` tags sharing one global scope, and the standard defence against name collisions was the **namespace pattern**: put everything for a feature on a single global object, `MyApp.Validation.isEmail(...)`, built up by immediately invoked function expressions (IIFEs) so private helpers stayed hidden. TypeScript, released in 2012, turned that pattern into syntax. Originally called "internal modules", they were renamed **namespaces** in TypeScript 1.5 when ES modules arrived.

A namespace is a named block whose exported members become properties of an object with that name. That object can be created in one file and extended in others, which let early TypeScript projects split a global-script codebase into many files without a module loader.

Today, ES modules solve the same problem better, and the TypeScript handbook recommends modules for new code. So why learn namespaces? Because you will read them constantly. They are how declaration files describe global libraries, how type packages such as `@types/node` and `@types/express` group types (`NodeJS.ProcessEnv`, `Express.Request`), how you add properties to those types, and how a function or enum gets extra members attached. Older codebases (and the TypeScript compiler's own source until version 5.0) are full of them. This lesson teaches how they work so you can read and extend them confidently, and when not to write them.

Examples were compiled with TypeScript 6.0 and run with Node.js 22.

## Before you start

- **ES modules in TypeScript** — `import`, `export`, scripts versus modules. See [[b2-ts-modules]].
- **Interfaces** and how two interfaces with the same name combine. See [[b2-interfaces]] and [[b2-declaration-merging]].
- **IIFEs and the module pattern** in JavaScript, which namespaces compile to. See [[b1-iife]] and [[b1-module-pattern]].
- **Enums** and classes in TypeScript, for the merging examples. See [[b2-enums]] and [[b2-classes-ts]].

## The intuition

Imagine one big shared office (the global scope) where everyone's papers would get mixed up. A namespace is a labelled filing cabinet: everything about validation goes in the drawer marked `Validation`, and you refer to things by drawer and name, `Validation.LettersOnly`. Several people can add folders to the same drawer from different desks — that is namespace merging. Papers left in your own desk rather than placed in the drawer are private.

ES modules replaced the shared office with separate rooms, where nothing is shared unless you hand it over explicitly. Once every file is its own room, labelled drawers add little — which is why namespaces are rare in modern application code.

## Declaring a namespace

```ts title="src/validation.ts"
export namespace Validation {
  export interface Validator {
    isValid(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/; // not exported: private to the namespace

  export class LettersOnly implements Validator {
    isValid(s: string): boolean {
      return lettersRegexp.test(s);
    }
  }

  export const MAX_LENGTH = 20;
}

const v: Validation.Validator = new Validation.LettersOnly();
console.log(v.isValid("Hello"), v.isValid("Hello42"), Validation.MAX_LENGTH);
console.log(Object.keys(Validation));
```

```output
true false 20
[ 'LettersOnly', 'MAX_LENGTH' ]
```

Inside the block, members are visible to each other by their short names. Outside, only members marked `export` are reachable, through a **qualified name** such as `Validation.LettersOnly`. Both types (`Validator`) and values (`LettersOnly`, `MAX_LENGTH`) can be exported, and you use the same dotted syntax for both. The `export` before `namespace` itself is unrelated: it exports the namespace from the file, which is a module.

The second line of output shows the runtime reality. `Validation` is an ordinary object holding only the exported **values**. The interface is gone, and `lettersRegexp` is not a property because it was never exported.

## What a namespace compiles to

Here is the emitted JavaScript for the namespace above:

```js title="dist/validation.js"
export var Validation;
(function (Validation) {
    const lettersRegexp = /^[A-Za-z]+$/; // not exported: private to the namespace
    class LettersOnly {
        isValid(s) {
            return lettersRegexp.test(s);
        }
    }
    Validation.LettersOnly = LettersOnly;
    Validation.MAX_LENGTH = 20;
})(Validation || (Validation = {}));
```

This is the classic IIFE module pattern. A `var` is declared; then a function runs immediately, receiving either the existing object or a freshly created `{}`. Exported members are assigned as properties; non-exported ones stay as local variables of the function, private through closure (see [[b1-closures]]). The expression `Validation || (Validation = {})` is what makes **merging** possible: a second block with the same name receives the object the first block built, and adds to it.

Because a namespace with values produces real code, it is not "just types". That fact drives most of the modern advice about namespaces, covered below.

## Merging: one namespace, many blocks

Namespace declarations with the same name in the same scope merge into one namespace:

```ts title="src/merge.ts"
namespace Shapes {
  const unit = "cm";
  export function square(side: number): string {
    return `${side * side} ${unit}^2`;
  }
}

namespace Shapes {
  export function circle(r: number): string {
    return `${(Math.PI * r * r).toFixed(1)} cm^2`;
  }
}

console.log(Shapes.square(3), Shapes.circle(1));
export {};
```

```output
9 cm^2 3.1 cm^2
```

The merged `Shapes` has both functions. But merging is about the **exported** members only. Each block compiles to its own IIFE, so `unit` is a local variable of the first function and the second block cannot see it:

```output
src/merge.ts(6,20): error TS2304: Cannot find name 'unit'.
```

That is the error if the second block tries to use `unit`. In script-based projects, blocks could be in different files and still merge, because scripts share the global scope; in a module, all blocks must be in the same file, because each module has its own scope.

## Merging with functions, classes and enums

A namespace can also merge with a function, a class or an enum of the same name. The result is one entity with both meanings: you can call the function (or construct the class, or use the enum), *and* access the namespace's exports as properties of it. This is the main reason namespaces still appear in modern type declarations.

```ts title="src/merge.ts (continued)"
// A function merged with a namespace: callable, and carries properties
function format(n: number): string {
  return format.prefix + n.toFixed(format.digits);
}
namespace format {
  export const prefix = "$";
  export const digits = 2;
}

// An enum merged with a namespace: adds a helper next to the members
enum Level { Low = 1, High = 3 }
namespace Level {
  export function isUrgent(l: Level): boolean {
    return l === Level.High;
  }
}

console.log(format(9.5), Level.isUrgent(Level.High));
```

```output
$9.50 true
```

JavaScript functions are objects, so attaching properties to them is legal; the namespace gives those properties types. The same shape is common in CommonJS libraries that export a function with extra properties — for instance a `greet` function with a `greet.version` field — and their declaration files describe it as `declare function greet(...)` plus `declare namespace greet { const version: string; }`, followed by `export = greet` (see [[b2-esm-vs-cjs-ts]]).

Order matters when merging with a class or function: the namespace must come after, because its IIFE adds properties to an object that must already exist.

```output
src/a.ts(11,11): error TS2434: A namespace declaration cannot be located prior to a class or function with which it is merged.
```

A class merged with a namespace is a way to give a class nested types, such as `Card.Props` next to `class Card`. Static members cover the value side of that more directly today, so prefer `static` for values and use a namespace only when you need nested *types* under the class name.

## Nesting, dotted names and aliases

Namespaces can nest, and `namespace A.B.C { }` is shorthand for three nested blocks:

```ts
namespace App.Config.Defaults {
  export const retries = 3;
}
import D = App.Config.Defaults;
console.log(D.retries); // 3
```

The emit shows one IIFE per level, each creating the inner object if it does not exist:

```js
var App;
(function (App) {
    var Config;
    (function (Config) {
        var Defaults;
        (function (Defaults) {
            Defaults.retries = 3;
        })(Defaults = Config.Defaults || (Config.Defaults = {}));
    })(Config = App.Config || (App.Config = {}));
})(App || (App = {}));
var D = App.Config.Defaults;
```

`import D = App.Config.Defaults;` is an **alias declaration**. Despite the `import` keyword it loads nothing; it creates a short local name for a namespace (and compiles to a plain `var` when the namespace has values). Do not confuse it with `import x = require("...")`, which does load a module.

> [!NOTE] `module` versus `namespace`
> Old code writes `module Validation { }`. That is the pre-1.5 spelling of a namespace. TypeScript 6.0 rejects it with TS1540 and asks for the `namespace` keyword. The quoted form `declare module "name" { }` is different and still correct: it declares a *module*, not a namespace (see [[b2-ts-modules]]).

## Namespaces in declaration files

Most namespaces you meet today are **ambient**: written with `declare` in a `.d.ts` file, describing code that exists elsewhere. Ambient namespaces produce no JavaScript at all.

### Describing a global library

A library loaded with a plain `<script>` tag creates a global object. Its types are written as a global namespace:

```ts title="src/analytics.d.ts"
// Types for a library loaded with <script src="analytics.js">,
// which creates a global object called Analytics.
declare namespace Analytics {
  interface TrackEvent {
    name: string;
    props?: Record<string, string>;
  }
  function track(event: TrackEvent): void;
  const version: string;
}
```

```ts title="src/main.ts"
const evt: Analytics.TrackEvent = { name: "signup", props: { plan: "pro" } };
Analytics.track(evt);
Analytics.track({ nam: "typo" });
export {};
```

```output
src/main.ts(3,19): error TS2561: Object literal may only specify known properties, but 'nam' does not exist in type 'TrackEvent'. Did you mean to write 'name'?
```

Inside a `declare namespace`, members are exported implicitly, so `export` is not needed. The declaration file has no `import` or `export`, which keeps it a global script; see [[b2-declaration-files]].

### Augmenting a global namespace

Because interfaces and namespaces merge, any code can add members to a global namespace. From inside a module, the addition has to be wrapped in **`declare global`**, which says "these declarations belong to the global scope, not this module". Here a global event registry is declared in one file and extended by a feature module:

```ts title="src/events.d.ts"
declare namespace AppEvents {
  interface Registry {
    login: { userId: string };
  }
}
```

```ts title="src/billing.ts"
declare global {
  namespace AppEvents {
    interface Registry {
      invoicePaid: { invoiceId: string; amount: number };
    }
  }
}

export function emit<K extends keyof AppEvents.Registry>(
  name: K,
  payload: AppEvents.Registry[K],
): void {
  console.log(name, payload);
}

emit("login", { userId: "u1" });
emit("invoicePaid", { invoiceId: "i9", amount: 40 });
emit("invoicePaid", { invoiceId: "i9" });
```

```output
src/billing.ts(18,21): error TS2345: Argument of type '{ invoiceId: string; }' is not assignable to parameter of type '{ invoiceId: string; amount: number; }'.
  Property 'amount' is missing in type '{ invoiceId: string; }' but required in type '{ invoiceId: string; amount: number; }'.
```

The merged `Registry` has both events, so `keyof AppEvents.Registry` is `"login" | "invoicePaid"`, and the third call is caught. Real projects use exactly this to type environment variables (`namespace NodeJS { interface ProcessEnv { DATABASE_URL: string } }` with `@types/node`) and to add a `user` property to Express requests (`namespace Express { interface Request { user?: User } }`). The topic continues in [[b2-module-augmentation]].

### UMD globals: `export as namespace`

Some libraries work both as an imported module and as a `<script>` global (the Universal Module Definition (UMD) format). Their declaration files are modules that end with:

```ts title="node_modules/mathlib/index.d.ts"
export function clamp(n: number, lo: number, hi: number): number;
export as namespace MathLib;
```

`export as namespace MathLib` says "in non-module scripts, these exports are also available as a global called `MathLib`". From a module, using the global is an error unless you opt in with `allowUmdGlobalAccess`, because a module should import its dependencies:

```output
src/mod.ts(1,31): error TS2686: 'MathLib' refers to a UMD global, but the current file is a module. Consider adding an import instead.
```

## Why modules replaced namespaces

**Tree-shaking.** Bundlers remove unused exports by analysing `import` and `export` statements. A namespace with values compiles to an IIFE that assigns properties onto an object, and a bundler cannot easily prove which properties are never read. Bundling the same two helpers both ways with Rolldown 1.2 (the bundler in Vite 8), where only `shout` is used:

```ts title="util-ns.ts"
export namespace StringUtil {
  export function shout(s: string) { return s.toUpperCase() + "!"; }
  export function whisper(s: string) { return s.toLowerCase() + "..."; }
}
```

```ts title="util-mod.ts"
export function shout(s: string) { return s.toUpperCase() + "!"; }
export function whisper(s: string) { return s.toLowerCase() + "..."; }
```

```js title="bundle using the namespace"
let StringUtil;
(function(_StringUtil) {
	function shout(s) {
		return s.toUpperCase() + "!";
	}
	_StringUtil.shout = shout;
	function whisper(s) {
		return s.toLowerCase() + "...";
	}
	_StringUtil.whisper = whisper;
})(StringUtil || (StringUtil = {}));
console.log(StringUtil.shout("hi"));
```

```js title="bundle using the module"
function shout(s) {
	return s.toUpperCase() + "!";
}
console.log(shout("hi"));
```

The unused `whisper` survives in the namespace bundle and is removed from the module bundle. Across a large utility namespace, that difference is real download size (see [[b1-tree-shaking]]).

**Erasable syntax.** Node.js can run `.ts` files directly by stripping types (unflagged since Node.js 22.18 and 23.6), and TypeScript 5.8 added `erasableSyntaxOnly` to enforce code that works that way. A namespace with values is not erasable — removing its types leaves no valid JavaScript — so:

```output
src/ns.ts(5,18): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
```

and Node.js refuses it with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX: TypeScript namespace declaration is not supported in strip-only mode`. A namespace that contains only types (`export namespace Api { export type Id = string }`) is erasable and allowed. Single-file transpilers such as esbuild and Babel support value namespaces with some limits, but they are clearly second-class.

**Redundancy.** A module already is a scope with named exports. Wrapping a module's contents in `export namespace Validation { ... }` forces callers to write `Validation.X` on top of the import. If callers want a grouping name, they can write it themselves: `import * as Validation from "./validation.js"`.

## How it works internally

Namespaces take part in **declaration merging**, the compiler's rule that several declarations with the same name in the same scope can form one symbol. Each declaration contributes one or more *meanings*: a namespace contributes a namespace meaning (something that can appear before a dot in a type, like `Validation.Validator`) and, if it contains values, a value meaning; an interface contributes a type meaning; a function or class contributes a value meaning (and the class a type meaning). The binder collects all same-named declarations into one symbol, and the checker merges their member tables — interface members with interface members, namespace exports with namespace exports, namespace exports with a function's properties.

A namespace that contains only types (interfaces, type aliases, other type-only namespaces) is **non-instantiated**: it has no value meaning, and TypeScript emits nothing for it. One that contains any values is **instantiated** and emits the IIFE shown earlier. This is why `declare namespace` and type-only namespaces cost nothing at runtime.

## In real systems

You will mostly meet namespaces in four places. **Declaration files** for global libraries and for CommonJS packages that export a function with properties. **Global augmentation**, such as typing `process.env` through `NodeJS.ProcessEnv` or extending `Express.Request`. **Grouping related types** under one name in large type packages, like `React.JSX` in the React types. And **legacy applications** written before ES modules were practical, where the codebase may have been compiled with `outFile` into one script — an option TypeScript 6.0 deprecates.

When migrating such a codebase, the usual steps are: give each file real imports and exports, replace `Namespace.member` references with imports (an `import * as Namespace` keeps call sites unchanged), switch from `outFile` to a bundler, and turn on `isolatedModules` once no file depends on cross-file merging.

## Trade-offs and alternatives

| Need | Prefer | Why |
|---|---|---|
| Organise application code | ES modules | Standard, tree-shakeable, erasable, supported by every tool |
| Group names at the call site | `import * as Ns from "./x.js"` | Same `Ns.member` syntax, no runtime wrapper |
| Types for a global script library | `declare namespace` in a `.d.ts` | No runtime cost; matches the global object |
| Extra properties on an exported function | Function + namespace merge (in `.d.ts`), or a typed object | Describes real JavaScript shapes |
| Add to `NodeJS.ProcessEnv`, `Express.Request` | `declare global { namespace ... }` | The original types are namespaces; merging is the only way in |
| Nested types under a class or enum | Namespace merge, or plain exported types | Works, but separate exports are simpler |

## Common mistakes

**Writing new value namespaces in module code.** It adds a runtime wrapper, defeats tree-shaking and breaks erasable-syntax tools. Use exports.

**Expecting a non-exported member to be shared across merged blocks.** Each block is its own function scope. Export the member, or keep the blocks together.

**Putting a namespace before the class or function it merges with.** TS2434. Move it after.

**Augmenting a global namespace from a module without `declare global`.** Inside a module, `namespace NodeJS { ... }` creates a new, local namespace that merges with nothing, and the augmentation silently has no effect. Wrap it in `declare global { }`, and make sure the file is a module (has an `import` or `export {}`), since `declare global` is only allowed in modules.

**Using `module Foo { }`.** That is the obsolete spelling and an error in TypeScript 6.0. Write `namespace Foo { }`.

## Interview perspective

**"What is the difference between a namespace and a module?"** A module is a file with its own scope, loaded by the runtime or a bundler; a namespace is a named object created by an IIFE inside whatever scope declares it, and it can be extended by later blocks. Modules are standard JavaScript; namespaces are TypeScript-specific and compile to code.

**"Are namespaces deprecated?"** No, but they are not recommended for new application code. They remain the right tool for ambient declarations and global augmentation. Mention tree-shaking and `erasableSyntaxOnly` as concrete reasons to avoid value namespaces.

**"How do you add a property to `Express.Request`?"** Through declaration merging: in a module, `declare global { namespace Express { interface Request { user?: User } } }`. A strong answer explains why this works — the Express types declare `Request` inside a global namespace, and interfaces merge.

## Practice

1. Compile a namespace with one exported and one private constant and explain each line of the emitted IIFE.
2. Write a `debounce` function that also exposes `debounce.defaultDelay`, typed through a function–namespace merge. Then write the same thing as a plain object with a call signature type and compare.
3. Create a global `declare namespace Config { interface Flags { darkMode: boolean } }` and add a second flag from a module with `declare global`. Write a function that accepts `keyof Config.Flags`.
4. Convert a two-block namespace utility into ES modules, keeping every call site working through `import * as`.
5. Bundle both versions with Vite and compare output size when only one function is used.

```quiz
Q: Two `namespace Shapes { }` blocks are in the same file. The first declares `const unit = "cm"` without `export`. What happens when the second block uses `unit`?
- [ ] It works, because merged namespaces share all members
- [x] Error TS2304: each block compiles to its own function scope, and only exported members are merged
- [ ] It works only if the blocks are in different files
- [ ] It works at runtime but TypeScript reports a warning
> Merging combines exported members into one object. Non-exported declarations are local variables of each block's IIFE, so the second block cannot see `unit` at compile time or at runtime. Splitting the blocks across files does not change that.
```

```quiz
Q: Why does an unused function inside an exported value namespace usually survive tree-shaking?
- [ ] Bundlers ignore TypeScript files
- [x] The namespace compiles to an IIFE that assigns every member onto one object, which a bundler cannot easily prove unused
- [ ] Namespaces are always marked as having side effects in `package.json`
- [ ] The namespace's types are kept in the bundle
> Tree-shaking works on static `import`/`export` bindings. A namespace becomes a single object built by running a function, so the bundler sees one used binding (`StringUtil`) and keeps everything assigned to it. Separate module exports are separate bindings, and unused ones are dropped. Types never reach the bundle either way.
```

```quiz
Q: In a module file, you write `namespace NodeJS { interface ProcessEnv { API_KEY: string } }` but `process.env.API_KEY` is still `string | undefined`. Why?
- [ ] `ProcessEnv` cannot be augmented
- [ ] The interface must be declared as `type ProcessEnv = ...`
- [x] Inside a module the namespace is local; it must be wrapped in `declare global { }` to merge with the global `NodeJS` namespace
- [ ] The augmentation needs `export as namespace NodeJS`
> A module has its own scope, so the block creates a new module-local `NodeJS` namespace that nothing else refers to. `declare global` moves the declarations into the global scope, where they merge with the `NodeJS` namespace from `@types/node`. Type aliases cannot merge at all, and `export as namespace` is for UMD libraries.
```

## Quick revision {#quick-revision}

- `namespace X { export ... }` groups declarations; access with `X.member`; non-exported members are private.
- A namespace with values compiles to `var X; (function (X) { X.a = ...; })(X || (X = {}));` — an IIFE on a shared object.
- Same-name namespaces **merge** (exports only; each block has its own scope). In modules, only within one file.
- Namespaces merge with functions, classes and enums (namespace must come after the function or class: TS2434) to add properties or nested types.
- `namespace A.B.C {}` nests; `import D = A.B.C;` is an alias, not a module import.
- `module Foo {}` is obsolete (TS1540 in 6.0); `declare module "pkg" {}` is a different thing.
- Ambient: `declare namespace Lib { ... }` in a `.d.ts` types a global library; members implicitly exported; no emit.
- `declare global { namespace NodeJS { interface ProcessEnv {...} } }` augments global namespaces from a module.
- `export as namespace Lib;` declares a UMD global; using it from a module is TS2686 unless `allowUmdGlobalAccess`.
- Value namespaces: not tree-shakeable, not erasable (`erasableSyntaxOnly` TS1294; Node.js type stripping rejects them). Type-only namespaces are fine.

## Key takeaways {#key-takeaways}

- Namespaces are TypeScript's pre-module grouping mechanism; they compile to IIFEs that build a shared object.
- They merge with each other and with functions, classes and enums, which is how declaration files describe functions with properties.
- Use ES modules for application code; `import * as Name` gives the same call-site grouping without a runtime wrapper.
- Namespaces remain the right tool in declaration files and for augmenting global types such as `NodeJS.ProcessEnv` and `Express.Request`.
- Value namespaces cost bundle size and are incompatible with type stripping; type-only and ambient namespaces cost nothing.
