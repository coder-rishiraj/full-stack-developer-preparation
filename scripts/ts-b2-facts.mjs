/** TypeScript B2 topic facts for generators. */
function e(what, why, model, how, code, caption, pitfall, internals) {
  return { what, why, model, how, code, caption, pitfall, internals }
}

export const FACTS = {
  'b2-what-is-typescript': e(
    'TypeScript is a typed superset of JavaScript that compiles to plain JS. You write .ts or .tsx files with optional type annotations; the TypeScript compiler (tsc) or a bundler plugin strips types and emits JS your runtime already understands. Types exist only at compile time — they do not change runtime behavior unless you use features that emit code (enums, decorators, legacy settings).',
    'Large JS codebases needed a way to document contracts, catch typos before runtime, and refactor safely. Microsoft built TS as an incremental layer so teams could adopt typing without abandoning the JS ecosystem.',
    'TypeScript is a spell-checker for your JavaScript manuscript. The published book (compiled JS) reads the same; the checker catches mistakes before readers (users) see them.',
    [
      'Install TypeScript: npm i -D typescript.',
      'Add tsconfig.json with "strict": true for best safety.',
      'Write .ts files; run tsc or let Vite/esbuild transpile on the fly.',
      'Types annotate variables, parameters, and return values — erased at emit.',
      'Start with allowJs/checkJs for gradual migration from existing JS.',
    ],
    `function greet(name: string): string {
  return \`Hello, \${name}\`;
}
const msg = greet('TypeScript');
console.log(msg);
// tsc removes : string and : string before emit
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'A typed function compiles to identical JS',
    'Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library.',
    [
      'TS extends JS grammar; invalid JS is invalid TS (with narrow exceptions).',
      'Structural typing: compatibility is shape-based, not nominal.',
      'The compiler performs type erasure — no typeof checks are injected by default.',
    ],
  ),

  'b2-ts-vs-javascript': e(
    'JavaScript is the runtime language defined by ECMAScript. TypeScript is JavaScript plus a static type system checked before execution. Every valid JS program is valid TS (modulo strict mode differences); TS adds syntax for types, interfaces, enums, and compile-time-only constructs. Browsers and Node never execute TypeScript directly.',
    'Teams wanted stronger tooling — autocomplete, rename, dead-code detection — without inventing a new language. TS piggybacks on JS so libraries and hiring stay portable.',
    'JavaScript is the road; TypeScript is the lane markings and signs drawn on the map before you drive. The car still runs on asphalt (JS).',
    [
      'JS runs everywhere TS targets; TS is a dev-time layer.',
      'TS can compile to ES5, ES2020, etc. — same output choices as Babel.',
      'Use .js for untyped files; .ts/.tsx when you want the checker.',
      'Runtime errors TS prevents: calling undefined as function, wrong property names.',
      'Runtime errors TS cannot prevent: network failures, bad user input without validation.',
    ],
    `// JavaScript — no compile-time name check
function jsUser(u) { return u.nmae; }
// TypeScript — typo caught at compile time
interface User { name: string }
function tsUser(u: User) { return u.name; }
console.log("const __item: User = {} as User");
console.log(tsUser('demo'));
// TypeScript validates this file before emit`,
    'Same runtime target; TS catches u.nmae before ship',
    'Interview trap: "TS is slower at runtime." Compiled output is JS — performance is identical if emit settings match.',
    [
      'TS uses ECMAScript module syntax; module resolution is TS-specific.',
      'JS dynamic features (eval, with) weaken TS guarantees.',
      'Downlevel emit may transform async/await, classes, and decorators.',
    ],
  ),

  'b2-why-typescript': e(
    'Teams adopt TypeScript for safer refactors, self-documenting APIs, IDE intelligence (jump-to-definition, inline errors), and catching entire bug classes before CI. It scales collaboration: function signatures become contracts reviewers and tools enforce. It also unlocks advanced patterns — discriminated unions, mapped types, conditional types — that are awkward in plain JS.',
    'As apps grew to hundreds of modules, "run it and see what breaks" stopped scaling. Types pay rent upfront and save debugging time in production.',
    'Types are guardrails on a mountain road. You still drive (write logic), but you are less likely to slide off a cliff (ship undefined access).',
    [
      'Enable strict mode; fix errors incrementally.',
      'Let inference reduce annotation noise.',
      'Use types at module boundaries: props, API responses, DB rows.',
      'Pair with ESLint (@typescript-eslint) for lint + type-aware rules.',
      'Measure adoption: fewer prod TypeErrors, faster onboardings.',
    ],
    `type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
async function fetchUser(id: string): Promise<ApiResponse<{ name: string }>> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) return { data: null, error: res.statusText };
  return { data: await res.json(), error: null };
}
console.log("}");
// type ApiResponse<T> = { data: T; error: null } | { data: null; error: string }; narrows allowed values`,
    'Union return type documents success and failure paths',
    'Adopting TS without strict flags gives a false sense of safety — any still slips through.',
    [
      'Language service (tsserver) shares the compiler for editor features.',
      'Types enable exhaustive switch checking via never.',
      'Declaration files (.d.ts) let JS libraries participate in the type graph.',
    ],
  ),

  'b2-ts-disadvantages': e(
    'TypeScript adds build complexity, learning curve, and occasional friction with rapid prototyping or dynamic JSON. Complex generic types can become hard to read; wrong types can lie if you overuse assertions. Third-party JS without types needs @types or manual shims. Compile step adds latency unless you use transpile-only tools.',
    'Honest engineering weighs costs. TS is not free — teams should know when strict typing slows early exploration or fights highly dynamic domains.',
    'A seatbelt adds buckle time every trip. Worth it on highways; overkill for moving a chair across the room.',
    [
      'Use JSDoc + checkJs for light typing without full migration.',
      'Avoid premature abstraction in generics — start concrete.',
      'Use unknown + narrowing instead of any to keep safety.',
      'Transpile-only (esbuild, swc) for fast dev; tsc --noEmit for CI checks.',
      'Budget time for typing external APIs and edge cases.',
    ],
    `// Fighting the checker — smell
const row = JSON.parse(raw) as User; // assertion, no runtime proof
// Better — validate then narrow
function parseUser(raw: unknown): User {
  if (typeof raw !== 'object' || raw === null || !('name' in raw)) throw new Error('bad');
  return { name: String((raw as { name: unknown }).name) };
}
const sample: unknown = 'text';
console.log(parseUser('demo'));`,
    'Assertions skip checking; validation earns the type',
    'Using any everywhere to "move fast" — you pay double later fixing untyped debt.',
    [
      'Type complexity is measured in instantiations — deep conditional chains can slow tsc.',
      'Emit helpers (__extends, __awaiter) add bytes unless targeting modern ES.',
      'Some JS patterns (mixins, monkey-patching) need extra typing ceremony.',
    ],
  ),

  'b2-optional-static-typing': e(
    'TypeScript\'s type annotations are optional: untyped variables default to inferred types, and JavaScript-style code often needs zero annotations. You add types where they help — public APIs, tricky branches, generic utilities. The compiler fills gaps via inference. This gradual style lets files coexist typed and untyped in one project.',
    'Mandatory typing would repel JS developers and block incremental adoption. Optional typing meets teams where they are.',
    'Training wheels you can attach per wheel. Ride without them on flat paths; add them on hills.',
    [
      'Let inference handle obvious locals: const n = 42 → number.',
      'Annotate function parameters consumers call.',
      'Use explicit returns on exported functions for stable contracts.',
      'strictNullChecks forces you to handle null/undefined deliberately.',
      'checkJs types .js files via JSDoc when TS files are not ready.',
    ],
    `function double(x) { return x * 2; }        // JS style — inferred any (noImplicitAny errors)
function triple(x: number) { return x * 3; } // explicit param
const nums = [1, 2, 3].map(double);           // annotate double if needed
console.log(triple('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json
// Hover types in your editor to inspect inference`,
    'Inference works until noImplicitAny demands annotations',
    'Assuming "no annotations = any" under strict — inference is smart, but untyped params error.',
    [
      'Contextual typing infers callback params from usage site.',
      'Best common type merges array literals.',
      'Implicit any is blocked by noImplicitAny in strict projects.',
    ],
  ),

  'b2-tsc-compilation': e(
    'The TypeScript compiler (tsc) parses .ts/.tsx, type-checks, and emits JavaScript per tsconfig targets (module, target, outDir). It can also --noEmit for type-check only. tsc handles declaration files (.d.ts), source maps, and incremental builds. Bundlers often use esbuild/swc for speed and tsc for verification.',
    'A single official compiler ensures consistent behavior across editors, CI, and docs. Emit + check separation lets teams optimize pipelines.',
    'tsc is a factory: raw TS enters, two products leave — JS for machines, .d.ts blueprints for other TS files.',
    [
      'npx tsc --init scaffolds tsconfig.json.',
      'Set "target" and "module" to match your runtime.',
      'Use "include"/"exclude" to scope compilation.',
      'composite + project references split monorepos.',
      'CI: tsc --noEmit; dev: Vite HMR with esbuild transform.',
    ],
    `// tsconfig.json excerpt
// { "compilerOptions": { "target": "ES2020", "module": "ESNext", "strict": true, "outDir": "dist" } }
const add = (a: number, b: number) => a + b;
export default add;
// emits dist/index.js — types stripped
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json`,
    'Source TS becomes plain JS in outDir',
    'Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder.',
    [
      'Scanner → parser → binder → checker → emitter pipeline.',
      'Incremental builds cache .tsbuildinfo graph deltas.',
      'isolatedModules ensures each file transpiles independently for bundlers.',
    ],
  ),

  'b2-ts-vs-tsx': e(
    '.ts files contain TypeScript without JSX. .tsx files extend TS with JSX syntax for React (or other JSX factories). The compiler needs tsx to parse angle-bracket tags; jsx setting controls emit (React.createElement vs automatic runtime). Same type system applies to both extensions.',
    'JSX is syntactic sugar incompatible with generic angle brackets in .ts — `<T>` ambiguity forced a separate extension.',
    '.ts is prose; .tsx is prose with stage directions for UI components.',
    [
      'Rename component files using JSX to .tsx.',
      'Set "jsx": "react-jsx" for React 17+ automatic runtime.',
      'Generic components: function List<T>(props: { items: T[] }) in .tsx.',
      'Non-React JSX (Preact, Solid) sets jsxFactory/jsxFragmentFactory.',
      'Keep non-UI logic in .ts for faster checks and clearer boundaries.',
    ],
    `// Button.tsx
type Props = { label: string; onClick: () => void };
export function Button({ label, onClick }: Props) {
  return <button type="button" onClick={onClick}>{label}</button>;
}
console.log("export type { Props }");
// type Props = { label: string; onClick: () => void }; narrows allowed values
console.log(Button('demo'));
// Props is available to importers as a type alias`,
    'TSX pairs JSX with typed props',
    'Using .ts for files containing <div> — parser treats < as less-than operator.',
    [
      'JSX emit transforms to createElement or jsxDEV calls.',
      'react-jsx import source is automatic from react/jsx-runtime.',
      'TS 5+ supports other JSX runtimes via jsxImportSource.',
    ],
  ),

  'b2-primitive-object-types': e(
    'TypeScript mirrors JS types: primitives (string, number, boolean, bigint, symbol, null, undefined) and object types (arrays, functions, classes, plain objects). Primitives are immutable values; object types hold references. Boxed wrappers (String, Number) exist but are almost never used in idiomatic TS.',
    'Aligning with JS runtime typeof behavior keeps mental models honest and narrowing predictable.',
    'Primitives are atoms; objects are molecules made of properties pointing elsewhere.',
    [
      'Prefer string over String — literal vs wrapper object.',
      'typeof null is "object" in JS; TS still types null separately.',
      'Arrays and functions are object subtypes in TS.',
      'void is absence of return; never is unreachable.',
      'Use object (lowercase) for non-primitive constraint in generics.',
    ],
    `const s: string = 'hi';
const n: number = 42;
const o: { id: number } = { id: 1 };
const fn: (x: number) => number = (x) => x * 2;
console.log(typeof s, typeof o, typeof fn);
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Primitives vs object shapes at compile time',
    'Typing something as Object or {} — too wide; loses property access safety.',
    [
      'Primitive types are union of literal values plus general type.',
      'Structural compatibility applies to object types.',
      'undefined and void differ: void for returns, undefined as value type.',
    ],
  ),

  'b2-type-string': e(
    'string is the type for textual UTF-16 sequences. Template literals produce strings; TS also supports string literal types ("admin" | "user") for precise unions. Methods like trim, slice, and includes are typed on the built-in String interface.',
    'Most APIs carry names, URLs, and messages as strings — accurate typing prevents number/boolean confusion at boundaries.',
    'A string is a labeled ribbon of characters; literal types color specific ribbons.',
    [
      'Annotate user-facing text as string.',
      'Use template literal types for event name patterns.',
      'Prefer string over any for IDs when format is unknown.',
      'as const on string arrays narrows to readonly literals.',
      'Branded strings encode units: type UserId = string & { readonly brand: unique symbol }.',
    ],
    `type Role = 'admin' | 'viewer';
function setRole(r: Role) { console.log(r); }
setRole('admin');
const label: string = \`Role: admin\`;
const __typed: Role = {} as Role;
console.log("void __typed;");
console.log("export type { Role }");
// type Role = 'admin' | 'viewer'; narrows allowed values`,
    'General string vs literal union Role',
    'Confusing string with single-char — use string; char is not a separate TS primitive.',
    [
      'String literal types participate in discriminated unions.',
      'Template literal types distribute over unions.',
      'Encoding (UTF-16 surrogate pairs) matches JS string model.',
    ],
  ),

  'b2-type-number': e(
    'number covers all IEEE-754 doubles: integers, floats, NaN, and Infinity. There is no separate int/float. bigint is a distinct type for arbitrary-precision integers. Literal types like 42 or -1 narrow specific constants.',
    'JS has one number type; TS mirrors that to avoid false precision about integers.',
    'number is a wide bucket — all numeric JS values swim in the same pool.',
    [
      'Use number for counters, coordinates, timestamps.',
      'Use bigint suffix n for IDs beyond 2^53-1.',
      'Number.isInteger narrows at runtime; TS still types as number.',
      'Prefer explicit checks for NaN — NaN !== NaN.',
      'Union with literal types for fixed sets: 200 | 404 | 500.',
    ],
    `const count: number = 3;
const big: bigint = 9007199254740991n;
const maybe: number | null = null;
console.log(count + 1, big + 1n);
const port: 200 | 404 | 500 = 200;
console.log(Number.isInteger(count), maybe === null, port);
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'number and bigint are distinct TS types',
    'Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed.',
    [
      'Numeric literal types auto-widen unless as const.',
      'Enums with numeric members compile to reverse maps.',
      'Math operations preserve number unless bigint involved.',
    ],
  ),

  'b2-type-boolean': e(
    'boolean is true | false. Conditions, flags, and toggles use it. Truthy/falsy JS values are not booleans — TS separates boolean from other types under strict checks.',
    'Flags drive control flow; boolean typing prevents "yes"/1 confusion in conditionals.',
    'A light switch — only on or off, not "maybe string".',
    [
      'Return boolean from predicates: isAdmin(user): boolean.',
      'Do not type arbitrary truthy values as boolean.',
      'Use !! or Boolean() to coerce when intentional.',
      'Discriminant fields often use boolean | literal unions.',
      'Strict null checks: boolean does not include undefined.',
    ],
    `function isEven(n: number): boolean {
  return n % 2 === 0;
}
const ok: boolean = isEven(4);
if (ok) console.log('even');
if (ok) // Also inspect('even');
console.log(isEven('demo'));
// TypeScript validates this file before emit`,
    'Predicate returns narrow boolean',
    'Typing API field as boolean when server sends "true" string — parse or type as string union.',
    [
      'Boolean() wrapper type exists but avoid new Boolean().',
      'Control flow analysis narrows on if (flag) blocks.',
      'Boolean literals in unions enable exhaustiveness.',
    ],
  ),

  'b2-explicit-types': e(
    'Explicit types are annotations you write on variables, parameters, and returns: let x: number, function f(n: string): boolean. They document intent and stabilize public APIs when inference would be too wide or fragile.',
    'Consumers of your functions cannot see inference — explicit signatures are the contract.',
    'Explicit types are name tags on boxes crossing warehouse doors.',
    [
      'Export function signatures explicitly.',
      'Annotate when inference widens: [] → never[] without context.',
      'Use satisfies when you want checking without widening.',
      'Class fields and React props benefit from explicit shapes.',
      'Avoid redundant annotations on obvious const literals.',
    ],
    `export function parsePort(value: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error('bad port');
  return n;
}
console.log(parsePort('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Exported helper with explicit param and return',
    'Over-annotating every local — noisy and fights inference.',
    [
      'Explicit annotations are checked targets for assignability.',
      'Widening happens when annotation is wider than initializer.',
      'Type assertions are not explicit types — they override checking.',
    ],
  ),

  'b2-type-annotations': e(
    'Type annotations attach static types to bindings using colon syntax: const age: number = 30. They appear on parameters, returns, variables, and class members. Annotations are erased on emit — zero runtime cost.',
    'Annotations are the primary way humans and tools read design intent in TS code.',
    'Sticky notes on variables telling the compiler what shape is allowed.',
    [
      'Parameter annotations are required under noImplicitAny.',
      'Return annotations on recursive functions help inference.',
      'Object destructuring: function f({ id }: { id: string }).',
      'Optional params: id?: string adds undefined to type.',
      'Readonly annotations prevent reassignment of references.',
    ],
    `type Point = { x: number; y: number };
function move(p: Point, dx: number): Point {
  return { x: p.x + dx, y: p.y };
}
const origin: Point = { x: 0, y: 0 };
console.log("export type { Point }");
// type Point = { x: number; y: number }; narrows allowed values
console.log(move('demo'));
// Point is available to importers as a type alias`,
    'Annotations on param, return, and variable',
    'Annotating const x: number = "5" — error unless you meant string.',
    [
      'Annotations participate in contextual typing bidirectionally.',
      'JSDoc @param is annotation equivalent for .js files.',
      'Type-only imports use import type — erased completely.',
    ],
  ),

  'b2-type-inference': e(
    'Type inference lets the compiler deduce types without annotations from initializers, return expressions, and usage context. const x = 10 infers number; const arr = [1, 2] infers number[]. Generic functions infer type parameters from arguments.',
    'Less boilerplate, fewer lies — inferred types track actual code paths.',
    'The compiler reads your code like a detective and writes the dossier (type) for you.',
    [
      'Prefer inference for locals and simple callbacks.',
      'Hover in IDE to see inferred type when unsure.',
      'as const prevents widening literal inference.',
      'Generic calls infer T from arguments: identity("a") → string.',
      'When inference fails, add minimal annotation at the leak point.',
    ],
    `const ids = [1, 2, 3];           // number[]
const first = ids[0];              // number
function wrap<T>(x: T) { return [x]; }
const pair = wrap('ok');           // string[]
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json
// Hover types in your editor to inspect inference`,
    'Array and generic inference without annotations',
    'Empty array [] infers never[] — annotate Element[] or provide initial element.',
    [
      'Flow-sensitive inference narrows in if branches.',
      'Best common type algorithm merges branch returns.',
      'Inference runs limited depth — deep recursion may need hints.',
    ],
  ),

  'b2-when-explicit-vs-inferred': e(
    'Use inference for internal implementation details; use explicit types at boundaries (exports, React props, API handlers) and when inference is wrong (empty arrays, JSON parse, widening literals). Return type annotations on public functions prevent accidental API changes.',
    'Balance noise vs safety — annotate where mistakes are expensive, infer where code is obvious.',
    'Inferred types are auto-pilot; explicit types are hands on wheel at intersections.',
    [
      'Export? Explicit signature.',
      'JSON/unknown input? Annotate after validate, not before.',
      'Complex generic utility? Explicit type params at call site if needed.',
      'satisfies preserves literals while checking shape.',
      'If hover shows any or overly wide union, annotate.',
    ],
    `export function createStore<S>(initial: S) {
  let state = initial;
  return {
    get: (): S => state,
    set: (next: S) => { state = next; },
  };
}
const store = createStore({ count: 0 }); // S inferred as { count: number }`,
    'Generic boundary inferred; methods stay typed',
    'Explicit return type on huge function that drifted — compiler would catch narrower bug.',
    [
      'Implementing interfaces requires explicit class implements clause.',
      'Contextual typing reduces need for callback param annotations.',
      'Function return inference follows all code paths for assignability.',
    ],
  ),

  'b2-special-types': e(
    'Beyond primitives, TS has special types: any (opt-out), unknown (safe top), void (no return), never (no values), null, and undefined. They model JS behavior and control flow. Strict mode treats null/undefined distinctly from other types.',
    'These types encode edge cases — unreachable code, missing returns, untrusted input — that primitives alone cannot express.',
    'Special types are traffic signals: stop (never), caution (unknown), detour (any).',
    [
      'Replace any with unknown at trust boundaries.',
      'Use void for functions that run side effects only.',
      'never marks exhaustiveness gaps and throw paths.',
      'Enable strictNullChecks — null is not assignable to string.',
      'undefined optional props use ? syntax.',
    ],
    `function assertNever(x: never): never {
  throw new Error('Unexpected: ' + x);
}
type Action = { type: 'inc' } | { type: 'dec' };
function reduce(a: Action) {
  switch (a.type) { case 'inc': return 1; case 'dec': return -1; default: return assertNever(a); }
// type Action = { type: 'inc' } | { type: 'dec' }; narrows allowed values
console.log(reduce('demo'));
// Action is available to importers as a type alias`,
    'never enforces exhaustive switch on Action',
    'Using any as default instead of unknown — disables all checking downstream.',
    [
      'any is both top and bottom — assignable everywhere both ways.',
      'unknown requires narrowing before property access.',
      'never is subtype of every type; only never assignable to never.',
    ],
  ),

  'b2-avoiding-any': e(
    'any disables type checking for a value — use sparingly. Prefer unknown for external data, generics with constraints, or narrow with type guards. eslint @typescript-eslint/no-explicit-any flags abuse. Gradual migration can use any temporarily with a tracked backlog.',
    'any is a hole in the boat — one leak sinks nearby safety.',
    'any is a universal key that opens every door, including wrong ones.',
    [
      'Parse JSON as unknown, validate, then assign typed variable.',
      'Use Record<string, unknown> for dynamic bags.',
      'Generic <T extends object> instead of any for objects.',
      'Legacy JS: // @ts-expect-error with comment beats silent any.',
      'never propagate any from third-party — wrap with typed facade.',
    ],
    `function parseJson(raw: string): unknown {
  return JSON.parse(raw);
}
function isUser(v: unknown): v is { name: string } {
  return typeof v === 'object' && v !== null && 'name' in v && typeof (v as { name: unknown }).name === 'string';
const data = parseJson('{"name":"Ada"}');
if (isUser(data)) console.log(data.name);
const sample: unknown = 'text';
console.log(isUser('demo'));`,
    'unknown in, narrowed User out',
    'Typing catch (e: any) — use unknown and narrow or e instanceof Error.',
    [
      'Implicit any from missing annotations blocked by noImplicitAny.',
      'any infections spread through return inference.',
      'Suppressions without fixes accumulate silent bugs.',
    ],
  ),

  'b2-unknown': e(
    'unknown is the type-safe counterpart to any: you can assign anything to unknown, but cannot use it until narrowed. It forces runtime checks, typeof, or type guards before property access, calls, or arithmetic.',
    'Interview favorite: unknown vs any — unknown preserves safety; any removes it.',
    'A sealed package — you must inspect contents before use.',
    [
      'Function params for user input: (input: unknown).',
      'Narrow with typeof, instanceof, in, or custom guards.',
      'After validation, assign to concrete type.',
      'unknown is not assignable to string without narrowing.',
      'Use in API layers receiving JSON or message events.',
    ],
    `function len(x: unknown): number {
  if (typeof x === 'string') return x.length;
  if (Array.isArray(x)) return x.length;
  throw new Error('unsupported');
}
console.log(len('abc'), len([1, 2]));
const sample: unknown = 'text';
// TypeScript validates this file before emit`,
    'unknown narrowed by typeof and Array.isArray',
    'Casting unknown to MyType with as — bypasses safety you chose unknown for.',
    [
      'unknown is top type except any in assignability.',
      'Control flow analysis tracks narrowing per branch.',
      'Predicate guards (v is T) teach the checker.',
    ],
  ),

  'b2-never': e(
    'never represents values that never occur — functions that always throw, infinite loops, or impossible branches after exhaustive checks. It is the bottom type: assignable to every type, nothing assignable to it except never.',
    'never powers exhaustiveness checking and documents unreachable code paths.',
    'A dead-end sign — no values live here.',
    [
      'assertNever helper in default switch cases.',
      'Return type never for functions that always throw.',
      'Conditional types use never to filter unions.',
      'Intersection T & never collapses to never.',
      'Use after exhaustive narrowing to prove completeness.',
    ],
    `type Shape = 'circle' | 'square';
function area(s: Shape): number {
  switch (s) {
    case 'circle': return Math.PI;
    case 'square': return 1;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }`,
    'Assigning s to never proves switch is exhaustive',
    'Using never as parameter type for "unused" args — prefer explicit _ prefix and void.',
    [
      'Control flow merges throw paths into never return.',
      'Unions with never members disappear (A | never → A).',
      'Recursion depth errors sometimes surface as never.',
    ],
  ),

  'b2-void-ts': e(
    'void marks functions that return undefined or no value — console.log, side-effect handlers. void as operator evaluates expression and returns undefined (occasionally used to silence unused promise warnings). void type is not the same as undefined type in strict contexts.',
    'Distinguishes "I do something" from "I produce a value" for callbacks and event handlers.',
    'void is a receipt that says "no goods returned".',
    [
      'Event handlers: () => void.',
      'Avoid returning a value from void functions — strict checks may warn.',
      'void 0 is idiomatic undefined in some legacy code.',
      'Promise<void> for async work with no meaningful result.',
      'Do not confuse void variable type with undefined — prefer undefined when storing.',
    ],
    `function logMessage(msg: string): void {
  console.log(msg);
}
const btnHandler = (): void => { logMessage('clicked'); };
btnHandler();
console.log("void btnHandler;");
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'Side-effect function annotated void',
    'Typing async function as void instead of Promise<void> — use Promise<void> for async.',
    [
      'undefined is assignable to void in returns.',
      'void in union often simplifies to ignored.',
      'strictFunctionTypes treats void returns specially in callbacks.',
    ],
  ),

  'b2-null-undefined-ts': e(
    'null and undefined are distinct literal types representing absence. With strictNullChecks, they are not assignable to other types unless unioned. Optional properties include undefined; nullable fields often use T | null for SQL/API semantics.',
    'JS conflates missing and null in APIs — TS lets you model which absence you mean.',
    'undefined = slot empty; null = explicit "no value" placeholder.',
    [
      'Enable strictNullChecks in tsconfig.',
      'Optional prop?: T means T | undefined.',
      'Use | null when API returns explicit null.',
      'Nullish coalescing ?? and optional chaining ?.',
      'Non-null assertion ! only when you have proof.',
    ],
    `type Profile = { name: string; bio?: string; avatar: string | null };
const p: Profile = { name: 'Ada', avatar: null };
console.log(p.bio ?? 'No bio');
console.log(p.avatar?.length ?? 0);
const __typed: Profile = {} as Profile;
console.log("void __typed;");
console.log("export type { Profile }");
// type Profile = { name: string; bio?: string; avatar: string | null }; narrows allowed values`,
    'Optional bio vs nullable avatar',
    'Using || instead of ?? — falsy 0 or "" get replaced wrongly.',
    [
      'strictNullChecks adds undefined to unmarked optional params.',
      'Definite assignment checks interact with undefined.',
      'exactOptionalPropertyTypes tightens optional semantics further.',
    ],
  ),

  'b2-strict-null-checks': e(
    'strictNullChecks (strictNullChecks: true) ensures null and undefined are handled explicitly — no silent access on maybe-missing values. It is the single highest-impact strict flag for real-world bug prevention.',
    'Most production TypeErrors are "cannot read property of undefined" — this flag forces handling upfront.',
    'Every value might be absent until you prove otherwise.',
    [
      'Turn on in tsconfig compilerOptions.',
      'Fix errors with guards, ??, ?., or union types.',
      'Avoid ! non-null assertion as default fix.',
      'Narrow before dereference in callbacks.',
      'Pair with noUncheckedIndexedAccess for arrays/records.',
    ],
    `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const item = first([1, 2]);
if (item !== undefined) console.log(item + 1);
console.log("void item;");
if (item !== undefined) // Also inspect(item + 1);
console.log(first('demo'));`,
    'Return T | undefined forces check before use',
    'Disabling strictNullChecks to green CI — reintroduces entire bug class.',
    [
      'Control flow analysis tracks undefined elimination.',
      'Type guards and equality checks narrow unions.',
      'Discriminated unions reduce null checks via status field.',
    ],
  ),

  'b2-typed-arrays': e(
    'Array types in TS use T[] or Array<T> for homogenous lists. ReadonlyArray<T> or readonly T[] prevents mutating methods. Typed arrays (Int32Array, etc.) have dedicated lib types for binary data.',
    'Lists are everywhere — precise element typing catches index and push mistakes.',
    'A typed shelf: each slot holds the same kind of item.',
    [
      'const nums: number[] = [1, 2, 3].',
      'Generics: Array<User> same as User[].',
      'Tuple vs array: fixed length uses tuple syntax.',
      'Readonly for function params you will not mutate.',
      'Multidimensional: number[][] or Matrix alias.',
    ],
    `type User = { id: string; name: string };
const users: User[] = [{ id: '1', name: 'Ada' }];
function names(list: readonly User[]): string[] {
  return list.map((u) => u.name);
}
console.log(names(users));
const __typed: User = {} as User;
// type User = { id: string; name: string }; narrows allowed values`,
    'User[] param accepts readonly view',
    'Using Array<any> — loses element typing on map/filter chains.',
    [
      'Array inference from non-empty literals.',
      'Covariance of readonly arrays in function params.',
      'Array.isArray narrows unknown to any[] — refine further.',
    ],
  ),

  'b2-readonly-arrays': e(
    'readonly T[] or ReadonlyArray<T> disables push, pop, splice, and indexed assignment. It signals intent: consumers may read but not mutate. Spread and map still produce new arrays.',
    'Immutability at type level documents API contracts without runtime cost.',
    'Glass display case — look, do not rearrange.',
    [
      'Function params: items: readonly string[].',
      'const tuple = [1, 2] as const → readonly tuple.',
      'ReadonlyArray includes length and readonly index signature.',
      'Deep readonly needs recursive mapped type or libraries.',
      'Combine with Readonly utility on object arrays.',
    ],
    `function sum(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
const values = [1, 2, 3] as const;
console.log(sum([...values]));
console.log("void values;");
console.log(sum('demo'));
// TypeScript validates this file before emit`,
    'readonly param accepts mutable array at call site',
    'Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>.',
    [
      'readonly is modifier on array type, not runtime freeze.',
      'Mutable arrays assignable to readonly (covariance).',
      'Object.freeze is runtime; readonly is compile-time.',
    ],
  ),

  'b2-array-inference': e(
    'Array literals infer element types from members: [1, "a"] → (string | number)[]. Empty [] infers never[] without context. Contextual typing from expected type guides inference: const f = (x: number[]) => x; f([]) ok as number[].',
    'Correct inference avoids redundant annotations while preventing never[] traps.',
    'The compiler averages ingredients to guess stew flavor.',
    [
      'Provide context: const ids: string[] = [].',
      'as const on tuples preserves literal types.',
      'map/filter preserve element types with generics.',
      'satisfies on config arrays keeps literal union.',
      'Explicit generic on empty: Array<number>().',
    ],
    `const mixed = [1, 'two'];              // (string | number)[]
const empty: number[] = [];
const tuple = [1, 'a'] as const;           // readonly [1, "a"]
const doubled = [1, 2, 3].map((n) => n * 2); // number[]
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json
// Hover types in your editor to inspect inference`,
    'Mixed literals widen; as const freezes tuple',
    'Pushing to const inferred array — readonly if as const; error on mutation.',
    [
      'Best common type widens numeric/string literals in arrays.',
      'Homogeneous array inference prefers single element type.',
      'NoImplicitAny affects untyped empty array in JS files.',
    ],
  ),

  'b2-tuples': e(
    'Tuples are arrays with fixed length and typed positions: type Pair = [string, number]. Optional and rest elements supported: [string, ...number[]]. Tuples model CSV rows, coordinates, React useState pairs.',
    'When index meaning matters, tuples beat homogeneous arrays.',
    'Labeled slots in a fixed rack — slot 0 is always string, slot 1 number.',
    [
      'declare [x, y]: [number, number] for coords.',
      'Labeled tuples (TS 4.0+): [name: string, age: number].',
      'Rest tuple: type Head = [string, ...boolean[]].',
      'Destructuring preserves tuple types.',
      'Use readonly tuples for immutable pairs.',
    ],
    `type RGB = [number, number, number];
function toHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}
console.log(toHex([255, 0, 128]));
const __typed: RGB = {} as RGB;
console.log("export type { RGB }");
// type RGB = [number, number, number]; narrows allowed values`,
    'RGB tuple destructured in toHex',
    'Assigning [1,2,3,4] to [number, number] — excess length error under strict tuples.',
    [
      'Variadic tuple types combine with spreads in calls.',
      'Tuple inference from as const on array literal.',
      'Optional tuple elements use ? on element type.',
    ],
  ),

  'b2-readonly-tuples': e(
    'readonly [string, number] prevents length changes and index assignment while allowing read access. as const on array literals produces deeply readonly tuple types with literal members.',
    'Immutable pairs and config rows benefit from readonly tuples in APIs.',
    'Tuple under glass — indices fixed and read-only.',
    [
      'const config = ["api", 443] as const → readonly ["api", 443].',
      'Readonly tuple assignable from mutable counterpart.',
      'Map Object.entries with typed entries helper.',
      'Use satisfies for tuple shape without widening.',
      'Spread readonly tuple into new mutable array when needed.',
    ],
    `const endpoint = ['https://api.example.com', 443] as const;
type Endpoint = typeof endpoint; // readonly ["https://api.example.com", 443]
function host(e: readonly [string, number]) { return e[0]; }
console.log(host(endpoint));
const __typed: Endpoint = {} as Endpoint;
console.log("void __typed;");
console.log("export type { Endpoint }");
// type Endpoint = typeof endpoint; // readonly ["https://api.example.com", 443] narrows allowed values`,
    'as const preserves readonly literal tuple',
    'Mutating as const array — compile error; clone first if mutation needed.',
    [
      'readonly modifier on each element in inferred as const.',
      'Tuple labels are compile-time only — erased in emit.',
      'ReadonlyArray is wider than readonly tuple.',
    ],
  ),

  'b2-object-types': e(
    'Object types describe shape with known properties: { id: string; count: number }. Excess property checking catches typos on object literals. Index signatures allow dynamic keys. Types are structural — extra properties on variables often OK when not fresh literals.',
    'Most domain models are objects — accurate shapes drive autocomplete and refactors.',
    'A form with named fields — each label has an expected value type.',
    [
      'Define interfaces or type aliases for entities.',
      'Separate creation vs persisted shapes (optional id).',
      'Use Record<K,V> for uniform dynamic keys.',
      'Nested objects: inline or named aliases.',
      'Prefer unknown over empty object for "some object".',
    ],
    `type Task = { id: string; title: string; done: boolean };
function toggle(t: Task): Task {
  return { ...t, done: !t.done };
}
const t: Task = { id: '1', title: 'Learn TS', done: false };
console.log(toggle(t).done);
const __typed: Task = {} as Task;
// type Task = { id: string; title: string; done: boolean }; narrows allowed values`,
    'Task object spread preserves type',
    'Fresh literal with typo extra field — excess property error; assigned variable may not error.',
    [
      'Structural typing: matching shape is assignable.',
      'Weak object types (Object) nearly useless — avoid.',
      'Freshness checking applies to object literals only.',
    ],
  ),

  'b2-optional-properties': e(
    'Optional properties use ? : { email?: string } means string | undefined. Access requires narrowing or defaults. distinct from T | undefined when exactOptionalPropertyTypes is on — cannot assign undefined explicitly unless allowed.',
    'APIs often omit fields — optionals model partial payloads cleanly.',
    'Fields that may be missing from the form.',
    [
      'Mark sparse JSON fields optional.',
      'Use ?? or default when reading optional.',
      'Partial<T> utility makes all properties optional.',
      'Required<T> opposite for strict completeness.',
      'Do not abuse optional for always-present nullable — use | null.',
    ],
    `type CreateUser = { name: string; email?: string };
function save(input: CreateUser) {
  const email = input.email ?? 'none@local';
  console.log(input.name, email);
}
save({ name: 'Ada' });
console.log("export type { CreateUser }");
// type CreateUser = { name: string; email?: string }; narrows allowed values`,
    'Optional email omitted; default applied',
    'Confusing ? with | null — optional is undefined absence, null is explicit value.',
    [
      'Optional chaining ?. on optional props.',
      'exactOptionalPropertyTypes changes assignability rules.',
      'Discriminated unions often replace many optionals.',
    ],
  ),

  'b2-readonly-properties': e(
    'readonly modifier on properties prevents reassignment after initialization. For objects, nested data may still mutate unless deeply readonly. Readonly<T> utility maps all properties readonly.',
    'Immutable fields document identifiers and config that must not change.',
    'Carved nameplate on a door — not repainted casually.',
    [
      'readonly id: string on entity classes.',
      'Readonly<T> for function params.',
      'Combine with as const for config objects.',
      'Class readonly fields may only assign in constructor.',
      'Deep immutability: recursive Readonly or Immer at runtime.',
    ],
    `type Version = { readonly major: number; readonly minor: number };
const v: Version = { major: 1, minor: 2 };
const copy: Version = { ...v, minor: 3 };
console.log(copy);
const __typed: Version = {} as Version;
console.log("void __typed;");
console.log("export type { Version }");
// type Version = { readonly major: number; readonly minor: number }; narrows allowed values`,
    'Spread creates new object; readonly allows new assignment',
    'Readonly only shallow — mutating nested array still compiles unless typed readonly.',
    [
      'readonly on array property → readonly array type.',
      'Getter-only properties implicitly readonly.',
      'Readonly prevents write via indexed access on known keys.',
    ],
  ),

  'b2-parameter-destructuring': e(
    'TypeScript types destructured parameters inline or via a named type: function f({ id, name }: User). Defaults and renaming work like JS; types attach to the pattern. Rest in objects collects remainder with typed Record.',
    'React props and options objects commonly use destructuring — typing the pattern is essential.',
    'Unpack a typed suitcase at the function door.',
    [
      'Inline: ({ x, y }: { x: number; y: number }).',
      'Named alias: type Props = { label: string }; function C({ label }: Props).',
      'Default values combine with optional types carefully.',
      'Rest ...others typed as Omit when forwarding.',
      'Array destructuring tuples preserve positions.',
    ],
    `type Options = { host: string; port?: number; ssl?: boolean };
function connect({ host, port = 443, ssl = true }: Options) {
  return \`\${ssl ? 'https' : 'http'}://\${host}:\${port}\`;
}
console.log(connect({ host: 'localhost' }));
const __typed: Options = {} as Options;
console.log("export type { Options }");
// type Options = { host: string; port?: number; ssl?: boolean }; narrows allowed values`,
    'Destructured Options with defaults',
    'Forgetting optional means undefined — default in pattern fixes without changing type.',
    [
      'Parameter properties in classes combine destructure + visibility.',
      'Contextual typing applies to nested destructuring.',
      'Binding patterns require all non-optional keys or defaults.',
    ],
  ),

  'b2-enums': e(
    'Enums declare a set of named constants. Numeric enums auto-increment; string enums are preferred for readability and tree-shaking. Const enums inline at compile time. Enums generate JS objects unless const — unlike literal unions.',
    'Enums give named constants with reverse mapping for numeric variants — though literal unions often replace them in modern TS.',
    'A menu of numbered meal codes — enum maps names to values.',
    [
      'Prefer string enums for domain statuses.',
      'const enum for zero runtime when inlining OK.',
      'Avoid mixing computed and auto members carelessly.',
      'Compare with literal unions for bundle size.',
      'Use satisfies with as const objects as alternative.',
    ],
    `enum Status { Idle = 'idle', Loading = 'loading', Done = 'done' }
function render(s: Status) {
  if (s === Status.Loading) return '...';
  return s;
}
console.log(render(Status.Done));
console.log(render('demo'));
// TypeScript validates this file before emit`,
    'String enum Status with typed render',
    'Numeric enum reverse mapping surprises — Object.keys includes numbers and names.',
    [
      'Enums are nominal-ish — less structural mixing than unions.',
      'const enum requires compile-time known values.',
      'isolatedModules may block const enum re-exports.',
    ],
  ),

  'b2-string-enums': e(
    'String enums assign string values to each member: enum Color { Red = "red" }. They serialize cleanly to JSON and debug logs. Each member type is Color, not the literal "red" unless narrowed.',
    'String enums read well in APIs and avoid numeric magic values.',
    'Named labels glued to string payloads.',
    [
      'Use PascalCase members, lowercase string values if API expects.',
      'Do not rely on auto-increment — specify strings explicitly.',
      'Switch on enum for exhaustiveness.',
      'Compare to literal unions for zero emit.',
      'Document mapping if server uses different strings.',
    ],
    `enum Theme { Light = 'light', Dark = 'dark' }
function css(theme: Theme): string {
  return theme === Theme.Dark ? 'color-scheme: dark' : 'color-scheme: light';
}
console.log(css(Theme.Light));
console.log(css('demo'));
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'Theme string enum drives CSS branch',
    'Expecting Theme.Light type to be "light" literal — it is Theme unless const enum or union.',
    [
      'String enums do not get reverse maps.',
      'Each member emits runtime property unless const enum.',
      'Unions of literals are assignable more flexibly at boundaries.',
    ],
  ),

  'b2-literal-unions-vs-enums': e(
    'Literal union types (type Status = "idle" | "loading" | "done") erase completely — no runtime object. Enums emit JS and create a nominal namespace. Unions interoperate structurally; enums need import and runtime presence.',
    'Interview topic: prefer unions + as const for tree-shaking and JSON parity; enums when you need namespace or reverse maps.',
    'Unions are a checklist on paper; enums are a printed menu at the restaurant.',
    [
      'const STATUS = { Idle: "idle", Done: "done" } as const;',
      'type Status = typeof STATUS[keyof typeof STATUS];',
      'Use union for API string literals from OpenAPI.',
      'Use enum when team standard or legacy codebase.',
      'Exhaustive switch works on both with assertNever.',
    ],
    `const STATUS = { idle: 'idle', done: 'done' } as const;
type Status = (typeof STATUS)[keyof typeof STATUS];
function isDone(s: Status): boolean { return s === STATUS.done; }
console.log(isDone('done'));
const __typed: Status = {} as Status;
console.log("void __typed;");
console.log("export type { Status }");
// type Status = (typeof STATUS)[keyof typeof STATUS]; narrows allowed values`,
    'as const object + union — zero enum emit',
    'Mixing enum and string literal — assignability errors; pick one style per domain.',
    [
      'Unions distribute in conditional types; enums do not.',
      'Enums create value + type namespace; unions are type-only.',
      'const object pattern enables satisfies validation.',
    ],
  ),

  'b2-as-const-objects': e(
    'as const on object literals makes properties readonly and narrows values to literal types. Combined with typeof and keyof, it builds string unions without enums. satisfies checks shape while preserving literals.',
    'Modern TS pattern for config maps and variant keys with full inference.',
    'Freeze the object and read exact string types from it.',
    [
      'const ROUTES = { home: "/", about: "/about" } as const;',
      'type Route = typeof ROUTES[keyof typeof ROUTES];',
      'Use satisfies Record<string, string> to validate without widen.',
      'Readonly deep literals for theme tokens.',
      'Pair with mapped types for variant components.',
    ],
    `const EVENTS = { click: 'click', focus: 'focus' } as const;
type EventName = (typeof EVENTS)[keyof typeof EVENTS];
function on(name: EventName, fn: () => void) { console.log(name, fn.name); }
on(EVENTS.click, () => {});
const __typed: EventName = {} as EventName;
console.log("void __typed;");
console.log("export type { EventName }");
// type EventName = (typeof EVENTS)[keyof typeof EVENTS]; narrows allowed values`,
    'EVENTS as const drives EventName union',
    'Forgetting as const — values widen to string, losing literal union.',
    [
      'as const applies recursively to nested literals in TS 5+.',
      'Readonly modifier inferred on all properties.',
      'Tuple literals become readonly tuples with as const.',
    ],
  ),

  'b2-interfaces': e(
    'Interfaces declare object shapes and can be extended or implemented by classes. They support declaration merging — duplicate interface names merge. interface is the idiomatic choice for public object contracts and class implements clauses.',
    'Interfaces read naturally for OOP-style contracts and merge with global augmentation.',
    'Blueprint pages you can tape together (merge) for bigger structures.',
    [
      'interface User { id: string; name: string }',
      'Extend: interface Admin extends User { role: "admin" }',
      'Classes: class DbUser implements User { ... }',
      'Prefer interface for object-only public APIs.',
      'Use type for unions, tuples, mapped types.',
    ],
    `interface Identifiable { id: string }
interface Named { name: string }
interface Person extends Identifiable, Named {}
const p: Person = { id: '1', name: 'Ada' };
console.log(p.name);
const __typed: Identifiable = {} as Identifiable;
console.log("const __item: Identifiable = {} as Ident");
// TypeScript validates this file before emit`,
    'Multiple interface extension into Person',
    'Using interface for primitive alias — use type; interface cannot alias union easily.',
    [
      'Interface declarations merge in same scope.',
      'Extends checks structurally — no runtime inheritance.',
      'Call signatures and construct signatures live on interfaces.',
    ],
  ),

  'b2-extending-interfaces': e(
    'interface B extends A adds A\'s members to B. Multiple extends merge shapes. extends is compile-time only — no prototype chain. Use for layering optional fields and role-specific views of entities.',
    'Composition of types mirrors domain specialization without class inheritance.',
    'Stack transparent sheets — each adds fields to the same form.',
    [
      'Base interface with shared fields.',
      'Specialized interfaces extend base.',
      'Intersection type A & B alternative when not re-opening.',
      'Generic interfaces extend generic bases: interface Page<T> extends Node.',
      'Document extension chains for API consumers.',
    ],
    `interface Entity { id: string; createdAt: Date }
interface Post extends Entity { title: string; body: string }
function summarize(p: Post): string {
  return \`[\${p.id}] \${p.title}\`;
}
console.log(summarize({ id: '1', createdAt: new Date(), title: 'Hi', body: '' }));
const __typed: Entity = {} as Entity;
console.log(summarize('demo'));`,
    'Post extends Entity with title and body',
    'Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types.',
    [
      'extends resolves to flattened member set.',
      'Generic constraints often use extends on type params.',
      'Interface extends is checked for assignability.',
    ],
  ),

  'b2-interface-vs-type-when': e(
    'Use interface for object shapes, class contracts, and library augmentation. Use type alias for unions, intersections, tuples, mapped/conditional types, and primitives. Both can describe objects — interface merges; type cannot re-open. Performance: large projects sometimes favor interface for recursive objects.',
    'Interview question with a practical answer — neither is always wrong; conventions reduce debate.',
    'interface = extensible blueprint; type = Swiss Army alias for any type expression.',
    [
      'Object API surface → interface.',
      'Status = "a" | "b" → type.',
      'Need declaration merging → interface.',
      'Need Pick/Omit composition on alias → type.',
      'Team consistency beats personal preference.',
    ],
    `type Id = string;
interface Node { id: Id; children: Node[] }
type Result = { ok: true; data: string } | { ok: false; error: string };
function handle(r: Result) { return r.ok ? r.data : r.error; }
const __typed: Id = {} as Id;
console.log("const __item: Node = {} as Node");
// type Id = string; narrows allowed values
console.log(handle('demo'));
// Id is available to importers as a type alias`,
    'interface for tree Node; type for Result union',
    'Rewriting all interfaces as type for aesthetics — lose merging and error message clarity.',
    [
      'Type aliases cannot be merged after creation.',
      'Both are erased — zero runtime difference.',
      'Recursive types work with both; interface slightly clearer for trees.',
    ],
  ),

  'b2-type-aliases': e(
    'type Name = ... creates an alias for any type expression — unions, primitives, tuples, functions. Aliases are not re-openable but compose powerfully with utilities and generics.',
    'type is the generic name tag for any TS type, not just objects.',
    'Nickname for a complex type recipe.',
    [
      'type UserId = string;',
      'type Handler = (ev: Event) => void;',
      'type Nullable<T> = T | null;',
      'Export type aliases for domain vocabulary.',
      'Document non-obvious aliases with brief comment if needed.',
    ],
    `type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };
function stringify(value: JSONValue): string {
  return JSON.stringify(value);
}
console.log(stringify({ a: 1 }));
const __typed: JSONValue = {} as JSONValue;
console.log("export type { JSONValue }");
// type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue }; narrows allowed values`,
    'Recursive JSONValue alias',
    'Circular type alias without lazy reference — use interface or type with indirection.',
    [
      'Type aliases are transparent — structural all the way.',
      'Conditional types only in type alias syntax.',
      'Import type for type-only imports of aliases.',
    ],
  ),

  'b2-type-alias-patterns': e(
    'Common alias patterns: branded IDs, Result/Either unions, Nullable wrappers, callback signatures, and utility compositions (type ReadonlyUser = Readonly<User>). Aliases encode domain language and DRY complex unions.',
    'Patterns turn repeated type shapes into readable vocabulary senior engineers expect.',
    'Domain dictionary — one word replaces a paragraph of structure.',
    [
      'Branded: type Email = string & { readonly __brand: unique symbol }.',
      'Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }.',
      'Extract props: type ButtonProps = ComponentProps<typeof Button>.',
      'DeepPartial recursive alias for nested patches.',
      'Document invariants aliases cannot enforce alone.',
    ],
    `type UserId = string & { readonly __brand: 'UserId' };
function userId(raw: string): UserId { return raw as UserId; }
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; error: string };
// type UserId = string & { readonly __brand: 'UserId' }; narrows allowed values`,
    'Branded UserId and discriminated LoadState',
    'Branded types without runtime validation — still just strings at runtime.',
    [
      'Unique symbol brands survive structural typing.',
      'Discriminated unions need shared literal field.',
      'Alias expansion in errors can be verbose — keep names short.',
    ],
  ),

  'b2-unions': e(
    'Union types A | B mean a value is one of several types. Narrowing discriminates which branch applies. Unions model optional outcomes, polymorphic inputs, and state machines.',
    'Real-world values rarely stay one shape — unions express alternatives honestly.',
    'A drawer labeled "fork OR spoon" — not both at once.',
    [
      'Define union of interfaces with shared discriminant.',
      'Use in operator and typeof to narrow.',
      'Optional T | undefined is implicit with ?.',
      'Distribute conditional types over unions.',
      'Avoid overly wide unions — refactor with generics.',
    ],
    `type Input = string | number;
function double(x: Input): number {
  if (typeof x === 'string') return x.length * 2;
  return x * 2;
}
console.log(double('ab'), double(3));
const __typed: Input = {} as Input;
// type Input = string | number; narrows allowed values`,
    'Union Input narrowed by typeof',
    'Union so wide autocomplete useless — split functions or use generics.',
    [
      'Union assignability: value must fit at least one member.',
      'Excess property checks weaken on union-typed targets.',
      'Normalizable unions simplify overlap in compiler.',
    ],
  ),

  'b2-intersections': e(
    'Intersection A & B combines all members — value must satisfy both. Used to mix interfaces, add fields to types, and compose Mixins. Conflicting property types intersect to never on incompatible primitives.',
    'Mix traits without inheritance — intersection is compile-time mixin.',
    'Overlay two transparencies — see all lines from both.',
    [
      'type Employee = Person & HasId & Timestamps;',
      'Mixin functions return intersections.',
      'With unions: (A | B) & C distributes in some patterns — careful.',
      'Use for extending third-party types locally.',
      'Prefer extends interface when naming matters.',
    ],
    `type Named = { name: string };
type Dated = { createdAt: Date };
type NamedDated = Named & Dated;
const row: NamedDated = { name: 'Ada', createdAt: new Date() };
console.log(row.name, row.createdAt.getFullYear());
const __typed: Named = {} as Named;
console.log("export type { Named }");
// type Named = { name: string }; narrows allowed values`,
    'Intersection merges Named and Dated fields',
    'Intersecting incompatible same-named props: string & number → never.',
    [
      'Intersection reduces unions on properties when compatible.',
      'Type guards do not split intersections automatically.',
      'Mapped types over intersections need distributive care.',
    ],
  ),

  'b2-union-patterns': e(
    'Production union patterns: discriminated unions for state, Result types for errors, optional chaining on partial unions, and filtering with type predicates. Remote data (idle/loading/success/error) is a canonical example.',
    'Senior front-end interviews expect clean union modeling for UI state and API data.',
    'State machine on types — each state is a distinct shape.',
    [
      'Shared discriminant field: status or type.',
      'Exhaustive switch with assertNever default.',
      'Filter arrays: items.filter(isSuccess) narrows.',
      'Avoid optional everything — prefer union of states.',
      'Map union to UI with Record<Status, Renderer> + satisfies.',
    ],
    `type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
function view<T>(r: RemoteData<T>): string {
  switch (r.status) {
    case 'idle': return 'Start';
    case 'loading': return 'Loading…';
    case 'success': return String(r.data);
    case 'error': return r.error;
  }`,
    'RemoteData discriminated union with exhaustive switch',
    'Optional fields for every state — allows impossible { loading: true, data: T } combos.',
    [
      'Discriminant must be literal type or union of literals.',
      'Control flow narrows union in each case block.',
      'Tagged unions enable algebraic data type style.',
    ],
  ),

  'b2-literal-types': e(
    'Literal types pin exact values: "GET", 200, true. They combine into unions for finite sets. as const and const assertions preserve literals instead of widening to string/number.',
    'Precise literals power discriminated unions and API method typing.',
    'Specific house numbers, not "any address on street".',
    [
      'Method unions: type Method = "GET" | "POST".',
      'const config = { mode: "strict" } as const.',
      'Template literals build string literal unions.',
      'Compare with enum for runtime needs.',
      'Use in generic constraints: T extends "asc" | "desc".',
    ],
    `type Direction = 'north' | 'south' | 'east' | 'west';
function move(d: Direction, steps: number) {
  console.log(\`Moving \${d} \${steps}\`);
}
move('north', 3);
const __typed: Direction = {} as Direction;
console.log("export type { Direction }");
// type Direction = 'north' | 'south' | 'east' | 'west'; narrows allowed values`,
    'Direction union of string literals',
    'Literal widening on let variables — use const or as const.',
    [
      'Boolean literals true | false same as boolean in practice.',
      'Enum members compare to literal types differently.',
      'Const context preserves literal in property inference.',
    ],
  ),

  'b2-discriminated-unions': e(
    'Discriminated unions (tagged unions) share a literal field (kind, type, status) so TS narrows other fields per branch. They replace boolean flag soup and enable exhaustiveness checks.',
    'Interview staple — models JSON events, Redux actions, and payment flows safely.',
    'Color-coded folders — tag tells which papers inside are valid.',
    [
      'Pick one discriminant name team-wide: type or kind.',
      'Each variant includes tag literal unique to branch.',
      'Switch on tag; access payload fields safely.',
      'Add assertNever in default for compile-time completeness.',
      'Serialize to JSON naturally — tag is plain field.',
    ],
    `type Payment =
  | { type: 'card'; last4: string }
  | { type: 'paypal'; email: string };
function charge(p: Payment): number {
  switch (p.type) {
    case 'card': return 100;
    case 'paypal': return 50;
  }
console.log(charge({ type: 'card', last4: '4242' }));`,
    'Payment union narrowed by type field',
    'Discriminant typed as string not literal — narrowing fails.',
    [
      'Narrowing requires relation between discriminant and member.',
      'Union of interfaces with common field works.',
      'Control flow analysis tracks per-case types.',
    ],
  ),

  'b2-exhaustiveness-assertnever': e(
    'Exhaustiveness checking ensures switch/if handles every union member. default case assigning param to never triggers error when a new variant is added. assertNever(x: never) helper centralizes runtime throw.',
    'GreatFrontEnd senior pattern — compiler guards future enum/union additions.',
    'Alarm that rings when a new branch appears but switch was not updated.',
    [
      'function assertNever(x: never): never { throw new Error(String(x)); }',
      'default: return assertNever(action);',
      'Adding union member without case → error on never assign.',
      'Use in reducers and message handlers.',
      'Pair with satisfies on handler maps.',
    ],
    `type Action = { type: 'add'; n: number } | { type: 'reset' };
function assertNever(x: never): never { throw new Error('Unhandled: ' + JSON.stringify(x)); }
function reduce(state: number, a: Action): number {
  switch (a.type) {
    case 'add': return state + a.n;
    case 'reset': return 0;
    default: return assertNever(a);
  }`,
    'assertNever catches missing Action cases at compile time',
    'Typing default param as any in assertNever call — defeats exhaustiveness.',
    [
      'never assignability fails when union member unhandled.',
      'Fall-through cases need explicit break or return.',
      'Implicit returns may leave undefined paths untested.',
    ],
  ),

  'b2-remote-data-pattern': e(
    'Remote data models async fetches as discriminated union: idle, loading, success with data, error with message. UI switches on status; impossible states (loading + data) are unrepresentable.',
    'Standard pattern in React/Redux apps — interviewers ask how you type fetch lifecycle.',
    'Traffic light for network calls — only one light on.',
    [
      'Define union with status literal field.',
      'Transition functions return next RemoteData state.',
      'Render with exhaustive switch or lookup table.',
      'Generic RemoteData<T> reuses for any entity.',
      'Combine with React Query types when possible.',
    ],
    `type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
function renderUser(r: RemoteData<{ name: string }>) {
  if (r.status === 'success') return r.data.name;
  if (r.status === 'error') return r.error;
  return r.status;
}`,
    'success branch accesses data safely',
    'Single object with isLoading + data + error booleans — allows contradictory state.',
    [
      'Tagged union prevents illegal combinations at type level.',
      'Narrowing works in nested conditionals.',
      'Can extend with pagination meta per status.',
    ],
  ),

  'b2-narrowing': e(
    'Narrowing refines a wider type to a specific one inside a branch. TS tracks typeof, instanceof, equality, in operator, and custom type guards. Control flow analysis merges narrowing across returns and throws.',
    'Type safety lives or dies on narrowing untrusted and union values.',
    'Zoom lens — wide shot becomes sharp on one subject.',
    [
      'Start with unknown or union at boundary.',
      'Apply guard in if/switch.',
      'Use early return to narrow remainder.',
      'Custom predicates: x is Dog for reusable checks.',
      'Avoid casting before you narrow.',
    ],
    `function format(value: string | string[] | null) {
  if (value === null) return 'empty';
  if (typeof value === 'string') return value.toUpperCase();
  return value.join(', ');
}
console.log(format(['a', 'b']));
console.log(format('demo'));
// TypeScript validates this file before emit`,
    'Sequential narrowing on string | string[] | null',
    'Narrowing variable mutated later — TS may not track across assignments.',
    [
      'Control flow graph analysis per block.',
      'Assignment narrowing with const locals helps.',
      'Discriminated unions narrow on one check.',
    ],
  ),

  'b2-typeof-narrowing': e(
    'typeof x === "string" | "number" | "boolean" | "bigint" | "symbol" | "undefined" | "function" | "object" narrows primitives. typeof null is "object" — handle null separately. Arrays are objects — use Array.isArray.',
    'First-line runtime check available in all JS environments.',
    'Ask JS what bucket the value is in.',
    [
      'typeof for primitives and function.',
      'Combine with !== null for object branch.',
      'Array.isArray for arrays.',
      'typeof works on union of primitives.',
      'Does not distinguish plain object vs Date — use instanceof.',
    ],
    `function pad(input: string | number, width: number): string {
  const text = typeof input === 'number' ? String(input) : input;
  return text.padStart(width, '0');
}
console.log(pad(7, 3));
console.log("void text;");
console.log(pad('demo'));
// TypeScript validates this file before emit`,
    'typeof splits string | number handling',
    'Relying on typeof for null — it returns "object"; check === null explicitly.',
    [
      'typeof on class instances returns "object".',
      'Narrowing applies in true branch of if.',
      'strictNullChecks adds undefined to typeof undefined branch.',
    ],
  ),

  'b2-instanceof-narrowing': e(
    'instanceof checks prototype chain — narrows to class instances like Date, Error, custom classes. Does not work across realms/iframes for same class. Prefer for built-ins and your own classes.',
    'Object subtypes need instanceof or in checks — typeof is insufficient.',
    'Check the birth certificate (constructor prototype).',
    [
      'if (e instanceof Error) console.log(e.message).',
      'Custom class guards in domain layer.',
      'Combine with null check before instanceof.',
      'For interfaces use in operator or custom guard.',
      'Cross-realm: duck-type with in + shape check.',
    ],
    `class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
function message(err: unknown): string {
  if (err instanceof ApiError) return \`[\${err.status}] \${err.message}\`;
  if (err instanceof Error) return err.message;
  return String(err);
const sample: unknown = 'text';
console.log(message('demo'));`,
    'instanceof narrows to ApiError fields',
    'instanceof on plain objects from JSON — false; use structural guard.',
    [
      'instanceof uses Symbol.hasInstance if defined.',
      'Structural types have no runtime class — guards needed.',
      'Narrowing persists in else-if chain.',
    ],
  ),

  'b2-in-operator': e(
    '"key" in obj narrows object unions when variants differ by property presence. Works at runtime on objects; TS uses it for discriminating structural variants without a tag field.',
    'Duck typing with compile-time follow-through — common in API payloads.',
    'Check if drawer has label before opening.',
    [
      'if ("email" in contact) use contact.email.',
      'Narrow union of types with different keys.',
      'obj must be object — guard null first.',
      'Combine with typeof obj === "object".',
      'Prefer discriminant field when designing new unions.',
    ],
    `type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(pet: Cat | Dog) {
  if ('meow' in pet) pet.meow();
  else pet.bark();
}
console.log("export type { Cat }");
// type Cat = { meow: () => void }; narrows allowed values`,
    'in operator picks Cat vs Dog branch',
    'in checks property anywhere in chain — inherited props can confuse.',
    [
      'Narrowing requires identifiable property difference.',
      'in on arrays checks index as property.',
      'User-defined type guards often clearer for APIs.',
    ],
  ),

  'b2-custom-type-guards': e(
    'Type predicate functions return arg is Type — TS narrows in true branches when called. Encapsulate validation logic reusable across modules. isUser(x: unknown): x is User pattern.',
    'Bridges runtime validation (Zod, io-ts) and static types without repeated casts.',
    'Bouncer with a stamp — stamped guests get VIP type inside club.',
    [
      'Return boolean with is Type suffix in return type.',
      'Validate thoroughly inside — TS trusts your predicate.',
      'Use Array.filter with guard: filter(isUser) → User[].',
      'Combine multiple guards for union narrowing.',
      'Document assumptions when guard is optimistic.',
    ],
    `type Fish = { swim: () => void };
type Bird = { fly: () => void };
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
function move(pet: Fish | Bird) {
  if (isFish(pet)) pet.swim();
  else pet.fly();`,
    'pet is Fish predicate narrows union',
    'Lying guard — returns true without validation causes runtime crashes TS thought impossible.',
    [
      'Type predicates affect call expression narrowing only.',
      'Assertion functions (asserts x is T) throw instead of boolean.',
      'Control flow applies per closure capture rules.',
    ],
  ),

  'b2-typed-functions': e(
    'Functions get types on parameters and returns: (a: number, b: number) => number. Optional params, defaults, and rest (...args: string[]) are typed. Overloads declare multiple call signatures; implementation signature is broader.',
    'Functions are the primary abstraction — typing them locks API contracts.',
    'Typed inputs and output on a vending machine slot.',
    [
      'Arrow and function declarations share typing rules.',
      'Optional ? and default values adjust type to include undefined until default applies.',
      'Rest params typed as tuple or array.',
      'Generic functions: function id<T>(x: T): T.',
      'void return for side-effect callbacks.',
    ],
    `type Compare = (a: number, b: number) => number;
const cmp: Compare = (a, b) => a - b;
function greet(name: string, excited = false): string {
  return excited ? \`\${name}!\` : name;
}
console.log(cmp(1, 2), greet('Ada', true));
const __typed: Compare = {} as Compare;
// type Compare = (a: number, b: number) => number; narrows allowed values`,
    'Compare type alias for function shape',
    'Typing rest as optional individual params — use ...args: T[].',
    [
      'Contextual typing infers param types in callbacks.',
      'strictFunctionTypes affects parameter bivariance.',
      'Generator functions typed with Generator yield types.',
    ],
  ),

  'b2-function-overloading': e(
    'Overload signatures list allowed call shapes; one implementation handles all. TS checks calls against overloads, not implementation body types. Common for functions that return different types based on input.',
    'JavaScript has one function object — overloads are compile-time sugar for callers.',
    'Multiple door labels, one room inside that accepts union input.',
    [
      'declare overloads above implementation.',
      'Implementation signature must be compatible with all overloads.',
      'Prefer unions + generics when overload count explodes.',
      'Use for DOM-like APIs: get(id: string): User; get(): User[].',
      'Implementation often uses any or union internally — keep narrow externally.',
    ],
    `function len(x: string): number;
  return x.length;
}
console.log(len('abc'), len([1, 2, 3]));
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json`,
    'Two overloads; implementation uses union',
    'Only typing implementation — callers lose overload discrimination.',
    [
      'Overload resolution picks first matching overload.',
      'Construct signatures overload new similarly.',
      'Class method overloads follow same rules.',
    ],
  ),

  'b2-optional-rest-parameters': e(
    'Optional parameters use ? or defaults; rest collects remaining args as typed array. Tuple rest types fix minimum arity: (head: string, ...tail: number[]).',
    'Variadic APIs (format strings, log helpers) need precise rest typing.',
    'Required front of line, typed queue for the rest.',
    [
      'function log(level: string, ...msgs: string[]).',
      'Optional before rest: (a?: number, ...rest: string[]) — rare, avoid confusion.',
      'Tuple rest for fixed prefix: [string, number, ...boolean[]].',
      'Spread call typed with Parameters and rest.',
      'Defaults make param optional in type until applied.',
    ],
    `function format(template: string, ...values: (string | number)[]): string {
  return values.reduce<string>((acc, v, i) => acc.replace(\`{\${i}}\`, String(v)), template);
}
console.log(format('{0} + {1}', 2, 3));
console.log(format('Hello {0}', 'TS'));
const parts: (string | number)[] = [1, 'two', 3];
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'Rest values typed as (string | number)[]',
    'Required param after optional — use default or union instead.',
    [
      'Rest must be last parameter.',
      'Rest infers tuple when arguments are literal tuple.',
      'Function.apply needs tuple typing for strict calls.',
    ],
  ),

  'b2-arrow-functions-ts': e(
    'Arrow functions share function typing; they lack own this, arguments, and prototype. Typing: const f = (x: number): number => x * 2. Useful for callbacks where lexical this matters in TS+React.',
    'Callbacks dominate modern TS — arrows are default for inline handlers.',
    'Short typed lambda without its own this binding.',
    [
      'Explicit return type on long arrow bodies.',
      'Generic arrows: const map = <T, U>(arr: T[], fn: (t: T) => U): U[] => ...',
      'Void return for event handlers returning ignored value.',
      'Avoid typing this param on arrows — lexical this only.',
      'Assign to typed Function alias when exporting.',
    ],
    `type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[];
const map: Mapper = (items, fn) => items.map(fn);
console.log(map([1, 2], (n) => String(n)));
const __typed: Mapper = {} as Mapper;
console.log("void __typed;");
console.log("export type { Mapper }");
// type Mapper = <T, U>(items: T[], fn: (item: T) => U) => U[]; narrows allowed values
// Mapper is available to importers as a type alias`,
    'Generic arrow function via Mapper alias',
    'Returning explicit object literal from arrow — wrap in () or add return type to avoid parsing as block.',
    [
      'Arrow functions not hoisted — const must be declared before use.',
      'strictBindCallApply types call/apply on functions.',
      'Implied this in TS checked for class field arrows.',
    ],
  ),

  'b2-function-variance': e(
    'Variance describes subtyping of function types: parameters are contravariant (wider param ok in assignability under strictFunctionTypes), returns covariant (narrower return ok). Bivariant methods in classes are legacy exception.',
    'Interview depth — explains why callback assignability errors appear under strict.',
    'Inputs widen acceptance; outputs narrow promises.',
    [
      'Enable strictFunctionTypes in strict bundle.',
      'Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely.',
      'Return type can be subtype of expected return.',
      'Use generic callbacks to preserve param type.',
      'Method syntax in interfaces bivariant historically — prefer property function type.',
    ],
    `type Handler = (value: string | number) => void;
const onlyString: (value: string) => void = (s) => console.log(s.toUpperCase());
const handler: Handler = onlyString; // OK: param accepts wider domain
console.log(typeof handler);
const __typed: Handler = {} as Handler;
console.log("void __typed;");
console.log("export type { Handler }");
const onlyString: (value: string) => void = (s) => // Also inspect(s.toUpperCase());
// type Handler = (value: string | number) => void; narrows allowed values`,
    'Narrower param function assignable to wider Handler target',
    'Disabling strictFunctionTypes hides unsound callback assignments.',
    [
      'Variance rules prevent unsound param narrowing.',
      'Conditional types encode variance in libraries.',
      'TypeScript 4.7+ improved method variance options.',
    ],
  ),

  'b2-type-assertions': e(
    'Type assertions x as Type tell the compiler to treat x as Type — no runtime check. Angle-bracket syntax <Type>x exists but avoid in TSX. Use when you know more than TS after narrowing insufficient.',
    'Escape hatch for DOM, legacy APIs, and migration — not a substitute for validation.',
    'Sticky note "trust me" on a package — compiler stops questioning.',
    [
      'Prefer narrowing and guards over as.',
      'as const asserts literal readonly.',
      'Double assertion via unknown for unrelated types — code smell.',
      'Non-null assertion ! for definite assignment.',
      'satisfies validates without widening.',
    ],
    `const el = document.getElementById('root') as HTMLElement;
const data = JSON.parse('{"id":1}') as { id: number };
console.log(el.tagName, data.id);
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json
// Hover types in your editor to inspect inference`,
    'as HTMLElement after getElementById',
    'Asserting without validation — runtime shape mismatch still crashes.',
    [
      'Assertions are erased — zero runtime effect.',
      'Type predicates safer than blind as.',
      'as const is special assertion preserving literals.',
    ],
  ),

  'b2-as-const-assertion': e(
    'as const on literals makes them readonly and narrows to literal types. On arrays, produces readonly tuple. Enables typeof-derived unions without manual annotation.',
    'Key to satisfies variant maps and string union inference from objects.',
    'Freeze values at type level to exact literals.',
    [
      'const modes = ["light", "dark"] as const;',
      'Nested objects become deeply readonly literals.',
      'Spread from as const may widen — reapply if needed.',
      'Combine with satisfies for shape + literals.',
      'Use in config objects consumed by mapped types.',
    ],
    `const HTTP = { OK: 200, NotFound: 404 } as const;
type HttpCode = (typeof HTTP)[keyof typeof HTTP];
function isOk(code: HttpCode): boolean { return code === HTTP.OK; }
console.log(isOk(200));
const __typed: HttpCode = {} as HttpCode;
console.log("void __typed;");
console.log("export type { HttpCode }");
// type HttpCode = (typeof HTTP)[keyof typeof HTTP]; narrows allowed values`,
    'HTTP codes as const → HttpCode union',
    'Mutating as const object — compile error on push/assign.',
    [
      'Const assertion context in property inference.',
      'Template literal types read as const keys.',
      'Without as const, numbers widen to number.',
    ],
  ),

  'b2-non-null-assertion': e(
    'Postfix ! asserts value is not null or undefined: user!.name. Compiler trusts you; runtime still throws if wrong. Use sparingly after checks TS cannot see or invariants (Map.get after has).',
    'Pragmatic escape when control flow proof exceeds compiler patience.',
    'Remove optional sticker — you guarantee presence.',
    [
      'Prefer if (user) narrow over user!.',
      'document.getElementById(...)! after test in same block — still risky.',
      'Definite assignment assertion on fields: id!: string.',
      'eslint no-non-null-assertion warns abuse.',
      'Refactor optional chain ?. instead when possible.',
    ],
    `const map = new Map<string, number>([['a', 1]]);
function get(key: string): number {
  if (!map.has(key)) throw new Error('missing');
  return map.get(key)!;
}
console.log(get('a'));
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time`,
    'map.get returns number | undefined; ! after has check',
    'Sprinkling ! to silence strictNullChecks — hides real bugs.',
    [
      'Non-null assertion does not emit runtime check.',
      'Different from definite assignment assertion on declarations.',
      'Optional chaining preferred for deep access.',
    ],
  ),

  'b2-classes-ts': e(
    'TS classes add type annotations to fields, constructor params, and methods. They emit JS classes (or ES5 constructors when downleveled). Access modifiers public/private/protected and readonly apply. Classes support implements and extends with typed super calls.',
    'OOP domains (models, services) and React class components (legacy) use typed classes.',
    'Blueprint + factory with typed slots for parts.',
    [
      'class User { constructor(public name: string) {} }',
      'Implement interfaces for contracts.',
      'Abstract classes for shared base logic.',
      'Method overrides need compatible signatures.',
      'Prefer functions + objects when inheritance shallow.',
    ],
    `class Counter {
  private value = 0;
  increment(by = 1): number {
    this.value += by;
    return this.value;
  }
const c = new Counter();
console.log(c.increment(), c.increment(2));`,
    'Counter with private value and typed increment',
    'Public interface fields without declare — TS 4.3+ differs from JS field init timing.',
    [
      'Class types include instance and constructor sides.',
      'Parameter properties emit constructor assignments.',
      'Private fields # are JS native; TS private is compile-time only.',
    ],
  ),

  'b2-class-inheritance': e(
    'extends creates subclass inheriting typed members. super calls parent constructor and methods. Override methods with compatible parameter and return types (covariant returns allowed). abstract methods must be implemented.',
    'Shared behavior without duplicating types across classes.',
    'Child class inherits parent\'s typed contract and adds fields.',
    [
      'class Admin extends User { role = "admin" as const; }',
      'super() required before this in derived constructor.',
      'Override with override keyword (TS 4.3+) for clarity.',
      'protected members visible in subclasses only.',
      'Prefer composition when inheritance depth grows.',
    ],
    `class Animal { constructor(public name: string) {} speak(): string { return '...'; } }
class Dog extends Animal {
  speak(): string { return \`\${this.name} barks\`; }
}
console.log(new Dog('Rex').speak());
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Dog overrides speak with supertype-compatible signature',
    'Forgetting super() in derived constructor — runtime ReferenceError.',
    [
      'Structural checking on override signatures.',
      'Mixins intersect types for multiple pseudo-bases.',
      'Instanceof narrows to class type.',
    ],
  ),

  'b2-super-constructor': e(
    'Derived class constructors must call super() before accessing this when extending a class with constructor. super(...args) forwards typed arguments to base. TS checks argument types against base constructor.',
    'JS runtime rule with compile-time arity/type checking on forwarded args.',
    'Must phone parent before rearranging child room (this).',
    [
      'constructor(name: string) { super(name); ... }',
      'Pass typed config objects to super.',
      'If base has no constructor, implicit super() inserted.',
      'Abstract base may require specific super args.',
      'Mixins may use generic super constraints.',
    ],
    `class Base {
  constructor(public id: string) {}
}
class Derived extends Base {
  constructor(id: string, public tag: string) {
    super(id);
    this.tag = tag;
console.log(new Derived('1', 'x').id);`,
    'Derived forwards id to super before using this',
    'Using this before super() — TS error and runtime throw.',
    [
      'super property access in methods typed from base.',
      'Constructor overloads in base affect super calls.',
      'Downlevel emit wraps class inheritance helpers.',
    ],
  ),

  'b2-public-private-protected': e(
    'Access modifiers control visibility: public (default), private (class body only), protected (class + subclasses). They are compile-time only in TS — erased in emit unless using native private # fields.',
    'Encapsulation documents intent and prevents cross-module access mistakes.',
    'Door locks on class rooms — private vs protected guest list.',
    [
      'private fields not accessible outside class in TS checker.',
      'protected for template method pattern hooks.',
      'Parameter properties: constructor(private repo: Repo).',
      'Use #field for runtime private when needed.',
      'Interface members implicitly public.',
    ],
    `class Account {
  public readonly id: string;
  protected balance = 0;
  private pin: string;
  constructor(id: string, pin: string) { this.id = id; this.pin = pin; }
  deposit(amount: number) { this.balance += amount; }
}
const a = new Account('1', '0000');
console.log(a.id, a.deposit(10));`,
    'public id; protected balance; private pin',
    'Thinking private survives at runtime in TS — plain JS can still access unless # used.',
    [
      'Private modifier is structural only in emitted JS.',
      'Protected accessible in subclass methods only.',
      'ECMAScript private # interoperates with TS 4.3+.',
    ],
  ),

  'b2-readonly-class-members': e(
    'readonly on class properties allows assignment only in constructor or field initializer. Readonly methods are not a thing — use readonly on fields. Immutable identifiers and references use readonly.',
    'Prevents accidental reassignment of id, createdAt, config on instances.',
    'Field welded at construction time.',
    [
      'readonly id: string in constructor param property.',
      'Readonly reference still allows mutating nested object.',
      'Getter can expose readonly view of internal array.',
      'Readonly<T> utility for plain types.',
      'Combine with as const for static class configs.',
    ],
    `class Session {
  readonly token: string;
  readonly createdAt = new Date();
  constructor(token: string) { this.token = token; }
}
const s = new Session('abc');
console.log(s.token, s.createdAt instanceof Date);
// TypeScript validates this file before emit`,
    'Session token set once in constructor',
    'Readonly on array field — can still push unless typed readonly array.',
    [
      'Readonly checked at assign sites not method mutation.',
      'Parameter property readonly emits Object.defineProperty in some targets.',
      'Definite assignment for readonly without initializer needs constructor assign.',
    ],
  ),

  'b2-parameter-properties': e(
    'Constructor parameter properties combine declaration and assignment: constructor(public name: string, private age: number) creates and assigns this.name and this.age. Reduces boilerplate in data classes.',
    'Common pattern in Angular/Nest services and simple models.',
    'Declare + assign in one constructor parameter line.',
    [
      'Modifiers public/private/protected/readonly on params.',
      'Emits assignment statements in constructor body.',
      'Order matters — use before this access.',
      'Not allowed in implementation if interface separates contract.',
      'Prefer plain fields when readability beats brevity.',
    ],
    `class Point {
  constructor(public x: number, public y: number, public readonly label = 'pt') {}
  distance() { return Math.hypot(this.x, this.y); }
}
console.log(new Point(3, 4).distance());
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Parameter properties create x, y, label on instance',
    'Adding parameter property without modifier — just a param, not a field.',
    [
      'Emit identical to manual this.x = x assignments.',
      'Decorators on parameter properties supported with experimental flag.',
      'Interface cannot declare parameter properties.',
    ],
  ),

  'b2-abstract-classes': e(
    'abstract class cannot be instantiated directly; may include abstract methods without implementation and concrete shared methods. Subclasses must implement abstract members. Used for base templates with partial behavior.',
    'Share implementation while forcing subclass-specific pieces.',
    'Half-built mold — concrete classes finish the shape.',
    [
      'abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: Entity): Promise<void> { ... } }',
      'Cannot new AbstractClass().',
      'Abstract methods omit body with semicolon.',
      'Mix with implements for interface compliance.',
      'Prefer interfaces + functions when no shared code.',
    ],
    `abstract class Shape {
  abstract area(): number;
  describe(): string { return \`area=\${this.area()}\`; }
}
class Square extends Shape {
  constructor(private side: number) { super(); }
  area() { return this.side ** 2; }
console.log(new Square(2).describe());`,
    'Square implements abstract area(); inherits describe',
    'Abstract class with only abstract members — consider interface instead.',
    [
      'Abstract members exist only in type space until implemented.',
      'Classes can extend one abstract/concrete class.',
      'Abstract construct signatures on interfaces for factory patterns.',
    ],
  ),

  'b2-implements-vs-extends': e(
    'extends inherits implementation from a class (single inheritance). implements satisfies an interface contract without inheriting code — class must define required members. A class can extends one class and implements multiple interfaces.',
    'Separate code reuse (extends) from shape compliance (implements).',
    'extends copies family recipes; implements passes health inspection checklist.',
    [
      'class JsonUser implements Serializable { serialize() { ... } }',
      'extends Base implements Auditable, Loggable.',
      'Interface cannot extend class; class extends class.',
      'implements errors if members missing or wrong type.',
      'Prefer implements at boundaries for test doubles.',
    ],
    `interface Drivable { drive(): void }
class Car implements Drivable {
  drive() { console.log('vroom'); }
}
class Truck extends Car {
  drive() { console.log('heavy vroom'); }
  drive() { // Also inspect('vroom'); }
// TypeScript validates this file before emit`,
    'Car implements Drivable; Truck extends Car',
    'implements without public members — TS requires explicit visibility match.',
    [
      'implements checked structurally member-by-member.',
      'extends brings prototype chain at runtime.',
      'Declaration merging not applicable to classes.',
    ],
  ),

  'b2-method-overriding': e(
    'Subclass methods override base methods with compatible signatures. override keyword (noImplicitOverride) catches typos. Return types may be subtypes (covariant). super.method() calls base implementation.',
    'Polymorphism with type safety — wrong override signatures fail at compile time.',
    'Replace parent method while keeping phone line to super.',
    [
      'override render(): JSX.Element in React class components.',
      'Enable noImplicitOverride in tsconfig.',
      'Widen params or narrow returns breaks assignability.',
      'Abstract override in further subclasses.',
      'Prefer composition hooks over deep override chains.',
    ],
    `class Logger { log(msg: string): void { console.log(msg); } }
class TimestampLogger extends Logger {
  override log(msg: string): void { super.log(\`[\${Date.now()}] \${msg}\`); }
}
new TimestampLogger().log('hi');
console.log("new TimestampLogger().lo");
class Logger { log(msg: string): void { // Also inspect(msg); } }
// TypeScript validates this file before emit`,
    'override log wraps super.log with timestamp',
    'Misspelled method name without override — silent new method, not override.',
    [
      'override modifier checked against base existence.',
      'Instance methods bivariant in strictness settings historically.',
      'Virtual override pattern typed via abstract base.',
    ],
  ),

  'b2-singleton-pattern': e(
    'Singleton ensures one instance — private constructor + static getInstance. TS types the instance and hides constructor with private. Thread safety is runtime concern; typing ensures single typed access point.',
    'Config managers and connection pools often expose getInstance(): Singleton.',
    'One key fits one locked room — static holder typed.',
    [
      'private constructor prevents new outside.',
      'static getInstance(): Singleton lazy-init.',
      'Return type explicit for consumers.',
      'Consider module-scope const instead in ES modules.',
      'Test doubles may need reset hook — document if added.',
    ],
    `class Config {
  private static instance: Config | undefined;
  private constructor(public readonly env: string) {}
  static getInstance(): Config {
    if (!Config.instance) Config.instance = new Config('prod');
    return Config.instance;
  }
console.log(Config.getInstance().env);`,
    'private ctor + getInstance typed Config',
    'Singleton global state hurts tests — module pattern or DI often cleaner.',
    [
      'Static private field holds instance reference.',
      'Constructor privacy is compile-time in TS.',
      'ES module singleton is natural single evaluation.',
    ],
  ),

  'b2-generics': e(
    'Generics parameterize types: function identity<T>(x: T): T. Enable reusable containers, APIs, and utilities preserving type information. Constraints bound T: T extends HasId.',
    'Generics avoid any while staying flexible — core of typed libraries.',
    'Adjustable mold — pour concrete type, get matching shape out.',
    [
      'Start simple: Array<T>, Promise<T>.',
      'Multiple params: Map<K, V>.',
      'Constraints with extends on type param.',
      'Inference picks T at call site usually.',
      'Default type params for ergonomics.',
    ],
    `function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2, 3]);
const s = first(['a', 'b']);
console.log(n, s);
console.log(first('demo'));
// TypeScript validates this file before emit`,
    'first infers T as number or string per call',
    'Over-constraining T loses inference — annotate at call: first<number>(...).',
    [
      'Generic instantiation creates specialized type nodes.',
      'Variance on generic params affects assignability.',
      'Generic arrow functions need trailing comma in TSX: <T,>() =>.',
    ],
  ),

  'b2-generic-constraints': e(
    'extends on type parameter limits T: T extends keyof Obj, T extends string. Enables accessing constrained properties inside body. Multiple constraints intersect: T extends A & B.',
    'Without constraints, TS cannot know which ops are legal on T.',
    'T must fit this collar size before entering function.',
    [
      'function getProp<T, K extends keyof T>(obj: T, key: K): T[K].',
      'T extends object excludes primitives when needed.',
      'Conditional types refine constrained generics.',
      'Use default extends object for keyof patterns.',
      'Avoid overly tight constraints blocking valid callers.',
    ],
    `function merge<A extends object, B extends object>(a: A, b: B): A & B {
  return { ...a, ...b };
}
const m = merge({ id: 1 }, { name: 'Ada' });
console.log(m.id, m.name);
console.log("void m;");
console.log(merge('demo'));
// TypeScript validates this file before emit`,
    'merge requires object constraints for spread',
    'T extends any — meaningless; use unknown or object.',
    [
      'Constraint checked at instantiation.',
      'Infer extends clause in conditional types.',
      'Type param shadowing avoided by distinct names.',
    ],
  ),

  'b2-generic-classes': e(
    'Classes can be generic: class Box<T> { constructor(public value: T) {} }. Static members cannot use class type params. Generic subclasses fix or extend type params: class StringBox extends Box<string>.',
    'Containers, results, and state holders reuse one class for many types.',
    'Typed shipping box class — label says contents type.',
    [
      'class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop(): T | undefined { return this.items.pop(); } }',
      'Implement generic interfaces on generic classes.',
      'Factory methods as static with own generics.',
      'React components: function List<T>(props: { items: T[] }).',
      'Default generic params on class: Box<T = unknown>.',
    ],
    `class Result<T, E = Error> {
  constructor(public ok: boolean, public value?: T, public error?: E) {}
  static success<T>(value: T) { return new Result<T>(true, value); }
}
console.log(Result.success(42).value);
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Generic Result with static success factory',
    'Static method trying to use class T without its own type param — illegal.',
    [
      'Class generic params scoped to instance side.',
      'Emit preserves generics erasure — runtime untyped.',
      'Specialization in extends fixes type argument.',
    ],
  ),

  'b2-default-type-parameters': e(
    'Generic defaults supply fallback when type arg omitted: interface Response<T = unknown>. Call sites stay clean; advanced callers specialize. Defaults must satisfy constraints.',
    'Library ergonomics — simple cases need no type args.',
    'Preset dial when caller does not choose temperature.',
    [
      'type ApiError<TDetails = void> = { message: string; details: TDetails }.',
      'Multiple defaults left to right.',
      'Partial<T = {}> style in custom utilities.',
      'Document default meaning in public APIs.',
      'Avoid default any — use unknown.',
    ],
    `type Paginated<T, Page extends number = 1> = { items: T[]; page: Page };
const p: Paginated<string> = { items: ['a'], page: 1 };
console.log(p.items[0]);
const __typed: Paginated = {} as Paginated;
console.log("void __typed;");
// type Paginated<T, Page extends number = 1> = { items: T[]; page: Page }; narrows allowed values
// Paginated is available to importers as a type alias
// TypeScript validates this file before emit`,
    'Paginated defaults Page to literal 1',
    'Default that contradicts constraint — compiler error at declaration.',
    [
      'Inference may still pick explicit T without default.',
      'Order: required type params before defaulted ones.',
      'Conditional defaults in advanced utility types.',
    ],
  ),

  'b2-utility-types': e(
    'Built-in utility types transform shapes: Partial, Required, Pick, Omit, Record, Readonly, ReturnType, Parameters, Awaited, Exclude, Extract, NonNullable. They are implemented as mapped and conditional types in lib.d.ts.',
    'Senior TS interview — compose utilities instead of duplicating interfaces.',
    'Power tools for sculpting existing types.',
    [
      'Pick + Partial for patch payloads.',
      'ReturnType for unwrapping function returns.',
      'Record for dictionary keys.',
      'Exclude union members for filtering.',
      'Combine utilities: Partial<Pick<User, "name">>.',
    ],
    `type User = { id: string; name: string; email: string };
type UserPatch = Partial<Pick<User, 'name' | 'email'>>;
function update(id: string, patch: UserPatch) { console.log(id, patch); }
update('1', { name: 'Ada' });
const __typed: User = {} as User;
console.log("void __typed;");
console.log("export type { User }");
// type User = { id: string; name: string; email: string }; narrows allowed values`,
    'Partial<Pick<>> for optional name/email patch',
    'Manual duplicate patch type — drifts from User when fields change.',
    [
      'Utilities distribute over unions in some cases.',
      'Std lib utilities are type aliases only.',
      'Custom utilities follow same mapped/conditional patterns.',
    ],
  ),

  'b2-partial': e(
    'Partial<T> makes every property optional — useful for update DTOs and default merging. Deep partial requires custom recursive type.',
    'PATCH endpoints rarely send full entity — Partial models optional fields.',
    'Same object blueprint with every field marked optional.',
    [
      'type UpdateUser = Partial<User> for full optional update.',
      'Combine with Pick for scoped patches.',
      'Merge defaults: { ...defaults, ...partial }.',
      'Partial does not affect nested objects deeply.',
      'Required reverses Partial when needed.',
    ],
    `type Settings = { theme: 'light' | 'dark'; fontSize: number };
function applySettings(base: Settings, patch: Partial<Settings>): Settings {
  return { ...base, ...patch };
}
console.log(applySettings({ theme: 'light', fontSize: 14 }, { fontSize: 16 }));
const __typed: Settings = {} as Settings;
console.log("export type { Settings }");
// type Settings = { theme: 'light' | 'dark'; fontSize: number }; narrows allowed values`,
    'Partial Settings patch merges over base',
    'Partial<User> allows empty {} — validate at least one key if business requires.',
    [
      'Mapped type with ? on each key.',
      'Partial distributes over union T in some versions — verify.',
      'Optional does not mean nullable unless unioned.',
    ],
  ),

  'b2-required': e(
    'Required<T> removes optionality from all properties — opposite of Partial. Useful after merging defaults when you need guaranteed complete object.',
    'Turn draft/config optional fields into definite shape post-validation.',
    'Fill every blank on the form before submit.',
    [
      'Required<Partial<User>> after merge with defaults.',
      'Combine with Pick for subset completeness.',
      'Runtime validation still needed — types not enforced at runtime.',
      'Deep required needs custom type.',
      'Use after satisfies check on config object.',
    ],
    `type Draft = { title?: string; body?: string };
type Published = Required<Draft>;
function publish(d: Published) { console.log(d.title.length, d.body.length); }
publish({ title: 'Hi', body: 'Text' });
const __typed: Draft = {} as Draft;
console.log("void __typed;");
console.log("export type { Draft }");
// type Draft = { title?: string; body?: string }; narrows allowed values`,
    'Required makes title and body mandatory',
    'Required on interface with optional ? may not remove undefined from union members.',
    [
      'Removes ? modifier via -? mapped type.',
      'Does not add missing properties that never existed on T.',
      'Works on nested one level only.',
    ],
  ),

  'b2-pick': e(
    'Pick<T, K> selects subset of keys K from T: Pick<User, "id" | "name">. K must be keyof T. Interview pattern with Partial for API patches.',
    'Expose only safe fields to clients or forms.',
    'Photocopy selected columns from spreadsheet type.',
    [
      'Pick<User, "id"> for public profile.',
      'Partial<Pick<User, "name">> for patch.',
      'Combine with Record for keyed projections.',
      'Generic Pick helper: Pick<T, Keys extends keyof T>.',
      'Prefer Pick over duplicating interface.',
    ],
    `type User = { id: string; name: string; passwordHash: string };
type PublicUser = Pick<User, 'id' | 'name'>;
const u: PublicUser = { id: '1', name: 'Ada' };
console.log(u.name);
const __typed: User = {} as User;
console.log("void __typed;");
console.log("export type { User }");
// type User = { id: string; name: string; passwordHash: string }; narrows allowed values`,
    'PublicUser excludes passwordHash',
    'Pick with typo key not in keyof T — compile error (good).',
    [
      'Pick implemented as mapped type over K.',
      'Preserves optionality of picked keys.',
      'Distributes over union T in conditional contexts carefully.',
    ],
  ),

  'b2-omit': e(
    'Omit<T, K> removes keys K from T: Omit<User, "password">. Dual of Pick. Common for creating safe views and input types without internal fields.',
    'When excluded fields are few or sensitive, Omit is clearer than Pick long list.',
    'Redact columns from type export.',
    [
      'Omit<User, "id" | "createdAt"> for create input.',
      'Omit<ComponentProps, "className"> for wrapper.',
      'Combine Omit + Partial for update minus immutable keys.',
      'K extends keyof T required.',
      'Custom Omit for union keys with Exclude on keys.',
    ],
    `type User = { id: string; name: string; internalNote: string };
type CreateUser = Omit<User, 'id' | 'internalNote'>;
const input: CreateUser = { name: 'Ada' };
console.log(input.name);
const __typed: User = {} as User;
console.log("void __typed;");
console.log("export type { User }");
// type User = { id: string; name: string; internalNote: string }; narrows allowed values`,
    'CreateUser omits id and internalNote',
    'Omit does not prevent extra runtime properties from API — validate separately.',
    [
      'Omit = Pick all keys except excluded.',
      'Works with index signatures cautiously.',
      'Template for Omit<T, keyof Other> diff types.',
    ],
  ),

  'b2-record-utility': e(
    'Record<K, V> maps keys K to values V: Record<Status, string> for lookup tables. K extends string | number | symbol. Safer than index signature when keys are finite union.',
    'Variant maps and dictionaries with known key unions use Record.',
    'Spreadsheet with fixed row headers → value type.',
    [
      'Record<Route, ComponentType> for router map.',
      'Record<string, unknown> for JSON object.',
      'satisfies Record<Status, Handler> validates completeness.',
      'Prefer Record over enum-keyed object when using unions.',
      'Partial<Record<K,V>> for sparse maps.',
    ],
    `type Status = 'idle' | 'loading' | 'error';
const LABELS: Record<Status, string> = {
  idle: 'Ready',
  loading: 'Loading…',
  error: 'Failed',
};
console.log(LABELS.loading);
// type Status = 'idle' | 'loading' | 'error'; narrows allowed values`,
    'Record requires every Status key present',
    'Record<Status, string> missing one key — error; good for exhaustiveness.',
    [
      'Record keys must be assignable to K constraint.',
      'Homogeneous value type unlike arbitrary index signature.',
      'Mapped type { [P in K]: V } equivalent.',
    ],
  ),

  'b2-readonly-utility': e(
    'Readonly<T> makes all properties readonly at top level. ReadonlyArray prevents mutating methods. Deep readonly needs recursive utility or libraries like type-fest.',
    'Immutable views of config and state snapshots.',
    'Plastic wrap on object — cannot reassign properties.',
    [
      'function render(props: Readonly<Props>).',
      'Readonly<User> for selector output.',
      'Combine with Pick for immutable id field subset.',
      'as const often sufficient for literals.',
      'DeepReadonly custom mapped recursion.',
    ],
    `type Point = { x: number; y: number };
function translate(p: Readonly<Point>, dx: number): Point {
  return { x: p.x + dx, y: p.y };
}
console.log(translate({ x: 0, y: 0 }, 5));
const __typed: Point = {} as Point;
console.log("export type { Point }");
// type Point = { x: number; y: number }; narrows allowed values`,
    'Readonly param; returns new Point',
    'Readonly shallow — nested object fields still mutable.',
    [
      'Mapped type adds readonly modifier.',
      'ReadonlyArray is separate built-in alias.',
      'Const assertions overlap for literals.',
    ],
  ),

  'b2-returntype': e(
    'ReturnType<F> extracts function return type from F when F extends (...args: any) => any. Unwraps async returns as Promise — use Awaited for inner type.',
    'Derive types from functions without duplication — refactor-safe.',
    'Ask function signature what it hands back.',
    [
      'type Data = ReturnType<typeof fetchUser>.',
      'Works on overloaded functions — last signature used.',
      'Combine Awaited<ReturnType<typeof fn>> for async.',
      'Factory pattern: ReturnType<typeof createStore>.',
      'Not for generic functions without instantiation — use infer.',
    ],
    `function makeCounter(start: number) {
  return { value: start, inc() { this.value += 1; return this.value; } };
}
type Counter = ReturnType<typeof makeCounter>;
const c: Counter = makeCounter(0);
console.log(c.inc());
const __typed: Counter = {} as Counter;
// type Counter = ReturnType<typeof makeCounter>; narrows allowed values`,
    'ReturnType derives Counter from makeCounter',
    'ReturnType on generic unbound function — may yield any or error.',
    [
      'Conditional type infer return slot.',
      'Constructor types use InstanceType instead.',
      'typeof needed for value-to-type query.',
    ],
  ),

  'b2-parameters-type': e(
    'Parameters<F> extracts tuple of parameter types from function type F. Useful for wrappers, decorators, and forwarding calls with same args.',
    'Type-safe call forwarding and higher-order functions.',
    'Copy argument list from one function to wrapper.',
    [
      'type Args = Parameters<typeof console.log>;',
      'function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>)',
      'Rest spread typed with Parameters.',
      'Constructor params: ConstructorParameters.',
      'First param: Parameters<F>[0].',
    ],
    `function logCall<A extends unknown[]>(fn: (...args: A) => void, ...args: A) {
  console.log('calling', args);
  fn(...args);
}
function greet(name: string, age: number) { console.log(name, age); }
logCall(greet, 'Ada', 30);
console.log("logCall(greet, 'Ada', 30)");
const sample: unknown = 'text';
console.log(greet('demo'));`,
    'Generic A matches Parameters of greet',
    'Parameters on overloaded fn — uses last signature implementation.',
    [
      'Tuple inference preserves optional/rest markers.',
      'Spread args assignability checked via tuple.',
      'Related: ThisParameterType for this binding.',
    ],
  ),

  'b2-awaited': e(
    'Awaited<T> unwraps Promise layers recursively — Awaited<Promise<string>> → string. TS 4.5+ std lib. Pair with ReturnType on async functions for resolved value type.',
    'AsyncReturnType interview pattern built from Awaited + ReturnType.',
    'Peel onion of Promise wrappers.',
    [
      'type User = Awaited<ReturnType<typeof fetchUser>>.',
      'Handles Promise<Promise<T>> nested.',
      'Use in conditional types for async utilities.',
      'AsyncReturn<T> alias in community snippets.',
      'infer in conditionals alternative for complex cases.',
    ],
    `async function fetchId(): Promise<number> { return 42; }
type Id = Awaited<ReturnType<typeof fetchId>>;
const check = (id: Id) => console.log(id.toFixed(0));
check(42);
const __typed: Id = {} as Id;
console.log("b2-awaited");
const check = (id: Id) => // Also inspect(id.toFixed(0));
// type Id = Awaited<ReturnType<typeof fetchId>>; narrows allowed values`,
    'Awaited unwraps Promise<number> to number',
    'Awaited on non-Promise T returns T — identity behavior.',
    [
      'Recursive conditional type in lib.',
      'Works with thenable-like in some patterns.',
      'Pair with infer R in custom AsyncReturn.',
    ],
  ),

  'b2-keyof': e(
    'keyof T produces union of property names of T: keyof User → "id" | "name" | .... On generics constrained to object, enables safe property access functions.',
    'Foundation for Pick, Omit, mapped types, and typed get/set helpers.',
    'List of legal property name strings for type T.',
    [
      'function pluck<T, K extends keyof T>(obj: T, key: K): T[K].',
      'keyof any is string | number | symbol.',
      'Mapped types iterate [P in keyof T].',
      'Filter keys with Exclude<keyof T, "id">.',
      'Template literals on keyof for rename patterns.',
    ],
    `type User = { id: string; name: string };
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
console.log(getProp({ id: '1', name: 'Ada' } as User, 'name'));
const __typed: User = {} as User;
console.log("export type { User }");
// type User = { id: string; name: string }; narrows allowed values`,
    'K extends keyof T indexes safely into T',
    'keyof on union distributes — may include keys from any member.',
    [
      'Key lookup uses actual property names including optional.',
      'Index signatures add string | number to keyof.',
      'Const objects: keyof typeof OBJ for value keys.',
    ],
  ),

  'b2-typeof': e(
    'typeof value in type position queries JS value\'s type: typeof myFunc, typeof config. Produces function type, object shape from const inference, or primitive. Not the same as typeof operator at runtime in value position.',
    'Bridge runtime values to types — DRY for constants and factory returns.',
    'Photograph a value; use photo as type blueprint.',
    [
      'const config = { api: "v1" } as const; type C = typeof config;',
      'typeof import("./module") for module shape.',
      'Combine keyof typeof for key unions.',
      'Function typeof includes call signatures.',
      'Classes: typeof Class is constructor + static side.',
    ],
    `const ROLES = { admin: 'admin', user: 'user' } as const;
type Role = (typeof ROLES)[keyof typeof ROLES];
function isRole(x: string): x is Role {
  return (Object.values(ROLES) as string[]).includes(x);
}
console.log(isRole('admin'));
const __typed: Role = {} as Role;
// type Role = (typeof ROLES)[keyof typeof ROLES]; narrows allowed values`,
    'typeof ROLES + keyof derives Role union',
    'typeof on let variable without as const — widened types, less useful.',
    [
      'Type query only in type space — erased.',
      'typeof class includes instance side confusion — use InstanceType.',
      'Import typeof for type-only module queries.',
    ],
  ),

  'b2-indexed-access': e(
    'Indexed access T[K] retrieves property type at key K: User["id"] → string. Works with unions of keys and produces union of property types. Powers generic getters.',
    'Precise return types for dynamic key access without any.',
    'Look up column type by column name in type spreadsheet.',
    [
      'T[K] when K extends keyof T.',
      'Union index User["id" | "name"] → string.',
      'Array/tuple: T[number] for element type.',
      'Nested: User["address"]["city"] with defined address type.',
      'Conditional mapped types use indexed access internally.',
    ],
    `type User = { id: string; meta: { tier: 'free' | 'pro' } };
type Tier = User['meta']['tier'];
type IdOrTier = User['id' | 'meta'];
function tierLabel(t: Tier) { return t === 'pro' ? 'Pro' : 'Free'; }
console.log(tierLabel('pro'));
const __typed: User = {} as User;
console.log("export type { User }");
// type User = { id: string; meta: { tier: 'free' | 'pro' } }; narrows allowed values`,
    'User["meta"]["tier"] extracts Tier union',
    'Indexing with key not in keyof T — error unless T has index signature.',
    [
      'Distributive indexed access on union T.',
      'Optional properties include undefined in T[K] when strict.',
      'Template key remapping uses as clause in mapped types.',
    ],
  ),

  'b2-keyof-typeof-patterns': e(
    'Combine keyof with typeof on const objects: keyof typeof ROUTES for keys, (typeof ROUTES)[keyof typeof ROUTES] for values. Standard idiom replacing enums.',
    'Interview-ready pattern for config-driven types without duplication.',
    'One source object feeds both runtime values and type unions.',
    [
      'const MAP = { a: 1, b: 2 } as const; type Key = keyof typeof MAP;',
      'Event maps: keyof typeof handlers for event names.',
      'satisfies ensures MAP complete for Record keys.',
      'Generic factories keyed by keyof typeof registry.',
      'Export const + derived types from same module.',
    ],
    `const ROUTES = { home: '/', settings: '/settings' } as const;
type RouteKey = keyof typeof ROUTES;
type RoutePath = (typeof ROUTES)[RouteKey];
function navigate(key: RouteKey) { const path: RoutePath = ROUTES[key]; console.log(path); }
navigate('home');
const __typed: RouteKey = {} as RouteKey;
console.log("export type { RouteKey }");
// type RouteKey = keyof typeof ROUTES; narrows allowed values`,
    'RouteKey and RoutePath derived from ROUTES',
    'Forgetting as const — RoutePath widens to string not literal paths.',
    [
      'typeof on value vs type alias scope.',
      'keyof distributes on union objects.',
      'Const enum alternative with better JSON story.',
    ],
  ),

  'b2-structural-typing': e(
    'TypeScript uses structural (duck) typing: types compatible if shapes match, regardless of names. Extra properties on variables OK when target type not expecting exact literal freshness.',
    'Unlike Java nominal types — { name: string } matches interface Person { name: string } without declaration.',
    'If it walks like a duck and has duck properties typed, it is assignable.',
    [
      'Assign object literal to interface with same fields.',
      'Excess property check only on fresh literals.',
      'Branded types simulate nominal typing when needed.',
      'Generics use structure not inheritance.',
      'Type guards add nominal-like discrimination at runtime.',
    ],
    `interface Named { name: string }
function greet(n: Named) { return n.name; }
const ada = { name: 'Ada', role: 'dev' };
console.log(greet(ada)); // OK — structural match
const __typed: Named = {} as Named;
console.log("const __item: Named = {} as Named");
console.log(greet('demo'));
// TypeScript validates this file before emit`,
    'Extra role allowed on ada when passing to Named',
    'Fresh literal { name: "Ada", extra: 1 } to Named — excess property error.',
    [
      'Width subtyping: target must accept all source properties.',
      'Function parameter types checked contravariantly under strict.',
      'Declaration merging adds structure to interfaces.',
    ],
  ),

  'b2-declaration-merging': e(
    'Interfaces with same name in same scope merge into one type. Used for extending globals and library types. Type aliases cannot merge.',
    'Augment Express Request or Window without forking @types.',
    'Stack transparent interface sheets with same title.',
    [
      'declare global { interface Window { myApp: App } }',
      'namespace + interface merge in legacy code.',
      'Prefer module augmentation over global when possible.',
      'Do not merge unrelated interfaces accidentally.',
      'Use export {} to make file module for global augmentation.',
    ],
    `export {};
declare global {
  interface Window {
    __APP_VERSION__?: string;
  }
function version(): string | undefined {
  return window.__APP_VERSION__;
console.log(version());`,
    'Global interface merge adds __APP_VERSION__ to Window',
    'Duplicate type alias name — error, not merge.',
    [
      'Interface merging is declaration-level only.',
      'Value + namespace merging separate feature.',
      'Module augmentation targets exportable interfaces.',
    ],
  ),

  'b2-module-augmentation': e(
    'Module augmentation adds types to existing module: declare module "express-serve-static-core" { interface Request { userId?: string } }. Enables typed plugins and middleware extensions.',
    'Third-party libs often need Request/Response fields — augmentation is the typed way.',
    'Add drawer to existing library type cabinet.',
    [
      'Import module once then declare module "name" { ... }.',
      'Augment only exported interfaces from target.',
      'Publish augmentation in @types package or local d.ts.',
      'Use namespace for value + type merge in UMD libs.',
      'Verify module path string matches resolution.',
    ],
    `import 'express';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
// middleware can set req.userId with typing
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Augment Express Request with userId',
    'Wrong module string in declare module — augmentation silently not applied.',
    [
      'Augmentation merges with original interface exports.',
      'Ambient module declaration for untyped JS.',
      'types field in package.json guides augmentation discovery.',
    ],
  ),

  'b2-index-signatures': e(
    'Index signature allows arbitrary keys: { [key: string]: number }. Keys must be compatible with index type. Mixed known properties + index signature require known props to match index value type.',
    'Dynamic dictionaries when key set unknown at compile time.',
    'Open-ended column for any string key → number value.',
    [
      '[key: string]: T for string-keyed bags.',
      'symbol index for unique keys rare.',
      'Record<Keys, V> preferred when keys are finite union.',
      'noUncheckedIndexedAccess adds undefined on read.',
      'Readonly index signature for immutable maps.',
    ],
    `type Scores = { [player: string]: number; winner?: string };
function total(scores: Scores): number {
  return Object.values(scores).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
}
console.log(total({ ada: 10, bob: 8 }));
const __typed: Scores = {} as Scores;
console.log("export type { Scores }");
// type Scores = { [player: string]: number; winner?: string }; narrows allowed values`,
    'Index signature scores[player: string]: number',
    'Known property incompatible with index value type — compile error.',
    [
      'Excess property checks stricter with index signatures.',
      'keyof includes string when string index present.',
      'Template literal keys in mapped types replace index sigs.',
    ],
  ),

  'b2-record-vs-index-signature': e(
    'Record<K, V> requires keys K known (often union). Index signature allows any string key. Record enforces exhaustiveness for union keys; index signature is open-ended.',
    'Choose Record for variant maps; index signature for dynamic JSON bags.',
    'Record = fixed menu; index signature = all-you-can-eat keys.',
    [
      'Record<Status, View> for state machine UI.',
      '{ [id: string]: User } for cache by id.',
      'Record cannot express unknown keys beyond K.',
      'Partial<Record<K,V>> for sparse finite maps.',
      'satisfies Record<K,V> validates object literal keys.',
    ],
    `type Lang = 'en' | 'fr';
const HELLO: Record<Lang, string> = { en: 'Hello', fr: 'Bonjour' };
type Cache = { [id: string]: { name: string } };
const c: Cache = { u1: { name: 'Ada' } };
console.log(HELLO.en, c.u1.name);
const __typed: Lang = {} as Lang;
console.log("export type { Lang }");
// type Lang = 'en' | 'fr'; narrows allowed values`,
    'Record for Lang union; index sig for Cache',
    'Using index signature when keys are finite — lose exhaustiveness checking.',
    [
      'Record implemented as mapped type.',
      'Index signature implies wider keyof.',
      'noUncheckedIndexedAccess affects both on read.',
    ],
  ),

  'b2-satisfies': e(
    'satisfies operator validates expression matches type without widening inferred type: const palette = { red: [255,0,0] } satisfies Record<string, readonly number[]>. Keeps literal types while checking shape.',
    'TS 4.9+ — fixes as const vs annotation tradeoff.',
    'Check against mold without losing detailed inference.',
    [
      'config satisfies ConfigType preserves literal keys.',
      'Variant map satisfies Record<Kind, Handler>.',
      'Prefer over annotation when literals must stay narrow.',
      'Combine with as const inside or outside as needed.',
      'Errors show mismatch without changing inferred type.',
    ],
    `type Route = '/' | '/about';
const ROUTES = {
  home: '/',
  about: '/about',
} as const satisfies Record<string, Route>;
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
console.log(ROUTES.home);
// type Route = '/' | '/about'; narrows allowed values`,
    'satisfies validates values are Route literals',
    'Using : Record<string, Route> annotation — widens ROUTES values to Route not literals.',
    [
      'satisfies is compile-time only — erased.',
      'Preserves union literal narrowing for keys/values.',
      'Enables autocomplete on typeof object keys.',
    ],
  ),

  'b2-as-const': e(
    'as const assertion (covered deeply in b2-as-const-assertion) freezes literals: readonly + literal types. Used in satisfies variant maps, tuple inference, and keyof typeof patterns.',
    'Central to modern TS without enums.',
    'Freeze inference to exact values.',
    [
      'const COLORS = ["red", "blue"] as const;',
      'Nested objects readonly recursively.',
      'Spread may widen — reapply const context.',
      'With satisfies for validated config literals.',
      'Source for template literal union keys.',
    ],
    `const MODES = { view: 'view', edit: 'edit' } as const;
type Mode = (typeof MODES)[keyof typeof MODES];
function setMode(m: Mode) { console.log(m); }
setMode(MODES.view);
const __typed: Mode = {} as Mode;
console.log("void __typed;");
console.log("export type { Mode }");
// type Mode = (typeof MODES)[keyof typeof MODES]; narrows allowed values`,
    'MODES as const feeds Mode union',
    'Mutating MODES.view — error due to readonly.',
    [
      'Contextual const in property assignments.',
      'Differs from Readonly<T> utility on generic T.',
      'Literal widening without as const on let.',
    ],
  ),

  'b2-variant-map-satisfies': e(
    'Variant map pattern: const HANDLERS = { add: (n) => ..., remove: (id) => ... } satisfies Record<Action["type"], Handler>. Ensures every discriminant has handler; preserves inferred function types.',
    'GreatFrontEnd senior pattern — typed reducer/event dispatch tables.',
    'Chessboard where every piece type has a typed move function.',
    [
      'Define Action discriminated union first.',
      'Map keys = action.type literals.',
      'satisfies Record<ActionType, (a: Extract<Action, {type: T}>) => void> advanced.',
      'assertNever on default in dispatcher.',
      'Autocomplete keys from satisfies check.',
    ],
    `type Action =
  | { type: 'inc'; by: number }
  | { type: 'reset' };
const handlers = {
  inc: (a: Extract<Action, { type: 'inc' }>) => a.by,
  reset: () => 0,
} satisfies { [K in Action['type']]: (a: Extract<Action, { type: K }>) => number };
console.log(handlers.inc({ type: 'inc', by: 2 }));`,
    'satisfies ensures inc and reset handlers exist',
    'Missing handler key — satisfies error at compile time (good).',
    [
      'Extract distributes over union for per-key action type.',
      'Mapped satisfies pattern scales to many variants.',
      'Runtime dispatch: handlers[action.type](action as any) — narrow carefully.',
    ],
  ),

  'b2-conditional-types': e(
    'Conditional types T extends U ? X : Y select types based on compatibility. Distributive over naked type param unions. Power Exclude, Extract, and custom utilities.',
    'Advanced interview — enables type-level logic.',
    'If-this-then-that at the type level.',
    [
      'type IsString<T> = T extends string ? true : false;',
      'Non-distributive: [T] extends [string] ? ...',
      'Nested conditionals for type branching.',
      'infer keyword in true branch extracts type.',
      'Avoid excessive depth — compiler limits.',
    ],
    `type Flatten<T> = T extends Array<infer U> ? U : T;
type A = Flatten<string[]>;  // string
type B = Flatten<number>;    // number
const demo: A = 'hello';
const also: B = 42;
console.log(demo, also);
const __typed: Flatten = {} as Flatten;
// type Flatten<T> = T extends Array<infer U> ? U : T; narrows allowed values`,
    'Flatten extracts array element via conditional + infer',
    'Distributive conditional surprises on union T — wrap in tuple to disable.',
    [
      'Conditional types deferred until T known.',
      'infer creates type variable in true branch.',
      'Used heavily in std lib utilities.',
    ],
  ),

  'b2-infer': e(
    'infer keyword in conditional types introduces type variable to capture: T extends Promise<infer R> ? R : T. Extracts return types, array elements, function params in utilities.',
    'Core of ReturnType, Parameters, Awaited implementations.',
    'Capture slot in pattern matching at type level.',
    [
      'Array element: T extends (infer U)[] ? U : never.',
      'Function return: infer R in (...args: any) => infer R.',
      'Multiple infer in same clause — order matters.',
      'infer in contravariant positions limited.',
      'Build AsyncReturn with infer Promise payload.',
    ],
    `type Element<T> = T extends readonly (infer U)[] ? U : never;
type TupleHead<T> = T extends readonly [infer H, ...unknown[]] ? H : never;
type E = Element<[string, number]>;
type H = TupleHead<[boolean, string]>;
const __typed: Element = {} as Element;
console.log("export type { E }");
// type Element<T> = T extends readonly (infer U)[] ? U : never; narrows allowed values
// Element is available to importers as a type alias`,
    'infer U from array; infer H from tuple head',
    'infer same name twice in one conditional — shadowing confusion.',
    [
      'infer only in extends true branch of conditional.',
      'Recursive conditional types use infer for unwrap.',
      'Template literal infer for string parsing patterns.',
    ],
  ),

  'b2-async-return-infer': e(
    'AsyncReturn<T> pattern: T extends (...args: any) => Promise<infer R> ? R : T extends (...args: any) => infer S ? S : never. Or Awaited<ReturnType<T>> in modern TS. Extracts resolved async value for typed hooks.',
    'Interview favorite — typing useQuery/fetch wrappers without manual generics.',
    'Peel Promise off function return automatically.',
    [
      'type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;',
      'Apply to API client methods.',
      'Generic hooks: useData<typeof fetchUser>.',
      'Handles non-async functions as identity via union.',
      'Combine with infer R in conditional for libraries pre-Awaited.',
    ],
    `async function loadUser(id: string) {
  return { id, name: 'Ada' as const };
}
type User = Awaited<ReturnType<typeof loadUser>>;
const u: User = { id: '1', name: 'Ada' };
console.log(u.name);
console.log("export type { User }");
// type User = Awaited<ReturnType<typeof loadUser>>; narrows allowed values`,
    'Awaited<ReturnType<typeof loadUser>> → User shape',
    'Forgetting Awaited — User typed as Promise<{...}>.',
    [
      'ReturnType on async fn includes Promise wrapper.',
      'infer R in Promise<infer R> equivalent extraction.',
      'Conditional distributes over union of functions carefully.',
    ],
  ),

  'b2-mapped-types': e(
    'Mapped types transform each property: { [K in keyof T]: T[K] | null }. Options: readonly, optional (?), key remapping as NewKey. Basis for Partial, Record, and custom transforms.',
    'Bulk property transformations without manual duplication.',
    'Walk every key in type and reshape it uniformly.',
    [
      'Optional all: { [K in keyof T]?: T[K] }.',
      'Rename keys with as clause (TS 4.1+).',
      'Filter keys: Pick via Extract<keyof T, Filter>.',
      'Combine with conditional on T[K] per property.',
      'Readonly map: { readonly [K in keyof T]: T[K] }.',
    ],
    `type Nullable<T> = { [K in keyof T]: T[K] | null };
type User = { id: string; name: string };
type NullableUser = Nullable<User>;
const nu: NullableUser = { id: '1', name: null };
console.log(nu.id, nu.name);
const __typed: Nullable = {} as Nullable;
console.log("export type { User }");
// type Nullable<T> = { [K in keyof T]: T[K] | null }; narrows allowed values`,
    'Mapped type adds | null to each User field',
    'Mapped type over union T distributes — sometimes wrap T in tuple to prevent.',
    [
      'Key remapping: [K in keyof T as `get${Capitalize<string & K>}`].',
      'Homomorphic mapped types preserve modifiers.',
      'Constraint on K extends keyof T required.',
    ],
  ),

  'b2-template-literal-types': e(
    'Template literal types build string types from patterns: `on${Capitalize<Event>}` for event handler names. Combine with unions — distributes over union members. Powers typed DOM/event APIs.',
    'Interview topic — template literal event handlers in React/design systems.',
    'String types assembled like template strings at type level.',
    [
      'type PropEvent<T, E> = `on${Capitalize<E & string>}`;',
      'Union of events → union of handler prop names.',
      'Intrinsic: Uppercase, Lowercase, Capitalize, Uncapitalize.',
      'Parse strings with infer in conditional types.',
      'Match CSS properties, route paths, permission strings.',
    ],
    `type Event = 'click' | 'focus';
type HandlerProp = \`on\${Capitalize<Event>}\`; // "onClick" | "onFocus"
const prop: HandlerProp = 'onClick';
console.log(prop);
const __typed: Event = {} as Event;
console.log("void __typed;");
console.log("export type { Event }");
// type Event = 'click' | 'focus'; narrows allowed values`,
    'Capitalize distributes over Event union',
    'Template with non-string union member — constrain E extends string.',
    [
      'Distributive over union in template parts.',
      'Pattern parsing via infer in conditional.',
      'Used in React 18+ aria/data attribute helpers.',
    ],
  ),

  'b2-key-remapping': e(
    'Mapped type key remapping: [K in keyof T as NewKey] transforms property names. Filter with never to omit. Enables prefix/suffix renames type-safely.',
    'Advanced mapped type feature for API field renaming utilities.',
    'Rename columns while transforming row type.',
    [
      'as `${K}Id` to suffix keys.',
      'Filter optional: as K extends optional ? never : K.',
      'Combine with conditional on K.',
      'Getters pattern: as `get${Capitalize<string & K>}`.',
      'Avoid infinite recursion in remapped keys.',
    ],
    `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type User = { name: string; age: number };
type UserGetters = Getters<User>;
const g: UserGetters = { getName: () => 'Ada', getAge: () => 30 };
console.log(g.getName());
// type Getters<T> = { narrows allowed values`,
    'Keys remapped to getName, getAge',
    'Capitalize on symbol keys — use string & K constraint.',
    [
      'Remapping in TS 4.1+ mapped types.',
      'never as NewKey omits property from result.',
      'Preserves value types while changing keys.',
    ],
  ),

  'b2-change-handlers-pattern': e(
    'Typed change handlers: for field F in form, handler type is (value: T[F]) => void. Build HandlerMap<T> = { [K in keyof T as `on${Capitalize<string & K>}Change`]: (v: T[K]) => void }. Ensures prop names match field types.',
    'Senior React/form library pattern — ties UI event props to state shape.',
    'Every form field gets correctly typed onXChange callback name.',
    [
      'Define FormState interface first.',
      'Map keys to onFieldChange handler props.',
      'Use satisfies on implementation object.',
      'Generic component props extend HandlerMap<T>.',
      'Pair with discriminated union for field-specific payloads if needed.',
    ],
    `type Form = { email: string; age: number };
type ChangeHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};
const handlers: ChangeHandlers<Form> = {
  onEmailChange: (v) => console.log(v.toLowerCase()),
  onAgeChange: (v) => console.log(v.toFixed(0)),
handlers.onEmailChange('a@b.co');`,
    'onEmailChange receives string; onAgeChange number',
    'Manual handler props — drift from Form fields when renamed.',
    [
      'Template literal distributes over keyof.',
      'Capitalize ensures React camelCase convention.',
      'Omit keys with never in remapping to skip fields.',
    ],
  ),

  'b2-type-safe-apis': e(
    'Type-safe APIs encode routes, methods, params, and bodies in types — clients cannot call wrong paths or payloads. Patterns: discriminated endpoints, generic fetch wrapper, OpenAPI-generated types, zod infer.',
    'End-to-end typing from DB to UI reduces integration bugs.',
    'Menu where each dish name maps to exact ingredients type.',
    [
      'Define ApiRoute union with method + path + body types.',
      'Client function generic over route definition.',
      'Validate at boundary; types document contract.',
      'Use satisfies on route registry.',
      'Share types via monorepo package.',
    ],
    `type Routes = {
  '/users/:id': { method: 'GET'; res: { name: string } };
  '/users': { method: 'POST'; body: { name: string }; res: { id: string } };
};
async function call<P extends keyof Routes>(
  path: P,
  opts: Routes[P] extends { body: infer B } ? { body: B } : {}
): Promise<Routes[P] extends { res: infer R } ? R : never> {
  return {} as any;
}`,
    'Routes map paths to method/body/res types',
    'Types without runtime validation — server can still send wrong JSON.',
    [
      'Conditional types extract body/res per path.',
      'Path params need template literal parsing for :id.',
      'tRPC/OpenAPI codegen automate this pattern.',
    ],
  ),

  'b2-pick-partial-patch': e(
    'API PATCH pattern: Partial<Pick<T, UpdatableKeys>> — only some fields optional and updatable. Exclude id, createdAt via Omit before Pick. Generic patch helper enforces keys subset.',
    'Interview pattern — safe partial updates without allowing id overwrite.',
    'Update form may change name/email but never id.',
    [
      'type UserPatch = Partial<Pick<User, "name" | "email">>;',
      'Validate at least one key present if required.',
      'Server merges patch onto entity.',
      'Generic Patch<T, K extends keyof T> = Partial<Pick<T, K>>.',
      'Document immutable fields in type omit list.',
    ],
    `type User = { id: string; name: string; email: string; createdAt: string };
type UserPatch = Partial<Pick<User, 'name' | 'email'>>;
function patchUser(id: string, body: UserPatch) {
  console.log(id, body);
}
patchUser('1', { name: 'Ada' });
const __typed: User = {} as User;
// type User = { id: string; name: string; email: string; createdAt: string }; narrows allowed values`,
    'UserPatch allows optional name/email only',
    'Partial<User> — allows patching id if sent maliciously.',
    [
      'Pick restricts keys; Partial makes them optional.',
      'Combine with Required<Pick<>> for mandatory patch fields.',
      'Zod .pick().partial() mirrors at runtime.',
    ],
  ),

  'b2-generic-pick-helper': e(
    'Reusable helper: type Patch<T, K extends keyof T> = Partial<Pick<T, K>>. Function update<T, K extends keyof T>(obj: T, keys: K[], patch: Patch<T, K>). Interview shows DRY patch typing.',
    'Generic Pick abstraction used across CRUD services.',
    'One generic tool for all entity patch shapes.',
    [
      'type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;',
      'Constrain K per call: patchUser(..., patch: Patch<User, "name">).',
      'Multiple keys: Patch<User, "name" | "email">.',
      'Export from shared types package.',
      'Pair with pick runtime Object.keys validation.',
    ],
    `type Patch<T, K extends keyof T> = Partial<Pick<T, K>>;
type Article = { id: string; title: string; body: string };
function updateArticle<K extends keyof Article>(patch: Patch<Article, K>) {
  console.log(patch);
}
updateArticle({ title: 'New' });
updateArticle({ body: 'Text', title: 'T' });
// type Patch<T, K extends keyof T> = Partial<Pick<T, K>>; narrows allowed values`,
    'Patch<Article, K> inferred from patch keys',
    'K inferred as union of all keys in object — sometimes want explicit K generic.',
    [
      'Partial<Pick<T,K>> standard library composition.',
      'Assignability flows through generic K.',
      'Used in ORMs and REST clients.',
    ],
  ),

  'b2-react-typescript': e(
    'React + TS types components as functions/classes returning JSX, props as interfaces, hooks with generics, and events from @types/react. Strict mode catches missing props, wrong children, and ref types.',
    'Modern front-end jobs expect typed React — props, context, reducers.',
    'Components are typed functions from props to JSX.Element.',
    [
      'function Component(props: Props): JSX.Element.',
      'React.FC optional — explicit props preferred.',
      'useState infers from initial value; annotate when null.',
      'Event types: React.ChangeEvent<HTMLInputElement>.',
      'Generic components for lists and form fields.',
    ],
    `type Props = { label: string; onClick: () => void };
export function Button({ label, onClick }: Props) {
  return <button type="button" onClick={onClick}>{label}</button>;
}
const __typed: Props = {} as Props;
console.log("export type { Props }");
// type Props = { label: string; onClick: () => void }; narrows allowed values
console.log(Button('demo'));
// Props is available to importers as a type alias`,
    'Button props typed label + onClick',
    'React.FC implicit children — explicit Props clearer.',
    [
      'JSX.IntrinsicElements for DOM attribute typing.',
      'RefObject<T | null> for useRef DOM nodes.',
      'Server Components change some prop/async patterns in Next.js.',
    ],
  ),

  'b2-react-component-props': e(
    'Component props typed as interface or type: Props with required/optional fields, children?: React.ReactNode, className?, style?. Extend HTML attributes: ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>.',
    'Props are the public API of UI components — typing drives DX.',
    'Ingredient list on component recipe card.',
    [
      'Separate required vs optional props clearly.',
      'Pick HTML attributes to extend: ComponentPropsWithoutRef<"button">.',
      'Document default props via default parameters not defaultProps.',
      'Polymorphic components with as prop need generics.',
      'Export props type for consumers.',
    ],
    `type IconProps = { name: 'check' | 'close'; size?: number };
type ButtonProps = IconProps & {
  label: string;
  onClick: () => void;
};
function IconButton({ name, size = 16, label, onClick }: ButtonProps) {
  return <button aria-label={label} onClick={onClick}>{name} {size}</button>;
}`,
    'ButtonProps intersects IconProps + label/onClick',
    'Extending entire HTMLAttributes — exposes too many props unintentionally.',
    [
      'Intersection merges prop types.',
      'Optional default via destructuring default value.',
      'children typing ReactNode | undefined.',
    ],
  ),

  'b2-mutually-exclusive-props': e(
    'Mutually exclusive props: never allow conflicting props together — use union: { a: string; b?: never } | { b: string; a?: never }. Or XOR utility. Common: controlled vs uncontrolled value props.',
    'GreatFrontEnd senior interview — prevent impossible prop combinations at compile time.',
    'Either supply value OR defaultValue, never both.',
    [
      'Union of two prop shapes with never on alternate field.',
      'type Exclusive<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });',
      'Controlled: { value: T; onChange: ...; defaultValue?: never }.',
      'Document in JSDoc which branch to use.',
      'Discriminant prop alternative: mode: "controlled" | "uncontrolled".',
    ],
    `type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never };
type Uncontrolled = { defaultValue: string; value?: never; onChange?: (v: string) => void };
type InputProps = Controlled | Uncontrolled;
function Field(props: InputProps) { return props.value ?? props.defaultValue; }
const __typed: Controlled = {} as Controlled;
console.log("export type { Controlled }");
// type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never }; narrows allowed values
console.log(Field('demo'));
// Controlled is available to importers as a type alias`,
    'InputProps union forbids value + defaultValue together',
    'Both optional — allows neither value nor defaultValue; add validation or third variant.',
    [
      'never optional props strip conflicting keys in union.',
      'TypeScript  unions not discriminated — both branches checked on access.',
      'React Hook Form vs controlled patterns use this.',
    ],
  ),

  'b2-controlled-uncontrolled-props': e(
    'Controlled components: value + onChange from parent state. Uncontrolled: defaultValue + ref or internal state. TS models exclusivity with union props. Typing onChange as (value: T) => void matches controlled pattern.',
    'React docs pattern — types should encode one mode per usage.',
    'Remote-controlled car (value) vs toy with own batteries (defaultValue).',
    [
      'Controlled: value required with onChange.',
      'Uncontrolled: defaultValue optional, value absent.',
      'Ref typing for uncontrolled input: RefObject<HTMLInputElement>.',
      'Generic Input<T> for number vs string parsers.',
      'Never both value and defaultValue in types.',
    ],
    `type ControlledNumber = {
  value: number;
  onChange: (n: number) => void;
  defaultValue?: never;
};
type UncontrolledNumber = { defaultValue?: number; value?: never };
type NumberFieldProps = ControlledNumber | UncontrolledNumber;
// type ControlledNumber = { narrows allowed values`,
    'Union separates controlled vs uncontrolled number field',
    'Casting props to any to pass both value and defaultValue — defeats pattern.',
    [
      'React warns at runtime if switching modes.',
      'Fully controlled needs onChange for every value prop update.',
      'File inputs often uncontrolled-only in React.',
    ],
  ),

  'b2-hooks-typing': e(
    'Hooks typing: useState<T>(initial), useReducer with discriminated actions, useRef<HTMLDivElement>(null), useContext with null guard, custom hooks return typed tuples/objects. Generic custom hooks preserve type params.',
    'Hooks are functions — same TS rules apply with React-specific conventions.',
    'Typed reusable stateful logic packages.',
    [
      'useState<User | null>(null) for async data.',
      'useReducer: reducer(state, action: Action) with union actions.',
      'useRef: mutable ref vs DOM ref types differ.',
      'useMemo/useCallback infer; annotate when generic needed.',
      'Custom hook: function useLocalStorage<T>(key: string, initial: T).',
    ],
    `type Action = { type: 'inc' } | { type: 'set'; n: number };
function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'inc': return state + 1;
    case 'set': return action.n;
  }
function useCounter(initial: number) {
  return useReducer(reducer, initial);`,
    'useReducer with discriminated Action union',
    'useRef() without null initial for DOM — RefObject requires null argument.',
    [
      'Rules of hooks not enforced by TS — ESLint plugin needed.',
      'ReturnType of custom hooks exported for consumers.',
      'Strict null on useContext default undefined requires guard.',
    ],
  ),

  'b2-node-typescript': e(
    'Node + TS: @types/node for process, fs, Buffer; moduleResolution node16/nodenext for ESM/CJS; ts-node/tsx for dev; compile to dist for production. Typings for __dirname differ in ESM.',
    'Backend TS mirrors frontend tooling with Node-specific types.',
    'Same TS language, Node host types instead of DOM.',
    [
      'npm i -D typescript @types/node.',
      'module: NodeNext for package.json "type": "module".',
      'Import fs/promises with typed APIs.',
      'process.env typed via augmentation or zod.',
      'Build with tsc or bundle with esbuild.',
    ],
    `import { readFile } from 'node:fs/promises';
import path from 'node:path';
async function readConfig(cwd: string): Promise<string> {
  const file = path.join(cwd, 'config.json');
  return readFile(file, 'utf8');
}
console.log(typeof readConfig);
console.log(readConfig('demo'));`,
    'Node fs/promises with typed Promise<string>',
    'Using DOM types in Node project — lib dom pollutes; set "lib" appropriately.',
    [
      'Node ESM needs .js extensions in imports per NodeNext.',
      'import.meta.url replaces __dirname in ESM.',
      'Types version should match Node LTS runtime.',
    ],
  ),

  'b2-express-typing': e(
    'Express typing via @types/express: Request, Response, NextFunction, RequestHandler. Extend Request with module augmentation for userId. Typed routers with express.Router(). Generic handler wrappers for async errors.',
    'Most common Node interview stack — typed middleware and handlers.',
    'HTTP handler signatures enforced by Request/Response types.',
    [
      'const app: Express = express();',
      'req.params.id string — validate before use.',
      'req.body unknown until validation — use zod infer type.',
      'Augment Request interface for custom fields.',
      'Async handler wrapper returns Promise<void>.',
    ],
    `import express, { type Request, type Response } from 'express';
const app = express();
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});
app.listen(3000);
console.log("app.listen(3000)");
// TypeScript validates this file before emit`,
    'Typed Express Request/Response handler',
    'Trusting req.body as User without parse — use middleware validation.',
    [
      'Express types separate from runtime express package.',
      'Router mergeParams affects req.params typing loosely.',
      'Typed HTTP clients (axios) complement server types.',
    ],
  ),

  'b2-ts-modules': e(
    'TS supports ES modules (import/export) and legacy namespaces. moduleResolution finds imports. type-only imports erased. Ambient modules declare untyped packages.',
    'Modules scope types and values — align with bundler/runtime strategy.',
    'File boundaries are package boundaries for types.',
    [
      'Use import/export per file — avoid namespace for new code.',
      'import type { T } for type-only.',
      'export type re-exports types without values.',
      'declare module "pkg" for shim untyped JS.',
      'package.json "exports" affects resolution.',
    ],
    `export type User = { id: string };
export function getUser(): User { return { id: '1' }; }
import type { User } from './types.js';
import { getUser } from './api.js';
const __typed: User = {} as User;
console.log("const __typed: User = {} as User");
console.log(getUser('demo'));
// TypeScript validates this file before emit`,
    'Separate type and value exports',
    'import { User } when User is type-only — use import type under verbatimModuleSyntax.',
    [
      'ESM/CJS interop rules in moduleResolution node16.',
      'Triple-slash reference legacy for scripts.',
      'isolatedModules requires transpile-safe imports.',
    ],
  ),

  'b2-esm-vs-cjs-ts': e(
    'ESM uses import/export; CJS uses require/module.exports. TS module: CommonJS vs ES2015/ESNext vs NodeNext. NodeNext respects package.json type field. import = require for CJS interop rare.',
    'Module format mismatch causes runtime import errors — TS config must match Node/bundler.',
    'Two plug shapes — adapter (config) must match socket (runtime).',
    [
      '"type": "module" → NodeNext + .js extensions in imports.',
      'CJS emit: "module": "CommonJS" for older Node.',
      'esModuleInterop eases default import from CJS.',
      'Bundler (Vite) prefers ESM + "module": "ESNext".',
      'Dual packages publish types for both.',
    ],
    `// package.json: { "type": "module" }
// tsconfig: "module": "NodeNext", "moduleResolution": "NodeNext"
import { createServer } from 'node:http';
export function main() { return createServer(); }
console.log(main('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json`,
    'NodeNext aligns TS with package type module',
    'Importing CJS without esModuleInterop — default import errors.',
    [
      'require is not ESM — TS errors on require in module files.',
      'Extension .ts vs .js in import paths — emit uses .js.',
      'verbatimModuleSyntax preserves import form.',
    ],
  ),

  'b2-namespaces': e(
    'Namespaces (namespace Foo { }) group types and values pre-ES modules. Can merge across files. Largely replaced by ES modules. Still seen in legacy @types and declaration merging patterns.',
    'Historical TS feature — recognize in old code; do not use in new apps.',
    'Folder drawer labeled namespace — prefer ES module files now.',
    [
      'Read namespace in DefinitelyTyped legacy defs.',
      'export namespace for value + type together historically.',
      'Prefer module + export in new projects.',
      'namespace global augmentation rare alternative.',
      'Do not mix namespace with bundler tree-shaking expectations.',
    ],
    `// Legacy pattern — prefer ES modules
export namespace Math2 {
  export const PI = 3.14;
  export function round(n: number) { return Math.round(n); }
}
console.log(Math2.round(Math2.PI));
console.log(round('demo'));
// TypeScript validates this file before emit`,
    'Namespace exports value and function together',
    'Creating new namespaces in 2024 app code — use modules instead.',
    [
      'Namespace emits IIFE object in some module settings.',
      'Can merge namespace with function (value+type).',
      'Module syntax is tree-shakeable; namespace often is not.',
    ],
  ),

  'b2-tsconfig': e(
    'tsconfig.json configures compiler: target, module, strict, paths, include, references. Extends shared configs. Defines what tsc type-checks and emits. Single source of truth for editor and CI.',
    'Without tsconfig, defaults mismatch project needs — strict flags never enabled.',
    'Project rulebook for compiler and IDE.',
    [
      'npx tsc --init then trim options.',
      'strict: true enables recommended flags bundle.',
      'include: ["src"] exclude node_modules.',
      'paths aliases for @/ imports — bundler must mirror.',
      'references for monorepo packages.',
    ],
    `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}`,
    'Minimal strict tsconfig for modern bundler app',
    'paths in tsconfig without vite/tsconfig-paths — imports fail at runtime.',
    [
      'extends inherits base config from @tsconfig packages.',
      'composite enables project references build graph.',
      'files vs include globs control program scope.',
    ],
  ),

  'b2-strict-compiler-options': e(
    'strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables. Each can be toggled but strict:true is baseline for new apps.',
    'Strict bundle catches the bugs that hurt production most.',
    'Full safety harness vs seatbelt-only subset.',
    [
      'Start strict: true on greenfield.',
      'strictNullChecks highest ROI when migrating.',
      'noImplicitAny forces typing untyped params.',
      'strictPropertyInitialization needs definite assignment or constructor init.',
      'useUnknownInCatchVariables — catch (e: unknown).',
    ],
    `// tsconfig compilerOptions excerpt
// "strict": true
// implies noImplicitAny, strictNullChecks, etc.
function parse(n: string): number {
  const v = Number(n);
  if (Number.isNaN(v)) throw new Error('NaN');
  return v;
}`,
    'strict catches missing null checks and any leaks',
    'Disabling individual strict flags to greenwash errors — fix root cause.',
    [
      'strictFunctionTypes changes handler assignability.',
      'exactOptionalPropertyTypes optional separate stricter flag.',
      'noUncheckedIndexedAccess adds undefined on index access.',
    ],
  ),

  'b2-noimplicitany': e(
    'noImplicitAny errors when TS would infer any — typically untyped parameters and implicit any variables. Part of strict. Forces annotations or inference context.',
    'any parameters silently infect return types — blocking implicit any closes the main leak.',
    'No silent any — name every unknown shape.',
    [
      'Add param types: function f(x: number).',
      'Use unknown for truly unknown JSON.',
      'Enable in tsconfig strict bundle.',
      'Legacy allowJs: use @param JSDoc in .js files.',
      'eslint no-explicit-any complements this.',
    ],
    `// Error under noImplicitAny:
// function double(x) { return x * 2; }
function double(x: number) { return x * 2; }
console.log(double(4));
console.log(double('demo'));
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Implicit any on x blocked — annotate number',
    'Adding : any to silence — defeats purpose of flag.',
    [
      'Contextual typing can save annotations on callbacks.',
      'Implies any from untyped third-party without @types.',
      'checkJs applies similar rules in JavaScript files.',
    ],
  ),

  'b2-declaration-files': e(
    '.d.ts files declare types without implementation — for JS libraries, ambient globals, and emitted types from tsc (declaration: true). Consumers get typings without source.',
    'Typed ecosystem depends on declaration files — @types/npm packages.',
    'Menu describing dishes without kitchen recipes.',
    [
      'declaration: true emits .d.ts alongside .js.',
      'declare module "lib" { export function fn(): void; }',
      'Place global.d.ts in include scope.',
      'DefinitelyTyped publishes @types/* packages.',
      'types field in package.json points to entry .d.ts.',
    ],
    `// shapes.d.ts
export type Point = { x: number; y: number };
export declare function distance(a: Point, b: Point): number;
// app.ts imports typed API from JS implementation + d.ts
console.log(distance('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json`,
    'declare function exposes JS impl type surface',
    'Writing .d.ts manually out of sync with .js — use declaration emit or tests.',
    [
      'Ambient declarations not modules until export/import.',
      'stripInternal removes @internal from emit.',
      'bundler DTS generation (vite-plugin-dts) for libraries.',
    ],
  ),

  'b2-source-maps-ts': e(
    'Source maps link emitted JS back to TS for debugging: sourceMap: true in tsconfig. Browser DevTools and Node --enable-source-maps show original TS lines in stack traces.',
    'Debug transpiled code at authoring line numbers.',
    'Treasure map from minified JS back to TS source.',
    [
      'sourceMap: true for dev; inlineSources optional.',
      'Node 18+ --enable-source-maps for stack traces.',
      'Bundlers generate combined maps for chunks.',
      'declarationMap helps jump to types in monorepos.',
      'Disable in prod or use hidden-source-map for privacy.',
    ],
    `// tsconfig: "sourceMap": true
export function fail(): never {
  throw new Error('boom');
}
// stack trace points to fail.ts line in DevTools
console.log(fail('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'sourceMap maps runtime error to TS line',
    'Shipping full source maps publicly — may expose source structure.',
    [
      'VLQ encoding in .map files.',
      'inlineSourceMap embeds in bundle — larger files.',
      'TS resolves paths via map sourcesContent optionally.',
    ],
  ),

  'b2-definitely-typed': e(
    'DefinitelyTyped (@types scope on npm) hosts community .d.ts for JavaScript libraries. Install @types/node, @types/react alongside packages. Version @types/react should align with react major.',
    'Most npm JS lacks built-in types — DT fills the gap.',
    'Crowdsourced type menus for untyped restaurants.',
    [
      'npm i -D @types/lodash @types/node.',
      'Match major versions to runtime library.',
      'types[] in tsconfig limits auto inclusion if needed.',
      'Contribute fixes via DefinitelyTyped GitHub.',
      'Prefer packages shipping own types when available.',
    ],
    `import _ from 'lodash';
// @types/lodash enables typed _.chunk
const parts = _.chunk([1, 2, 3, 4], 2);
console.log(parts);
console.log("void parts;");
// TypeScript validates this file before emit
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    '@types/lodash types chunk return',
    'Missing @types — implicit any on imports; wrong @types version — weird errors.',
    [
      'DT uses export = for CJS modules sometimes.',
      'typings field deprecated for types in package.json.',
      'skipLibCheck skips type checking of .d.ts for speed.',
    ],
  ),

  'b2-third-party-types': e(
    'Third-party types come from: bundled types field, separate @types package, local declare module shim, or wrapper typed facade. Evaluate quality before trusting any-heavy defs.',
    'Integration reality — not every lib is typed; know fallback strategies.',
    'Four ways to get a typed menu for a JS-only cafe.',
    [
      'Check package.json "types" entry first.',
      'Install matching @types/* if separate.',
      'Minimal shim: declare module "x" { const x: any; export default x; } then tighten.',
      'Wrap untyped SDK in your typed module boundary.',
      'codegen from OpenAPI/GraphQL for APIs.',
    ],
    `// shim until proper types
declare module 'legacy-widget' {
  export function mount(el: HTMLElement, opts: { id: string }): void;
}
import { mount } from 'legacy-widget';
mount(document.body, { id: 'app' });
console.log(mount('demo'));
// Strict mode catches misuse at compile time`,
    'Local declare module shim for legacy-widget',
    'Shim stays any forever — schedule proper types or zod validation.',
    [
      'moduleResolution affects which types file loads.',
      'typesVersions in package.json for TS version-specific defs.',
      'Peer dependency @types packages in library publishing.',
    ],
  ),

  'b2-eslint-typescript': e(
    '@typescript-eslint/parser feeds TS AST to ESLint; @typescript-eslint/eslint-plugin adds type-aware rules (no-floating-promises, no-misused-promises). Requires parserOptions.project pointing to tsconfig.',
    'Lint + types together catch async bugs types alone miss.',
    'Spell-checker plus grammar checker for code.',
    [
      'npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin.',
      'parserOptions: { project: true } for typed lint rules.',
      'extends plugin:@typescript-eslint/recommended-type-checked.',
      'no-explicit-any, consistent-type-imports common rules.',
      'Run eslint in CI alongside tsc --noEmit.',
    ],
    `// .eslintrc.cjs excerpt
// parser: '@typescript-eslint/parser',
// plugins: ['@typescript-eslint'],
// extends: ['plugin:@typescript-eslint/recommended']
async function load() { return 1; }
void load(); // no-floating-promises may require void or await
console.log(load('demo'));
// Strict mode catches misuse at compile time`,
    'Type-aware ESLint catches floating promises',
    'Typed lint without project — rules silently downgrade or error.',
    [
      'Type checker program shared per eslint run — slower than plain eslint.',
      'eslint-config-prettier avoids format rule conflicts.',
      'Flat config eslint 9+ uses typescript-eslint similarly.',
    ],
  ),

  'b2-vite-typescript': e(
    'Vite transpiles TS via esbuild (fast, no type check). Run tsc --noEmit separately or use vite-plugin-checker. HMR works with .tsx. resolve alias mirrors tsconfig paths.',
    'Dev speed separates transpile from typecheck — Vite pattern.',
    'Fast hot reload; tsc validates in background or CI.',
    [
      'npm create vite@latest — choose react-ts template.',
      'vite.config.ts with resolve.alias for @ paths.',
      'vue/react use .tsx; strict in tsconfig.',
      'Build: vite build; typecheck: tsc -b.',
      'Do not expect Vite to report all type errors alone.',
    ],
    `// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: { alias: { '@': '/src' } },
});
// src/main.ts — Vite serves transpiled TS fast
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead`,
    'Vite esbuild transpile + separate tsc check',
    'Assuming vite dev shows all type errors — enable checker or watch tsc.',
    [
      'esbuild strips types without full semantic check.',
      'vite/client types for import.meta.env.',
      'SSR projects add vite-node or custom tsc step.',
    ],
  ),

  'b2-migration-js-to-ts': e(
    'Migrate JS→TS incrementally: allowJs, checkJs, rename .js→.ts file by file, add types at boundaries, enable strict flags gradually. Avoid big-bang rewrite. Use @ts-check in JS for early wins.',
    'Most codebases cannot pause features for full rewrite — gradual path works.',
    'Renovate room by room while house stays open.',
    [
      'allowJs: true, checkJs: true in tsconfig.',
      'Start with utils and API clients — high leverage.',
      'Type inferred from JSDoc then convert to .ts.',
      'Enable strictNullChecks after baseline clean.',
      'Track any count trending down.',
    ],
    `// file-by-file: utils/format.js → format.ts
export function formatCurrency(n: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(n);
}
console.log(formatCurrency('demo'));
// Strict mode catches misuse at compile time
// Annotations are erased — zero runtime overhead
// Enable "strict": true in tsconfig.json`,
    'Single module migrated with typed signature',
    'Big bang enable strict on day one — thousands of errors, team stops.',
    [
      'JS files participate in type graph with allowJs.',
      'declare module for JS assets during migration.',
      'Codemods (ts-migrate) assist large repos.',
    ],
  ),

  'b2-allowjs-checkjs': e(
    'allowJs includes .js files in compilation. checkJs type-checks them using JSDoc @param @returns @type. //@ts-check at top of file enables without project flag. Bridge for mixed codebases.',
    'Type safety before renaming every file to .ts.',
    'JS files get spell-check via JSDoc annotations.',
    [
      'tsconfig allowJs + checkJs.',
      '/** @param {string} name */ in .js functions.',
      '//@ts-nocheck disables per file (escape hatch).',
      '//@ts-expect-error documents known gap.',
      'Gradually convert checked JS to TS.',
    ],
    `// @ts-check
/** @param {number} a @param {number} b @returns {number} */
function add(a, b) { return a + b; }
console.log(add(1, 2));
/** @type {(n: number) => boolean} */
const isPositive = (n) => n > 0;
console.log(isPositive(3));
console.log(add('demo'));`,
    '@ts-check + JSDoc types add in JS file',
    'Wrong JSDoc lies to checker — runtime still breaks.',
    [
      'checkJs infers from JSDoc and usage.',
      'Import TS types into JS via import() JSDoc.',
      'allowJs required for JS in composite projects.',
    ],
  ),

  'b2-decorators': e(
    'Decorators (stage 3) attach metadata/transform classes and methods: @logged class Foo {}. TS 5+ experimentalDecorators vs standard decorators differ. Common in Angular, NestJS, TypeORM. Emit depends on tsconfig decorator settings.',
    'Frameworks use decorators for DI and routing — know typing implications.',
    'Stickers on class methods changing behavior via metaprogramming.',
    [
      'Enable experimentalDecorators for legacy Angular/Nest.',
      'Standard decorators follow ECMAScript proposal in TS 5+.',
      'emitDecoratorMetadata reflects design types at runtime (Nest).',
      'Decorator factories typed: (opts: Opts) => ClassDecorator.',
      'Understand runtime cost and bundle size.',
    ],
    `function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
@sealed
class BugReport {
  constructor(public type: string) {}
console.log(new BugReport('crash').type);`,
    'Class decorator seals constructor',
    'Mixing experimental and standard decorator modes — incompatible emit.',
    [
      'Decorator context TS 5.2+ typing for standard decorators.',
      'reflect-metadata polyfill for emitDecoratorMetadata.',
      'Legacy __decorate helper emitted when downleveling.',
    ],
  ),

  'b2-mixins': e(
    'Mixins combine behaviors into one class type via functions returning intersected classes: type Result = A & B. TS models with intersection types and generic mixin factories. Alternative to multiple inheritance.',
    'Compose cross-cutting features (Serializable, Timestamped) without deep trees.',
    'Lego bricks clicked into one typed robot.',
    [
      'function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return class extends Base { ts = Date.now(); }; }',
      'Instance type: InstanceType<ReturnType<typeof Timestamped>>.',
      'Prefer composition functions over complex mixin chains.',
      'Interface merging documents mixin methods.',
      'React HOCs historically similar pattern.',
    ],
    `type Constructor = new (...args: any[]) => object;
function Activatable<T extends Constructor>(Base: T) {
  return class extends Base {
    isActive = false;
    activate() { this.isActive = true; }
  };
}
class User { constructor(public name: string) {} }
const ActiveUser = Activatable(User);
console.log(new ActiveUser('Ada').activate());`,
    'Mixin factory extends Base with activate',
    'Deep mixin stacks — inference breaks; annotate return class type.',
    [
      'Mixin pattern is runtime extends + intersection at type level.',
      'Constructor return types need careful generic bounds.',
      'Declaration merging rarely used with modern mixin generics.',
    ],
  ),

  'b2-this-types': e(
    'this types annotate polymorphic this: method(this: this, ...) in base class for fluent APIs. this parameter is compile-time only — not runtime arg. thisType in utilities extracts this type.',
    'Builder pattern and ORM query APIs need this chaining typed.',
    'Method returns this — type follows subclass.',
    [
      'interface Builder { set(x: string): this; }',
      'this type in derived class narrows to subclass.',
      'ThisParameterType<F> extracts this from function type.',
      'Avoid binding this incorrectly in callbacks.',
      'No this param on arrow functions — lexical this.',
    ],
    `class QueryBuilder {
  private parts: string[] = [];
  where(clause: string): this {
    this.parts.push(clause);
    return this;
  }
  build() { return this.parts.join(' AND '); }
class AdminQuery extends QueryBuilder {
  override where(c: string): this { return super.where(\`(\${c})\`); }
console.log(new AdminQuery().where('a=1').build());`,
    'where returns this for fluent chaining',
    'Returning Builder instead of this — subclass chain loses subtype methods.',
    [
      'Polymorphic this types (TS 1.4+) for inheritance-safe fluency.',
      'this in type position resolved at call site.',
      'strictThis checks this undefined in functions.',
    ],
  ),

  'b2-branded-types': e(
    'Branded types (opaque types) add phantom brand to prevent mixing structurally identical types: type UserId = string & { readonly __brand: unique symbol }. Zero runtime cost; prevents passing OrderId where UserId expected.',
    'Interview pattern for domain primitives — nominal typing simulation.',
    'Same-shaped IDs get different colored labels at compile time.',
    [
      'declare const brand: unique symbol;',
      'type Brand<T, B> = T & { readonly __brand: B };',
      'Constructor functions validate and return branded type.',
      'Use for currency units, emails, UUIDs.',
      'Do not brand without runtime validation at boundaries.',
    ],
    `declare const UserIdBrand: unique symbol;
type UserId = string & { readonly [UserIdBrand]: true };
function userId(raw: string): UserId {
  if (!raw) throw new Error('empty');
  return raw as UserId;
}
function load(id: UserId) { console.log(id); }
load(userId('u_1'));`,
    'UserId brand blocks plain string assignability',
    'Branding with as only — no validation; still strings at runtime.',
    [
      'Structural typing bypassed via incompatible brand intersection.',
      'unique symbol brands differ per declaration.',
      'Zod .brand() adds similar pattern with runtime parse.',
    ],
  ),

  'b2-impl-pick': e(
    'Implementation exercise: build typed pick(obj, keys) where return type Pick<T, K>. Use generic T, K extends keyof T, reduce keys into typed result object.',
    'Hands-on utility types + generics — common live coding prompt.',
    'Write runtime pick matching Pick<T,K> type.',
    [
      'function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>.',
      'Loop keys building result as Pick<T, K>.',
      'Use satisfies or typed accumulator Record<string, unknown>.',
      'Unit test preserves types at call site.',
      'Compare to lodash.pick typings.',
    ],
    `function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}
const user = { id: '1', name: 'Ada', role: 'admin' };
const pub = pick(user, ['id', 'name'] as const);
console.log(pub.name);`,
    'pick returns Pick<User, "id" | "name">',
    'Return type any on accumulator — loses Pick inference at call site.',
    [
      'keyof T constraint ensures keys exist.',
      'readonly K[] preserves tuple literal keys.',
      'Impl validates generics + indexed access understanding.',
    ],
  ),

  'b2-impl-discriminated-union': e(
    'Implementation: model API result as discriminated union and handle with exhaustive switch + assertNever. Add new variant and watch compiler force new case.',
    'Proves discriminated unions + exhaustiveness workflow.',
    'Write reducer consuming tagged union safely.',
    [
      'Define union with type/status discriminant.',
      'Switch on discriminant accessing variant fields.',
      'default: assertNever(x).',
      'Add variant — fix compile error in switch.',
      'Optional map handlers object with satisfies.',
    ],
    `type Result =
  | { ok: true; value: number }
  | { ok: false; error: string };
function assertNever(x: never): never { throw new Error(String(x)); }
function unwrap(r: Result): number {
  if (r.ok) return r.value;
  if (!r.ok) return assertNever(r as never);
  throw new Error(r.error);
}
console.log(unwrap({ ok: true, value: 42 }));`,
    'unwrap narrows on ok discriminant',
    'Using if (r.ok) without else — TS may not narrow false branch for return.',
    [
      'Boolean discriminant ok splits union.',
      'assertNever documents intentional unreachable.',
      'Pattern scales to remote data states.',
    ],
  ),

  'b2-impl-exclusive-props': e(
    'Implementation: build React-style props union where controlled and uncontrolled modes are mutually exclusive using never fields.',
    'Live code mutually exclusive props pattern.',
    'Type Input props so value/defaultValue conflict is compile error.',
    [
      'Define Controlled and Uncontrolled types with never.',
      'Union into InputProps.',
      'Component destructures safely after mode check.',
      'Test assigning both props — should error.',
      'Optional generic Value type param.',
    ],
    `type Controlled<T> = { value: T; onChange: (v: T) => void; defaultValue?: never };
type Uncontrolled<T> = { defaultValue: T; value?: never };
type FieldProps<T> = Controlled<T> | Uncontrolled<T>;
function Field<T>(props: FieldProps<T>) {
  return 'value' in props && props.value !== undefined
    ? String(props.value)
    : String(props.defaultValue);
}
console.log(Field({ value: 1, onChange: () => {} }));`,
    'Field accepts controlled OR uncontrolled props',
    'Using optional both value and defaultValue — union allows neither; handle empty case.',
    [
      'never optional removes key from other union branch.',
      'in operator narrows union props in component body.',
      'Matches React controlled component documentation.',
    ],
  ),

  'b2-impl-change-handlers': e(
    'Implementation: generate change handler prop types from form model using mapped types + template literals. Wire handlers object satisfying Record.',
    'Template literal handler pattern exercise.',
    'Build ChangeHandlers<Form> mapped type and demo handlers.',
    [
      'type Form = { email: string; age: number }.',
      'Map to onEmailChange, onAgeChange types.',
      'Implement handlers object with satisfies.',
      'Generic ChangeHandlers<T> reusable.',
      'Capitalize intrinsic for prop naming.',
    ],
    `type Form = { email: string; age: number };
type ChangeHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};
const handlers = {
  onEmailChange: (v: string) => v.trim(),
  onAgeChange: (v: number) => Math.max(0, v),
} satisfies ChangeHandlers<Form>;
console.log(handlers.onEmailChange(' a@b.co '));`,
    'satisfies validates handler map against Form',
    'Typo in handler key — satisfies fails; without it, silent undefined handler.',
    [
      'Template literal remapping in mapped type.',
      'Extract<Action> pattern parallel for events.',
      'Used in design systems for form components.',
    ],
  ),

  'b2-impl-type-guard': e(
    'Implementation: write custom type guard isUser(u: unknown): u is User with runtime checks and use to narrow unknown[] to User[].',
    'Practice unknown → concrete via predicate.',
    'Filter unknown JSON array to User[] with guard.',
    [
      'Define User interface.',
      'Check typeof, null, required keys, nested types.',
      'Use in filter: candidates.filter(isUser).',
      'Return false on any failed check.',
      'Avoid as User cast inside guard body except final narrow.',
    ],
    `type User = { id: string; name: string };
function isUser(v: unknown): v is User {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string';
}
const raw: unknown[] = [{ id: '1', name: 'Ada' }, null, { id: 2 }];
const users = raw.filter(isUser);
console.log(users[0]?.name);`,
    'filter(isUser) narrows unknown[] to User[]',
    'Guard returns true without validating nested fields — partial validation lie.',
    [
      'Type predicate affects narrowing on boolean && guard(x).',
      'Assertion functions alternative with asserts x is User.',
      'Zod schema .safeParse replaces hand guards in prod.',
    ],
  )

}
