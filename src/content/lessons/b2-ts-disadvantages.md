---
summary: TypeScript has real costs — a build pipeline, a learning curve, types that can lie, friction with dynamic code and untyped libraries, and slower feedback on huge codebases. This lesson names each cost precisely, shows where it bites in code, and teaches the practices that keep it small, so you can judge when TypeScript is worth it.
difficulty: intermediate
minutes: 30
objectives:
  - Identify the main costs of adopting TypeScript and explain where each comes from
  - Explain how assertions and `any` make types lie, and replace them with `unknown` plus validation
  - Handle an untyped third-party library with `@types` or a minimal declaration
  - Choose a build setup that keeps feedback fast (transpile-only tools plus a separate type check)
  - Decide whether TypeScript fits a given project and justify the decision
---

## Introduction

[[b2-why-typescript]] made the case for TypeScript. An engineer who can only list benefits, though, has not really evaluated a tool. TypeScript costs something: setup, learning time, ongoing maintenance of types, occasional fights with the checker, and build time. On a large product those costs are usually small compared with the bugs and refactoring pain they prevent. On a one-day prototype, a tiny script or a highly dynamic piece of code, they can outweigh the benefits.

This lesson is about the costs, stated precisely. For each one you will see where it comes from, what it looks like in code, and how experienced teams reduce it. The goal is not to argue against TypeScript but to let you make — and defend — a deliberate decision, which is exactly what interviewers look for when they ask "what are the downsides?".

## Before you start

- **What TypeScript is**, including type erasure and that `as` is not a runtime check — [[b2-what-is-typescript]].
- **The benefits** you are weighing these costs against — [[b2-why-typescript]].
- **`any` and `unknown`** at an intuitive level; they are taught fully in [[b2-special-types]].

## The intuition

Types are like an insurance policy. You pay a premium continuously — writing and maintaining types, running the checker — and in return you are protected against a class of losses. Whether the policy is worth it depends on what you are insuring. Insuring a house you will live in for twenty years is sensible. Insuring a cardboard model you will throw away tomorrow is not.

The analogy also explains the worst outcome: paying the premium while the policy quietly covers nothing. A codebase full of `any` and unchecked assertions pays all of TypeScript's costs and gets few of its benefits. Much of this lesson is about avoiding that situation.

## Cost 1: A build step and more tooling

JavaScript can run as written. TypeScript must be type-checked by `tsc` and turned into JavaScript by something — `tsc` itself, esbuild, SWC, Babel, or a runtime's type stripping. That means a `tsconfig.json` to understand, compiler options that interact with your bundler, test runner, linter and module system, and source maps so stack traces point at `.ts` lines rather than emitted `.js` lines.

Most of the pain is not TypeScript itself but making several tools agree. A classic example is module configuration: `module`, `moduleResolution`, the `"type"` field in `package.json`, and whether imports need `.js` extensions all have to line up, or you get errors that are confusing to a beginner (see [[b2-esm-vs-cjs-ts]]).

**How teams reduce it:** use a framework template (Vite, Next.js, NestJS) whose TypeScript setup is already consistent; start from `tsc --init`, which in TypeScript 6.0 produces modern, strict defaults; and avoid deprecated options — TypeScript 6.0 warns about settings such as `target: "es5"`, `baseUrl` and `moduleResolution: "node10"` that are removed in TypeScript 7.

## Cost 2: Slower feedback on large codebases

Type checking a whole program is real computation. On a small project `tsc` finishes in a second or two. On a monorepo with millions of lines it can take minutes, and the editor can feel sluggish when the language service re-checks after each change. Some types are expensive in themselves: deeply recursive conditional types and large unions make the checker create many type **instantiations**, and a single over-clever utility type can noticeably slow a project.

**How teams reduce it:** separate running from checking. Development servers such as Vite strip types with esbuild and start instantly, while `tsc --noEmit` runs in the editor and in CI. Use `incremental` builds (which cache results in a `.tsbuildinfo` file) and project references to split monorepos (see [[b2-tsc-compilation]]). Use `skipLibCheck` to avoid re-checking every dependency's declaration files. Keep types simple unless complexity buys real safety. Longer term, TypeScript 7 is a native Go port of the compiler aimed at this cost; Microsoft reported roughly ten-times faster builds in its previews.

## Cost 3: Types can lie

This is the most dangerous cost because it is invisible. The checker believes what you tell it. Two features let you tell it things that are not true: **type assertions** (`as`) and **`any`**.

```typescript title="lie.ts"
interface User { id: number; email: string }

// Compiles: the assertion is a claim, not a check
const user = JSON.parse('{"id":"7","mail":"ada@example.com"}') as User;
user.email.toLowerCase(); // TypeError at runtime: email is undefined
```

`any` is worse because it spreads. `JSON.parse` returns `any`, so every property you read from its result is also `any`, and those values flow into typed code without complaint. A codebase can compile cleanly while large parts of it are effectively unchecked — paying TypeScript's costs and getting little of its safety.

The fix is to treat data you have not verified as **`unknown`**, a type that allows nothing until you prove what it is, and to check it at runtime:

```typescript title="parse.ts"
interface User {
  id: number;
  email: string;
}

function parseUser(input: unknown): User {
  if (
    typeof input === "object" && input !== null &&
    "id" in input && typeof input.id === "number" &&
    "email" in input && typeof input.email === "string"
  ) {
    return { id: input.id, email: input.email };
  }
  throw new Error("Invalid user payload");
}

console.log(parseUser(JSON.parse('{"id":7,"email":"ada@example.com"}')));
try {
  parseUser(JSON.parse('{"id":"7","mail":"ada@example.com"}'));
} catch (e) {
  console.log((e as Error).message);
}
```

```output
{ id: 7, email: 'ada@example.com' }
Invalid user payload
```

Each check in the `if` narrows `input` a little further — first to "a non-null object", then to "an object with a numeric `id`" — until TypeScript accepts that building a `User` from it is safe. The bad payload is rejected at the boundary with a clear message instead of crashing somewhere deeper. Writing these guards by hand gets tedious, which is why validation libraries such as Zod exist; they generate both the runtime check and the TypeScript type from one schema. (The `e as Error` in the `catch` is a deliberate, small assertion: caught values are `unknown` in strict mode, and here we know the only thing thrown is an `Error`.)

> [!MISTAKE] Using `any` to move fast
> Each `any` saves a minute now and removes checking from everything it touches. The debt is paid later, usually during a refactor when the compiler can no longer tell you what broke. Use `unknown` and narrow, or write the real type.

## Cost 4: Friction with dynamic patterns

Some idiomatic JavaScript is awkward to type. Building an object property by property is the simplest example:

```typescript title="dynamic.ts"
const config = {};
config.port = 3000;
config.host = "localhost";
```

```output
dynamic.ts(2,8): error TS2339: Property 'port' does not exist on type '{}'.
dynamic.ts(3,8): error TS2339: Property 'host' does not exist on type '{}'.
```

TypeScript inferred the type `{}` (an object with no known properties) from the initialiser and will not let it grow. The usual fixes are to build the object in one expression (`const config = { port: 3000, host: "localhost" }`) or declare the intended shape up front, for example `const config: Partial<Config> = {}`. Both are better code, but they are a change in habits.

Other patterns need more ceremony: mixins and monkey-patching (modifying objects or prototypes at runtime), functions whose return type depends on a string argument in complicated ways, event emitters with many event types, and heavily metaprogrammed libraries. They can all be typed, but sometimes only with overloads, generics or declaration merging that take longer to write than the code itself.

## Cost 5: The learning curve and type complexity

The basics — annotations, interfaces, unions — take days to learn. The advanced type system — generics with constraints, conditional types, mapped types, `infer`, template literal types — takes much longer, and library code uses it heavily. A beginner meeting this for the first time may struggle:

```typescript title="deep-readonly.ts"
type DeepReadonly<T> =
  T extends (...args: any[]) => unknown ? T
  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

const settings: DeepReadonly<{ theme: { color: string } }> = { theme: { color: "teal" } };
settings.theme.color = "red";
```

```output
deep-readonly.ts(7,16): error TS2540: Cannot assign to 'color' because it is a read-only property.
```

The type works — it makes every nested property read-only — but reading it requires understanding conditional types, mapped types and recursion. Error messages involving such types can run to many lines. In application code, this kind of type gymnastics is often a smell: it makes the code harder for the next person while protecting against little.

**How teams reduce it:** keep application types concrete and boring, and reach for advanced features only in shared utilities where the safety pays off across many call sites. Start with a concrete type and generalise only when a second real use appears.

## Cost 6: Untyped and mistyped dependencies

Your code is only as well typed as the declarations of the libraries it calls. Most popular packages ship their own types or have them in DefinitelyTyped (installed as `@types/<name>`). When neither exists, strict mode reports an error on import:

```output
use.ts(1,22): error TS7016: Could not find a declaration file for module 'legacy-chart'. '/app/node_modules/legacy-chart/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/legacy-chart` if it exists or add a new declaration (.d.ts) file containing `declare module 'legacy-chart';`
```

The quickest unblock is the one the message suggests: a file such as `types/legacy-chart.d.ts` containing `declare module "legacy-chart";`, which types the whole module as `any`. Better is to declare just the functions you use with real types. Community `@types` packages can also be wrong or lag behind the library's version, producing errors for code that works — you then have to patch the declaration with module augmentation (see [[b2-declaration-files]] and [[b2-module-augmentation]]).

## Cost 7: Types as ongoing maintenance

Types are code. They must be updated when the data changes, reviewed in pull requests and kept in sync with external sources such as API schemas and database tables. Hand-written copies of a backend's response types drift out of date silently, which is the "types can lie" problem in slow motion. The fix is to **generate** types from a single source of truth where possible — OpenAPI schemas, GraphQL schemas, database schemas, or a shared package in a monorepo — rather than maintaining parallel copies.

## Weighing the costs

| Situation | Usually worth it? | Why |
|---|---|---|
| Long-lived product, several developers | Yes | Refactoring safety and shared contracts outweigh setup and maintenance |
| Library published to npm | Yes | Consumers get `.d.ts` types; API mistakes surface before release |
| Small script or one-off automation | Often not | Little to refactor; build step costs more than it saves |
| Throwaway prototype or spike | Optional | Loose settings or plain JavaScript keep exploration fast |
| Existing large JavaScript codebase | Gradually | `allowJs`, `checkJs` and JSDoc first; convert high-traffic modules |
| Highly dynamic metaprogramming | Case by case | Typing it may cost more than the bugs it prevents |

Two middle grounds deserve mention. **JSDoc with `// @ts-check`** gives much of the checking with no build step, at the cost of verbosity (see [[b2-ts-vs-javascript]]). **Loose TypeScript** (strict off) lowers friction but also lowers safety; it is reasonable as a migration stage, not as a destination.

## In real systems

A pragmatic production setup looks like this: Vite or a similar tool strips types for instant development feedback; `tsc --noEmit` runs in CI and blocks merges; `strict` is on; external inputs are validated with a schema library that also produces types; API types are generated from the backend's schema; and `any` is banned by a lint rule (`@typescript-eslint/no-explicit-any`) with explicit, commented exceptions. That combination keeps each cost in this lesson small. When a team complains that "TypeScript slows us down", the cause is usually one of: no separation of transpile and type check, `any`-heavy code that makes errors confusing, or overly clever types.

## Common mistakes

**Treating `as` as a conversion.** It converts nothing and checks nothing. Validate, then let narrowing produce the type.

**Silencing errors with `// @ts-ignore`.** It hides the current error and any future error on that line. If you must suppress, use `// @ts-expect-error` with a comment explaining why; it fails when the error goes away, so it cannot rot unnoticed.

**Writing elaborate generic types for one call site.** Start concrete. Abstract when duplication appears.

**Running the full type check in the development loop.** It makes every save slow. Transpile-only for running, separate type check for verifying.

**Concluding "TypeScript is not for us" after a loose, `any`-heavy trial.** That trial paid the costs without collecting the benefits; it does not show what strict TypeScript would deliver.

## Interview perspective

**"What are the disadvantages of TypeScript?"** List them concretely — build tooling, learning curve, types that can lie through `any` and assertions, friction with dynamic patterns and untyped libraries, check time on big codebases, maintenance of types — and for each give the mitigation. Ending with when you would *not* use TypeScript (tiny scripts, throwaway prototypes) shows balanced judgement.

**"Is `as` safe?"** It is a compile-time claim with no runtime effect. It is acceptable when you know more than the checker (for example after a check it cannot follow), dangerous when used on external data.

**"How do you keep builds fast?"** Transpile with esbuild or SWC, type-check separately with `tsc --noEmit`, enable `incremental`, use project references, `skipLibCheck`, and avoid pathological types.

## Practice

1. Find an `as SomeType` on parsed JSON in a codebase you know (or write one) and replace it with an `unknown`-accepting parser function that throws on bad input.
2. Install a small package with no types, observe the `TS7016` error, write a minimal `.d.ts` that types only the function you use, and check that autocomplete works.
3. For three projects you have worked on, decide whether TypeScript was worth it using the table above, and write one sentence justifying each decision.

```quiz
Q: A codebase compiles with zero TypeScript errors, yet production keeps throwing `TypeError: Cannot read properties of undefined`. What is the most likely cause?
- [ ] TypeScript's checker has bugs that miss property access errors
- [x] Unvalidated external data is typed with `as` or flows through `any`, so the checker trusts wrong shapes
- [ ] The emitted JavaScript differs from the TypeScript logic
- [ ] Strict mode adds runtime checks that throw these errors
> The checker can only verify what it can see. Assertions and `any` tell it to trust shapes it never verified, typically at API or JSON boundaries. Emit preserves logic, and no mode adds runtime checks.
```

```quiz
Q: A team's development server takes 40 seconds to restart because it runs a full type check. What is the standard fix?
- [ ] Turn off `strict` to make the checker faster
- [ ] Replace types with `any` in slow files
- [x] Transpile with a type-stripping tool for development and run `tsc --noEmit` separately in the editor and CI
- [ ] Switch the target to ES5
> Separating transpiling from checking keeps the dev loop fast without losing safety. Turning off strictness or adding `any` reduces safety for a small gain, and an older target makes output larger, not checking faster.
```

## Quick revision {#quick-revision}

- Costs: build tooling, slower checks at scale, types that can lie, friction with dynamic code, learning curve, untyped dependencies, type maintenance.
- `as` and `any` make types lie; use `unknown` + narrowing or a schema validator at boundaries.
- `@ts-expect-error` over `@ts-ignore`, with a reason.
- Fast feedback: esbuild/SWC/Vite for running, `tsc --noEmit` for checking, `incremental`, project references, `skipLibCheck`.
- Untyped library: `@types/<name>`, else a `.d.ts` with `declare module "name"` or real declarations.
- Generate types from schemas instead of hand-copying them.
- Keep application types concrete; advanced types belong in shared utilities.
- Worth it for long-lived, multi-developer code and libraries; optional for scripts and prototypes.

## Key takeaways {#key-takeaways}

- TypeScript is not free; its costs are real and mostly predictable.
- The worst case is paying the costs while `any` and assertions remove the safety.
- Most costs have standard mitigations: separate transpile from check, validate boundaries, generate types, keep types simple.
- Judge TypeScript per project: the longer-lived and more collaborative the code, the clearer the payoff.
