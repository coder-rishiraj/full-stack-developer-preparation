---
summary: Every library you import gets its types from one of a few places — the package itself, a DefinitelyTyped `@types` package, a declaration you write, or a typed wrapper you build around it. You will learn how to find out which applies, how the compiler locates a package's types, and how to type an untyped or wrongly typed library without letting `any` leak through your codebase.
difficulty: intermediate
minutes: 45
objectives:
  - Identify where a package's types come from by reading its `package.json` and the compiler's resolution
  - Explain how `types`, `exports` type conditions, `typesVersions` and `moduleResolution` decide which declaration file loads
  - Write a local `declare module` declaration, including wildcard asset modules, and avoid the top-level import trap
  - Extend an existing library's types with module augmentation
  - Design a typed facade and runtime validation at the boundary with an untyped SDK or API
---

## Introduction

A TypeScript application is mostly made of code its team did not write: UI frameworks, HTTP clients, date libraries, analytics SDKs, payment widgets. Every one of those imports needs types, or the compiler cannot check how you call it. In practice, libraries fall into a few groups. Some are written in TypeScript and ship accurate types. Some are JavaScript with community types on DefinitelyTyped. Some have no types anywhere. And some have types that are incomplete or wrong.

This lesson is about handling all four situations deliberately. The core skill is not memorising syntax; it is knowing **where the types for an import come from**, how much to trust them, and how to put a typed boundary around code you cannot trust. That boundary matters because types do not exist at runtime: whatever a declaration file claims, the JavaScript does what it does.

[[b2-definitely-typed]] covers the `@types` ecosystem in depth. This lesson covers the full decision, including the cases where `@types` does not help.

## Before you start

- **Declaration files and `declare`** — see [[b2-declaration-files]].
- **`@types` packages and how they are versioned** — see [[b2-definitely-typed]].
- **`unknown` and narrowing** — needed for safe runtime validation. See [[b2-unknown]] and [[b2-narrowing]].
- **Declaration merging** — the mechanism behind module augmentation. See [[b2-declaration-merging]].

## The intuition: four ways to get a typed menu

Picture a café whose menu is written only in a language you cannot read. There are four ways to order safely. The café may print its own translated menu (the package **bundles its types**). A regular customer may have written a translation and pinned it to a public board (an **`@types` package**). You can write your own translation of the few dishes you order (a **local declaration**). Or you can send a trusted friend who speaks the language and only ever orders from a short list you agreed on (a **typed facade** that wraps the library).

The first two are about finding existing types. The last two are things you build. The facade is the one people skip, and it is often the most valuable, because it is the only option that can also check what comes back.

## Step 1: find out what the package provides

Open the package's `package.json` in `node_modules` (or on npm). Three fields matter.

The **`types`** field (older synonym: `typings`) points at the main declaration file:

```json title="node_modules/some-lib/package.json"
{
  "name": "some-lib",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

Modern packages often use **`exports`**, which maps each import path to files per condition. TypeScript reads the `"types"` condition, and it must come first inside each entry because conditions are matched in order:

```json title="node_modules/modern-lib/package.json"
{
  "name": "modern-lib",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js"
    }
  }
}
```

Here `import { x } from 'modern-lib/react'` gets its types from `dist/react.d.ts`. Subpaths not listed in `exports` cannot be imported at all.

Finally, **`typesVersions`** lets a package serve different declarations to different compiler versions, for example older declarations to TypeScript 4.x users:

```json title="node_modules/careful-lib/package.json"
{
  "types": "./index.d.ts",
  "typesVersions": {
    "<5.0": { "*": ["ts4/*"] }
  }
}
```

A compiler older than 5.0 redirects every lookup into `ts4/`; newer compilers ignore the mapping and use `index.d.ts`.

If none of these exist and there is no `.d.ts` next to the `main` file, the package has no bundled types. Then look for `@types/<name>`. If that does not exist either, you write a declaration.

### Why `moduleResolution` matters

Whether the compiler honours `exports` depends on `moduleResolution`. The `bundler`, `node16` and `nodenext` modes read `exports` and its `"types"` condition. The legacy `node10` mode (spelled `"node"` in older configs) ignores `exports` and falls back to `types`/`main`, which can load the wrong file or fail to find subpath types such as `modern-lib/react`. TypeScript 6 deprecates `node10`; using it now produces a TS5107 deprecation error unless silenced with `"ignoreDeprecations": "6.0"`. If a package's types "work in one project but not another", compare the two `moduleResolution` settings first. For code bundled by Vite or webpack, use `bundler`; for code run directly by Node.js, use `nodenext`.

## Step 2: judge the quality

Having types is not the same as having good types. Before you rely on a declaration, skim it. Warning signs include parameters and return values typed as `any`, callbacks typed as `Function`, options objects typed as `object` or `{ [key: string]: any }`, and promises typed as `Promise<any>`. Each of these switches the checker off for everything that flows through it, and the `any` spreads into your code without any error to tell you.

Wrong types are worse than missing ones, because they produce confident errors in correct code or accept incorrect code. When types are wrong, prefer a narrow, documented fix: a module augmentation (below) to add what is missing, a local patch with a link to an upstream issue, or a facade that hides the bad signature. Avoid spreading casts through the codebase.

## Local declarations with `declare module`

When no types exist, you write an **ambient module declaration**: a `.d.ts` file in your project that tells the compiler what a module exports.

### The shorthand: an explicit opt-out

The smallest declaration names the module with no body:

```ts title="src/types/shims.d.ts"
declare module 'old-sdk';
```

This is a **shorthand ambient module**. Every import from `old-sdk` becomes `any`, so the TS7016 error disappears and so does all checking. It is useful for one thing: unblocking a build while you write real types. Treat it as debt with a ticket attached, because a shorthand shim left in place for a year means a year of unchecked calls.

### A real declaration

Better is to declare only what you use, precisely. Suppose the app uses an untyped analytics package, `tiny-analytics`, whose JavaScript is:

```js title="node_modules/tiny-analytics/index.js"
export function createClient(opts) {
  return {
    track(event, props) {
      console.log(`[${opts.appId}] ${event}`, JSON.stringify(props ?? {}));
      return true;
    },
  };
}
```

You read the source (or the documentation) and write:

```ts title="src/types/tiny-analytics.d.ts"
// Hand-written types for the parts of tiny-analytics this app uses.
declare module 'tiny-analytics' {
  export interface ClientOptions {
    appId: string;
  }
  export interface Client {
    track(event: string, props?: Record<string, unknown>): boolean;
  }
  export function createClient(opts: ClientOptions): Client;
}
```

The file must be part of the compilation, which normally means it sits under a folder listed in `include`. You do not import it; ambient declarations apply to the whole project. Note the choice of `Record<string, unknown>` rather than `any` for `props`: callers can pass any object, but code that reads from it later must narrow first.

### Wildcard modules for assets

Bundlers let you import non-JavaScript files: `import logoUrl from './logo.svg'`. The compiler has no idea what such an import produces, so you describe a whole family of modules with a **wildcard pattern**:

```ts title="src/types/assets.d.ts"
declare module '*.svg' {
  const url: string;
  export default url;
}
```

Vite ships these declarations for common asset types in `vite/client`, which is why a Vite project lists it in `types`; see [[b2-vite-typescript]].

> [!WARNING] A top-level import turns a declaration into an augmentation
> If a `.d.ts` file has any top-level `import` or `export`, the file becomes a module, and `declare module 'x'` inside it no longer *declares* `x`; it *augments* an existing `x`. For a package with no types, TypeScript 6 then reports TS2665, "Invalid module name in augmentation. Module 'old-sdk' resolves to an untyped module", and the original TS7016 comes back. Keep pure declarations free of top-level imports. If you need a type from elsewhere, import it *inside* the `declare module` block or use an inline `import('node:http').Server` type.

## Module augmentation: adding to existing types

Sometimes a library has good types that are missing one thing your app adds. The classic example is middleware that attaches a `user` to an HTTP request object. **Module augmentation** reopens the library's module and merges extra members into its interfaces, using the same declaration-merging rules as two interfaces with the same name:

```ts title="src/types/http-lite-augment.d.ts"
import 'http-lite';

declare module 'http-lite' {
  interface Request {
    user?: { id: string };
  }
}
```

The top-level `import` is required here: it makes the file a module, which is exactly what turns `declare module` into an augmentation. After this, every `Request` from `http-lite` has an optional `user`, so `req.user?.id` type-checks in your handlers. Augmentation can add members to interfaces and namespaces; it cannot remove members or change an existing member's type. The full rules are in [[b2-module-augmentation]].

Typing an Express app relies heavily on this pattern; [[b2-express-typing]] shows it in context.

## Typed facades: wrap what you cannot trust

A **facade** is a small module of your own that is the *only* place in the app allowed to import the third-party library. The rest of the code imports your module instead. That gives you three things a declaration alone cannot. You can design a narrower, more precise API than the library's. You can swap or upgrade the library by editing one file. And you can add runtime checks where data enters your system.

Continuing the analytics example, the raw `track(event: string, props?)` accepts any event name and any properties. The product team, though, has a fixed list of events, each with required properties. A facade encodes that list:

```ts title="src/analytics.ts"
import { createClient } from 'tiny-analytics';

// The only events the app may send, and the properties each one requires.
type EventMap = {
  signup: { plan: 'free' | 'pro' };
  checkout: { cartTotal: number };
};

const client = createClient({ appId: 'shop-web' });

export function track<E extends keyof EventMap>(event: E, props: EventMap[E]): void {
  client.track(event, props);
}
```

```ts title="src/main.ts"
import { track } from './analytics.js';

track('signup', { plan: 'pro' });
track('checkout', { cartTotal: 59.5 });
```

```output
[shop-web] signup {"plan":"pro"}
[shop-web] checkout {"cartTotal":59.5}
```

The generic `E extends keyof EventMap` ties the second argument to the first using an indexed access type (see [[b2-indexed-access]]). Misuse now fails at compile time:

```ts title="src/bad.ts"
import { track } from './analytics.js';
track('signup', { plan: 'enterprise' });
track('logout', {});
```

```output
src/bad.ts(2,19): error TS2322: Type '"enterprise"' is not assignable to type '"free" | "pro"'.
src/bad.ts(3,7): error TS2345: Argument of type '"logout"' is not assignable to parameter of type 'keyof EventMap'.
```

A lint rule such as ESLint's `no-restricted-imports` can forbid importing `tiny-analytics` anywhere except `src/analytics.ts`, so the boundary stays a boundary (see [[b2-eslint-typescript]]).

## Runtime validation at the boundary

Declarations and facades constrain *your* calls. They cannot constrain what a library or network returns. If an SDK's declaration says `getRate(): Promise<Rate>` but the server sometimes sends `value` as a string, TypeScript will believe the declaration and the bug surfaces far away, as a wrong number on screen.

The defence is to treat external data as `unknown` and check it before giving it a type. This example contrasts a cast with a check:

```ts title="validate.ts"
interface Rate {
  currency: string;
  value: number;
}

// The type the SDK's declarations claim, and what the API sometimes really sends.
const responses = ['{"currency":"EUR","value":0.92}', '{"currency":"EUR","value":"0.92"}'];

function parseRate(json: string): Rate {
  const data: unknown = JSON.parse(json);
  if (
    typeof data === 'object' && data !== null &&
    'currency' in data && typeof data.currency === 'string' &&
    'value' in data && typeof data.value === 'number'
  ) {
    return { currency: data.currency, value: data.value };
  }
  throw new TypeError(`Unexpected rate payload: ${json}`);
}

for (const body of responses) {
  const trusted = JSON.parse(body) as Rate; // what a cast does: no checking
  console.log('cast:', trusted.value + 1); // number + number, says the type
  try {
    console.log('validated:', parseRate(body).value + 1);
  } catch (err) {
    console.log('validated:', (err as Error).message);
  }
}
```

```output
cast: 1.92
validated: 1.92
cast: 0.921
validated: Unexpected rate payload: {"currency":"EUR","value":"0.92"}
```

For the second payload the cast version prints `0.921`: the compiler was told `value` is a number, so `+ 1` was accepted, but at runtime it was string concatenation. The validated version fails loudly at the boundary with a message that names the bad data. In real projects you rarely hand-write these checks; a schema library such as Zod lets you declare the shape once and derive both the validator and the TypeScript type from it. The idea is the same.

When an API publishes a machine-readable schema, a third option is **code generation**: tools read an OpenAPI or GraphQL schema and generate TypeScript types (and often a typed client), so the types are produced from the same source as the server rather than written by hand. Generated types still describe what the server *promises*; pair them with validation when the server is not under your control. [[b2-type-safe-apis]] develops this further.

## How it works internally

When the compiler meets `import { x } from 'pkg'`, it performs module resolution according to `moduleResolution`. It looks for `pkg` in `node_modules`, reads `exports` (in `bundler`/`node16`/`nodenext` mode) or `types`/`main`, and tries to find a `.d.ts` (or `.ts`) file. If it finds only a `.js` file, it tries `node_modules/@types/pkg`. If that fails, it checks whether any ambient `declare module 'pkg'` (or a matching wildcard pattern) exists in the program. Only if all of these fail does it report TS7016, or, with `noImplicitAny` off, silently type the import as `any`.

Ambient declarations are global to the compilation. That is why a `declare module` file works without being imported, and why two different files declaring the same module merge (or conflict). It is also why the shim file must be inside `include`: a declaration file the compiler never loads has no effect.

None of this exists after compilation. Declarations, augmentations and generic facades all erase to plain JavaScript; the only runtime artefacts are the facade functions and the validation code you wrote deliberately.

## Publishing a library: types for your users

If you publish a package, you are on the other side of this lesson. Generate declarations with `declaration: true` (or let your build tool do it), point `types` and the `exports` `"types"` conditions at them, and check the result with a tool such as "Are the types wrong?" (`@arethetypeswrong/cli`), which detects packages whose types resolve differently under different `moduleResolution` modes. If your public declarations mention types from an `@types` package, that package must be a `dependency` or `peerDependency`, not a `devDependency`, or your users' builds will fail.

## In real systems

Larger codebases usually keep shims in one folder, such as `src/types/`, with a comment on each file saying why it exists and linking the upstream issue. Facades are common around payment providers, analytics, feature-flag clients and anything with a broad, loosely typed API. API clients are increasingly generated from OpenAPI or GraphQL schemas in continuous integration, so a backend change that renames a field breaks the frontend build rather than production. Validation libraries sit at every trust boundary: network responses, `localStorage`, `postMessage` data, and URL parameters.

## Trade-offs and alternatives

| Approach | Use when | Cost |
|---|---|---|
| Bundled types | The package ships them | None; check quality |
| `@types/*` | No bundled types; DefinitelyTyped has a matching version | Keep versions in sync |
| Shorthand `declare module 'x'` | You must unblock a build today | All checking lost; must be revisited |
| Precise `declare module` | Untyped package, small API surface used | Maintaining it when the library changes |
| Module augmentation | Good types missing members your app adds | Can only add, not change |
| Facade module | Broad or risky API; you want a narrow contract | One more layer to maintain |
| Runtime validation / codegen | Data crosses a trust boundary | Runtime cost; schema upkeep |

These combine. A typical robust setup is bundled or `@types` types underneath, a facade on top, and validation where data enters.

## Common mistakes

- **Leaving a shorthand shim forever.** `declare module 'x';` makes the error go away by making everything `any`. Replace it with real declarations, or at least declare the functions you call.
- **Adding a top-level import to a shim.** It silently converts the declaration into an augmentation; move the import inside the block.
- **A shim file outside `include`.** The compiler never sees it, so TS7016 remains. Check `tsc --listFiles` or `--explainFiles`.
- **Casting API data with `as`.** A cast is an unchecked assertion. Validate `unknown` data instead (see [[b2-type-assertions]]).
- **Importing the library everywhere.** Without a facade, swapping or upgrading it touches the whole codebase, and loose types spread.
- **Using `moduleResolution: "node"` with modern packages.** It ignores `exports`, so subpath types such as `pkg/react` go missing.

## Interview perspective

> [!INTERVIEW] What a strong answer sounds like
> "First I check whether the package ships types, then whether there's a matching `@types` package. If neither, I write a precise `declare module` for the parts we use, not a shorthand that makes everything `any`. For anything risky I put a facade in front of it, so there's one import site and a narrow typed API, and I validate data coming back at runtime, because declarations are only promises."

Questions to be ready for:

- **How does the compiler find types for `import 'pkg'`?** Module resolution through `exports`/`types`, then `@types/pkg`, then ambient `declare module` declarations; failing all, TS7016.
- **What is the difference between declaring and augmenting a module?** A declaration in a non-module `.d.ts` describes a module from scratch; `declare module` inside a module file merges into an existing one.
- **Why validate if you already have types?** Types are erased and declarations are unchecked; runtime data can violate them.
- **Follow-up: "How would you stop other developers bypassing your facade?"** A lint rule restricting imports of the library to one file, plus code review.

```quiz
Q: A shim file contains `import type { Server } from 'node:http';` at the top, followed by `declare module 'old-sdk' { export function ping(): string; }`. `old-sdk` is an untyped JavaScript package. What happens?
- [ ] It works; the import only brings in a type
- [x] The file is now a module, so `declare module` is treated as an augmentation of an untyped module, which is an error, and imports of `old-sdk` still report TS7016
- [ ] TypeScript merges the declaration into `node:http`
- [ ] The shim works, but only in files that import it
> Any top-level `import` or `export` makes a `.d.ts` a module, and inside a module `declare module 'x'` augments an existing module instead of declaring a new one. Augmenting a module that has no types is invalid (TS2665). `import type` still counts as a top-level import. Move the import inside the block, or use an inline `import('node:http').Server` type.

Q: Why does the facade in this lesson give stronger guarantees than the raw `tiny-analytics` declaration?
- [ ] It runs faster because generic functions are optimised
- [ ] It validates the event name at runtime
- [x] Its signature ties each event name to its own required properties, so invalid names and properties fail to compile
- [ ] It removes the need for the declaration file
> `track<E extends keyof EventMap>(event: E, props: EventMap[E])` limits `event` to known names and makes `props` depend on which name was passed. The facade still needs the underlying declaration to call `createClient`, and it adds no runtime checks; the guarantee is entirely at compile time.

Q: An API response is parsed with `JSON.parse(body) as Rate`, where `Rate.value` is `number`. The server sends `"value": "0.92"`. What does `rate.value + 1` produce?
- [ ] A compile error
- [ ] A runtime TypeError
- [x] The string `"0.921"`
- [ ] The number `1.92`
> The cast tells the compiler to believe `value` is a number, so it accepts `+ 1`. At runtime `value` is a string, so `+` concatenates. Nothing fails until the wrong value is displayed or stored, which is why external data should be validated as `unknown` instead of cast.
```

## Practice

1. Pick three dependencies from a real project and, for each, determine whether its types are bundled, from `@types`, or missing, by reading `package.json`. Note which use `exports` with a `"types"` condition.
2. Write a precise `declare module` for a small untyped package (or a JavaScript file of your own published locally), covering only the functions you call. Then deliberately add a top-level import and observe TS2665.
3. Augment a library's interface (for example, add a `requestId: string` to a request type) and use it in a handler.
4. Build a facade for `localStorage` that stores and reads typed settings, validating the parsed JSON before returning it.

## Quick revision {#quick-revision}

- Sources of types, in order of preference: bundled (`types`/`typings`, `exports` `"types"` condition) → `@types/<name>` → local `declare module` → facade on top of any of them.
- `exports` `"types"` must be the first condition; subpaths not in `exports` cannot be imported.
- `typesVersions` serves different declarations to different TypeScript versions.
- `moduleResolution`: `bundler`/`node16`/`nodenext` read `exports`; `node10` ignores it and is deprecated in TypeScript 6.
- `declare module 'x';` (shorthand) = everything `any`. Temporary only.
- `declare module '*.svg' { const url: string; export default url; }` for asset imports.
- Top-level `import`/`export` in a `.d.ts` turns `declare module` into an augmentation (TS2665 for untyped modules).
- Augmentation: `import 'lib'; declare module 'lib' { interface X { extra: T } }` adds members; cannot change or remove.
- Facade: one module owns the import, exposes a narrow typed API, can be enforced with `no-restricted-imports`.
- Validate external data as `unknown` (or with a schema library); `as` is an unchecked claim. Codegen from OpenAPI/GraphQL keeps types tied to the schema.

## Key takeaways {#key-takeaways}

- Before typing a library yourself, find out whether it already ships types or has a matching `@types` package, and check how good they are.
- `moduleResolution` decides whether `exports` is honoured, so the same package can have working types in one project and not another.
- A local declaration should describe precisely what you use; a shorthand shim is an `any` with a different name.
- Module augmentation adds members to existing types, and a top-level import is what turns a declaration into an augmentation.
- Facades give you a narrow contract and a single place to change; runtime validation is the only protection against data that contradicts the types.
