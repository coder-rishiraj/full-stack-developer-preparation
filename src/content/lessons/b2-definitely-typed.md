---
summary: DefinitelyTyped is the community repository that publishes type declarations for JavaScript libraries as `@types/*` packages on npm. You will learn how the compiler finds those packages, how to choose the right version, how TypeScript 6 changed which ones load automatically, and how to diagnose the errors that appear when types are missing or mismatched.
difficulty: intermediate
minutes: 40
objectives:
  - Explain what DefinitelyTyped is and why `@types/*` packages exist alongside the libraries they describe
  - Trace how the compiler finds types for an import and for global names such as `process`
  - Choose the correct `@types` version for a library or runtime and place it in the right dependency section
  - Configure `types`, `typeRoots` and `skipLibCheck`, including the TypeScript 6 change to the `types` default
  - Diagnose TS7016 and version-mismatch errors and decide between `@types`, bundled types and a local declaration
---

## Introduction

Most code on npm is JavaScript. A JavaScript file says nothing about the types of its parameters or return values, so when your TypeScript file imports it, the compiler has nothing to check your calls against. Either it refuses to compile (under `strict`, which is the default in TypeScript 6) or it quietly treats the whole library as `any`, and you lose autocompletion and error checking at exactly the point where you call code you did not write.

The fix is a **declaration file**: a `.d.ts` file that describes the shapes of a JavaScript module without containing any implementation. Some libraries ship their own. Many older or community-maintained ones do not, and their authors may have no interest in maintaining TypeScript types. **DefinitelyTyped** fills that gap. It is a single, very large GitHub repository (`DefinitelyTyped/DefinitelyTyped`) in which volunteers write and maintain declaration files for thousands of JavaScript packages. Every folder in it is published automatically to npm under the `@types` scope: the declarations for `lodash` become the package `@types/lodash`, the ones for Node.js's built-in modules become `@types/node`, and so on.

You will meet `@types` packages in almost every TypeScript project. A React app has `@types/react` and `@types/react-dom`; a backend has `@types/node` and probably `@types/express`; a test setup may have `@types/jest`. Knowing how these packages are found, versioned and configured lets you fix a whole family of confusing errors in minutes rather than hours.

## Before you start

- **Declaration files** — what a `.d.ts` file is and what `declare` means. See [[b2-declaration-files]].
- **Modules in TypeScript** — `import`/`export` and how the compiler resolves a module specifier. See [[b2-ts-modules]] and [[b2-esm-vs-cjs-ts]].
- **tsconfig.json** — where compiler options live. See [[b2-tsconfig]].
- **`noImplicitAny`** — why an untyped import is an error under strict settings. See [[b2-noimplicitany]].

## The intuition

Think of a JavaScript library as a machine without a manual. You can still use it, but you have to guess which buttons accept which inputs. A declaration file is the manual. When the manufacturer writes it, it comes in the box: the library ships its own types. When the manufacturer does not, a community of users writes one and puts it in a shared library of manuals. DefinitelyTyped is that shared library, and `@types/<name>` is the shelf label.

The analogy has one important limit. A manual written by someone else can be wrong or out of date, and the machine will not complain. Declaration files are **only promises**: TypeScript trusts them completely and never checks them against the JavaScript they describe. If `@types/foo` says a function returns `string` but the real code returns `undefined`, your program type-checks and then fails at runtime. Everything in this lesson about versions and quality follows from that fact.

## What an `@types` package contains

An `@types` package contains no runnable code. A typical one has an `index.d.ts` (and sometimes more `.d.ts` files), a `package.json`, a `README.md` and a `LICENSE`. Its `package.json` may list dependencies on other `@types` packages: `@types/express` depends on `@types/node` and several others, because Express's types refer to Node's `IncomingMessage` and `ServerResponse`.

The naming rule is mechanical:

| Runtime package | Types package |
|---|---|
| `lodash` | `@types/lodash` |
| `express` | `@types/express` |
| Node.js built-ins (`fs`, `path`, `process`) | `@types/node` |
| `@babel/core` (a scoped package) | `@types/babel__core` |

The last row is the one people get wrong. npm package names can contain only one scope, so `@types/@babel/core` is impossible. DefinitelyTyped encodes the original scope by dropping the `@` and replacing the `/` with a double underscore.

You install types as a development dependency in an application:

```bash title="terminal"
npm install lodash
npm install --save-dev @types/lodash
```

The runtime package goes in `dependencies` because it runs in production. The types package goes in `devDependencies` because types are erased during compilation and are needed only by the compiler and your editor. Libraries are the exception, covered below.

## How the compiler finds types

There are two different situations, and the compiler handles them differently. Mixing them up is the source of most "but I installed the types" confusion.

### Types for something you import

When you write `import { chunk } from 'lodash'`, the compiler runs **module resolution**: it locates `node_modules/lodash` and looks for a declaration file, guided by `package.json` fields such as `types` and `exports` (the exact rules depend on the `moduleResolution` setting). If the package has no declarations, it then looks in `node_modules/@types/lodash`. If neither exists, the module resolves to a JavaScript file with no types.

Here is what that looks like. The project below has `lodash` installed but not `@types/lodash`:

```ts title="main.ts"
import { chunk } from 'lodash';

const pages = chunk([1, 2, 3, 4, 5], 2);
console.log(pages);
console.log(pages.length);
```

Running `tsc` with default TypeScript 6 settings (which include `strict`) reports:

```output
main.ts(1,23): error TS7016: Could not find a declaration file for module 'lodash'. '/app/node_modules/lodash/lodash.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/lodash` if it exists or add a new declaration (.d.ts) file containing `declare module 'lodash';`
```

**TS7016** is the error to recognise. It tells you that the module exists at runtime but has no types, and it suggests both fixes: install `@types`, or write a declaration yourself. With `noImplicitAny` turned off, the same situation compiles silently and `chunk` is `any`, which is worse, because nothing tells you the checking has stopped.

After `npm install --save-dev @types/lodash`, the file compiles, and the compiled program prints:

```output
[ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]
3
```

More importantly, misuse is now caught. In `@types/lodash`, `chunk<T>` accepts an array-like of `T` and an optional numeric size and returns `T[][]`. (The outputs here were produced with a minimal stand-in package declaring that same signature.) This file fails to compile:

```ts title="bad.ts"
import { chunk } from 'lodash';
const pages = chunk([1, 2, 3], 2);
const first: string = pages[0][0];
chunk('abc', 'two');
```

```output
bad.ts(3,7): error TS2322: Type 'number' is not assignable to type 'string'.
bad.ts(4,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Notice that `chunk('abc', ...)` is accepted for the first argument: the declaration says any array-like value works, and a string is array-like. The types describe what lodash really accepts, not what you might expect.

For imports, nothing in `tsconfig.json` needs to mention `@types/lodash`. Resolution finds it because you imported `lodash`.

### Types for globals

Some packages describe names you never import. `@types/node` declares the global `process`, `Buffer` and `__dirname`; `@types/jest` declares global `describe`, `it` and `expect`. No `import` statement mentions them, so module resolution never runs. The compiler must load these packages up front, and the `types` compiler option controls which ones it loads.

> [!IMPORTANT] TypeScript 6 changed the default
> Before TypeScript 6.0, if `types` was not set, the compiler automatically included **every** package in `node_modules/@types`. From TypeScript 6.0 the default is an empty list, so global declarations load only when you name them. A project that upgrades and suddenly reports `Cannot find name 'process'` or `Cannot find name 'describe'` has hit this change.

You can see the change directly. In a project containing a global-only `@types` package and no `types` setting, TypeScript 6.0.3 reports the global as missing:

```output
a.ts(3,13): error TS2304: Cannot find name 'FAKE_GLOBAL'.
```

The fix is to list the packages whose globals the project should see:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  }
}
```

Each entry is a package name, looked up in `@types` first (`"node"` means `@types/node`) and then as an ordinary package (`"vitest/globals"`, `"vite/client"`). Setting `"types": ["*"]` restores the old include-everything behaviour, which is convenient during an upgrade but gives up the control the new default provides. A per-file alternative is a triple-slash directive at the top of one file:

```ts title="server-setup.ts"
/// <reference types="node" />
```

The new default exists because automatic inclusion caused real bugs. Front-end code in a project that happened to have `@types/node` installed (pulled in by some build tool) could call `setTimeout` and get Node's return type, `NodeJS.Timeout`, instead of the browser's `number`, or use `process.env` in browser code that has no `process` at all. Listing globals explicitly keeps each part of the code honest about the environment it runs in. Splitting a project into separate `tsconfig` files for browser code and Node code, each with its own `types`, is the standard way to apply this (the Vite templates do exactly that; see [[b2-vite-typescript]]).

Two related options are worth knowing. `typeRoots` changes *where* global type packages are looked for (by default every `node_modules/@types` up the directory tree); you rarely need it unless you keep a folder of in-house global declarations. And `types` affects only automatic global inclusion; it never stops an explicit `import` from finding `@types`.

## Choosing the right version

DefinitelyTyped versions its packages to mirror the library they describe: **the major and minor version of an `@types` package match the major and minor version of the library**, while the patch number is DefinitelyTyped's own and increases every time someone fixes the declarations. `@types/lodash@4.17.x` describes `lodash@4.17`, and `@types/react@19.x` describes React 19.

That gives you a simple rule: pin the `@types` package to the same major (and ideally minor) as the runtime package.

```bash title="terminal"
npm install react@19 react-dom@19
npm install --save-dev @types/react@19 @types/react-dom@19
```

A mismatch produces errors that do not mention versions at all. With React 18 at runtime and `@types/react@19`, the types will describe APIs your runtime lacks, and the compiler will happily accept calls that crash. With React 19 at runtime and `@types/react@18`, new APIs appear "missing" and JSX may report strange errors about component return types. When types disagree with documentation you are reading, compare `npm ls react @types/react` before anything else.

`@types/node` follows the same idea but tracks the Node.js runtime rather than an npm package: on Node.js 22, install `@types/node@22`. Installing the latest `@types/node` on an older runtime lets you call APIs that do not exist in your production Node.js version.

There are also two kinds of duplication to watch for. If two different versions of the same `@types` package end up in `node_modules` (often because one library depends on an older `@types/react`), you can get errors such as "Type 'ReactNode' is not assignable to type 'ReactNode'", where both sides have the same name but come from different files. `npm ls @types/react` shows the duplication; deduplicating or adding an `overrides` entry in `package.json` fixes it.

## Packages that ship their own types

DefinitelyTyped is the fallback, not the first choice. Many modern libraries are written in TypeScript or ship hand-written declarations in the package itself. You can tell by looking at the package's `package.json` for a `types` field (or its older synonym `typings`), or a `"types"` condition inside `exports`. On the npm website, a "TS" badge next to the package name means bundled types and a "DT" badge means types are available from DefinitelyTyped.

Bundled types are generally better, because they are released together with the code, so they cannot drift to a different version. When a library starts shipping its own types, DefinitelyTyped removes its folder and publishes a final **stub** version of the `@types` package that is marked deprecated on npm. `@types/axios` is an example: it contains no real declarations, because `axios` provides its own. If you see such a deprecation warning, uninstall the `@types` package; it is doing nothing at best.

The order to check, every time you add a dependency, is therefore:

1. Does the package ship its own types? If so, install nothing else.
2. Is there an `@types/<name>` package whose major version matches? Install it as a dev dependency.
3. Neither? Write a local declaration, as described in [[b2-third-party-types]].

## How it works internally

Several mechanisms inside `@types` packages explain behaviour you will see in your own code.

**`export =` for CommonJS modules.** Many older libraries replace `module.exports` with a single function or object. Their declarations describe that with `export =`:

```ts title="node_modules/@types/cjs-lib/index.d.ts"
declare function slugify(input: string): string;
export = slugify;
```

In modern TypeScript you import such a module with a default import (`import slugify from 'cjs-lib'`), which works because of `esModuleInterop`. TypeScript 6 treats `esModuleInterop` as always on; setting it to `false` is now a deprecation error. The details of the CommonJS and ES module interop are covered in [[b2-esm-vs-cjs-ts]].

**`typesVersions` for different compiler versions.** A declaration package can contain several sets of declarations and use the `typesVersions` field in `package.json` to tell the compiler which set to use for which TypeScript version. DefinitelyTyped uses this so that newer TypeScript features can appear in declarations without breaking users on older compilers. DefinitelyTyped only supports TypeScript versions released within roughly the last two years, so a very old compiler may fail on the latest `@types` packages; pinning an older `@types` patch is the workaround.

**`skipLibCheck`.** By default the compiler type-checks every `.d.ts` file it loads, including thousands of lines inside `node_modules`. `"skipLibCheck": true` skips checking declaration files (it still *uses* them). Almost every real project enables it, because it makes builds noticeably faster and avoids errors inside `@types` packages you cannot fix. The cost is that genuine conflicts between declaration files, such as two packages declaring the same global differently, go unreported.

**Editors fetch types for JavaScript.** In a plain JavaScript project, VS Code's TypeScript service uses **Automatic Type Acquisition**: it downloads matching `@types` packages into a cache so that autocompletion works even though you never installed them. This is why `require('express')` in a `.js` file may show rich completions on your machine yet have no types in a TypeScript build. Type acquisition is an editor feature, not a compiler one.

## Libraries that depend on `@types`

The `devDependencies` rule applies to applications. If you publish a library whose own `.d.ts` files mention types from an `@types` package, for example a function that accepts an Express `Request`, then your users' compilers need `@types/express` too. In that case `@types/express` belongs in your library's `dependencies` (or `peerDependencies`, when the user is expected to install Express themselves), otherwise their builds fail with "Cannot find module 'express'" errors that point inside your package.

## Contributing to DefinitelyTyped

Because `@types` packages are community-maintained, you will sometimes find a missing overload or a wrong return type. The fix is a pull request to the DefinitelyTyped repository. Each package lives in `types/<name>/` with an `index.d.ts`, a test file named `<name>-tests.ts` that exercises the declarations (it is type-checked, never run), and metadata listing its owners. The repository's tooling lints the declarations and checks the tests; once merged, a new patch version is published to npm automatically. While you wait, a local module augmentation (see [[b2-module-augmentation]]) can patch the gap in your own project.

## Worked example: setting up a Node.js service

Suppose you are starting an HTTP service on Node.js 22 with Express 5 and Vitest. Step by step:

```bash title="terminal"
npm install express@5
npm install --save-dev typescript @types/node@22 @types/express@5 vitest
```

`express` is runtime code, so it is a normal dependency. `@types/node@22` matches the Node.js runtime and `@types/express@5` matches Express 5. Vitest ships its own types, so it needs no `@types` package.

```json title="tsconfig.json"
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "es2023",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node", "vitest/globals"],
    "outDir": "dist"
  },
  "include": ["src"]
}
```

`types` lists the two sources of globals: Node.js (`process`, `Buffer`) and Vitest's global `describe`/`it`/`expect`. `@types/express` is not listed because the code reaches it through `import express from 'express'`; listing it would be harmless but unnecessary. `skipLibCheck` keeps the build fast.

If you later add another library and see TS7016, you check its `package.json` first. If it does ship types, the error means something else is wrong, such as a stale `node_modules` or a `moduleResolution` setting that ignores the package's `exports` field. Only if it ships none do you look for an `@types` package.

## In real systems

In production codebases `@types` handling is mostly about stability. Teams pin `@types/react` and `@types/node` alongside their runtime versions, and tools such as Renovate or Dependabot are configured to upgrade a library and its `@types` package together in one pull request so they never drift apart. Monorepos often use a single version of each `@types` package across all workspaces, enforced with package-manager overrides, to avoid the duplicate-type errors described above.

Continuous integration runs `tsc --noEmit` on every change; that is where a broken `@types` release shows up. When a new `@types` patch introduces a regression, the usual response is to pin the previous patch version and report the problem upstream, rather than scattering `any` through the code.

## Trade-offs and alternatives

| Source of types | Strengths | Weaknesses |
|---|---|---|
| Bundled in the package | Released with the code, versions always match | Quality depends on the library author |
| `@types` from DefinitelyTyped | Exists for thousands of packages, reviewed, versioned to match | Can lag behind or be wrong; separate version to keep in sync |
| Local `declare module` | Works for anything, including private code | You write and maintain it; easy to leave as `any` |

Use bundled types when they exist, `@types` when they do not, and local declarations only as the last resort or as a temporary patch.

## Common mistakes

- **Installing `@types` as a normal dependency in an app.** It works, but it ships irrelevant packages into production installs. Use `--save-dev`. (Libraries that expose those types are the exception.)
- **Mismatched majors.** `@types/react@19` with `react@18` lets you call APIs that crash. Check `npm ls <pkg> @types/<pkg>` whenever types and runtime disagree.
- **Installing `@types` for a package that ships types.** The deprecated stub does nothing, and an old non-stub version can conflict with the bundled declarations. Uninstall it.
- **Expecting `types` to block imports.** `"types": []` only stops automatic global loading; `import x from 'lib'` still finds `@types/lib`.
- **"Cannot find name 'process'" after upgrading to TypeScript 6.** Add `"node"` (and any test-runner globals) to `types`.
- **Trusting declarations blindly.** They are never checked against the JavaScript. If runtime behaviour contradicts the types, the types are what is wrong; validate external data at runtime as described in [[b2-third-party-types]].

> [!MISTAKE] Writing `@types/@babel/core`
> Scoped packages map to `@types/<scope>__<name>`, so the package you want is `@types/babel__core`.

## Interview perspective

Interviewers use `@types` questions to see whether you understand that TypeScript types are a compile-time layer on top of JavaScript packages.

> [!INTERVIEW] What a strong answer sounds like
> "If a package doesn't ship its own declarations, I install the matching `@types` package as a dev dependency, pinned to the same major version as the library. For imports, module resolution finds it automatically; for globals like Node's `process` I list it in `types`, which TypeScript 6 now requires because the default is empty. And I remember the declarations are just promises, so I validate untrusted data at runtime."

Questions to be ready for:

- **What is DefinitelyTyped?** A community repository of declaration files for JavaScript packages, published to npm as `@types/*`.
- **Why `devDependencies`?** Types are erased at compile time; nothing in them runs. Libraries that re-export those types are the exception.
- **How do you pick a version?** Match the library's major and minor version; `@types` patch versions are independent.
- **What does `skipLibCheck` trade away?** Speed and fewer unfixable errors, in exchange for not detecting conflicts between declaration files.
- **Follow-up: "The types say a function returns a string but it returns undefined. Who is wrong?"** The declaration. TypeScript cannot detect this; fix it locally, then upstream.

```quiz
Q: A TypeScript 6 project has `@types/node` installed but no `types` option. A file uses `process.env.PORT` without importing anything. What happens?
- [ ] It compiles, because every `@types` package is included automatically
- [x] It fails with "Cannot find name 'process'", because TypeScript 6 loads no global type packages unless `types` lists them
- [ ] It fails with TS7016, because `process` has no declaration file
- [ ] It compiles, but `process` has type `any`
> From TypeScript 6.0 the `types` default is an empty list, so global declarations such as Node's `process` load only when `types` includes `"node"` (or a file has `/// <reference types="node" />`). TS7016 is the error for an untyped *import*, which is a different mechanism. Automatic inclusion of every `@types` package was the behaviour before 6.0.

Q: Your app uses `lodash@4.17.21`. Which `@types/lodash` version is the right one?
- [ ] Always the newest version on npm
- [x] A `4.17.x` version; the patch number is DefinitelyTyped's own
- [ ] Exactly `4.17.21`
- [ ] Any version, because types are erased at runtime
> `@types` packages match the library's major and minor version and use the patch number for their own fixes, so `@types/lodash@4.17.x` describes lodash 4.17. There is no requirement for the patch to equal the library's. Types being erased does not make the version irrelevant: the wrong version describes APIs that may not exist at runtime.

Q: Which file is the correct DefinitelyTyped package for `@babel/core`?
- [ ] `@types/@babel/core`
- [ ] `@types/babel-core`
- [x] `@types/babel__core`
- [ ] `@babel/types`
> npm names can have only one scope, so DefinitelyTyped encodes `@scope/name` as `scope__name`. `@babel/types` is an unrelated runtime package for Babel AST node types.
```

## Practice

1. Create a project with `express` but no types and run `tsc`. Read the TS7016 message, then install the correct `@types/express` and check that a call such as `res.status('404')` inside a route handler is now rejected, because the declaration says the status code is a number.
2. In a TypeScript 6 project, use `process.argv` in a file. Make it compile three ways: via `types`, via a triple-slash directive, and via `"types": ["*"]`. Explain which you would use in a project with both browser and Node code.
3. Find a package in one of your projects that has both bundled types and an `@types` package installed. Remove the redundant one and confirm nothing changes.
4. Run `npm ls @types/react` in a React project and explain every entry it shows.

## Quick revision {#quick-revision}

- DefinitelyTyped: community repository of `.d.ts` files, published to npm as `@types/<name>`; scoped `@a/b` becomes `@types/a__b`.
- Order of preference: bundled types (`types`/`exports` in `package.json`) → matching `@types` → local `declare module`.
- Apps: `@types/*` in `devDependencies`. Libraries whose public types use them: `dependencies` or `peerDependencies`.
- Versions: `@types` major.minor = library major.minor; patch is independent. `@types/node` tracks the Node.js runtime major.
- Imports find `@types/<pkg>` through module resolution automatically; `types` does not affect them.
- Globals (`process`, `describe`) need the package listed in `types`; TypeScript 6 default is `[]` (before 6.0: all of `@types`). `["*"]` restores the old behaviour.
- TS7016 = imported module has no declarations. Fix: install `@types` or declare the module.
- `skipLibCheck: true` skips checking `.d.ts` files: faster, but hides conflicts between them.
- `export =` describes CommonJS single exports; import with a default import (`esModuleInterop` is always on in TypeScript 6).
- Deprecated `@types` stub = library now ships its own types; uninstall it.

## Key takeaways {#key-takeaways}

- `@types` packages exist because most npm code is JavaScript; they are community-written manuals for libraries that ship none.
- The compiler finds `@types` for imports automatically, but loads global declarations only when `types` lists them, which is the TypeScript 6 default behaviour.
- Keep each `@types` package on the same major version as the library or runtime it describes, or the types will describe APIs you do not have.
- Prefer types bundled with the library; remove `@types` stubs once a package ships its own.
- Declaration files are trusted, never verified, so types and runtime can disagree; when they do, the declaration is the bug.
