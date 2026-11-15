---
summary: "`tsconfig.json` tells the TypeScript compiler and your editor which files make up the project and how to check and emit them. You will learn how the file is structured, which options matter and why, what changed in TypeScript 6.0's defaults, how to share and split configurations, and how the `strict` family of flags and `noImplicitAny` turn TypeScript from a suggestion into a safety net."
difficulty: intermediate
minutes: 60
objectives:
  - Explain how `files`, `include`, `exclude` and imports decide which files are in a TypeScript program
  - Configure `target`, `lib`, `types`, `module`, `paths`, `rootDir` and `outDir` for a Node.js service and a bundled frontend
  - Use `extends`, `--showConfig` and project references to share and split configuration
  - Describe each flag enabled by `strict` and the extra checks outside it, with the bug each one catches
  - Fix `noImplicitAny` errors correctly, using annotations, contextual typing or `unknown` rather than `any`
---

## Introduction

A TypeScript compiler run needs answers to many questions before it can do anything. Which files belong to the project? Which JavaScript version should the output target, and which built-in APIs (DOM? Node.js?) exist at runtime? Should `import` stay as `import` or become `require`? Where do output files go? And how strict should type checking be — is a parameter with no type an error or silently `any`?

You could pass every answer as a command-line flag, but then every developer, the editor and the CI pipeline would have to pass the same flags in the same way. **`tsconfig.json`** puts the answers in one file at the root of the project. Its presence marks the directory as a TypeScript project, and every tool that understands TypeScript reads it: `tsc`, VS Code and other editors (through the TypeScript language service), Vite, esbuild, ts-node, tsx, Jest, Vitest and ESLint's TypeScript parser. It is the project's single source of truth for what "correct TypeScript" means.

Two consequences make this file worth understanding properly. First, most confusing TypeScript problems are configuration problems: a global like `process` is "not found", output lands in `dist/src/` instead of `dist/`, an alias import works in the editor and fails at runtime, or a project shows no errors because checking was effectively switched off. Second, the strictness options decide how many bugs TypeScript can catch at all. With `strict` off, TypeScript accepts code that crashes on the first `undefined`. This lesson covers the file as a whole, then the `strict` flags and `noImplicitAny` in their own sections.

Examples use TypeScript 6.0, the version in this repository. TypeScript 6.0 changed several defaults, and the lesson points out each difference from 5.x.

## Before you start

- **`tsc` and the compile pipeline** — what checking and emitting mean, and running `tsc` from the command line. See [[b2-tsc-compilation]].
- **Modules and module formats**, because a large share of options configure them. See [[b2-ts-modules]] and [[b2-esm-vs-cjs-ts]].
- **`null`, `undefined` and `any`**, which the strictness flags are mostly about. See [[b2-special-types]] and [[b2-strict-null-checks]].
- **JSON syntax.** `tsconfig.json` is actually JSONC: comments and trailing commas are allowed.

## The intuition

Think of `tsconfig.json` as the rulebook handed to a building inspector. It lists which buildings are on the site (the files), which building code applies (the target runtime and libraries), how strictly to inspect (the `strict` flags), and where to file the reports (the output folder). Two inspectors given the same rulebook reach the same verdict; two inspectors with different rulebooks may disagree about the same building. That is exactly what happens when the editor shows no errors and CI fails: they were reading different configurations, or one of them none at all.

## Anatomy of a `tsconfig.json`

A realistic configuration for a Node.js service looks like this:

```json title="tsconfig.json"
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "types": ["node"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

There are only a few top-level fields:

| Field | Purpose |
|---|---|
| `compilerOptions` | How to check and emit; almost all settings live here |
| `files` | An explicit list of root files |
| `include` / `exclude` | Glob patterns that add or remove root files |
| `extends` | Inherit from another config file or an npm package |
| `references` | Other TypeScript projects this one depends on (project references) |

`tsc` with no arguments looks for `tsconfig.json` in the current directory and then in each parent directory, and uses the first one it finds. `tsc -p path/to/tsconfig.json` (or a directory) picks one explicitly. If you pass file names on the command line, as in `tsc src/a.ts`, the config is ignored — TypeScript 6.0 reports an error if a `tsconfig.json` is present and asks you to add `--ignoreConfig` to confirm.

## Which files are in the program

The **program** is the set of files TypeScript checks together. It is built in two steps. First come the **root files**: everything listed in `files`, plus every file matched by `include` and not matched by `exclude`. If you set neither `files` nor `include`, `include` defaults to `["**/*"]`, every supported file under the config's directory. Second, TypeScript follows imports (and `/// <reference>` directives) from the root files and adds whatever they reach.

That second step surprises people, because **`exclude` only filters `include`**. It does not stop a file from entering the program through an import:

```json title="tsconfig.json"
{
  "compilerOptions": { "noEmit": true, "strict": true },
  "include": ["src"],
  "exclude": ["src/legacy"]
}
```

```ts title="src/main.ts"
import { old } from "./legacy/old";
console.log(old);
```

```output
src/legacy/old.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.
```

The excluded file is still checked, because `main.ts` imports it. `tsc --listFilesOnly` prints the full program and is the quickest way to answer "why is this file being checked?". `tsc --explainFiles` goes further and prints the reason each file was included.

`include` patterns support `*` (any characters except `/`), `?` (one character) and `**/` (any depth). `exclude` defaults to `node_modules`, `bower_components`, `jspm_packages` and the `outDir`, which stops the compiler from reading its own output as input.

## The options that matter most

TypeScript has well over a hundred compiler options, but a small set does most of the work. They fall into groups.

### Language and environment: `target`, `lib`, `types`

**`target`** is the JavaScript version of the *output*. Syntax newer than the target is rewritten into older equivalents (downlevelled). It also sets defaults for other options, such as `useDefineForClassFields`. TypeScript 6.0's default target is `es2025`, and `es5` is deprecated; in 5.x the default was `es5`, which is why old projects that never set it produce verbose output.

**`lib`** decides which built-in declarations exist: `Array.prototype.at`, `Promise`, `Map`, the DOM's `document` and `fetch`. If you do not set it, TypeScript uses the library matching `target` plus the DOM types. A Node.js service often sets `"lib": ["es2023"]` to remove the DOM, so that accidentally using `window` is a compile error. `lib` never adds polyfills: it describes what you promise exists at runtime.

**`types`** controls which packages under `node_modules/@types` are loaded *globally* without being imported. This matters for packages like `@types/node` and test runners' globals (`describe`, `expect`), which add global names. **TypeScript 6.0 changed the default to `[]`**: no `@types` package is loaded unless listed. A project upgraded from 5.x without a `types` setting will see errors like this, even though `@types/node` is installed:

```output
src/a.ts(1,13): error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
```

The fix is `"types": ["node"]` (add `"vitest/globals"` or `"jest"` as needed). `"types": ["*"]` restores the old load-everything behaviour. The change exists because loading every `@types` package — some pulled in transitively by dependencies — slowed builds and leaked unexpected globals into projects. Packages you import, such as `@types/react`, are found through the import and need no entry here.

### Modules: `module`, `moduleResolution`, `paths`

**`module`** sets the output module format and the rules for checking imports; **`moduleResolution`** sets how import strings are turned into files. Use `nodenext` for code Node.js runs and `preserve` (or `esnext` with `"moduleResolution": "bundler"`) for code a bundler processes. These are taught in depth in [[b2-ts-modules]] and [[b2-esm-vs-cjs-ts]].

**`paths`** maps import aliases to locations, so `@/components/Button` can mean `./src/components/Button`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "module": "preserve",
    "noEmit": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

```ts title="src/main.ts"
import { Button } from "@/components/Button";
console.log(Button());
```

`paths` entries are resolved relative to the config file. Older configurations pair `paths` with `baseUrl`; `baseUrl` is deprecated in TypeScript 6.0 and no longer needed.

> [!WARNING] `paths` does not change the output
> `paths` only teaches the *type checker* where aliases point. The emitted JavaScript still says `import "@/components/Button"`, and Node.js or a bundler that does not know the alias fails to load it. The runtime must be told the same thing: Vite's `resolve.alias` (or a plugin such as `vite-tsconfig-paths`), Jest's `moduleNameMapper`, or, for Node.js, the `"imports"` field of `package.json` with `#`-prefixed aliases, which both Node.js and TypeScript's `nodenext` resolution understand.

**`resolveJsonModule`** allows `import data from "./data.json"` with a typed result. **`allowJs`** lets `.js` files join the program, and **`checkJs`** type-checks them too, which is how JavaScript projects migrate gradually.

### Emit: `outDir`, `rootDir`, `noEmit`, `declaration`, `sourceMap`

**`outDir`** is where output goes; **`rootDir`** is the source folder whose layout is mirrored inside `outDir`, so `src/api/users.ts` becomes `dist/api/users.js` when `rootDir` is `src`. TypeScript 6.0 defaults `rootDir` to the directory containing `tsconfig.json` (5.x computed it from the common folder of all input files). A project that keeps sources in `src/` and never set `rootDir` now gets an error explaining the change rather than a silently different layout:

```output
tsconfig.json(1,21): error TS5011: The common source directory of 'tsconfig.json' is './src'. The 'rootDir' setting must be explicitly set to this or another path to adjust your output's file layout.
```

Set `"rootDir": "src"` and the output lands in `dist/` as expected.

**`noEmit`** checks without writing files; it is the right setting when Vite, esbuild or another tool does the transpiling. **`declaration`** emits `.d.ts` files for libraries (see [[b2-declaration-files]]), and **`sourceMap`** emits `.map` files for debugging (see [[b2-source-maps-ts]]). **`noEmitOnError`** writes nothing if there are type errors; by default `tsc` emits even when checking fails.

### Transpiler safety and interop

**`isolatedModules`** and **`verbatimModuleSyntax`** guarantee each file can be compiled on its own by esbuild, SWC, Babel or Node.js type stripping, and **`erasableSyntaxOnly`** (TypeScript 5.8) rejects syntax that cannot be erased by type stripping, such as enums and value namespaces. **`esModuleInterop`** controls CommonJS default imports and is always effectively on in TypeScript 6.0. **`skipLibCheck`** skips type-checking `.d.ts` files: it speeds up builds and avoids errors inside dependencies' type declarations you cannot fix, at the cost of not noticing when two of them conflict. Almost every real project enables it.

## Sharing configuration with `extends`

Large codebases and monorepos repeat the same settings in many projects. `extends` lets one config inherit from another — a relative path, or a package such as `@tsconfig/node22` or `@tsconfig/strictest` from the community-maintained `tsconfig/bases` collection. The rules of inheritance:

- `compilerOptions` merge **option by option**; the extending file wins on conflicts.
- `files`, `include`, `exclude` and `references` are **replaced**, not merged, if the extending file sets them.
- Relative paths in a config (`outDir`, `include`, `paths`) are resolved relative to the file they appear in.
- `extends` can be an array (TypeScript 5.0+); later entries override earlier ones.

`tsc --showConfig` prints the final, merged configuration, which removes all guessing. With this base and child:

```json title="configs/base.json"
{
  "compilerOptions": {
    "strict": true,
    "target": "es2022",
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "outDir": "../build"
  },
  "include": ["../shared"]
}
```

```json title="tsconfig.json"
{
  "extends": "./configs/base.json",
  "compilerOptions": {
    "module": "preserve",
    "noEmit": true,
    "target": "es2023",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

```output
{
    "compilerOptions": {
        "strict": true,
        "target": "es2023",
        "noUncheckedIndexedAccess": true,
        "skipLibCheck": true,
        "outDir": "./build",
        "module": "preserve",
        "noEmit": true,
        "paths": {
            "@/*": [
                "./src/*"
            ]
        }
    },
    "files": [
        "./src/main.ts",
        "./src/components/Button.ts"
    ],
    "include": [
        "src"
    ],
    "exclude": [
        "/app/build"
    ]
}
```

Read it line by line. `target` came from the child, overriding the base. `strict` and `noUncheckedIndexedAccess` were inherited. `outDir` was `../build` relative to `configs/`, so it became `./build` relative to the project. The base's `include` was replaced entirely by the child's. And `exclude` contains the output folder automatically.

## TypeScript 6.0 defaults and deprecations

TypeScript 6.0 is a transition release before TypeScript 7.0, the compiler rewritten in Go. It modernised defaults and deprecated old options, which now report error TS5101 or TS5107 unless you add `"ignoreDeprecations": "6.0"`; they will stop working in 7.0.

| Area | TypeScript 6.0 | TypeScript 5.x |
|---|---|---|
| `strict` | `true` by default | `false` by default |
| `target` | `es2025` by default; `es5` deprecated | `es5` by default |
| `module` | derived from `target` (`es2022` for the default target) | `commonjs` for the default target |
| `types` | `[]`; list global `@types` packages explicitly | every `@types` package loaded |
| `rootDir` | the `tsconfig.json` directory | common directory of all inputs |
| `noUncheckedSideEffectImports` | `true` by default | `false` by default |
| `esModuleInterop` | always on; `false` deprecated | `false` by default |
| Deprecated | `baseUrl`, `outFile`, `moduleResolution: node10`/`classic`, `module: amd`/`umd`/`system`/`none`, `alwaysStrict: false`, `downlevelIteration` | — |

`tsc --init` in 6.0 writes a short, strict configuration, including `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`, `moduleDetection: "force"` and `skipLibCheck`. Even so, write the important options explicitly in your own config: an explicit `"strict": true` keeps behaviour the same if the file is ever read by an older tool, and makes intent visible.

## Several configurations in one repository

Real repositories often contain code for different environments: browser code, a Node.js config file such as `vite.config.ts`, tests, and in monorepos several packages. One `tsconfig.json` cannot describe them all, because they need different `lib` and `types` settings — browser code must not see Node.js's `process`, and the Vite config must not see the DOM.

The answer is **project references**. Each part gets its own config, and a root "solution" config lists them:

```json title="tsconfig.json"
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

The empty `files` array means the root config itself contains no code; it only points to the projects. This is the layout Vite's `create-vite` templates generate. A referenced project usually sets **`composite: true`**, which requires `declaration` output and that every file is matched by `include`/`files`, so other projects can depend on it through its `.d.ts` output. **`tsc -b`** (build mode) then builds the referenced projects in dependency order and skips any whose inputs have not changed, using `.tsbuildinfo` files. In a large monorepo, this turns a ten-minute full check into seconds for an unchanged package. Editors understand references too: "go to definition" jumps to the source, not the `.d.ts`, when `declarationMap` is on.

## How editors and tools read the config

The editor's TypeScript server finds, for each open file, the nearest `tsconfig.json` whose program includes that file, and checks the file with that config's options. A file that no config includes is checked in an **inferred project** with default options — which is why a test file excluded from every config can show no errors in the editor while being completely unchecked. When the editor and `tsc` disagree, check that both use the same config (`tsc -p` with the right path) and the same TypeScript version (the editor can be set to use the workspace's `node_modules/typescript`).

Bundlers and runtime transpilers read only the parts they need, such as `paths`, `jsx`, `target`, `useDefineForClassFields` and `verbatimModuleSyntax`. None of them type-check. That is why every serious project also runs `tsc --noEmit` (or `tsc -b`) in CI.

## strict & Compiler Flags {#b2-strict-compiler-options}

The **`strict`** option is a single switch in `tsconfig.json` that turns on a family of type-checking flags together. Each flag closes one specific gap through which wrong code would otherwise pass the compiler: values that may be `null`, parameters with no type, callbacks with incompatible parameters, class fields that are never set, and so on. With all of them off, TypeScript checks only the most obvious mistakes; with them on, it catches most of the type errors that cause runtime crashes.

`strict` defaults to `true` in TypeScript 6.0. In 5.x and earlier it defaulted to `false`, so older projects and tutorials may assume it is off. New TypeScript releases sometimes add a flag to the family, which means upgrading TypeScript can surface new errors in a `strict` project — that is deliberate, and each release's notes list the change.

### What `strict` turns on

Every flag below can also be set individually. An individual setting overrides `strict`, so `"strict": true, "strictPropertyInitialization": false` enables everything except that one flag. Here is one file that breaks each rule:

```ts title="strict-demo.ts"
// noImplicitAny
function double(x) {
  return x * 2;
}

// strictNullChecks
function firstChar(s: string | undefined): string {
  return s.charAt(0);
}

// strictFunctionTypes
type Handler = (e: string | number) => void;
const onlyStrings = (e: string) => console.log(e.toUpperCase());
const h: Handler = onlyStrings;

// strictBindCallApply
function greet(name: string, times: number): string {
  return name.repeat(times);
}
greet.call(undefined, "hi", "3");

// strictPropertyInitialization
class Account {
  owner: string;
  balance = 0;
}

// noImplicitThis
const counter = {
  count: 0,
  later() {
    return function () {
      return this.count;
    };
  },
};

// useUnknownInCatchVariables
try {
  JSON.parse("{");
} catch (err) {
  console.log(err.message);
}
export {};
```

```output
strict-demo.ts(2,17): error TS7006: Parameter 'x' implicitly has an 'any' type.
strict-demo.ts(8,10): error TS18048: 's' is possibly 'undefined'.
strict-demo.ts(14,7): error TS2322: Type '(e: string) => void' is not assignable to type 'Handler'.
  Types of parameters 'e' and 'e' are incompatible.
    Type 'string | number' is not assignable to type 'string'.
      Type 'number' is not assignable to type 'string'.
strict-demo.ts(20,29): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
strict-demo.ts(24,3): error TS2564: Property 'owner' has no initializer and is not definitely assigned in the constructor.
strict-demo.ts(33,14): error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
strict-demo.ts(42,15): error TS18046: 'err' is of type 'unknown'.
```

With `"strict": false` the same file compiles without a single error. Each of those seven lines is a real bug:

| Flag | What it checks | The bug it prevents |
|---|---|---|
| `noImplicitAny` | A type that cannot be inferred is an error instead of `any` | Unchecked values spreading through the program (see [[b2-noimplicitany]]) |
| `strictNullChecks` | `null` and `undefined` are separate types, not members of every type | "Cannot read properties of undefined" — the most common JavaScript crash (see [[b2-strict-null-checks]]) |
| `strictFunctionTypes` | Function-typed values are checked contravariantly in their parameters | A handler for `string` being called with a `number` (see [[b2-function-variance]]) |
| `strictBindCallApply` | `call`, `apply` and `bind` check their arguments against the function | `greet.call(undefined, "hi", "3")` passing a string where a number is expected |
| `strictPropertyInitialization` | Class fields must be assigned in the declaration or constructor | Reading a field that is still `undefined` |
| `noImplicitThis` | `this` with an implicit `any` type is an error | A regular `function` inside a method losing the object's `this` |
| `useUnknownInCatchVariables` | `catch (err)` gives `err` the type `unknown` | Assuming every thrown value is an `Error` with a `.message` |
| `alwaysStrict` | Emits `"use strict"` and parses in strict mode | Sloppy-mode JavaScript semantics (see [[b1-strict-mode]]); `false` is deprecated in 6.0 |
| `strictBuiltinIteratorReturn` (5.6+) | Built-in iterators' "done" result has `value: undefined`, not `any` | Using the return value of a finished iterator as data |

A few of these deserve a closer look at *why* the rule is right.

**`strictFunctionTypes`.** `Handler` promises it can be called with a `string` or a `number`. `onlyStrings` can only handle strings. Assigning it to `Handler` lets someone call `h(42)`, which crashes on `(42).toUpperCase()`. Without the flag, TypeScript compares function parameters **bivariantly** — accepting the assignment if the types are related in either direction — which is convenient and unsound. The flag applies only to function type syntax; parameters of *methods* written in method syntax (`handle(e: string): void` in an interface) remain bivariant for compatibility with patterns like DOM event handlers.

**`strictPropertyInitialization`.** The fix depends on intent. Initialise the field (`owner = ""`), assign it in the constructor, make it optional (`owner?: string`) if it really may be missing, or — when a framework sets it after construction, as Angular's dependency injection or an ORM might — use the **definite assignment assertion** `owner!: string`, which tells the compiler "trust me". The `!` turns the check off for that field, so use it only when something outside the constructor guarantees the value. The flag requires `strictNullChecks`.

**`useUnknownInCatchVariables`.** JavaScript can `throw` anything: a string, a number, `undefined`. So the honest type of a caught value is `unknown`, and you narrow it before use:

```ts
try {
  JSON.parse("{");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.log(message);
}
```

### Useful checks outside `strict`

Some valuable flags are *not* part of `strict`, usually because they are noisy or require code changes that not every team wants. They must be enabled individually:

```ts title="extra.ts"
// noUncheckedIndexedAccess
const scores: Record<string, number> = { ada: 90 };
const s: number = scores["bob"];
const list = [10, 20];
const first: number = list[0];

// exactOptionalPropertyTypes
interface Settings { theme?: "dark" | "light" }
const settings: Settings = { theme: undefined };

// noImplicitReturns
function sign(n: number): string | undefined {
  if (n > 0) return "positive";
  if (n < 0) return "negative";
}

// noFallthroughCasesInSwitch
function label(n: number): string {
  let out = "";
  switch (n) {
    case 1:
      out = "one";
    case 2:
      out += "two";
      break;
  }
  return out;
}

// noImplicitOverride
class Base { save(): void {} }
class Child extends Base { save(): void {} }
export {};
```

```output
extra.ts(3,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.
extra.ts(5,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.
extra.ts(9,7): error TS2375: Type '{ theme: undefined; }' is not assignable to type 'Settings' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
  Types of property 'theme' are incompatible.
    Type 'undefined' is not assignable to type '"dark" | "light"'.
extra.ts(12,27): error TS7030: Not all code paths return a value.
extra.ts(21,5): error TS7029: Fallthrough case in switch.
extra.ts(32,28): error TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'Base'.
```

**`noUncheckedIndexedAccess`** adds `| undefined` to every index access on arrays and index signatures. Without it, `scores["bob"]` is typed `number` even though it is `undefined` at runtime — the type system simply assumes every key exists. The cost is visible in the second error: even `list[0]` on an array you can see has two elements becomes `number | undefined`, because TypeScript does not track array lengths. You handle it with a check, `?? defaultValue`, or by iterating with `for...of` instead of indices. It catches real off-by-one and missing-key bugs, which is why `tsc --init` enables it in 6.0.

**`exactOptionalPropertyTypes`** distinguishes "the property is missing" from "the property is present with the value `undefined`". This matters for code that checks `"theme" in settings` or spreads objects over defaults: `{ ...defaults, theme: undefined }` overwrites the default with `undefined`, while a missing key does not. If `undefined` is a legitimate value, write `theme?: "dark" | "light" | undefined`.

**`noImplicitReturns`** reports functions where some paths return a value and others fall off the end. **`noFallthroughCasesInSwitch`** reports a non-empty `case` that runs into the next one without `break` or `return`. **`noImplicitOverride`** requires the `override` keyword when a subclass method replaces a base method, so renaming the base method turns every stale override into an error instead of a silently new method. **`noPropertyAccessFromIndexSignature`** forces `obj["key"]` rather than `obj.key` for index-signature properties, making "this key might not exist" visible at the call site. **`noUnusedLocals`** and **`noUnusedParameters`** report dead code, though many teams leave that job to ESLint (see [[b2-eslint-typescript]]).

### Adopting strict flags in an existing project

In a new project, turn on `strict` before writing code; it costs nothing. In an existing project, turning it on at once may produce thousands of errors. Practical migration strategies:

1. Turn on flags one at a time, starting with the ones that find the most real bugs per error: usually `strictNullChecks`, then `noImplicitAny`.
2. Keep the strict setting in a separate config (`tsconfig.strict.json` that extends the main one) and run it in CI for a growing list of files that have been fixed, so new code is held to the higher standard.
3. Never "fix" errors by sprinkling `any`, `!` or `// @ts-ignore`. Each one moves the bug from compile time back to runtime. If a suppression is truly needed, prefer `// @ts-expect-error`, which itself becomes an error once the underlying problem is fixed, so suppressions cannot go stale.

> [!MISTAKE] Turning flags off to make errors go away
> When an upgrade or a new flag produces errors, disabling the flag hides the bugs it found. Read the first ten errors: in most codebases several are real defects. Disable a flag only with a written reason and a plan to re-enable it.

## noImplicitAny {#b2-noimplicitany}

**`noImplicitAny`** is a compiler option that makes TypeScript report an error whenever it would otherwise give something the type `any` silently — most often a function parameter written without a type annotation. It is part of the `strict` family, so it is on whenever `strict` is (the default in TypeScript 6.0).

### Why implicit `any` is dangerous

The type **`any`** switches type checking off for a value: you can call it, read any property from it, and pass it anywhere (see [[b2-special-types]] and [[b2-avoiding-any]]). When TypeScript cannot infer a type and `noImplicitAny` is off, it uses `any` without telling you. The problem is not the one parameter — it is that `any` **spreads**. Every expression computed from an `any` is also `any`, so one missing annotation silently disables checking for everything downstream:

```ts title="leak.ts"
function add(a, b) {
  return a + b;
}
const total = add(1, "2");
console.log(total);
console.log(total.toFixed(2));
```

Compiled with `"noImplicitAny": false`, this produces no errors, and running it prints:

```output
12
TypeError: total.toFixed is not a function
```

`a` and `b` were `any`, so `a + b` was `any`, so `add` returns `any`, so `total` is `any`, so `total.toFixed(2)` was accepted — and `"1" + "2"`-style string concatenation produced `"12"`, a string with no `toFixed`. With `noImplicitAny` on, the compiler stops this at the source:

```output
leak.ts(1,14): error TS7006: Parameter 'a' implicitly has an 'any' type.
leak.ts(1,17): error TS7006: Parameter 'b' implicitly has an 'any' type.
```

Annotating `function add(a: number, b: number): number` turns the call `add(1, "2")` into a compile error, which is the bug report you wanted.

### Where implicit `any` appears

The flag reports every place TypeScript would fall back to `any`. The common ones:

```ts title="cases.ts"
function draw({ x, y }) {}
function sum(...values) {}

const colors = { red: "#f00", green: "#0f0" };
function lookup(key: string) {
  return colors[key];
}

let late;
function readLate() { return late; }
late = 5;
```

```output
cases.ts(1,17): error TS7031: Binding element 'x' implicitly has an 'any' type.
cases.ts(1,20): error TS7031: Binding element 'y' implicitly has an 'any' type.
cases.ts(2,14): error TS7019: Rest parameter 'values' implicitly has an 'any[]' type.
cases.ts(6,10): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ red: string; green: string; }'.
  No index signature with a parameter of type 'string' was found on type '{ red: string; green: string; }'.
cases.ts(9,5): error TS7034: Variable 'late' implicitly has type 'any' in some locations where its type cannot be determined.
cases.ts(10,30): error TS7005: Variable 'late' implicitly has an 'any' type.
```

Destructured and rest parameters need types like any other parameter. Indexing an object with an arbitrary `string` (TS7053) is reported because `colors` has only two keys; type the parameter as `keyof typeof colors`, or give the object an index signature or `Record<string, string>` type if it is really a dictionary (see [[b2-index-signatures]]). An uninitialised `let` is fine when TypeScript can follow its assignments, but a variable read inside another function before its type is known is reported (TS7034/TS7005); give it a declared type, `let late: number | undefined`.

Imports from a JavaScript package without type declarations are also implicit `any`, reported as TS7016; the fix is an `@types` package or a declaration file (see [[b2-declaration-files]] and [[b2-definitely-typed]]).

### Where you do not need annotations

`noImplicitAny` does not mean "annotate everything". It fires only where inference fails. **Contextual typing** — inferring a type from where an expression is used — covers most callbacks:

```ts
const doubled = [1, 2, 3].map((n) => n * 2);            // n: number from the array
window.addEventListener("click", (e) => console.log(e.clientX)); // e: MouseEvent
const handler: (n: number) => void = function (n) { console.log(n); }; // n: number
```

None of these produce errors. The parameter types come from `Array.prototype.map`'s signature, from the DOM's mapping of `"click"` to `MouseEvent`, and from the declared type of `handler`. Variables with initialisers (`let count = 0`) and function return types are also inferred. The rule of thumb: annotate **function parameters** of declarations, and let inference handle the rest; see [[b2-type-inference]].

### Fixing errors the right way

When a value's type is truly not known in advance — parsed JSON, a message from another window, data from an untyped API — the correct type is **`unknown`**, not `any`. `unknown` accepts any value but forces you to check it before use (see [[b2-unknown]]):

```ts
function parseAge(json: string): number {
  const data: unknown = JSON.parse(json);
  if (typeof data === "object" && data !== null && "age" in data
      && typeof data.age === "number") {
    return data.age;
  }
  throw new Error("invalid payload");
}
```

When a function genuinely works with any type, use a **generic** to keep the relationship between input and output (`function first<T>(items: T[]): T | undefined`) instead of `any`. And writing `: any` explicitly to silence the error defeats the flag: the leak is identical, only now it is deliberate. ESLint's `@typescript-eslint/no-explicit-any` rule catches that.

### JavaScript files

With `allowJs` and `checkJs`, `noImplicitAny` applies to `.js` files too, and JSDoc comments provide the types:

```js title="price.js"
export function withTax(amount, rate) {
  return amount * (1 + rate);
}

/**
 * @param {number} amount
 * @param {number} rate
 */
export function withTax2(amount, rate) {
  return amount * (1 + rate);
}
withTax2(100, "0.2");
```

```output
price.js(1,25): error TS7006: Parameter 'amount' implicitly has an 'any' type.
price.js(1,33): error TS7006: Parameter 'rate' implicitly has an 'any' type.
price.js(12,15): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

This lets a JavaScript codebase gain type checking file by file before any file is renamed to `.ts`.

### Migrating a codebase to `noImplicitAny`

In a large JavaScript-to-TypeScript migration, `noImplicitAny` is often the last flag turned on, because every untyped parameter is an error. Work inward from the edges: type the data that enters the system first (API responses, configuration, function boundaries of shared modules), because inference then carries those types into the code that uses them. Tools such as TypeScript's "Infer parameter types from usage" quick fix can propose annotations, but review them — they infer what the code *does*, which may include the bug.

## In real systems

A typical Vite + React app has three configs: `tsconfig.json` (references only), `tsconfig.app.json` for `src/` with the DOM in `lib`, `"jsx": "react-jsx"`, `"moduleResolution": "bundler"` and `noEmit`, and `tsconfig.node.json` for `vite.config.ts` with `"types": ["node"]`. Vite transpiles, `tsc -b` checks in CI.

A Node.js service uses `"module": "nodenext"`, `"types": ["node"]`, `rootDir`/`outDir`, `sourceMap`, and runs the compiled output, or runs `.ts` directly through type stripping with `erasableSyntaxOnly` and `rewriteRelativeImportExtensions` enabled.

Monorepos keep a `tsconfig.base.json` with shared strictness flags, have each package `extends` it, connect packages with `references` and `composite`, and run `tsc -b` from the root. Teams often publish their base config as an internal npm package so every service starts from the same rules.

## Trade-offs and alternatives

| Decision | Benefit | Cost |
|---|---|---|
| `strict: true` | Catches the most common runtime crashes at compile time | More annotations and null checks; migration effort in old code |
| `noUncheckedIndexedAccess` | Catches missing keys and out-of-range indices | Extra checks even where an index is obviously valid |
| `exactOptionalPropertyTypes` | Precise modelling of missing versus `undefined` | Friction with libraries whose types were not written for it |
| `skipLibCheck: true` | Faster builds; no errors from dependencies' types | Conflicting declarations across packages go unnoticed |
| One config | Simple | Cannot give browser and Node.js code different globals |
| Project references | Correct globals per area; incremental builds | More files; `composite` constraints |
| `paths` aliases | Short, stable imports | Must be mirrored in every runtime and tool |

## Common mistakes

**Assuming `exclude` removes a file from checking.** It only filters `include`; imported files are always included. Use `tsc --explainFiles` to see why a file is present.

**Adding `paths` without configuring the runtime.** The code type-checks and then fails with "Cannot find module '@/...'" at runtime or in tests. Configure the same alias in Vite, Jest or Vitest, or use `package.json` `"imports"`.

**Upgrading to TypeScript 6.0 without reading the new defaults.** Missing globals (`types: []`), a changed output layout (`rootDir`), new strict errors in projects that never set `strict`, and deprecation errors are all expected. Set the options explicitly rather than reaching for `ignoreDeprecations` permanently.

**Expecting `lib` to provide features.** `"lib": ["es2023"]` lets you *call* `Array.prototype.findLast` without errors; it does not make it exist on an old runtime. Match `lib` to what the runtime supports, or add polyfills.

**Editing the wrong config.** In a references setup, changing the root `tsconfig.json`'s `compilerOptions` does nothing for `src/`, which is governed by `tsconfig.app.json`. Run `tsc -p tsconfig.app.json --showConfig` to see the effective settings.

**Silencing `noImplicitAny` with `: any`.** The error disappears and the unchecked value spreads exactly as before. Use a real type, `unknown`, or a generic.

## Interview perspective

**"What does `strict` do?"** It enables a family of checks — `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict`, `strictBuiltinIteratorReturn` — and future additions. Strong answers give an example bug for two or three of them and mention that individual flags override it and that 6.0 makes it the default.

**"Why is implicit `any` worse than explicit `any`?"** Both disable checking, but implicit `any` is invisible: nobody chose it, code review cannot see it, and it spreads to every derived value. Explicit `any` is at least searchable and lintable.

**"The editor shows no errors but CI does. What do you check?"** Whether both use the same config and TypeScript version; whether the file is in the config's program at all (an inferred project uses defaults); and whether the build tool type-checks at all — Vite and esbuild do not.

**"How would you introduce `strictNullChecks` into a 200,000-line codebase?"** Incrementally: a stricter config for a growing allowlist of files, CI enforcement for new files, fixes prioritised by module boundaries, and no blanket `!` assertions.

## Practice

1. Run `tsc --init` in an empty folder, then delete options one at a time and use `--showConfig` and a small source file to observe which defaults take over.
2. Create a base config and two configs that extend it, one for browser code (`lib` with DOM) and one for Node.js (`types: ["node"]`). Show that `window` is an error in the Node.js project and `process` in the browser one.
3. Take `strict-demo.ts` from this lesson and fix each error the way you would in production code, explaining why your fix is better than adding `any` or `!`.
4. Turn on `noUncheckedIndexedAccess` in a small existing project and categorise the errors: real bugs, provably safe accesses, and code that should iterate differently.
5. Write a `getConfigValue(key)` function over an object literal that compiles under `noImplicitAny` without using `any` or an index signature.

```quiz
Q: `tsconfig.json` has `"include": ["src"]` and `"exclude": ["src/legacy"]`. `src/main.ts` imports `./legacy/old`. Is `old.ts` type-checked?
- [ ] No, `exclude` removes it from the program
- [x] Yes, because files reached through imports join the program regardless of `exclude`
- [ ] Only if `skipLibCheck` is false
- [ ] Only in the editor, not in `tsc`
> `exclude` only filters which files `include` adds as roots. TypeScript then follows imports from the roots and adds every file they reach, so `old.ts` is checked. `skipLibCheck` concerns `.d.ts` files, and the editor and `tsc` build the program the same way.
```

```quiz
Q: After upgrading a Node.js project from TypeScript 5.x to 6.0, every use of `process` reports TS2591 although `@types/node` is installed. What is the fix?
- [ ] Reinstall `@types/node`
- [ ] Add `"lib": ["node"]`
- [x] Add `"types": ["node"]`, because TypeScript 6.0 no longer loads `@types` packages automatically
- [ ] Set `"strict": false`
> TypeScript 6.0 changed the default of `types` to `[]`, so global declarations from `@types` packages are only loaded when listed. `lib` covers built-in JavaScript and DOM libraries, not npm packages, and strictness has nothing to do with whether a global name exists.
```

```quiz
Q: With `noImplicitAny` off, `function add(a, b) { return a + b }` and `add(1, "2").toFixed(2)` compile. What makes this especially dangerous?
- [ ] `add` is emitted with the wrong JavaScript
- [x] The parameters become `any`, so the return value and everything computed from it are `any` and unchecked
- [ ] TypeScript infers `a` and `b` as `number` and the call is wrong
- [ ] The error is only reported at runtime by TypeScript
> Implicit `any` silently spreads: `a + b` on `any` values is `any`, so `add` returns `any`, and any property access on the result is accepted. At runtime the call returns the string `"12"`, which has no `toFixed`. TypeScript does not infer `number` from the body, and it never reports anything at runtime.
```

```quiz
Q: Which callback parameter needs an annotation under `noImplicitAny`?
- [ ] `n` in `[1, 2, 3].map((n) => n * 2)`
- [ ] `e` in `window.addEventListener("click", (e) => e.clientX)`
- [x] `x` in `const square = (x) => x * x;` with no declared type for `square`
- [ ] `n` in `const f: (n: number) => void = (n) => {}`
> In the first, second and fourth cases the surrounding code provides a contextual type for the parameter. A standalone arrow function assigned to an unannotated variable has no context, so `x` would be `any`, which `noImplicitAny` reports.
```

## Quick revision {#quick-revision}

- `tsconfig.json` (JSONC) defines the project for `tsc`, editors and tools. Top level: `compilerOptions`, `files`, `include`, `exclude`, `extends`, `references`.
- Program = root files (`files` + `include` − `exclude`) + everything they import. `exclude` does not block imports. Inspect with `--listFilesOnly`, `--explainFiles`, `--showConfig`.
- `target`: output syntax level (6.0 default `es2025`; `es5` deprecated). `lib`: available built-in APIs, no polyfills. `types`: global `@types` packages, **default `[]` in 6.0**.
- `module`/`moduleResolution`: `nodenext` for Node.js, `preserve`/`bundler` for bundlers. `paths` aliases need matching runtime config; `baseUrl` deprecated.
- `rootDir` mirrors into `outDir`; 6.0 default is the config's folder (TS5011 if sources are in `src/`). `noEmit` when another tool transpiles.
- `extends`: options merge, `include`/`files`/`exclude`/`references` replace, paths relative to the defining file; arrays allowed (5.0+).
- Project references: solution config with `"files": []`, `composite`, `tsc -b`, `.tsbuildinfo`.
- `strict` (default `true` in 6.0) = `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict`, `strictBuiltinIteratorReturn`. Individual flags override it.
- Extras outside `strict`: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noUnused*`.
- `noImplicitAny`: TS7006 (params), TS7031 (destructuring), TS7019 (rest), TS7053 (string index), TS7034/TS7005 (variables), TS7016 (untyped module). Contextual typing removes most callback annotations. Fix with real types, `unknown` or generics, never `: any`.

## Key takeaways {#key-takeaways}

- `tsconfig.json` is the shared rulebook; when tools disagree, they are usually reading different configs or none.
- The program includes everything reachable through imports; `exclude` only trims `include`.
- `target`, `lib` and `types` describe the runtime; `module` and `moduleResolution` must match the loader; `paths` must be mirrored at runtime.
- TypeScript 6.0 changed important defaults (`strict`, `types`, `rootDir`, `target`) — set them explicitly.
- `strict` is a family of flags, each closing a specific hole; turn it on from day one and add `noUncheckedIndexedAccess` where you can.
- `noImplicitAny` stops `any` from entering silently, because `any` spreads through every value derived from it.
