---
summary: ECMAScript is the standard that defines the JavaScript language, and "JavaScript" is the everyday name for engines that implement it plus whatever their host adds. You will learn who writes the standard, how new features move from idea to specification, what the edition names like ES6 and ES2020 mean, and how to ship modern syntax to environments that do not support it yet.
difficulty: beginner
minutes: 35
objectives:
  - Explain the relationship between ECMAScript, ECMA-262, TC39 and the JavaScript engines that implement them
  - Decode edition names (ES5, ES6, ES2015, ES2020) and place major features in the edition that introduced them
  - Describe the TC39 stage process and what "stage 3" or "stage 4" means for using a feature in production
  - Choose between transpiling and polyfilling for a missing feature, and detect support correctly
  - Separate what ECMA-262 specifies from what host standards such as HTML, DOM and Fetch specify
---

## Introduction

Chrome, Firefox, Safari and Node.js are built by different organisations, with different engines written by different teams. Yet a function using `async`/`await`, destructuring and `Map` behaves identically in all of them. That only works because every engine implements the same written **specification**. For JavaScript, that specification is called **ECMAScript**.

The distinction is simple to state and easy to blur:

- **ECMAScript** is the *standard* — a long document, officially numbered **ECMA-262**, that defines the language's syntax, types, operators, built-in objects and exactly how each piece of code must behave.
- **JavaScript** is the everyday name for the *language as implemented*: an engine that follows ECMA-262, embedded in a host that adds its own APIs.

You need this distinction for three practical reasons. First, every compatibility question — "can I use optional chaining?", "does Node 18 have `Array.prototype.findLast`?" — is a question about which ECMAScript features a particular engine version implements. Second, build tools are configured in ECMAScript terms: TypeScript's `target: "ES2022"`, Babel presets, esbuild's `--target=es2020`. Third, knowing which standard defines a feature tells you where to look it up and whether it exists outside the browser: `Promise` is ECMAScript, `fetch` is not.

## Before you start

- [[b1-what-is-javascript]] — you should know that JavaScript runs inside a host and that host APIs such as the DOM are separate from the language.
- Basic comfort reading short JavaScript snippets; every example here runs in Node.js 22.

## The intuition

Think of ECMAScript as a **building code** and engines as **construction companies**. The code says a staircase must have handrails, steps of a certain height and a certain load rating. Different companies use different materials and techniques, but any building that meets the code is safe to walk through in the same way. Nobody visiting a building reads the code; they just expect the stairs to work.

Hosts add rooms the building code does not mention — a browser adds the DOM and `fetch`, Node.js adds the file system. Those rooms follow *other* codes (the HTML standard, the Fetch standard, Node.js documentation).

The analogy stops in one place: building codes change slowly, while ECMAScript publishes a new edition every year, and engines adopt the new rules at their own pace. So at any moment, two "compliant" engines may support different subsets of the newest edition.

## Who writes the standard

**Ecma International** is a standards organisation based in Geneva (the name was originally an acronym for European Computer Manufacturers Association). Its technical committee **TC39** maintains ECMA-262. TC39's members are companies — browser vendors such as Google, Mozilla, Apple and Microsoft, plus others like Bloomberg, Igalia and Salesforce — along with invited experts. They meet roughly every two months and decide by consensus.

The committee maintains several related documents:

| Document | What it defines |
|---|---|
| **ECMA-262** | The core language: syntax, types, operators, functions, objects, `Array`, `Promise`, `Map`, modules |
| **ECMA-402** | The Internationalization API: `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.Collator` |
| **Test262** | Tens of thousands of conformance tests that engines run to check they follow ECMA-262 |

Test262 matters more than it sounds. It is how "the spec says X" becomes "every engine actually does X": a behaviour that has tests in Test262 is a behaviour engines are measured against.

The specification is published as a living draft on GitHub (`tc39.es/ecma262`) and as a yearly snapshot. It is written in precise, algorithmic language — "Let *x* be ? ToNumber(*value*)" — because it must remove every ambiguity between implementations. You will rarely read it front to back, but looking up one operation (for example, how `==` compares values) is a valuable skill once you are past the basics.

## Edition names: ES5, ES6, ES2015

Editions were originally numbered. After a long gap, the committee switched to naming them by year. This is why the same edition has two names.

| Edition | Year | Headline features |
|---|---|---|
| ES1 | 1997 | First standard, based on Netscape's JavaScript |
| ES3 | 1999 | Regular expressions, `try`/`catch`; the baseline for a decade |
| ES4 | — | Abandoned in 2008 after disagreement over its size |
| ES5 | 2009 | Strict mode, `JSON`, `Array.prototype.map`/`filter`/`forEach`, getters/setters, `Object.create`/`defineProperty` |
| **ES6 = ES2015** | 2015 | `let`/`const`, arrow functions, classes, modules, promises, template literals, destructuring, default and rest parameters, spread, `Map`/`Set`, symbols, iterators, generators, `Proxy` |
| ES2016 | 2016 | `Array.prototype.includes`, `**` |
| ES2017 | 2017 | `async`/`await`, `Object.values`/`entries`, `padStart`/`padEnd` |
| ES2018 | 2018 | Object rest/spread, `for await...of`, `Promise.prototype.finally`, regex named groups |
| ES2019 | 2019 | `flat`/`flatMap`, `Object.fromEntries`, optional `catch` binding |
| ES2020 | 2020 | Optional chaining `?.`, nullish coalescing `??`, `BigInt`, `globalThis`, `Promise.allSettled`, dynamic `import()` |
| ES2021 | 2021 | `??=`, `||=`, `&&=`, numeric separators `1_000`, `Promise.any`, `replaceAll` |
| ES2022 | 2022 | Class fields and `#private` members, top-level `await`, `.at()`, `Object.hasOwn`, `Error` `cause` |
| ES2023 | 2023 | `findLast`, `toSorted`/`toReversed`/`toSpliced`/`with`, hashbang (`#!`) lines |
| ES2024 | 2024 | `Object.groupBy`, `Promise.withResolvers`, regex `v` flag, resizable `ArrayBuffer` |
| ES2025 | 2025 | Iterator helpers, new `Set` methods (`union`, `intersection`), `Promise.try`, JSON modules and import attributes, `RegExp.escape` |

ES2015 was the biggest single change in the language's history, which is why "ES6" became shorthand for "modern JavaScript". Since then each edition is small: every proposal that has reached the final stage by the committee's cut-off in early spring is included, and the General Assembly of Ecma approves the edition around June.

> [!NOTE] "ES6" is not a switch
> Engines do not flip from "ES5" to "ES6" in one release. Each feature ships separately. Saying "the browser supports ES6" is too vague to act on; ask whether it supports the specific feature, such as modules or optional chaining.

## How a feature gets into the language

New features start as **proposals**, usually in a public GitHub repository, and move through numbered **stages**. Each stage is a promise about how stable the design is.

| Stage | Meaning | Safe to use in production? |
|---|---|---|
| 0 | An idea, not yet considered by the committee | No |
| 1 | The committee agrees the problem is worth solving; the design is exploratory | No |
| 2 | A preferred solution is chosen; draft spec text exists | No — expect changes |
| 2.7 | Design and spec text are complete; waiting for tests and implementation feedback (stage added in 2024) | Not yet |
| 3 | Recommended for implementation; changes now only for problems found by implementers | Often, behind a transpiler or once engines ship it |
| 4 | Finished: Test262 tests exist, at least two compatible engines ship it, and it joins the next edition | Yes, where your target engines support it |

The rule that a feature needs **two shipping implementations** before stage 4 is important. It means the spec describes behaviour that has already survived contact with real engines and real websites. Engines often ship stage 3 features — sometimes behind flags first — which is how implementation experience is gathered.

A feature's history illustrates the process. Optional chaining (`a?.b`) was proposed in 2017, reached stage 3 in 2019, shipped in Chrome 80 and Firefox 74 in early 2020, and became part of ES2020. Teams using TypeScript or Babel could write it in 2019 because those tools compiled it into older syntax.

## What ECMA-262 does not define

The language standard is deliberately host-neutral. Everything a browser or server adds is specified elsewhere:

| Feature | Standard |
|---|---|
| `window`, `<script>`, the event loop, `setTimeout`, `localStorage` | WHATWG HTML Living Standard |
| `document`, elements, events, `querySelector` | WHATWG DOM Standard |
| `fetch`, `Request`, `Response` | WHATWG Fetch Standard |
| `URL`, `URLSearchParams` | WHATWG URL Standard |
| `console.log` | WHATWG Console Standard |
| `fs`, `process`, `Buffer` | Node.js documentation (no external standard) |
| Common APIs for server runtimes | WinterTC (Ecma TC55, formerly the WinterCG community group) |

ECMA-262 does define *hooks* hosts must fill in. It says promise callbacks run as **jobs** in a queue, but leaves it to the host to decide when that queue is drained — which is why the event loop is described in the HTML standard and in Node.js, not in ECMA-262. Likewise ECMA-262 defines module syntax and linking, while the host decides how a specifier like `'./math.js'` is turned into a file or URL. [[b1-runtime-web-apis]] explores this boundary.

### Annex B: the web's legacy

ECMA-262 has a section called **Annex B** listing features that exist only because old websites depend on them: `escape()`/`unescape()`, `String.prototype.substr`, the `__proto__` property, HTML-style `<!--` comments inside scripts, and some odd rules for function declarations inside blocks in sloppy mode. Browsers must implement them; non-browser engines may. Treat Annex B as "documented so engines agree, not recommended for new code".

## How it works in practice: targets, transpilers and polyfills

Your code runs on whatever engines your users have. A user on a three-year-old phone browser may lack features your laptop has. Two techniques bridge the gap, and they fix different problems.

A **transpiler** (Babel, the TypeScript compiler, esbuild, SWC) rewrites **syntax** the target cannot parse into older syntax it can. Syntax must be handled this way: an engine that does not understand `?.` cannot even parse the file, so no runtime check can help.

```javascript title="transpiled.js"
const order = { customer: { address: null } };

// ES2020: optional chaining and nullish coalescing
const city = order.customer?.address?.city ?? 'unknown';
console.log(city);

// What a transpiler targeting ES2015 emits instead (simplified)
var _a, _b;
const city2 =
  (_b = (_a = order.customer) === null || _a === void 0 ? void 0 : _a.address) === null ||
  _b === void 0 ? void 0 : _b.city;
console.log(city2 !== null && city2 !== void 0 ? city2 : 'unknown');
```

```output
unknown
unknown
```

Both versions behave identically. The transpiled form stores each intermediate value in a temporary variable so it is evaluated once, then checks for both `null` and `undefined` (`void 0` is a reliable way to write `undefined`). It is longer and harder to read, which is the cost of transpiling: bigger bundles and code in DevTools that differs from what you wrote, mitigated by [[b1-source-maps]].

A **polyfill** adds a missing **built-in** — a function or object — by defining it in JavaScript if it is absent. `Array.prototype.at`, `Object.groupBy` or `structuredClone` can be polyfilled; libraries such as core-js collect polyfills. Polyfills cannot add syntax, and some built-ins cannot be polyfilled faithfully (`Proxy`, for example, needs engine support).

### Detecting support

Because features ship one at a time, check the specific feature, not the "version".

```javascript title="detect.js"
// Built-in check: does this engine have ES2024's Object.groupBy?
const hasGroupBy = typeof Object.groupBy === 'function';
console.log('Object.groupBy:', hasGroupBy);

// Syntax check: syntax cannot be tested with typeof, so try to parse it
function supportsSyntax(source) {
  try {
    new Function(source);
    return true;
  } catch {
    return false;
  }
}
console.log('optional chaining:', supportsSyntax('a?.b'));
console.log('made-up syntax:', supportsSyntax('a ?.. b'));

if (hasGroupBy) {
  const people = [
    { name: 'Ada', team: 'core' },
    { name: 'Lin', team: 'web' },
    { name: 'Sam', team: 'core' },
  ];
  const byTeam = Object.groupBy(people, (p) => p.team);
  console.log(Object.keys(byTeam), byTeam.core.length);
}
```

```output
Object.groupBy: true
optional chaining: true
made-up syntax: false
[ 'core', 'web' ] 2
```

The built-in check is a plain `typeof`. The syntax check uses `new Function(source)`, which asks the engine to parse a string as a function body; a `SyntaxError` means the syntax is unsupported. (Strict Content Security Policies block `new Function`, so in real sites syntax support is usually decided at build time rather than at run time.) Notice also `catch {` with no `(error)`: optional catch binding is itself an ES2019 feature.

In Node.js 22, `Object.groupBy` (ES2024) exists but `Promise.try` and `RegExp.escape` (ES2025) do not; they arrived in later Node.js releases. That is the "no single switch" point in action. In practice, teams declare their supported browsers in a **browserslist** configuration (for example `"> 0.5%, last 2 versions, not dead"`), and tools derive which syntax to transpile and which polyfills to include. Compatibility tables on MDN, caniuse.com and node.green answer "which version shipped this?".

## Worked example: reasoning about a compatibility bug

A team ships this utility, written in TypeScript with `"target": "ES2022"`:

```javascript title="last-error.js"
function lastError(logs) {
  return logs.findLast((entry) => entry.level === 'error')?.message ?? 'none';
}
console.log(lastError([{ level: 'error', message: 'disk full' }, { level: 'info' }]));
console.log(lastError([]));
```

```output
disk full
none
```

It works in development. In production, error monitoring shows `TypeError: logs.findLast is not a function` from a slice of users on older browsers. Work through it with ECMAScript editions in mind:

1. `?.` and `??` are ES2020 **syntax**. With an ES2022 target, TypeScript leaves them as written. Older browsers that lacked them would report a `SyntaxError` when *parsing* the file, and nothing in it would run. That is not the error seen.
2. `findLast` is an ES2023 **built-in**. TypeScript never polyfills built-ins; with `"lib"` settings that include ES2023 it type-checks the call, and the method is simply missing at run time on browsers older than about 2022. The error appears only when the line runs, as a `TypeError`.
3. The fix is either a polyfill for `Array.prototype.findLast` or replacing it with code available in the target (`[...logs].reverse().find(...)`), and aligning `target`/`lib` with the browsers you actually support.

The lesson generalises: **syntax problems fail at parse time for the whole file; missing built-ins fail at the line that uses them.** Knowing which one you are looking at tells you whether you need a transpiler setting or a polyfill.

## In real systems

**Build configuration.** Every frontend project encodes ECMAScript decisions: `tsconfig.json`'s `target` and `lib`, Vite's `build.target`, Babel's `@babel/preset-env` driven by browserslist. Library authors publish modern syntax and let applications decide how far to transpile.

**Node.js versions.** Each Node.js major version bundles a specific V8 version, which fixes the set of ECMAScript features available. Server teams pin a Node.js version (`"engines": { "node": ">=20" }` in `package.json`) and can use every feature that version supports without transpiling.

**Linting.** ESLint's `ecmaVersion` setting decides which syntax the parser accepts, and plugins can flag built-ins that are newer than your target.

**Reading proposals.** Teams track stage 3 proposals to plan ahead — decorators, for instance, reached stage 3 in 2022, and TypeScript 5.0 implemented the standard version alongside its older experimental one.

## Trade-offs and alternatives

| Approach | Benefit | Cost |
|---|---|---|
| Write the newest syntax, transpile to an old target | Modern code, wide reach | Larger output, harder-to-read production code |
| Target only modern engines (e.g. ES2020+) | Smaller, faster bundles; readable output | Excludes users on old browsers |
| Polyfill missing built-ins globally | Code can use new methods freely | Extra bytes for everyone; global mutation can clash with other scripts |
| Avoid new features entirely | No tooling needed | Gives up readability and safety improvements |

Most teams in 2026 target browsers released in roughly the last few years, which already support everything through ES2020 or ES2022, and transpile only the newest syntax. The right target is a product decision informed by analytics about real users, not a technical default.

## Common mistakes

> [!MISTAKE] Expecting TypeScript to add missing methods
> TypeScript's `target` downlevels *syntax* only. Setting `"target": "ES5"` does not make `Array.prototype.includes` exist on an old engine; you need a polyfill. Setting `lib` too new hides the problem by telling the type checker the method exists.

**Calling stage 2 features "new JavaScript".** Blog posts sometimes present proposals as if they were part of the language. Until stage 4 (or at least stage 3 with engine support), the syntax may change or be dropped — the original decorators proposal changed substantially between its early drafts and the stage 3 version.

**Treating `fetch` or `setTimeout` as ES2015 features.** They are not in ECMA-262 at all. `fetch` appeared in Node.js only in version 18, years after Node supported every ES2015 feature.

**Assuming one engine version means one edition.** An engine can support part of ES2024 and part of ES2025 simultaneously. Check per feature.

**Using Annex B features in new code.** `substr`, `escape` and `__proto__` work in browsers but are legacy. Use `slice`/`substring`, `encodeURIComponent` and `Object.getPrototypeOf`/`Object.setPrototypeOf`.

## Interview perspective

> [!INTERVIEW] Distinguishing the names cleanly
> "ECMAScript is the standard, ECMA-262, maintained by TC39 at Ecma International. JavaScript is the language as engines like V8 implement it, plus host APIs that are standardised separately — the DOM and `fetch` by WHATWG, `fs` by Node.js. ES6 and ES2015 are the same edition; since then there is one edition per year."

Likely questions:

- **What is the difference between JavaScript and ECMAScript?** Standard versus implementation; host APIs are outside ECMAScript.
- **What does stage 3 mean?** The design is complete and recommended for implementation; only implementer-found issues change it. Stage 4 needs Test262 tests and two shipping engines.
- **Transpiler versus polyfill?** Transpilers rewrite syntax at build time; polyfills define missing built-ins at run time. Syntax cannot be polyfilled.
- **Name features from ES2020.** Optional chaining, nullish coalescing, `BigInt`, `globalThis`, `Promise.allSettled`, dynamic `import()`.
- **Why does Annex B exist?** To specify legacy behaviour browsers must keep so old pages work, so engines implement it consistently.

## Practice

1. Pick three features you use often (for example template literals, `Array.prototype.includes`, `async`/`await`). Find the edition that introduced each and the first Chrome and Node.js versions that shipped it.
2. Write a polyfill for `Array.prototype.at` that only installs itself when the method is missing. Handle negative indices. Why should it be defined with `Object.defineProperty` and `enumerable: false`?
3. Paste `const x = a?.b ?? c;` into the TypeScript playground or Babel REPL with an ES2015 target and explain each part of the output.
4. Open the TC39 proposals repository and choose one stage 3 proposal. Summarise the problem it solves and whether any engine ships it today.

```quiz
Q: A user's browser reports `SyntaxError` when loading your bundle, and nothing in the file runs. Which tool most likely needs reconfiguring?
- [ ] A polyfill library such as core-js
- [x] The transpiler's target, because the bundle contains syntax the engine cannot parse
- [ ] The HTML standard
- [ ] `console.log`
> A SyntaxError is raised while parsing, before any code runs, so a polyfill — which is code that would have to run — cannot help. The transpiler must rewrite the unsupported syntax into older syntax. Missing built-ins, by contrast, fail later as TypeErrors at the line that uses them.

Q: What is required for a TC39 proposal to reach stage 4?
- [ ] A vote by the WHATWG
- [ ] Support in at least one browser behind a flag
- [x] Test262 tests and at least two compatible shipping implementations
- [ ] Approval by Oracle, which owns the JavaScript trademark
> Stage 4 means the feature is finished and will be included in the next yearly edition. TC39 requires conformance tests and real-world implementation experience from at least two engines. WHATWG maintains HTML and DOM, not ECMAScript, and the trademark owner has no role in the standard.

Q: Which of these is specified in ECMA-262?
- [ ] `fetch`
- [ ] `document.createElement`
- [x] `Promise.allSettled`
- [ ] `localStorage`
> `Promise.allSettled` was added to the language in ES2020. `fetch` is in the WHATWG Fetch Standard, `document.createElement` in the DOM Standard, and `localStorage` in the HTML Standard — all host APIs.
```

## Quick revision {#quick-revision}

- ECMAScript = the standard (ECMA-262), maintained by TC39 at Ecma International. JavaScript = the language as implemented by engines in hosts.
- ECMA-402 defines `Intl`; Test262 is the conformance test suite.
- ES6 = ES2015 (largest update: `let`/`const`, classes, modules, promises, arrows). Yearly editions since; ES4 was abandoned.
- ES2017 `async`/`await`; ES2020 `?.`, `??`, `BigInt`, `globalThis`; ES2022 class fields, top-level `await`; ES2023 `toSorted`, `findLast`.
- Stages 0 → 1 → 2 → 2.7 → 3 → 4; stage 4 needs Test262 tests and two shipping engines.
- Host APIs live in other standards: HTML (event loop, timers, `<script>`), DOM, Fetch, URL, Console; Node.js documents its own APIs.
- Annex B: legacy web features browsers must keep (`substr`, `__proto__`, HTML comments).
- Transpilers rewrite syntax at build time; polyfills add built-ins at run time. Syntax errors break the whole file; missing built-ins fail at the call.
- Detect features individually; never assume "supports ES6" as a single flag.

## Key takeaways {#key-takeaways}

- ECMAScript is the contract every engine follows; that shared contract is why the same code behaves identically in different browsers and in Node.js.
- Edition names are years since 2015, and engines adopt each feature separately, so compatibility is always a per-feature question.
- The TC39 stage process tells you how stable a proposal is; stage 4 means tested and shipped in at least two engines.
- Missing syntax needs a transpiler, missing built-ins need a polyfill, and knowing which is which turns a confusing production error into a quick fix.
- Anything that touches the page, network or operating system is defined by host standards, not by ECMAScript.
