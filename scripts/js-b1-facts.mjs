/** JavaScript B1 (+ B3 Web API) topic facts for generators. */
function e(what, why, model, how, code, caption, pitfall, internals) {
  return { what, why, model, how, code, caption, pitfall, internals }
}

export const FACTS = {
  'b1-what-is-javascript': e(
    'JavaScript is a high-level, dynamically typed language that runs inside a host: a browser, Node.js, Deno, Bun, or an embedded engine. It is multi-paradigm: you can write procedural scripts, objects with prototypes, classes, and functional pipelines in the same file. The language itself is small; timers, DOM, and fetch are host APIs, not ECMAScript. Almost every modern web UI and a huge share of backends execute this language.',
    'Netscape needed a lightweight language that could react to user input in the page without a round trip to the server. The same syntax later escaped the browser because engines are embeddable and the language is easy to hire for.',
    'Picture a guest language living in a house (the host). The guest speaks ECMAScript; the house provides doors (Web APIs / Node APIs) to the outside world.',
    [
      'ECMAScript defines syntax, types, functions, promises, modules — not the DOM.',
      'A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop.',
      'Scripts are parsed, compiled (often JIT), and run on a single JS thread per isolate by default.',
      'Use JS for UI glue, servers, CLIs, and scripting; do not confuse language features with browser APIs.',
    ],
    `console.log(typeof 1);           // "number"  — language
console.log(typeof fetch);       // "function" — host API (browser / some runtimes)
console.log(globalThis.queueMicrotask); // host scheduling hook
const sum = (a, b) => a + b;     // language: first-class function
console.log(sum(2, 3));`,
    'Language vs host: typeof and a host function',
    'Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither.',
    [
      'ECMA-262 is the language spec; HTML/WHATWG and Node docs specify host APIs.',
      'Each realm has its own intrinsics (Array, Object, Promise) — iframes are separate realms.',
      'Engines implement the spec plus host hooks (Job queues, Promise jobs, module loading).',
    ],
  ),

  'b1-ecmascript': e(
    'ECMAScript (ES) is the standard that specifies JavaScript’s syntax and built-in objects. “JavaScript” is the everyday name of implementations of that standard plus host extras. Yearly editions (ES2015, ES2020, …) add language features; browsers and Node adopt them independently. Saying “ES6 class” means the language feature, not a browser API.',
    'Competing implementations in the 1990s needed a shared spec so code would run across Netscape, IE, and later engines. TC39 now evolves the language in stages so engines can ship features safely.',
    'ECMAScript is the recipe; JavaScript engines are kitchens following that recipe and adding house spices (host APIs).',
    [
      'TC39 proposals move through stages 0–4; stage 4 is in the spec.',
      'Transpilers (Babel, TypeScript) downlevel newer syntax to older engines.',
      'Feature detection: try the syntax/API or check MDN/compat tables — do not sniff “ES6 support” as one flag.',
      'Host extras (DOM, Node fs) are never in ECMA-262.',
    ],
    `// ES2015 language (spec) vs host
class Point { constructor(x, y) { this.x = x; this.y = y; } } // ES
const p = new Point(1, 2);
console.log(Object.keys(p)); // ["x","y"] — language reflection
// document.querySelector is NOT ECMAScript`,
    'An ES class is language; DOM is not',
    'People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine.',
    [
      'The spec defines execution contexts, jobs, and abstract operations like ToPrimitive.',
      'Annex B documents web-reality quirks engines still implement for compatibility.',
      'Engines may ship behind flags before a proposal reaches stage 4.',
    ],
  ),

  'b1-runtimes': e(
    'A JavaScript runtime is the combination of an engine plus host APIs, an event loop, and a way to load code. Chrome, Node, Deno, and Cloudflare Workers are different runtimes that can share the V8 engine but expose different globals. Your mental model of “what can this file do?” depends on the runtime, not just the language version.',
    'The language is embeddable. Product teams wrap the engine with I/O, security sandboxing, and scheduling that match a browser tab, a server process, or an edge isolate.',
    'Same CPU (engine), different operating systems (runtimes). Code that uses `window` fails in Node; code that uses `fs` fails in the browser.',
    [
      'Identify the global object: window (browsers), global (Node CJS), globalThis (portable).',
      'List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here.',
      'Remember each runtime has its own event-loop details (browsers vs libuv).',
      'Ship for a target: browsers via bundlers; Node via engines’ supported versions.',
    ],
    `const g = globalThis;
console.log('fetch' in g, 'process' in g, 'document' in g);
console.log(g.constructor.name);
// Browser: fetch true, process false, document true
// Node 18+: fetch true, process true, document false`,
    'Detect which runtime you are in',
    'Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure.',
    [
      'HTML’s event loop and Node’s libuv loop both drain microtasks, but timer and I/O phases differ.',
      'Workers and iframes are additional runtimes (realms) with their own globals.',
      'Some runtimes freeze or omit globals for security (edge workers, SES).',
    ],
  ),

  'b1-runtime-browser': e(
    'In a browser, JavaScript runs per window/worker with access to HTML, CSSOM, networking, storage, and user events. The page’s main thread also does layout and paint, so long JS tasks freeze the UI. Scripts load through HTML, modules, or workers; they share the document unless they run in a worker.',
    'The original purpose of JS was to make documents interactive: respond to clicks, validate forms, and update the page without a full reload.',
    'A tab is a factory: engine + Web APIs + rendering. Your script is one worker on the assembly line; blocking it stalls painting.',
    [
      'Main-thread JS shares the thread with style, layout, and paint.',
      'Use Web Workers for CPU work that must not jank the page.',
      'DOM, fetch, history, and storage exist only in this kind of runtime.',
      'Each iframe is a separate realm with its own window and JS heap.',
    ],
    `window.addEventListener('DOMContentLoaded', () => {
  document.body.dataset.ready = '1';
});
console.log(location.origin);
console.log(navigator.userAgent.slice(0, 20));`,
    'Browser globals: document, location, navigator',
    'Heavy loops on the main thread look like a “frozen tab,” not a JS error — the event loop never gets to paint.',
    [
      'Browsers implement the HTML event loop, which includes rendering opportunity steps.',
      'Window is a WindowProxy; navigating can swap the inner Window while the proxy stays.',
      'Module scripts defer by default and run after document parse, unlike classic scripts.',
    ],
  ),

  'b1-runtime-engine': e(
    'A JavaScript engine parses source, compiles it (interpreter + JIT), allocates objects on a heap, and runs a call stack. V8 (Chrome/Node), SpiderMonkey (Firefox), and JavaScriptCore (Safari) all implement ECMAScript with different internals. The engine does not include fetch or the DOM; those are attached by the embedder.',
    'Vendors need a fast, memory-safe executor of the spec. Engines compete on speed, memory, and spec completeness so web apps feel native.',
    'Think compiler + VM: source becomes bytecode, hot functions get optimized machine code, and a garbage collector reclaims unreachable objects.',
    [
      'Parse → AST/bytecode → interpret; hot paths may be JIT-compiled.',
      'Objects live on the heap; activation records live on the stack (plus escaped vars on the heap).',
      'Deoptimization happens when types change and optimized code is no longer valid.',
      'Do not rely on engine-specific timing; write spec-correct code.',
    ],
    `function add(a, b) { return a + b; }
for (let i = 0; i < 1e5; i++) add(i, 1); // warms the function
console.log(add(2, 3));
console.log(({}).toString()); // engine intrinsic Object.prototype`,
    'Engine runs language intrinsics, not DOM',
    'Blaming “the V8 bug” for NaN or this-binding mistakes — those are spec rules every engine shares.',
    [
      'V8 uses Ignition (interpreter) and TurboFan (optimizing compiler); Sparkplug sits in between.',
      'Hidden classes / shapes let engines index properties like structs when shapes are stable.',
      'Spec abstract ops (GetValue, PutValue) are what engines actually implement.',
    ],
  ),

  'b1-runtime-web-apis': e(
    'Web APIs are browser (or WinterCG) interfaces exposed to JS: DOM, fetch, URL, crypto, observers, storage. They are specified outside ECMA-262 and may be missing in Node or workers. Language features (Map, Promise, Proxy) work anywhere the engine version supports them.',
    'The web needed a programmable document and network. Standards bodies split “the language” from “the platform” so engines and browsers can evolve separately.',
    'Promise is furniture that came with the house (engine). fetch is a phone the landlord installed (host).',
    [
      'If it touches pixels, network, or OS, it is probably a host API.',
      'Check availability: `typeof fetch === "function"`.',
      'Workers have a subset (no `document`); Node may polyfill some Web APIs.',
      'Never teach setTimeout as “syntax”; it is a host function that queues a task.',
    ],
    `const isLanguage = [Map, Promise, Proxy].every((C) => typeof C === 'function');
const isHost = typeof document !== 'undefined';
console.log({ isLanguage, isHost, hasFetch: typeof fetch === 'function' });`,
    'Feature-detect language constructors vs host objects',
    'Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days.',
    [
      'Web IDL describes how JS values convert to/from platform types.',
      'Host-defined jobs (network, timers) enqueue tasks; Promise jobs enqueue microtasks.',
      'The same Web API can be implemented by Node, Deno, and browsers with subtle differences.',
    ],
  ),

  'b1-runtime-nodejs': e(
    'Node.js embeds V8 and adds libuv for async I/O, plus modules like fs, path, http, and process. It is not a browser: no DOM, and historically no window. Modern Node implements many Web APIs (fetch, Blob, AbortController) so isomorphic code is easier, but the process model and module system still differ.',
    'People wanted JavaScript on servers and CLIs. Reusing V8 plus a non-blocking I/O layer made JS viable for network services.',
    'A long-lived process with an event loop: JS callbacks run when sockets, files, or timers complete, not when a page paints.',
    [
      'Entry is a file or ESM module, not an HTML script tag.',
      'Use process, Buffer, and node:fs for OS work.',
      'The loop exits when the handle/request count drops to zero (unless you keep timers).',
      'Do not assume document, localStorage, or layout APIs exist.',
    ],
    `import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
console.log(process.pid, process.versions.node);
const url = new URL('./package.json', import.meta.url);
const json = JSON.parse(await readFile(fileURLToPath(url), 'utf8'));
console.log(json.name);`,
    'Node process + fs (ESM)',
    'Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch.',
    [
      'libuv phases: timers, pending, idle, poll, check (setImmediate), close.',
      'Node’s nextTick queue runs before other microtasks in some versions — ordering differs from browsers.',
      'Each Worker thread has its own V8 isolate and libuv loop.',
    ],
  ),

  'b1-script-loading': e(
    'Browsers discover JavaScript through HTML: inline <script>, src files, type=module, import maps, and workers. Classic scripts without async/defer block HTML parsing while they fetch and run. How you load code changes when it runs relative to DOM construction and other scripts.',
    'HTML is the bootloader for web apps. The parser must decide whether to wait for JS (document.write / DOM order) or continue painting.',
    'Scripts are jobs inserted into the parser’s timeline. Attributes (async, defer, module) move those jobs earlier or later.',
    [
      'Default classic script: fetch + execute immediately, pausing the parser.',
      'defer: download in parallel, run in order after document is parsed.',
      'async: download in parallel, run as soon as ready (order not guaranteed).',
      'type=module: deferred by default, strict, and can import other modules.',
    ],
    `// HTML (illustrative):
// <script src="a.js"></script>          <!-- blocks parser -->
// <script src="b.js" defer></script>    <!-- after parse, ordered -->
// <script src="c.js" async></script>    <!-- at download complete -->
console.log(document.readyState); // "loading" | "interactive" | "complete"`,
    'readyState while scripts run',
    'Putting a classic script in <head> without defer means the browser waits on JS before it even sees <body>.',
    [
      'HTML defines “prepare a script” and fetch/execute algorithms with different queues.',
      'document.write from a parser-inserted script can still mutate the stream; after load it opens a new document.',
      'Module graphs are fetched via the module map; duplicates share the same module instance.',
    ],
  ),

  'b1-script-inline': e(
    'Inline scripts are JS source sitting between <script> tags in HTML. They run immediately when the parser reaches them (unless type=module). They can see DOM nodes parsed so far, and they historically used document.write during parse.',
    'Tiny snippets (boot config, critical path) need zero extra HTTP request. Inline also lets servers inject per-request values.',
    'The HTML file itself is the JS file for a moment. Whatever nodes exist above the tag already exist; nodes below do not yet.',
    [
      'Place inline scripts after the DOM they need, or wait for DOMContentLoaded.',
      'Avoid huge inline bundles: they skip cache and block parsing.',
      'Content-Security-Policy often bans inline unless you use hashes/nonces.',
      'type=module inline still defers and is strict-mode.',
    ],
    `// Imagine this lives in index.html after <h1>
const h1 = document.querySelector('h1');
console.log(h1 ? h1.textContent : 'h1 not parsed yet');
const later = document.querySelector('footer');
console.log(later); // null if footer is below this script`,
    'Inline script sees DOM above it only',
    'Referencing an element defined later in the HTML yields null — the parser has not created that node yet.',
    [
      'Parser-inserted classic scripts run in the document’s classic script context.',
      'Inline module scripts are still unique per element; they do not share a URL module map entry like src modules.',
      'CSP script-src must allow the exact hash of inline source or a nonce on the tag.',
    ],
  ),

  'b1-script-external': e(
    'External scripts load from a URL via src. The browser fetches, (often) caches, then executes the file as a classic or module script. Caching, CDNs, integrity hashes, and CORS apply here in a way inline scripts do not.',
    'Real apps are too large to paste into HTML. Separate files enable caching, code splitting, and teams owning different bundles.',
    'HTML points at a file; the network and cache decide when bytes arrive; the script attributes decide when those bytes run.',
    [
      'Prefer src + defer/module for app code.',
      'Use integrity (SRI) for third-party CDNs.',
      'crossorigin affects whether you get detailed errors and CORS for modules.',
      'One URL is one classic script instance; modules are cached in the module map.',
    ],
    `const s = document.createElement('script');
s.src = '/app.js';
s.defer = true;
s.integrity = 'sha384-…'; // when you have a real hash
s.onload = () => console.log('app.js ran');
s.onerror = () => console.error('failed to load');
document.head.append(s);`,
    'Inject an external classic script',
    'Dynamically injected scripts default to async-like behavior (they run when fetched), which can race DOM setup.',
    [
      'Fetch of classic scripts is render-blocking unless async/defer is set.',
      'nomodule lets you serve a legacy bundle to old browsers while modules go to modern ones.',
      'The script’s base URL affects relative import resolution for modules.',
    ],
  ),

  'b1-script-async': e(
    'The async attribute on a classic script downloads in parallel with HTML parsing and executes as soon as the file is ready. Execution order among async scripts is not document order. async is ignored on module scripts in the same way: modules are already deferred unless you also use async on modules (which makes them run at first opportunity, unordered).',
    'Analytics and independent widgets should not delay first paint. async trades ordering for “run whenever the network finishes.”',
    'Race: parser vs download. Whichever download finishes first gets to run first — like taxis arriving in traffic, not in dispatch order.',
    [
      'Use async for standalone third-party tags that do not depend on DOM order.',
      'Do not use async for app bundles that must run after specific markup or other files.',
      'Independent async scripts can see a partially parsed DOM.',
      'For ordered app code, prefer defer or type=module.',
    ],
    `// <script async src="ads.js"></script>
// <script async src="metrics.js"></script>
console.log('this file may run before or after the other async file');
console.log('body?', document.body != null);`,
    'Async scripts are unordered',
    'Assuming async script A always runs before async script B because A is listed first — network order wins.',
    [
      'HTML: async classic scripts use the “force async” flag and execute on fetch complete.',
      'Module scripts with async skip the defer queue and execute as soon as the graph is ready.',
      'document.write in async scripts after parse opens a new document (destroys the page).',
    ],
  ),

  'b1-script-defer': e(
    'defer downloads a classic script in parallel, then runs it after the document is fully parsed, in document order relative to other deferred scripts. DOMContentLoaded waits for deferred scripts. Modules behave similarly by default without the attribute.',
    'Apps need the full DOM and a stable order between files, without blocking the parser the way a naked src script does.',
    'Download now, wait until the HTML is a complete tree, then run the queue in tag order — like boarding after the plane is fully loaded.',
    [
      'Put defer on classic app scripts in <head>.',
      'They run before DOMContentLoaded, after parse.',
      'Order is preserved among deferred classic scripts.',
      'type=module is deferred automatically; extra defer is redundant.',
    ],
    `document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded — deferred scripts already ran');
});
console.log('deferred script, document is parsed:', document.body != null);
console.log(document.querySelectorAll('section').length);`,
    'A deferred script sees the full DOM',
    'Mixing a blocking script in the middle of deferred scripts still creates surprising order; keep one strategy.',
    [
      'Deferred scripts run after parsing, before the DOMContentLoaded event is fired.',
      'The spec maintains an ordered list of scripts that will execute when parsing completes.',
      'defer on inline classic scripts is ignored — there is nothing to fetch.',
    ],
  ),

  'b1-script-module': e(
    'type="module" loads an ES module graph: import/export, strict mode, module scope, and deferred execution. Modules fetch dependencies, share instances via the module map, and do not leak bindings onto window. They also require CORS for cross-origin sources.',
    'Large apps needed real files with explicit dependencies instead of global namespaces and IIFE bundles.',
    'Each file is a sealed box with imports as labeled doors. The browser builds the graph, instantiates once, then evaluates in dependency order.',
    [
      'Use import/export; there is no implicit window leak.',
      'Scripts are defer-like: they wait for parse and for the graph.',
      'import.meta.url is the module’s URL for resolving assets.',
      'Classic scripts cannot import; they must use dynamic import() or bundlers.',
    ],
    `// app.js  (type="module")
import { add } from './math.js';
console.log(add(2, 3));
console.log(import.meta.url);
// this === undefined at top level in browsers
console.log(typeof this);`,
    'Module script: imports and import.meta',
    'A module file served as a classic script throws on import — MIME/type=module and CORS must be correct.',
    [
      'Module records go through fetch → parse → instantiate → evaluate; cycles get live bindings.',
      'Top-level this in modules is undefined, unlike classic scripts where it is the global object.',
      'Credentials/CORS for modules follow the script’s crossorigin and the module map’s fetch options.',
    ],
  ),

  'b1-statements-expressions': e(
    'An expression produces a value (2+2, fn(), x = 1). A statement performs an action and does not itself yield a value you can embed everywhere (if, while, const, return). Some constructs are both, like an assignment expression used as a statement. Mixing them causes SyntaxError: you cannot `if` in a value position without a ternary or &&.',
    'Grammars need a split so parsers know where values go versus where control-flow goes. It also lets ASI and return rules stay consistent.',
    'Expressions are ingredients; statements are recipe steps. You can put ingredients in a bowl (another expression); you cannot put “if it rains” where a number is required.',
    [
      'If it can sit on the right-hand side of `=`, it is an expression.',
      'if/for/while/const/function declarations are statements.',
      'Use ternaries, &&/||, or comma expressions when you need values; use if for multi-line branches.',
      'Arrow functions: `() => expr` vs `() => { statements }`.',
    ],
    `const n = 3;
const label = n > 2 ? 'big' : 'small'; // expressions
if (n > 2) {                           // statement
  console.log(label);
}
const f = () => n + 1;                 // expression body
const g = () => { return n + 1; };     // statement body
console.log(f(), g());`,
    'Ternary (expression) vs if (statement)',
    '`return` on one line and the value on the next returns undefined because of ASI — return is a statement with an optional expression.',
    [
      'ECMAScript syntactic grammar: Expression vs Statement vs Declaration.',
      'Completion records give statements an internal [[Value]] used by eval, but you cannot grab it in normal code.',
      'Function declarations are hoisted statements; function expressions are values.',
    ],
  ),

  'b1-syntax-basics': e(
    'JavaScript programs are Unicode text: tokens (identifiers, keywords, literals, punctuators) grouped into statements and modules. Braces create blocks; parentheses group expressions and call lists. The language is case-sensitive and mostly free-form whitespace, with ASI inserting semicolons in specific places.',
    'A text language needs a small set of tokens so humans and parsers agree. JS borrowed C-like punctuation to feel familiar to web authors in the 1990s.',
    'Source is a stream of tokens. The parser builds a tree; illegal token sequences throw SyntaxError before any runtime code runs.',
    [
      'Identifiers: Unicode letters, $, _, then digits; no hyphens.',
      'Keywords cannot be binding names (`let let = 1` is invalid).',
      'Blocks `{ }` scope let/const and group statements.',
      'Use a formatter; rely on ASI only where you understand the rules.',
    ],
    `const userName = 'Ada';
function greet(name) {
  return 'hi ' + name;
}
console.log(greet(userName));
{ const inner = 1; console.log(inner); }`,
    'Identifiers, blocks, and a function',
    'Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function.',
    [
      'Lexer: InputElementDiv vs InputElementRegExp — `/` can be division or a regex.',
      'Early errors (syntax, strict reserved words) fail before evaluation.',
      'Hashbang `#!` is allowed only as the first line of a script/module for CLIs.',
    ],
  ),

  'b1-comments': e(
    'Comments are source text the parser ignores: `//` to end of line and `/* */` blocks that can span lines. They do not create a token the runtime sees, except that they still occupy lines for stack traces and source maps. HTML-style `<!--` comments exist as a web-legacy quirk in scripts, not something you should write.',
    'Humans need to leave intent next to code without changing behavior. Debuggers and licenses also need a place to live in the file.',
    'The lexer eats comments like whitespace: they separate tokens but never become values.',
    [
      'Use `//` for short notes; `/* */` for banners or temporarily wrapping code.',
      'Do not nest block comments — the first `*/` ends the comment.',
      'JSDoc `/** */` is still a comment; tools parse it, the engine does not.',
      'Never hide secrets in comments; they ship to the browser.',
    ],
    `const tax = 0.2; // rate applied at checkout
/* Multi-line
   note about rounding */
const price = 100;
console.log(price * (1 + tax));
// const old = 0.15;`,
    'Line and block comments around real code',
    'A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors.',
    [
      'Comments are skipped in the lexical grammar as InputElement whitespace-like productions.',
      'Source maps map generated lines back; stripped comments can confuse that mapping if not handled.',
      'Annex B allows HTML comments in non-module scripts for ancient pages.',
    ],
  ),

  'b1-identifiers': e(
    'Identifiers name variables, functions, parameters, and labels. They may start with a Unicode letter, `$`, or `_`, then letters, digits, `$`, `_`, or certain Unicode combining marks. Reserved words cannot be identifiers. Unicode escapes (`\\u0061`) can spell names, which is a footgun in security reviews.',
    'Programs need stable names that survive minification maps and tooling. The spec picked Unicode so non-English names are legal, not just ASCII.',
    'A name is a key in an environment record. If the lexer will not accept it as IdentifierName (minus reserved words), it cannot be a binding.',
    [
      'Prefer ASCII camelCase in shared codebases unless the team standard says otherwise.',
      '`$` is legal (jQuery history); do not start names with digits.',
      'Private class fields use `#name`, which is not a normal identifier in the outer scope.',
      'Avoid Unicode lookalikes that spoof Latin letters.',
    ],
    `const $el = 'ok';
const _privateHint = 1;
const π = Math.PI;
const café = true;
console.log($el, _privateHint, π > 3, café);
// const 2bad = 1; // SyntaxError`,
    'Legal identifier shapes',
    '`await` is reserved in modules and async functions; a file that worked as a script can break when you add type=module.',
    [
      'IdentifierName vs Identifier: keywords are names in property positions (`obj.default`) but not bindings.',
      'Early error: binding Identifier must not be a reserved word in that goal symbol.',
      'Normalized Unicode (NFC) is not automatically applied — visually identical names can be different bindings.',
    ],
  ),

  'b1-keywords': e(
    'Keywords are tokens with fixed meaning: `if`, `const`, `class`, `await`, `yield`, and others. Strict mode and modules reserve additional words (`implements`, `await` at top level). Contextual keywords like `get`, `set`, `static`, `async` are only special in some positions, so they can still be variable names elsewhere.',
    'The parser needs words that always start a construct so grammar is unambiguous. Reserving them prevents `if = 1` from meaning two things.',
    'Some words are locked doors everywhere; some are locked only in certain hallways (async functions, modules).',
    [
      'Never name bindings `undefined`, `Infinity` as if you could replace them in sloppy mode safely.',
      'Use `item` not `class` / `default` / `new` for variables.',
      'Property names can be keywords: `{ default: 1 }.default`.',
      'Treat `await` and `yield` as reserved in modern code even if a classic script allows them.',
    ],
    `const obj = { default: 42, class: 'ok' };
console.log(obj.default, obj.class);
async function load() {
  const data = await Promise.resolve(1);
  return data;
}
console.log(await load());`,
    'Keywords as properties vs reserved bindings',
    'Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError.',
    [
      'ReservedWord includes Keyword, FutureReservedWord, NullLiteral, BooleanLiteral.',
      'Strict mode adds FutureReservedWord restrictions (let, static, yield in some contexts historically).',
      'await is a Keyword in module code and async contexts; yield in generators.',
    ],
  ),

  'b1-case-sensitivity': e(
    'JavaScript identifiers, keywords, and most APIs are case-sensitive: `map` is not `Map`, `document` is not `Document`. HTML tag names are case-insensitive in HTML parsing, which confuses people when they switch between markup and JS. String comparison is also case-sensitive unless you normalize.',
    'The language follows C-family tradition and Unicode identifier rules rather than HTML’s forgiving case folding.',
    'The engine compares exact code points. If the bytes differ, it is a different name — no case folding on lookups.',
    [
      '`let a` and `let A` are two bindings.',
      'Constructors are typically PascalCase; instances camelCase.',
      'Do not rely on HTML’s case-insensitive tags when querying via JS strings unless you know the DOM’s rules.',
      'For user-facing search, use locale-aware case folding, not naive toLowerCase for all languages.',
    ],
    `const user = { name: 'Ada' };
console.log(user.name);
console.log(user.Name); // undefined
const MapCtor = Map;
const mapFn = (xs, f) => xs.map(f);
console.log(new MapCtor([[1, 2]]).get(1), mapFn([1], (x) => x + 1));`,
    'Map constructor vs Array#map vs property case',
    'Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase.',
    [
      'Identifier equality is code-unit / code-point identity, not locale case-fold.',
      'DOM HTML collections fold ASCII tag names; XML/SVG do not.',
      'import specifiers are URL-case-sensitive on many servers (Linux).',
    ],
  ),

  'b1-asi': e(
    'Automatic Semicolon Insertion (ASI) inserts `;` when the parser would otherwise error, at newlines in restricted productions (`return`, `throw`, `break`, `continue`, `++`/`--` postfix), and at EOF. It does not insert semicolons everywhere a newline appears. Leading `(` `[` `` ` `` `/` `+` `-` on the next line can continue the previous statement.',
    'Brendan Eich wanted a friendlier syntax for amateurs. The compromise was optional semicolons with a precise (and sharp) insertion algorithm.',
    'Newlines are not the end of a statement unless the grammar says they are, or ASI’s three rules fire.',
    [
      'Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit semicolons style-wise.',
      '`return` then a newline then a value returns undefined.',
      'Prefix `++` on the next line can apply to the previous expression.',
      'Use a linter (semicolon or no-semicolon style, but consistent).',
    ],
    `function oops() {
  return
  { ok: true }
}
function ok() {
  return { ok: true }
}
console.log(oops(), ok());
const a = 1
const b = 2
console.log(a + b);`,
    'ASI breaks return of an object literal',
    '`return\\n{...}` returns undefined; the braces become a block, not an object.',
    [
      'Restricted productions forbid LineTerminator between return/throw/break/continue and their expressions.',
      'ASI is specified as a token insertion when parse fails, not a pre-pass that adds semicolons blindly.',
      '++/-- postfix cannot have a newline before the operator (restricted production).',
    ],
  ),

  'b1-strict-mode': e(
    'Strict mode (`"use strict"` or implied by modules/classes) changes sloppy historical behavior: undeclared assignment throws, `this` is undefined in bare calls, `with` is banned, duplicate params are errors, and `arguments` does not alias parameters. It is the default in ES modules.',
    'Early JS was too forgiving (silent globals, boxed this). Strict mode let the web keep old pages working while new code got sane errors.',
    'A dialect switch: the same syntax, fewer footguns, more throws instead of silent failure.',
    [
      'Modules and class bodies are automatically strict.',
      'Put `"use strict"` at the top of classic scripts or functions if you must support non-module files.',
      'Never rely on function-sloppy `this` being `window`.',
      'Assigning to an undeclared name is a ReferenceError, not a global.',
    ],
    `function sloppy() {
  // in a non-module script without use strict:
  // undeclared = 1;  // would create a global
}
function strictish() {
  'use strict';
  try { x = 1; } catch (e) { console.log(e.name); } // ReferenceError
  function inner() { return this; }
  console.log(inner()); // undefined
}
strictish();`,
    'Strict mode: no implicit globals, this is undefined',
    'A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way.',
    [
      '[[ThisMode]] of a function is lexical, strict, or global.',
      'Strict eval gets its own variable environment; sloppy eval can inject bindings into the caller.',
      'Arguments object in strict mode does not share slots with named parameters.',
    ],
  ),

  'b1-console-output': e(
    '`console` is a host object (not ECMAScript) for logging: log, warn, error, table, time, group, dir, trace. It is meant for developers, not for showing UI to users. Formatting differs between browsers and Node; objects may be shown live (with later mutations visible) in DevTools.',
    'Debugging needed a standard place to print without `alert`. Hosts standardized a Console API loosely based on Firebug.',
    'A side channel to the developer tools. It does not return values you should flow through business logic.',
    [
      'Use `console.log` for values, `error` for failures, `table` for arrays of objects.',
      '`console.time` / `timeEnd` for rough durations.',
      'Do not leave noisy logs in hot paths in production.',
      '`JSON.stringify` when you need a snapshot; live object inspectors can lie after mutation.',
    ],
    `const user = { id: 1, name: 'Ada' };
console.log('user', user);
console.table([{ a: 1 }, { a: 2 }]);
console.time('sum');
let s = 0;
for (let i = 0; i < 1e5; i++) s += i;
console.timeEnd('sum');
console.log(s);`,
    'log, table, and time',
    'Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong.',
    [
      'console is not required by ECMA-262; engines in unusual embeds may lack it.',
      'Node’s console writes to stdout/stderr streams; browsers buffer to DevTools.',
      '%s %o %c format specifiers are host-defined, not language syntax.',
    ],
  ),

  'b1-basic-debugging': e(
    'Basic debugging is a loop: reproduce, inspect values, form a hypothesis, change one thing. Tools: console, debugger statement, breakpoints, reading stack traces, and binary-searching with logs. Guessing without inspecting is slower than watching the call stack once.',
    'JS fails at runtime more than at compile time. You need a way to see actual types and async order, not just source.',
    'The program is a movie; a breakpoint pauses a frame so you can look at props (variables) and the set (call stack).',
    [
      'Write a failing reproduction first (smallest script or test).',
      'Log types (`typeof`, `Array.isArray`) when values look “impossible.”',
      'Use `debugger` or a breakpoint on the line you think is wrong.',
      'Read the stack from the throw site upward — the top frame is usually the clue.',
    ],
    `function area(w, h) {
  debugger; // pause here in DevTools
  if (w == null || h == null) throw new Error('missing size');
  return w * h;
}
try {
  console.log(area(3, 4));
  console.log(area(3));
} catch (e) {
  console.error(e.message);
  console.error(e.stack);
}`,
    'debugger + stack on a thrown error',
    'Fixing the first log you see without checking it is stale or from a different function of the same name.',
    [
      'The debugger statement is specified; hosts may ignore it when DevTools is closed.',
      'Error.stack is host-defined formatting, not fully standardized historically.',
      'Source maps rewrite frames from generated lines to original files.',
    ],
  ),

  'b1-variables': e(
    'A variable is a named binding that holds a value. In JS you declare with `var`, `let`, or `const`, which differ in scope, hoisting, and reassignment. Until you understand bindings vs values, you will confuse “changing the object” with “changing which object the name points at.”',
    'Programs need memory cells with names so later statements can reuse computed results.',
    'A sticky note (the name) pointing at a box (the value). Reassignment moves the sticky note; mutating an object changes what’s inside the box.',
    [
      'Declare before use (`let`/`const`); `var` is function-scoped and hoisted as undefined.',
      'Choose `const` by default; `let` when the binding must change; avoid `var`.',
      'The binding is not the object — two names can point at the same object.',
      'TDZ: accessing let/const before the declaration line throws.',
    ],
    `let count = 0;
const user = { name: 'Ada' };
count = 1;           // rebind
user.name = 'Grace'; // mutate
const also = user;
also.name = 'Alan';
console.log(count, user.name);`,
    'Rebind a let; mutate a const object',
    '`const` does not freeze objects. `const user = {}` still allows `user.x = 1`.',
    [
      'Environment records map names to values (or uninitialized for TDZ).',
      'Assignment is SetMutableBinding; const bindings have a strict immutable flag.',
      'var bindings are created as undefined during instantiation; let/const as uninitialized.',
    ],
  ),

  'b1-declaration': e(
    'A declaration introduces a binding in a scope: `let x`, `const y = 1`, `var z`, `function f`, `class C`, imports. Declaration is not the same as assigning a value. Some declarations also initialize immediately (`const` must). Duplicate `let` in the same scope is a SyntaxError.',
    'The engine must know which names exist in a scope before running lines, so it can allocate environment slots and catch duplicates.',
    'Putting a label on a mailbox. Initialization is putting mail in it; assignment later is replacing the mail.',
    [
      '`let x;` declares and starts uninitialized until that statement runs.',
      '`const x = 1` must initialize in the declaration.',
      'Function declarations create a binding and initialize it during instantiation (classic scripts).',
      'Do not redeclare the same let/const in one scope.',
    ],
    `let a;
console.log(a); // undefined after the declaration runs
a = 10;
const b = 20;
function f() { return a + b; }
console.log(f());
// let a; // SyntaxError in this scope`,
    'Declare, then assign; const needs a value',
    'Using a `let` on the line before its declaration (even inside the same block) throws TDZ, unlike `var`.',
    [
      'VarScopedDeclarations vs LexicallyScopedDeclarations are collected in instantiation.',
      'Duplicate lexical bindings in one scope are early errors.',
      'for (let i) creates a fresh binding per iteration for closures.',
    ],
  ),

  'b1-initialization': e(
    'Initialization sets a binding’s first value. `let x;` initializes to `undefined` when that statement executes. `const` requires an initializer. `var x;` is initialized to `undefined` at function/script instantiation, before any line runs. Reading let/const before initialization is a TDZ error, not undefined.',
    'Bindings need a defined start state so the engine can distinguish “not yet born” (TDZ) from “born but empty” (undefined).',
    'var mailboxes exist empty at the start of the function. let mailboxes exist but are locked until you pass the declaration line.',
    [
      'Write initializers on the same line when you know the value.',
      'Split declaration and init only when the value depends on a branch.',
      'Never use a let/const above its declaration in the same scope.',
      '`const` cannot be initialized later — it is not “declare now, fill later.”',
    ],
    `var v;
console.log('var', v);
let w = 1;
console.log('let', w);
const c = { n: 2 };
console.log('const', c.n);
function demo() {
  // console.log(x); // ReferenceError TDZ
  let x = 3;
  return x;
}
console.log(demo());`,
    'var is undefined early; let/const wait for their line',
    'Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first.',
    [
      'InitializeBinding happens at the declaration evaluation for let/const.',
      'var CreateMutableBinding + InitializeBinding(undefined) occur in VariableInstantiation.',
      'Class declarations are lexical and TDZ until evaluated, like let.',
    ],
  ),

  'b1-assignment': e(
    'Assignment (`=`) stores a new value in an existing mutable binding or property. Reassignment changes which value a `let`/`var` name refers to. `const` bindings cannot be reassigned, but properties of a const object can still change. Compound assignment (`+=`) reads, computes, then writes.',
    'Computation is useless if you cannot update stored results. Assignment is the write half of named storage.',
    'Reassignment moves a pointer. Mutation edits the object at the other end of the pointer. Const locks the pointer, not the object.',
    [
      '`let n = 1; n = 2` reassigns.',
      '`const o = {a:1}; o.a = 2` mutates; `o = {}` throws.',
      'Assignment is an expression: `x = y = 0` chains right-to-left.',
      'Assigning to a property of undefined/null throws TypeError.',
    ],
    `let score = 0;
score = score + 10;
score += 5;
const box = { n: 1 };
box.n = 2;
try { box = {}; } catch (e) { console.log(e.name); }
console.log(score, box.n);`,
    'Reassign let; mutate const object; failed rebind',
    'Interviewers ask if `const` is immutable. Answer: the binding is; objects and arrays are not.',
    [
      'Simple assignment uses PutValue on a Reference (binding or property).',
      'const SetMutableBinding throws in strict mode (always for const).',
      'Left-hand side can be a pattern (destructuring assignment).',
    ],
  ),

  'b1-redeclaration': e(
    'Redeclaration means introducing the same name twice in one scope. `var` may redeclare `var` (and even merge with a function). `let`/`const`/`class` cannot redeclare a lexical name in the same scope. A `var` and a `let` of the same name in one scope is also illegal. Nested scopes may shadow instead of redeclare.',
    'JS kept `var` redeclaration so old scripts concatenating files would not crash. Lexical bindings opted into “one name, one slot” to catch bugs.',
    'var is a sticky label you can slap on twice. let is a reserved seat: two tickets with the same number are an error.',
    [
      'Do not redeclare let/const in the same block.',
      'Shadow in an inner block if you need a temporary same name.',
      'Avoid `var` so accidental duplicates become syntax errors.',
      'Parameters already occupy names; `let` of the same param name in the body errors.',
    ],
    `var a = 1;
var a = 2; // allowed
console.log(a);
function wrap() {
  let b = 1;
  {
    let b = 2; // shadow, not redeclare
    console.log('inner', b);
  }
  console.log('outer', b);
}
wrap();`,
    'var redeclare vs let shadow',
    'A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration.',
    [
      'Early error rules for Duplicate bindings in LexicallyDeclaredNames.',
      'var declarations are merged; FunctionDeclarations in sloppy eval/scripts have extra annex-B behavior.',
      'Catch parameters and let in the catch block cannot clash in the same binding set.',
    ],
  ),

  'b1-var': e(
    '`var` declares a function-scoped (or script-scoped) mutable binding, hoisted and initialized to `undefined`. It ignores block braces: a `var` inside `if` or `for` is still visible in the whole function. In browsers, a top-level `var` also becomes a `window` property.',
    'Original JavaScript had only function scope. `var` is that 1995 design, kept forever for compatibility.',
    'One mailbox for the entire function, created empty at entry, regardless of which block the `var` line sits in.',
    [
      'Prefer let/const; treat var as legacy.',
      'Know that `for (var i)` shares one `i` for all closures.',
      'Redeclaring var is silent — easy to overwrite.',
      'Top-level var in classic scripts pollutes `window`.',
    ],
    `function f() {
  if (true) {
    var hidden = 1;
  }
  console.log(hidden); // 1 — function scoped
}
f();
console.log(typeof hidden); // "undefined" outside
for (var i = 0; i < 2; i++) {}
console.log('i after loop', i);`,
    'var leaks out of blocks',
    'The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations.',
    [
      'VariableEnvironment vs LexicalEnvironment: var uses the VariableEnvironment of the function.',
      'Hoisting: CreateMutableBinding + InitializeBinding(undefined) before evaluation.',
      'Global var creates a configurable object property on the global object (historically).',
    ],
  ),

  'b1-let': e(
    '`let` declares a block-scoped mutable binding. It is hoisted to the block but stays in the Temporal Dead Zone until the declaration executes. It does not become a `window` property at top level. Loops with `let` get a new binding per iteration, which fixes the closure-in-loop bug.',
    'ES2015 needed C-like block scope without breaking `var`. `let` is the mutable half of that design.',
    'A mailbox that exists only between `{ }`, locked until the `let` line runs, and duplicated each time a for-loop iterates.',
    [
      'Use let when the name must be reassigned (counters, accumulators).',
      'Keep lets in the smallest block that needs them.',
      'Do not access let before its line.',
      'for (let i) closures capture that iteration’s i.',
    ],
    `let n = 0;
n += 1;
{
  let n = 99; // inner block
  console.log('inner', n);
}
console.log('outer', n);
const fns = [];
for (let i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map((f) => f())); // [0,1,2]`,
    'Block scope and per-iteration let',
    'Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined.',
    [
      'LexicalEnvironment of the block holds let bindings.',
      'Per-iteration bindings: ForBodyEvaluation creates a new environment each loop.',
      'Global let is in the global lexical environment, not as a window data property.',
    ],
  ),

  'b1-const': e(
    '`const` is a block-scoped binding that must be initialized and cannot be reassigned. It is not immutability of the value: objects and arrays held by const can still mutate. Prefer const for the majority of names so readers know the pointer never moves.',
    'Most names should not be rebound. const documents that intent and catches accidental `=`.',
    'A locked pointer to a value. You can rearrange furniture in the house; you cannot point the sign at a different house.',
    [
      'Default to const; switch to let only when reassignment is required.',
      'Freeze objects separately (`Object.freeze`) if you need shallow immutability.',
      'const in for-of/for-in is fine: each iteration is a new binding.',
      'Exporting const still allows mutating object properties unless frozen.',
    ],
    `const PI = 3.14159;
const user = { role: 'guest' };
user.role = 'admin';
const nums = [1, 2];
nums.push(3);
try { nums = []; } catch (e) { console.log(e.name); }
console.log(PI, user.role, nums);`,
    'const binding vs mutable object/array',
    '`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`.',
    [
      'ImmutableBinding in the environment record; SetMutableBinding throws.',
      'TDZ applies the same as let.',
      'for (const x of iterable) rebinds a fresh const each iteration, which is allowed.',
    ],
  ),

  'b1-var-let-const': e(
    'var is function-scoped, hoisted to undefined, redeclarable, and can attach to window. let is block-scoped, mutable, TDZ. const is block-scoped, immutable binding, TDZ, required initializer. Modern style: const by default, let when needed, never var except when maintaining old code or documenting a puzzle.',
    'Three keywords exist because the language evolved: 1995 function scope, then 2015 lexical scope with a mutable/immutable split.',
    'var = whole function flask. let = block flask you can refill. const = block flask sealed at the cork (contents of objects still slosh).',
    [
      'Ask: does the binding need to change? If no, const.',
      'Ask: should this name die at the closing brace? If yes, let/const not var.',
      'Ask: is this a loop closure? Use let/const, not var.',
      'Top-level: let/const do not create window.x; var does in classic scripts.',
    ],
    `function compare() {
  var a = 1;
  let b = 2;
  const c = 3;
  if (true) {
    var a = 10; // same a
    let b = 20; // inner b
    console.log('if', a, b, c);
  }
  console.log('fn', a, b, c);
}
compare();`,
    'Same names: var merges, let shadows',
    'Saying “const is block scope, let is function scope” — both are block scope.',
    [
      'VarScopedDeclarations vs LexicallyScopedDeclarations in spec instantiation.',
      'Global object vs global lexical environment explain window visibility.',
      'Annex B function-in-block rules make sloppy-mode functions extra confusing vs let.',
    ],
  ),

  'b1-function-scope-vars': e(
    'Function scope means a `var` or a function declaration (in classic sloppy rules) is visible throughout the enclosing function body, including before the line and outside inner blocks. Parameters are also function-scoped names. Nested functions each have their own function scope.',
    'The first JS mental model was “a function is the privacy boundary.” That matched how `var` and `function` were implemented.',
    'The function is a room. var names are on the wall of the room, not inside the cabinets (blocks).',
    [
      'Draw the function brace pair; that is the var visibility region.',
      'Inner functions do not see each other’s vars unless nested.',
      'Blocks do not hide var.',
      'Switch to let/const when you want cabinet-level privacy.',
    ],
    `function outer(x) {
  if (x > 0) {
    var msg = 'positive';
  } else {
    var msg = 'not';
  }
  console.log(msg);
  function inner() { return x; }
  return inner;
}
const fn = outer(5);
console.log(fn());`,
    'var msg visible after if/else',
    'Thinking an `if` block hides `var` like Java — it does not.',
    [
      'Function VariableEnvironment is created on invocation and holds var/params.',
      'Nested functions get their own VariableEnvironment linked via [[Environment]].',
      'eval in sloppy mode can still inject var into that function environment.',
    ],
  ),

  'b1-block-scope-vars': e(
    'Block scope (`let`, `const`, `class`, `function` in strict block) limits a binding to the nearest `{ }`, including `if`, `for`, `while`, `switch`, and bare blocks. Leaving the block ends the binding’s lifetime (unless a closure captured it). `var` is not block-scoped.',
    'C/Java programmers expected braces to hide names. ES2015 delivered that for lexical bindings so loops and ifs could have their own counters.',
    'Each `{ }` can be a nested office. let/const nameplates come off the door when you leave, unless someone (a closure) kept a key.',
    [
      'Use a bare `{ }` to limit a temporary name.',
      'switch cases share one block unless you wrap case bodies in `{ }`.',
      'for (let i) scope is the loop, with per-iteration clones.',
      'try/catch: the catch binding is scoped to the catch block.',
    ],
    `{
  const secret = 42;
  console.log(secret);
}
try { console.log(secret); } catch (e) { console.log(e.name); }
switch (1) {
  case 1: {
    const label = 'one';
    console.log(label);
    break;
  }
}`,
    'Block const is invisible outside; switch case wrapped',
    '`case 1: let x = 1; case 2: console.log(x)` can TDZ or clash because cases share the switch block.',
    [
      'BlockDeclarationInstantiation runs when entering a block.',
      'switch has a single block; case clauses are labels, not scopes.',
      'Closures keep the environment record alive after the block completes.',
    ],
  ),

  'b1-global-scope-vars': e(
    'Global scope is the outermost environment of a script or the shared top level of classic scripts in a page. `var` and function declarations at top level of a classic script become properties of the global object (`window` in browsers). `let`/`const`/`class` live in the global lexical environment and do not become `window` properties. Modules have their own module scope, not classic global bindings.',
    'Browsers needed a place for `alert` and `document` and for multiple script tags to see each other’s functions.',
    'A public bulletin board (global object) plus a quieter lexical shelf (let/const) that is not `window.x`.',
    [
      'Prefer modules so you do not put app state on window.',
      'Read globals via `globalThis` when you must.',
      'A missing `let` in sloppy mode creates an accidental global.',
      'Two classic scripts share globals; two modules do not unless they import.',
    ],
    `var classic = 'on window in browsers';
let lexical = 'not a window property';
console.log(globalThis.classic, globalThis.lexical);
function shared() { return 1; }
console.log(typeof globalThis.shared);`,
    'var/function vs let on the global object',
    'Expecting `window.foo` after `let foo` in a module or modern script — it is undefined.',
    [
      'Global environment has an object record (global object) and a declarative record (let/const).',
      'HasBinding for global let does not imply HasOwnProperty on window.',
      'Script vs module goal symbols change whether top-level vars attach this way.',
    ],
  ),

  'b1-tdz': e(
    'The Temporal Dead Zone is the time from entering a scope until a `let`/`const`/`class` declaration is evaluated. Accessing the binding in that window throws ReferenceError. The binding exists (so it shadows outer names) but is uninitialized. `typeof` on a TDZ binding also throws, unlike `typeof` on an undeclared name.',
    'If let behaved like var (`undefined` before the line), `let x = x` would silently use undefined instead of catching a typo/shadow bug. TDZ makes initialization order real.',
    'The name is reserved in the room, but the light is off until the declaration line. Touching it is an error, not undefined.',
    [
      'Do not use a let/const above its declaration, including in default params of the same scope.',
      'Inner let x shadows outer x immediately when you enter the block — even before the inner line.',
      '`typeof undeclared` is "undefined"; `typeof tdzLet` throws.',
      'class names are also TDZ until the class statement runs.',
    ],
    `const x = 1;
{
  try { console.log(x); } catch (e) { console.log('tdz', e.name); }
  const x = 2;
  console.log('after', x);
}
console.log('outer', x);`,
    'Inner const shadows immediately and TDZ-throws',
    '`if (typeof x === "undefined") let x = 1` is not a safe existence check — typeof hits TDZ if x is declared later in the block.',
    [
      'InitializeBinding from uninitialized to a value happens at evaluation of the declaration.',
      'GetBindingValue throws if IsUninitializedBinding is true.',
      'Shadowing starts at BlockDeclarationInstantiation, not at the line of source.',
    ],
  ),

  'b1-global-variables': e(
    'Global variables are bindings in the global environment. `globalThis` is the portable name for the global object (window, self, global). Creating globals (implicit sloppy assignment, `var` at top level, `window.foo =`) makes names visible to every script and is a collision hazard. Modules keep top-level bindings private to the file.',
    'Hosts must expose a single object for built-ins (`undefined`, `Object`, `parseInt`) and for page-wide script communication.',
    'A shared desk drawer. `globalThis` is the drawer handle that works in workers, Node, and browsers.',
    [
      'Use modules + import for sharing; do not hang app state on window.',
      'Read built-ins from globalThis when the local name might be shadowed.',
      'In browsers, `var x` at top-level classic script ⇔ `window.x` (mostly).',
      'Workers: `self` is the global; `window` is missing.',
    ],
    `const g = globalThis;
console.log(g.Math === Math);
g.__scratch = 123;
console.log(g.__scratch);
delete g.__scratch;
console.log('window' in g, g === g.globalThis);`,
    'globalThis as the portable global object',
    'Assigning `name = "x"` in a browser: `window.name` is a special string property and will stringify unexpectedly.',
    [
      'globalThis is specified as the this-value of the global scope (ordinary global ThisValue).',
      'Global object properties vs declarative global bindings (let) are different records.',
      'iframe has a different globalThis than the parent (different realm).',
    ],
  ),

  'b1-variable-naming': e(
    'Names should say what the value means: `userCount` not `n2`, booleans as `isReady`/`hasError`, functions as verbs. JS convention is camelCase for values, PascalCase for constructors/types, SCREAMING_SNAKE for true constants. Avoid 1-letter names except short loops. Collisions with DOM ids (global `window` properties in browsers) still bite old scripts.',
    'Readers spend more time reading than writing. Consistent names let grep and code review work. Minifiers will shorten names in bundles anyway.',
    'A name is an API. If you have to decode it, the name failed — even if the algorithm is correct.',
    [
      'camelCase bindings; PascalCase classes.',
      'Booleans read as questions: `isEmpty`, `canSubmit`.',
      'Do not shadow `Map`, `Error`, `document`.',
      'Keep names stable across refactors; rename with tooling, not half-file search.',
    ],
    `function toUserDto(row) {
  const isActive = row.status === 'active';
  const displayName = row.name.trim();
  return { displayName, isActive };
}
console.log(toUserDto({ name: ' Ada ', status: 'active' }));`,
    'Verb function + boolean + domain names',
    'Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons.',
    [
      'Unicode identifiers allow homograph attacks in published packages — stick to ASCII in libraries.',
      'Reserved words force awkward names (`clazz`, `klass`) or property quotes.',
      'Source maps preserve original names for debugging after minify.',
    ],
  ),

  'b1-primitive-types': e(
    'JS has seven primitive types: string, number, bigint, boolean, undefined, symbol, and null (which typeof lies about). Primitives are not objects: they have no identity you can mutate. When you access a property on a primitive, the engine autoboxes a temporary wrapper. Everything else is an object (including arrays, functions, dates).',
    'A dynamic language still needs a small set of atomic values for numbers, text, and flags so not every value is a heap object.',
    'Primitives are xeroxed copies when passed around. Objects are street addresses. The seven primitives are the copies; objects are the addresses.',
    [
      'typeof null is "object" — memorize the bug.',
      'typeof function is "function"; arrays are "object".',
      'Use Number.isNaN, Array.isArray, and === null checks instead of typeof alone.',
      'bigint and number do not mix with + without explicit conversion.',
    ],
    `const types = [
  typeof 'a', typeof 1, typeof 1n, typeof true,
  typeof undefined, typeof Symbol('k'), typeof null,
  typeof {}, typeof [], typeof (() => {}),
];
console.log(types);`,
    'typeof across primitives and objects',
    'Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway).',
    [
      'Type(x) in the spec returns Null, Undefined, Boolean, String, Symbol, Number, BigInt, or Object.',
      'Primitives are compared by value; objects by reference (except with valueOf/toPrimitive in relational ops).',
      'ListFormat/engines may store small integers as immediates, still typeof "number".',
    ],
  ),

  'b1-type-string': e(
    'A string is an immutable sequence of 16-bit UTF-16 code units. Length counts code units, so some emoji are length 2. You create strings with quotes, backticks, or String(). Indexing with `[i]` returns a 1-character string or undefined, never a mutation.',
    'Text is the web’s core payload: HTML, JSON keys, URLs, user input. A dedicated immutable type keeps that cheap to share.',
    'A frozen strip of UTF-16 cells. Slice methods return new strips; they never edit the old one.',
    [
      'Prefer template literals for interpolation.',
      'Use codePointAt / for-of for Unicode characters, not always `[i]`.',
      'Compare with ===; there is no separate “string object” you need in modern code.',
      'Empty string is falsy; `"0"` is truthy.',
    ],
    `const s = 'hi';
console.log(s.length, s[0], s.toUpperCase());
console.log(s); // still 'hi'
const emoji = '🙂';
console.log(emoji.length, [...emoji]);
console.log('a' + 1);`,
    'Immutability, UTF-16 length, concatenation',
    '`s[0] = "X"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place.',
    [
      'String indexes are UTF-16 code units; surrogate pairs split across two units.',
      'Primitive strings intern/hash in engines; String objects are heap wrappers.',
      'ToString abstract operation is used in concatenation and template interpolation.',
    ],
  ),

  'b1-type-number': e(
    'number is IEEE-754 double-precision floating point: about 15–17 decimal digits, a 53-bit integer significand, and special values NaN, Infinity, -0. Integers past Number.MAX_SAFE_INTEGER (2^53-1) cannot all be represented. There is no distinct int type in the language (use bigint).',
    'JS shipped in 1995 with one numeric type to keep the language tiny. Doubles covered both money-ish math (badly) and array indexes (mostly).',
    'A 64-bit scientific-notation box. Integers are just doubles that happen to be whole — until they aren’t.',
    [
      'Use Number.isFinite / Number.isInteger for validation.',
      'Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2.',
      'Parse with Number() or parseInt with radix; watch NaN.',
      'Switch to bigint when you need integers beyond 2^53.',
    ],
    `console.log(0.1 + 0.2 === 0.3);
console.log(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1);
console.log(1 / 0, -1 / 0, 0 / 0);
console.log(Object.is(0, -0));`,
    'Float surprise, safe integer, infinities, -0',
    'Using parseInt("08") without radix in ancient engines, or parseInt("8px") silently returning 8 when you wanted NaN.',
    [
      'IEEE-754 round-to-nearest-even explains 0.1 + 0.2.',
      'ToInt32 is used by bitwise operators — numbers are truncated to 32-bit first.',
      'JSON numbers are still IEEE doubles after JSON.parse.',
    ],
  ),

  'b1-type-bigint': e(
    'bigint is an arbitrary-precision integer primitive written with `n` (`10n`). It cannot mix with number in arithmetic (`1n + 1` throws TypeError). It has no Infinity/NaN; division truncates toward zero. JSON.stringify throws on bigint unless you define a replacer.',
    'Safe integers max out at 2^53-1, which is too small for some IDs, cryptography, and financial integer math. bigint extends integers without changing number’s float behavior.',
    'An unlimited integer tape. It never becomes a float, and it refuses to silently mix with doubles.',
    [
      'Suffix `n` or `BigInt(string)` for construction.',
      'Convert explicitly: `Number(1n)` (may lose precision) or `BigInt(1)`.',
      'Use for IDs that arrive as strings from APIs if they exceed 2^53.',
      'Do not JSON.stringify raw bigints.',
    ],
    `const id = 9007199254740993n;
console.log(id + 1n);
try { console.log(id + 1); } catch (e) { console.log(e.name); }
console.log(5n / 2n);
console.log(0n === 0);`,
    'bigint arithmetic, no mixed ops, truncated division',
    '`9007199254740993` without `n` is already rounded as a number before you notice — the extra integer never existed.',
    [
      'typeof bigint is "bigint".',
      'Relational comparison can coerce number/bigint; === never does.',
      'Bitwise ops work on bigint with arbitrary width, not ToInt32.',
    ],
  ),

  'b1-type-boolean': e(
    'boolean has two values: true and false. Many operators produce booleans (`===`, `!`, `instanceof`). Conditions (`if`, `while`, `?:`) coerce with ToBoolean, so non-booleans also work. Boolean objects (`new Boolean(false)`) are truthy — never use them.',
    'Control flow needs a yes/no value. The primitive keeps that without allocating an object.',
    'A 1-bit flag. Wrapper objects are impostors: they are objects, therefore truthy even when they wrap false.',
    [
      'Prefer `===` / `!==` over truthiness when the value might be 0, "", or null.',
      'Use `Boolean(x)` or `!!x` for explicit conversion.',
      'Never `new Boolean()`.',
      'APIs should return real booleans, not 0/1, unless documented.',
    ],
    `console.log(Boolean(0), Boolean('0'), Boolean([]), Boolean({}));
const boxed = new Boolean(false);
if (boxed) console.log('boxed is truthy');
console.log(true === 1, true == 1);`,
    'ToBoolean vs boxed Boolean vs ==',
    '`if (new Boolean(false))` runs the then-branch — a classic interview gotcha.',
    [
      'ToBoolean: false, 0, -0, 0n, "", null, undefined, NaN are false; everything else true.',
      'Boolean objects have [[BooleanData]] internal slot; ToBoolean on objects is true.',
      'Logical operators return operands, not necessarily booleans.',
    ],
  ),

  'b1-type-undefined': e(
    'undefined means “this binding/property/argument has no value.” Uninitialized `let` after declaration (`let x`), missing arguments, missing object properties, and functions without return all yield undefined. It is a primitive, typeof "undefined". The global `undefined` can be shadowed as a variable name (do not).',
    'Dynamic objects and optional arguments need a distinct “nothing was provided” that is not null’s “author meant empty.”',
    'The default empty of the language. If you did not put a value, JS fills undefined — unless you used null on purpose.',
    [
      'Check missing props with === undefined, or the in operator / hasOwn.',
      'Default params run only for undefined, not for null.',
      'Do not return undefined on purpose when null is the domain “no entity.”',
      'void 0 is a reliable undefined value even if the name is shadowed.',
    ],
    `function f(a, b = 3) { return [a, b]; }
console.log(f(), f(1), f(1, undefined), f(1, null));
const o = {};
console.log(o.x, 'x' in o);
console.log((() => {})());`,
    'undefined in params, properties, and returns',
    'Default parameters do not trigger for `null` — `f(null)` keeps null, not the default.',
    [
      'Unresolvable references GetValue to undefined in some sloppy cases; strict throws on bare assignment.',
      'Missing property OrdinaryGet returns undefined without throwing.',
      'Completion [[Value]] undefined is the default for statements that do not produce a value.',
    ],
  ),

  'b1-type-null': e(
    'null is a primitive meaning “intentional empty object reference.” typeof null is "object" (legacy bug). It is falsy, equal to undefined with `==` but not with `===`. JSON uses null; many APIs use null for “no resource.” It is not the same as a missing property (undefined).',
    'OOP languages distinguish “no object” from “uninitialized.” JS kept null for that signal, especially when talking to Java/DOM in the 1990s.',
    'A parked empty pointer you chose. undefined is “nobody parked anything”; null is “I parked an empty sign.”',
    [
      'Use === null when you mean the null value.',
      'Do not use null to initialize numbers/strings; use 0 or "".',
      'JSON.stringify omits undefined properties but keeps null.',
      'document.getElementById returns null, not undefined.',
    ],
    `console.log(typeof null, null == undefined, null === undefined);
console.log(JSON.stringify({ a: null, b: undefined }));
const el = { query: () => null };
console.log(el.query() ?? 'missing');`,
    'null vs undefined in equality and JSON',
    '`typeof x === "object" && x` is the old null check pattern because typeof null is object.',
    [
      'Type(null) is Null, distinct from Object despite typeof.',
      'ToObject(null) throws TypeError — you cannot autobox null.',
      '== uses the spec table that equates null and undefined only to each other.',
    ],
  ),

  'b1-type-symbol-overview': e(
    'symbol is a primitive unique ID: `Symbol("desc")` never equals another symbol except the exact same reference. Symbols can be object keys that do not show up in Object.keys or JSON. Well-known symbols (Symbol.iterator, toStringTag, toPrimitive) hook language protocols. Symbol.for shares a runtime-wide registry.',
    'Objects needed collision-free property names for libraries (meta protocols) without inventing a new object type for every flag.',
    'A unique opaque sticker. Two stickers with the same description are still different unless you used Symbol.for.',
    [
      'Create with Symbol("hint") for per-instance uniqueness.',
      'Use as computed keys: `{ [id]: value }`.',
      'Enumerate with Object.getOwnPropertySymbols when needed.',
      'Do not overuse; strings are fine for public APIs.',
    ],
    `const id = Symbol('id');
const user = { name: 'Ada', [id]: 7 };
console.log(user[id], Object.keys(user));
console.log(Symbol('id') === Symbol('id'));
console.log(Symbol.for('x') === Symbol.for('x'));`,
    'Unique keys vs Symbol.for registry',
    'JSON.stringify drops symbol keys — data vanishes if you thought they would serialize.',
    [
      'typeof symbol is "symbol"; they are primitives, not objects.',
      'Ordinary objects allow symbol keys in [[OwnPropertyKeys]] after string keys.',
      'Well-known symbols are shared across realms in a defined way per spec (same realm typically).',
    ],
  ),

  'b1-objects-as-values': e(
    'Objects are collections of properties with identity on the heap. Arrays, functions, dates, maps, and your `{ }` literals are all objects. Assigning an object copies the reference, not the property bag. Property keys are strings or symbols. Objects are mutable by default.',
    'JS models everything structured — DOM nodes, hashes, modules — as objects so one property system and prototype chain can serve all of them.',
    'A heap record with a pointer. Two variables can hold the same pointer; mutating through one is visible through the other.',
    [
      'Create with `{}`, `Object.create`, classes, or `new`.',
      'Access with `.` or `[]`.',
      'Compare identity with ===; compare contents with a deep helper you control.',
      'Prototype chain supplies inherited methods like toString.',
    ],
    `const a = { n: 1 };
const b = a;
b.n = 2;
const c = { n: 2 };
console.log(a.n, a === b, a === c);
console.log(typeof a, typeof [1], typeof (() => {}));`,
    'Shared reference vs equal-looking object',
    '`const copy = original` does not copy. Later mutations “mysteriously” change both names.',
    [
      'Ordinary objects have [[Prototype]], [[Extensible]], and a property table.',
      'Exotic objects (arrays, typed arrays) override internal methods like [[DefineOwnProperty]].',
      'Functions are callable objects with [[ThisMode]] and [[Environment]].',
    ],
  ),

  'b1-primitive-vs-reference': e(
    'Primitives are copied by value: assigning `b = a` for numbers/strings gives two independent values. Objects are references: assigning copies the pointer. Equality for primitives is by value (with NaN/-0 caveats); for objects it is identity. Functions receive copies of the primitive or copies of the reference.',
    'Cheap atomic values should not need heap identity. Structured data should be shareable without cloning on every assign.',
    'Index cards vs street addresses. Passing an address lets the callee rearrange furniture in your house.',
    [
      'Reassigning a parameter that is a number does not change the caller’s variable.',
      'Mutating a parameter that is an object does change the caller’s object.',
      'Clone if you need isolation (`structuredClone`, spread for shallow).',
      '=== on two `{a:1}` literals is false.',
    ],
    `function bump(n, obj) {
  n = n + 1;
  obj.n = obj.n + 1;
}
let n = 1;
const o = { n: 1 };
bump(n, o);
console.log(n, o.n);
console.log({ a: 1 } === { a: 1 });`,
    'Primitive param copy vs object mutation',
    'Saying “JS is pass-by-reference.” It is pass-by-value of the reference (call-by-sharing).',
    [
      'GetValue on a primitive reference yields an immutable value copy at the language level.',
      'Object values are pointers to the same completion of OrdinaryObjectCreate.',
      'NaN is a primitive that is not === to itself — value comparison is still not always simple.',
    ],
  ),

  'b1-immutability-primitives': e(
    'Primitive values cannot be changed in place. `str.toUpperCase()` returns a new string. Number methods do not edit the number. Even though autoboxing lets you write `"hi".length`, there is no way to set `"hi"[0]`. Const vs let only affects the binding, but the primitive value itself was always immutable.',
    'Immutable atoms are easy to share across the stack and across threads of reasoning: nothing aliases a mutating 5.',
    'You never sharpen the same pencil; you throw it away and pick up a new one with a new value.',
    [
      'Any “change” to a string/number/boolean is a new value.',
      'Store the returned value: `s = s.trim()`.',
      'Do not expect `s[0] = "A"` to work.',
      'Frozen objects are a separate, shallow concept.',
    ],
    `let s = ' ada ';
s.trim();
console.log(s); // still padded
s = s.trim().toUpperCase();
console.log(s);
const n = 1;
console.log(n.toFixed(2), n);`,
    'Must capture new primitive returns',
    'Calling trim without assignment and wondering why the UI still shows spaces.',
    [
      'String exotic objects used internally for autoboxing are discarded after the property access.',
      'Primitive values have no [[Set]] of character slots.',
      'Interning may reuse string identity for equal contents; that is an engine optimization, not mutability.',
    ],
  ),

  'b1-object-mutability': e(
    'Objects are mutable unless you freeze/seal them or use immutable patterns. Adding, deleting, or changing properties is visible to every reference. Nested objects need nested copies for a true snapshot. Arrays are objects: `push` mutates the same array.',
    'UI state, DOM nodes, and caches need in-place updates for performance and identity (React keys, Maps). Mutability is the default because cloning everything would be expensive.',
    'One house, many keys. Anyone with a key can move the furniture. Freeze is taping the drawers shut (shallow).',
    [
      'Mutate when you own the object and identity should stay.',
      'Copy-on-write (spread) when you must not surprise other holders.',
      'Object.freeze is shallow — nested objects still mutate.',
      'Track aliasing: who else stored this pointer?',
    ],
    `const state = { user: { name: 'Ada' }, tags: ['js'] };
const alias = state;
alias.tags.push('html');
const next = { ...state, tags: [...state.tags, 'css'] };
console.log(state.tags, next.tags, state.user === next.user);`,
    'In-place mutate vs shallow copy',
    'Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy.',
    [
      '[[Set]] / [[DefineOwnProperty]] mutate the same ordinary object identity.',
      'Extensible flag + freeze change whether new properties can appear.',
      'React/Redux immutability is a convention on top of mutable objects, not a language mode.',
    ],
  ),

  'b1-call-by-sharing': e(
    'JS passes arguments by value, but the value of an object is a reference. The callee gets a copy of the pointer. Rebinding the parameter (`obj = {}`) does not rebind the caller’s variable. Mutating properties does. This is sometimes called call-by-sharing.',
    'Implementers wanted cheap argument passing without full copies, while still making primitives behave like values.',
    'You photocopy a slip of paper with an address. The callee can visit the house (mutate) or throw away their photocopy (rebind) without changing your slip.',
    [
      'To isolate, clone before mutating in the callee.',
      'To replace the caller’s object, return a new object and assign at the call site.',
      'Primitives: callee rebind never affects caller.',
      'Document functions as “mutates args” vs “pure.”',
    ],
    `function rebind(obj) { obj = { n: 99 }; }
function mutate(obj) { obj.n = 99; }
const a = { n: 1 };
const b = { n: 1 };
rebind(a);
mutate(b);
console.log(a.n, b.n);`,
    'Rebind vs mutate of an object parameter',
    'Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot.',
    [
      'Call evaluates arguments to values, then copies them into parameter bindings.',
      'Those parameter bindings are distinct environment slots from the caller’s.',
      'The object identity in the slot is the same heap pointer until rebound.',
    ],
  ),

  'b1-typeof': e(
    '`typeof` is a unary operator that returns a string tag: "undefined", "boolean", "number", "bigint", "string", "symbol", "function", or "object". It never throws on an undeclared name (`typeof notDefined === "undefined"`). It cannot distinguish arrays, null, or dates from generic objects without extra tests.',
    'A dynamic language needs a cheap runtime tag check for branching and feature detection.',
    'A coarse luggage label, not a full passport. Functions get a special label; arrays do not.',
    [
      'Use typeof for primitives and for “is there a function named fetch.”',
      'Use Array.isArray for arrays.',
      'Use === null for null.',
      'Use instanceof or brand checks for your classes, knowing realm issues.',
    ],
    `console.log(typeof undefined, typeof 1, typeof 1n, typeof 'a');
console.log(typeof true, typeof Symbol(), typeof function () {});
console.log(typeof null, typeof [], typeof {});
console.log(typeof undeclaredName);`,
    'typeof table including undeclared',
    '`typeof [] === "array"` is false — it is "object".',
    [
      'typeof uses Type() plus a special case for callable objects → "function".',
      'Host objects historically returned weird strings ("unknown" in old IE).',
      'typeof on a TDZ let throws — undeclared is the only “safe” missing name.',
    ],
  ),

  'b1-typeof-null': e(
    '`typeof null` is `"object"` because of an early implementation bug (null’s type tag was 0, same as object) that was then frozen for compatibility. null is not an object: you cannot set properties on it, and ToObject(null) throws. Always test null with `=== null`.',
    'Fixing typeof would have broken the web’s existing checks. The spec documented the lie instead of correcting it.',
    'A forged passport that says “object.” Border control (=== null) is the real ID check.',
    [
      'Never use typeof alone to mean “is object.”',
      'Pattern: `val !== null && typeof val === "object"`.',
      'Remember functions are objects too if you want “non-null object including arrays.”',
      'Quiz answer: it is a legacy bug, not a deep philosophy.',
    ],
    `function isNonNullObject(v) {
  return v !== null && (typeof v === 'object' || typeof v === 'function');
}
console.log(typeof null);
console.log(isNonNullObject(null), isNonNullObject([]), isNonNullObject(() => {}));`,
    'Correct non-null object check',
    '`if (typeof x === "object") x.y` crashes when x is null.',
    [
      'The spec’s Type(null) is Null; typeof’s extra table maps Null → "object".',
      'typeof is not Object.prototype.toString; the latter yields "[object Null]".',
      'Document.all in browsers is a further typeof quirk (undefined-like object).',
    ],
  ),

  'b1-undefined-vs-null': e(
    'undefined: missing value (not assigned, not passed, not returned, not on the object). null: intentional emptiness, often “no object.” Undeclared: no binding exists; reading it throws ReferenceError (except typeof). `==` equates null and undefined; `===` does not. Default parameters treat only undefined as missing.',
    'Three different “nothing”s exist because JS grew in layers: missing properties, DOM’s null, and true unbound names.',
    'Undeclared is a missing mailbox. undefined is an empty mailbox. null is a mailbox with a card that says “empty on purpose.”',
    [
      'Use === to distinguish null and undefined when both can appear.',
      'Use ?? when either should fall through to a default.',
      'Fix undeclared by declaring — it is a bug, not a value.',
      'JSON: undefined properties vanish; null stays.',
    ],
    `let declared;
console.log(declared);
console.log(null ?? 'default', undefined ?? 'default', 0 ?? 'default');
try { console.log(notThere); } catch (e) { console.log(e.name); }
console.log(typeof notThere);`,
    'undefined vs null vs undeclared vs ??',
    'Using `== null` accidentally treats undefined and null the same — sometimes you want that, sometimes you do not. Say it out loud.',
    [
      'Unresolvable Reference: GetValue throws in strict mode for bare reads of undeclared names.',
      'Empty slot in arrays is undefined when read, but hasOwn is false (holes).',
      'Optional parameters: arguments.length vs undefined sentinels differ.',
    ],
  ),

  'b1-nan-infinity': e(
    'NaN means “not a number” — invalid numeric results (0/0, parse failures). NaN !== NaN. Infinity and -Infinity are overflows (1/0). Number.MAX_VALUE is the largest finite double; beyond that you get Infinity. Safe integers are a subset of numbers, not a separate type.',
    'IEEE-754 needed sentinels instead of throwing on every bad math op, so one slow script would not halt the page.',
    'NaN is a poisoned number that contaminates arithmetic. Infinity is a number that got too large, not an error object.',
    [
      'Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN.',
      'Check Infinity with Number.isFinite.',
      'Do not use NaN as a missing-value sentinel if you can use null.',
      'JSON.parse("NaN") is invalid JSON; JSON has no NaN.',
    ],
    `console.log(Number('x'), 0 / 0, 1 / 0);
console.log(NaN === NaN, Number.isNaN(NaN), isNaN('x'));
console.log(Number.isFinite(1 / 0), Number.MAX_SAFE_INTEGER);
console.log(Infinity - Infinity);`,
    'NaN inequality, isNaN coercion, Infinity',
    'global isNaN("hello") is true because it coerces to NaN — Number.isNaN("hello") is false.',
    [
      'IEEE NaN encodings; JS has a single NaN value at the language level.',
      'ToNumber("foo") → NaN is used by implicit coercion.',
      'Object.is(NaN, NaN) is true — the SameValue algorithm.',
    ],
  ),

  'b1-number-isnan': e(
    'Number.isNaN(x) is true only if x is actually the number NaN. It does not coerce. The global isNaN(x) runs ToNumber first, so isNaN(undefined) and isNaN("foo") are true. After ES2015, Number.isNaN is the correct check.',
    'The original isNaN was built when everything was loosely typed and coercion was considered helpful. It made “is this NaN?” useless for type checks.',
    'Number.isNaN asks “is this already NaN?” Global isNaN asks “would this become NaN if I forced a number?”',
    [
      'Always prefer Number.isNaN for detecting NaN.',
      'Alternatively `Object.is(x, NaN)` or `x !== x`.',
      'Validate inputs with Number.isFinite if you need a real finite number.',
      'Do not use isNaN to test numeric strings.',
    ],
    `console.log(Number.isNaN(NaN), Number.isNaN('NaN'), Number.isNaN(undefined));
console.log(isNaN(NaN), isNaN('NaN'), isNaN(undefined));
const x = 0 / 0;
console.log(x !== x);`,
    'Number.isNaN vs global isNaN',
    'Filtering with `!isNaN(x)` keeps numeric strings like "10" and drops nothing useful for type-safe arrays.',
    [
      'Number.isNaN is specified as Type(x) is Number and x is NaN.',
      'Global isNaN is ToNumber then comparison with NaN.',
      'x !== x is a popular interview equivalent because NaN is the only value not equal to itself.',
    ],
  ),

  'b1-object-is': e(
    'Object.is(a, b) implements the SameValue algorithm: like `===` except that Object.is(NaN, NaN) is true and Object.is(0, -0) is false. Use it when those two edge cases matter (maps, sets internals, React’s Object.is state comparison). For everyday code, `===` is still the default.',
    'Spec algorithms needed a comparison that treats NaN as identical to itself (Map/Set keys, Object.defineProperty unchanged checks). Object.is exposed that algorithm.',
    '=== with two patches: NaN equals NaN, and the sign of zero counts.',
    [
      'Use === unless you are implementing Map-like semantics or detecting -0.',
      'React Object.is compares state to skip renders — NaN state will look “equal.”',
      'Do not use Object.is for deep equality.',
      'Document why you chose Object.is so readers do not “simplify” to ===.',
    ],
    `console.log(Object.is(NaN, NaN), NaN === NaN);
console.log(Object.is(0, -0), 0 === -0);
console.log(Object.is(1, 1), Object.is({}, {}));
console.log(1 / Object.is(0, -0) ? -0 : 0);`,
    'SameValue vs strict equality',
    'Assuming Object.is is “deeper ===.” It is still reference equality for objects.',
    [
      'SameValue vs SameValueZero (Set/Map use SameValueZero, where +0 and -0 are equal).',
      'Object.is is not SameValueZero — Map keys 0 and -0 collide.',
      'defineProperty uses SameValue to decide if a value changed.',
    ],
  ),

  'b1-autoboxing': e(
    'Autoboxing (ToObject on primitives) wraps a string/number/boolean in a temporary String/Number/Boolean object so `"hi".toUpperCase()` works. The wrapper is thrown away after the statement. Assigning properties to primitives is silently ignored in sloppy mode or throws in strict. You should almost never write `new String()`.',
    'Primitives needed methods without making every number a heap object. Temporary wrappers reuse Object.prototype method dispatch.',
    'A costume the primitive wears for one property access, then takes off. Anything you pin on the costume vanishes.',
    [
      'Call methods on primitives freely: they work via autoboxing.',
      'Never `new Boolean`/`new Number`/`new String` — they are truthy objects.',
      'typeof new String("a") is "object".',
      'Strict mode: assigning `"a".x = 1` throws TypeError.',
    ],
    `'use strict';
console.log('hi'.toUpperCase());
try { 'hi'.oops = 1; } catch (e) { console.log(e.name); }
console.log(typeof new String('hi'), Boolean(new String('')));`,
    'Method call vs leftover wrapper objects',
    '`new Boolean(false)` is truthy; `new String("")` is truthy — wrappers break conditionals.',
    [
      'GetValue of a property on a primitive: ToObject, [[Get]], discard wrapper.',
      'String objects are exotic with integer indexed characters.',
      'Boxed primitives compare by identity, not by wrapped value, with ===.',
    ],
  ),

  'b1-truthy-falsy': e(
    'A value is falsy if ToBoolean is false: false, 0, -0, 0n, "", null, undefined, NaN. Everything else is truthy, including "0", "false", [], {}, and empty Map. `if (value)` uses this conversion. Logical &&/|| return operands, not booleans.',
    'Conditions needed to accept any value so `if (name)` could mean “has a non-empty string” in sloppy UI code. The list of falsy values is fixed by the spec.',
    'A short blacklist of “empty-ish” values. If it is not on the list, the `if` branch runs — even empty arrays.',
    [
      'Memorize the falsy list; do not guess.',
      'Use explicit `=== 0` / `=== ""` when those are valid data.',
      '`arr.length` is a number; `if (arr)` is always true for arrays.',
      '`!!value` or Boolean(value) to force a real boolean.',
    ],
    `const samples = [false, 0, 0n, '', null, undefined, NaN, '0', [], {}, 'false'];
for (const v of samples) {
  console.log(JSON.stringify(v), Boolean(v));
}`,
    'Truthy/falsy of common values',
    '`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition.',
    [
      'ToBoolean table is exhaustive in the spec.',
      'Document.all is a falsy object in browsers (deliberate spec exception).',
      '&& and || use ToBoolean internally but return the chosen operand.',
    ],
  ),

  "b1-instanceof": e(
    "instanceof tests whether an object’s prototype chain contains the prototype property of a constructor. Left operand should be an object; primitives return false (except boxed wrappers). Cross-realm objects (iframe, vm) fail instanceof because each realm has its own Array/Object constructors.",
    "OOP code needed a runtime ‘is-a’ check that follows the same chain property lookup uses, without a separate type tag for every class.",
    "Walk up [[Prototype]] looking for C.prototype. If you never find it, the answer is false — even if the object ‘looks like’ an array.",
    [
      "Use Array.isArray for arrays; it is realm-safe.",
      "Use instanceof for your own classes in the same realm.",
      "null/undefined throw; other primitives return false.",
      "Symbol.hasInstance lets a constructor customize the check.",
    ],
    "class Animal {}\nclass Dog extends Animal {}\nconst d = new Dog();\nconsole.log(d instanceof Dog, d instanceof Animal, d instanceof Object);\nconsole.log([] instanceof Array, [] instanceof Object);\nconsole.log('hi' instanceof String, new String('hi') instanceof String);\ntry { null instanceof Object; } catch (e) { console.log(e.name); }\n",
    "instanceof along a class chain vs primitives",
    "[] instanceof Array is false across iframes; Array.isArray stays true.",
    [
      "OrdinaryHasInstance walks [[Prototype]] until null or a match on C.prototype.",
      "If C has @@hasInstance, that function is called instead.",
      "Bound functions use the target’s prototype for instanceof.",
    ],
  ),

  "b1-tostringtag": e(
    "Symbol.toStringTag is a well-known symbol whose string value Object.prototype.toString reads to build '[object Tag]'. Built-ins set it (Map → 'Map'). You can set it on your objects for better debugging tags. It is not a security boundary — anyone can fake a tag.",
    "typeof is too coarse. DevTools and old duck-typing used Object.prototype.toString.call(x) to distinguish Map vs Object vs Date.",
    "A name badge toString looks at when you call the default Object.prototype.toString, not when you JSON.stringify.",
    [
      "Inspect with Object.prototype.toString.call(value).",
      "Set [Symbol.toStringTag]: 'MyType' on a prototype.",
      "Do not use the tag as an auth or integrity check.",
      "Prefer instanceof / Array.isArray / brand checks for logic.",
    ],
    "const box = {\n  [Symbol.toStringTag]: 'Box',\n};\nconsole.log(Object.prototype.toString.call(box));\nconsole.log(Object.prototype.toString.call(new Map()));\nconsole.log(Object.prototype.toString.call([]));\nconsole.log(Object.prototype.toString.call(async function () {}));\n",
    "Custom and built-in toString tags",
    "Trusting '[object User]' from toString as proof of type — it is forgeable.",
    [
      "Object.prototype.toString uses @@toStringTag if present and is a string.",
      "Built-ins have default tags even without an own property in some cases (spec tables).",
      "Proxy can trap get for @@toStringTag and lie.",
    ],
  ),

  "b1-explicit-conversion": e(
    "Explicit conversion is when you call String, Number, Boolean, parseInt, BigInt, or unary plus on purpose. You control the moment and the algorithm, unlike implicit coercion in == or +. Explicit still uses the same ToString/ToNumber/ToBoolean abstract ops — it is not a different kind of math.",
    "Dynamic types mean values arrive as the wrong shape (form strings, JSON). Converting at the boundary keeps the rest of the program on one type.",
    "A customs checkpoint: stamp the passport (type) before the value enters your logic, instead of hoping operators guess.",
    [
      "Convert at I/O boundaries (query params, JSON, DOM input.value).",
      "Prefer Number() / BigInt() over parseInt when the whole string should be a number.",
      "Boolean() for real booleans; !! is the same ToBoolean.",
      "Never mix implicit == with explicit conversion in the same check without a reason.",
    ],
    "const raw = '42';\nconsole.log(String(10), Number(raw), Boolean(raw));\nconsole.log(Number(''), Number('  '), Number('42px'));\nconsole.log(parseInt('42px', 10), parseFloat('3.14px'));\nconsole.log(Boolean('false'), Boolean(0));\n",
    "String/Number/Boolean vs parseInt on messy input",
    "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks.",
    [
      "String(x) is ToString; Number(x) is ToNumber; Boolean(x) is ToBoolean.",
      "parseInt is not ToNumber: it stops at the first non-digit.",
      "valueOf/toString of objects run during ToPrimitive inside these ops.",
    ],
  ),

  "b1-string-conversion": e(
    "String(x) (and template interpolation) convert using ToString: null becomes 'null', undefined 'undefined', numbers use decimal, objects go through ToPrimitive then ToString. String(obj) is not JSON. new String(x) boxes a string object — avoid it.",
    "Printing, hashing keys, and concatenation all need a text form. A single ToString algorithm keeps those consistent.",
    "Every value can be asked ‘what is your label?’ That label is a primitive string, not a clone of the object.",
    [
      "Use String(x) or `${x}` for labels and logs.",
      "Use JSON.stringify when you need structure.",
      "Do not rely on Array toString (join with commas) for serialization.",
      "Symbol throws in String() when used in templates without explicit String(sym).",
    ],
    "console.log(String(null), String(undefined), String(10));\nconsole.log(String([1, 2]), String({ a: 1 }));\nconsole.log(String(true), String(1n));\ntry { `${Symbol('k')}`; } catch (e) { console.log(e.name); }\nconsole.log(String(Symbol('k')));\n",
    "ToString of primitives, arrays, objects, symbols",
    "String({}) is '[object Object]' — it looks like a useful dump and is not.",
    [
      "OrdinaryToPrimitive hint string prefers toString then valueOf.",
      "Array.prototype.toString is join, which recursively ToString elements.",
      "Symbols throw in ToString unless they go through String() explicitly in some paths; templates throw.",
    ],
  ),

  "b1-number-conversion": e(
    "Number(x) uses ToNumber: true→1, false→0, null→0, undefined→NaN, ''→0, whitespace-only strings→0, '0x10'→16, objects via ToPrimitive. BigInt throws. Leading/trailing spaces are allowed on numeric strings; '10a' is NaN.",
    "Forms and JSON give text. The language needed one numeric parse for operators and one constructor you can call on purpose.",
    "A strict-ish whole-string numeric parse (not parseInt). Garbage anywhere besides surrounding space becomes NaN — except the surprising empties that become 0.",
    [
      "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty.",
      "Use parseInt/parseFloat when suffixes should be ignored.",
      "Convert bigint with Number(bigint) only if it fits.",
      "Boolean true is 1 — rarely what you want from a checkbox without care.",
    ],
    "const samples = [true, false, null, undefined, '', '  ', '8', '08', '0x10', '10px', '1_000'];\nfor (const v of samples) console.log(JSON.stringify(v), Number(v));\nconsole.log(Number({ valueOf: () => 7 }));\n",
    "ToNumber table for common inputs",
    "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them.",
    [
      "ToNumber on strings: trim, then StrDecimalLiteral / hex; underscores in numeric literals are syntax, not in ToNumber strings.",
      "ToPrimitive hint number prefers valueOf then toString.",
      "Number(bigint) is an explicit conversion that may lose precision; mixed arithmetic throws.",
    ],
  ),

  "b1-boolean-conversion": e(
    "Boolean(x) is ToBoolean: only false, 0, -0, 0n, '', null, undefined, and NaN become false. Boolean('false') is true. Double-bang !!x is the same conversion. It does not parse the word false.",
    "if/while needed a yes/no from any value. Exposing Boolean() lets you store a real boolean instead of relying on later coercion.",
    "A membership test against a tiny falsy set. The word ‘false’ is just a non-empty string.",
    [
      "Use Boolean(x) or !!x at API boundaries.",
      "Parse actual 'true'/'false' strings yourself.",
      "Do not Boolean(array) to mean ‘non-empty’ — use length.",
      "Avoid new Boolean; it is an object.",
    ],
    "console.log(Boolean('false'), Boolean(''), Boolean('0'));\nconsole.log(Boolean([]), Boolean({}), Boolean(new Boolean(false)));\nconst raw = 'true';\nconsole.log(raw === 'true', Boolean(raw));\nconsole.log(!!0, !!1, !!0n);\n",
    "Boolean() does not parse the word false",
    "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse.",
    [
      "ToBoolean is a fixed table; objects are always true (except document.all).",
      "Boolean as a function vs constructor: without new it returns a primitive.",
      "Logical operators do not call Boolean() for their return value; they return operands.",
    ],
  ),

  "b1-parseint-parsefloat": e(
    "parseInt(string, radix) reads a prefix of digits in a given base and stops at the first invalid character. parseFloat reads a decimal prefix. They ignore trailing junk ('10px' → 10). Without radix, parseInt('08') is 8 in modern engines but was octal in ancient ones. parseInt of a number still ToStrings first (parseInt(0.0000008) is a famous mess).",
    "HTML attributes and CSS-like strings mix numbers with units. Stopping at the first non-digit was convenient for '12px'.",
    "A scanner, not a full-string validator. It is happy to return 10 from '10px' and NaN from ''.",
    [
      "Always pass radix 10 for decimal text.",
      "Use Number() when the entire string must be numeric.",
      "Check Number.isNaN(parseInt(s, 10)).",
      "Do not parseInt floats expecting rounding of the fraction — it stops at '.'.",
    ],
    "console.log(parseInt('10px', 10), parseFloat('3.14px'));\nconsole.log(parseInt('08', 10), parseInt('08', 8));\nconsole.log(parseInt('101', 2));\nconsole.log(parseInt(''), parseInt('  12', 10));\nconsole.log(parseInt(0.0000008));\nconsole.log(parseInt(8.9, 10));\n",
    "Prefix parsing, radix, and the 0.0000008 trap",
    "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString.",
    [
      "parseInt: ToString, strip whitespace, optional sign, radix heuristics, then digit loop.",
      "Radix 0 means detect 0x hex; remaining decimal in modern spec (no octal 0 prefix).",
      "parseFloat does not take a radix; hex strings are not hex there.",
    ],
  ),

  "b1-unary-plus": e(
    "Unary plus (+x) is ToNumber in operator form: +'12' is 12, +true is 1, +[] is 0, +{} is NaN, +null is 0. It is popular for coercing numeric strings quickly. Dates become milliseconds. It does not parse units like parseInt.",
    "A terse numeric cast matches C’s unary plus and keeps expressions compact in numeric code.",
    "A pocket Number() button glued to the front of a value.",
    [
      "Use +str only when you know the string is a clean number.",
      "Prefer Number() in team code if + is easy to miss next to concatenation.",
      "+new Date() is timestamp; date arithmetic often wants that.",
      "Do not use + to copy arrays or objects.",
    ],
    "console.log(+'42', +true, +false, +null, +undefined);\nconsole.log(+[], +[1], +['2'], +{});\nconsole.log(+new Date('2020-01-01T00:00:00Z'));\nconst s = '7';\nconsole.log(+s + +s, s + s);\n",
    "Unary plus vs string concatenation",
    "+' ' is 0; empty and whitespace become 0, same as Number('').",
    [
      "Unary + evaluates ToNumber(GetValue(expr)).",
      "Array ToPrimitive uses toString join; empty array → '' → 0.",
      "BigInt throws TypeError under unary +.",
    ],
  ),

  "b1-type-coercion": e(
    "Coercion is implicit conversion triggered by operators: + may stringify or add, == compares after ToNumber/ToPrimitive, if uses ToBoolean. It is the same abstract operations as explicit conversion, fired automatically. Most interview puzzles are ‘which To* ran?’",
    "1995 JS wanted '5' + 1 to show '51' in the page and if (name) to work. Convenience became a maze of tables.",
    "Operators secretly call Number/String/Boolean. If you cannot name which one, you will lose the puzzle.",
    [
      "Prefer ===, Number(), String() at boundaries.",
      "Know + is concatenation if either side is a string after ToPrimitive.",
      "Know == null is the one loose check many style guides allow.",
      "Never rely on [] + {} or {} + [] in production.",
    ],
    "console.log(1 + '2', '2' + 1, 1 + 2);\nconsole.log(1 == '1', 1 === '1', 0 == '', false == '0');\nconsole.log([] + {}, {} + []);\nconsole.log(true + true, true + '1');\n",
    "Implicit + and == coercion highlights",
    "[] == false is true while Boolean([]) is true — truthiness and == are different tables.",
    [
      "ApplyStringOrNumericBinaryOperator decides + after ToNumeric/ToString.",
      "Abstract Equality Comparison is a loop of type conversions in the spec.",
      "ToPrimitive hint default for + is number except for dates (string) historically via toString.",
    ],
  ),

  "b1-implicit-coercion": e(
    "Implicit coercion happens without a constructor call: if (x), x ? a : b, x && y, x == y, 1 + x, -x, x < y. You do not see ToNumber in source, but it ran. Explicit conversion is when the source shows String/Number/Boolean/parseInt.",
    "Shorter UI scripts. The cost is hidden control flow that interviewers love and production teams often ban.",
    "An automatic translator in the operator. You did not ask for a type change; the operator did.",
    [
      "Audit ==, +, and if (maybeZero) as coercion sites.",
      "Replace with === and explicit Number/String when types are mixed.",
      "Keep ToBoolean only when empty-string/null meaning ‘skip’ is intended.",
      "Unit-test boundary values: '', 0, '0', null.",
    ],
    "function implicit(x) {\n  if (x) return 'truthy branch';\n  return 'falsy branch';\n}\nconsole.log(implicit('0'), implicit(0), implicit([]));\nconsole.log('5' - 1, '5' + 1, '5' * '2');\nconsole.log(null >= 0, null == 0, null > 0);\n",
    "if-coercion vs relational vs == for null",
    "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0.",
    [
      "IfStatement uses ToBoolean on the condition.",
      "Relational comparison uses IsLessThan which ToPrimitive then ToNumber.",
      "Multiplicative * / % always ToNumber (or ToNumeric with bigint rules).",
    ],
  ),

  "b1-plus-coercion": e(
    "The + operator is overloaded: if either operand is a string after ToPrimitive, it concatenates; otherwise it adds numbers (or throws on mixed bigint). Unary plus is only ToNumber. {} + [] is parsed as a block plus an array in sloppy scripts, which is why puzzles print 0.",
    "HTML authors wanted 'Score: ' + n to work. One operator ended up meaning glue and add.",
    "Ask both sides for primitives. If a string showed up, glue. Else numeric add. Arrays become strings via join.",
    [
      "Convert both sides to numbers before adding if you mean math.",
      "Use template literals for strings to make intent obvious.",
      "Remember [] + [] is '' and [] + {} is '[object Object]'.",
      "bigint + number throws; convert explicitly.",
    ],
    "console.log(1 + 2, '1' + 2, 1 + '2');\nconsole.log([] + [], [] + {}, 1 + []);\nconsole.log(true + 1, null + 1, undefined + 1);\ntry { console.log(1n + 1); } catch (e) { console.log(e.name); }\n",
    "+ chooses concat vs add after ToPrimitive",
    "Wanting 1 + '2' to be 3 — it is '12'. Use Number or parseInt first.",
    [
      "ToPrimitive on each operand with no hint (default) except dates.",
      "If Type is String for either, concatenate ToString of both.",
      "Else ToNumeric and Number::add or BigInt::add.",
    ],
  ),

  "b1-equality": e(
    "JS has abstract equality ==, strict equality ===, and Object.is. === compares type and value with no coercion (except NaN is not equal to itself). == converts operands using a spec table until types match. Choose === by default; == is mainly for == null.",
    "Loose equality made '5' == 5 useful in forms. Strict equality was added so programs could stop guessing conversions.",
    "=== is a type-and-value passport check. == is a translator that keeps converting until the types match or it gives up.",
    [
      "Use === / !== in application code.",
      "Allow x == null as ‘null or undefined’ if the team agrees.",
      "Never use == with 0, '', false together without tests.",
      "Use Object.is when NaN or -0 identity matters.",
    ],
    "console.log(1 === '1', 1 == '1');\nconsole.log(null == undefined, null === undefined);\nconsole.log(0 == false, 0 === false, '' == false);\nconsole.log(NaN === NaN, Object.is(NaN, NaN));\nconsole.log([1] == 1, [1] === 1);\n",
    "Strict vs abstract vs Object.is",
    "true == 1 and '1' == true are true, but true == 'true' is false — == is not transitive in spirit.",
    [
      "Strict Equality Comparison: different types → false; then SameValueNonNumber / numbers.",
      "Abstract Equality Comparison may recurse after ToNumber/ToPrimitive.",
      "=== on objects is reference identity, same as == when both are objects.",
    ],
  ),

  "b1-abstract-equality": e(
    "== first compares types. If they differ, it converts: null==undefined is true; number vs string ToNumber’s the string; boolean ToNumber’s first; object vs primitive ToPrimitive’s the object. The algorithm is a table, not ‘make them look similar.’",
    "Early JS wanted fewer type errors in comparisons. The table is still in the spec for the web’s old pages.",
    "A flowchart on the interview whiteboard. If you skip a row (especially boolean→number), you miss the puzzle.",
    [
      "Do not memorize every pair; memorize the algorithm steps.",
      "Replace == with === unless you want null/undefined collapsing.",
      "Watch objects: [0] == false is true.",
      "Never use == with dates vs strings without intent.",
    ],
    "console.log(false == 0, false == '0', false == '');\nconsole.log([] == false, [] == 0, [] == '');\nconsole.log([1] == true, ['1'] == true);\nconsole.log(null == 0, undefined == 0, null == undefined);\n",
    "Abstract equality surprises with arrays and booleans",
    "[] == ![] is true: ![] is false, [] == false becomes [] == 0 becomes '' == 0 becomes 0 == 0.",
    [
      "If Type differs, prefer converting Boolean via ToNumber, then String/Number, then ToPrimitive on objects.",
      "null and undefined only match each other in this table.",
      "ToPrimitive on arrays uses toString join, producing '' for [].",
    ],
  ),

  "b1-strict-equality": e(
    "=== requires the same type. Numbers use IEEE equality (NaN===NaN is false, +0===-0 is true). Strings compare code units. Objects compare identity. No ToNumber on the other side. This is the comparison you want in almost all production checks.",
    "Developers needed a comparison that would not silently coerce, after years of == bugs.",
    "Same box shape and same contents for primitives; same heap address for objects.",
    [
      "Use === for numbers, strings, booleans, references.",
      "Check NaN with Number.isNaN, not ===.",
      "Do not expect {} === {} to be true.",
      "Combine with typeof when you must branch on type first.",
    ],
    "console.log(1 === 1, 1 === 1.0, 1 === '1');\nconsole.log(true === 1, null === undefined);\nconst a = {};\nconsole.log(a === a, a === {});\nconsole.log(+0 === -0, NaN === NaN);\n",
    "Strict equality: types, identity, zeros, NaN",
    "document.querySelector can return null; x === undefined misses null. Use == null or check both.",
    [
      "Number::equal treats NaN as unequal to everything, including NaN.",
      "+0 and -0 are equal in === (IEEE).",
      "BigInt and Number of the same magnitude are still different types → false.",
    ],
  ),

  "b1-inequality": e(
    "!= is the negation of == (abstract). !== is the negation of === (strict). They do not invert each operand; they invert the comparison result. Prefer !==. x != null is a common idiom meaning ‘neither null nor undefined.’",
    "If equality is overloaded, inequality must follow the same tables so `!(a == b)` matches `a != b`.",
    "Put a NOT in front of the whole equality test, not inside the values.",
    [
      "Use !== unless you intentionally want ==’s coercions.",
      "x != null is the allowed loose exception in many codebases.",
      "Do not mix != 0 with missing-value checks.",
      "Remember NaN !== NaN is true.",
    ],
    "console.log(1 != '1', 1 !== '1');\nconsole.log(null != undefined, null !== undefined);\nconst x = 0;\nconsole.log(x != null, x !== null, x != 0);\nconsole.log(NaN != NaN, NaN !== NaN);\n",
    "!= follows ==; !== follows ===",
    "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN.",
    [
      "a != b is specified as !(a == b), sharing Abstract Equality.",
      "a !== b is !(a === b).",
      "No extra ToBoolean is applied to the operands of !=.",
    ],
  ),

  "b1-to-primitive": e(
    "ToPrimitive turns an object into a primitive for operators (+, ==, <, Number()). It asks @@toPrimitive if present, else valueOf then toString (or the reverse for a string hint). If the result is still an object, TypeError. Dates historically prefer string hints for +.",
    "Operators are defined on primitives. Objects must nominate a primitive stand-in so + and == can proceed.",
    "The engine asks the object: ‘Give me a number-ish or string-ish atom.’ First successful primitive wins.",
    [
      "Implement Symbol.toPrimitive when you need one hook for all hints.",
      "Otherwise valueOf for numeric objects, toString for printable ones.",
      "Avoid objects whose valueOf returns another object.",
      "Do not rely on default Object valueOf (returns the object itself) plus toString.",
    ],
    "const n = {\n  [Symbol.toPrimitive](hint) {\n    console.log('hint', hint);\n    return hint === 'string' ? 'box' : 10;\n  },\n};\nconsole.log(+n, `${n}`, n + 1);\n",
    "Symbol.toPrimitive choosing by hint",
    "An object with valueOf returning {} falls through to toString; if that also fails, operators throw TypeError.",
    [
      "OrdinaryToPrimitive order depends on hint: number → valueOf, toString; string → reverse.",
      "hint default is number except for Date (string) and when @@toPrimitive is used with 'default'.",
      "ToPrimitive is invoked from ToNumber/ToString/ToPropertyKey as needed.",
    ],
  ),

  "b1-valueof": e(
    "valueOf is a method objects can provide to suggest a primitive, usually a number. Built-ins: Date.valueOf is timestamp, Number objects unwrap. Object.prototype.valueOf returns the object itself, which is useless for ToPrimitive until toString runs. Unary plus and numeric comparisons prefer valueOf when the hint is number.",
    "Boxed numbers and dates needed to participate in arithmetic without calling extra APIs.",
    "‘If you need a number from me, here it is.’ If I hand back another object, the engine keeps asking.",
    [
      "Return a primitive from valueOf.",
      "Prefer Symbol.toPrimitive in new code for clarity.",
      "Do not use valueOf for formatted display — that is toString.",
      "Remember JSON.stringify does not call valueOf (it uses toJSON/toString rules).",
    ],
    "const counter = {\n  n: 3,\n  valueOf() { return this.n; },\n  toString() { return '#' + this.n; },\n};\nconsole.log(+counter, String(counter), counter + 1);\nconsole.log(Object.prototype.valueOf.call(counter) === counter);\n",
    "valueOf for math vs toString for display",
    "Expecting JSON.stringify to use valueOf — it will not, so you get {} or toJSON instead.",
    [
      "OrdinaryToPrimitive Get(O, 'valueOf') and Call if callable.",
      "Date.prototype[@@toPrimitive] customizes hint default.",
      "valueOf on primitives via autoboxing returns the primitive data.",
    ],
  ),

  "b1-object-tostring": e(
    "Object.prototype.toString produces '[object Type]' using @@toStringTag. Instance toString overrides (Array join, Function source, Date locale) run instead when you String(obj) or concat. You usually override toString for readable logs, not for the [object Object] tag.",
    "Debugging and concatenation needed a fallback text for objects. Arrays chose join; generic objects chose the tag.",
    "If + wants a string and valueOf failed, toString is the next doorbell.",
    [
      "Override toString to return a primitive string.",
      "Use Object.prototype.toString.call for the tag.",
      "Do not parse '[object Object]' as useful data.",
      "Functions’ toString may reveal source; do not use it as a security check.",
    ],
    "const user = {\n  name: 'Ada',\n  toString() { return this.name; },\n};\nconsole.log('hi ' + user);\nconsole.log(Object.prototype.toString.call(user));\nconsole.log([1, 2].toString());\nconsole.log((function add(a, b) { return a + b; }).toString().includes('return'));\n",
    "Custom toString vs default tag vs Array join",
    "Logging an object with a throwing toString crashes DevTools formatters and template literals.",
    [
      "ToString on objects is ToPrimitive(string) then ToString of that primitive.",
      "Array.prototype.toString is join with comma, recursive.",
      "Function toString is implementation-defined source or native code placeholder.",
    ],
  ),

  "b1-symbol-toprimitive": e(
    "Symbol.toPrimitive is a method (hint) => primitive that overrides valueOf/toString for ToPrimitive. hint is 'number', 'string', or 'default'. Returning a non-primitive throws. This is the cleanest way to make an object work with +, ==, and templates predictably.",
    "valueOf vs toString order was easy to get wrong. One well-known symbol gives libraries a single conversion hook.",
    "A custom receptionist who reads the hint on the visitor badge and hands out a number or a string.",
    [
      "Implement one [Symbol.toPrimitive](hint) on the prototype.",
      "Switch on hint; default can match number or string as you design.",
      "Always return a primitive.",
      "Keep it pure — operators may call it more than once.",
    ],
    "const money = {\n  cents: 199,\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'string') return '$' + (this.cents / 100).toFixed(2);\n    return this.cents;\n  },\n};\nconsole.log(+money, String(money), money + 1);\nconsole.log(money == 199, money === 199);\n",
    "One toPrimitive hook for money",
    "== will still coerce; money == '$1.99' may not do what String(money) suggests depending on hint.",
    [
      "GetMethod(O, @@toPrimitive) then Call with hint.",
      "If the result is an Object, throw TypeError.",
      "Presence of @@toPrimitive skips OrdinaryToPrimitive entirely.",
    ],
  ),

  "b1-arithmetic-operators": e(
    "Binary + - * / % ** operate on numbers (IEEE) or bigints, not mixed. + also concatenates strings. % is remainder (sign follows dividend), not modulo in the mathematical sense for negatives. ** is exponentiation and is right-associative. Division by zero yields Infinity for numbers, throws RangeError for 0n.",
    "Scripts needed calculator ops in expressions. IEEE rules were reused instead of throwing on overflow.",
    "ToNumeric both sides, then refuse to mix bigint with number. + has a string fork before that.",
    [
      "Convert strings before math if you mean numbers.",
      "Use Number.isFinite on results when inputs can be garbage.",
      "For true modulo with negatives, adjust ((n % m) + m) % m.",
      "Parenthesize ** with unary minus: -(2 ** 2) vs -2 ** 2 (syntax error / ambiguity).",
    ],
    "console.log(7 + 2, 7 - 2, 7 * 2, 7 / 2, 7 % 2, 2 ** 3);\nconsole.log((-7) % 3, 7 % -3);\nconsole.log(1 / 0, 2 ** -1);\ntry { console.log(1n / 0n); } catch (e) { console.log(e.name); }\nconsole.log(8 ** 2 ** 3 === 8 ** 8);\n",
    "Arithmetic, remainder sign, bigint divide-by-zero",
    "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo.",
    [
      "ApplyStringOrNumericBinaryOperator vs numeric-only operators.",
      "Number::remainder uses IEEE remainder toward zero truncation of quotient.",
      "** uses Number::exponentiate; right-associativity is in the grammar.",
    ],
  ),

  "b1-assignment-operators": e(
    "= assigns. Compound operators (+= -= *= /= %= **= <<= >>= &= |= ^=) read the left, compute, write back. Logical assignment (&&= ||= ??=) short-circuits and may skip the write. Assignment is an expression returning the written value. Destructuring assignment unpacks on the left.",
    "Updating stored values is the write half of variables. Compound forms avoid repeating a long left-hand side.",
    "Compute a new primitive/object pointer, then PutValue into the reference on the left.",
    [
      "x += 1 is not always identical to x = x + 1 when getters have side effects (x is evaluated once in compound).",
      "const forbids = and compound assignment on the binding.",
      "obj.prop += 1 can invoke getters/setters.",
      "Do not confuse = with === in conditions.",
    ],
    "let n = 10;\nn += 5;\nn *= 2;\nlet s = 'a';\ns += 'b';\nconst o = { x: 1 };\no.x += 3;\nconsole.log(n, s, o.x, (n = 4));\n",
    "Compound assignment on numbers, strings, properties",
    "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===.",
    [
      "AssignmentExpression uses LeftHandSide and PutValue.",
      "Compound: lref, lval = GetValue, r, then apply op, PutValue.",
      "Logical assignment uses Boolean tests and may not call setters if short-circuit skips.",
    ],
  ),

  "b1-comparison-operators": e(
    "< > <= >= use IsLessThan after ToPrimitive. If both strings, they compare UTF-16 code units lexicographically ('10' < '2'). Otherwise ToNumber (or numeric bigint rules). NaN makes every relational false, including x < x. null becomes 0 in numeric relational tests.",
    "Sorting and branching need order. String order was defined as code units, which is fast but not dictionary language order.",
    "If both sides look like strings, dictionary of 16-bit units. Else convert to numbers and compare. NaN poisons the test to false.",
    [
      "Do not sort numeric strings with > without Number().",
      "Use localeCompare for human-language order.",
      "Check Number.isNaN before trusting <= chains.",
      "null >= 0 is true — do not use relational ops as null checks.",
    ],
    "console.log('10' < '2', 10 < 2, '10' < 2);\nconsole.log(null > 0, null >= 0, null == 0);\nconsole.log(NaN > 1, NaN < 1, NaN >= NaN);\nconsole.log('A' < 'a', 'é' < 'f');\n",
    "String vs numeric compare; null and NaN",
    "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'.",
    [
      "IsLessThan: ToPrimitive both; if both String, compare sequences; else ToNumeric.",
      "<= is !(greater than), so NaN <= NaN is false.",
      "BigInt vs Number comparison uses a mathematical compare without converting to IEEE in some cases.",
    ],
  ),

  "b1-logical-operators": e(
    "&& and || are short-circuiting and return an operand, not necessarily a boolean. || returns the first truthy, else the last. && returns the first falsy, else the last. ! ToBooleans and returns a boolean. ?? is not a synonym for || — it only skips null/undefined.",
    "JS used || for defaulting (`x = x || 10`) long before ?? existed. Returning operands enables that idiom.",
    "A picker, not a boolean factory. It walks left to right and stops when the answer is known.",
    [
      "Use ?? for defaults so 0 and '' can win.",
      "Use Boolean(a && b) if you truly need a boolean.",
      "Do not write a && doSideEffect() unless you like hidden control flow.",
      "! is ToBoolean then invert; !! forces a boolean.",
    ],
    "console.log(0 || 2, '' || 'fallback', 1 && 2 && 3);\nconsole.log(0 ?? 2, '' ?? 'fallback', null ?? 2);\nconsole.log(![], !'', !!'0');\nconst x = 0;\nconsole.log(x || 5, x ?? 5);\n",
    "|| vs ?? vs && return values",
    "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added.",
    [
      "LogicalOR: ToBoolean(lval) ? lval : rval — rval not evaluated if truthy.",
      "LogicalAND: ToBoolean(lval) ? rval : lval.",
      "Unary ! is !ToBoolean(GetValue(expr)).",
    ],
  ),

  "b1-short-circuit": e(
    "Short-circuit means the right operand of && / || / ?? is not evaluated if the left already decides the result. That skips function calls, throws, and increments on the right. Ternaries also evaluate only one branch. This is control flow disguised as an expression.",
    "Cheap guards (`obj && obj.x`) avoided errors before optional chaining. It is also a micro-optimization and a source of skipped side effects.",
    "Left doorperson. If they already know the answer, the right-hand guest never enters the building.",
    [
      "Put cheap checks on the left.",
      "Do not hide required side effects on the right of &&/||.",
      "Optional chaining ?. is a safer property guard than &&.",
      "?? only short-circuits when left is not nullish.",
    ],
    "let n = 0;\nfunction bump() { n += 1; return n; }\nconsole.log(true || bump(), n);\nconsole.log(false && bump(), n);\nconsole.log(null ?? bump(), n);\nconsole.log(0 ?? bump(), n);\n",
    "Which calls run under || && ??",
    "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid.",
    [
      "The spec uses If ToBoolean then return, else evaluate the other expression.",
      "No Call is performed if the right-hand CallExpression is not evaluated.",
      "Optional chaining has its own short-circuit: nullish left skips the rest of the chain.",
    ],
  ),

  "b1-unary-operators": e(
    "Unary operators take one operand: +, -, !, ~, typeof, void, delete, and prefix/postfix ++/--. Unary minus ToNumbers then negates (including -0). ~ is bitwise not after ToInt32. void expr evaluates and returns undefined. delete removes a property and returns a boolean.",
    "C-like languages expose these as compact expression forms. JS kept them, then added typeof/void/delete for a dynamic object model.",
    "A single-argument machine: coerce, then apply one transformation. Know which coerce (ToNumber vs ToBoolean vs ToInt32).",
    [
      "typeof before using a possibly-missing global.",
      "void 0 as a safe undefined.",
      "Prefer obj.prop = undefined vs delete unless you need the key gone.",
      "Do not use ~ as a clever indexOf check (`~arr.indexOf` is unreadable).",
    ],
    "console.log(+'3', -'3', !0, ~0);\nconsole.log(typeof null, void (1 + 2));\nconst o = { a: 1, b: 2 };\nconsole.log(delete o.a, o);\nconsole.log(void 0 === undefined);\n",
    "Unary plus/minus/not/tilde/typeof/void/delete",
    "delete arrayIndex leaves a hole (sparse), it does not reindex like splice.",
    [
      "typeof does not call GetValue on an unresolvable reference.",
      "delete on an unconfigurable property returns false or throws in strict mode.",
      "~ uses ToInt32; ~n === -(n+1) for 32-bit integers.",
    ],
  ),

  "b1-increment-decrement": e(
    "++ and -- add or subtract 1 after ToNumeric. Prefix (++x) returns the new value; postfix (x++) returns the old value. They require a reference (a variable or property), not a raw literal. On objects they ToPrimitive first. bigint works; mixed types follow ToNumeric rules.",
    "Loop counters needed a terse update. The prefix/postfix distinction came from C.",
    "Read, add one, write back. Postfix snapshots the old number to give to the surrounding expression.",
    [
      "Prefer i += 1 or i = i + 1 in team style if postfix confuses readers.",
      "Never use ++ on a const binding.",
      "Do not mix ++ inside larger expressions in interviews — it hides order.",
      "Postfix on obj.x still writes the new value; the expression result is the old one.",
    ],
    "let i = 0;\nconsole.log(i++, i);\nconsole.log(++i, i);\nconst o = { n: 1 };\nconsole.log(o.n++, o.n);\ntry { const c = 1; c++; } catch (e) { console.log(e.name); }\n",
    "Prefix vs postfix on bindings and properties",
    "arr[i++] = i copies using the old i as index but the new i as value — off-by-one puzzles.",
    [
      "Postfix: oldValue = ToNumeric(GetValue), PutValue(old+1), result is oldValue.",
      "The left-hand side is evaluated once (important for getters).",
      "Restricted production: newline cannot sit between operand and postfix ++.",
    ],
  ),

  "b1-ternary": e(
    "The conditional operator cond ? a : b evaluates cond with ToBoolean, then evaluates exactly one of a or b. It is an expression, so it can sit inside assignments and returns. Nesting ternaries is legal and often unreadable. It is not a replacement for if when branches are statements.",
    "Expressions needed an inline if so function returns and JSX-like trees could branch without extra statements.",
    "A three-hole expression: test, then only the chosen hole is evaluated (short-circuit).",
    [
      "Use for simple value selection.",
      "Break nested ternaries into named consts or ifs.",
      "Do not put side-effect-only calls in both branches unless needed.",
      "Remember it is right-associative: a ? b : c ? d : e.",
    ],
    "const n = 7;\nconst label = n % 2 === 0 ? 'even' : 'odd';\nconst abs = n < 0 ? -n : n;\nfunction pick(flag) {\n  return flag ? bump('yes') : bump('no');\n}\nfunction bump(s) { console.log('called', s); return s; }\nconsole.log(label, abs, pick(false));\n",
    "Ternary selects a value and skips the other branch",
    "n ? 'yes' : 'no' treats 0 as 'no'. Use n === 0 ? or explicit comparisons.",
    [
      "ConditionalExpression evaluates one branch only.",
      "Grammar is right-associative.",
      "Completion value of the chosen branch becomes the expression’s value.",
    ],
  ),

  "b1-precedence": e(
    "Precedence decides which operator binds first: ** before * / %, those before + -, then comparisons, then &&, then ||, then assignments (lowest among these). Associativity decides same-level grouping: most left-to-right; ** and = are right-to-right. Parentheses beat all of it. Unary binds tighter than binary *.",
    "A grammar must pick one tree for `1 + 2 * 3`. Humans should not have to memorize every row — parentheses are cheap.",
    "A binding-power ladder. When unsure, wrap it. Interviewers still expect * over + and && over ||.",
    [
      "Parenthesize mixed && and ||.",
      "Parenthesize bit ops; they are surprisingly low vs comparisons in JS.",
      "Do not rely on ASI plus prefix operators for grouping.",
      "Read ** as right-associative: 2 ** 3 ** 2 is 2 ** (3 ** 2).",
    ],
    "console.log(1 + 2 * 3, (1 + 2) * 3);\nconsole.log(true || false && false);\nconsole.log(2 ** 3 ** 2, (2 ** 3) ** 2);\nconsole.log(1 < 2 < 3, 3 > 2 > 1);\nconsole.log(4 / 2 / 2);\n",
    "Precedence, associativity, and chained comparisons",
    "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator.",
    [
      "The syntactic grammar encodes precedence via nested expression nonterminals.",
      "Bitwise & sits below equality, unlike C — a & b === c parses as a & (b === c).",
      "Comma operator has the lowest precedence of all.",
    ],
  ),

  "b1-optional-chaining": e(
    "?. short-circuits a property access, call, or index when the base is null or undefined, producing undefined instead of throwing. obj?.a.b still throws if a is null after a successful obj. It does not catch missing functions except with obj?.(). ?? often follows to supply a default.",
    "Deep optional JSON and DOM nodes made `obj && obj.a && obj.a.b` the national sport. ?. made the guard a language form.",
    "If the current base is nullish, stop the rest of this chain and yield undefined. Otherwise continue as normal `.`.",
    [
      "Use obj?.prop and obj?.method?.() for optional APIs.",
      "Do not write obj?.a.b unless a is guaranteed.",
      "arr?.[0] for possibly undefined arrays.",
      "delete obj?.prop is allowed and no-ops on nullish obj.",
    ],
    "const user = { profile: { city: 'Oslo' } };\nconsole.log(user.profile?.city, user.profile?.zip, user.missing?.x);\nconsole.log(user.foo?.(), undefined);\nconst n = null;\nconsole.log(n?.length);\ntry { console.log(user.profile?.city.notThere.x); } catch (e) { console.log(e.name); }\n",
    "?. stops only on nullish bases, not later missing objects",
    "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there).",
    [
      "Optional chaining is specified with a short-circuiting reference that becomes undefined.",
      "It is not a try/catch; other exceptions still throw.",
      "Call optional: if the base is nullish skip Call; if the property is non-callable you still get TypeError.",
    ],
  ),

  "b1-nullish-coalescing": e(
    "?? returns the right operand only when the left is null or undefined. 0, '', and false stay. It does not short-circuit on those falsy values. Mixing ?? with && or || without parentheses is a SyntaxError. Often paired with ?.",
    "|| as a default operator could not represent legitimate 0 or empty string. ?? is the defaulting operator that respects those.",
    "Replace only true emptiness (nullish), not ‘falsy’ emptiness.",
    [
      "Use value ?? default for config and props.",
      "Parenthesize when combining with || or &&.",
      "Do not use ?? to treat '' as missing unless you also check length.",
      "?? = exists as ??= for assign-if-nullish.",
    ],
    "const input = { count: 0, title: '', nick: null };\nconsole.log(input.count ?? 10, input.count || 10);\nconsole.log(input.title ?? 'n/a', input.title || 'n/a');\nconsole.log(input.nick ?? 'anon', input.missing ?? 'anon');\n",
    "?? keeps 0 and '' while || does not",
    "?? vs || is the interview: 0 is the example they will throw at you.",
    [
      "Evaluation: if left is undefined or null, evaluate right; else return left.",
      "It does not ToBoolean the left.",
      "Grammar forbids unparenthesized mix with &&/|| to avoid precedence surprises.",
    ],
  ),

  "b1-logical-assignment": e(
    "&&= ||= ??= assign only when the left’s test fails/succeeds: x ||= y assigns if x is falsy; x &&= y if x is truthy; x ??= y if x is nullish. If they skip, setters/getters on the left may not run for the write. They evaluate the left once.",
    "People wrote x = x || y constantly. Logical assignment makes in-place defaults a single operator without double lookup.",
    "Check the box; only then replace what is in the box. ??= is the nullish version of that.",
    [
      "obj.settings ??= {} to lazily create.",
      "Prefer ??= over ||= so 0 is kept.",
      "Remember skipped assignment means no setter call.",
      "Do not use ||= on numbers that can be 0.",
    ],
    "const o = { n: 0, s: '', x: null };\no.n ||= 5;\no.s ||= 'hi';\no.x ??= 9;\no.y ??= 1;\nconsole.log(o);\nlet a = 1;\na &&= 2;\nconsole.log(a);\n",
    "||= vs ??= vs &&= on an object",
    "o.count ||= 1 bumps a stored 0 to 1, resetting real data.",
    [
      "Specified to use the same short-circuit rules as || && ?? then PutValue if needed.",
      "Left-hand reference is resolved once (important for proxies/getters).",
      "If short-circuit skips, the assignment expression’s value is still the left’s value.",
    ],
  ),

  "b1-bitwise-operators": e(
    "& | ^ ~ << >> >>> convert operands with ToInt32 (>>> uses ToUint32 for the number). They are 32-bit, not full IEEE doubles, so they truncate. JS has no native unsigned 64-bit bitwise on number. bigint has arbitrary-width bitwise ops without 32-bit wrap.",
    "JS needed bit flags and hash mixing for web graphics and protocols, and reused Java’s 32-bit signed model.",
    "Chop to a 32-bit int, do C-like bits, convert back to a number. High bits of doubles vanish.",
    [
      "Use >>> 0 to get an unsigned 32-bit view.",
      "Do not use | 0 as a secret ToInt32 in readable code without a comment.",
      "Prefer bigint when you need more than 32 bits.",
      "Mask shifts with 31 because shift counts are modulo 32.",
    ],
    "console.log((5 & 3).toString(2), (5 | 3).toString(2), (5 ^ 3).toString(2));\nconsole.log((1 << 31) | 0, (1 << 32), (1 << 33));\nconsole.log((-1 >>> 0).toString(16));\nconsole.log((9n & 3n) === 1n);\n",
    "32-bit masking, shifts, unsigned >>>",
    "1 << 32 is 1, not 0 — shift count is mod 32, so 32 ≡ 0.",
    [
      "NumberBitwiseOp: ToInt32 both, apply op, convert back to Number.",
      "Signed right shift >> copies the sign bit; >>> fills zeros.",
      "bigint bitwise is two’s complement of arbitrary precision; ~1n is -2n.",
    ],
  ),

  "b1-in-delete-void": e(
    "in tests whether a property name exists in an object or its prototype chain. delete removes an own configurable property. void evaluates and yields undefined. instanceof walks the prototype chain for a constructor. They are operators, not functions.",
    "A dynamic object model needed existence tests and deletion, plus a way to ignore an expression’s value (void).",
    "in is ‘does this key exist anywhere up the chain?’ delete is ‘remove own key.’ void is ‘throw away the value.’",
    [
      "Use Object.hasOwn for own keys; in includes inherited.",
      "delete leaves holes in arrays; use splice to reindex.",
      "void 0 is a style for undefined.",
      "Left of in is ToPropertyKey (strings/symbols).",
    ],
    "const o = Object.create({ inherited: 1 });\no.own = 2;\nconsole.log('own' in o, 'inherited' in o, 'missing' in o);\nconsole.log(Object.hasOwn(o, 'inherited'));\nconsole.log(delete o.own, 'own' in o);\nconsole.log(void 0, [] instanceof Array);\n",
    "in vs hasOwn, delete, void, instanceof",
    "'toString' in {} is true because it lives on Object.prototype — not an own field.",
    [
      "Relational in: ToPropertyKey + HasProperty (prototype walk).",
      "delete uses [[Delete]]; unconfigurable → false or TypeError in strict.",
      "void is GetValue then return undefined.",
    ],
  ),

  "b1-if-else": e(
    "if (cond) statement else statement branches using ToBoolean(cond). else if is just nested if in the else slot. Braces are optional for a single statement and dangerous. There is no elif keyword. Conditions are not required to be booleans.",
    "Every procedural language needs a binary fork. JS reused C’s if and added implicit ToBoolean so `if (node)` works.",
    "Evaluate the test once, pick one path, skip the other. Falsy values take the else (or skip the then).",
    [
      "Always use braces, even for one-liners.",
      "Compare explicitly when 0 or '' are valid.",
      "Prefer early return over deep else nesting.",
      "Do not assign inside if tests.",
    ],
    "function fee(age) {\n  if (age < 0) throw new Error('age');\n  if (age < 13) return 'child';\n  if (age < 18) return 'teen';\n  return 'adult';\n}\nconsole.log(fee(10), fee(15), fee(40));\nif (0) console.log('no'); else console.log('zero is falsy');\n",
    "if / else if via early returns and falsy 0",
    "if (count) skips the block when count is 0, which is often a legal count.",
    [
      "IfStatement: ToBoolean of the expression, then evaluate one Statement.",
      "No block scope unless you add { } with let/const.",
      "Dangling else binds to the nearest if — braces remove the ambiguity.",
    ],
  ),

  "b1-switch": e(
    "switch (x) compares x to each case with === (strict). cases fall through until break, return, or throw. default runs when nothing matches. case values are expressions, evaluated as the switch walks. One switch block means let in a case is visible in later cases.",
    "A jump table for many discrete values is clearer than a long else-if chain — if you remember break.",
    "A strict-equality jump with optional fall-through. It is not a pattern matcher.",
    [
      "Put break (or return) on every case unless fall-through is documented.",
      "Wrap case bodies in { } if they declare let/const.",
      "default can sit anywhere; it still runs only on no match.",
      "Do not expect switch(true) tricks in readable code.",
    ],
    "function label(code) {\n  switch (code) {\n    case 200:\n    case 201:\n      return 'ok';\n    case 404:\n      return 'missing';\n    default:\n      return 'other';\n  }\n}\nconsole.log(label(200), label(201), label(500));\nswitch (1) {\n  case 1: { const x = 'one'; console.log(x); break; }\n}\n",
    "Strict cases, shared 200/201, block-scoped case",
    "Forgotten break causes fall-through — the #1 switch bug in interviews and production.",
    [
      "Case clauses use Strict Equality Comparison against the switch value.",
      "The switch has a single lexical environment for all cases.",
      "case expressions are evaluated in order until a match, then statements run.",
    ],
  ),

  "b1-for-loops": e(
    "for (init; test; update) is C-style. while tests before the body; do...while tests after, so the body runs at least once. for(;;) is an infinite loop you must break. let in for headers is scoped to the loop; var leaks. Skipping the test means true.",
    "Iteration is the workhorse of scripts. Three forms cover ‘known count,’ ‘unknown until condition,’ and ‘run once then maybe again.’",
    "for is a while with a built-in increment shelf. do...while is ‘pay then check.’",
    [
      "Use for when you have an index; while when waiting on a condition.",
      "Avoid do...while unless you truly must run once.",
      "Prefer for...of for arrays when you do not need the index.",
      "Do not mutate the bound you test in confusing ways.",
    ],
    "let s = 0;\nfor (let i = 0; i < 4; i++) s += i;\nlet n = 3;\nwhile (n > 0) n -= 1;\nlet k = 0;\ndo { k += 1; } while (k < 1);\nconsole.log(s, n, k);\n",
    "for, while, and do...while side by side",
    "for (var i = 0; i < n; i++) { setTimeout(() => console.log(i)) } prints n, n, n.",
    [
      "ForBodyEvaluation with per-iteration environments when using lexical bindings.",
      "while uses LoopContinues based on ToBoolean.",
      "do...while evaluates the body before the first ToBoolean test.",
    ],
  ),

  "b1-for-of-in": e(
    "for...of iterates iterable values (arrays, strings, maps, sets) via @@iterator. for...in enumerates enumerable property keys (strings) along the prototype chain, including inherited. for...in on arrays can include extra enumerable properties and skip holes differently than you expect. Never use for...in for arrays.",
    "Objects needed a key walk; ES2015 iterables needed a value walk. Two loops, two protocols.",
    "of = values from an iterator. in = keys from enumerable properties, including mom’s keys on the prototype.",
    [
      "Arrays, maps, sets: for...of.",
      "Plain objects: Object.keys / entries, not for...in, unless you want prototypes.",
      "for...in keys are always strings, even for array indexes.",
      "Use hasOwn inside for...in if you must filter inherited.",
    ],
    "const arr = [10, 20];\narr.extra = 99;\nconst proto = { inherited: 1 };\nconst obj = Object.create(proto);\nobj.own = 2;\nfor (const v of arr) console.log('of', v);\nfor (const k in arr) console.log('in arr', k);\nfor (const k in obj) console.log('in obj', k);\n",
    "for...of values vs for...in keys (and extras)",
    "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'.",
    [
      "for-of: GetIterator, IteratorStep, IteratorValue.",
      "for-in: EnumerateObjectProperties, which is somewhat implementation-defined in order.",
      "Integer indexes on arrays are enumerable string keys by default.",
    ],
  ),

  "b1-break-continue": e(
    "break leaves the nearest loop or switch. continue skips to the next iteration of the nearest loop. In for, continue still runs the update expression. In while, it goes back to the test. Labels let them target an outer loop. They are not for skipping try/finally — finally still runs.",
    "Loops need early exit and skip-without-nesting. Labels exist for nested loops that would otherwise need flags.",
    "break = jump out. continue = jump to the next round. finally still gets a last word.",
    [
      "Prefer refactoring to a function + return before using labels.",
      "Remember continue in for still increments.",
      "break in switch is not continue in a surrounding loop.",
      "Do not use break to exit if — it is a SyntaxError outside loop/switch.",
    ],
    "let seen = 0;\nfor (let i = 0; i < 5; i++) {\n  if (i === 1) continue;\n  if (i === 4) break;\n  seen += 1;\n}\nconsole.log(seen);\nlet i = 0;\nwhile (i < 3) {\n  i += 1;\n  if (i === 2) continue;\n  console.log('w', i);\n}\n",
    "continue skips; break exits; for-update still runs",
    "continue inside try still runs finally, then continues — people think finally is skipped.",
    [
      "BreakableStatement and ContinueStatement with optional LabelIdentifier.",
      "LoopContinues checks abrupt completions of type continue/break.",
      "finally in TryStatement runs on any abrupt completion including break.",
    ],
  ),

  "b1-labels": e(
    "A label is an identifier before a statement: outer: for (...) { break outer }. break label jumps out of that labeled statement. continue label jumps to the next iteration of that labeled loop. Labels do not create a new scope. They are rarely needed and easy to overuse.",
    "Nested loops sometimes need to abort the outer one without a flag variable. C-family labels cover that.",
    "A named fence around a loop. break fence leaves the fence; continue fence starts the next lap of that fence.",
    [
      "Label loops, not arbitrary blocks, unless you know why.",
      "Choose names that say which loop: rows:, cols:.",
      "Extract a function if labels nest more than one level.",
      "A labeled block can be break’d but not continue’d.",
    ],
    "let hits = 0;\nrows: for (let r = 0; r < 3; r++) {\n  for (let c = 0; c < 3; c++) {\n    if (r === 1 && c === 1) break rows;\n    hits += 1;\n  }\n}\nconsole.log(hits);\ndone: {\n  break done;\n  console.log('skipped');\n}\nconsole.log('after block');\n",
    "Labeled break out of nested loops and a block",
    "break foo when foo labels an inner loop only exits inner — the name must sit on the statement you want to leave.",
    [
      "LabelledStatement wraps a statement with a name in the label set.",
      "continue requires the label to name an IterationStatement.",
      "Duplicate labels in nested statements are early errors in some cases.",
    ],
  ),

  "b1-nested-control-flow": e(
    "Nesting if/for/switch/try increases cyclomatic complexity and hides which break belongs to which loop. Flatten with early returns, helper functions, and Array methods when they clarify. Nested loops are fine for 2D data; nested if-else pyramids usually are not.",
    "Real programs combine conditions and loops. The language allows arbitrary nesting; style decides readability.",
    "Each nest is a box inside a box. If you cannot name each box, extract it.",
    [
      "Return early on invalid input.",
      "Move inner loop bodies to named functions when they grow.",
      "Avoid switch inside for without comments on break.",
      "Prefer map/filter for ‘build an array from an array’ over nested push ifs.",
    ],
    "function firstPositivePair(grid) {\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[r].length; c++) {\n      const n = grid[r][c];\n      if (n > 0) return { r, c, n };\n    }\n  }\n  return null;\n}\nconsole.log(firstPositivePair([[-1, 0], [-2, 5]]));\n",
    "Nested loops with an early return instead of flags",
    "A break in an inner switch that was meant to exit the for — switch ate the break.",
    [
      "Each BreakableStatement has its own label set; unlabeled break hits the innermost.",
      "Stack frames do not grow from nesting if/for — only from function calls.",
      "Closures created in nested loops capture per-iteration lets independently.",
    ],
  ),

  "b1-string-creation": e(
    "Strings are created with ' ', \" \", backticks, String(), or toString. They are primitive and immutable: every ‘change’ allocates a new string. String objects from new String() are wrappers. Concatenation + and templates build new strings; engines optimize some concatenations.",
    "Text is everywhere on the web. Immutability makes sharing and slicing safer in a concurrent-looking event-loop world.",
    "A sealed UTF-16 tape. You can copy pieces into a new tape; you cannot overwrite a cell.",
    [
      "Prefer literals and templates over new String.",
      "Build many pieces with an array then join, or a template, not huge + loops if profiling says so.",
      "Remember immutability when caching strings.",
      "JSON.parse produces primitives, not String objects.",
    ],
    "const a = 'hello';\nconst b = \"hello\";\nconst c = `hello`;\nconst d = String(42);\nconsole.log(a === b, a === c, d);\nconsole.log(a.toUpperCase() === a, a);\nconsole.log(typeof new String('x'));\n",
    "Literals vs String() vs wrapper typeof",
    "new String('a') !== 'a' and is truthy even for new String('').",
    [
      "String exotic objects have integer-indexed character properties.",
      "Primitive strings may be interned; === still compares contents for primitives.",
      "Rope/cons-string internals in V8 are optimizations, not language-visible mutation.",
    ],
  ),

  "b1-string-indexing": e(
    "s[i] and s.charAt(i) access UTF-16 code units. length is the code-unit count. Out of range [i] is undefined; charAt returns ''. Assigning s[0] = 'x' does not mutate. for...of and codePointAt walk Unicode code points more safely than [i] for emoji.",
    "Strings needed array-like access for parsers. UTF-16 was inherited from Java/Windows, so length is not ‘user-perceived characters.’",
    "A 0-based array of 16-bit cells, not of emoji. Some characters occupy two cells (surrogate pairs).",
    [
      "Use length for code units; [...s] or codePointAt for code points.",
      "Do not loop by i++ over emoji-heavy text without care.",
      "charAt is safer than [] if you want '' instead of undefined.",
      "Indexes are integers; s['00'] is a named property, not index 0.",
    ],
    "const s = 'JS🙂';\nconsole.log(s.length, s[0], s[2], s.charAt(99));\nconsole.log([...s]);\nconsole.log(s.codePointAt(2)?.toString(16));\nconsole.log(s.at(-1));\n",
    "length vs code points on a string with emoji",
    "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character.",
    [
      "Canonical numeric index strings on String objects.",
      "UTF-16 encoding: code points > 0xFFFF use two code units.",
      "String.prototype.at supports negative indexes; [] does not.",
    ],
  ),

  "b1-string-methods": e(
    "Core methods return new strings or numbers: toLowerCase/toUpperCase, trim, includes, startsWith, indexOf, slice, substring, split, replace/replaceAll, padStart, repeat, concat. None mutate the original. Many take indexes in code units. replace without /g replaces once.",
    "Text processing is the web’s daily work. Putting methods on String.prototype keeps them on every primitive via autoboxing.",
    "A toolbox that always hands you a new tape (or a number). The old tape stays on the shelf.",
    [
      "Prefer slice over substring (substring swaps args if start > end).",
      "Use includes/startsWith instead of indexOf !== -1.",
      "replaceAll or /g for every match.",
      "trim before comparing user input.",
    ],
    "const s = '  JavaScript  ';\nconsole.log(s.trim().toLowerCase());\nconsole.log(s.includes('Script'), s.trim().startsWith('Java'));\nconsole.log('a-b-c'.split('-'));\nconsole.log('abab'.replace('ab', 'X'), 'abab'.replaceAll('ab', 'X'));\n",
    "trim, search, split, replace vs replaceAll",
    "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty.",
    [
      "Methods are generic: they ToString(this), so String.prototype.slice.call(true) works.",
      "replace with a string pattern is not regex unless you pass a RegExp.",
      "split with empty string splits by UTF-16 units, not always graphemes.",
    ],
  ),

  "b1-string-search": e(
    "indexOf/lastIndexOf return a code-unit index or -1. includes/startsWith/endsWith return booleans and accept a start index. search takes a regex and returns an index. match/matchAll belong with regex. All are case-sensitive unless you normalize case or use /i.",
    "Finding a needle in text is the most common string task. Boolean helpers were added because indexOf === -1 was noisy.",
    "A cursor walking UTF-16 cells. -1 means ‘not found,’ never 0 — 0 is a valid hit at the start.",
    [
      "Use includes for existence; indexOf when you need the position.",
      "Never if (s.indexOf(x)) — 0 is found-at-start and falsy.",
      "startsWith is not a regex; escape nothing.",
      "Case-fold with toLowerCase only for ASCII-ish data; otherwise locale rules.",
    ],
    "const s = 'JavaScript';\nconsole.log(s.indexOf('a'), s.indexOf('z'), s.lastIndexOf('a'));\nconsole.log(s.includes('Script'), s.startsWith('Java'), s.endsWith('pt'));\nconsole.log(Boolean(s.indexOf('J')), s.indexOf('J'));\nconsole.log(s.search(/script/i));\n",
    "indexOf 0 is a hit; includes/startsWith/endsWith",
    "if (str.indexOf(substr)) fails when the substring sits at index 0.",
    [
      "StringIndexOf abstract op used by includes/startsWith/endsWith/indexOf.",
      "startsWith with a regex argument throws TypeError (IsRegExp check).",
      "search ToString’s non-regex and then creates a RegExp.",
    ],
  ),

  "b1-string-extract": e(
    "slice(start, end) takes a half-open range, supports negatives. substring(start, end) does not treat negatives as from-end (they become 0) and swaps if start > end. substr is legacy. at(i) supports negatives for one unit. slice is the default choice.",
    "Extracting windows of text is parsing. Multiple methods exist because the language accreted APIs from Java and later cleaned them up.",
    "slice: Python-like half-open with negatives. substring: clamp and swap. Prefer slice so your brain keeps one model.",
    [
      "Use slice for almost all extraction.",
      "Use at(-1) for the last code unit.",
      "Remember end is exclusive in slice/substring.",
      "Copy with s.slice() — strings are immutable so this is equal content.",
    ],
    "const s = 'JavaScript';\nconsole.log(s.slice(0, 4), s.slice(-6));\nconsole.log(s.substring(4, 0), s.slice(4, 0));\nconsole.log(s.at(-1), s.slice(4));\nconsole.log(s.substring(-3), s.slice(-3));\n",
    "slice vs substring with swapped and negative args",
    "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units.",
    [
      "slice uses relative indexing (max(len+int, 0) for negatives).",
      "substring uses max(0, min(len, n)) then reorders start/end.",
      "substr is in Annex B (web compatibility).",
    ],
  ),

  "b1-string-replace": e(
    "replace(pattern, repl) replaces one match if pattern is a string, or uses regex flags if a RegExp. replaceAll requires a global regex or a string. split(sep) returns an array; empty sep splits code units. trim/trimStart/trimEnd remove whitespace. Replacement strings can use $& and capture $1.",
    "Cleanup of user input and templates is constant. replace+split+trim is the everyday pipeline.",
    "replace paints over matches; split cuts a tape into boxes; trim shaves edges. Original string never changes.",
    [
      "replaceAll for every occurrence of a literal.",
      "Pass a function as the replacement for computed text.",
      "split limit argument caps the number of pieces.",
      "trim does not remove inner spaces.",
    ],
    "console.log('a a a'.replace('a', 'b'));\nconsole.log('a a a'.replaceAll('a', 'b'));\nconsole.log('2020-01-02'.split('-'));\nconsole.log('  x  '.trim());\nconsole.log('id=10'.replace(/id=(\\d+)/, 'id($1)'));\n",
    "replace once vs all, split, trim, capture $1",
    "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks.",
    [
      "String.prototype.replace uses GetSubstitution for $ patterns.",
      "replaceAll on RegExp throws if global flag is missing.",
      "split with capturing groups includes captures in the result array.",
    ],
  ),

  "b1-template-literals": e(
    "Backtick strings can interpolate ${expr}, span lines, and be tagged. They still produce strings unless a tag function returns something else. ${} uses ToString (and throws on symbols). Nested templates are allowed. They are not JSON.",
    "Building HTML/SQL/messages with + was noisy and error-prone. Templates made interpolation a grammar feature.",
    "A string with holes. Each hole is evaluated, converted to string, then glued with the cooked text.",
    [
      "Use templates instead of 'a' + x + 'b'.",
      "Do not drop untrusted input into HTML/SQL templates without escaping.",
      "Multiline keeps newlines as written.",
      "Escape backticks with \\` and ${ with \\${.",
    ],
    "const user = 'Ada';\nconst n = 3;\nconst msg = `Hello ${user}, you have ${n} items.`;\nconst box = `line1\nline2`;\nconsole.log(msg);\nconsole.log(box.split('\\n').length);\nconsole.log(`sum=${1 + 2}`);\n",
    "Interpolation and a multiline template",
    "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text.",
    [
      "TemplateLiteral evaluation: evaluate expressions, ToString, concatenate with cooked spans.",
      "GetTemplateObject caches a frozen array of cooked/raw strings per site.",
      "Tagged templates pass that array as the first argument (see tagged topic).",
    ],
  ),

  "b1-string-interpolation": e(
    "Interpolation is the ${expression} hole inside a template. The expression can be any JS, including nested templates and function calls. It is ToString’d. Side effects in holes run in left-to-right order. It is not sprintf: format specifiers are not built in.",
    "Inserting values into messages is the point of templates. A full expression (not just an identifier) keeps the feature compositional.",
    "Pause the string, run a tiny program, stringify the result, resume the string.",
    [
      "Keep holes small; compute complex values in a const above.",
      "Call helpers: `${fmt(date)}`.",
      "Do not put assignments in holes.",
      "Remember holes run even if you later discard the string.",
    ],
    "function money(cents) { return '$' + (cents / 100).toFixed(2); }\nconst qty = 2;\nconst raw = 199;\nconsole.log(`${qty} × ${money(raw)} = ${money(qty * raw)}`);\nlet i = 0;\nconsole.log(`${i += 1} then ${i += 1}`);\n",
    "Helper calls and left-to-right holes",
    "`${undefined}` is the string 'undefined', which can leak into UI copy.",
    [
      "Each Expression in a template is evaluated in source order.",
      "ToString throws for symbol values in interpolation.",
      "The result of interpolation is always concatenated as a primitive string in untagged templates.",
    ],
  ),

  "b1-multiline-strings": e(
    "Template literals keep real newlines. Classic strings need \\n or string concatenation. Leading indentation in templates is part of the string unless you trim or use a tagged unindent helper. Windows vs Unix newlines depend on the source file.",
    "HTML snippets and SQL in tests are painful as one long line. Backticks made multiline a literal instead of a \\n puzzle.",
    "What you type between backticks is what you get, including the spaces you used to indent the code.",
    [
      "Use trim() or trimStart() on multiline templates.",
      "Prefer \\n in classic strings for single-line source.",
      "Be careful shipping templates that contain extra indentation in output.",
      "split(/\\r?\\n/) if you need portable line breaks.",
    ],
    "const poem = `alpha\nbeta`;\nconsole.log(poem.split('\\n'));\nconst indented = `\n  hello\n`.trim();\nconsole.log(JSON.stringify(indented));\nconst classic = 'alpha\\nbeta';\nconsole.log(classic === poem);\n",
    "Template newlines vs classic \\n",
    "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor.",
    [
      "LineTerminator sequences in TemplateCharacters become part of cooked strings.",
      "Source text CRLF may normalize depending on the parser/host file read.",
      "classic LineContinuation (backslash + newline) is not a character in the string.",
    ],
  ),

  "b1-escape-sequences": e(
    "In strings, \\n \\t \\\\ \\' \\\" \\uXXXX \\u{...} \\xHH insert special characters. Templates also use \\` and \\${. A trailing \\ before a real newline continues a classic string. Invalid \\u in strict mode is a SyntaxError. /regex/ has its own escapes.",
    "Text literals must represent quotes, backslashes, and non-typable code points inside ASCII-friendly source.",
    "Backslash is a shift key for the next character(s). If you need a real backslash, write two.",
    [
      "Use \\u{1F642} for code points above FFFF in modern engines.",
      "JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ.",
      "Prefer templates over messy quote escaping when possible.",
      "Remember Windows paths: 'C:\\\\Users' or String.raw.",
    ],
    "console.log('line\\nnext');\nconsole.log('quote\\'s');\nconsole.log('\\u0041', '\\u{1F642}');\nconsole.log('C:\\\\temp');\nconsole.log(String.raw`C:\\temp`);\n",
    "Common escapes vs String.raw",
    "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape.",
    [
      "EscapeSequence productions differ in StringLiteral vs Template vs Regex.",
      "String.raw uses the raw template array, skipping cooked escape processing.",
      "Legacy octal escapes are banned in strict mode / templates.",
    ],
  ),

  "b1-tagged-templates": e(
    "A tag is a function called as tag`s ${x}`: first argument is a frozen strings array (with .raw), then the interpolated values. The tag can return any type, not just a string. This powers DSLs (css``, graphql``, sanitizers). Untagged templates skip this call.",
    "Libraries needed interpolation without immediately concatenating, so they could escape HTML or parse SQL safely.",
    "Do not glue yet. Hand me the pieces and the values; I will decide the result.",
    [
      "Write function tag(strings, ...values).",
      "Use strings.raw for unprocessed escapes.",
      "The same site’s strings array is cached/identity-stable.",
      "Return a string or a structured object as your DSL needs.",
    ],
    "function sql(strings, ...values) {\n  return {\n    text: strings.reduce((acc, s, i) => acc + s + (i < values.length ? '?' : ''), ''),\n    values,\n  };\n}\nconst id = 7;\nconsole.log(sql`select * from users where id = ${id}`);\nfunction shout(strings, ...vals) {\n  return strings[0] + vals.map(String).join('').toUpperCase();\n}\nconsole.log(shout`hi ${'ada'}`);\n",
    "Tag functions receiving strings + values",
    "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing.",
    [
      "GetTemplateObject returns a cached frozen array with a raw property.",
      "Call the tag as a function (not a method unless it is one); this is undefined in strict.",
      "The cooked vs raw difference appears with escapes like \\n vs strings.raw.",
    ],
  ),

  "b1-unicode-strings": e(
    "JS strings are UTF-16. Code units ≠ Unicode code points ≠ grapheme clusters (what users call a character). '🙂'.length is 2. \\uXXXX is one unit; \\u{1F642} is a code point that may become two units. Normalization (NFC/NFD) changes equality of visually similar text.",
    "JS shipped when UCS-2 was enough. Surrogates were bolted on. The web still mixes languages, emoji, and combining marks.",
    "Three zoom levels: 16-bit cells, Unicode code points, and ‘what a human sees.’ Most bugs mix them up.",
    [
      "Use codePointAt / for-of / [...str] for code points.",
      "Use Intl.Segmenter for graphemes when available.",
      "Normalize before comparing user names.",
      "Do not reverse a string with [i] loops if emoji matter.",
    ],
    "const s = 'A🙂é';\nconsole.log(s.length, [...s].length);\nconsole.log(s.codePointAt(1).toString(16));\nconst nfd = 'é'.normalize('NFD');\nconsole.log('é' === nfd, [...nfd]);\nconsole.log('é'.length, nfd.length);\n",
    "UTF-16 length vs code points vs NFD",
    "Reversing with split('') breaks surrogate pairs and produces invalid strings.",
    [
      "String indices are code-unit offsets in the spec.",
      "UTF16Encode/Decode on code points > 0xFFFF.",
      "String.prototype.normalize maps to Unicode normalization forms.",
    ],
  ),

  "b1-number-representation": e(
    "A JS number is a 64-bit IEEE-754 double: 1 sign bit, 11 exponent bits, 52 explicit significand bits (53 bits of integer precision including the implicit 1). Integers between -2^53+1 and 2^53-1 are uniquely representable. Beyond that, some integers skip. There is no float32 in the language (TypedArrays exist separately).",
    "One numeric type kept 1995 JS small and matched Java’s double, which was ‘good enough’ for browser math.",
    "A scientific-notation box with ~15 decimal digits. Integers are a dense neighborhood around 0, then holes appear.",
    [
      "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint.",
      "Expect 0.1 + 0.2 !== 0.3.",
      "Bitwise ops are a 32-bit side quest, not the number format.",
      "JSON numbers are also doubles after parse.",
    ],
    "console.log(Number.MAX_SAFE_INTEGER);\nconsole.log(9007199254740993 === 9007199254740992);\nconsole.log((0.1 + 0.2).toPrecision(17));\nconsole.log(Number.EPSILON);\nconsole.log((1e16 + 1) === 1e16);\n",
    "Safe integer limit and float precision",
    "JSON.parse('9007199254740993') silently rounds the ID before your code sees it.",
    [
      "IEEE-754 binary64 with round-to-nearest-even.",
      "Number.EPSILON is 2^-52, the gap at 1.",
      "Subnormals, NaN payloads, and -0 are part of the format; JS exposes -0 and a canonical NaN.",
    ],
  ),

  "b1-floating-point": e(
    "0.1 + 0.2 !== 0.3 because 0.1 is not a finite binary fraction, just like 1/3 is not finite in decimal. The sum rounds to a neighbor of 0.3. Equality on money-like decimals is therefore unsafe. Compare with a tolerance or work in integer cents.",
    "Binary floating point is hardware-fast. Decimal money is not the native representation, so the famous puzzle is inevitable.",
    "You cannot store 0.1 exactly, so you store a very close double. Adding two approximations is not the decimal 0.3.",
    [
      "Use Number.EPSILON-scaled compare for geometry, not for currency.",
      "Store money as integer cents or bigint.",
      "toFixed returns a string; it rounds for display, it does not fix equality of the raw doubles.",
      "Do not ‘fix’ by rounding after every add unless you define a decimal policy.",
    ],
    "console.log(0.1 + 0.2);\nconsole.log(0.1 + 0.2 === 0.3);\nconst close = Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON * 4;\nconsole.log(close);\nconsole.log((0.1 + 0.2).toFixed(2));\nconsole.log(10 + 20 === 30);\n",
    "0.1+0.2 vs integer cents",
    "toFixed(2) then === still fails if you convert back with Number and expect exact tenths.",
    [
      "0.1 in binary is a repeating fraction; rounding happens at 52 bits.",
      "Addition rounds the exact math result to the nearest representable double.",
      "SameValueZero used by Set/Map still treats 0.1+0.2 and 0.3 as different keys.",
    ],
  ),

  "b1-safe-integers": e(
    "A safe integer is one that can be represented exactly as a double and such that n+1 is also exact. Number.MAX_SAFE_INTEGER is 9007199254740991 (2^53-1). Number.isSafeInteger tests that. Database IDs and Twitter snowflakes often exceed this, so they travel as strings.",
    "People treated number as ‘int’ for IDs. IEEE cannot count every integer past 2^53, so the spec named the safe range.",
    "A fence at 2^53. Inside, ++ hits every integer. Outside, some integers do not exist as numbers.",
    [
      "Number.isSafeInteger before using as Map keys or array indexes of meaning.",
      "Keep large IDs as strings from JSON.",
      "Use bigint when you must arithmetic them.",
      "isInteger is not isSafeInteger — 3.0e20 is integer-ish but unsafe.",
    ],
    "const max = Number.MAX_SAFE_INTEGER;\nconsole.log(max, Number.isSafeInteger(max), Number.isSafeInteger(max + 1));\nconsole.log(Number.isInteger(1.0), Number.isSafeInteger(1.0));\nconsole.log(Number.isInteger(2 ** 53), Number.isSafeInteger(2 ** 53));\nconsole.log(String(max + 2) === String(max + 3));\n",
    "MAX_SAFE_INTEGER and isSafeInteger",
    "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not.",
    [
      "isSafeInteger: isInteger and abs(n) ≤ 2^53-1.",
      "2^53 is representable but 2^53+1 is not — hence MAX is 2^53-1.",
      "JSON.parse uses ToNumber on literals, which already lost bits before isSafeInteger.",
    ],
  ),

  "b1-number-methods": e(
    "Number.parseInt/parseFloat are the same functions as the globals. Number.isNaN/isFinite do not coerce. toFixed/toPrecision/toExponential return strings. toString(radix) prints in base 2–36. Number(value) constructs a primitive when called without new.",
    "Formatting and parsing needed methods on the number prototype plus namespace functions that do not inherit global isNaN’s coercion.",
    "is* are predicates on actual numbers. toFixed is a display stringer. parse* are scanners on text.",
    [
      "Display money with toFixed, then treat the result as text.",
      "Use Number.isFinite for validation.",
      "toString(16) for hex dumps.",
      "Avoid new Number; boxed numbers are objects.",
    ],
    "console.log(Number.isFinite('10'), isFinite('10'));\nconsole.log((3.14159).toFixed(2), (3.14159).toPrecision(3));\nconsole.log((255).toString(16), Number.parseInt('ff', 16));\nconsole.log((1.23e5).toExponential());\nconsole.log(Number('  8  '));\n",
    "isFinite, toFixed, toString radix, parseInt",
    "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic.",
    [
      "Number.prototype methods ToNumber(this) so they work on boxed and primitive numbers.",
      "toFixed uses a spec algorithm that is not ‘elementary school rounding’ in all edge cases.",
      "parseInt on Number.parseInt is %parseInt% the same builtin as the global.",
    ],
  ),

  "b1-math": e(
    "Math is a namespace object of static functions and constants (PI, E, SQRT2): abs, min, max, floor, ceil, round, trunc, sqrt, pow, hypot, sin/cos, random. It is not a constructor. Many functions convert with ToNumber and return NaN on junk. min/max of zero args are Infinity/-Infinity.",
    "Numeric recipes needed a standard library without polluting the global with sin. Math mirrors Java’s Math.",
    "A calculator drawer. You never new Math(); you call Math.fn(x).",
    [
      "Math.min(...arr) watch empty arrays → Infinity.",
      "Use Math.hypot for distance without overflow of x*x+y*y when possible.",
      "Math.pow vs ** — ** is an operator; Math.pow is a call.",
      "Trigonometry is in radians, not degrees.",
    ],
    "console.log(Math.min(3, 1, 2), Math.max(3, 1, 2));\nconsole.log(Math.min(...[]));\nconsole.log(Math.hypot(3, 4), Math.sqrt(3 ** 2 + 4 ** 2));\nconsole.log(Math.PI, Math.sin(Math.PI / 2));\nconsole.log(Math.abs(-0), Object.is(Math.abs(-0), 0));\n",
    "min/max, hypot, radians, abs(-0)",
    "Math.max() with no args is -Infinity, so reduce without an initializer can surprise.",
    [
      "Math is %Math% with [[Prototype]] Object.prototype; not callable typically as a constructor (throws).",
      "Math.min uses ToNumber on each argument in order.",
      "Some functions (Math.imul) operate on 32-bit ints internally.",
    ],
  ),

  "b1-rounding": e(
    "Math.floor goes toward -∞, Math.ceil toward +∞, Math.trunc toward 0, Math.round half away from +∞ on .5 (for positives 2.5→3, but 2.5 rounding is ‘to nearest, ties toward +∞’). |x| of negatives makes round(-2.5) → -2. Integer conversion |0 truncates toward 0 like trunc for 32-bit range.",
    "UI and pagination need whole numbers. IEEE defines several rounding modes; JS picked a small set of functions instead of one mode flag.",
    "floor = down the number line. ceil = up. trunc = chop the fraction. round = nearest, with a .5 rule that surprises on negatives.",
    [
      "Use trunc or |0 when you mean ‘drop the fraction.’",
      "Use floor for paging (page = floor(i / size)).",
      "Do not use round for money without a decimal policy.",
      "Remember round(-1.5) is -1, not -2.",
    ],
    "const xs = [1.2, 1.5, 1.8, -1.2, -1.5, -1.8];\nfor (const x of xs) {\n  console.log(x, Math.floor(x), Math.ceil(x), Math.trunc(x), Math.round(x));\n}\n",
    "floor, ceil, trunc, round on positives and negatives",
    "Math.round(-1.5) is -1; many school diagrams assume ‘.5 away from zero.’",
    [
      "Math.round is specified as floor(x + 0.5) for finite x, which interacts with IEEE -0 and negatives.",
      "ToIntegerOrInfinity used elsewhere is closer to trunc for finite numbers.",
      "Bitwise |0 is ToInt32, not full-range trunc.",
    ],
  ),

  "b1-random": e(
    "Math.random() returns a number in [0, 1) from a PRNG — not cryptographic. Scale with Math.floor(Math.random() * n) for integers 0..n-1. The distribution of floats is not a perfect discrete uniform after scaling. Use crypto.getRandomValues for tokens.",
    "Games and UI jitter needed a cheap random. Crypto randomness is a separate, slower API on purpose.",
    "A spinner that lands in [0, 1). Multiply and floor to pick an index. Do not use it for passwords.",
    [
      "Integer in [min, max]: floor(random() * (max-min+1)) + min.",
      "Never Math.random() for session tokens.",
      "Do not call random() once and reuse for ‘shuffle’ incorrectly — Fisher–Yates needs a fresh draw per step.",
      "Tests: inject a stub; do not assert exact random values.",
    ],
    "function randInt(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nfunction shuffle(arr) {\n  const a = arr.slice();\n  for (let i = a.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [a[i], a[j]] = [a[j], a[i]];\n  }\n  return a;\n}\nconsole.log(randInt(1, 6), shuffle([1, 2, 3, 4]));\n",
    "Uniform int helper and Fisher–Yates shuffle",
    "floor(random() * n) + 1 is 1..n, but using round() biases the ends.",
    [
      "The spec only requires an implementation-defined approximation of uniform in [0,1).",
      "Engines use xorshift/xoshiro-like PRNGs seeded per context.",
      "Web Crypto is specified separately; Math.random is not required to be CSPRNG.",
    ],
  ),

  "b1-bigint": e(
    "BigInt is a primitive for integers of unlimited width: 10n, BigInt('10'). Mixed arithmetic with number throws. Division truncates toward 0. It cannot be JSON.stringified by default. typed arrays and Math.* mostly do not take bigint. 0n is falsy.",
    "2^53 is too small for some IDs and crypto-adjacent integers. bigint extends integers without changing IEEE number.",
    "An integer that never becomes a float and refuses to silently mix with doubles.",
    [
      "Write n suffix or BigInt(str) from API strings.",
      "Convert at the edge: Number(x) only if safe.",
      "Use 0n/1n literals in loops instead of 0/1.",
      "Provide a JSON replacer if you must serialize.",
    ],
    "const a = 10n;\nconst b = BigInt('9007199254740993');\nconsole.log(a + b, b / 2n, 5n % 2n);\ntry { console.log(a + 1); } catch (e) { console.log(e.name); }\nconsole.log(Boolean(0n), 0n === 0);\nconsole.log(1n < 2, 2n > 1);\n",
    "bigint ops, mixed throw, relational mix allowed",
    "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them.",
    [
      "typeof is 'bigint'; Type(x) is BigInt.",
      "Relational comparison may compare number and bigint by mathematical value.",
      "Bitwise ops on bigint are arbitrary precision two’s complement.",
    ],
  ),

  "b1-function-declaration": e(
    "function name() {} is a declaration. In classic scripts it is hoisted (created before evaluation) and available in the whole enclosing function/script. In blocks, sloppy mode has Annex B quirks; modules/strict treat it as block-scoped. Declarations cannot be in if without a block in strict the same way as var-like old behavior.",
    "Named, reusable procedures are the unit of work. Hoisting let people call helpers before they appeared in the file.",
    "A named recipe pinned to the scope at instantiation time (in classic functions), not at the line you wrote it.",
    [
      "Use declarations for named top-level helpers.",
      "Do not rely on function-in-block sloppy hoisting.",
      "Prefer const fn = () => in modules for a consistent mental model, or keep declarations at top level.",
      "Name things for stack traces.",
    ],
    "console.log(add(2, 3));\nfunction add(a, b) { return a + b; }\n{\n  function inner() { return 'block'; }\n  console.log(inner());\n}\nconsole.log(typeof add);\n",
    "Hoisted declaration vs a function inside a block",
    "In some sloppy browsers, function inner inside a block is visible outside the block — do not depend on it.",
    [
      "HoistableDeclaration Instantiation binds the function object during evaluation setup.",
      "Annex B.3.3 mutates block-level functions onto the enclosing var environment in sloppy scripts.",
      "Modules are strict; block functions are lexical.",
    ],
  ),

  "b1-function-expression": e(
    "A function expression is a value: const f = function () {} or (function () {}). It is not hoisted as a usable function (the const/let binding is TDZ). It can be anonymous or named. The name inside a named expression is local to the function, useful for recursion and stack traces.",
    "First-class functions need to be created as expressions to pass as callbacks or assign conditionally.",
    "A function value baked at the line it runs, stored in a variable like any other object.",
    [
      "Assign to const unless you rebind.",
      "Use a name: const fact = function fact(n){...} for recursion/debug.",
      "Do not call it above the const line.",
      "Parenthesize when using as IIFE.",
    ],
    "const double = function (n) { return n * 2; };\nconst fact = function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n};\nconsole.log(double(4), fact(5));\ntry { console.log(hidden()); } catch (e) { console.log(e.name); }\nconst hidden = function () { return 1; };\n",
    "Function expressions are not hoisted as callable",
    "typeof f before const f = function(){} is TDZ ReferenceError, not 'undefined' like var f = function(){}.",
    [
      "Runtime Semantics: Evaluate FunctionExpression creates a new function object then.",
      "NamedFunctionExpression binds the name in the function’s own environment, not the outer scope.",
      "The binding for const is uninitialized until the assignment completes.",
    ],
  ),

  "b1-named-function-expression": e(
    "const f = function g() {} creates two names: f in the outer scope, g inside the function. g is not a binding in the outer scope. g is handy for recursion if f might be rebound. Stack traces often show g. In strict mode g is read-only.",
    "Anonymous functions had poor stack traces and awkward recursion. A local name fixes both without polluting the outer scope.",
    "A private nickname inside the function body; the outer world only knows the variable you assigned.",
    [
      "Match names (const walk = function walk) for clearer traces.",
      "Use the inner name for recursion.",
      "Do not expect g to exist outside.",
      "Avoid relying on the inner name being writable (old sloppy engines).",
    ],
    "const outer = function inner(n) {\n  if (n <= 0) return 0;\n  return n + inner(n - 1);\n};\nconsole.log(outer(3));\nconsole.log(typeof inner);\ntry { inner(1); } catch (e) { console.log(e.name); }\n",
    "Inner name for recursion, not visible outside",
    "Referring to the outer const inside before it is initialized (if the function runs synchronously during init) can TDZ — rare but real with IIFEs.",
    [
      "Named eval of FunctionExpression creates an environment with an immutable binding for the name in strict.",
      "The outer variable is a separate binding that receives the function object.",
      "Function.prototype.name is set to the inferred or given name for DevTools.",
    ],
  ),

  "b1-anonymous-function": e(
    "An anonymous function has no identifier between function and (): function () {}. Today engines infer .name from the variable or property they are assigned to. Completely anonymous functions still appear in stacks as 'anonymous'. Arrow functions are always anonymous in syntax (name can still be inferred).",
    "Callbacks were often throwaway. Anonymity kept syntax short; inferred names later improved debugging without extra tokens.",
    "A nameless value. If you store it in const foo, DevTools may still label it foo.",
    [
      "Prefer named functions for non-trivial callbacks.",
      "Rely on inferred names only as a debug aid, not as an API.",
      "export default function () {} is anonymous (name default in some tools).",
      "Function constructor creates unnamed functions.",
    ],
    "const namedGuess = function () { return 1; };\nconsole.log(namedGuess.name);\nsetTimeout(function () { console.log('timer', namedGuess.name); }, 0);\nconst obj = { method: function () {} };\nconsole.log(obj.method.name);\nconsole.log((() => {}).name);\n",
    "Inferred .name on anonymous functions",
    "After .bind, name becomes 'bound ' + original — stacks look different than you grepped.",
    [
      "SetFunctionName during assignment/property definition infers names.",
      "AnonymousFunctionName in the spec vs named.",
      "The [[SourceText]] internal slot may still omit a name token.",
    ],
  ),

  "b1-arrow-functions": e(
    "(a) => a + 1 is a shorter function with lexical this, no own arguments, no prototype, not constructable with new. Expression bodies return implicitly; { } bodies need return. You cannot name them in the function token; names are inferred. They cannot be generators.",
    "Callbacks needed to keep the surrounding this (React, DOM, methods mapping). A new syntax made lexical this the default for those cases.",
    "A lightweight function that borrows this from where it was written, like a closure over this.",
    [
      "Use arrows for short callbacks and anything that must not rebind this.",
      "Use function for methods you expect to call with obj.method() or new.",
      "Wrap objects in arrows: () => ({ x: 1 }).",
      "Do not use arrows as object methods if you need dynamic this.",
    ],
    "const add = (a, b) => a + b;\nconst pair = (a) => ({ a, b: a * 2 });\nconst obj = {\n  n: 1,\n  arrow: () => this,\n  method() { return this.n; },\n};\nconsole.log(add(2, 3), pair(4), obj.method());\ntry { new add(); } catch (e) { console.log(e.name); }\n",
    "Implicit return, object wrap, arrows are not constructors",
    "() => { n: 1 } returns undefined — braces are a block, the label n is not an object.",
    [
      "ArrowFunction has [[ThisMode]] lexical and no [[Construct]].",
      "arguments in an arrow resolves to an outer function’s arguments if any.",
      "super in arrows is also lexical (derived from surrounding class method).",
    ],
  ),

  "b1-lexical-this": e(
    "Lexical this means the engine captures this from the enclosing environment at definition time, not from the call site. Arrows do this. Nested arrows keep walking out until a non-arrow function, class field initializer, or global. class fields also use a lexical this (the instance).",
    "Losing this in callbacks was the #1 OOP-in-JS pain. Lexical this made the capture automatic.",
    "Photocopy the current this into the arrow when the arrow is created. Later calls cannot change that photocopy with .call.",
    [
      "Write the arrow inside the method whose this you want.",
      "Do not use an arrow as a prototype method you expect to receive the receiver.",
      ".call/.apply on arrows ignore the thisArg.",
      "class fields: click = () => this — bound per instance.",
    ],
    "const obj = {\n  id: 7,\n  method() {\n    const arrow = () => this.id;\n    return arrow();\n  },\n};\nconst stolen = obj.method;\nconsole.log(obj.method());\ntry { console.log(stolen()); } catch (e) { console.log('stolen', this); }\nconst arrow = () => this;\nconsole.log(arrow.call({ id: 1 }));\n",
    "Arrow ignores .call thisArg; method still has this",
    "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap.",
    [
      "Arrow functions do not have a this binding in their Environment; they use OuterEnv.",
      "Ordinary Call does not bind this for lexical ThisMode.",
      "class instance fields are initialized with this = the new instance.",
    ],
  ),

  "b1-parameters": e(
    "Parameters are bindings created per call. Defaults run when the argument is undefined (not null). Rest (...rest) collects remaining arguments into a real array. arguments is an array-like object in non-arrow functions, with legacy aliasing in sloppy mode. Duplicate param names are illegal in strict.",
    "Functions needed inputs. Defaults and rest replaced arguments-munging. arguments remains for old code and arity tricks.",
    "Named slots, then a box of leftovers (rest). Defaults are ‘if this slot is undefined, run this tiny expression.’",
    [
      "Prefer rest over arguments.",
      "Defaults can close over earlier params: (a, b = a).",
      "Do not mix defaults with relying on arguments.length without care.",
      "Arrow functions have no arguments object of their own.",
    ],
    "function f(a, b = 2, ...rest) {\n  return { a, b, rest, argc: arguments.length };\n}\nconsole.log(f(1), f(1, undefined, 3, 4), f(1, null));\nconst arrow = (...xs) => xs;\nconsole.log(arrow(1, 2));\n",
    "Defaults, rest, arguments.length vs null",
    "Default does not fire for null — (b = 2) with f(1, null) keeps null.",
    [
      "IteratorBindingInitialization and default evaluation when v is undefined.",
      "arguments in sloppy non-strict mapped params aliases arguments[i] with the named param.",
      "rest is a true Array exotic object, arguments is an Arguments exotic object.",
    ],
  ),

  "b1-first-class-functions": e(
    "Functions are values: assign, pass, return, store on objects. A higher-order function takes or returns functions (map, then, addEventListener). This is how JS does strategy, callbacks, and middleware. Functions also have properties (.name, .length, custom).",
    "Event-driven UI needed to pass ‘what to do later.’ Treating functions as objects made that natural.",
    "A function is an object you can call. Higher-order functions are factories or coordinators of those objects.",
    [
      "Pass a function, not the result of calling it: addEventListener('click', fn) not fn().",
      "Return functions to make factories and partials.",
      "Keep them pure when using as map callbacks if you can.",
      "Remember they compare by reference, not by source text.",
    ],
    "function twice(fn) {\n  return (x) => fn(fn(x));\n}\nconst inc = (n) => n + 1;\nconst add2 = twice(inc);\nconst ops = [inc, add2];\nconsole.log(ops.map((f) => f(10)));\nconsole.log(twice(inc) === twice(inc));\n",
    "Higher-order twice; functions as array values",
    "Passing getData() instead of getData to a child — you passed a promise/value, not a callback.",
    [
      "Function objects have [[Call]] (and maybe [[Construct]]).",
      "They are ordinary-ish objects: you can set fn.meta = 1.",
      "Higher-order is a usage pattern, not a spec type.",
    ],
  ),

  "b1-callbacks-sync": e(
    "A callback is a function you pass so another function can call it later or immediately. Synchronous callbacks run before the outer call returns (array.map). Asynchronous callbacks run after, via the event loop (setTimeout). The word ‘later’ is the whole game.",
    "You cannot always wait on the line for I/O. Passing a continuation lets the stack unwind and resume with the result.",
    "‘Here’s the next step.’ Sync: they take the step now. Async: they take it after the current stack is empty (plus queue rules).",
    [
      "Name whether an API is sync or async in your head.",
      "Do not assume a callback is async (map is sync).",
      "Handle errors: sync via throw, async via error-first or promises.",
      "Avoid passing async functions into map if you wanted to wait — map does not await.",
    ],
    "function withSync(cb) {\n  cb('now');\n  console.log('after sync cb');\n}\nfunction withAsync(cb) {\n  setTimeout(() => cb('later'), 0);\n  console.log('after scheduling');\n}\nwithSync((v) => console.log('sync', v));\nwithAsync((v) => console.log('async', v));\n",
    "Sync callback vs setTimeout callback order",
    "Array.map(async fn) returns an array of promises immediately — not awaited results.",
    [
      "A callback is just Call(fn, thisArg, args) from the callee’s code.",
      "Async happens only if the callee enqueues a job/task before calling.",
      "The spec does not mark functions as ‘callback’; hosts do.",
    ],
  ),

  "b1-pure-functions": e(
    "A pure function’s result depends only on its inputs and it has no side effects (no I/O, no mutation of arguments or outer state, no Date.now). Same args ⇒ same return. Impure functions log, write DOM, increment counters, or read globals. Purity is a design choice, not a JS keyword.",
    "Pure functions are easy to test, memoize, and reason about in concurrent-looking UIs. React render functions aspire to this.",
    "A math machine: inputs in, value out, world unchanged. Impure machines also move furniture in the room.",
    [
      "Return new objects instead of mutating args when you need purity.",
      "Isolate I/O at the edges; keep core logic pure.",
      "Do not read module-level lets inside ‘pure’ helpers.",
      "Date.now and Math.random make a function impure.",
    ],
    "const tax = 0.1;\nfunction pureTotal(price, rate) { return price * (1 + rate); }\nfunction impureTotal(price) { return price * (1 + tax); }\nlet calls = 0;\nfunction counted(n) { calls += 1; return n * 2; }\nconsole.log(pureTotal(100, 0.1), impureTotal(100), counted(3), calls);\n",
    "Pure vs closed-over tax vs side-effect counter",
    "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global.",
    [
      "JS cannot enforce purity; engines assume it for some optimizations only when they can prove it.",
      "Closures over mutable bindings are a hidden input.",
      "Memoization is incorrect if the function is impure.",
    ],
  ),

  "b1-side-effects": e(
    "A side effect is any change besides returning a value: assigning outer variables, mutating objects, I/O, throwing (control-flow effect), scheduling timers. JS programs need effects to be useful; the skill is containing them. Hidden effects in getters and toString are especially nasty.",
    "Software has to talk to the world. The language does not isolate effects (unlike some FP langs), so discipline is on you.",
    "Return values are the receipt. Side effects are moving stuff in the warehouse. Getters that write are pickpockets.",
    [
      "Name functions as verbs when they effect: saveUser, not user.",
      "Keep render/compute functions effect-free.",
      "Do not put mutations in map callbacks.",
      "Beware Proxies and getters that log or write.",
    ],
    "const state = { n: 0 };\nfunction inc() { state.n += 1; return state.n; }\nfunction add(a, b) { return a + b; }\nconsole.log(add(1, 2), inc(), inc(), state.n);\nconst o = {\n  get x() { console.log('get'); return 1; },\n};\nconsole.log(o.x + o.x);\n",
    "Explicit mutation vs getter side effects",
    "A getter that increments a counter makes debugging logs change program behavior.",
    [
      "Get vs Set internal methods are where many hidden effects hook in (proxies).",
      "Throwing is an abrupt completion — a control-flow side channel.",
      "Host I/O (console, fetch) is outside ECMA-262.",
    ],
  ),

  "b1-iife": e(
    "An IIFE is (function () { ... })() — a function created and immediately invoked. It built a private scope before modules and let/const blocks. Variants: arrow IIFE, async IIFE. The wrapping parens force an expression so function is not parsed as a declaration.",
    "Classic scripts had no modules. IIFE prevented var from leaking into the global object and created a private namespace.",
    "A disposable room: enter, run, leave, keep only what you returned.",
    [
      "Use blocks { } or modules today instead of IIFE for scope.",
      "Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })().",
      "Parenthesize: (function(){})() or !function(){}() (avoid the latter for style).",
      "Return an API object for the revealing module pattern.",
    ],
    "const api = (function () {\n  let secret = 0;\n  return {\n    inc() { secret += 1; return secret; },\n    get() { return secret; },\n  };\n})();\nconsole.log(api.inc(), api.get());\n(async () => {\n  const v = await Promise.resolve(42);\n  console.log(v);\n})();\n",
    "Revealing module IIFE and async IIFE",
    "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration.",
    [
      "The grouping operator produces a FunctionExpression.",
      "Call evaluates immediately on the current stack (sync IIFE).",
      "The function’s environment is eligible for GC after return unless closures remain.",
    ],
  ),

  "b1-function-hoisting": e(
    "Function declarations are initialized during instantiation, so you can call them above their source line in the same scope (classic scripts/functions). Function expressions assigned to var are hoisted as undefined, then assigned later — calling early throws TypeError. let/const expressions are TDZ. Class declarations are TDZ too.",
    "Authors wanted helpers at the bottom of the file. The split between declarations and expressions is the interview staple.",
    "Declarations: the function exists from the first millisecond of the scope. Expressions: only the name may exist (var=undefined) until the line runs.",
    [
      "Put declarations at the top or just use them knowing they hoist.",
      "Do not call expression-assigned functions above their line.",
      "In modules, function declarations hoist within the module scope.",
      "class is not like function in this regard.",
    ],
    "console.log(decl());\nfunction decl() { return 'decl'; }\nconsole.log(typeof expr);\nvar expr = function () { return 'expr'; };\nconsole.log(expr());\ntry { Cls; } catch (e) { console.log('class', e.name); }\nclass Cls {}\n",
    "Declaration hoist vs var expression vs class TDZ",
    "var f = function(){} above the line: typeof f is 'undefined', then f() is TypeError — not ReferenceError.",
    [
      "FunctionDeclarationInstantiation / GlobalDeclarationInstantiation create function objects for declarations.",
      "var is InitializeBinding(undefined) then later Assign.",
      "class DeclarationInstantiation leaves uninitialized (TDZ) until evaluation.",
    ],
  ),

  "b1-recursion-js": e(
    "Recursion is a function calling itself (or a cycle of functions) with a base case that stops. Each call pushes a stack frame; too deep throws RangeError (stack overflow). JS does not guarantee tail-call optimization in most engines. Convert deep recursion to a loop or explicit stack.",
    "Trees, nested comments, and divide-and-conquer algorithms map to recursive definitions. The call stack is the implicit stack.",
    "Russian dolls of the same function. The innermost hits the base case and the dolls unwind with return values.",
    [
      "Always write the base case first.",
      "Shrink the problem (n-1, slice, child nodes).",
      "Mind stack size (~thousands of frames, engine-dependent).",
      "For huge n, iterate.",
    ],
    "function fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}\nfunction factIter(n) {\n  let r = 1;\n  for (let i = 2; i <= n; i++) r *= i;\n  return r;\n}\nconsole.log(fact(5), factIter(5));\ntry { fact(1e5); } catch (e) { console.log(e.name); }\n",
    "Recursive factorial vs iterative; overflow",
    "Missing base case → RangeError, not a polite infinite loop (the stack dies first).",
    [
      "Each [[Call]] pushes a new execution context on the stack.",
      "Proper Tail Calls exist in the spec but are not implemented in V8/SpiderMonkey generally.",
      "RangeError is thrown when the host stack quota is exceeded.",
    ],
  ),

  "b1-currying": e(
    "Currying transforms f(a,b,c) into f(a)(b)(c). Partial application fixes some arguments now: f(a,b,c) with a bound → g(b,c). JS does not auto-curry. You implement with closures and rest. Arity (.length) may not match the original after wrapping.",
    "Function composition and config-first APIs (connect(url)(handler)) read well when arguments arrive at different times.",
    "A vending machine that takes coins one slot at a time until it can drop the can (final value).",
    [
      "Return a new function that closes over bound args.",
      "Decide if you curry one arg at a time or allow batches.",
      "Preserve this if wrapping methods (rare for curry).",
      "Do not confuse with just default parameters.",
    ],
    "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...rest) => curried.apply(this, args.concat(rest));\n  };\n}\nconst add = (a, b, c) => a + b + c;\nconst cadd = curry(add);\nconsole.log(cadd(1)(2)(3), cadd(1, 2)(3), cadd(1)(2, 3));\n",
    "Simple curry using fn.length",
    "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions.",
    [
      "Currying is a user-space pattern; the spec has no Curry abstract op.",
      "Each returned function is a new object with its own [[Environment]].",
      "Function.prototype.length is the count of declared params before the first default or rest.",
    ],
  ),

  "b1-compose-pipe": e(
    "compose(f,g)(x) is f(g(x)) — right to left. pipe(f,g)(x) is g(f(x)) — left to right, like a Unix pipe. Both are higher-order functions over unary functions. Async versions must return promises and await in order. Identity function is the empty pipe.",
    "Data transformation pipelines read better as a list of steps than nested calls. FP libraries standardized compose/pipe.",
    "compose: Russian dolls (inside first). pipe: assembly line (first function is first station).",
    [
      "Keep functions unary or use partial application.",
      "pipe is usually easier to read in application code.",
      "Do not compose functions with side-effect order surprises without documenting.",
      "Type the pipeline so steps’ output matches the next input.",
    ],
    "const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst trim = (s) => s.trim();\nconst upper = (s) => s.toUpperCase();\nconst bang = (s) => s + '!';\nconsole.log(compose(bang, upper, trim)('  hi '));\nconsole.log(pipe(trim, upper, bang)('  hi '));\n",
    "compose right-to-left vs pipe left-to-right",
    "compose(f,g) vs pipe(f,g) reversed — the interview is which runs first.",
    [
      "reduce/reduceRight are just iteration; no special engine support.",
      "Each step’s return is the next Call’s argument.",
      "Async pipe is a sequential await in a for-loop, not Promise.all.",
    ],
  ),

  "b1-memoization": e(
    "Memoization caches a function’s results by arguments so repeat calls skip work. It requires purity (or a defined invalidation). Keys are usually JSON.stringify(args) or a Map with the first object arg as key. Unbounded caches leak memory. Recursion (fib) is the teaching example.",
    "Expensive CPU or I/O with repeat inputs is common (selectors, recursive DP). Caching at the function boundary is a small, local optimization.",
    "A notebook next to a calculator: if the question was asked, copy the old answer.",
    [
      "Only memoize pure functions.",
      "Choose a key that distinguishes args (NaN, objects).",
      "Bound the cache (LRU) in long-lived apps.",
      "Do not memoize functions that take event objects unless you pick stable ids.",
    ],
    "function memoize(fn) {\n  const cache = new Map();\n  return function (x) {\n    if (cache.has(x)) return cache.get(x);\n    const v = fn(x);\n    cache.set(x, v);\n    return v;\n  };\n}\nlet work = 0;\nconst fib = memoize((n) => {\n  work += 1;\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n});\nconsole.log(fib(10), work);\n",
    "Memoized recursive fib with a Map cache",
    "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug.",
    [
      "Map uses SameValueZero for keys; NaN works as a key, +0/-0 collide.",
      "Closures keep the cache alive as long as the memoized function is reachable.",
      "A cache of object keys prevents those objects from being GC’d (strong Map).",
    ],
  ),

  "b1-scope": e(
    "Scope is the region of source text where a binding is visible. JS has global, module, function, and block scopes, plus catch/for extra environments. Inner scopes can read outer bindings (lexical). A name is resolved by walking outward, not by the call stack (that would be dynamic scope).",
    "Without scope, every name would be global and collide. Nested environments let helpers have private variables.",
    "Nested glass boxes. A name lookup looks in this box, then the enclosing box, never into a sibling box.",
    [
      "Draw braces: those are lexical scopes for let/const.",
      "var ignores block boxes except for functions.",
      "Modules do not leak top-level names to other files.",
      "Parameters live in the function’s scope (with default-arg TDZ details).",
    ],
    "const g = 'global';\nfunction outer() {\n  const a = 'outer';\n  function inner() { return a + ' ' + g; }\n  return inner;\n}\n{\n  const a = 'block';\n  console.log(a);\n}\nconsole.log(outer()(), typeof a);\n",
    "Function vs block vs global visibility",
    "Thinking a called function can see the caller’s local variables — only if they were nested in source, not by who called whom.",
    [
      "LexicalEnvironment pointer on each execution context.",
      "ResolveBinding walks Environment Records via OuterEnv.",
      "Dynamic scope would walk the call stack; JS does not.",
    ],
  ),

  "b1-module-scope": e(
    "Each ES module has its own top-level scope. Top-level const/let/function stay private unless exported. Imports are live bindings into another module’s scope. Classic scripts share one global. type=module scripts do not put vars on window.",
    "File-sized privacy was the missing piece after IIFEs. Modules made dependency graphs explicit and avoided global clobbering.",
    "A file is a locked room. export is a labeled window. import looks through that window at live values.",
    [
      "Export only the public API.",
      "Do not assign to window from a module unless you must.",
      "Circular imports see uninitialized live bindings until evaluation finishes.",
      "One module URL = one instance in the module map.",
    ],
    "// math.js would contain: export let n = 1; export function bump() { n += 1; }\n// main.js:\n// import { n, bump } from './math.js';\nconst moduleLike = (() => {\n  let n = 1;\n  return { get n() { return n; }, bump() { n += 1; } };\n})();\nmoduleLike.bump();\nconsole.log(moduleLike.n);\n",
    "Module privacy simulated with a closure",
    "Importing the same module with different relative paths can create two instances if the URLs differ.",
    [
      "Module Environment Record holds imported and top-level bindings.",
      "The module map keys on normalized URLs.",
      "Top-level this in modules is undefined.",
    ],
  ),

  "b1-lexical-scope": e(
    "Lexical (static) scope means visibility is decided by where functions are written, not where they are called. A function carries its defining environment forever (a closure). eval and with are the historic exceptions that can add a dynamic flavor — avoid them.",
    "Static scope is analyzable by compilers and humans. JS chose it so nested functions could form closures for callbacks.",
    "The nest you were born in, not the room you were invited to, decides which names you see.",
    [
      "Nest functions in source to share private vars.",
      "Passing a function to setTimeout still uses its birth scope.",
      "Do not use with.",
      "eval of sloppy code can inject names — another reason for strict/modules.",
    ],
    "function make(prefix) {\n  return function label(id) {\n    return prefix + id;\n  };\n}\nconst a = make('user-');\nconst b = make('post-');\nconsole.log(a(1), b(2));\nfunction callIt(fn) { const prefix = 'nope'; return fn(3); }\nconsole.log(callIt(a));\n",
    "Call site locals do not override lexical prefix",
    "Expecting a callback to see variables of the function that invoked it — that is dynamic scope, not JS.",
    [
      "Function objects store [[Environment]] = LexicalEnvironment at creation.",
      "GetIdentifierReference starts from that captured environment.",
      "with adds an object environment record on the chain (sloppy only).",
    ],
  ),

  "b1-scope-chain": e(
    "The scope chain is the linked list of environment records from inner to outer: block → function → module/global. Identifier lookup walks this chain. The chain is not the prototype chain (that is for object properties). Closures keep a prefix of this chain alive.",
    "Nested scopes need a search order. A chain is the simplest structure for ‘inner wins, then outer.’",
    "A stack of dictionaries. Miss in the top dictionary, look in the next, until global, then ReferenceError.",
    [
      "Shadowing: inner name hides outer on the chain.",
      "Do not confuse obj.x lookup (prototypes) with x lookup (scope chain).",
      "Global is the last link for classic scripts.",
      "with/eval can insert extra links.",
    ],
    "const x = 'global';\nfunction f() {\n  const x = 'function';\n  {\n    const x = 'block';\n    console.log(x);\n  }\n  console.log(x);\n}\nf();\nconsole.log(x);\n",
    "Three links on the scope chain all named x",
    "obj.x is not found by walking scopes — if x is not a binding, you need the object.",
    [
      "Environment Record [[OuterEnv]] forms the chain.",
      "Global object environment + declarative environment sit at the end.",
      "Unresolvable references throw in strict GetValue.",
    ],
  ),

  "b1-lexical-environment": e(
    "A lexical environment is a spec object: an Environment Record plus a reference to an outer environment. Records can be declarative (let/const/var/functions) or object-based (global, with). Each function call, block, and module creates environments as needed. This is the official name for ‘a scope at runtime.’",
    "The spec needed a precise model for closures, TDZ, and var vs let. ‘Scope’ is the human word; lexical environment is the machinery.",
    "A box of name→value slots with a pointer to the parent box. Functions keep a pointer to the box they were born in.",
    [
      "Entering a block creates a new declarative environment for let/const.",
      "Calling a function creates a new environment for params and locals.",
      "Closures retain those boxes after the call returns.",
      "var slots live in the function’s variable environment, which often aliases the lexical one.",
    ],
    "function demo(a) {\n  let b = a + 1;\n  return function inner() {\n    return { a, b };\n  };\n}\nconst fn = demo(10);\nconsole.log(fn());\n",
    "Inner function retains the call’s lexical environment",
    "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record.",
    [
      "NewDeclarativeEnvironment(outer) in the spec.",
      "Function Environment Records also hold this, new.target, super.",
      "VariableEnvironment vs LexicalEnvironment diverge with catch/with in sloppy mode.",
    ],
  ),

  "b1-shadowing": e(
    "Shadowing is an inner binding with the same name as an outer one. Lookups stop at the inner name; the outer is hidden until the inner scope ends. let x in a block shadows outer x immediately (TDZ until the line). Parameters can shadow outer names. You cannot reach the outer x except by not using the same name (or some globalThis tricks for globals).",
    "Inner helpers need local names without inventing unique names for everything. Shadowing is the collision policy: inner wins.",
    "A closer sign covering a farther sign. The farther sign is still there; you just cannot see it from here.",
    [
      "Rename instead of shadowing if both values are needed.",
      "Be careful with inner const x in a block that still wants outer x in a default initializer.",
      "Catch (e) shadows outer e.",
      "Do not shadow Map, Error, document.",
    ],
    "const value = 'outer';\nfunction f(value) {\n  console.log('param', value);\n  {\n    const value = 'block';\n    console.log('block', value);\n  }\n  console.log('after', value);\n}\nf('arg');\nconsole.log(value);\n",
    "Parameter and block shadowing outer const",
    "if (typeof x === 'undefined') { let x = 1 } — typeof sees the inner x in TDZ if the let is in that block.",
    [
      "HasBinding on the inner record is true as soon as the environment is created.",
      "GetBindingValue still throws if uninitialized (TDZ).",
      "There is no with-outer-prefix operator for declarative bindings.",
    ],
  ),

  "b1-name-resolution": e(
    "Resolving a variable means walking the scope chain for that identifier. If found, GetValue/SetValue on that binding. If not, ReferenceError (strict read) or implicit global create (sloppy assignment). Property resolution is a different algorithm (prototypes). Computed names are not identifier resolution.",
    "Every identifier in source must mean one binding. The walk is how the engine implements that meaning.",
    "Ask each environment: do you have ‘x’? First yes wins. None yes → error (or sloppy global write).",
    [
      "Undeclared read: ReferenceError in modules/strict.",
      "obj.x is not identifier resolution of x.",
      "with(obj) { x } can resolve x as a property — avoid.",
      "globalThis.x can access a global object property even if a lexical let x exists (different name path).",
    ],
    "const x = 1;\nfunction f() {\n  console.log(x);\n  try { console.log(notBound); } catch (e) { console.log(e.name); }\n}\nf();\nconst obj = { y: 2 };\nconsole.log(obj.y);\n",
    "Identifier lookup vs property lookup vs ReferenceError",
    "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns.",
    [
      "ResolveBinding → GetIdentifierReference(env, name, strict).",
      "Unresolvable Reference + PutValue in sloppy mode creates a global property.",
      "Strict PutValue on unresolvable throws.",
    ],
  ),

  "b1-hoisting": e(
    "Hoisting is the engine creating bindings before evaluating the body: var as undefined, function declarations as functions, let/const/class as uninitialized (TDZ). People say ‘moved to the top’; really, instantiation runs first, then evaluation. Not all declarations hoist the same way.",
    "JS evaluates in two beats so the engine knows all vars/functions in a scope before running lines. That enables calling functions before their line.",
    "First the stage crew places all the nameplates (some empty, some already with functions). Then the play starts line by line.",
    [
      "Function declarations: callable above.",
      "var: readable as undefined above.",
      "let/const/class: throw if touched above.",
      "Import bindings are also created at instantiation (live, TDZ until linked/evaluated).",
    ],
    "console.log(typeof a, typeof b);\nvar a = 1;\nfunction b() { return 2; }\ntry { console.log(c); } catch (e) { console.log(e.name); }\nlet c = 3;\nconsole.log(a, b(), c);\n",
    "var/function vs let during the ‘hoisted’ window",
    "‘let is not hoisted’ — it is, but TDZ makes it look like it is not.",
    [
      "FunctionDeclarationInstantiation processes var/function/lexical lists.",
      "var: CreateMutableBinding + InitializeBinding(undefined).",
      "let: CreateMutableBinding without initialize until the declaration evaluates.",
    ],
  ),

  "b1-creation-vs-execution": e(
    "Creation (instantiation) allocates environment records and bindings. Execution (evaluation) runs statements, assigns values, and calls functions. Each function call does both for that function: create its env, then run its body. Mixing the two explains hoisting puzzles.",
    "The spec separates ‘prepare the scope’ from ‘run the code’ so duplicate lexical names can be early errors before any line runs.",
    "Build the mailbox wall, then deliver mail in order. Reading a let mailbox before delivery is TDZ.",
    [
      "When entering a function, params and vars exist before line 1.",
      "Then the body runs; let initializers fire at their lines.",
      "Loops with let clone environments each iteration during execution.",
      "eval can create bindings during execution in sloppy mode.",
    ],
    "function demo() {\n  console.log('during execution, a is', a);\n  var a = 'assigned';\n  console.log(a);\n}\ndemo();\nfunction order(x = y, y = 1) { return [x, y]; }\ntry { console.log(order()); } catch (e) { console.log('defaults', e.name); }\n",
    "var exists in execution; default params have their own order",
    "Default parameters run in an intermediate scope — they can see later params as TDZ.",
    [
      "PrepareForOrdinaryCall then FunctionDeclarationInstantiation then Evaluate body.",
      "Parameter expressions evaluate before the body, after a parameter environment is created.",
      "Early errors run at parse/instantiate, not as thrown Error at the line.",
    ],
  ),

  "b1-var-hoisting": e(
    "var bindings are created as undefined for the whole function (or global script) during instantiation. Duplicate var merge. Blocks do not matter. Assignment happens at the var line (or for loop init). function + var same name interactions are a sloppy-mode mess.",
    "1995 JS implemented function-wide storage. ‘Hoisting’ is how we describe that allocation timing.",
    "At function entry, every var name is already a slot filled with undefined. Later lines just write those slots.",
    [
      "Do not use var.",
      "If you must read a puzzle: look at the whole function for every var.",
      "for (var i) leaves i after the loop.",
      "typeof varName above the line is 'undefined', not ReferenceError.",
    ],
    "function f() {\n  console.log(a);\n  if (false) { var a = 1; }\n  console.log(a);\n  var a = 2;\n  console.log(a);\n}\nf();\n",
    "var a exists even inside a false if",
    "if (false) { var a = 1 } still declares a for the function — the initializer does not run.",
    [
      "VarDeclaredNames are collected from the whole function, including nested blocks (not nested functions).",
      "InitializeBinding(undefined) in VariableInstantiation.",
      "Nested functions have their own var environments.",
    ],
  ),

  "b1-let-const-hoisting": e(
    "let and const are hoisted to the block in the sense that the binding exists for the whole block, but they stay uninitialized until the declaration executes. Access is ReferenceError. const also requires an initializer at that moment. Redeclaring in the same block is a syntax error at parse/instantiate.",
    "Block scope needed to exist for the whole block to shadow correctly, but reading before init should not yield undefined like var.",
    "Reserved parking spot (shadows others) with a boot on the wheel until the let/const line runs.",
    [
      "Declare at the top of the block if you need to use it throughout.",
      "Do not use a let in the same block above its line.",
      "const cannot split declare/assign.",
      "class follows this TDZ model too.",
    ],
    "const x = 'outer';\n{\n  try { console.log(x); } catch (e) { console.log(e.name); }\n  let x = 'inner';\n  console.log(x);\n}\nconsole.log(x);\n",
    "Inner let hoisted to the block, TDZ hides outer x",
    "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization.",
    [
      "Binding is created uninitialized in BlockDeclarationInstantiation.",
      "InitializeBinding happens in Evaluation of LexicalBinding.",
      "const uses ImmutableBinding.",
    ],
  ),

  "b1-class-hoisting": e(
    "class C {} is a lexical declaration: it hoists to the block/module like let, with TDZ until the class line runs. You cannot new C() above the class. The class name is also TDZ inside the extends clause of the same class. Unlike function declarations, there is no usable function object before evaluation.",
    "Classes can extend expressions that need the rest of the scope. TDZ prevents using C before its heritage and body are set up.",
    "A let that also builds a constructor when its line runs — not a hoisted function.",
    [
      "Put base classes above derived classes in a file.",
      "Do not call a class in the same block before its declaration.",
      "class expressions (const C = class {}) follow const TDZ.",
      "typeof C above a class declaration throws, unlike typeof of a function declaration.",
    ],
    "try { console.log(typeof Box); } catch (e) { console.log(e.name); }\nclass Box {\n  constructor(n) { this.n = n; }\n}\nconsole.log(new Box(1).n);\nconst E = class Ext {};\nconsole.log(new E() instanceof E);\n",
    "class TDZ vs usable after the line",
    "typeof MyClass before the class line is ReferenceError, not 'undefined'.",
    [
      "ClassDeclaration evaluation runs ClassDefinitionEvaluation, then InitializeBinding.",
      "Heritage expression evaluates while the class name is still in TDZ for the inner environment.",
      "The constructor is a function object created at evaluation, not at scope instantiate.",
    ],
  ),

  "b1-hoisting-puzzles": e(
    "Interview puzzles mix var undefined, function declarations, duplicate names, default params, and blocks. Recipe: list all var/function in the function, then simulate line by line, applying TDZ for let/const. Nested functions hide inner vars. Annex B function-in-block is the expert-mode trap.",
    "Hiring processes use hoisting because it tests whether you know instantiation vs execution, not trivia about a library.",
    "Two-pass mental interpreter: allocate, then run. If you only run in your head, you miss var.",
    [
      "Rewrite the function with vars at the top as undefined.",
      "Place function declarations at the top as live functions (same scope).",
      "Then execute assignments and lets.",
      "Watch else-if function declarations in sloppy mode — skip in modern modules.",
    ],
    "var x = 1;\nfunction puzzle() {\n  console.log(x);\n  var x = 2;\n  function x() {}\n  console.log(typeof x, x);\n}\npuzzle();\nfunction mixed() {\n  console.log(typeof f);\n  var f = 3;\n  function f() {}\n  console.log(typeof f, f);\n}\nmixed();\n",
    "var + function same name: last function wins then assignment",
    "Assuming the function declaration always wins forever — a later var assignment overwrites the binding.",
    [
      "When both function and var share a name, instantiation initializes with the function, then var is skipped as already declared.",
      "Evaluation of var x = 2 then assigns 2.",
      "Sloppy block functions may also assign to the enclosing var environment (Annex B).",
    ],
  ),

  "b1-closures": e(
    "A closure is a function plus the lexical environment it captured. Inner functions keep outer variables alive after the outer function returns. Every function is technically a closure; we notice when the inner outlives the outer. Closures share mutable bindings, not snapshots, unless you copy the value.",
    "Callbacks, modules, and factories need private state without classes. Closures are the language’s built-in object-capability pattern.",
    "A backpack of outer variables strapped to a function. The backpack holds live bindings, not photocopies (unless you captured a primitive value in a new let each loop).",
    [
      "Return inner functions or pass them to timers/events.",
      "Use let in loops so each closure gets its own binding.",
      "Do not close over huge objects longer than needed.",
      "Factories: outer args become private config.",
    ],
    "function makeAdder(a) {\n  return (b) => a + b;\n}\nconst add5 = makeAdder(5);\nconsole.log(add5(10));\nfunction makeBox() {\n  let n = 0;\n  return { inc() { return ++n; }, get() { return n; } };\n}\nconst box = makeBox();\nconsole.log(box.inc(), box.get());\n",
    "Adder factory and private counter via closure",
    "Closures capture the variable, not the value at the moment — var in a loop is the classic proof.",
    [
      "[[Environment]] on the function object points at the outer LexicalEnvironment.",
      "Environment records live on the heap when referenced by closures.",
      "Multiple inner functions can share the same record (same mutable n).",
    ],
  ),

  "b1-closure-lifecycle": e(
    "A closure lives as long as something can still call the inner function: a variable, a DOM handler, a Map, a timer. When the last reference drops, GC can collect the function and the captured environment (if nothing else points at those bindings). Capturing a whole outer object keeps that object too.",
    "Memory bugs in SPAs are often ‘I still have a listener that closes over the world.’ Lifecycle is how you explain leaks.",
    "The inner function is a kite; the environment is the string. As long as someone holds the kite, the string’s variables stay.",
    [
      "Remove event listeners / clear timers to drop closures.",
      "Null out large caches that hold callbacks.",
      "Do not capture `element` if you only need `element.id`.",
      "Module-level closures live for the process/tab.",
    ],
    "function watch() {\n  const bulky = new Array(3).fill('data');\n  const id = 42;\n  return () => id; // does not need bulky — don't capture it\n}\nconst fn = watch();\nconsole.log(fn());\nlet handler = () => console.log('still held');\nhandler = null;\nconsole.log(handler);\n",
    "Capture only what the inner function uses",
    "Engines may retain the whole environment record, not just the one variable you read — capturing unused bulky neighbors can leak in some cases.",
    [
      "GC is reachability from roots; function objects are ordinary heap objects.",
      "Optimization: some engines skip storing unused bindings (not a spec guarantee).",
      "DOM listener lists are roots until removeEventListener or node GC.",
    ],
  ),

  "b1-private-state": e(
    "Function factories use closures to hide variables: only returned methods can touch them. That is privacy without #fields or WeakMaps. Each call to the factory gets a new environment (new private state). Revealing module pattern returns a public API object.",
    "Before private fields, closures were the way to hide secrets from callers who held the object.",
    "A locker inside the factory. Returned methods have the only keys. The rest of the program has the handle, not the locker.",
    [
      "Put secrets in outer lets, return methods.",
      "Do not hang the secret on this unless you want it enumerable.",
      "Each factory call = new locker.",
      "Today #fields are an alternative with different copying/prototype characteristics.",
    ],
    "function bank(opening) {\n  let balance = opening;\n  return {\n    deposit(n) { balance += n; },\n    withdraw(n) {\n      if (n > balance) throw new Error('funds');\n      balance -= n;\n    },\n    getBalance() { return balance; },\n  };\n}\nconst acct = bank(10);\nacct.deposit(5);\nacct.withdraw(3);\nconsole.log(acct.getBalance(), acct.balance);\n",
    "Closure-based bank account; balance is not a field",
    "If you return the secret object itself, privacy is gone — return accessors, not the bag.",
    [
      "Privacy is convention + environment records, not a security boundary against the same realm’s debugger.",
      "Methods are distinct function objects per instance (more memory than prototype methods).",
      "#fields use a different spec mechanism (private names) shared on the prototype methods.",
    ],
  ),

  "b1-closures-in-loops": e(
    "Creating functions inside a loop captures the loop bindings. let/const in for headers are cloned per iteration, so each function sees that iteration’s value. var is one binding for the whole loop, so all functions see the final value. forEach with a callback is naturally per-element.",
    "The setTimeout-in-a-for-loop puzzle is the most assigned JS interview. It teaches closures + var vs let.",
    "var: one sticky note rewritten each lap. let: a new sticky note each lap, handed to that lap’s function.",
    [
      "Use let in for (let i = 0; ...).",
      "Or bind: fn.bind(null, i) / extra closure with an IIFE passing i.",
      "forEach/map already get a per-call parameter.",
      "for...of const x is also per-iteration.",
    ],
    "const varFns = [];\nfor (var i = 0; i < 3; i++) varFns.push(() => i);\nconst letFns = [];\nfor (let j = 0; j < 3; j++) letFns.push(() => j);\nconsole.log(varFns.map((f) => f()), letFns.map((f) => f()));\n[0, 1, 2].forEach((n, _, __, fns = []) => fns);\n",
    "var loop vs let loop closures",
    "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used.",
    [
      "ForBodyEvaluation with per-iteration environment copies let bindings.",
      "var remains in the enclosing VariableEnvironment.",
      "The IIFE fix creates a new environment with a param per iteration.",
    ],
  ),

  "b1-var-loop-problem": e(
    "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } prints 3,3,3 because the timeout callbacks close over one i, which is 3 after the loop. The loop is long finished before the task runs. This is not a setTimeout bug.",
    "var’s function scope plus async queues created the most famous teaching accident in JS.",
    "The loop sprints to the finish and leaves i=3 on the field. Later, three cameras all photograph that same field.",
    [
      "Replace var with let.",
      "Capture: ((x) => setTimeout(() => console.log(x), 0))(i).",
      "Pass i as a setTimeout argument.",
      "Use forEach on an array of indexes.",
    ],
    "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log('var', i), 0);\n}\nfor (let k = 0; k < 3; k++) {\n  setTimeout(() => console.log('let', k), 0);\n}\nfor (var j = 0; j < 3; j++) {\n  setTimeout((x) => console.log('arg', x), 0, j);\n}\n",
    "var 3,3,3 vs let 0,1,2 vs extra timeout arg",
    "Fixing only one of several loops in a file — mixed var/let still surprises.",
    [
      "The timer task runs in a later macrotask; the loop’s var binding is already at terminal value.",
      "setTimeout extra arguments are passed to the callback by the host.",
      "let per-iteration bindings remain distinct heap slots.",
    ],
  ),

  "b1-stale-closures": e(
    "A stale closure is a function that still sees an old binding value you thought had moved on — common when an effect subscribed once with a callback that closed over props/state from the first render. The binding is not stale; you captured yesterday’s environment. Refs or resubscribe fix it.",
    "UI frameworks re-run functions with new locals, but event listeners may still hold the old inner function. That mismatch is ‘stale props.’",
    "You changed the billboard, but the photographer still has last week’s Polaroid in their backpack.",
    [
      "Re-register listeners when values change, or read from a ref/object that is mutated.",
      "Include dependencies in effect dependency arrays.",
      "Do not assume a setInterval callback sees the latest React state variable.",
      "Prefer functional setState (n => n+1) to avoid needing the latest n in the closure.",
    ],
    "function makeTicker() {\n  let n = 0;\n  const tick = () => n;\n  const bump = () => { n += 1; };\n  return { tick, bump };\n}\nconst t = makeTicker();\nconsole.log(t.tick());\nt.bump();\nconsole.log(t.tick()); // live binding — not stale\nlet snap = 0;\nconst stale = () => snap;\nsnap = 5;\nconsole.log(stale());\n",
    "Live closed-over let vs a copied snapshot in another variable",
    "In React, the live-binding mental model fails because each render has new const state — the old handler still has the old const.",
    [
      "Each function object has one [[Environment]]; it does not auto-update to a newer render’s environment.",
      "React state consts are new bindings per render function invocation.",
      "Refs work by mutating .current on a stable object the closure already points at.",
    ],
  ),

  "b1-closures-react": e(
    "Each React function component call creates new consts and new function identities. Event handlers close over that render’s props/state. If you subscribe once (empty deps) with that handler, you keep the first render’s values. Fixes: deps, refs, or functional updates. useCallback changes identity when deps change.",
    "React’s render model is ‘call the function again’ while the DOM listener may be the old function. Closures are the bridge and the bug.",
    "Render N is a new room with new sticky notes. A listener installed in render 1 still lives in room 1.",
    [
      "List every value the effect/handler reads in the dependency array.",
      "useRef for the latest value if you must keep a stable subscriber.",
      "setCount(c => c+1) avoids needing count in the closure.",
      "Do not blame React for JS closures — it is the same language rule.",
    ],
    "function fakeRender(count) {\n  const onClick = () => count;\n  return onClick;\n}\nconst first = fakeRender(0);\nconst second = fakeRender(1);\nconsole.log(first(), second());\nconst ref = { current: 0 };\nconst stable = () => ref.current;\nref.current = 2;\nconsole.log(stable());\n",
    "Per-render closures vs a mutable ref box",
    "Empty dependency array + count in the handler = always the initial count.",
    [
      "useRef returns the same object identity across renders; mutating current does not create a new binding.",
      "useEffect re-runs when deps change, replacing the subscribed function.",
      "Concurrent features can run renders without committing — another reason effects are the subscribe point.",
    ],
  ),

  "b1-closure-memory": e(
    "Closures retain everything in the captured environment record that the engine cannot prove is unused. A long-lived callback that closes over a big array, a DOM node, or a whole component instance pins that memory. Detach listeners, drop maps of callbacks, and avoid capturing `this`’s large fields if a small id suffices.",
    "SPAs run for hours. A single leftover subscription is a leak that heap snapshots show as detached nodes plus a function.",
    "The backpack can contain a bowling ball. If the function lives in a Set of listeners, the bowling ball never leaves.",
    [
      "Capture primitives/ids, not whole response objects, when possible.",
      "Clear intervals and removeEventListener in dispose.",
      "WeakMap for metadata keyed by objects you do not want to pin extra.",
      "Do not put large data on module scope ‘just in case.’",
    ],
    "function attach(node) {\n  const onClick = () => console.log(node.id);\n  node.addEventListener('click', onClick);\n  return () => node.removeEventListener('click', onClick);\n}\nconst fake = { id: 'btn', addEventListener() {}, removeEventListener() {} };\nconst detach = attach(fake);\ndetach();\nconsole.log('released listener');\n",
    "Always return a disposer for listener closures",
    "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays.",
    [
      "Listener lists hold strong references to callback functions.",
      "Those functions hold [[Environment]] which holds the node binding.",
      "That cycle (node → listener → env → node) is collectable if both are unreachable from roots; leftover global registries break that.",
    ],
  ),

  "b1-closure-puzzles": e(
    "Puzzles combine loop captures, returned factories, mutating closed-over objects, and async timing. Ask: which environment record? Is the binding shared? When does the inner run? If it runs after a loop, var shows the end value. If two methods share `let n`, they share mutations.",
    "Interviews check whether you simulate environments, not whether you memorized a blog post.",
    "Draw boxes for each call, arrows for inner functions, and a timeline for when they run.",
    [
      "Identify shared vs per-iteration bindings.",
      "Note mutation vs rebinding of outer names.",
      "Place async callbacks on a later tick.",
      "Watch IIFE vs block let as different fix patterns.",
    ],
    "function puzzle() {\n  const fns = [];\n  let i = 0;\n  while (i < 3) {\n    const j = i;\n    fns.push(() => [i, j]);\n    i += 1;\n  }\n  return fns.map((f) => f());\n}\nconsole.log(puzzle());\nconst shared = (() => {\n  let n = 0;\n  return [() => ++n, () => n];\n})();\nshared[0]();\nconsole.log(shared[1]());\n",
    "while+const j snapshot vs shared n between two functions",
    "const j = i inside a var loop is the IIFE-less snapshot; forgetting it is the puzzle.",
    [
      "while with let i is not per-iteration like for(let i); you must copy to const j.",
      "for(let i) spec copies i each iteration; while does not auto-copy.",
      "Two functions from one factory share one environment record.",
    ],
  ),

  "b1-object-literals": e(
    "{ a: 1, b() {}, [k]: v } creates a new ordinary object. Keys are strings or symbols. Later duplicate string keys win. __proto__ as a literal key is a special set-prototype syntax. Literals produce a new identity each time the line runs.",
    "JS’s core data structure is the object. Literal syntax made hashes and records cheap to write in UI code.",
    "A bag of properties with a hidden [[Prototype]] (usually Object.prototype). Each { } is a new bag.",
    [
      "Use shorthand { a } when a is a variable.",
      "Do not use __proto__ in literals except when you mean prototype.",
      "JSON is not the same as a JS object literal (no functions, keys quoted in JSON).",
      "Spread { ...obj } is a shallow copy of enumerable own properties.",
    ],
    "const k = 'id';\nconst user = {\n  name: 'Ada',\n  [k]: 7,\n  greet() { return 'hi ' + this.name; },\n};\nconsole.log(user.id, user.greet());\nconsole.log({ a: 1, a: 2 }.a);\nconst copy = { ...user, name: 'Alan' };\nconsole.log(copy.name, copy.greet());\n",
    "Literal with computed key, method, spread copy",
    "{ __proto__: other } does not create a property named __proto__; it sets the prototype.",
    [
      "ObjectLiteral evaluation calls OrdinaryObjectCreate(Object.prototype) then PropertyDefinitionEvaluation.",
      "__proto__ in a literal is special syntax (not a computed key) unless computed.",
      "Method definitions get a home object for super.",
    ],
  ),

  "b1-dot-vs-bracket": e(
    "obj.prop is an identifier key. obj['prop'] or obj[expr] uses ToPropertyKey on the expression (string or symbol). Dots cannot use reserved-looking dynamic names or keys with dashes. Brackets can. Missing keys yield undefined, they do not throw (unless obj is nullish).",
    "Static keys needed terse syntax; dynamic keys (maps, forms) needed an expression slot.",
    ". is a hardcoded label. [] is a computed label. Both end up as the same [[Get]].",
    [
      "Use dot for known identifiers.",
      "Use brackets for variables, user-supplied keys, and symbols.",
      "Prefer Map if keys are unknown or not strings.",
      "obj[0] on arrays is index; obj['00'] is a different key.",
    ],
    "const user = { name: 'Ada', 'full-name': 'Ada Lovelace' };\nconst key = 'name';\nconsole.log(user.name, user[key], user['full-name']);\nconsole.log(user.age);\nconst arr = ['a'];\nconsole.log(arr[0], arr['0'], arr['00']);\n",
    "Dot, computed key, missing prop, array index strings",
    "form[id] where id is user-controlled can read __proto__ or constructor — validate keys.",
    [
      "Both MemberExpressions produce a Reference with base and referenced name.",
      "ToPropertyKey: symbols stay symbols; else ToString.",
      "Integer-index keys on arrays use special [[DefineOwnProperty]].",
    ],
  ),

  "b1-computed-properties": e(
    "[expr]: value in a literal evaluates expr to a property key when the object is created. The expression can be a template, a symbol, or a function call. Order is left to right; later keys overwrite earlier string keys. Computed + shorthand cannot share the same field.",
    "Dynamic records (actions keyed by type, CSS-in-JS) needed literals without a second assignment line.",
    "Run a tiny expression, turn it into a key, then attach the value — at creation time, not later.",
    [
      "Use [Symbol.iterator] for protocol hooks.",
      "Avoid side-effect-heavy key expressions.",
      "Duplicate computed keys that stringify the same overwrite.",
      "Class fields also support [expr].",
    ],
    "const verb = 'get';\nconst id = Symbol('id');\nconst api = {\n  [verb + 'User']: () => 'Ada',\n  [id]: 99,\n};\nconsole.log(api.getUser(), api[id]);\nconst n = 1;\nconsole.log({ ['k' + n]: 1, ['k' + n]: 2 });\n",
    "Computed method name and symbol key",
    "[undefined] becomes the string 'undefined' as a key — usually a bug.",
    [
      "ToPropertyKey on the evaluated expression.",
      "PropertyDefinitionEvaluation in source order.",
      "Integer-like strings may become array indexes if the object is an array (not a plain literal usually).",
    ],
  ),

  "b1-property-shorthand": e(
    "{ a, b } is { a: a, b: b }. Method shorthand { foo() {} } is a concise method (can use super). { a, a } is a duplicate. You cannot shorthand a computed name. Async/generator methods have their own shorthand.",
    "Object.init from local variables was noisy. ES2015 cut the repetition and made methods first-class in literals.",
    "If the variable name is the key you want, write it once.",
    [
      "Return { a, b } from functions instead of { a: a, b: b }.",
      "Use method shorthand for this-binding methods.",
      "Do not use arrow shorthand if you need this as the object.",
      "Spread plus shorthand: { ...rest, id }.",
    ],
    "const name = 'Ada';\nconst age = 36;\nconst user = {\n  name,\n  age,\n  greet() { return this.name; },\n};\nconsole.log(user, user.greet());\nfunction factory(id) { return { id, created: Date.now() }; }\nconsole.log(factory(1).id);\n",
    "Shorthand fields and method",
    "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined.",
    [
      "Shorthand PropertyDefinition looks up the identifier in scope.",
      "Method definitions set [[HomeObject]] for super.",
      "MakeMethod / DefineMethod in spec vs ordinary assignment of a function expression.",
    ],
  ),

  "b1-object-apis": e(
    "Object.keys/values/entries read enumerable own string keys. Object.fromEntries reverses entries. assign copies enumerable own properties. create sets a prototype. freeze/seal/preventExtensions lock mutability. getOwnProperty* inspect descriptors. These are standard library, not operators.",
    "Once objects were hashes, programs needed reflective helpers to clone, lock, and iterate without for...in prototypes.",
    "A toolkit that talks to the property table: list, copy, lock, describe — without your class methods.",
    [
      "keys for string enumerable own names.",
      "getOwnPropertySymbols for symbols.",
      "assign is shallow and mutates the target.",
      "freeze is shallow too.",
    ],
    "const o = { a: 1, b: 2 };\nconsole.log(Object.keys(o), Object.values(o), Object.entries(o));\nconsole.log(Object.fromEntries([['x', 1], ['y', 2]]));\nconst t = Object.assign({}, o, { b: 9 });\nconsole.log(t, o);\n",
    "keys/values/entries/fromEntries/assign",
    "Object.keys skips symbols and inherited keys — for...in does not skip inherited.",
    [
      "EnumerableOwnProperties with kind key/value/key+value.",
      "fromEntries uses AddEntriesFromIterable.",
      "assign uses [[Get]] and [[Set]] — setters on the target fire.",
    ],
  ),

  "b1-object-keys-values": e(
    "Object.keys returns enumerable own string keys (insertion order, then integer indexes first on arrays). values and entries follow the same key set. fromEntries builds an object from [key,value] pairs (last duplicate wins). They do not include symbols. JSON.stringify uses enumerable own strings too.",
    "Turning objects into arrays lets you map/filter/reduce records. fromEntries closes the loop after transforming entries.",
    "Photograph the enumerable string columns of this object only, not the prototype’s columns.",
    [
      "Object.entries(obj).map → fromEntries for transforms.",
      "For symbols, call getOwnPropertySymbols.",
      "Integer keys on arrays come first, then other strings.",
      "Do not use keys on Map — use Map.prototype.keys.",
    ],
    "const o = { z: 1, a: 2 };\nconsole.log(Object.keys(o), Object.values(o));\nconst doubled = Object.fromEntries(\n  Object.entries(o).map(([k, v]) => [k, v * 2]),\n);\nconsole.log(doubled);\nconst arr = ['p', 'q'];\narr.extra = true;\nconsole.log(Object.keys(arr));\n",
    "entries transform and array extra keys",
    "Object.keys(map) on a Map is [] — Map is not a plain record of its entries.",
    [
      "OwnPropertyKeys order: integer indexes ascending, then other strings in creation order, then symbols.",
      "keys filters to enumerable strings only.",
      "fromEntries ToPropertyKey on each key (symbols allowed here).",
    ],
  ),

  "b1-object-assign-create": e(
    "Object.assign(target, ...sources) copies enumerable own properties (including symbols in modern engines via [[OwnPropertyKeys]] filtered by enumerable) into target and returns target. Object.create(proto, descriptors?) makes a new object with a chosen prototype and optional property descriptors. create(null) has no prototype.",
    "Mixing mixins and setting prototypes without constructor functions needed standard functions.",
    "assign: photocopy enumerable own fields onto an existing bag (shallow). create: empty bag with a chosen parent.",
    [
      "assign mutates target — pass {} for a shallow clone.",
      "create(null) for a pure dictionary (no toString inherit).",
      "assign copies accessors as values (invokes getters).",
      "create with descriptors for non-enumerable fields.",
    ],
    "const proto = { kind: 'shape' };\nconst o = Object.create(proto);\no.x = 1;\nconsole.log(o.kind, Object.keys(o));\nconst dict = Object.create(null);\ndict.a = 1;\nconsole.log('toString' in dict, dict.a);\nconst t = Object.assign({ a: 1 }, { b: 2 }, { a: 3 });\nconsole.log(t);\n",
    "create(proto), create(null), assign overwrite",
    "assign copies getter results, not the getter — the accessor is flattened.",
    [
      "assign: CopyDataProperties / [[Get]] then Set.",
      "create: OrdinaryObjectCreate(proto) then DefineProperties if given.",
      "null prototype objects still can have properties; HasProperty stops at null.",
    ],
  ),

  "b1-object-freeze-seal": e(
    "preventExtensions blocks new properties. seal = preventExtensions + make existing non-configurable. freeze = seal + make data properties non-writable. All are shallow: nested objects remain mutable. Frozen objects can still have mutable nested fields. isFrozen/isSealed/isExtensible inspect the flags.",
    "Libraries wanted ‘don’t touch this config’ without copying. Hardening is a shallow lock on the property table.",
    "preventExtensions: no new hooks on the wall. seal: you cannot reconfigure hooks. freeze: you cannot change the pictures either (one level).",
    [
      "freeze configs you pass around.",
      "Know it is shallow — freeze nested too or use a deep helper.",
      "strict mode: assignment to frozen throws; sloppy fails silently.",
      "Arrays freeze their index slots but not objects sitting in those slots.",
    ],
    "const o = { n: 1, nest: { x: 2 } };\nObject.freeze(o);\ntry { o.n = 9; } catch (e) { console.log(e.name); }\no.nest.x = 8;\nconsole.log(o.n, o.nest.x, Object.isFrozen(o));\nconst a = Object.seal({ k: 1 });\na.k = 2;\ntry { delete a.k; } catch (e) { console.log('del', e.name); }\nconsole.log(a);\n",
    "freeze shallow vs seal delete",
    "Object.freeze(state) then mutating state.user.age still works — nested reference.",
    [
      "SetIntegrityLevel with frozen vs sealed.",
      "[[PreventExtensions]] internal method; proxies can trap it.",
      "Non-writable + non-configurable data properties reject [[Set]].",
    ],
  ),

  "b1-object-hasown": e(
    "Object.hasOwn(obj, key) is true if the object has an own (not inherited) property, including non-enumerable and symbols when passed. obj.hasOwnProperty is inherited and fails on Object.create(null) or if someone overwrote hasOwnProperty. in includes inherited. hasOwn is the modern default.",
    "for...in and mixins made ‘is this mine?’ essential. A static Object.hasOwn avoids prototype sabotage.",
    "hasOwn: on this bag’s own labels. in: this bag or any parent’s labels.",
    [
      "Use Object.hasOwn in new code.",
      "Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto.",
      "in for ‘can I read this including inherited methods.’",
      "JSON keys are own enumerable strings.",
    ],
    "const o = Object.create({ inherited: 1 });\no.own = 2;\nconsole.log(Object.hasOwn(o, 'own'), Object.hasOwn(o, 'inherited'));\nconsole.log('inherited' in o);\nconst dict = Object.create(null);\ndict.x = 1;\nconsole.log(Object.hasOwn(dict, 'x'));\ntry { dict.hasOwnProperty('x'); } catch (e) { console.log(e.name); }\n",
    "hasOwn vs in vs null-prototype objects",
    "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects.",
    [
      "HasOwnProperty abstract op: [[GetOwnProperty]] is not undefined.",
      "in uses HasProperty (walks prototypes).",
      "hasOwn accepts a key converted with ToPropertyKey.",
    ],
  ),

  "b1-copying-objects": e(
    "A shallow copy duplicates one level of properties (new object, same nested references). A deep copy clones nested objects too. Spread and Object.assign are shallow. structuredClone is a deep structured clone. JSON.parse(JSON.stringify) is a lossy deep-ish clone. Identity of the copy is new; nested identity may not be.",
    "You often need a new object for immutability or to snapshot state without sharing mutations.",
    "Shallow: new folder with the same file shortcuts. Deep: photocopy every nested folder too.",
    [
      "Spread for one-level records.",
      "structuredClone for many built-ins (Dates, Maps) in supporting engines.",
      "Avoid JSON clone for Dates, undefined, functions, symbols, cycles.",
      "Libraries (lodash.cloneDeep) when you need custom.",
    ],
    "const o = { a: 1, nest: { b: 2 } };\nconst shallow = { ...o };\nshallow.nest.b = 9;\nconsole.log(o.nest.b, shallow.a);\nconst deep = structuredClone(o);\ndeep.nest.b = 1;\nconsole.log(o.nest.b, deep.nest.b);\n",
    "Spread shallow vs structuredClone deep",
    "{...obj, nest: {...obj.nest}} is only two levels — deeper nests still share.",
    [
      "Spread CopyDataProperties is enumerable own including symbols in objects.",
      "structuredClone uses the HTML structured clone algorithm (host).",
      "JSON clone uses ToJSON/enumerable strings only.",
    ],
  ),

  "b1-structured-clone": e(
    "structuredClone(value) deep-clones a large set of built-ins: plain objects, arrays, Date, Map, Set, ArrayBuffer, typed arrays, many errors. Functions, DOM nodes, and some internals throw. It supports a transfer list for moving ArrayBuffers. Cycles are preserved (unlike JSON).",
    "Workers needed a clone algorithm for postMessage. Exposing it to the same thread gave a correct deep clone without JSON loss.",
    "The postMessage photocopier, callable in-process. If workers can send it, structuredClone can usually copy it.",
    [
      "Use for snapshots of data, Maps, Dates, cyclic graphs.",
      "Do not clone functions or class instances with methods — you get data properties, prototype may be lost (plain objects).",
      "Transfer ArrayBuffers when you want to move, not copy.",
      "Catch DataCloneError for unsupported types.",
    ],
    "const cyc = { n: 1 };\ncyc.self = cyc;\nconst copy = structuredClone(cyc);\nconsole.log(copy.n, copy.self === copy, copy !== cyc);\nconst d = structuredClone(new Date('2020-01-01'));\nconsole.log(d instanceof Date, d.toISOString());\ntry { structuredClone(() => {}); } catch (e) { console.log(e.name); }\n",
    "Cycles and Date clone; functions fail",
    "Class instances clone as plain objects (prototype not kept) unless they are treated as ordinary objects with own fields only.",
    [
      "Structured clone is specified in HTML, not ECMA-262.",
      "It walks a graph with a memo to preserve cycles.",
      "Transferables are detached at the source after clone-with-transfer.",
    ],
  ),

  "b1-json-clone-limits": e(
    "JSON.parse(JSON.stringify(x)) drops undefined, functions, symbols, and prototype. Dates become ISO strings (then stay strings after parse). NaN/Infinity become null. Maps/Sets become {}. Cycles throw. Keys are sorted only by stringify’s enumeration, not a canonical map. It is not a deep clone of JS values.",
    "JSON is an interchange format, not a JS memory dump. Using it as clone is a hack that quietly loses types.",
    "A fax machine that only sends a subset of JS. What cannot be faxed disappears or mutates.",
    [
      "Do not JSON-clone application state with Dates/Maps.",
      "Use structuredClone or a typed serializer.",
      "undefined in arrays becomes null in JSON.stringify.",
      "toJSON on objects customizes stringify.",
    ],
    "const o = {\n  a: undefined,\n  d: new Date('2020-01-01'),\n  m: new Map([[1, 2]]),\n  n: NaN,\n};\nconsole.log(JSON.stringify(o));\nconsole.log(JSON.parse(JSON.stringify({ arr: [undefined, 1] })));\ntry { const c = {}; c.self = c; JSON.stringify(c); } catch (e) { console.log(e.name); }\n",
    "JSON.stringify losses: Date, Map, undefined, cycles",
    "After JSON clone, a Date is a string — date methods throw or coerce wrongly.",
    [
      "SerializeJSONProperty skips undefined in objects, nulls holes in arrays.",
      "Date.prototype.toJSON uses toISOString.",
      "Cycle detection throws TypeError.",
    ],
  ),

  "b1-own-vs-inherited": e(
    "Own properties live on the object. Inherited properties live on a prototype and are visible via [[Get]] and in. Methods like toString are inherited. Overwriting a name on the instance shadows the prototype. hasOwn / getOwnPropertyDescriptor see only own.",
    "Prototypes share behavior without copying methods onto every instance. The own/inherited split is how sharing works.",
    "Your backpack (own) vs the school handbook in the library (inherited). You can still read the handbook; stuffing a paper in your backpack hides that page.",
    [
      "Put instance data as own; methods on the prototype.",
      "Shadowing: instance.method = ... hides prototype.method.",
      "for...in sees enumerable inherited; Object.keys does not.",
      "delete on own reveals inherited again.",
    ],
    "const proto = { role: 'user', greet() { return this.role; } };\nconst o = Object.create(proto);\no.name = 'Ada';\nconsole.log(o.name, o.role, Object.hasOwn(o, 'role'), o.greet());\no.role = 'admin';\nconsole.log(o.role, proto.role);\ndelete o.role;\nconsole.log(o.role);\n",
    "Own name vs inherited role; shadow then delete",
    "JSON.stringify omits inherited enumerable props — they are not own.",
    [
      "[[Get]] walks [[Prototype]]; [[GetOwnProperty]] does not.",
      "[[Set]] may define an own property that shadows (ordinary set).",
      "for-in uses enumerability on the walk.",
    ],
  ),

  "b1-enumerable-properties": e(
    "Enumerable is a descriptor flag. for...in, Object.keys, and spread copy enumerable properties. Methods on class prototypes are non-enumerable by default. Object.defineProperty defaults enumerable to false. JSON.stringify only enumerable own strings. You can hide a field from keys by defining it non-enumerable.",
    "Iteration needed a way to skip ‘internal’ methods while still listing data fields. Enumerable is that bit.",
    "A ‘list me in Object.keys’ checkbox on each property. Off for most prototype methods.",
    [
      "Data on literals is enumerable.",
      "Use defineProperty to hide bookkeeping fields.",
      "Do not for...in if you only wanted own enumerable — use keys.",
      "Spread skips non-enumerable.",
    ],
    "const o = { vis: 1 };\nObject.defineProperty(o, 'hid', { value: 2, enumerable: false });\nconsole.log(Object.keys(o), o.hid, { ...o });\nfor (const k in o) console.log('in', k);\nclass C { m() {} }\nconsole.log(Object.keys(new C()), Object.keys(C.prototype));\n",
    "Hidden non-enumerable vs class methods",
    "Assuming class instance methods show up in Object.keys — they live on the prototype and are non-enumerable.",
    [
      "[[Enumerable]] on the property descriptor.",
      "EnumerableOwnProperties filters that flag.",
      "class methods use DefineMethod with enumerable false.",
    ],
  ),

  "b1-property-descriptors": e(
    "A property is defined by a descriptor: data (value, writable) or accessor (get, set), plus enumerable and configurable. getOwnPropertyDescriptor reads it. defineProperty writes it. Missing flags default to false when using defineProperty (unlike literals, which are writable enumerable configurable true).",
    "The object model needed more than a value: getters, locks, and visibility. Descriptors are the full record.",
    "A property is a row in a table with columns for value or get/set, plus three boolean switches.",
    [
      "defineProperty for non-enumerable or read-only fields.",
      "Remember defineProperty defaults flags to false.",
      "configurable:false is hard to undo.",
      "Accessors cannot also have value/writable.",
    ],
    "const o = {};\nObject.defineProperty(o, 'n', { value: 1, writable: true, enumerable: true, configurable: true });\nconsole.log(Object.getOwnPropertyDescriptor(o, 'n'));\nObject.defineProperty(o, 'hidden', { value: 9 });\nconsole.log(Object.getOwnPropertyDescriptor(o, 'hidden'), Object.keys(o));\n",
    "Literal-like descriptor vs default-false defineProperty",
    "Object.defineProperty(o,'x',{value:1}) is not writable — later o.x = 2 fails silently or throws.",
    [
      "ValidateAndApplyPropertyDescriptor distinguishes data vs accessor.",
      "OrdinaryDefineOwnProperty implements the eight-flag checks.",
      "Proxy defineProperty trap can intercept.",
    ],
  ),

  "b1-define-property": e(
    "Object.defineProperty(obj, key, desc) adds or changes a property using a descriptor. It can fail (TypeError) if the property is non-configurable or the object is non-extensible. defineProperties does many keys. This is how libraries hide fields and how the engine implements much of class fields internally.",
    "Assignment (obj.x =) always makes a writable enumerable data property (normally). defineProperty is the precise tool.",
    "Fill out a form for the property instead of shoving a value onto the object.",
    [
      "Use for read-only APIs and hidden metadata.",
      "Check getOwnPropertyDescriptor before assuming you can redefine.",
      "On arrays, defining length has special rules.",
      "Prefer public class fields when you just need instance data.",
    ],
    "const o = {};\nObject.defineProperty(o, 'id', {\n  value: 7,\n  writable: false,\n  enumerable: true,\n  configurable: false,\n});\nconsole.log(o.id);\ntry { o.id = 8; } catch (e) { console.log(e.name); }\ntry { Object.defineProperty(o, 'id', { value: 9 }); } catch (e) { console.log(e.name); }\n",
    "Locked id cannot be assigned or redefined",
    "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates.",
    [
      "[[DefineOwnProperty]] internal method.",
      "For updates, omitted fields default to the current descriptor, not to false.",
      "That update vs create default difference is a frequent interview point.",
    ],
  ),

  "b1-writable-enumerable-configurable": e(
    "writable: can [[Set]] change a data value? enumerable: does it show in keys/for...in/spread? configurable: can we delete, change flags, or switch data/accessor? Once configurable is false, you are mostly stuck (writable can still go from true→false on data properties). Accessors use get/set instead of writable.",
    "Three independent knobs cover mutation, visibility, and meta-mutation. Combining them implements freeze/seal.",
    "writable = edit the value. enumerable = list me. configurable = edit the knobs / delete me.",
    [
      "Public data: all true (literal default).",
      "Hidden: enumerable false.",
      "Constants: writable false, configurable false.",
      "Do not lock configurable until you mean it.",
    ],
    "function dump(o, k) { console.log(k, Object.getOwnPropertyDescriptor(o, k)); }\nconst o = { a: 1 };\ndump(o, 'a');\nObject.defineProperty(o, 'b', { value: 2, writable: true, enumerable: false, configurable: true });\ndump(o, 'b');\nconsole.log(Object.keys(o), o.b);\n",
    "Default literal flags vs custom b",
    "Non-configurable but writable data property: you can still change the value, you just cannot delete it — freeze needs writable false too.",
    [
      "OrdinaryDefineOwnProperty table of allowed changes when configurable is false.",
      "[[Delete]] requires configurable true (or the property not to exist).",
      "Module namespace exports are non-configurable live data-like bindings (exotic).",
    ],
  ),

  "b1-getters-setters": e(
    "get x() and set x(v) are accessor properties. Reading x calls get; writing calls set. They can live in literals, classes, or defineProperty. An accessor without a setter is read-only from assignment’s point of view. Getters that mutate are surprising. JSON.stringify invokes getters.",
    "Computed properties and validation need a hook on read/write without changing the obj.x syntax.",
    "A property that is actually two functions wearing a field costume.",
    [
      "Keep getters cheap and pure.",
      "Use setters to validate or sync side state.",
      "Do not recurse: `set x(v) { this.x = v }` stack-overflows.",
      "defineProperty get/set for dynamic names.",
    ],
    "const temp = {\n  c: 0,\n  get f() { return this.c * 1.8 + 32; },\n  set f(v) { this.c = (v - 32) / 1.8; },\n};\ntemp.f = 212;\nconsole.log(temp.c, temp.f);\nconst o = { get x() { return 1; } };\ntry { o.x = 2; } catch (e) { console.log(e.name); }\n",
    "Fahrenheit accessor over Celsius storage",
    "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization.",
    [
      "[[Get]] calls the get function with this = the receiver.",
      "[[Set]] calls set or fails if no setter and strict.",
      "Accessors have [[Get]]/[[Set]] slots instead of [[Value]]/[[Writable]].",
    ],
  ),

  "b1-this": e(
    "this is a binding set by how a function is called (or lexically for arrows). Method call obj.fn() sets this to obj. Bare fn() sets this to undefined in strict/modules, or the global object in sloppy. new sets this to the created object. call/apply/bind set it explicitly. It is not ‘the current class’ magically.",
    "OOP methods need a receiver. JS chose call-site this so one function can serve many objects (prototypes).",
    "this is an extra invisible argument filled in by the call syntax, except arrows which freeze it from birth.",
    [
      "obj.method() to get obj as this.",
      "Save this or use arrows in callbacks.",
      "class bodies are strict — bare calls are undefined.",
      "Do not log this at module top expecting window in ESM.",
    ],
    "const obj = {\n  n: 1,\n  m() { return this.n; },\n};\nconst fn = obj.m;\nconsole.log(obj.m());\ntry { console.log(fn()); } catch (e) { console.log(e.name, fn.call(obj)); }\n",
    "Method this vs stolen function",
    "Extracting obj.m and calling it later loses this — the interview classic.",
    [
      "OrdinaryCallBindThis uses thisMode and thisArgument from CallExpression evaluation.",
      "MemberExpression calls pass the base as thisArgument.",
      "Unqualified Identifier calls pass undefined (strict) as thisArgument.",
    ],
  ),

  "b1-this-default": e(
    "Default/global binding: a non-arrow function called as fn() with no receiver. In sloppy classic scripts, this is the global object (window). In strict mode, modules, and classes, this is undefined. That difference makes ‘forgotten new’ and ‘stolen methods’ throw in modern code instead of writing globals.",
    "Original JS used global this so window methods worked. Strict mode stopped silent global writes via this.x =.",
    "No receiver + sloppy = the world object. No receiver + strict = undefined (a landmine that throws on this.x).",
    [
      "Write modules (strict) so missing this throws.",
      "Do not rely on window as this.",
      "Call methods through the object or bind.",
      "new.target can detect forgotten new in constructors.",
    ],
    "function sloppy() { return this; }\nfunction strictFn() {\n  'use strict';\n  return this;\n}\nconsole.log(sloppy() === globalThis, strictFn());\nfunction C() { this.n = 1; }\ntry { C(); } catch (e) { console.log('C()', e.name); }\nconsole.log(new C().n);\n",
    "Sloppy global this vs strict undefined vs forgotten new",
    "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n.",
    [
      "ThisMode global vs strict vs lexical.",
      "BindThis in sloppy ToObject’s the thisArg when not nullish (historical).",
      "strict functions keep undefined.",
    ],
  ),

  "b1-this-implicit": e(
    "Implicit binding is obj.method() or obj['method'](): this is obj (the base of the member expression). Nested obj.a.b() sets this to a, not obj. Prototype methods still get the instance as this if called on the instance. A temporary reference const m = obj.method loses the base.",
    "The syntax of a method call is the most natural way to say ‘this object is the receiver.’",
    "Whatever is left of the last dot before () becomes this.",
    [
      "Keep the call as obj.fn() if you need obj.",
      "Chain: api.users.list() → this is users.",
      "Destructuring { list } = api.users loses this.",
      "Class inheritance still uses the instance as this.",
    ],
    "const box = {\n  n: 2,\n  inner: {\n    n: 9,\n    get() { return this.n; },\n  },\n  get() { return this.n; },\n};\nconsole.log(box.get(), box.inner.get());\nconst { get } = box;\ntry { console.log(get()); } catch (e) { console.log(e.name); }\n",
    "Last-dot this; destructured method loses it",
    "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!",
    [
      "CallExpression on a MemberExpression uses GetValue of a Reference, passing GetThisValue(ref).",
      "If the callee is not a Reference (after grouping), thisArgument is undefined.",
      "That is why (obj.fn)() loses this.",
    ],
  ),

  "b1-this-explicit": e(
    "Explicit binding is fn.call(thisArg, ...args), fn.apply(thisArg, array), and fn.bind(thisArg, ...partial). They set this regardless of how you later call (bind creates a bound function). Arrows ignore explicit this. null/undefined thisArg becomes the global object in sloppy non-bound calls.",
    "You needed to borrow methods (Array.prototype.slice.call(arguments)) and to pre-bind event handlers.",
    "A sticker on the function: ‘when called, this is X,’ or a one-shot call/apply with X for this time.",
    [
      "bind for event handlers you will pass around.",
      "call/apply for one-shot borrowing.",
      "apply when args are already an array (or use spread).",
      "Cannot re-bind a bound function’s this (further bind only prepends args).",
    ],
    "function intro(greeting) { return greeting + ' ' + this.name; }\nconst user = { name: 'Ada' };\nconsole.log(intro.call(user, 'hi'));\nconsole.log(intro.apply(user, ['yo']));\nconst bound = intro.bind(user, 'hello');\nconsole.log(bound());\n",
    "call, apply, and bind for explicit this",
    "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird.",
    [
      "Bound function exotic objects store [[BoundThis]] and [[BoundArguments]].",
      "[[Call]] of a bound function calls the target with those.",
      "call/apply are specified as using PrepareForTailCall and Call with given this.",
    ],
  ),

  "b1-this-new": e(
    "new Fn() creates a new object, sets its [[Prototype]] to Fn.prototype, binds this to that object, runs Fn, and returns the object unless Fn returns another object. Arrows cannot be new’d. If you forget new, this follows default binding instead — often a bug.",
    "Constructor functions were the original ‘class’ story. new is the operator that wires prototype and this together.",
    "Mint a blank instance, point it at the constructor’s prototype, run the constructor with this = the instance.",
    [
      "Call constructors with new.",
      "Return nothing (or this) from constructors; returning a primitive is ignored.",
      "Return an object to override the instance (uncommon).",
      "new.target is the constructor that was directly new’d.",
    ],
    "function User(name) {\n  this.name = name;\n}\nUser.prototype.hi = function () { return this.name; };\nconst u = new User('Ada');\nconsole.log(u.hi(), u instanceof User);\nfunction Bag() { return { custom: true }; }\nconsole.log(new Bag());\ntry { User('x'); } catch (e) { console.log('no new', e && e.name); }\n",
    "new sets this and prototype; returned object wins",
    "Returning {} from a constructor throws away this and the prototype link of the minted object.",
    [
      "OrdinaryCreateFromConstructor + [[Construct]] on the function.",
      "If constructor result IsObject, use it; else the minted this.",
      "new.target in the constructor is the function that new was applied to.",
    ],
  ),

  "b1-this-arrow": e(
    "Arrow functions do not bind their own this. They close over this from the surrounding non-arrow (or the global/undefined this of a module). .call/.bind cannot change it. They are ideal inside methods for callbacks. They are wrong as prototype methods that need the receiver.",
    "The lost-this callback problem was so common that a new function kind made lexical this the default for nested functions.",
    "An arrow photocopies this when it is born. That photocopy is its this forever.",
    [
      "Define arrows inside the method that has the this you want.",
      "class fields: click = () => this.handle() bind per instance.",
      "Do not put arrows on Object.prototype-style shared methods.",
      "super in arrows is also lexical from the surrounding method.",
    ],
    "const obj = {\n  n: 5,\n  wait() {\n    const arrow = () => this.n;\n    const fn = function () { return this && this.n; };\n    return { arrow: arrow(), fn: fn() };\n  },\n};\nconsole.log(obj.wait());\nconst arrow = () => this;\nconsole.log(arrow.call({ n: 1 }));\n",
    "Arrow captures method this; inner function does not",
    "Using an arrow as an object method: this is not the object, so this.n is wrong.",
    [
      "[[ThisMode]] lexical: Call does not bind this.",
      "ResolveThisBinding walks outer environments.",
      "bind on an arrow still cannot change this (bound this is ignored for lexical functions).",
    ],
  ),

  "b1-this-lost": e(
    "this is lost when a method is used as a bare callback: btn.addEventListener('click', obj.method) calls method with this = the element (or undefined in some APIs), not obj. setTimeout(obj.method) is a bare call. Fixes: wrap in arrow, bind, or use a class field arrow.",
    "Passing functions around is JS’s superpower; call-site this is its tax. Losing this is the tax bill.",
    "You tore the method off the object and mailed only the function. The postage (this) is filled by the mailer, not the object.",
    [
      "addEventListener('click', () => obj.method()).",
      "addEventListener('click', obj.method.bind(obj)).",
      "Do not bind in render loops without memoizing — new function every time.",
      "Check the API: some like React class methods need bind in the constructor historically.",
    ],
    "const counter = {\n  n: 0,\n  inc() { this.n += 1; return this.n; },\n};\nconst stolen = counter.inc;\ntry { stolen(); } catch (e) { console.log(e.name); }\nconsole.log(counter.inc());\nsetTimeout(() => console.log('wrapped', counter.inc()), 0);\nsetTimeout(counter.inc.bind(counter), 0);\n",
    "Stolen method throws; bind/wrap restore this",
    "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks.",
    [
      "Host APIs call the callback with their chosen thisArg (the event target for many DOM events).",
      "setTimeout in browsers uses a this of window for classic functions in sloppy mode.",
      "bind creates a new exotic function identity.",
    ],
  ),

  "b1-call": e(
    "fn.call(thisArg, a, b) invokes fn immediately with explicit this and a list of arguments. It is the primitive behind borrowing methods. Bound functions and arrows interact as described under this. call is not apply (apply takes an array).",
    "Before spread, call/apply were how you passed dynamic args and a chosen this. They remain the interview-visible API.",
    "Pick up a function, point it at an object, fire it now with these args.",
    [
      "Array.prototype.slice.call(arrayLike) classic borrowing.",
      "Prefer [...arrayLike] or Array.from today.",
      "Do not confuse call with bind (bind delays).",
      "thisArg for a primitive is boxed in sloppy mode.",
    ],
    "function sum(a, b) { return this.base + a + b; }\nconsole.log(sum.call({ base: 10 }, 1, 2));\nconst arrayLike = { 0: 'a', 1: 'b', length: 2 };\nconsole.log(Array.prototype.join.call(arrayLike, '-'));\nconsole.log(Math.max.call(null, 1, 5, 2));\n",
    "call with thisArg and borrowed join",
    "Math.max.call(null, array) does not spread the array — that is apply or Math.max(...array).",
    [
      "Function.prototype.call is specified to Call the function with given this and args.",
      "If the function is not callable, TypeError.",
      "Tail-call note exists in spec; engines generally do not TCO.",
    ],
  ),

  "b1-apply": e(
    "fn.apply(thisArg, argArray) is like call but arguments come from an array or array-like. Spread fn(...args) replaced most apply uses. apply is still useful when this must be set and args are already an array. Math.max.apply(null, arr) was the old max-of-array.",
    "arguments and NodeLists were array-likes. apply was the bridge to functions that wanted a real argument list.",
    "Unpack this array into the parameter list, and set this, in one shot.",
    [
      "Use fn(...arr) unless you also need thisArg.",
      "fn.apply(obj, arr) when both matter.",
      "Watch stack limits: apply with huge arrays can throw.",
      "argArray null/undefined means zero args.",
    ],
    "function greet(a, b) { return this.pre + a + b; }\nconsole.log(greet.apply({ pre: 'X' }, ['a', 'b']));\nconst nums = [3, 10, 2];\nconsole.log(Math.max.apply(null, nums), Math.max(...nums));\nfunction f() { return Array.prototype.slice.apply(arguments); }\nconsole.log(f(1, 2, 3));\n",
    "apply with array args vs spread",
    "fn.apply(obj, { 0:1, length:1 }) works with array-likes; a plain object without length may misbehave.",
    [
      "CreateListFromArrayLike converts the arg array.",
      "Spread uses iterator protocol; apply uses length and indexes — different for some custom objects.",
      "Same [[Call]] as call after the list is built.",
    ],
  ),

  "b1-bind": e(
    "fn.bind(thisArg, ...partial) returns a new bound function that, when called, uses that this and prepends partial args. The original is unchanged. Bound functions have a length minus bound args. You can still .bind again for more args, but not to change this. Useful for event handlers and partial application.",
    "You needed a function value with this already filled, to pass to APIs that call later with the wrong this.",
    "A pre-addressed envelope: the letter (args you add later) goes to a fixed this house, maybe with some args already inside.",
    [
      "const onClick = this.handle.bind(this) in constructors (legacy classes).",
      "Partial: const add1 = add.bind(null, 1).",
      "Do not bind in a tight loop if you can reuse one bound function.",
      "boundFn !== fn; identity matters for removeEventListener.",
    ],
    "function mul(a, b) { return this.k * a * b; }\nconst bound = mul.bind({ k: 2 }, 3);\nconsole.log(bound(4));\nconsole.log(bound.length, mul.length);\nconst twice = mul.bind({ k: 2 }, 2);\nconsole.log(twice(5));\n",
    "bind this and partial the first argument",
    "removeEventListener(fn.bind(this)) cannot remove the listener added with a different bind() call — different identities.",
    [
      "BoundFunctionCreate stores target, this, and argument list.",
      "[[Construct]] of bound functions can still new the target in some cases.",
      "Function.prototype.bind sets name to 'bound ' + target.name.",
    ],
  ),

  "b1-function-borrowing": e(
    "Function borrowing is calling a method whose this you set to another object: Array.prototype.map.call(nodeList, fn). The method must use this as an array-like or matching shape. It is prototype-oriented reuse without inheritance. Today Array.from and spread cover many old borrowing cases.",
    "Array-likes (arguments, NodeList) did not have map. Borrowing Array methods was the idiom.",
    "Rent Array.prototype.slice, point it at arguments, get a real array.",
    [
      "Array.from(arrayLike) first in new code.",
      "Borrow when you need a specific method and the this shape matches.",
      "Do not borrow methods that assume holes vs undefined incorrectly without tests.",
      "call vs apply: choose based on how args are stored.",
    ],
    "const arrayLike = { 0: 10, 1: 20, length: 2 };\nconsole.log(Array.prototype.map.call(arrayLike, (n) => n * 2));\nconsole.log(Array.from(arrayLike, (n) => n * 2));\nconst args = function () { return Array.prototype.slice.call(arguments); }(1, 2);\nconsole.log(args);\n",
    "map.call on an array-like vs Array.from",
    "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object.",
    [
      "Generic array methods use ToObject(this) and LengthOfArrayLike.",
      "They do not require [[Prototype]] to be Array.prototype.",
      "This is why strings can use Array.prototype.map.call('ab', ...) on code units.",
    ],
  ),

  "b1-prototypes": e(
    "Every ordinary object has a [[Prototype]] (another object or null). Property reads that miss on the object continue up that chain. Functions have a .prototype property used when they are new’d. obj.__proto__ is a deprecated accessor for [[Prototype]]. Object.getPrototypeOf is the modern API.",
    "Sharing methods among instances without storing a copy on each object is the original JS OOP model.",
    "A chain of parent objects. If I don’t have toString, my parent might. Functions’ .prototype is the parent that new children will get.",
    [
      "Put shared methods on Constructor.prototype.",
      "Use Object.getPrototypeOf / setPrototypeOf sparingly (set is slow).",
      "Do not mutate Object.prototype in libraries.",
      "null prototype objects stop the chain.",
    ],
    "function Dog(name) { this.name = name; }\nDog.prototype.speak = function () { return this.name + ' bark'; };\nconst d = new Dog('Rex');\nconsole.log(d.speak(), Object.getPrototypeOf(d) === Dog.prototype);\nconsole.log(d.hasOwnProperty('speak'), d.hasOwnProperty('name'));\n",
    "Instance data own; method on prototype",
    "Overwriting Constructor.prototype = {} drops constructor and breaks instanceof unless you restore it.",
    [
      "[[Prototype]] internal slot; not the same as the .prototype property on functions.",
      "OrdinaryGetOwnProperty vs [[Get]] walking GetPrototypeFromConstructor chains.",
      "__proto__ is specified in Annex B for web compatibility.",
    ],
  ),

  "b1-internal-prototype": e(
    "[[Prototype]] is the hidden link. Object.getPrototypeOf(obj) reads it; Object.setPrototypeOf writes it; Object.create(proto) sets it at birth. obj.__proto__ is an accessor on Object.prototype that may be missing on null-prototype objects. Changing [[Prototype]] after creation deoptimizes engines.",
    "The spec needed an internal slot name so .prototype (a normal property on functions) would not be confused with the instance’s parent link.",
    ".prototype is a toolbox on the constructor. [[Prototype]] is the ‘parent’ pointer on the instance. new wires the second to the first.",
    [
      "Read with getPrototypeOf.",
      "Create with Object.create or class/new.",
      "Avoid setPrototypeOf in hot paths.",
      "Reflect.getPrototypeOf is the same for ordinary objects.",
    ],
    "const proto = { z: 1 };\nconst o = Object.create(proto);\nconsole.log(Object.getPrototypeOf(o) === proto, o.z);\nconst p = {};\nObject.setPrototypeOf(p, proto);\nconsole.log(p.z);\nconst naked = Object.create(null);\nconsole.log(Object.getPrototypeOf(naked), '__proto__' in Object.prototype);\n",
    "get/setPrototypeOf vs create(null)",
    "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects.",
    [
      "OrdinaryGetPrototypeOf returns the slot.",
      "Proxy getPrototypeOf trap can lie.",
      "Immutable prototype exotic objects (window in some browsers) restrict set.",
    ],
  ),

  "b1-prototype-chain": e(
    "The prototype chain is obj → proto → proto’s proto → … → null. Reads walk it; writes usually define an own property (shadowing) instead of editing the proto. instanceof and isPrototypeOf walk it. A cycle is an error when setting prototypes. Long chains are rare and slower.",
    "Inheritance is ‘if I don’t have it, ask my parent.’ The chain is that ask-loop.",
    "A linked list of objects. Lookup is linear in chain length. null is the end cap.",
    [
      "Keep chains short (class extends one parent).",
      "Shadow to override.",
      "Object.create(null) for no chain.",
      "Do not walk the chain yourself; use getPrototypeOf in a loop only for debugging.",
    ],
    "const a = { a: 1 };\nconst b = Object.create(a); b.b = 2;\nconst c = Object.create(b); c.c = 3;\nconsole.log(c.a, c.b, c.c);\nconsole.log(a.isPrototypeOf(c));\nlet n = 0, x = c;\nwhile (x) { n += 1; x = Object.getPrototypeOf(x); }\nconsole.log('links', n);\n",
    "Walking a three-object chain",
    "A write c.a = 9 does not change a.a — it shadows on c.",
    [
      "[[Get]] loop: O = obj; while O !== null; if own then return; else O = [[Prototype]].",
      "[[Set]] OrdinarySetIfOrdinary with prototype setters possibly on the chain.",
      "setPrototypeOf detects cycles and throws.",
    ],
  ),

  "b1-property-lookup": e(
    "Lookup: start at the object, if own descriptor exists, use it (data or getter). Else go to [[Prototype]]. If a setter exists on the chain and you assign, that setter may run instead of shadowing (accessor on proto). Shadowing with an own data property hides proto getters too.",
    "Understanding get vs set on the chain explains ‘why did my assignment not change the prototype field?’ and ‘why did a setter fire?’",
    "Read: walk until you find it. Write: usually plant an own property, unless a setter on the way intercepts.",
    [
      "Own data shadows everything above for that key.",
      "delete own to reveal proto again.",
      "Watch prototype accessors — assignment can call them.",
      "hasOwn tells you if lookup would stop immediately.",
    ],
    "const proto = {\n  get x() { return 1; },\n  set x(v) { this._x = v; },\n};\nconst o = Object.create(proto);\nconsole.log(o.x);\no.x = 5;\nconsole.log(o._x, Object.hasOwn(o, 'x'), o.x);\n",
    "Prototype setter writes _x on the instance",
    "Assigning to an inherited data property creates an own property; it does not mutate the prototype’s value.",
    [
      "OrdinarySetWithOwnDescriptor vs walking for setters.",
      "GetOwnProperty is per object; HasProperty walks.",
      "Proxy get/set traps sit in front of this algorithm.",
    ],
  ),

  "b1-constructor-functions": e(
    "A constructor is a function meant to be called with new. By convention it is PascalCase. It assigns instance fields on this and shares methods on Constructor.prototype. class is syntactic sugar over this model (plus extra rules). Without new, this may be wrong unless you guard.",
    "Before class, this was the way to mint typed objects with shared methods.",
    "A factory that new runs for you: make object, attach prototype, call function as constructor.",
    [
      "Set methods on .prototype, not inside the constructor (unless they must close over privates).",
      "Guard: if (!new.target) throw or return new C(...).",
      "instanceof C checks C.prototype on the chain.",
      "Do not return primitives from constructors.",
    ],
    "function Point(x, y) {\n  if (!new.target) return new Point(x, y);\n  this.x = x;\n  this.y = y;\n}\nPoint.prototype.toString = function () { return `(${this.x},${this.y})`; };\nconst p = Point(1, 2);\nconsole.log(p.toString(), p instanceof Point);\n",
    "Constructor with new.target guard and prototype method",
    "Defining this.method = function(){} in the constructor creates a new function per instance (more memory).",
    [
      "[[Construct]] vs [[Call]] on the same function object.",
      "prototype property is created on function declarations/expressions by default.",
      "arrows have no construct and no prototype.",
    ],
  ),

  "b1-new-operator": e(
    "new C(args) does: (1) create object, (2) set [[Prototype]] from C.prototype, (3) call C with this = object and new.target = C, (4) if C returns an object, use that, else the created object. new C is valid with no args. new on non-constructors throws TypeError.",
    "The operator packages the four steps so you do not do Object.create + call by hand every time.",
    "Mint, link, initialize, maybe replace. Four beats.",
    [
      "Always new class constructors.",
      "If you implement ‘new’ by hand, remember the return-object override.",
      "new C.prototype.constructor() if constructor was preserved.",
      "Spread: new C(...args).",
    ],
    "function C(n) {\n  this.n = n;\n  console.log('new.target', new.target === C);\n}\nC.prototype.kind = 'c';\nconst a = new C(1);\nconsole.log(a.n, a.kind);\nfunction D() { return { hijack: true }; }\nconsole.log(new D());\n",
    "new.target, prototype fields, hijacked return",
    "If C.prototype is not an object (you set it to 3), new throws TypeError.",
    [
      "OrdinaryCreateFromConstructor uses Get(F, 'prototype').",
      "If prototype is not an object, use Object.prototype (for some paths) or throw — constructors require Object.",
      "Construct(F, args, newTarget) is the spec entry.",
    ],
  ),

  "b1-constructor-property": e(
    "By default Function.prototype and each function’s .prototype have constructor pointing back at the function. Instances inherit .constructor via the chain. It is writable: if you replace .prototype with {}, constructor is Object unless you set it back. It is a hint for tooling, not a reliable type check (use instanceof or tags).",
    "Reflection and ‘create another of the same kind’ (new obj.constructor()) needed a back-pointer. It is conventional, not enforced.",
    "A sticky note on the prototype saying ‘I was made by C.’ Anyone can replace the note.",
    [
      "When replacing .prototype, restore { constructor: C }.",
      "Do not use obj.constructor as a security check.",
      "class keeps constructor correctly on the prototype.",
      "null-proto objects have no constructor.",
    ],
    "function C() {}\nconst c = new C();\nconsole.log(c.constructor === C);\nC.prototype = { x: 1 };\nconst c2 = new C();\nconsole.log(c2.constructor === C, c2.constructor === Object);\nfunction D() {}\nD.prototype = { constructor: D };\nconsole.log(new D().constructor === D);\n",
    "Losing constructor when replacing .prototype",
    "obj.constructor.name after a prototype swap may be 'Object' — confusing logs.",
    [
      "Function allocation defines prototype.constructor as non-enumerable.",
      "It is an ordinary data property, not a magic slot.",
      "class prototype constructor is non-enumerable similarly.",
    ],
  ),

  "b1-object-create": e(
    "Object.create(proto, props?) makes a new object whose [[Prototype]] is proto (or null). Optional second arg is a property descriptor map like defineProperties. It does not run a constructor. Use it for dictionary objects, prototypes, and ‘inheritance’ without new.",
    "You needed to set [[Prototype]] at birth without invoking a constructor’s side effects.",
    "Allocate a blank object and point its parent pointer. No constructor body runs.",
    [
      "Object.create(null) for maps of user keys.",
      "Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance.",
      "Second argument descriptors default flags to false.",
      "create is not a deep copy of proto.",
    ],
    "const parent = { add(a, b) { return a + b; } };\nconst child = Object.create(parent);\nchild.k = 1;\nconsole.log(child.add(2, 3), Object.getPrototypeOf(child) === parent);\nconst dict = Object.create(null, { n: { value: 7, enumerable: true } });\nconsole.log(dict.n, Object.getPrototypeOf(dict));\n",
    "Delegation via create, plus null dict",
    "Object.create(parent) shares parent by reference — mutating parent methods affects all children.",
    [
      "OrdinaryObjectCreate(proto, extraInternalSlots).",
      "If proto is not object or null, TypeError.",
      "The second arg is ObjectDefineProperties.",
    ],
  ),

  "b1-prototype-pollution": e(
    "Prototype pollution is when untrusted keys like __proto__ or constructor.prototype get merged into objects, changing Object.prototype for everyone. A payload { \"__proto__\": { \"isAdmin\": true } } with naive recursive merge can make every object inherit isAdmin. It is a security bug, not a language feature you ‘use.’",
    "Recursive merge utilities and query parsers wrote obj[key] = value without blocking proto keys. Shared prototypes then became an attack surface.",
    "Poisoning the school handbook so every student suddenly has a new page. One merge, global effect.",
    [
      "Block keys __proto__, constructor, prototype on merges.",
      "Use Object.create(null) or Map for dictionaries.",
      "Prefer Object.hasOwn and Object.assign from known keys.",
      "Freeze Object.prototype in extreme lockdown (can break libs).",
    ],
    "const protoBefore = Object.prototype.isAdmin;\nconst payload = JSON.parse('{\"__proto__\":{\"polluted\":true}}');\nconst target = {};\nfor (const [k, v] of Object.entries(payload)) {\n  if (k === '__proto__' || k === 'constructor') continue;\n  target[k] = v;\n}\nconsole.log(target.polluted, ({}).polluted);\nconsole.log('isAdmin was', protoBefore);\n",
    "Rejecting __proto__ keys in a merge",
    "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype.",
    [
      "obj['__proto__'] = x may call the inherited setter and change [[Prototype]].",
      "Object.defineProperty and Map avoid that setter.",
      "CVE class: lodash merge historically, qs parsers, etc.",
    ],
  ),

  "b1-classes": e(
    "class C { constructor(){} method(){} static s(){} #p = 1 } is syntactic sugar over prototypes plus TDZ, strict mode, and non-enumerable methods. class is not hoisted like function. extends sets up the prototype chain. new is required. Fields initialize per instance.",
    "The prototype model confused people. class matches how other languages teach OOP while compiling to the same engine machinery.",
    "A constructor function with a dressed-up prototype. Methods live on C.prototype; statics on C itself.",
    [
      "Use class for inheritable types with methods.",
      "Always new C().",
      "Put shared methods in the class body, not on this in the constructor.",
      "Prefer composition when inheritance trees grow.",
    ],
    "class Counter {\n  n = 0;\n  inc() { this.n += 1; return this.n; }\n  static zero() { return new Counter(); }\n}\nconst c = Counter.zero();\nconsole.log(c.inc(), c instanceof Counter);\nconsole.log(Object.hasOwn(c, 'inc'), typeof Counter.prototype.inc);\n",
    "Instance field, method on prototype, static factory",
    "class methods are not enumerable and are not on the instance — Object.assign(clone, instance) misses methods.",
    [
      "ClassDefinitionEvaluation creates constructor and prototype objects.",
      "Methods are non-enumerable function objects with [[HomeObject]].",
      "Instance fields run after super() in derived classes.",
    ],
  ),

  "b1-class-constructor": e(
    "constructor() is the method that runs on new. A class may have at most one. In a derived class you must call super() before using this. If you omit constructor, a default one is created (super(...args) in derived classes). Returning an object overrides the instance, like old constructors.",
    "Initialization belongs in one place. super() ensures the parent’s this-allocation happened (especially with new.target and built-ins).",
    "The minting recipe. Derived classes wait for super() before touching this.",
    [
      "Assign fields in constructor or via class fields.",
      "Call super(args) first in derived constructors.",
      "Do not use this before super() — ReferenceError.",
      "Skip custom constructor if the default is enough.",
    ],
    "class Animal {\n  constructor(name) { this.name = name; }\n}\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n}\nconsole.log(new Dog('Rex', 'lab').name);\nclass Weird {\n  constructor() { return { hijack: true }; }\n}\nconsole.log(new Weird() instanceof Weird);\n",
    "super() then fields; object return hijack",
    "Using this before super() in a subclass constructor throws, even to read this.foo.",
    [
      "Derived constructors start with this uninitialized until SuperCall.",
      "default constructor of derived is constructor(...args){ super(...args); }.",
      "Class constructors have [[ConstructorKind]] derived or base.",
    ],
  ),

  "b1-instance-static": e(
    "Instance methods live on the prototype and expect this = instance. Static methods live on the constructor and expect this = the class (unless stolen). Static fields are properties of the constructor. You call statics as C.fn(), not obj.fn(). instanceof does not look at statics.",
    "Factories, caches, and helpers related to a type do not need an instance. static puts them next to the type name.",
    "Instance: dog.speak(). Static: Dog.species() — a toolbox bolted onto the constructor function.",
    [
      "static create() factories.",
      "this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn()).",
      "Do not access instance fields from static without an instance.",
      "static #priv is shared private to the class, not per instance.",
    ],
    "class User {\n  constructor(id) { this.id = id; }\n  label() { return 'user-' + this.id; }\n  static parse(s) { return new User(Number(s)); }\n}\nconst u = User.parse('5');\nconsole.log(u.label(), u.parse);\nconsole.log(User.parse('9').id);\n",
    "Instance label vs static parse factory",
    "Calling u.parse() is undefined unless you copied the static — statics are not on the instance.",
    [
      "Static methods are DefineMethod on the constructor function object.",
      "Instance methods on the prototype object.",
      "static this follows the call site (Sub.staticMeth() → this === Sub).",
    ],
  ),

  "b1-public-private-fields": e(
    "Public fields (n = 1) install own properties on each instance after construction (after super in subclasses). Private fields (#n) are accessed only inside the class body; they are not props you can obj['#n']. Each class has its own private names. They are not inherited as accessible #n in subclasses without their own declaration.",
    "Closures hid privates per instance with extra functions. #fields keep methods on the prototype while hiding state.",
    "Public fields: own properties. #fields: a side table keyed by the instance, only the class’s code has the key.",
    [
      "Use # for secrets; public fields for data.",
      "Do not try to reflect # with Object.keys — they will not appear.",
      "Check with #n in obj inside the class.",
      "Avoid arrow class fields if you need the method on the prototype (they bind per instance).",
    ],
    "class Vault {\n  #pin = '0000';\n  publicNote = 'ok';\n  check(pin) { return pin === this.#pin; }\n  static hasPin(v) { return #pin in v; }\n}\nconst v = new Vault();\nconsole.log(v.publicNote, v.check('0000'), v.check('1'));\nconsole.log(Object.keys(v), Vault.hasPin(v));\n",
    "Private #pin vs public field; in-check",
    "JSON.stringify and spread skip private fields — clones lose secrets (good) and also cannot copy them even if you wanted to.",
    [
      "Private identifiers are unique per class evaluation (Private Name records).",
      "PrivateBrandCheck throws TypeError if the instance lacks the brand.",
      "Public fields: DefineField after construction.",
    ],
  ),

  "b1-class-inheritance": e(
    "class Sub extends Super sets Sub.prototype.[[Prototype]] = Super.prototype and Sub.[[Prototype]] = Super (statics inherit too). super.method() calls the parent method. super() in constructor allocates this via the parent. extends null is allowed (no Object.prototype). Built-ins like Array can be extended with caveats.",
    "Sharing and specializing types is easier with a keyword than manual prototype wiring.",
    "Instances chain methods upward; the constructor function also chains statics upward. super is the parent’s version, not a copy.",
    [
      "Call super() before this in derived constructors.",
      "Override methods and call super.method() when extending behavior.",
      "static methods can use super.staticMeth().",
      "Do not extend unless you have a real is-a relationship.",
    ],
    "class A {\n  hello() { return 'A'; }\n  static tag() { return 'A'; }\n}\nclass B extends A {\n  hello() { return super.hello() + 'B'; }\n  static tag() { return super.tag() + 'B'; }\n}\nconsole.log(new B().hello(), B.tag());\nconsole.log(new B() instanceof A);\n",
    "Instance and static super along extends",
    "Forgetting super() in a derived constructor throws when constructing.",
    [
      "Heritage evaluation sets Function.prototype or the parent as [[Prototype]] of the constructor.",
      "super.prop uses [[HomeObject]] to start lookup from the parent of that method’s home.",
      "NewTarget is forwarded so subclassing Array can produce a B instance.",
    ],
  ),

  "b1-method-overriding": e(
    "A subclass method with the same name hides the parent’s on the instance’s prototype chain (the instance’s proto is Sub.prototype which has the new method). Parent code that calls this.method() from a parent function will still dispatch to the subclass (polymorphism) unless it uses super. There is no Java-style overload by arity.",
    "Polymorphism: one call site, many behaviors. Overriding is how subclasses specialize.",
    "The nearest method on the chain wins. Parent methods that call this.foo() look up foo from the instance, which may be the override.",
    [
      "Override to specialize; call super.method() to extend.",
      "Keep the same contract (args/return) to avoid LSP surprises.",
      "There is no overload — last method of that name in the class body wins.",
      "Arrow fields on the subclass shadow prototype methods of the parent.",
    ],
    "class Speaker {\n  speak() { return 'base'; }\n  shout() { return this.speak().toUpperCase(); }\n}\nclass Robot extends Speaker {\n  speak() { return 'beep'; }\n}\nconsole.log(new Robot().shout());\nconsole.log(new Speaker().shout());\n",
    "Parent shout dispatches to overridden speak",
    "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch.",
    [
      "Method lookup is [[Get]] on the receiver starting at its prototype.",
      "super.speak is a different reference that starts at [[HomeObject]].[[Prototype]].",
      "No multiple dispatch; arity does not select methods.",
    ],
  ),

  "b1-js-oop-principles": e(
    "Encapsulation: hide internals (closures, #fields, modules). Polymorphism: the same call this.method() hits different methods. Composition: objects holding other objects, often preferred over deep extends. JS is prototype-based; class is a layer. Duck typing is common: if it has .map, treat it as mappable.",
    "These words show up in interviews. JS implements them with objects and functions, not with a heavy type system.",
    "Hide the guts, share a method name, build with parts instead of a tall family tree unless is-a is real.",
    [
      "Prefer composition: User has an Address, not User extends Address.",
      "Encapsulate with # or factory closures.",
      "Polymorphism via method names and prototypes.",
      "Duck-type at boundaries; class instanceof inside a realm.",
    ],
    "function withLogger(obj) {\n  return { ...obj, log(m) { console.log(m); return obj; } };\n}\nclass Animal { speak() { return '...'; } }\nclass Cat extends Animal { speak() { return 'meow'; } }\nfunction say(a) { return a.speak(); }\nconsole.log(say(new Cat()), say({ speak() { return 'honk'; } }));\nconst u = withLogger({ id: 1 });\nu.log('hi');\n",
    "Polymorphic speak and composition via wrapper",
    "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win.",
    [
      "JS has no access modifiers besides private names and module scope.",
      "Polymorphism is dynamic [[Get]] of a method name.",
      "Composition is just object references — no extra spec feature.",
    ],
  ),

  "b1-classes-vs-factories": e(
    "Classes: new, instanceof, prototypes, extends. Factories: functions that return objects (often with closures or Object.create). Factories skip new, can return different shapes, and hide privates easily. Constructors without class are the third path. Choose factories for simple ADTs; classes when you need instanceof and a shared prototype.",
    "JS can mint objects many ways. Teams fight about class vs factory; both compile to objects in memory.",
    "class = stamp + shared method box. factory = custom build each time, maybe with a backpack of secrets.",
    [
      "Use class when you have methods + inheritance + instanceof.",
      "Use factory when privacy and no-new API matter.",
      "Document whether callers use new.",
      "Do not mix randomly in one type.",
    ],
    "class PointC {\n  constructor(x, y) { this.x = x; this.y = y; }\n  dist() { return Math.hypot(this.x, this.y); }\n}\nfunction pointF(x, y) {\n  const dist = () => Math.hypot(x, y);\n  return { x, y, dist };\n}\nconsole.log(new PointC(3, 4).dist(), pointF(3, 4).dist());\nconsole.log(new PointC(1, 0) instanceof PointC);\n",
    "Class instance vs factory object with closure dist",
    "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory).",
    [
      "class methods are one function per name on the prototype.",
      "factory closures often create new function objects per call.",
      "new.target is undefined in a factory called without new.",
    ],
  ),

  "b1-array-basics": e(
    "Arrays are objects with special [[DefineOwnProperty]] for indexes and a length property. Indexes are string keys '0','1',... Length is lastIndex+1 for dense arrays, but can be set. Holes are missing own indexes. Arrays are mutable and 0-based. typeof array is 'object'; Array.isArray is the check.",
    "Lists are the main collection for UI data. Making them objects let methods live on Array.prototype.",
    "A numbered shelf with a length sign. Empty slots (holes) are not the same as slots holding undefined.",
    [
      "Use [] literals or Array.from, not new Array(n) unless you want holes.",
      "Array.isArray for type tests.",
      "length = 0 clears; shrinking length deletes indexes.",
      "Do not use for...in to iterate arrays.",
    ],
    "const a = [10, 20, 30];\nconsole.log(a[0], a.length, Array.isArray(a));\na.length = 2;\nconsole.log(a);\nconst holes = new Array(3);\nconsole.log(holes.length, 0 in holes, holes.map(() => 1));\n",
    "length shrink vs new Array(3) holes",
    "new Array(3) is not [undefined, undefined, undefined] — map skips holes.",
    [
      "Array exotic object: length vs integer index invariants.",
      "DefineOwnProperty on indexes updates length.",
      "IsArray is true for proxies of arrays too.",
    ],
  ),

  "b1-sparse-arrays": e(
    "A sparse array has holes: indexes that are not own properties. [,'x'] has a hole at 0. forEach/map/filter skip holes; for/of and Array.from visit them as undefined. JSON.stringify turns holes into null. Density matters for engine internals (packed vs holey elements).",
    "length can be set independently, so JS allowed missing indexes. That created two kinds of ‘empty.’",
    "A street with house numbers missing. Some algorithms skip vacant lots; others pretend undefined lives there.",
    [
      "Avoid new Array(n) and delete a[i] (creates holes).",
      "Prefer fill or Array.from({length:n}, fn).",
      "Know map skips holes — pad if you need them.",
      "Use in or hasOwn to detect holes.",
    ],
    "const a = [];\na[0] = 1;\na[2] = 3;\nconsole.log(a, a.length, 1 in a);\nconsole.log(a.map((x) => x * 2));\nconsole.log([...a]);\nconsole.log(JSON.stringify(a));\n",
    "Hole at index 1: map vs spread vs JSON",
    "a.map(x => x) does not densify holes — the result stays sparse.",
    [
      "HasProperty vs Get: Get on a hole walks the prototype (Array.prototype[1] could exist!).",
      "Array.prototype methods use HasProperty to skip holes.",
      "V8 holey_smi / holey_double / holey_elements kinds.",
    ],
  ),

  "b1-array-mutation": e(
    "Mutating methods change the array in place: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin. Non-mutating return a new array: concat, slice, map, filter, toSorted, toReversed, toSpliced, with. Knowing which is which prevents accidental shared-state bugs.",
    "In-place updates are cheap. Immutable helpers were added later (2023) because React-style code needed copies.",
    "Mutating: same shelf, items moved. Non-mutating: build a new shelf, leave the old one.",
    [
      "sort/reverse mutate — use toSorted/toReversed if you need a copy.",
      "slice is copy; splice is surgery.",
      "push returns the new length, not the array.",
      "Prefer non-mutating in reducers.",
    ],
    "const a = [3, 1, 2];\nconst b = a.sort((x, y) => x - y);\nconsole.log(a, b, a === b);\nconst c = [3, 1, 2].toSorted((x, y) => x - y);\nconsole.log(c, [3, 1, 2]);\nconst d = [1, 2];\nconsole.log(d.push(3), d);\n",
    "sort mutates; toSorted copies; push returns length",
    "const next = arr.sort() mutates arr and next is the same reference — React state bug.",
    [
      "Mutating methods write indexes and length on the same object identity.",
      "toSorted is specified to copy then sort.",
      "Generic methods work on array-likes via this.",
    ],
  ),

  "b1-push-pop-shift": e(
    "push adds at the end; pop removes the end. unshift adds at the front; shift removes the front. Front operations are O(n) because indexes must slide. push/pop are O(1) amortized. They return length (push/unshift) or the removed element (pop/shift). They mutate.",
    "Stacks (push/pop) and queues (push/shift) are built from these four. Arrays expose both ends.",
    "A line of people: push/pop at the tail is cheap; shift/unshift at the head makes everyone change numbers.",
    [
      "Stack: push/pop.",
      "Queue: use a dedicated deque if shift is hot.",
      "unshift(...items) like push can take many args.",
      "Empty pop/shift returns undefined.",
    ],
    "const stack = [];\nstack.push(1, 2);\nconsole.log(stack.pop(), stack);\nconst q = [1, 2, 3];\nconsole.log(q.shift(), q);\nq.unshift(0);\nconsole.log(q);\nconsole.log([].pop());\n",
    "Stack push/pop vs queue shift/unshift",
    "push returns a number, so arr = arr.push(x) replaces the array with a length.",
    [
      "unshift/shift update every index — specified as a loop.",
      "length is adjusted; holes move with indexes.",
      "Multiple args to push are appended in order.",
    ],
  ),

  "b1-slice-splice": e(
    "slice(start, end) copies a half-open range into a new array (negatives from end). splice(start, deleteCount, ...items) mutates: removes deleteCount items at start and inserts items, returning the removed array. slice is photocopy; splice is surgery. slice() copies the whole array shallowly.",
    "Extraction without mutation vs in-place edit needed two APIs with sadly similar names.",
    "slice = photocopy pages. splice = cut pages out and maybe paste new ones into the original book.",
    [
      "Copy: arr.slice() or [...arr].",
      "Remove in place: splice(i, n).",
      "Insert in place: splice(i, 0, item).",
      "slice end is exclusive; splice’s second arg is a count.",
    ],
    "const a = [0, 1, 2, 3, 4];\nconsole.log(a.slice(1, 3), a);\nconst b = [0, 1, 2, 3, 4];\nconsole.log(b.splice(1, 2, 8, 9), b);\nconst c = [1, 2, 3];\nc.splice(1, 0, 1.5);\nconsole.log(c);\n",
    "slice copy vs splice mutate/insert",
    "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’",
    [
      "slice uses relative indexes and copies Get values (holes become holes in the copy in some cases — actually slice copies holes as holes).",
      "splice is a complex sequence of delete/insert shifting indexes.",
      "Both are generic on array-likes.",
    ],
  ),

  "b1-array-search": e(
    "indexOf/lastIndexOf use === and return -1 if missing. includes uses SameValueZero (finds NaN, treats +0/-0 as equal). find/findIndex/findLast take a predicate. includes on objects looks for the same reference. Search is linear unless you build a Map/Set.",
    "Finding an element is the most common list task. includes was added because indexOf(NaN) was -1.",
    "Walk from the left (or right). includes has a slightly different equality than indexOf.",
    [
      "includes for existence; indexOf for position of primitives.",
      "find for objects matching a predicate.",
      "Do not if (arr.indexOf(x)) — 0 is found.",
      "Build a Set for repeated membership tests.",
    ],
    "const a = [1, NaN, 0, { id: 1 }];\nconsole.log(a.indexOf(NaN), a.includes(NaN));\nconsole.log(a.indexOf(0), a.includes(-0));\nconsole.log(a.find((x) => x.id === 1));\nconsole.log(a.indexOf({ id: 1 }));\n",
    "NaN, -0, find vs indexOf object identity",
    "indexOf({id:1}) is -1 even if an equal-looking object is in the array.",
    [
      "indexOf uses Strict Equality; includes uses SameValueZero.",
      "find calls the predicate for each index including holes (holes pass undefined).",
      "find is generic; sparse vs dense differs from forEach (forEach skips holes).",
    ],
  ),

  "b1-includes-indexof": e(
    "indexOf(value, fromIndex) uses ===. includes(value, fromIndex) uses SameValueZero. find(predicate) returns the element or undefined. findIndex returns -1 if none. fromIndex can be negative (from end). These do not deep-equal objects.",
    "Three APIs: position, boolean with NaN-correctness, and predicate search. Each filled a hole in the last.",
    "indexOf: === walk. includes: Set-like equality walk. find: your callback decides.",
    [
      "Prefer includes over indexOf !== -1.",
      "find for the object; findIndex when you need to splice it out.",
      "Pass fromIndex to skip a prefix.",
      "undefined from find is ambiguous if undefined is also a valid element — use findIndex.",
    ],
    "const a = ['a', 'b', 'a'];\nconsole.log(a.indexOf('a'), a.lastIndexOf('a'), a.includes('c'));\nconst users = [{ id: 1 }, { id: 2 }];\nconsole.log(users.find((u) => u.id === 2));\nconsole.log(users.findIndex((u) => u.id === 3));\n",
    "indexOf/lastIndexOf/includes vs find/findIndex",
    "find returns undefined both for ‘not found’ and ‘found an undefined element.’",
    [
      "SameValueZero: NaN matches NaN; +0 matches -0.",
      "fromIndex is ToIntegerOrInfinity; > length short-circuits.",
      "Callbacks for find receive (element, index, array).",
    ],
  ),

  "b1-some-every": e(
    "some(fn) is true if at least one element is truthy for fn. every(fn) is true if all are. Empty array: some is false, every is true (vacuous truth). They short-circuit. They skip holes like forEach. Predicate return is ToBoolean.",
    "Boolean questions about a list without writing a for-loop. Vacuous every([]) === true surprises interviews.",
    "some = OR of predicates. every = AND of predicates. Empty AND is true; empty OR is false.",
    [
      "Use some for ‘exists’, every for ‘all pass’.",
      "Remember every([]) === true.",
      "Keep predicates side-effect free if you rely on short-circuit.",
      "They return booleans, not the element — use find for that.",
    ],
    "const a = [2, 4, 6];\nconsole.log(a.every((n) => n % 2 === 0), a.some((n) => n > 5));\nconsole.log([].every(() => false), [].some(() => true));\nconsole.log([1, 3].some((n) => n === 2));\n",
    "every/some and empty-array vacuous truth",
    "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty.",
    [
      "If length is 0, every returns true and some false without calling fn.",
      "Holes: HasProperty check skips the callback.",
      "Return IfToBoolean of the callback result.",
    ],
  ),

  "b1-array-map-filter-reduce": e(
    "map transforms each element to a new array of the same length (holes stay holes). filter keeps elements whose predicate is truthy (holes dropped). reduce(acc, el) folds left to a single value; reduceRight from the right. reduce without initializer uses the first element and throws on empty arrays.",
    "Declarative list processing is easier to review than mutable for-loops when each step is a named transform.",
    "map: same length, new values. filter: maybe shorter. reduce: funnel into one accumulator.",
    [
      "Always pass reduce’s initial value unless you like empty-array throws.",
      "Do not map if you meant forEach (no return).",
      "filter(Boolean) drops falsy, including 0 — often a bug.",
      "Chain map/filter; use reduce when you truly accumulate.",
    ],
    "const a = [1, 2, 3, 4];\nconsole.log(a.map((n) => n * 2));\nconsole.log(a.filter((n) => n % 2 === 0));\nconsole.log(a.reduce((s, n) => s + n, 0));\ntry { [].reduce((s, n) => s + n); } catch (e) { console.log(e.name); }\n",
    "map, filter, reduce with initializer vs empty throw",
    "reduce without 0 on numbers: [].reduce(sum) TypeError; [1].reduce(sum) is 1 — easy to miss in tests.",
    [
      "map uses HasProperty; holes are not visited and remain holes.",
      "filter only Includes indices that existed and passed.",
      "reduce’s kPresent logic picks the first present index as the initial acc if omitted.",
    ],
  ),

  "b1-foreach": e(
    "forEach calls a function for each present index, ignoring the callback’s return value (you cannot break). It skips holes. It is not await-aware: async callbacks will fire in parallel without waiting. Prefer for...of when you need break or await.",
    "A clearer ‘I want side effects per item’ than map. People still abuse map for side effects.",
    "A fire-and-forget walk. Returns undefined. No break ticket.",
    [
      "Use forEach for logging/DOM side effects on dense arrays.",
      "Use for...of to break or await.",
      "Do not return from forEach thinking it breaks the loop — it only returns from the callback.",
      "Exceptions still abort the walk.",
    ],
    "const a = [1, , 3];\nconst seen = [];\na.forEach((n, i) => seen.push([i, n]));\nconsole.log(seen);\n[1, 2, 3].forEach((n) => { if (n === 2) return; console.log(n); });\n",
    "forEach skips holes; return is not break",
    "await inside forEach callback does not pause the loop — the loop still finishes synchronously.",
    [
      "callbackfn is called with thisArg if provided.",
      "Return value of callback is ignored.",
      "Length is captured up front; later pushes may not be visited (implementation of the spec’s loop uses initial length).",
    ],
  ),

  "b1-flat-flatmap": e(
    "flat(depth=1) concatenates nested arrays up to depth. flat(Infinity) fully flattens. Holes are dropped. flatMap(fn) is map(fn) then flat(1) — fn can return an array to expand, or a value to keep one. Neither is recursive flatten unless you set depth. They return new arrays.",
    "Nested arrays from grouping or map-that-returns-lists needed a standard flatten.",
    "flat: smash nested lists. flatMap: transform then smash one level (map + concat).",
    [
      "flatMap instead of map().flat().",
      "Return [] from flatMap to drop an item.",
      "Do not flat() accidentally flattening strings (strings are not arrays; they stay).",
      "depth 0 is a shallow copy-ish flatten no-op beyond copy rules.",
    ],
    "console.log([1, [2, [3]]].flat(), [1, [2, [3]]].flat(2));\nconsole.log([1, 2, 3].flatMap((n) => [n, n * 10]));\nconsole.log([1, 2, 3].flatMap((n) => (n === 2 ? [] : [n])));\nconsole.log([1, , 3].flat());\n",
    "flat depth, flatMap expand/drop, holes",
    "flatMap(fn) only flats one level — returning nested arrays leaves inner arrays.",
    [
      "FlattenIntoArray recursive with depth counter.",
      "IsArray check — array-likes that are not arrays may not flatten.",
      "flatMap is equivalent to map then flatten 1, but specified as one walk.",
    ],
  ),

  "b1-array-sort": e(
    "sort() mutates and, without a comparator, converts elements to strings and compares UTF-16 (‘10' < '2'). The compare function should return negative/zero/positive. Undefined elements go to the end. toSorted is the copy version. Stability is required by modern spec (equal items keep order).",
    "Sorting is fundamental. The default string sort is a historic footgun for numbers.",
    "No comparator: dictionary of ToString. With (a,b) => a-b: numeric. It sorts in place unless you toSorted.",
    [
      "Always pass a comparator for numbers.",
      "Do not subtract if values can be bigint or non-numeric.",
      "Copy first or use toSorted to keep the original.",
      "localeCompare for human strings.",
    ],
    "console.log([10, 2, 1].sort());\nconsole.log([10, 2, 1].sort((a, b) => a - b));\nconst a = ['b', 'a'];\nconsole.log(a.toSorted(), a);\nconsole.log(['ä', 'z', 'a'].sort((x, y) => x.localeCompare(y, 'de')));\n",
    "Default string sort vs numeric comparator",
    "[10, 2].sort() → [10, 2] as strings '10','2' — '10' comes before '2'.",
    [
      "ComparearrayElements: undefined handling, then ToString if no comparefn.",
      "comparefn must be consistent or sort is implementation-defined chaos.",
      "Stability: originally not required; ES2019 required it.",
    ],
  ),

  "b1-array-from-isarray": e(
    "Array.isArray(x) is true for arrays (and array proxies), false for objects and typed arrays. Array.from(iterableOrArrayLike, mapFn?) copies to a real array. from is the right way to convert NodeList, arguments, and generators. Array.of(...items) is a literal-like constructor that does not treat a single number as length.",
    "typeof cannot spot arrays. from unifies iterables and array-likes. of fixes new Array(3) vs Array.of(3).",
    "isArray: brand check. from: materialize. of: list of arguments as elements, always.",
    [
      "Array.isArray before assuming .map exists as Array’s map.",
      "Array.from(nodeList) in the browser.",
      "Array.from({length:n}, (_,i) => i) to make 0..n-1.",
      "Array.of(3) is [3], new Array(3) is holes.",
    ],
    "console.log(Array.isArray([]), Array.isArray({ length: 0 }), Array.isArray('ab'));\nconsole.log(Array.from('ab'), Array.from({ 0: 1, 1: 2, length: 2 }));\nconsole.log(Array.from({ length: 3 }, (_, i) => i));\nconsole.log(Array.of(3), Array(3));\n",
    "isArray, from string/array-like, of vs Array(3)",
    "Array.isArray(new Uint8Array()) is false — typed arrays are not Arrays.",
    [
      "IsArray: exotic array or proxy with array target.",
      "from: if iterable, iterator walk; else LengthOfArrayLike.",
      "ArraySpeciesCreate is not used by from in the same way as map (from is on Array).",
    ],
  ),

  "b1-copying-arrays": e(
    "Shallow copies: slice(), [...arr], Array.from(arr), concat(). Nested objects stay shared. structuredClone is deep (with limits). slice copies holes as holes; spread may or may not densify holes depending on iterator vs property copy — [...sparse] uses the iterator and yields undefined for holes, densifying.",
    "Immutability patterns need copies. The hole behavior difference between slice and spread is a sharp edge.",
    "Shallow: new list, same item references. Spread on arrays uses the iterator (holes → undefined). slice copies properties (holes stay holes).",
    [
      "Use slice or concat to preserve holes if you must.",
      "Use spread when you want a dense copy.",
      "Deep: structuredClone or a custom clone.",
      "arr.slice() is a common shallow clone.",
    ],
    "const a = [1, { n: 2 }];\nconst b = a.slice();\nb[1].n = 9;\nconsole.log(a[1].n);\nconst sparse = [1, , 3];\nconsole.log(sparse.slice(), [...sparse]);\nconst d = structuredClone(a);\nd[1].n = 1;\nconsole.log(a[1].n, d[1].n);\n",
    "Shallow nest share; slice vs spread holes; structuredClone",
    "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a.",
    [
      "Array iterator yields Get(i) for 0..length-1, so holes become undefined.",
      "slice uses HasProperty and copies holes.",
      "spread of arrays uses the iterator protocol.",
    ],
  ),

  "b1-set": e(
    "Set stores unique values using SameValueZero (NaN counts as one, +0/-0 collide). It is iterable in insertion order. add/has/delete/clear, size not length. Objects are unique by reference. Sets are not typed arrays; querying is average O(1).",
    "Membership tests on arrays are O(n) and duplicates are tedious to filter. Set is the dedicated unique bag.",
    "A collection that refuses a second copy of the same value (by SameValueZero).",
    [
      "new Set(iterable) to unique an array: [...new Set(arr)].",
      "has instead of includes for large collections.",
      "Remember objects need the same reference.",
      "No index access — iterate or convert to array.",
    ],
    "const s = new Set([1, 1, 2, NaN, NaN]);\ns.add(2);\nconsole.log(s.size, s.has(1), s.has(NaN));\nconsole.log([...s]);\nconst o = {};\ns.add(o).add({});\nconsole.log(s.has(o), s.size);\n",
    "Uniqueness, NaN, object identity",
    "new Set([{a:1},{a:1}]).size is 2 — different object identities.",
    [
      "SetData list internally; SameValueZero for matching.",
      "@@iterator is the values iterator.",
      "Keys and values are the same in a Set.",
    ],
  ),

  "b1-set-vs-array": e(
    "Array: ordered list, duplicates allowed, indexes, extra methods (map/filter). Set: unique values, fast has, no random access by index. Convert with [...set] or Array.from. Use Set when the question is membership or uniqueness; array when order of duplicates and indexes matter.",
    "Both are collections. Picking the wrong one is a performance and bug choice (duplicate users in a list vs a set of ids).",
    "Array is a numbered playlist (repeats allowed). Set is a bag of unique tickets.",
    [
      "Dedupe: [...new Set(arr)].",
      "Intersection: a.filter(x => bSet.has(x)).",
      "Do not use Set for ordered stacks unless you only need uniqueness.",
      "JSON.stringify(set) is {} — convert first.",
    ],
    "const arr = [1, 2, 2, 3];\nconst unique = [...new Set(arr)];\nconst other = new Set([2, 4]);\nconsole.log(unique.filter((n) => other.has(n)));\nconsole.log(JSON.stringify(new Set([1])), JSON.stringify(unique));\n",
    "Dedupe and intersection; JSON of Set vs array",
    "JSON.stringify(new Set([1,2])) is '{}' not '[1,2]'.",
    [
      "Array is an exotic object with length; Set is a Set object with internal [[SetData]].",
      "Set iteration order is insertion order per spec.",
      "No Array.prototype methods on Set — convert or write helpers.",
    ],
  ),

  "b1-map": e(
    "Map is a key-value store with any key type (objects, functions, NaN), insertion-ordered. get/set/has/delete, size. Object keys stringify; Map keys do not. JSON.stringify(map) is {}. Iterate with map.entries() or for...of. Keys use SameValueZero.",
    "Using objects as dictionaries forces string keys and prototype pollution issues. Map is a real dictionary.",
    "A table of key→value where the key can be an object sticker, not just a string label.",
    [
      "Use Map when keys are objects or you need key order of insertion with non-strings.",
      "obj as a record of known string fields is still fine.",
      "Remember get missing is undefined (same as a stored undefined — use has).",
      "WeakMap if keys should not keep objects alive.",
    ],
    "const m = new Map();\nconst k = { id: 1 };\nm.set(k, 'meta');\nm.set(NaN, 'nan');\nconsole.log(m.get(k), m.get({ id: 1 }), m.get(NaN), m.size);\nfor (const [key, val] of m) console.log(val);\n",
    "Object keys by identity; NaN key; missing similar object",
    "m.get({id:1}) is undefined if you set with a different object that looks the same.",
    [
      "[[MapData]] list of {Key, Value} records.",
      "SameValueZero for key equality.",
      "@@iterator yields entries [k,v].",
    ],
  ),

  "b1-map-vs-object": e(
    "Objects: string/symbol keys, prototypes, JSON, literals. Map: any keys, size, no accidental proto keys, better frequent add/delete. Object is the right ‘struct.’ Map is the right ‘dictionary with unknown keys.’ Object.keys vs map.keys() differ; JSON loves objects.",
    "For years objects were fake maps. ES2015 added Map so we could stop using objects as hash tables of arbitrary keys.",
    "Object = labeled record / JSON shape. Map = hashmap. If the keys come from the user, Map (or null-proto object) is safer.",
    [
      "Config/records: object literals.",
      "Caches keyed by object: Map or WeakMap.",
      "Do not JSON.stringify a Map expecting entries.",
      "Counting keys: map.size vs Object.keys(o).length (enumerable only).",
    ],
    "const o = { a: 1 };\nconst m = new Map([['a', 1]]);\nconsole.log(o.a, m.get('a'), m.size, Object.keys(o).length);\nconsole.log(JSON.stringify(o), JSON.stringify(m));\nconst userKey = '__proto__';\no[userKey] = { x: 1 };\nconsole.log(({}).x);\n",
    "JSON and size; object __proto__ hazard sketch",
    "for (const k in map) does not iterate Map entries — map is an object with no enumerable data keys.",
    [
      "Object [[Get]] vs MapPrototypeGet looking at [[MapData]].",
      "Objects inherit Object.prototype unless create(null).",
      "Map’s size is an accessor on the prototype reading the internal count.",
    ],
  ),

  "b1-weakmap": e(
    "WeakMap keys must be objects (or non-registered symbols in newer spec); values anything. Keys are held weakly: if nothing else references the key, the entry can vanish and the key can be GC’d. No size, no iteration (would pin keys). Used for private metadata and caches.",
    "You needed to hang data on objects you do not own without leaking those objects by storing them in a Map.",
    "A sticky note on someone else’s backpack that falls off when the backpack is thrown away. You cannot list all notes.",
    [
      "const wm = new WeakMap(); wm.set(el, meta).",
      "No wm.forEach — if you need to iterate, use Map and manage lifetime.",
      "Keys cannot be primitives (except some symbols).",
      "Perfect for per-DOM-node state in libraries.",
    ],
    "const meta = new WeakMap();\nconst user = { id: 1 };\nmeta.set(user, { clicks: 3 });\nconsole.log(meta.get(user).clicks);\nconsole.log(meta.has(user));\nmeta.delete(user);\nconsole.log(meta.has(user));\n",
    "WeakMap metadata on an object key",
    "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way.",
    [
      "Keys are not enumerable from JS so GC can collect them.",
      "Implementation uses ephemerons: value is live only if key is live (plus the WeakMap).",
      "No clear() iteration of keys; WeakMap.prototype has set/get/has/delete.",
    ],
  ),

  "b1-weakset": e(
    "WeakSet stores unique object (or allowed symbol) values weakly. has/add/delete, no size, no iteration. Use as a ‘seen’ mark on objects without keeping them alive. Not for primitives. Like a WeakMap where the value is just ‘present.’",
    "Marking nodes as visited in a graph without leaking the nodes after the walk is done (if nothing else holds them).",
    "A faint stamp on objects: ‘I’ve seen you.’ When the object dies, the stamp dies. You cannot print all stamped objects.",
    [
      "seen.add(node) during a walk of a possibly cyclic object graph.",
      "Cannot store strings — use Set.",
      "No .size — if you need counts, use Set.",
      "Same GC caveats as WeakMap.",
    ],
    "const seen = new WeakSet();\nfunction walk(obj) {\n  if (obj === null || typeof obj !== 'object') return 0;\n  if (seen.has(obj)) return 0;\n  seen.add(obj);\n  return 1 + Object.values(obj).reduce((s, v) => s + walk(v), 0);\n}\nconst a = { n: 1 };\na.self = a;\nconsole.log(walk(a));\n",
    "WeakSet cycle guard in a graph walk",
    "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects.",
    [
      "[[WeakSetData]] holding weakly.",
      "SameValue for object identity.",
      "No iterator protocol on WeakSet.",
    ],
  ),

  "b1-weak-references": e(
    "WeakMap/WeakSet hold weak keys. WeakRef (ES2021) lets you hold a weak pointer to an object and deref() it, getting the object or undefined if GC’d. FinalizationRegistry runs a callback after an object is collected (not for must-run logic). These are expert GC tools, not caches you should start with.",
    "Advanced caches and wasm/host interop needed a way to notice when JS objects died without pinning them.",
    "A business card that can fade: deref() might be empty after GC. Do not write program correctness that requires a GC to run.",
    [
      "Prefer WeakMap for associated data.",
      "Do not use FinalizationRegistry for disposing critical resources — use explicit dispose.",
      "deref() results must be checked every time.",
      "GC timing is engine-defined; tests that expect collection are flaky.",
    ],
    "const wm = new WeakMap();\nlet obj = { n: 1 };\nwm.set(obj, 'meta');\nconsole.log(wm.get(obj));\nobj = null; // eligible for GC; we cannot force it here\nconst wr = new WeakRef({ x: 1 });\nconsole.log(wr.deref()?.x);\n",
    "WeakMap vs WeakRef.deref",
    "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket.",
    [
      "WeakRef [[WeakRefTarget]] can be emptied by GC.",
      "FinalizationRegistry jobs enqueue as FinalizationRegistry Cleanup Jobs.",
      "The spec forbids depending on promptness of collection.",
    ],
  ),

  "b1-destructuring": e(
    "Destructuring unpacks arrays/iterables and objects into bindings: const [a,b] = arr; const {x,y} = obj. It is pattern matching on structure, not a deep clone. Missing values become undefined. Rest (...r) gathers leftovers. Nested patterns are allowed. The right-hand side is evaluated once.",
    "Extracting fields from API objects and tuples was noisy. Patterns made unpacking a grammar feature.",
    "A cookie cutter: the left is the shape, the right is the dough. Holes in the cutter become undefined unless defaulted.",
    [
      "Rename: { name: userName }.",
      "Defaults: [x = 1] or { x = 1 } when the value is undefined.",
      "Rest last: { a, ...rest }.",
      "Do not destructure null/undefined — TypeError.",
    ],
    "const [first, , third, ...rest] = [10, 20, 30, 40, 50];\nconsole.log(first, third, rest);\nconst { name, city = 'n/a' } = { name: 'Ada' };\nconsole.log(name, city);\nconst { nested: { z } } = { nested: { z: 9 } };\nconsole.log(z);\n",
    "Array holes/rest and object defaults/nested",
    "const { x } = null throws; use default on the whole: const { x } = obj ?? {}.",
    [
      "IteratorBindingInitialization for arrays (uses @@iterator).",
      "RequireObjectCoercible for objects — primitives box, null/undefined throw.",
      "Rest in objects uses CopyDataProperties excluding extracted keys.",
    ],
  ),

  "b1-destructure-defaults": e(
    "Defaults apply only when the unpacked value is undefined, not null or 0. Nested defaults: { a: { b } = {} }. Renaming { old: neu }. You can default the whole pattern in params: function f({ x = 1 } = {}). Evaluation of default expressions is lazy (only if needed) and can see earlier bindings in the same pattern in arrays.",
    "APIs omit fields (undefined) more often than they send null. Defaults match default-parameter rules.",
    "If the slot is undefined, run the default expression. null is a provided value and wins.",
    [
      "Use ?? at the object level if null should also default.",
      "function({ a = 1 } = {}) for optional object params.",
      "Rename when API names are bad: { n: count }.",
      "Do not assume 0 triggers a default.",
    ],
    "function f({ x = 1, y: yy = 2 } = {}) {\n  return { x, yy };\n}\nconsole.log(f(), f({ x: 0 }), f({ x: undefined, y: 8 }), f({ x: null }));\nconst [a = 1, b = a + 1] = [];\nconsole.log(a, b);\n",
    "Param defaults, null vs 0 vs undefined, array default chain",
    "{ x = 1 } = { x: null } keeps null — same as function defaults.",
    [
      "Default evaluated when value is undefined (InitializeReferencedBinding path).",
      "Renaming is BindingProperty with Identifier as the local name.",
      "Object rest is excluded keys after matching.",
    ],
  ),

  "b1-spread-rest": e(
    "Spread expands: [...arr], { ...obj }, f(...args). Rest collects: (...args) =>, const [a, ...rest], const { a, ...rest }. Spread in objects is shallow enumerable own (including symbols in object spread). Array spread uses iteration. Rest must be last in the pattern. They look the same (...) but live in different grammar slots.",
    "Copying, concatenating, and forwarding arguments needed a syntax instead of apply/concat/assign.",
    "Spread: pour this container into another. Rest: scoop leftovers into a new container.",
    [
      "Copy arrays with [...a]; objects with { ...o } (shallow).",
      "f(...arr) instead of apply when this is not needed.",
      "Rest params are real arrays; arguments is not.",
      "Later object spread wins on duplicate keys.",
    ],
    "const a = [1, 2];\nconsole.log([...a, 3, ...[4]]);\nconst o = { a: 1, b: 2 };\nconsole.log({ ...o, b: 9, c: 3 });\nfunction f(x, ...rest) { return rest; }\nconsole.log(f(1, 2, 3));\nconst { b, ...restObj } = o;\nconsole.log(b, restObj);\n",
    "Array/object spread and rest params/object rest",
    "{ ...undefined } is ignored (no throw) but [...undefined] throws — asymmetric.",
    [
      "Spread in array literals uses GetIterator.",
      "Object spread CopyDataProperties (skips nullish).",
      "Rest arguments: iterator to Array.",
    ],
  ),

  "b1-iterators": e(
    "An iterator is an object with next() → { value, done }. An iterable has @@iterator that returns an iterator. for...of, spread, and destructuring use this protocol. Generators implement both. You can write custom iterators for lazy sequences. Exhausted iterators typically stay done.",
    "Arrays, maps, sets, and user types needed one for-loop protocol instead of a different API each.",
    "A cursor with a next() button. Iterable = factory of cursors. Generator = a function that pauses to yield the next value.",
    [
      "for (const x of iterable).",
      "Implement *[Symbol.iterator]() { yield ... } on your type.",
      "Do not confuse iterable (has iterator) with iterator (has next).",
      "Closing: for-of calls iterator.return() on break.",
    ],
    "const it = {\n  n: 0,\n  next() {\n    if (this.n > 2) return { done: true, value: undefined };\n    return { done: false, value: this.n++ };\n  },\n  [Symbol.iterator]() { return this; },\n};\nconsole.log([...it]);\nfunction* gen() { yield 10; yield 20; }\nconsole.log([...gen()]);\n",
    "Hand-rolled iterable and a generator",
    "Calling [...obj] when obj is the iterator that already ran — second spread is empty.",
    [
      "GetIterator / IteratorStep / IteratorClose in the spec.",
      "for-of uses IteratorClose on abrupt completions.",
      "Generator objects are both iterator and iterable (iterator returns this).",
    ],
  ),

  "b1-iterable-protocol": e(
    "The iterable protocol: obj[Symbol.iterator]() must return an iterator. The iterator protocol: next() returns an IteratorResult. Optional return()/throw() for cleanup and generator communication. Built-ins: Array, String, Map, Set, TypedArray, arguments, NodeList in browsers.",
    "A standard duck type so language features (for-of, yield*, spread) work on any library collection.",
    "If you have a well-known iterator method, JS can walk you. If you only have next, you are a cursor, not necessarily restartable.",
    [
      "Make restartable iterables return a new iterator each @@iterator call.",
      "Implement return() if you hold resources (files, locks).",
      "Strings iterate code units? Actually they iterate UTF-16 code units... wait, they iterate code points via string iterator.",
      "Map iterates entries by default.",
    ],
    "const restartable = {\n  *[Symbol.iterator]() {\n    yield 1; yield 2;\n  },\n};\nconsole.log([...restartable], [...restartable]);\nconst once = restartable[Symbol.iterator]();\nconsole.log(once.next(), once.next(), once.next());\nconsole.log([... '🙂']);\n",
    "Restartable iterable vs consumed iterator; string code points",
    "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state.",
    [
      "If @@iterator is missing, GetIterator throws TypeError.",
      "String iterator uses code points (CodePointAt), not raw [i] units only.",
      "IteratorResult objects that are not objects throw.",
    ],
  ),

  "b1-symbol-iterator": e(
    "Symbol.iterator is the well-known symbol key for the method that returns an iterator. Array.prototype[Symbol.iterator] is the same as .values(). Objects are not iterable by default — spreading {} throws. You add [Symbol.iterator] to make a type work with for-of.",
    "A unique key that cannot collide with a user method named iterator. Well-known symbols are the protocol hooks.",
    "The official doorbell labeled ‘please give me a cursor.’",
    [
      "obj[Symbol.iterator] = function* () { ... }.",
      "Do not stringify this key — JSON drops it.",
      "Array.from uses this protocol when present.",
      "querySelectorAll lists are iterable in modern browsers.",
    ],
    "const range = {\n  from: 1,\n  to: 3,\n  [Symbol.iterator]: function* () {\n    for (let i = this.from; i <= this.to; i++) yield i;\n  },\n};\nconsole.log([...range]);\ntry { console.log([...{ a: 1 }]); } catch (e) { console.log(e.name); }\nconsole.log(typeof [][Symbol.iterator]);\n",
    "Custom @@iterator vs plain object spread error",
    "{...obj} object spread does NOT use Symbol.iterator — it copies properties. [...obj] does.",
    [
      "GetMethod(obj, @@iterator).",
      "Array spread vs object spread are different operations.",
      "The symbol is the same per realm as other well-known symbols.",
    ],
  ),

  "b1-generators": e(
    "function* and *method() create generator functions. Calling them returns a generator object, it does not run the body yet. .next(arg) runs until yield, returning {value, done}. return() and throw() inject completion. Generators are lazy pull streams and can implement iterators cleanly.",
    "Writing iterator next() by hand is stateful and ugly. yield pauses a function so the caller can pull values.",
    "A function that can pause at yield and resume, handing out values one at a time. First next() starts, later next(x) sends x into the last yield.",
    [
      "Use function* for sequences and walkers.",
      "for (const x of gen()) to consume.",
      "Remember the first next() argument is ignored (nothing to inject yet).",
      "try/finally still runs on IteratorClose.",
    ],
    "function* count(n) {\n  for (let i = 0; i < n; i++) yield i;\n}\nconst g = count(3);\nconsole.log(g.next(), g.next(), g.next(), g.next());\nfunction* ping() {\n  const x = yield 'ask';\n  yield x * 2;\n}\nconst p = ping();\nconsole.log(p.next(), p.next(5));\n",
    "Pulling yielded values; injecting into yield",
    "gen() vs gen: passing the generator function where an iterator is expected — you must call it.",
    [
      "GeneratorStart / GeneratorResume / Yield.",
      "Generators have [[GeneratorState]] suspended/executing/completed.",
      "yield is not available in arrow functions.",
    ],
  ),

  "b1-yield": e(
    "yield expr pauses the generator and gives expr to .next(). The result of the yield expression is the argument to the subsequent .next(arg). yield* iterable delegates to another iterator, forwarding next/return/throw, and the value of yield* is the inner iterator’s final value. yield is not a return; the function can continue.",
    "Two-way communication (pull values out, push values in) and composing generators (yield*) needed syntax.",
    "yield = pause and send. next(x) = resume and deliver x as the value of yield. yield* = ‘you take over for a while.’",
    [
      "Use yield* to flatten nested generators.",
      "Do not confuse yield with await (async generators have both).",
      "The expression after yield is evaluated before pausing.",
      "return in a generator sets done true with that value.",
    ],
    "function* inner() { yield 1; yield 2; return 99; }\nfunction* outer() {\n  const r = yield* inner();\n  yield r;\n}\nconsole.log([...outer()]);\nfunction* twoWay() {\n  const a = yield 10;\n  yield a;\n}\nconst g = twoWay();\nconsole.log(g.next(), g.next('hi'));\n",
    "yield* forwarding and two-way next(arg)",
    "[...gen] drops the return value of the generator — spread only collects yielded values, not the final return.",
    [
      "yield* uses Loop of IteratorStep and can capture completion value.",
      "IteratorClose is invoked if the outer generator closes early.",
      "yield in try/finally: finally runs on close.",
    ],
  ),

  "b1-async-iterators": e(
    "Async iterators have next() → Promise<{value, done}>. for await...of consumes them. Async generators (async function*) yield promises/values and can await inside. ReadableStreams and some DB cursors are async iterables. Symbol.asyncIterator is the hook. for await on a sync iterable wraps values in promises.",
    "I/O sequences (paginated APIs, files) should be pull-based without loading everything. await in the loop is the natural shape.",
    "next() is async. for await waits for each page before asking the next. An async generator is a pauseable async function that yields a stream.",
    [
      "for await (const chunk of asyncIterable).",
      "Implement async *[Symbol.asyncIterator]().",
      "Do not for-await a huge in-memory array unless you like extra microtasks.",
      "Break still calls iterator.return() for cleanup.",
    ],
    "async function* ticks(n) {\n  for (let i = 0; i < n; i++) {\n    await Promise.resolve();\n    yield i;\n  }\n}\nconst acc = [];\nfor await (const x of ticks(3)) acc.push(x);\nconsole.log(acc);\n",
    "async generator consumed with for await",
    "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited.",
    [
      "GetIterator with hint async looks up @@asyncIterator then falls back to wrapping @@iterator.",
      "Await on next() results.",
      "AsyncGeneratorResume similar to generators plus promise plumbing.",
    ],
  ),

  "b1-symbols": e(
    "Symbol() creates a unique primitive. Descriptions are debug-only. As object keys they avoid collisions and skip Object.keys/JSON. Symbols are not coerced to strings by + (throws in some contexts) / templates throw. They are not enumerable by default when defined via [] in literals they are enumerable actually if created in literals... literal [sym]: val is enumerable.",
    "Protocols (iterator, asyncIterator, toStringTag) and library metadata needed collision-free property names.",
    "A unique ID chip. Same description ≠ same chip, unless Symbol.for.",
    [
      "const k = Symbol('k'); obj[k] = v.",
      "Object.getOwnPropertySymbols to list.",
      "Do not use symbols as JSON fields.",
      "Well-known symbols for protocols.",
    ],
    "const a = Symbol('id');\nconst b = Symbol('id');\nconsole.log(a === b, String(a));\nconst o = { [a]: 1, vis: 2 };\nconsole.log(Object.keys(o), o[a], Object.getOwnPropertySymbols(o));\ntry { console.log(a + ''); } catch (e) { console.log(e.name); }\n",
    "Uniqueness, hidden keys, ToString throw on +",
    "JSON.stringify({ [Symbol('a')]: 1 }) is '{}' — data loss.",
    [
      "typeof 'symbol'; Type is Symbol.",
      "ToNumber on symbol throws; ToString throws except explicit String().",
      "OwnPropertyKeys lists symbols after strings.",
    ],
  ),

  "b1-symbol-for": e(
    "Symbol.for(key) looks up or creates a symbol in a global registry shared across the runtime (and realms in some embeddings). Symbol.keyFor(sym) returns the key or undefined for local symbols. Use for cross-package well-known-ish keys; use Symbol() for private unique keys.",
    "Two libraries needed to share the same symbol without importing the same Symbol() result. A string key in a registry is that handshake.",
    "A lost-and-found desk: you ask for 'id', you get the same chip everyone else got for 'id'.",
    [
      "Symbol.for('my-lib.id') for shared protocol keys.",
      "Symbol('id') when you do not want sharing.",
      "keyFor only works for registry symbols.",
      "Registry is global — pick namespaced strings.",
    ],
    "const a = Symbol.for('app.id');\nconst b = Symbol.for('app.id');\nconsole.log(a === b, Symbol.keyFor(a));\nconst local = Symbol('app.id');\nconsole.log(Symbol.keyFor(local), local === a);\n",
    "Symbol.for identity vs local Symbol",
    "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss.",
    [
      "GlobalSymbolRegistry is a list of {[[Key]], [[Symbol]]}.",
      "Symbol.for ToString’s the key.",
      "iframe realms: for-registry is usually per-agent, but well-known symbols are per-realm — don’t mix them up.",
    ],
  ),

  "b1-well-known-symbols": e(
    "Well-known symbols are built-in hooks: iterator, asyncIterator, toStringTag, toPrimitive, hasInstance, species, match, replace, split, search, unscopables, isConcatSpreadable, toPrimitive, dispose (newer). Libraries implement these to plug into operators and APIs. They are unique per realm.",
    "The language needed extension points that would not collide with user properties named iterator or match.",
    "Official USB ports on objects. If you implement the port, for-of / instanceof / String methods can call you.",
    [
      "Implement @@iterator for for-of.",
      "@@toPrimitive for conversion.",
      "@@hasInstance to customize instanceof.",
      "Do not overwrite well-known symbols on built-in prototypes in apps.",
    ],
    "class Enum {\n  static [Symbol.hasInstance](v) { return typeof v === 'number'; }\n}\nconsole.log(1 instanceof Enum, '1' instanceof Enum);\nconst tagged = { [Symbol.toStringTag]: 'Enum' };\nconsole.log(Object.prototype.toString.call(tagged));\n",
    "@@hasInstance and @@toStringTag",
    "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array.",
    [
      "Well-known symbols are %Symbol.iterator% etc., created per realm.",
      "OrdinaryHasInstance is skipped if @@hasInstance is present.",
      "RegExp methods check @@match on the first arg of String.prototype.match.",
    ],
  ),

  "b1-execution-contexts": e(
    "An execution context is the spec’s running record: which function/script/module, the lexical/variable environment, this, and (for functions) arguments. The engine pushes a context when you enter a script or call a function and pops it on return. There is always a running context (or the engine is idle in the host).",
    "The spec needed a precise ‘where am I and what names can I see?’ while nested calls happen.",
    "A stack frame with extra JS fields (this, environments). Nested calls = nested contexts.",
    [
      "Each call = new function context.",
      "eval has its own (and quirks).",
      "Modules start a module context.",
      "async functions still use contexts when they run; they may pause between awaits.",
    ],
    "function a() { return b(); }\nfunction b() { return c(); }\nfunction c() { return new Error('here').stack; }\nconsole.log(a());\n",
    "Stack of execution contexts visible in Error.stack",
    "Thinking async functions stay on the stack while awaiting — they leave; resume is a later context push.",
    [
      "Execution Context stack in the spec.",
      "Running execution context is the top.",
      "Generator/async pause stores state in the generator/async-context internals, not by staying on the stack.",
    ],
  ),

  "b1-global-execution-context": e(
    "The global execution context is created when a script or the realm starts: this is the global object in classic scripts, undefined in modules. It holds the global environment (object + declarative). Only one global context per realm is ‘the’ global, but each script evaluation uses it. Top-level code runs here.",
    "Something has to be the first frame: built-ins and top-level var live here.",
    "The ground floor of the building. All function calls are higher floors that eventually return here.",
    [
      "Top-level this in modules is undefined.",
      "Classic script top-level this is window in browsers.",
      "Top-level await pauses module evaluation, not a function frame you wrote.",
      "Do not dump app state on the global context.",
    ],
    "console.log(globalThis === (typeof window !== 'undefined' ? window : globalThis));\nconsole.log((function () { return this; })());\nconsole.log((() => this)());\n",
    "Global object vs function this vs arrow this at top level",
    "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo.",
    [
      "ScriptEvaluation / GlobalDeclarationInstantiation.",
      "thisBinding of the global context is the global object for scripts.",
      "Module context has this = undefined.",
    ],
  ),

  "b1-function-execution-context": e(
    "A function execution context is pushed on call: new environments for params/vars, this bound (unless arrow), new.target, and a reference to the outer lexical environment. Returning or throwing pops it. Recursion pushes many. Closures keep environments after pop.",
    "Each invocation needs isolated locals even if the same function runs twice.",
    "A new sticky-note pad per call, with an arrow pointing to the outer pad you were born in.",
    [
      "Locals from two calls do not collide.",
      "this is set at this push (call site).",
      "Too many pushes: stack overflow.",
      "await pops until resume pushes again.",
    ],
    "function f(n) {\n  const local = n * 10;\n  if (n === 0) return local;\n  return local + f(n - 1);\n}\nconsole.log(f(3));\n",
    "Each recursive call has its own local",
    "Assuming a recursive function’s `local` is shared — only closed-over outer lets are shared.",
    [
      "PrepareForOrdinaryCall + OrdinaryCallBindThis + EvaluateBody.",
      "Function environment record holds this/new.target/super.",
      "Pop on return, throw, or await suspend.",
    ],
  ),

  "b1-variable-environment": e(
    "The spec distinguishes VariableEnvironment (var, function declarations, arguments in sloppy) and LexicalEnvironment (let/const/block, plus usually the same as VE in simple functions). They diverge with catch, with, and eval. Most teaching just says ‘environment.’ Knowing both helps explain why var ignores blocks.",
    "var needed a stable home for the whole function even as lexical environments nested for blocks.",
    "VE = the function’s var closet. LE = the current nested closet. let uses LE; var is stuffed in VE.",
    [
      "var always in the function VE.",
      "let in the current block LE.",
      "You almost never access these names in code — they are spec.",
      "with() temporarily prepends an object LE (banned in strict).",
    ],
    "function demo() {\n  var a = 1;\n  {\n    let b = 2;\n    var c = 3;\n    console.log(a, b, c);\n  }\n  console.log(a, c);\n  try { console.log(b); } catch (e) { console.log(e.name); }\n}\ndemo();\n",
    "var in function VE vs let in block LE",
    "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments.",
    [
      "FunctionDeclarationInstantiation initializes VE.",
      "BlockDeclarationInstantiation pushes a new LE.",
      "Eval in sloppy can create var bindings on the VE.",
    ],
  ),

  "b1-call-stack": e(
    "The call stack is the LIFO stack of execution contexts. A call pushes; return/throw pops. The host starts with a global or module context. Async: the stack unwinds at await, then a later job pushes a fresh stack to continue. Stack traces are snapshots of this stack at throw time.",
    "CPUs and VMs run one nested chain of calls per thread. JS’s single-threaded story is ‘one stack at a time’ plus queues.",
    "A stack of plates. Each function call adds a plate. Return removes it. Overflow if you stack too high.",
    [
      "Read traces from top (throw site) down to global.",
      "Recursion depth ≈ stack size.",
      "await: the plate is put in a locker, not left on the stack.",
      "Do not block the stack with huge sync loops — that is the same thread.",
    ],
    "function inner() { throw new Error('boom'); }\nfunction outer() { inner(); }\ntry { outer(); } catch (e) { console.log(e.stack); }\n",
    "Error.stack shows the call stack",
    "setTimeout(fn) does not grow the current stack — fn runs on a later empty-ish stack (plus host frames).",
    [
      "Execution context stack in the spec.",
      "Host-defined stack overflow → RangeError.",
      "Promise jobs run with an empty JS stack (new root).",
    ],
  ),

  "b1-stack-frames": e(
    "A stack frame (execution context) holds the current function, instruction pointer, locals/environments, and this. DevTools shows it in the Call Stack pane. Minified code needs source maps to make frames readable. Async stack traces stitch frames across jobs in DevTools, but the engine stack was empty between.",
    "Debugging is ‘which plate am I on and what locals are on it?’ Frames are that view.",
    "One plate: function name, line, local bindings. The pile of plates is the stack.",
    [
      "Click frames in DevTools to see locals.",
      "Named functions make frames nicer than anonymous.",
      "Blackbox library frames to see your code.",
      "Remember async frames may be synthesized by DevTools.",
    ],
    "function alpha(n) {\n  const x = n + 1;\n  return beta(x);\n}\nfunction beta(n) {\n  debugger;\n  return n * 2;\n}\nconsole.log(alpha(3));\n",
    "Two frames: alpha waiting on beta",
    "Anonymous arrows all look the same in traces — name them or assign to consts for inferred names.",
    [
      "The spec frame is an execution context; VMs have native frames too.",
      "Error.captureStackTrace (V8) snapshots frames.",
      "Tail calls would reuse frames; they are mostly unimplemented.",
    ],
  ),

  "b1-stack-overflow": e(
    "Stack overflow is RangeError: Maximum call stack size exceeded when recursion (or insane nesting) exceeds the engine’s frame quota. Mutual recursion counts. Async recursion with await does not grow the JS stack across awaits (each resume is a new short stack) but can still starve the loop. Convert to iterative or trampoline.",
    "The stack is finite. Infinite recursion would otherwise hang forever without an error.",
    "Too many plates. The waiter refuses and throws RangeError.",
    [
      "Base case first in recursion.",
      "Deep trees: explicit heap stack (array) instead of call stack.",
      "Do not diagnose a hang as overflow if it is an infinite sync loop without calls.",
      "Increase stack only in special VM flags — not in browsers for users.",
    ],
    "function boom(n) { return boom(n + 1); }\ntry { boom(0); } catch (e) { console.log(e.name, e.message.slice(0, 40)); }\nfunction safe(n) {\n  let s = 0;\n  for (let i = 0; i < n; i++) s += i;\n  return s;\n}\nconsole.log(safe(1e6));\n",
    "Recursive overflow vs iterative loop",
    "JSON.stringify on a cyclic object throws TypeError (cycle), not stack overflow — different error.",
    [
      "Host-defined limit; not a spec number.",
      "Each OrdinaryCallBindThis + EvaluateBody costs a frame.",
      "Generators do not grow the stack while suspended.",
    ],
  ),

  "b1-stack-traces": e(
    "Error.stack is a host-formatted string of frames (V8: Error\\n    at fn (file:line:col)). It is not fully standardized historically. PrepareStackTrace can customize in Node. Source maps rewrite file/line. async traces in DevTools include awaited callers. Never parse stack strings for control flow in production if you can avoid it.",
    "Humans and log aggregators need a breadcrumb of calls. Hosts format it for their DevTools.",
    "A printed receipt of plates at the moment of throw (or Error() construction in V8).",
    [
      "Log e.stack (or e, which often includes it).",
      "Use source maps in production carefully (privacy vs debug).",
      "Do not match English stack text — V8 vs Firefox formats differ.",
      "throw new Error('msg') captures the stack at new Error.",
    ],
    "function deep() {\n  const e = new Error('trace');\n  return e.stack;\n}\nfunction mid() { return deep(); }\nconsole.log(mid());\n",
    "Stack captured at new Error(), not at throw",
    "Creating the Error in a helper and throwing later still shows the helper as the top frame unless you use captureStackTrace tricks.",
    [
      "V8 captures stack at Error constructor by default.",
      "HTML browsers also fill stack; format is implementation-defined.",
      "error.cause chains another error without replacing stack.",
    ],
  ),

  "b1-js-engine": e(
    "A JS engine parses source, compiles (interpreter + JIT), allocates a heap, runs the stack, and garbage-collects. V8, SpiderMonkey, JavaScriptCore, LibJS are engines. They implement ECMA-262 plus embedding hooks. Performance folklore (hidden classes) is engine-specific; correctness is spec.",
    "Browsers and Node needed a fast, spec-compliant executor. Competing engines keep each other honest.",
    "Parser → bytecode → maybe optimized machine code; heap of objects; GC. Your source is not executed as text line-by-line forever.",
    [
      "Write spec-correct code first.",
      "Keep object shapes stable for JIT friendliness.",
      "Avoid megamorphic call sites in hot loops if profiling says so.",
      "Do not micro-optimize for V8 only without measuring.",
    ],
    "function Point(x, y) { this.x = x; this.y = y; }\nconst pts = [];\nfor (let i = 0; i < 1000; i++) pts.push(new Point(i, i));\nconsole.log(pts[0].x + pts[999].y);\n",
    "Stable object shape in a hot constructor",
    "Deleting properties or adding them out of order in a hot constructor makes shapes megamorphic and can slow code.",
    [
      "V8 Ignition bytecode, Sparkplug, Maglev, TurboFan as tiers.",
      "Hidden classes / maps / shapes describe property layout.",
      "Spec abstract operations are the source of truth for behavior.",
    ],
  ),

  "b1-engine-vs-host": e(
    "The engine runs the language. The host (browser, Node) provides the event loop, timers, DOM/fs, and embedding API. Promise jobs are specified; who drains them is the host’s event loop. The same V8 in Chrome and Node feels different because hosts differ.",
    "ECMA-262 cannot specify HTML parsing or TCP. The split lets engines embed in many products.",
    "Engine = CPU for JS. Host = operating system APIs + scheduler.",
    [
      "Ask: is this in ECMA-262 or a Web/Node spec?",
      "Portable code sticks to language + WinterCG APIs.",
      "Timers are host; Promise.then is language (jobs) drained by host.",
      "Workers are extra hosts/realms.",
    ],
    "console.log('engine Math', Math.hypot(3, 4));\nconsole.log('host timeout', typeof setTimeout);\nconsole.log('host fetch', typeof fetch);\nqueueMicrotask(() => console.log('microtask drained by host loop'));\nconsole.log('sync done');\n",
    "Language Math vs host timers/fetch vs microtask",
    "Assuming setImmediate exists in browsers (Node-ish) or document in Node.",
    [
      "Host hooks: HostEnqueuePromiseJob, HostEnsureCanCompileStrings, etc.",
      "Jobs vs tasks: HTML event loop vs spec Job Queue.",
      "Realms isolate intrinsics; hosts create realms.",
    ],
  ),

  "b1-heap": e(
    "The heap is where objects, closures’ environments, and large data live. The stack holds frames and primitives-in-progress. ‘Heap snapshot’ in DevTools shows objects that GC has not collected. Leaks are reachability from roots (window, closures, DOM), not ‘the heap is broken.’",
    "Dynamic objects cannot all live on a stack that pops. A garbage-collected heap is the storage for identity and closures.",
    "Stack = short-term plates. Heap = warehouse of objects with reference arrows. GC sweeps unreferenced warehouse aisles.",
    [
      "Objects, arrays, functions live on the heap.",
      "Closed-over lets live in heap environment records.",
      "Take heap snapshots to find detached DOM + listeners.",
      "Large TypedArrays are heap (or backing store) too.",
    ],
    "function make() {\n  const bulky = new Array(1000).fill(0);\n  return () => bulky.length;\n}\nconst fn = make();\nconsole.log(fn());\n",
    "Closed-over array lives on the heap with the function",
    "Setting a global to a huge object ‘temporarily’ and forgetting — it stays until you null the global.",
    [
      "GC roots: stack, globals, handles from the host (DOM).",
      "V8 young/old generation heap spaces.",
      "Environment records are heap objects when escaped.",
    ],
  ),

  "b1-parsing-jit": e(
    "Source is parsed to an AST then bytecode (or similar). An interpreter runs bytecode. Hot functions are JIT-compiled to machine code with type assumptions. If assumptions fail, the engine deoptimizes back to bytecode. Syntax errors happen at parse; TypeErrors at run.",
    "Start-up wants fast parse+interpret; long-running code wants machine code. JIT is the compromise.",
    "First performance: careful reading (parse). Then walking (interpret). Then sprinting (JIT) until a pothole (deopt).",
    [
      "Avoid eval/Function() — extra parse, harder optimize.",
      "Keep types stable in hot functions.",
      "Parse errors vs runtime errors are different stages.",
      "Huge functions can be harder to optimize.",
    ],
    "function hot(x) { return x + 1; }\nlet s = 0;\nfor (let i = 0; i < 1e5; i++) s = hot(s);\nconsole.log(s);\ntry { eval('function ('); } catch (e) { console.log(e.name); }\n",
    "Warm a function; eval parse error",
    "Using eval to ‘optimize’ config — you pay parse every time and lose optimizations.",
    [
      "Early errors at parse; runtime errors during evaluation.",
      "Deoptimization: type feedback no longer matches.",
      "Lazy parsing / inner-function skipping in V8 for start-up.",
    ],
  ),

  "b1-v8-architecture": e(
    "V8 (Chrome/Node) uses Ignition (interpreter), compiling to bytecode, then optimizing compilers (Sparkplug, Maglev, TurboFan depending on version) for hot code. Orinoco GC. Hidden classes and inline caches are core. Node adds libuv around V8. You do not program V8 directly in app code.",
    "Chrome needed a fast engine; Node reused it. Architecture explanations help performance interviews stay honest.",
    "A pipeline of compilers with a GC next door, wrapped by a host. Bytecode first, machine code if you earn it.",
    [
      "Measure with DevTools/Node profiler, do not guess tiers.",
      "Stable shapes, predictable types.",
      "Avoid with/eval in hot paths.",
      "Read V8 blogs for current tier names — they change.",
    ],
    "class T { constructor(a, b) { this.a = a; this.b = b; } }\nfunction sum(o) { return o.a + o.b; }\nlet t = 0;\nfor (let i = 0; i < 1e4; i++) t += sum(new T(i, 1));\nconsole.log(t);\n",
    "Monomorphic hidden class in a tight loop",
    "Citing ‘Crankshaft’ in 2026 interviews — that pipeline is long gone.",
    [
      "Maps (hidden classes) + IC (inline caches) at load/call sites.",
      "On-heap vs off-heap (pointer compression) details evolve.",
      "TurboFan uses Sea of Nodes IR for optimizations.",
    ],
  ),

  "b1-hidden-classes": e(
    "Hidden classes (shapes/maps) are V8’s internal type for object layout: the same property names added in the same order share a shape. Adding properties in different orders, deleting, or mixing types at a site makes megamorphic ICs. This is an optimization, not a language rule — behavior stays spec-correct.",
    "Dynamic objects are slow if every read is a hash lookup. Shapes let engines treat objects like structs when they look regular.",
    "Objects that grew the same way share a blueprint. A weird extra property makes a new blueprint and can slow the factory line.",
    [
      "Initialize all fields in the constructor in the same order.",
      "Avoid delete in hot objects; set null.",
      "Do not add optional fields late in a hot path without need.",
      "This never changes JavaScript semantics.",
    ],
    "function A(x) { this.x = x; this.y = 1; }\nfunction B(x) { this.y = 1; this.x = x; }\nconst a = new A(1);\nconst b = new B(1);\nfunction read(o) { return o.x + o.y; }\nconsole.log(read(a), read(b));\n",
    "Same fields, different init order — two shapes",
    "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick.",
    [
      "Transition tree of maps as properties are added.",
      "Inline cache records the map seen at a load.",
      "Megamorphic ICs fall back to slow lookup.",
    ],
  ),

  "b1-event-loop": e(
    "The event loop is the host’s scheduler: run a task (macrotask), then drain the microtask queue, then maybe render (browsers), repeat. JS itself is single-threaded per isolate: only one stack at a time. Timers, I/O, and DOM events enqueue tasks. Promise reactions enqueue microtasks.",
    "A UI thread cannot block on network forever. The loop lets JS run to completion, then service the next event.",
    "A to-do list of tasks plus a VIP line (microtasks) that must empty before the next normal task or paint.",
    [
      "Sync code runs now, on the current stack.",
      "queueMicrotask / Promise.then run after current stack, before the next timer.",
      "setTimeout is a task, not a microtask.",
      "Never spin a tight loop waiting for a flag a timer will set — you block the loop.",
    ],
    "console.log('A');\nsetTimeout(() => console.log('D timeout'), 0);\nPromise.resolve().then(() => console.log('C microtask'));\nconsole.log('B');\n",
    "A B, then microtask C, then timeout D",
    "setTimeout(fn, 0) is not ‘right after this function’ — microtasks and other tasks may run first, and 0 is clamped.",
    [
      "HTML event loop: perform a task, then microtasks, then update the rendering.",
      "ECMAScript Jobs (PromiseJobs) are the microtask flavor.",
      "Node has phases (timers, poll, check) plus nextTick.",
    ],
  ),

  "b1-run-to-completion": e(
    "Run-to-completion means a JS task finishes its synchronous work before any other JS on that thread runs. No other event handler interleaves your for-loop. await yields, ending the current job. Shared variables are safe from parallel JS threads (unless Workers post). Long tasks delay everyone else.",
    "Without preemptive threads, you avoid data races in the language. The cost is jank if a task is long.",
    "The bartender finishes your whole cocktail before taking the next order. A long recipe makes the line wait.",
    [
      "Keep tasks short (chunk work, requestAnimationFrame, workers).",
      "You will not see another handler mutate state mid-loop on the same thread.",
      "Workers are other threads with copies/messages, not shared objects (except SAB).",
      "await is the polite yield.",
    ],
    "let n = 0;\nsetTimeout(() => { n = 99; }, 0);\nfor (let i = 0; i < 1e6; i++) n += 1;\nconsole.log('after loop', n);\nqueueMicrotask(() => console.log('micro', n));\n",
    "The loop finishes before the timeout can set n=99",
    "SharedArrayBuffer + Atomics is the exception — true parallel mutation is possible there.",
    [
      "A task is an atomic script execution from the host’s point of view.",
      "Microtasks still run-to-completion individually, chained after the task.",
      "Web Workers have their own loops and heaps.",
    ],
  ),

  "b1-microtasks": e(
    "Microtasks (Promise jobs, queueMicrotask, MutationObserver callbacks in browsers) run after the current task’s sync code, before the next macrotask and before rendering. A chain of .then can starve rendering if it never stops enqueueing. await after a resolved promise continues as a microtask.",
    "Promise reactions needed to run soon and in order, without waiting for a 4ms timer. A separate queue got a higher priority.",
    "VIP line: finish all VIPs before the next normal customer or before the painter paints.",
    [
      "Promise.then / queueMicrotask → microtask.",
      "setTimeout / setInterval / I/O / events → macrotask (task).",
      "Do not recursively queue microtasks in an infinite chain.",
      "Use a timeout to yield to rendering.",
    ],
    "console.log(1);\nqueueMicrotask(() => console.log(3));\nPromise.resolve().then(() => console.log(4));\nsetTimeout(() => console.log(5), 0);\nconsole.log(2);\n",
    "Sync 1–2, microtasks 3–4, then timeout 5",
    "Assuming Promise.then is a macrotask like setTimeout(0) — it is faster/earlier.",
    [
      "Perform a microtask checkpoint in HTML after each task.",
      "HostEnqueuePromiseJob → microtask queue.",
      "MutationObserver uses the same checkpoint.",
    ],
  ),

  "b1-macrotasks": e(
    "Macrotasks (tasks) include timer callbacks, event handlers, I/O, postMessage, setImmediate (Node). One task runs, then all microtasks, then maybe render, then the next task. Two setTimeout(0) callbacks are two tasks; a Promise between them still runs after the first task, before the second.",
    "The host needs a queue of ‘work from the outside world.’ Tasks are that queue’s unit.",
    "The normal to-do list. After each item, drain the VIP microtask list.",
    [
      "setTimeout(fn, 0) schedules a task.",
      "UI events are tasks (then microtasks after the handler).",
      "Chunking: schedule the next slice with a timer or rAF.",
      "Node: setImmediate vs timeout vs nextTick (nextTick is special).",
    ],
    "setTimeout(() => {\n  console.log('T1');\n  Promise.resolve().then(() => console.log('M after T1'));\n}, 0);\nsetTimeout(() => console.log('T2'), 0);\nPromise.resolve().then(() => console.log('M first'));\nconsole.log('S');\n",
    "M first, then T1, M after T1, then T2",
    "Two timeouts of 0 still run as separate tasks with a microtask checkpoint between them.",
    [
      "HTML: task queues (timer, user-interaction, networking, …) with selection rules.",
      "Not all tasks have equal priority in browsers.",
      "Node poll phase vs timers phase ordering differs from browsers.",
    ],
  ),

  "b1-queue-microtask": e(
    "queueMicrotask(fn) schedules fn as a microtask without a Promise. It runs with the same priority as Promise.then. If fn throws, it is reported as an uncaught exception on that microtask, not as a rejection unless you use promises. Use it when you want ‘after this stack’ without allocating a Promise.",
    "Hosts and libraries needed the Promise-job timing without faking a resolve().then.",
    "Push this function onto the VIP line, no Promise wrapper required.",
    [
      "queueMicrotask(() => ...) to defer until after DOM updates in the same task sometimes.",
      "Prefer Promises when you need chaining/error propagation.",
      "Do not queueMicrotask in a tight recursive storm.",
      "In Node, process.nextTick is even sooner than microtasks in some versions — don’t mix casually.",
    ],
    "console.log('a');\nqueueMicrotask(() => console.log('c'));\nPromise.resolve().then(() => console.log('d'));\nconsole.log('b');\n",
    "queueMicrotask alongside Promise.then",
    "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled.",
    [
      "queueMicrotask is specified in HTML as queuing a microtask.",
      "It is not in ECMA-262; engines expose it as a host function.",
      "Ordering vs already-queued Promise jobs is FIFO on the same queue.",
    ],
  ),

  "b1-microtask-starvation": e(
    "If every microtask enqueues another microtask, the checkpoint never finishes, so timers, I/O, and rendering never run. That is starvation. A resolved Promise.then chain that keeps going is enough. Yield with setTimeout/rAF/scheduler.yield to let macrotasks in.",
    "Microtasks have higher priority. Unbounded VIP traffic blocks the restaurant floor.",
    "The VIP line keeps growing from within. Normal customers (paint, click, timeout) never get served.",
    [
      "Do not recurse only via Promise.resolve().then(again).",
      "Batch work; schedule the next batch as a task.",
      "Watch infinite async function loops without a real await on I/O.",
      "await Promise.resolve() still stays in microtasks.",
    ],
    "let n = 0;\nfunction starve(limit) {\n  if (n++ > limit) return;\n  Promise.resolve().then(() => starve(limit));\n}\nstarve(5);\nsetTimeout(() => console.log('timeout after chain, n=', n), 0);\nconsole.log('scheduled');\n",
    "A bounded then-chain; unbounded would delay the timeout forever",
    "await Promise.resolve() in a while(true) loop starves the page just like then-recursion.",
    [
      "The microtask checkpoint loops until the queue is empty.",
      "There is no fairness with the task queue inside that loop.",
      "scheduler.yield() (when available) is designed to break this.",
    ],
  ),

  "b1-event-loop-puzzles": e(
    "Puzzles mix console.log, then, catch, setTimeout, queueMicrotask, and nested promises. Method: run all sync first, collect microtasks in FIFO, run them (they may enqueue more microtasks), then one macrotask, repeat. async functions jump to microtasks at each await. Draw two queues.",
    "Interviews test whether you internalized jobs vs tasks, not whether you memorized one viral tweet.",
    "Two columns: Now | Micro | Macro. Simulate, don’t guess.",
    [
      "Underline every then/await/timeout.",
      "Sync logs first.",
      "FIFO within each queue.",
      "New microtasks from a microtask run before the next timer.",
    ],
    "console.log('1');\nsetTimeout(() => console.log('5'), 0);\nPromise.resolve().then(() => {\n  console.log('3');\n  setTimeout(() => console.log('6'), 0);\n});\nqueueMicrotask(() => console.log('4'));\nconsole.log('2');\n",
    "Classic 1 2 3 4 5 6 ordering",
    "Putting a timeout inside a then: that timeout is still a macrotask, not a microtask.",
    [
      "Promise then jobs enqueue when the promise fulfills, not when then is called if already settled — still a job.",
      "Already-resolved then still async (microtask), never sync.",
      "HTML rendering not shown in Node puzzles.",
    ],
  ),

  "b1-settimeout": e(
    "setTimeout(fn, ms, ...args) schedules a task to run after at least ms milliseconds (clamped, nested timeouts have a minimum). It returns an id for clearTimeout. fn runs with host-defined this. Delay 0 still waits for the current stack, microtasks, and the timer phase. It does not pause code.",
    "The web needed deferred work and animations-before-rAF. Timers are the original ‘later’ API.",
    "A kitchen timer that queues fn onto the task list when it rings — if the loop is busy, it rings late.",
    [
      "Store the id and clearTimeout on unmount.",
      "Pass extra args instead of closing over if it helps.",
      "Do not use timeout as a sleep in a busy loop.",
      "Wrap in Promises for await sleep(ms).",
    ],
    "const id = setTimeout((x) => console.log('later', x), 20, 7);\nconsole.log('now', id);\nconst sleep = (ms) => new Promise((r) => setTimeout(r, ms));\nawait sleep(10);\nconsole.log('slept');\nclearTimeout(id);\n",
    "setTimeout id, extra arg, promise sleep, clear",
    "clearTimeout after the callback already ran is a no-op — the work happened.",
    [
      "HTML timer nesting: after 5 nested timeouts, minimum delay is 4ms in browsers historically.",
      "The callback is a task, not a microtask.",
      "Node Timeout objects vs numeric ids in browsers.",
    ],
  ),

  "b1-setinterval": e(
    "setInterval(fn, ms) queues fn repeatedly. If fn takes longer than ms, browsers may skip or delay (you can get overlap or catch-up depending on host). Always clearInterval. For animation, prefer requestAnimationFrame. Drift happens; it is not a metronome.",
    "Polling and repeating ticks needed a one-liner. It is a blunt instrument compared to chaining setTimeout after work finishes.",
    "A repeating alarm. If you are still working when it rings again, the next ring still queues — you can pile up (implementation-dependent).",
    [
      "clearInterval in the same scope that started it.",
      "Prefer recursive setTimeout when each run should wait for completion.",
      "Do not setInterval(async fn) without guarding re-entry.",
      "rAF for visual frames.",
    ],
    "let n = 0;\nconst id = setInterval(() => {\n  n += 1;\n  console.log('tick', n);\n  if (n >= 3) clearInterval(id);\n}, 10);\n",
    "setInterval with self-clear after 3 ticks",
    "async interval callbacks can overlap if each await lasts longer than ms — use a lock or chained timeout.",
    [
      "HTML: if the previous callback is still running, additional timestamps may be coalesced in some browsers.",
      "Still a repeating task source.",
      "clearInterval and clearTimeout are often interchangeable on ids in browsers.",
    ],
  ),

  "b1-minimum-delay": e(
    "setTimeout(fn, 0) does not mean 0ms. Browsers clamp, especially nested timeouts (historically 4ms). The delay is a minimum until the timer is eligible, not a guarantee. A busy main thread makes it late. Node’s timers have their own phase and 1ms granularity stories.",
    "Spinning 0ms timers starved the page, so hosts imposed floors. Also OS timer resolution is finite.",
    "‘0’ means ‘next chance after the clamp and after current work,’ not ‘preempt now.’",
    [
      "Use queueMicrotask if you meant ‘after this stack, before paint/timers.’",
      "Use rAF for frames.",
      "Measure real delay if timing matters.",
      "Do not write tests that assume 0ms timeout runs before a then — it does not.",
    ],
    "const t0 = Date.now();\nsetTimeout(() => console.log('delay', Date.now() - t0), 0);\nPromise.resolve().then(() => console.log('micro first', Date.now() - t0));\n",
    "Microtask still wins over timeout 0",
    "Benchmarking with setTimeout(0) as ‘immediate’ — it is not immediate vs promises.",
    [
      "HTML minimum delay and nesting-level rules.",
      "Timer eligibility vs task-queue picking.",
      "Date.now resolution can make small delays look 0 or 1ms.",
    ],
  ),

  "b1-requestanimationframe-js": e(
    "From the language’s view, requestAnimationFrame(cb) is a host function that schedules cb before the next repaint with a timestamp. It is a different queue from timeouts (animation frame callbacks). In Node it may be missing or polyfilled. This topic is the scheduling idea; the browser paint pipeline is B3.",
    "Timers are not vsync-aligned. rAF exists so JS can mutate the DOM once per frame without overproducing.",
    "‘Call me when you are about to paint.’ Not ‘call me in 16ms’ exactly.",
    [
      "Schedule the next frame at the end of cb for loops.",
      "cancelAnimationFrame(id) on stop.",
      "Do not do heavy CPU in rAF — you miss frames.",
      "Feature-detect in non-browser runtimes.",
    ],
    "let id;\nfunction loop(ts) {\n  console.log('frame', ts);\n  if (ts < 100) id = requestAnimationFrame(loop);\n}\nif (typeof requestAnimationFrame === 'function') {\n  id = requestAnimationFrame(loop);\n} else {\n  console.log('no rAF in this host');\n}\n",
    "rAF loop with timestamp; host may lack it",
    "Using setTimeout(16) as fake rAF — it drifts and is not paint-aligned.",
    [
      "HTML: animation frame callbacks run before rendering in the event loop.",
      "Timestamp is DOMHighResTimeStamp relative to time origin.",
      "Multiple rAFs in one frame all run in that frame’s callback list.",
    ],
  ),

  "b1-callback-concept": e(
    "A callback is a function passed to be invoked by another function or by the host. Continuation-passing style: instead of return, you call next(err, value). JS used callbacks for events and I/O before promises. They are just functions; ‘callback’ is a role.",
    "The caller cannot wait forever on the stack for a click or a socket. Passing a continuation is the original async style.",
    "Leave a phone number. They call you back when the thing happens. You are not on hold on the same stack.",
    [
      "Name the role: onSuccess, onError.",
      "Document sync vs async invocation.",
      "Bind this if passing a method.",
      "Prefer promises/async in new APIs, still understand callbacks.",
    ],
    "function loadFake(cb) {\n  setTimeout(() => cb(null, { ok: true }), 5);\n}\nloadFake((err, data) => {\n  if (err) console.error(err);\n  else console.log(data);\n});\nconsole.log('requested');\n",
    "Error-first-style callback after a timeout",
    "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that.",
    [
      "Call(callback, thisArg, args) from the callee or host.",
      "No spec type ‘Callback’ — user convention.",
      "EventTarget uses listeners, a specialized callback list.",
    ],
  ),

  "b1-sync-vs-async-callbacks": e(
    "A sync callback runs before the outer function returns (Array#map). An async callback runs in a later turn (fs.readFile, setTimeout). Mixing them in one API (sometimes sync cache hit, sometimes async) is Zalgo: the caller cannot reason about order. Always async or always sync per API.",
    "People write if (cache) cb() else network(cb) and create heisenbugs. ‘Do not release Zalgo’ is the cultural rule.",
    "If I might call you before I return, you are sync. If I only call you from a queue, you are async. Pick one.",
    [
      "Never optionally-sync-optionally-async the same callback.",
      "Use queueMicrotask to defer a cache hit if the API is async.",
      "map/forEach are sync — do not put them in the async bucket.",
      "Document it.",
    ],
    "function zalgo(useCache, cb) {\n  if (useCache) cb('sync');\n  else setTimeout(() => cb('async'), 0);\n}\nlet order = [];\nzalgo(true, (v) => order.push(v));\norder.push('after');\nconsole.log(order);\norder = [];\nzalgo(false, (v) => order.push(v));\norder.push('after');\nconsole.log(order);\n",
    "Same API, two orders — Zalgo",
    "A memoized async function that calls cb(value) synchronously on hit — consumers race.",
    [
      "The spec does not enforce async; library design does.",
      "Promise.resolve().then(cb) forces async even for cached values.",
      "Node callback style historically suffered this in early libs.",
    ],
  ),

  "b1-error-first-callbacks": e(
    "Node’s convention: cb(err, result) — err is null/undefined on success, an Error on failure; result is undefined on failure. You must check err first. It does not throw to the caller of the async function. Forgetting to handle err swallows failures. Promises replaced this with reject.",
    "JS had no standard async throw. Two arguments on one callback became the community standard for I/O.",
    "First slot is the ambulance. If it is empty, the second slot is the package.",
    [
      "if (err) return cb(err) in wrappers.",
      "Never throw in async Node callbacks expecting it to become err.",
      "Wrap with util.promisify / fs.promises.",
      "Do not use both throw and err in the same API.",
    ],
    "function readFake(fail, cb) {\n  setTimeout(() => {\n    if (fail) cb(new Error('nope'));\n    else cb(null, 'ok');\n  }, 0);\n}\nreadFake(false, (err, val) => console.log(err, val));\nreadFake(true, (err, val) => console.log(err && err.message, val));\n",
    "Success (null, data) vs failure (Error, undefined)",
    "cb(err) without return, then also cb(null, data) — double callback.",
    [
      "Convention only; the engine does not know err-first.",
      "domain / uncaughtException were old Node attempts to catch thrown async errors.",
      "promisify assumes this convention.",
    ],
  ),

  "b1-callback-hell": e(
    "Callback hell is nested callbacks for sequential async steps, indenting into a pyramid. Inversion of control: you hand your continuation to a third-party that might call it twice, never, or sync. Promises flatten chains; async/await looks like sync. Named functions and early returns also flatten without promises.",
    "I/O is sequential in business logic but callbacks nest. The pyramid is a readability and error-handling failure.",
    "A waterfall of anonymous functions. Each step holds the next hostage. Promises turn it into a list of then/await.",
    [
      "async/await with try/catch.",
      "Named step functions instead of anonymous nests.",
      "Promise.prototype.then chain if you cannot await.",
      "Do not mix callback APIs without wrapping.",
    ],
    "function step(n) { return new Promise((r) => setTimeout(() => r(n), 0)); }\nconst a = await step(1);\nconst b = await step(a + 1);\nconst c = await step(b + 1);\nconsole.log(c);\nstep(1).then((x) => step(x + 1)).then((x) => step(x + 1)).then(console.log);\n",
    "Sequential async without a pyramid of callbacks",
    "Still nesting await in callbacks (forEach) recreates hell and skips awaiting.",
    [
      "Inversion of control is a design property: the callee owns the call.",
      "Promises restore some control: settle once, thenable chain.",
      "async functions desugar to generator-like promise machines.",
    ],
  ),

  "b1-promises": e(
    "A Promise is an object representing a future fulfillment or rejection. It is thenable: then(onFulfilled, onRejected). It starts pending, then settles once. Reactions run as microtasks. Promises are eager: the executor runs immediately. They compose with then/catch/finally and combinators.",
    "Callbacks needed a return value you could attach more callbacks to, with standardized once-only settle and error bubbling.",
    "A box that will contain a value or a reason. You register reactions; they run later, in microtasks, once.",
    [
      "new Promise((resolve, reject) => ...) for wrapping callbacks.",
      "return promises from then to chain.",
      "Always handle rejections (catch or await try).",
      "Do not nest new Promise around an existing promise unnecessarily.",
    ],
    "const p = new Promise((resolve) => {\n  console.log('executor now');\n  resolve(1);\n});\np.then((v) => console.log('then', v));\nconsole.log('after new');\n",
    "Executor is sync; then is a microtask",
    "new Promise(async () => ...) — reject does not catch awaits inside unless you try/catch; anti-pattern.",
    [
      "[[PromiseState]] pending/fulfilled/rejected, [[PromiseResult]].",
      "HostEnqueuePromiseJob for reactions.",
      "Thenables are assimilated via PromiseResolveThenableJob.",
    ],
  ),

  "b1-promise-states": e(
    "Pending: not settled. Fulfilled: has a value. Rejected: has a reason. Settled = fulfilled or rejected; it never un-settles. resolve(otherPromise) adopts that promise’s state (pending until then). resolve(thenable) may async-follow it. reject(x) does not wait. Fulfill with undefined if you resolve() with no arg.",
    "A three-state machine is enough for ‘not yet / ok / fail’ and forbids double settle bugs if implemented correctly.",
    "A one-way street: pending → fulfilled XOR rejected. resolve on an already settled promise is ignored.",
    [
      "Inspect with then; there is no .state in the spec for user code.",
      "Promise.resolve(x) wraps or adopts.",
      "Do not resolve and reject; first wins.",
      "Rejection reasons should be Errors.",
    ],
    "const p = new Promise((resolve, reject) => {\n  resolve(1);\n  reject(new Error('ignored'));\n});\np.then((v) => console.log('v', v), (e) => console.log('e', e));\nconst pending = new Promise(() => {});\nconsole.log(typeof pending.then);\n",
    "First settle wins; forever-pending is possible",
    "Forever-pending promises (forgot to resolve) look like hangs — not rejections.",
    [
      "FulfillPromise / RejectPromise no-ops if not pending.",
      "Resolve walks thenables (PromiseResolveThenableJob) and can stay pending.",
      "No public getter for [[PromiseState]].",
    ],
  ),

  "b1-then-catch-finally": e(
    "then(onF, onR) returns a new promise. catch(fn) is then(undefined, fn). finally(fn) runs on settle, passes through the original value/reason unless fn throws/rejects. If onF returns a value, the next promise fulfills with it; if it throws, the next rejects. Returning a promise adopts it.",
    "Chaining needed a new promise per step so errors can skip to the next onR. finally is for cleanup that should not swallow the result.",
    "Each then is a station. Success cars take the onF track; error cars take onR. finally is a toll both pay, then continue as they were.",
    [
      "return inside then to pass values down.",
      "throw or return Promise.reject to go to the next catch.",
      "finally for stopLoading(); do not return unless you mean to override.",
      "then() with no args still waits a microtask.",
    ],
    "Promise.resolve(1)\n  .then((n) => n + 1)\n  .then((n) => { throw new Error('x' + n); })\n  .catch((e) => e.message)\n  .finally(() => console.log('done'))\n  .then(console.log);\n",
    "then transform, throw, catch, finally passthrough",
    "finally(() => { return 0 }) replaces a fulfilled value with 0 — usually accidental.",
    [
      "Promise.prototype.then uses PerformPromiseThen, creating a new PromiseCapability.",
      "finally uses then with functions that rethrow/return original.",
      "onF/onR not functions: identity / thrower defaults.",
    ],
  ),

  "b1-promise-chaining": e(
    "Each then returns a distinct promise. A returned primitive fulfills the next. A returned promise makes the next wait. Errors skip later onF until an onR. Flattening: return innerPromise, do not wrap extra. Branching: two then on the same promise are independent forks, not a chain.",
    "Sequential async with error bubbling is the point of promises vs nested callbacks.",
    "A railway: return a promise to add a bridge. Two thens on one promise are two trains from the same station.",
    [
      "Chain: p.then(a).then(b).",
      "Fork: p.then(a); p.then(b) — both see p’s result, order is then-registration FIFO.",
      "Do not forget to return the inner promise.",
      "async/await is chain sugar.",
    ],
    "const p = Promise.resolve(1);\np.then((n) => n + 1).then((n) => console.log('chain', n));\np.then((n) => console.log('fork', n));\nPromise.resolve(2)\n  .then(() => Promise.resolve(3))\n  .then((n) => console.log('flat', n));\n",
    "Chain vs fork vs flattening a returned promise",
    "Missing return: .then(() => { fetch(...) }) fulfills with undefined, not the fetch result.",
    [
      "Each then installs a reaction on the original and creates a new promise.",
      "Jobs for multiple thens on one promise run in registration order.",
      "ReturnIfAbrupt in the reaction job rejects the next promise.",
    ],
  ),

  "b1-error-propagation": e(
    "A rejection jumps to the next onRejected / catch / await throw. If none, it becomes an unhandled rejection. throw in a then callback rejects the next promise. throw in the executor rejects that promise. Synchronous throw before creating a promise still throws sync — wrap in the executor or async function.",
    "Async errors cannot use the call stack of the original caller. Promises are the error channel.",
    "A hot potato of failure that travels down the chain until someone catch()es, else the host yells.",
    [
      "End chains with catch or await in try/catch.",
      "In async, throw x ⇔ return Promise.reject(x).",
      "Do not swallow with catch(() => {}) without logging.",
      "error.cause to wrap while keeping the original.",
    ],
    "Promise.resolve()\n  .then(() => { throw new Error('boom'); })\n  .then(() => console.log('skip'))\n  .catch((e) => console.log('caught', e.message));\nasync function f() { throw new Error('async'); }\nf().catch((e) => console.log(e.message));\n",
    "Rejection skips then, caught later; async throw",
    "catch that returns undefined ‘handles’ the error and later then sees undefined — not a rethrow.",
    [
      "If no handler, HostPromiseRejectionTracker(operation=reject).",
      "throw in executor is caught by Promise constructor and rejects.",
      "throw outside any promise machinery is a normal exception.",
    ],
  ),

  "b1-promise-combinators": e(
    "Combinators build one promise from many: all, allSettled, race, any. They take iterables of thenables. Empty all fulfills with [] immediately. Empty race stays pending forever. They do not cancel losers (unless you add AbortSignal). Order of results in all matches input order, not finish order.",
    "Parallel async is common. A small set of join operators covers success-all, wait-all, first-done, first-success.",
    "all: wait for every rose, fail if one wilts. allSettled: wait anyway. race: first to finish (win or lose). any: first to succeed.",
    [
      "all for dependent parallel loads that all must work.",
      "allSettled for reports that should include failures.",
      "race for timeouts (Promise.race([work, sleep])).",
      "any when any mirror is enough.",
    ],
    "const ok = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));\nconst bad = (ms) => new Promise((_, j) => setTimeout(() => j(new Error('e')), ms));\nconsole.log(await Promise.all([ok(0, 1), ok(0, 2)]));\nconsole.log(await Promise.allSettled([ok(0, 1), bad(0)]));\n",
    "all values vs allSettled mixed outcomes",
    "Promise.race([fetch, timeout]) does not abort fetch when timeout wins — the network still runs.",
    [
      "PerformPromiseAll / AllSettled / Race / Any with remaining-elements counts.",
      "Empty race: remaining is 0 but no resolve — pending.",
      "any rejects with AggregateError if all reject.",
    ],
  ),

  "b1-promise-all": e(
    "Promise.all(iterable) fulfills with an array of results in input order when every input fulfills. The first rejection rejects all immediately (fail-fast). Non-promises are wrapped with Promise.resolve. It does not cancel siblings on failure.",
    "‘Load these N resources’ is the most common parallel join. Fail-fast matches ‘page cannot render without all.’",
    "A group project: if one member fails, the project fails; grades still sit in seat-order when all succeed.",
    [
      "map to promises then all.",
      "Handle the rejection and optionally still await others if you need cleanup.",
      "Empty array → resolved [].",
      "Do not all a huge unbounded map of jobs — limit concurrency.",
    ],
    "const ps = [1, 2, 3].map((n) => Promise.resolve(n * 10));\nconsole.log(await Promise.all(ps));\ntry {\n  await Promise.all([Promise.resolve(1), Promise.reject(new Error('x'))]);\n} catch (e) { console.log(e.message); }\n",
    "all success array vs fail-fast reject",
    "Promise.all on a map that returns undefined (forgot return) fulfills with [undefined, …].",
    [
      "Each then records at its index; count down remaining.",
      "Reject short-circuits the result promise; others still settle in the background.",
      "Iterator of the argument is consumed up front.",
    ],
  ),

  "b1-promise-allsettled": e(
    "Promise.allSettled waits for every input to settle and fulfills with {status:'fulfilled', value} or {status:'rejected', reason} per index. It does not reject (unless creating the list throws). Use it for ‘run all, then report.’ Empty → [].",
    "Dashboards and batch jobs need all outcomes, not fail-fast. allSettled is that report card.",
    "Wait for every student to finish the test, then publish every score and every absence.",
    [
      "allSettled then filter status.",
      "Do not confuse with all — allSettled never fail-fasts.",
      "Still does not cancel anything.",
      "TypeScript: discriminated union on status.",
    ],
    "const r = await Promise.allSettled([\n  Promise.resolve(1),\n  Promise.reject(new Error('no')),\n]);\nconsole.log(r.map((x) => x.status));\nconsole.log(r[0].value, r[1].reason.message);\n",
    "fulfilled and rejected entries side by side",
    "Checking r.value without checking status — rejected entries have reason, not value.",
    [
      "Always fulfills the outer promise (for valid iterables).",
      "Same indexing as all.",
      "Added in ES2020; polyfills exist.",
    ],
  ),

  "b1-promise-race": e(
    "Promise.race(iterable) settles with the first input that settles, whether fulfill or reject. Empty race is forever pending. Use for timeouts: race(work, rejectAfter(ms)). The losers keep running. First-to-settle, not first-to-fulfill (that is any).",
    "Timeouts and ‘whoever answers first’ need a winner-take-all join.",
    "A sprint: first across the line, gold or injury, ends the race promise. Others still run off-track.",
    [
      "Timeout helper: reject after ms, race with work.",
      "AbortController to actually stop fetch.",
      "Empty array: hang — guard it.",
      "Do not race for ‘first success’ — use any.",
    ],
    "const slow = new Promise((r) => setTimeout(() => r('slow'), 30));\nconst fast = Promise.resolve('fast');\nconsole.log(await Promise.race([slow, fast]));\nconst timeout = new Promise((_, j) => setTimeout(() => j(new Error('t')), 0));\ntry { await Promise.race([slow, timeout]); } catch (e) { console.log(e.message); }\n",
    "race first fulfill vs timeout reject",
    "Timeout ‘wins’ but the slow request still hits the server — race is not cancel.",
    [
      "Each then tries to resolve/reject the same result capability; first job wins.",
      "Empty iterator: no then attached, forever pending.",
      "Already-settled inputs win on the next microtask in iteration order.",
    ],
  ),

  "b1-promise-any": e(
    "Promise.any fulfills with the first fulfillment. If all reject, it rejects with AggregateError (errors array). Empty any rejects with AggregateError immediately. It ignores rejections until all have failed. Still no cancel of slower successes.",
    "Mirrors / CDNs: first successful response wins; failures should not fail-fast like race.",
    "First rose that blooms. If the whole garden dies, you get a bouquet of errors (AggregateError).",
    [
      "any([primary, mirror]) for redundant I/O.",
      "Inspect err.errors in the catch.",
      "Empty array rejects — not pending.",
      "Not the same as race (race can reject first).",
    ],
    "try {\n  const v = await Promise.any([\n    Promise.reject(new Error('a')),\n    Promise.resolve('ok'),\n  ]);\n  console.log(v);\n} catch (e) { console.log(e); }\ntry {\n  await Promise.any([Promise.reject(new Error('x'))]);\n} catch (e) { console.log(e.name, e.errors[0].message); }\n",
    "First fulfillment wins; all reject → AggregateError",
    "Using race instead of any: a fast rejection kills you even if a slower success would have saved the page.",
    [
      "PerformPromiseAny counts remaining rejections.",
      "AggregateError is an Error with an errors list.",
      "Fulfill short-circuits the result; other promises continue.",
    ],
  ),

  "b1-sequential-vs-parallel": e(
    "Sequential async: await a; await b — total time is sum. Parallel: start both, then await Promise.all — total time is max. Accidental sequential is mapping with await inside a for-loop when jobs were independent. Parallel needs care: overload, ordering, and failure policy (all vs allSettled).",
    "Latency is the UX. Independent I/O should overlap. Dependent steps cannot.",
    "Cooking: boil water then cook pasta (sequential) vs preheat oven while chopping (parallel). Dependencies decide.",
    [
      "Independent fetches: Promise.all.",
      "Each step needs the previous result: await in a loop.",
      "Limit concurrency with a pool.",
      "Do not all(hugeArray) of writes without a cap.",
    ],
    "const job = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));\nconst t0 = Date.now();\nawait job(10, 1);\nawait job(10, 2);\nconsole.log('seq', Date.now() - t0);\nconst t1 = Date.now();\nawait Promise.all([job(10, 1), job(10, 2)]);\nconsole.log('par', Date.now() - t1);\n",
    "Two 10ms jobs: sequential ~20 vs parallel ~10",
    "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow.",
    [
      "await on an already-started promise just waits; start time is when you constructed it.",
      "all registers then on each immediately.",
      "The event loop interleaves their completions as tasks/microtasks.",
    ],
  ),

  "b1-async-await": e(
    "async function always returns a Promise. await pauses the async function until the thenable settles, then resumes with the value or throws the reason. await does not block the JS thread; it yields. Non-promises are wrapped. Top-level await exists in modules. forEach + async is a trap.",
    "Promise chains were still noisy. await makes async look like linear code while keeping the event loop free.",
    "A function that can set down the stack at await and pick it up later with the unwrapped value (or a throw).",
    [
      "Mark functions async when they await.",
      "try/catch around await for rejections.",
      "await Promise.all for parallel.",
      "async () => {} in map still returns promises — await them with all.",
    ],
    "async function load() {\n  const a = await Promise.resolve(1);\n  const b = await Promise.resolve(a + 1);\n  return b;\n}\nconsole.log(await load());\nconsole.log(load() instanceof Promise);\n",
    "await unwraps; async always returns a promise",
    "async function f(){ return 1 } — callers must still await or then; they get a Promise, not 1.",
    [
      "async functions are specified via Promise capability and Await.",
      "await uses Awaited thenable processing (microtask when it’s a native promise).",
      "Return in async fulfills; throw rejects.",
    ],
  ),

  "b1-await-try-catch": e(
    "try/catch around await catches rejections of that await (and sync throws). catch on the returned promise is equivalent for the caller. finally runs on both. If you await in try and forget catch, the async function rejects. Multiple awaits can share one try or use finer-grained catches.",
    "await rethrows rejections as exceptions so existing try/catch works. That is the ergonomic point.",
    "A rejected promise at await becomes a throw at that line. catch is the same net as .catch on the function’s promise if it wraps everything.",
    [
      "try { await x; await y } catch (e) { ... }.",
      "catch per await if recovery differs.",
      "finally { hideSpinner() }.",
      "Do not mix .catch and try on the same await without understanding double-handle.",
    ],
    "async function main() {\n  try {\n    await Promise.reject(new Error('fail'));\n    console.log('unreachable');\n  } catch (e) {\n    console.log('caught', e.message);\n  } finally {\n    console.log('finally');\n  }\n}\nawait main();\n",
    "await rejection → catch → finally",
    "try/catch around Promise.all without awaiting — you catch nothing; the promise rejects later unhandled.",
    [
      "Await’s reject path throws the reason in the async function’s resume.",
      "It is still a microtask later, not a sync throw from the callee’s stack.",
      "finally in async still runs as JS finally after completion of the try.",
    ],
  ),

  "b1-await-does-not-block": e(
    "await yields the thread: the async function’s remainder is scheduled (microtask after a native promise). Other events, rendering, and other functions can run while you wait. A busy while() before await does block. await is not a kernel sleep that stops the process; Node can still exit if nothing else is pending.",
    "If await blocked the isolate, a single fetch would freeze the page. Yielding is the whole reason async exists.",
    "You leave the counter; someone else is served; when your food is ready you come back. A tight loop is you never leaving.",
    [
      "You can still freeze the page with sync CPU, not with await fetch.",
      "Workers for CPU; await for I/O.",
      "Do not spin-wait on a flag.",
      "In Node, keep a handle (server, timer) if you need the process alive.",
    ],
    "console.log('A');\nconst p = Promise.resolve().then(() => console.log('C'));\nawait p;\nconsole.log('D');\nsetTimeout(() => console.log('E'), 0);\nconsole.log('B-ish after await of microtask');\n",
    "await yields; other jobs can run around it",
    "while(!done) {} waiting for a timeout to set done — the timeout never runs; you blocked the loop.",
    [
      "Await: promise then jobs resume the async function via Resume.",
      "The stack of the original caller of the async function already continued (got a Promise).",
      "Host can paint between tasks, not in the middle of your sync CPU.",
    ],
  ),

  "b1-async-control-flow": e(
    "Async control flow is sequencing, branching, looping, and joining with await/all/race. Patterns: waterfall (await in series), parallel join, timeout race, retry loops with backoff, queues with concurrency limits. for await of streams. Errors: try/catch, Promise.all fail-fast vs allSettled.",
    "Business workflows are graphs of I/O. Structured async is how you implement those graphs in JS.",
    "Flowcharts where some arrows are ‘wait for a promise.’ Pick sequential vs parallel per arrow.",
    [
      "Series: for-of + await.",
      "Parallel: map to promises, all.",
      "Retry: loop + catch + delay.",
      "Cancel: AbortSignal through the graph.",
    ],
    "async function retry(fn, n) {\n  let last;\n  for (let i = 0; i < n; i++) {\n    try { return await fn(); } catch (e) { last = e; }\n  }\n  throw last;\n}\nlet k = 0;\nconst v = await retry(async () => {\n  k += 1;\n  if (k < 2) throw new Error('e');\n  return k;\n}, 3);\nconsole.log(v);\n",
    "Retry loop as async control flow",
    "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately.",
    [
      "Each await is a resume point; loops just create many of them.",
      "all/race are joins in the graph.",
      "AbortSignal is host-level cancellation plumbing, not a language keyword.",
    ],
  ),

  "b1-abort-controller-js": e(
    "AbortController is a language-adjacent Web/Node API: controller.abort(reason) flips signal.aborted and fires ‘abort’. Promises do not auto-cancel; fetch and some streams observe the signal. You can abort(reason) and awaiters can throw AbortError. This topic is the signal as a token; fetch details live in B3.",
    "Race conditions and navigation needed a standard cancel token instead of ad-hoc cancelled flags.",
    "A shared tripwire. abort() yanks it; anyone holding the signal can stop work and reject.",
    [
      "const c = new AbortController(); pass c.signal.",
      "abort() in cleanup / timeout / new request.",
      "Check signal.aborted or listen once.",
      "Wrap user promises to reject on abort if the API ignores signals.",
    ],
    "const c = new AbortController();\nconst { signal } = c;\nconst p = new Promise((resolve, reject) => {\n  signal.addEventListener('abort', () => reject(signal.reason), { once: true });\n  setTimeout(() => resolve('ok'), 50);\n});\nc.abort(new Error('cancel'));\ntry { await p; } catch (e) { console.log(e.message); }\n",
    "AbortSignal rejecting a hand-rolled promise",
    "abort() does not stop a running CPU loop — only cooperative APIs and checks.",
    [
      "AbortSignal is an EventTarget with aborted flag and reason.",
      "AbortError DOMException is conventional for fetch.",
      "The spec for promises has no abort; integration is host APIs.",
    ],
  ),

  "b1-stale-requests": e(
    "A stale request is an older async result arriving after a newer one and overwriting UI/state. Causes: no abort, no generation counter, overlapping fetches for the same widget. Fix: increment a request id, ignore mismatches; or abort the previous; or disable concurrency.",
    "Users type fast; networks reorder. Last-write-wins without identity is wrong when last-to-finish is not last-started.",
    "Two letters in the mail. The slow old letter must not replace the new address you already showed.",
    [
      "AbortController per latest request.",
      "let seq=0; const my=++seq; after await if (my!==seq) return.",
      "Disable the input until done if that matches UX.",
      "Do not only sort by completion time.",
    ],
    "let seq = 0;\nasync function search(q, api) {\n  const my = ++seq;\n  const data = await api(q);\n  if (my !== seq) return 'stale';\n  return data;\n}\nconst api = (q) => new Promise((r) => setTimeout(() => r(q), q === 'old' ? 20 : 0));\nconst a = search('old', api);\nconst b = search('new', api);\nconsole.log(await a, await b);\n",
    "Sequence numbers dropping a slow stale result",
    "Showing whichever fetch finishes last — that can be the old query.",
    [
      "Network completion order is not start order.",
      "Abort + ignore is belt and suspenders.",
      "React Strict Mode double-invoke makes this bug more visible.",
    ],
  ),

  "b1-timeouts-retries": e(
    "Timeouts: race work against a timer (and abort). Retries: loop on failure with backoff (linear/exponential + jitter). Deduplication: share one in-flight promise for the same key so five clicks are one request. Combine: retry only idempotent GETs; do not retry POSTs blindly.",
    "Networks fail and users double-click. These three patterns make I/O robust without melting the server.",
    "Stop waiting (timeout), try again (retry), and don’t send twins (dedupe). Abort is how timeout becomes real cancel.",
    [
      "Timeout + AbortSignal on fetch.",
      "Exponential backoff with jitter.",
      "Map<key, Promise> for inflight dedupe; delete in finally.",
      "Cap retry count; don’t retry 4xx except 429 with Retry-After.",
    ],
    "const inflight = new Map();\nfunction dedupe(key, fn) {\n  if (inflight.has(key)) return inflight.get(key);\n  const p = fn().finally(() => inflight.delete(key));\n  inflight.set(key, p);\n  return p;\n}\nconst p1 = dedupe('u', () => Promise.resolve(1));\nconst p2 = dedupe('u', () => Promise.resolve(2));\nconsole.log(p1 === p2, await p1);\n",
    "In-flight promise deduplication by key",
    "Retrying a non-idempotent POST creating duplicate orders.",
    [
      "Dedupe relies on Promise identity sharing.",
      "finally removes the cache even on reject so the next call retries.",
      "Timeouts are just another reject reason — distinguish AbortError.",
    ],
  ),

  "b1-concurrency-limiting": e(
    "A concurrency limiter runs at most N async jobs at once; extras wait. Implement with a queue plus a running count, or a pool of workers. Promise.all on thousands of fetches can exhaust sockets/memory. p-limit style: wrap fn so each call returns a promise that waits for a slot.",
    "Browsers and servers have connection limits. Unbounded all() is a self-DoS.",
    "A nightclub with N wristbands. When one guest leaves, the next in line gets a band.",
    [
      "Choose N (e.g. 4–8 for HTTP in browsers).",
      "Queue FIFO unless you have priorities.",
      "Error in one job should not leak slots (finally release).",
      "allSettled + limiter for batches.",
    ],
    "function limit(n) {\n  let active = 0;\n  const q = [];\n  const run = () => {\n    while (active < n && q.length) {\n      active += 1;\n      const { fn, resolve, reject } = q.shift();\n      Promise.resolve().then(fn).then(resolve, reject).finally(() => { active -= 1; run(); });\n    }\n  };\n  return (fn) => new Promise((resolve, reject) => { q.push({ fn, resolve, reject }); run(); });\n}\nconst l = limit(2);\nconst job = (v) => () => Promise.resolve(v);\nconsole.log(await Promise.all([1, 2, 3, 4].map((v) => l(job(v)))));\n",
    "Tiny pool of 2 wrapping four jobs",
    "Forgetting finally { active-- } leaks every slot after the first error.",
    [
      "This is user-space scheduling on the single thread + async I/O.",
      "It does not create OS threads.",
      "Fairness is your queue’s policy.",
    ],
  ),

  "b1-error-types": e(
    "Error is the base. Subclasses: TypeError (wrong type/shape), ReferenceError (bad binding), SyntaxError (parse), RangeError (stack overflow, invalid length), URIError, EvalError (legacy). DOMException in browsers. Custom classes should extend Error and set name. Anything can be thrown; only Error has stack (usually).",
    "Catch blocks and logs need a taxonomy. Built-in names tell you which language rule broke.",
    "A family of failure objects. name is the species; message is the story; stack is the trail.",
    [
      "throw new TypeError('...') when types are wrong.",
      "if (e instanceof TypeError) for recovery.",
      "instanceof fails across realms.",
      "Always Error, not throw 'string' (no stack in some hosts).",
    ],
    "try { null.f(); } catch (e) { console.log(e.name); }\ntry { missing; } catch (e) { console.log(e.name); }\ntry { new Array(-1); } catch (e) { console.log(e.name); }\ntry { JSON.parse('{'); } catch (e) { console.log(e.name); }\n",
    "TypeError, ReferenceError, RangeError, SyntaxError",
    "catch (e) { if (e === 'string') } after libraries throw strings — normalize to Error.",
    [
      "NativeError constructors set [[ErrorData]] and name.",
      "SyntaxError from JSON.parse is runtime, from eval/parse of scripts can be early.",
      "error.cause is a standard chain field.",
    ],
  ),

  "b1-typeerror": e(
    "TypeError: calling a non-function, reading property of null/undefined, mixing bigint and number, assigning to const (some engines), immutable object writes in strict. ReferenceError: reading an unbound identifier (or TDZ). RangeError: invalid array length, stack overflow, toFixed digits. They are not interchangeable in interviews.",
    "Different abstract operations fail differently: GetValue unbound vs Call non-callable vs ToIndex out of range.",
    "TypeError = wrong kind of value. ReferenceError = no such binding. RangeError = number out of allowed range.",
    [
      "nullish guard before .prop to avoid TypeError.",
      "Declare names to avoid ReferenceError.",
      "Validate lengths before new Array(n).",
      "Read e.name in tests, not just e.message language.",
    ],
    "try { (undefined)(); } catch (e) { console.log(e.name); }\ntry { console.log(notDeclared); } catch (e) { console.log(e.name); }\ntry { (1n + 1); } catch (e) { console.log(e.name); }\ntry { ''.toFixed(100); } catch (e) { console.log(typeof ''.toFixed); }\ntry { (1).toFixed(101); } catch (e) { console.log(e.name); }\n",
    "TypeError vs ReferenceError vs RangeError on toFixed",
    "Saying ‘undefined is not a function’ is TypeError, not ReferenceError — the binding existed, the value was not callable.",
    [
      "Call requires IsCallable.",
      "GetValue of an unresolvable reference → ReferenceError.",
      "ToIndex / array length operations → RangeError.",
    ],
  ),

  "b1-throw-try-catch": e(
    "throw expr raises an exception (any value). try runs a block; catch binds the thrown value; finally always runs on leave (return, throw, break). catch optional if finally exists. Inner finally runs before the outer catch. throw in finally can mask the original error.",
    "Structured exception handling lets deep code fail without every layer returning error codes — until async, where promises take over.",
    "Eject from the stack until a catch net. finally is the ‘wash your hands’ on the way out, even if you rethrow.",
    [
      "throw new Error(msg).",
      "finally for cleanup (close, unlock).",
      "Do not throw from finally unless you intend to hide the first error.",
      "Optional catch binding: catch { } when you do not need e.",
    ],
    "function f() {\n  try {\n    throw new Error('x');\n  } catch (e) {\n    console.log('catch', e.message);\n    return 1;\n  } finally {\n    console.log('finally');\n  }\n}\nconsole.log('ret', f());\n",
    "finally runs even on return from catch",
    "return in finally overrides a return in try — the try value is discarded.",
    [
      "TryCatch finally uses completion records (return/throw/normal).",
      "finally replacing a return is specified via UpdateEmpty / completion overwrite.",
      "throw uses GetValue of the expression then abrupt throw completion.",
    ],
  ),

  "b1-custom-errors": e(
    "class MyError extends Error { constructor(msg, options) { super(msg, options); this.name = 'MyError'; } }. Set name, keep message, pass { cause }. instanceof MyError works in the same realm. Some engines need Error.captureStackTrace. Do not extend Error in a way that loses stack (old Babel).",
    "Callers catch(ValidationError) vs catch(NetworkError) to recover differently. A string throw cannot do that well.",
    "A named subclass of Error so catch can discriminate without parsing messages.",
    [
      "extends Error, super(message, { cause }).",
      "this.name = this.constructor.name.",
      "instanceof for control flow; still log stack.",
      "Do not over-hierarchy; a few types beat twenty.",
    ],
    "class ValidationError extends Error {\n  constructor(msg, field) {\n    super(msg);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\ntry { throw new ValidationError('required', 'email'); }\ncatch (e) {\n  if (e instanceof ValidationError) console.log(e.field, e.message);\n}\n",
    "Custom Error subclass with extra field",
    "Object.setPrototypeOf missing in old transpilers: instanceof MyError is false after extend.",
    [
      "NewError / Error constructor sets the stack using the construct call.",
      "cause is a standard data property from the options bag.",
      "Cross-realm instanceof fails because the class function differs.",
    ],
  ),

  "b1-unhandled-rejection": e(
    "A rejected promise with no catch/await handler is an unhandled rejection. Browsers fire unhandledrejection; Node historically crashed (or warned) depending on version/flags. A late .catch() can fire rejectionhandled. Always attach handlers; void p is not handling. async IIFE without catch is a common source.",
    "Lost async errors used to vanish. Hosts now surface them like uncaught exceptions.",
    "A rejection with nobody’s catch waiting. The host raises a red flag. Catching later may be ‘too late’ for crash policies.",
    [
      "void somePromise is not a handler — use .catch(log).",
      "Top-level await in modules: wrap in try.",
      "Listen to unhandledrejection for logging, still fix the source.",
      "Do not empty-catch to silence production.",
    ],
    "window?.addEventListener?.('unhandledrejection', (e) => {\n  console.log('unhandled', e.reason);\n});\nPromise.reject(new Error('oops')).then(() => {});\n// missing catch — may log as unhandled\nPromise.reject(new Error('handled')).catch((e) => console.log('ok', e.message));\n",
    "Unhandled vs immediately caught rejection",
    "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch.",
    [
      "HostPromiseRejectionTracker(operation).",
      "HTML Unhandled Promise Rejection Steps.",
      "Node --unhandled-rejections=strict.",
    ],
  ),

  "b1-devtools": e(
    "Browser DevTools: Elements, Console, Sources, Network, Performance, Memory. Console evaluates in page or snippet context. $0 is the selected element. Preserve log, disable cache, and device mode are daily tools. This is a host debugger around the engine, not a language feature.",
    "Dynamic pages fail at runtime. Seeing the live DOM, network, and JS state is how you debug.",
    "A cockpit: console is the radio, Sources is the pause button, Network is the mail log, Performance is the stopwatch.",
    [
      "Reproduce with DevTools open; watch the failing request.",
      "Use console.table / dir for objects.",
      "Pretty-print minified, then source maps.",
      "Do not debug production only with alert().",
    ],
    "console.log({ a: 1 });\nconsole.dir(document?.body);\nconsole.assert(1 === 1, 'ok');\nconsole.count('hit');\nconsole.count('hit');\n",
    "Console helpers used while DevTools is open",
    "Logging a live object then expanding it later — you see the mutated state, not the past.",
    [
      "console is a host object; commands like inspect() are host REPL extras.",
      "The debugger protocol (CDP) talks to V8.",
      "Source maps are JSON mapping generated↔original.",
    ],
  ),

  "b1-breakpoints": e(
    "A breakpoint pauses the engine at a statement. Step over/into/out walk calls. Conditional breakpoints pause when an expression is true. Logpoints log without pausing. debugger; is an inline breakpoint. DOM/XHR/event breakpoints pause on host events. Paused JS blocks that tab’s loop.",
    "Logs are slow to iterate. Pausing lets you inspect all locals at the failure line.",
    "A freeze-frame. Step over = next line in this function; into = enter the call; out = finish this function.",
    [
      "Click the line gutter in Sources.",
      "Conditional: i === 10.",
      "Never leave debugger; in production bundles.",
      "Blackbox node_modules to skip library steps.",
    ],
    "function sum(a, b) {\n  debugger;\n  return a + b;\n}\nconsole.log(sum(2, 3));\nfor (let i = 0; i < 3; i++) {\n  if (i === 2) debugger;\n}\n",
    "debugger statement as a breakpoint",
    "A forgotten debugger; in a loop makes the page unusable when DevTools is open.",
    [
      "debugger statement is specified; hosts may no-op if no debugger attached.",
      "Breakpoints are engine debug API, not JS-visible (except debugger).",
      "Stepping still respects run-to-completion of the current micro-operation.",
    ],
  ),

  "b1-watch-scope": e(
    "While paused, Scope shows locals, closure, this, and globals. Watch evaluates expressions in that frame. Call stack switches frames to see other locals. Closure section proves which environment you captured. Edit-and-continue is limited; do not rely on it.",
    "The whole point of a breakpoint is inspecting environments — the same environments the spec talks about.",
    "A live view of the current execution context and its [[Environment]] chain.",
    [
      "Select an outer frame to see its locals.",
      "Watch this.n or a closed-over count.",
      "If a variable is ‘unavailable’, you are in a TDZ or optimized-out.",
      "Pretty-print to make scopes match source.",
    ],
    "function outer(x) {\n  const hidden = x * 2;\n  return function inner(y) {\n    debugger;\n    return hidden + y;\n  };\n}\nconsole.log(outer(3)(4));\n",
    "Pause in inner to inspect closure hidden",
    "Optimized-out variables: the JIT did not keep a name; debug builds / disable optimizations to see them.",
    [
      "Debugger maps V8 scope info to environment records.",
      "Optimized frames may omit unused bindings.",
      "this in the scope pane is the same ThisValue as the spec.",
    ],
  ),

  "b1-async-debugging": e(
    "Async debugging: DevTools can stitch async stacks (await, then, timeout). Pause on uncaught exceptions and on Promise rejections. Network tab shows fetch. ‘async’ call stacks are a debugger feature — the engine stack was empty between jobs. console.time around awaits measures wall clock, not CPU.",
    "The hard bugs are ‘wrong order of jobs,’ not a single sync stack. Tooling had to show the logical chain.",
    "A photo album of stacks glued by the debugger, even though each job started from an empty JS stack.",
    [
      "Enable async stack traces.",
      "Pause on rejected promises.",
      "Name your functions so async stacks are readable.",
      "Trace seq numbers for stale responses.",
    ],
    "async function load() {\n  await Promise.resolve();\n  throw new Error('after await');\n}\nload().catch((e) => console.log(e.stack));\n",
    "Stack after await — host may show async frames",
    "Reading only the top frame after await — you miss which caller scheduled the async function.",
    [
      "V8 async stack captures the initiating stack when the promise is created/awaited.",
      "Unhandled rejection breakpoint is a host debugger hook.",
      "Microtask vs task is visible as separate traces without stitching.",
    ],
  ),

  "b1-source-maps": e(
    "A source map is JSON mapping generated code (minified/transpiled) back to original files/lines/names. DevTools consumes it to debug TS/JSX as if it ran. //# sourceMappingURL= is the trailer. Production maps can leak source — treat as sensitive. They do not change runtime behavior.",
    "Nobody wants to debug one-line bundles. Maps restore the authoring view without shipping pretty code to users (if you withhold maps).",
    "A translation dictionary: bundle line 1 col 3048 ↔ src/app.ts:42.",
    [
      "Enable maps in the bundler for development.",
      "Decide whether to publish maps in production.",
      "hidden-source-map uploads to error trackers only.",
      "If a line is ‘wrong,’ the map may be stale — rebuild.",
    ],
    "// app.js (generated)\nconsole.log('hi');\n//# sourceMappingURL=app.js.map\nconsole.log('runtime does not read the map; DevTools does');\nconst fakeMap = { version: 3, sources: ['app.ts'], mappings: '' };\nconsole.log(fakeMap.version);\n",
    "sourceMappingURL comment is for tools, not the engine",
    "Users with maps in prod can read your original comments and unused code — a source leak.",
    [
      "VLQ-encoded mappings in the spec (source-map format).",
      "Engines ignore the comment unless a debugger asks the host to fetch the map.",
      "Error.stack rewriting is debugger/host, not required of the engine.",
    ],
  ),

  "b1-profiling-basics": e(
    "Performance profiler: CPU flame charts of JS + rendering. Memory: heap snapshots, allocation timelines, leak detection (growing detached nodes). Performance marks/measures (User Timing API) instrument your code. Profile production-like builds; React Dev Mode lies. Long tasks (>50ms) are a Core Web Vital concern.",
    "‘It feels slow’ needs evidence: CPU, layout, network, or leaks. Guessing wastes weeks.",
    "A stopwatch (performance) and a warehouse inventory (memory). Flame charts are stacks over time.",
    [
      "Record while reproducing the jank.",
      "Look for yellow (JS) vs purple (layout) in some UIs.",
      "Take two heap snapshots and compare.",
      "performance.mark / measure around suspects.",
    ],
    "performance.mark('start');\nlet s = 0;\nfor (let i = 0; i < 1e6; i++) s += i;\nperformance.mark('end');\nperformance.measure('sum', 'start', 'end');\nconsole.log(s, performance.getEntriesByName('sum')[0]?.duration);\n",
    "User Timing marks around a CPU loop",
    "Profiling with DevTools open and React Strict Mode double-rendering — numbers are not production.",
    [
      "User Timing is a Web API on performance.",
      "Sampling profilers interrupt the engine; they miss very short functions sometimes.",
      "Heap snapshots walk GC roots and retainers.",
    ],
  ),

  "b1-modules": e(
    "ES modules are files with import/export, their own scope, strict mode, deferred loading in browsers, and a module map (one instance per URL). Dependencies form a graph evaluated in topological order with live bindings. They replaced globals and IIFE bundles as the unit of reuse.",
    "Large apps needed real files, explicit deps, and no window pollution. Bundlers still consume this graph.",
    "Each file is a locked workshop. export puts tools on a labeled shelf; import reaches to that shelf and sees updates (live).",
    [
      "One module, one public API via export.",
      "import type-only is TypeScript, not runtime.",
      "Cycle: do not use imported bindings at top level before the other module finished.",
      "extension and MIME matter in browsers.",
    ],
    "// math.js\nexport const add = (a, b) => a + b;\nexport default function mul(a, b) { return a * b; }\n// main.js\nimport mul, { add } from './math.js';\nconsole.log(add(1, 2), mul(3, 4));\n",
    "Named export plus default in ESM",
    "import { add } from './math' without .js in browsers often 404 — Node/bundlers may resolve; browsers may not.",
    [
      "ModuleStatus: new, unlinked, linked, evaluated.",
      "Cyclic modules can be in linking before evaluation finishes.",
      "import.meta is a module-specific object (url, resolve).",
    ],
  ),

  "b1-export-import": e(
    "export function f{} / export const x / export { x as y } / export default. import { x } / import { x as y } / import * as ns / import def from. Side-effect import: import './polyfill.js'. Static import is hoisted and analyzed at load; paths are string literals, not computed (except import()).",
    "Static graph analysis enables tree shaking and early errors (missing export). Dynamic paths wait for import().",
    "Static import is a compile-time wiring diagram. You cannot compute the path in a static import statement.",
    [
      "Named exports for libraries (refactor-friendly).",
      "Default for ‘the’ function of a small module if the team likes it.",
      "Re-export: export { x } from './m.js'.",
      "Do not mix CJS require in ESM without interop.",
    ],
    "export const PI = 3.14;\nexport function area(r) { return PI * r * r; }\nexport { area as circleArea };\nimport { area, PI } from './shapes.js';\nimport * as shapes from './shapes.js';\nconsole.log(area(1), shapes.PI);\n",
    "Named exports, alias, namespace import",
    "import { default as foo } vs import foo — both work; export default { a } is one object, not named a.",
    [
      "ImportEntry / ExportEntry records in the module.",
      "Star exports copy export names at link time.",
      "Static import() is a different production (Call-like) vs ImportDeclaration.",
    ],
  ),

  "b1-default-named-exports": e(
    "A module may have many named exports and at most one default. Default is the ‘main’ value; import foo from gets it. Named need braces. export default function name() still creates a local name. Mixing: import foo, { bar }. Interop with CJS default is the .default pitfall in bundlers.",
    "CommonJS modules.exports = fn was one value. Default export maps to that mental model; named exports map to a bag of tools.",
    "Named = labeled drawers. Default = the package on the counter. You can use both in one file.",
    [
      "Libraries: prefer named for better tree shaking and rename.",
      "Apps: either is fine if consistent.",
      "Do not default-export and also forget people will import it wrong.",
      "TypeScript esModuleInterop exists because of this mismatch.",
    ],
    "export default function greet(n) { return 'hi ' + n; }\nexport const VERSION = 1;\nimport greet, { VERSION } from './g.js';\nimport * as g from './g.js';\nconsole.log(greet('Ada'), VERSION, g.default('Ada'));\n",
    "default + named; namespace .default",
    "import { greet } when it was export default greet — undefined / syntax error depending on interop.",
    [
      "default is a name in the export table, not a keyword binding unless you export default function name.",
      "CJS interop synthesizes a default in ESM importers of CJS.",
      "Tree shaking of default is all-or-nothing if the bundler cannot see properties.",
    ],
  ),

  "b1-dynamic-import": e(
    "import(specifier) returns a Promise of the module namespace. The specifier can be computed. Use for code splitting, optional plugins, and conditional polyfills. It is not a require() — it is async, ESM, and cached in the module map after first load. Errors become rejections.",
    "Static import cannot branch on runtime feature tests or load a heavy editor only on that route.",
    "A late import: fetch/parse/eval that subgraph, then hand me the namespace object.",
    [
      "const m = await import('./heavy.js').",
      "Catch load errors.",
      "Same URL = same instance later.",
      "import() in CJS Node is allowed as a bridge to ESM.",
    ],
    "const name = './math.js';\nconst ns = await import(name);\nconsole.log(ns.add?.(1, 2) ?? 'no add');\ntry { await import('./missing.js'); } catch (e) { console.log(e.name); }\n",
    "Computed specifier; failed import rejects",
    "import(userInput) is a code-load injection risk — allowlist specifiers.",
    [
      "HostImportModuleDynamically.",
      "Returns a promise of a module namespace exotic object.",
      "Already-evaluated modules resolve immediately (still async thenable).",
    ],
  ),

  "b1-esm-vs-cjs": e(
    "ESM: import/export, live bindings, async/static analysis, this undefined, file extensions often required. CJS: require, module.exports, copy of exports at require time (values copied for primitives), sync, __dirname. Node treats .mjs/.cjs and package.json type. They interop with sharp edges (default, dual packages).",
    "Node shipped CJS years before ESM. Both exist; the ecosystem is still bridging.",
    "ESM is a live window into another file. CJS is a snapshot of module.exports when require ran (plus caching of the object).",
    [
      "New Node libraries: ESM.",
      "Know require of ESM is not allowed; import() CJS is.",
      "__dirname in ESM: fileURLToPath(import.meta.url).",
      "Do not dual-publish incorrectly (dual package hazard).",
    ],
    "// CJS\n// const { add } = require('./math');\n// module.exports = { add };\n// ESM\nimport { createRequire } from 'node:module';\nconst require = createRequire(import.meta.url);\nconsole.log(typeof require, import.meta.url);\n",
    "createRequire bridge from ESM to CJS",
    "typeof module !== 'undefined' detection is fragile in bundled dual modules.",
    [
      "CJS module cache is a map of filename → exports object.",
      "ESM module map is URL → Module Record.",
      "Live bindings vs cjs copy: export let n; n++ is seen by importers; cjs.exports.n++ requires the same object export.",
    ],
  ),

  "b1-live-bindings": e(
    "ESM imports are live: if the exporting module updates an exported let, importers see the new value. You cannot assign to an imported binding (it is const-like). CJS importers of a primitive get a copy. This matters for circular deps and for mutable exported state (generally discouraged).",
    "Cycles need to see the binding after it initializes. Live bindings make that possible without a second lookup API.",
    "You were given a window onto their variable, not a photocopied number. The window is read-only from your side.",
    [
      "Do not mutate exported lets as an API — export functions.",
      "Imported names cannot be assigned.",
      "namespace.n can reflect live values for lets.",
      "CJS: mutating the exported object’s fields is shared (same object).",
    ],
    "let n = 1;\nexport { n };\nexport function bump() { n += 1; }\n// importer:\nimport { n, bump } from './c.js';\nbump();\nconsole.log(n);\ntry { n = 3; } catch (e) { console.log(e.name); }\n",
    "Imported let is live and not assignable",
    "const { n } = await import(m) copies the current primitive — that destructure is not live.",
    [
      "Module Environment Record GetBindingValue reads the target module’s slot.",
      "Imported Binding is immutable from the importer.",
      "Namespace objects have accessors that read live.",
    ],
  ),

  "b1-circular-deps": e(
    "Circular imports: A imports B imports A. ESM links first, then evaluates one module; the other may see uninitialized live bindings (TDZ) if it uses them at top level. CJS: one module.exports may still be incomplete when the other require runs. Fix: delay using the import until a function call, or break the cycle.",
    "Real graphs have cycles (types, registries). The module system still has to start evaluating somewhere.",
    "Two rooms with windows into each other. If you reach through at construction time, the other room may still be empty.",
    [
      "Move usage into functions called later.",
      "Extract a third module both import.",
      "Avoid top-level side effects that need the cycle.",
      "In CJS, assign exports before requiring the peer.",
    ],
    "export function fromA() { return 'A' + fromB(); }\nimport { fromB } from './b.js';\n// b.js: import { fromA } from './a.js'; export function fromB(){ return 'B'; }\nfunction fromB() { return 'B'; }\nconsole.log('A' + fromB());\n",
    "Safe pattern: functions run after both modules evaluated",
    "export const x = helperFromPeer() at top level in a cycle → TDZ or undefined CJS export.",
    [
      "ESM: inner module evaluation can run while outer is still evaluating.",
      "TDZ on imported let until Initialize finishes in the exporter.",
      "CJS partial exports object is already cached.",
    ],
  ),

  "b1-top-level-await": e(
    "Modules may await at top level. That delays this module’s evaluation (and importers’) until the awaited promise settles. Sibling modules without the wait can finish first. It is a graph-blocking feature. Classic scripts cannot TLA. Errors reject the module (load failure).",
    "Config and WASM init needed to finish before the rest of the module ran, without a wrapping async function.",
    "The file itself can pause. Anyone who imports you waits at the door until your await is done.",
    [
      "Use for loaders, not for every fetch in a library (it blocks importers).",
      "Keep TLA small and failure-loud.",
      "Know that it can cause deadlocks with cycles if two modules TLA on each other.",
      "Bundlers need async chunk loading support.",
    ],
    "const cfg = await Promise.resolve({ url: '/api' });\nexport function api() { return cfg.url; }\nconsole.log(api());\n",
    "Top-level await initializing exported config",
    "A library with TLA makes every importer async-load — surprising in sync-looking apps.",
    [
      "Module evaluation returns a promise when TLA is used.",
      "Importing modules await that promise during their evaluation.",
      "Cycles + TLA can deadlock the evaluation algorithm if not careful.",
    ],
  ),

  "b1-tree-shaking": e(
    "Tree shaking is bundler dead-code elimination of unused exports, enabled by ESM’s static structure. Side-effectful modules (polyfills, CSS-in-JS) must be marked so they are not dropped. Default exports and ‘touch everything’ namespaces shake worse. It is not a runtime JS feature.",
    "Shipping unused library code costs bytes and parse time. Static import/export made automated dropping possible.",
    "A tree of files. If nobody imported shake(), the bundler saws that branch off — unless the file pokes the world at load.",
    [
      "Named exports, pure functions, sideEffects: false in package.json (honestly).",
      "Avoid top-level DOM writes in barrel files.",
      "import * as all may keep more than you think.",
      "Measure the bundle; do not trust names.",
    ],
    "export function used() { return 1; }\nexport function unused() { return 2; }\nconsole.log(used());\n// bundler may drop unused() if this is the only entry and used is imported\n",
    "Named unused export is shakeable if side-effect free",
    "Barrel index.js re-exporting everything with side effects keeps the whole library.",
    [
      "Bundlers parse import/export to a graph + purity analysis.",
      "eval, computed property access of namespace, and module.sideEffects complicate it.",
      "Runtime ESM in browsers does not delete unused exports from the file on disk.",
    ],
  ),

  "b1-module-pattern": e(
    "The historical module pattern is an IIFE that returns a public API while hiding vars: const api = (function(){ let x; return { get(){return x} } })(). Revealing module exposes methods that close over privates. It was how we namespaced before ESM. Still useful in classic scripts and snippets.",
    "var leaked to window. IIFE + closure was privacy and a single global hook.",
    "A one-room factory that hands you a remote control, not the machinery.",
    [
      "Use ESM in new apps.",
      "Recognize the pattern in old jQuery plugins.",
      "Do not recreate it instead of modules without a reason.",
      "AMD/UMD wrappers are cousins for loaders.",
    ],
    "const counter = (function () {\n  let n = 0;\n  function inc() { n += 1; return n; }\n  function get() { return n; }\n  return { inc, get };\n})();\nconsole.log(counter.inc(), counter.get());\n",
    "Revealing module IIFE",
    "Returning this from an IIFE called as a function in sloppy mode can leak to window.",
    [
      "One function environment + returned closures.",
      "No module map — each IIFE is a fresh instance if the file runs twice.",
      "UMD detects define/module/window to pick a loading style.",
    ],
  ),

  "b1-json": e(
    "JSON is a text format: objects, arrays, strings, numbers, true/false/null. It is not JavaScript: no functions, comments, undefined, dates, or trailing commas (strict). Keys are strings. JS object literals are a superset. JSON.parse of untrusted text can still be huge (DoS) but does not eval code.",
    "The web needed a language-independent interchange lighter than XML. Crockford subset JS and named it JSON.",
    "A faxable subset of object notation. If it cannot live in JSON, stringify will drop, null, or throw.",
    [
      "JSON.parse / stringify at boundaries.",
      "Do not eval JSON.",
      "Validate schema of untrusted JSON.",
      "Remember parse numbers are IEEE doubles.",
    ],
    "const text = '{\"a\":1,\"b\":null}';\nconst obj = JSON.parse(text);\nconsole.log(obj, JSON.stringify(obj));\ntry { JSON.parse('{a:1}'); } catch (e) { console.log(e.name); }\nconsole.log(JSON.stringify({ u: undefined, f() {}, n: NaN }));\n",
    "Valid JSON vs JS-literal and stringify drops",
    "JSON.parse('9007199254740993') rounds the id — keep big ids as strings in JSON.",
    [
      "JSON grammar is in ECMA-404 / the spec’s JSON.parse.",
      "eval is not used; a dedicated parser.",
      "reviver walks the tree after parse.",
    ],
  ),

  "b1-json-stringify-parse": e(
    "stringify(value, replacer, space) produces text; parse(text, reviver) produces values. stringify skips undefined in objects, turns array holes/undefined into null, throws on cycles, and calls toJSON. parse throws SyntaxError on junk. space pretty-prints. replacer can be an array of allowed keys.",
    "The pair is the standard serialization API in the language (JSON object).",
    "stringify walks → text. parse text → walk with reviver. They are not perfect inverses.",
    [
      "Pretty: JSON.stringify(obj, null, 2).",
      "Do not stringify BigInt without a replacer.",
      "parse only JSON text, not JS.",
      "Use reviver to revive dates from ISO strings if you choose that protocol.",
    ],
    "const obj = { a: 1, b: [2, undefined], d: new Date('2020-01-01T00:00:00Z') };\nconsole.log(JSON.stringify(obj));\nconst t = JSON.stringify({ x: 1, y: 2 }, ['x'], 2);\nconsole.log(t);\nconst n = JSON.parse('{\"d\":\"2020-01-01\"}', (k, v) => (k === 'd' ? new Date(v) : v));\nconsole.log(n.d instanceof Date);\n",
    "stringify skips, toJSON Date, replacer keys, reviver Date",
    "parse then stringify is not identity — key order, undefined, and numbers may change.",
    [
      "SerializeJSONObject / SerializeJSONArray.",
      "toJSON is invoked with the key.",
      "reviver is a post-order walk (children first).",
    ],
  ),

  "b1-json-unsupported": e(
    "Unsupported: functions, symbols, undefined (dropped in objects), BigInt (throws), cycles (throws), DOM nodes (become {}), Maps/Sets ({}), sparse holes→null in arrays, NaN/Infinity→null. Dates become strings via toJSON. These are the clone-via-JSON bugs.",
    "JSON’s type set is tiny on purpose for interoperability. JS values are bigger.",
    "A tiny suitcase. What does not fit is left on the dock (dropped), turned into a postcard (Date), or gets the suitcase locked (throw).",
    [
      "structuredClone for JS-rich graphs.",
      "Custom toJSON / replacer for BigInt.",
      "Detect cycles if you roll your own.",
      "Do not JSON-clone class instances expecting methods.",
    ],
    "try { JSON.stringify({ n: 1n }); } catch (e) { console.log(e.name); }\ntry { const a = {}; a.a = a; JSON.stringify(a); } catch (e) { console.log(e.name); }\nconsole.log(JSON.stringify({ m: new Map([[1, 2]]) }));\nconsole.log(JSON.stringify([, 1]));\n",
    "BigInt throw, cycle throw, Map {}, hole null",
    "stringify(window) or a DOM node can throw or produce giant useless graphs — don’t.",
    [
      "TypeError on BigInt and cycles in stringify.",
      "Ordinary objects only enumerate enumerable string keys.",
      "Map’s data is in internal slots, not enumerable properties.",
    ],
  ),

  "b1-json-replacer-reviver": e(
    "replacer(key, value) is called for every property (and the root with key ''). Returning undefined omits the key. An array replacer whitelists keys. reviver(key, value) post-walks parse; returning undefined deletes the key. toJSON(key) on an object is called before replacer. Together they form a tiny protocol.",
    "Dates, BigInt, and redaction needed hooks without changing the JSON grammar.",
    "stringify: object.toJSON then replacer as a filter. parse: reviver as a reconstructer, children first.",
    [
      "Redact: if (key==='password') return undefined.",
      "Revive: if iso-date string, return new Date.",
      "Remember root call key ''.",
      "Array replacer cannot whitelist nested paths well.",
    ],
    "const obj = { a: 1, password: 'x', nest: { password: 'y', b: 2 } };\nconst t = JSON.stringify(obj, (k, v) => (k === 'password' ? undefined : v));\nconsole.log(t);\nconst parsed = JSON.parse(t, (k, v) => (k === 'a' ? v * 10 : v));\nconsole.log(parsed);\n",
    "replacer redacts password; reviver scales a",
    "reviver on arrays sees indexes as string keys; easy to skip 0 as falsy if you write if (key).",
    [
      "InternalizeJSONProperty applies reviver after children.",
      "replacer array uses a PropertyList of keys at each object (shallow names).",
      "toJSON is Get(value, 'toJSON') and Call if present.",
    ],
  ),

  "b1-date-basics": e(
    "Date is a mutable object wrapping a time value (ms since Unix epoch, UTC) plus local calendar methods. new Date() is now. new Date(iso) parses; new Date(y, mIndex, d) is local time and month is 0-based. Invalid dates are NaN time. Date.now() is a number, not a Date.",
    "The web needed timestamps. Java’s Date was copied, including the 0-based month bug.",
    "A mutable box of ‘ms since 1970-01-01T00:00:00Z’ with getters in local or UTC flavors.",
    [
      "Prefer Date.now() or new Date().toISOString() at APIs.",
      "Month is 0-based in the numbers constructor.",
      "Do not parse arbitrary strings with new Date(str) — it is implementation-defined except ISO.",
      "Copy dates: new Date(d) or d.getTime().",
    ],
    "const d = new Date('2020-01-02T00:00:00Z');\nconsole.log(d.toISOString(), d.getUTCFullYear(), d.getUTCMonth());\nconst local = new Date(2020, 0, 2);\nconsole.log(local.getFullYear(), local.getMonth(), local.getDate());\nconsole.log(Number.isNaN(new Date('nope').getTime()));\n",
    "ISO UTC vs local numbers constructor; invalid Date",
    "new Date(2020, 1, 1) is February, not January.",
    [
      "[[DateValue]] is a time value or NaN.",
      "ES5 ISO8601 subset is specified; other strings are implementation-defined.",
      "Getters use local TZ offset unless UTC variants.",
    ],
  ),

  "b1-unix-timestamps": e(
    "Unix time in JS Date is milliseconds, not seconds. Date.now(), +d, d.getTime() are ms. APIs (JWT exp, some DBs) use seconds — multiply/divide by 1000. 32-bit second clocks overflow in 2038; JS ms in a double is fine far beyond that for second precision but not nanoseconds.",
    "C used seconds; JS Date used ms like Java. Mixing them is the off-by-1000 bug.",
    "JS: 13-ish digit now(). Unix often: 10-digit seconds. Convert at the boundary.",
    [
      "If a number is ~1e9, it is seconds; ~1e12 is ms (in this decade).",
      "new Date(seconds * 1000).",
      "Math.floor(Date.now()/1000) for second APIs.",
      "Do not store Date objects in JSON without a protocol.",
    ],
    "const ms = Date.now();\nconst s = Math.floor(ms / 1000);\nconsole.log(ms, s, new Date(s * 1000).toISOString());\nconsole.log(new Date(s).getFullYear()); // wrong: treated as ms\n",
    "Seconds vs ms constructor mix-up",
    "new Date(1710000000) is 1970 + 20 days, not 2024 — you forgot *1000.",
    [
      "TimeClip on the number of ms.",
      "IEEE double has millisecond precision for a wide date range.",
      "Temporal will expose Instant with nanoseconds as bigint.",
    ],
  ),

  "b1-local-vs-utc": e(
    "Local methods (getHours, toString) use the host timezone. UTC methods (getUTCHours, toISOString) use UTC. ISO strings with Z are UTC. Without a zone, date-only ISO (YYYY-MM-DD) is parsed as UTC in ES2015+, which can show the previous local day. Server apps often stick to UTC internally.",
    "Users live in zones; logs and APIs should not. Date tries to do both and confuses everyone.",
    "One instant, two wall clocks: local living-room clock vs UTC control tower.",
    [
      "Store UTC instants (ISO Z or ms).",
      "Format for display with Intl in the user’s locale/zone.",
      "Be careful with date-only strings.",
      "setHours vs setUTCHours.",
    ],
    "const d = new Date('2020-01-01T00:00:00Z');\nconsole.log(d.toISOString(), d.getUTCDate(), d.getDate());\nconst dateOnly = new Date('2020-01-01');\nconsole.log(dateOnly.toISOString());\n",
    "Same instant UTC vs local date; date-only parse",
    "YYYY-MM-DD parsing as UTC midnight showing Dec 31 evening in US timezones.",
    [
      "LocalTZA(t) host-defined offset, including DST.",
      "Date.parse of ISO date-only is UTC; date-time without Z is local.",
      "toISOString always UTC and throws on invalid.",
    ],
  ),

  "b1-date-pitfalls": e(
    "0-based months, mutating setters (setDate overflows into next month), DST holes/overlaps making local add-an-hour skip, string parse inconsistency, mixing timestamps units, invalid Date that still is a Date object, and sort of dates as strings. Adding days: use UTC date math or libraries; setHours(24) is a hack.",
    "Civil time is political (DST). JS Date is a thin instant + local calendar, not a calendar library.",
    "A stopwatch (instant) wearing a broken calendar hat (local fields). The hat lies around DST.",
    [
      "Add days via UTC: d.setUTCDate(d.getUTCDate() + n).",
      "Do not parse '01/02/2020' without a known locale.",
      "Immutable: copy before set*.",
      "Prefer Temporal or a well-tested library for business calendars.",
    ],
    "const d = new Date(Date.UTC(2020, 0, 31));\nd.setUTCMonth(1);\nconsole.log(d.toISOString());\nconst a = new Date('2020-03-08T00:00:00');\na.setHours(a.getHours() + 24);\nconsole.log(a.toString());\n",
    "setUTCMonth overflow; local +24h across DST (host-dependent)",
    "setMonth(1) on Jan 31 becomes March 2/3 in some cases because February has no 31 — overflow.",
    [
      "MakeDate / MakeDay overflow is specified (not clamped).",
      "Local time conversion uses host TZ database.",
      "Date objects are mutable — sharing them is aliasing.",
    ],
  ),

  "b1-intl-datetime": e(
    "Intl.DateTimeFormat(locale, options) formats a Date (or ms) into a locale string: timeZone, dateStyle, hourCycle, weekday. It does not replace Date math. formatToParts gives tokens. Default locale is host-defined. Use it for display, not for round-trip serialization (prefer ISO).",
    "toLocaleString was under-specified. Intl is the standard i18n API for dates, numbers, lists.",
    "A printer: you give an instant + locale/options, it types a human string. It is not a parser.",
    [
      "new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'medium' }).format(d).",
      "Reuse the formatter; constructing it is relatively heavy.",
      "Do not parse the formatted string back.",
      "hour12 vs hourCycle for 12/24h.",
    ],
    "const d = new Date('2020-01-02T15:04:05Z');\nconst fmt = new Intl.DateTimeFormat('en-US', {\n  timeZone: 'UTC',\n  dateStyle: 'short',\n  timeStyle: 'short',\n});\nconsole.log(fmt.format(d));\nconsole.log(fmt.formatToParts(d).map((p) => p.type).join(','));\n",
    "DateTimeFormat UTC short datetime + parts",
    "Relying on exact format() string in tests — it can change with ICU data updates.",
    [
      "ECMA-402 specifies Intl.",
      "Implementations use ICU/CLDR data.",
      "formatToParts is the stable-ish structure vs a single string.",
    ],
  ),

  "b1-temporal-api": e(
    "Temporal is a forthcoming (and partially shipping) API for PlainDate, PlainTime, Instant, ZonedDateTime, Duration — immutable, explicit time zones, no 0-based month. It is designed to replace most Date usage. Availability is still uneven; polyfills exist. Date remains for now.",
    "Date’s mutability, parse chaos, and DST math made every app depend on Moment then Luxon. Temporal is the language-level fix.",
    "Separate types: a calendar date is not an instant. Instant is a timeline point. ZonedDateTime is instant + zone + calendar.",
    [
      "Watch for Temporal.Now.instant() in supporting engines.",
      "Do not mix Date and Temporal without conversion (Instant.from).",
      "Keep using Date + Intl until your baseline supports Temporal.",
      "Prefer immutability: plus() returns a new object.",
    ],
    "if (typeof Temporal !== 'undefined') {\n  const t = Temporal.Now.instant();\n  console.log(t.toString());\n} else {\n  console.log('Temporal not in this engine; Date.now()', Date.now());\n}\n",
    "Feature-detect Temporal vs Date.now fallback",
    "Assuming Temporal is everywhere in 2024–2026 browsers — always detect.",
    [
      "Temporal is a TC39 proposal at stage 3/4 depending on the year — check current.",
      "ISO calendar vs others are first-class.",
      "No more [[DateValue]] mutation; records are immutable slots.",
    ],
  ),

  "b1-regex-basics": e(
    "A RegExp is a pattern object: /ab+c/i or new RegExp('ab+c', 'i'). Literals compile at parse; the constructor compiles at runtime (and needs extra escaping of \\\\). They are stateful with /g and lastIndex. JSON does not have regex. Use for matching/extracting, not for HTML.",
    "Text processing on the web (validation, parse) needed patterns. JS copied Perl-ish regex into the language.",
    "A little machine that eats a string and reports matches. /g remembers where it left off on that regex object.",
    [
      "Prefer literals when the pattern is static.",
      "Escape user input before interpolating into new RegExp.",
      "Do not parse HTML with regex.",
      "Reset lastIndex or avoid sharing /g regex globally.",
    ],
    "const re = /\\d+/g;\nconsole.log('a12b3'.match(re));\nconst dyn = new RegExp('a+b', 'i');\nconsole.log(dyn.test('AAAB'));\nconsole.log(/a/.test('a'), /a/.source, /a/.flags);\n",
    "Literal vs constructor; match digits",
    "new RegExp('\\d') is /d/ — you needed '\\\\d'.",
    [
      "RegExp exotic objects with [[OriginalSource]] and [[OriginalFlags]].",
      "lastIndex is a writable property used by exec with /g or /y.",
      "Species and @@match hooks let String methods call custom matchers.",
    ],
  ),

  "b1-regex-classes-quantifiers": e(
    "Character classes [abc], [^a], \\d\\w\\s, . (not always newline unless /s). Quantifiers * + ? {n,m} are greedy; add ? for lazy. Anchors ^ $ \\b. Flags: g i m s u y d. u/v enable Unicode modes. . does not match \\n without s. ^/$ are line-based with m.",
    "A small pattern language packs a parser into a string. Flags change the machine’s dialect.",
    "Classes pick a character; quantifiers repeat; anchors pin position; flags flip switches on the engine.",
    [
      "Use \\\\b for word edges, not spaces only.",
      "/u for Unicode property \\p{L} (in supporting engines).",
      "Greedy vs lazy: .* vs .*? matters for HTML-like text.",
      "y (sticky) matches only at lastIndex.",
    ],
    "console.log(/a+/.exec('xaaay'));\nconsole.log(/a+?/.exec('xaaay'));\nconsole.log(/^\\d+$/.test('12'), /^\\d+$/.test('12\\n3'));\nconsole.log(/foo.bar/s.test('foo\\nbar'));\nconsole.log(/\\bjs\\b/i.test('JS rocks'));\n",
    "Greedy vs lazy, anchors, dotAll, word boundary",
    "/./ matches any character except line terminators unless the s flag is set.",
    [
      "RegExp matcher is specified with NFA-like semantics (backtracking).",
      "Unicode sets with /v are a newer grammar.",
      "m flag makes ^/$ match at LineTerminator boundaries.",
    ],
  ),

  "b1-regex-methods": e(
    "re.test(s) boolean (advances lastIndex if g/y). re.exec(s) returns a match array with groups or null (also advances). s.match(re) for /g returns all matches (no groups); without g like exec. s.matchAll(re) needs /g and yields exec-like results. s.replace / replaceAll. split. Prefer matchAll over looping exec.",
    "String and RegExp both grew methods; they overlap. lastIndex makes test/exec in a loop a footgun.",
    "test = yes/no. exec/matchAll = details + groups. replace = paint. Shared /g regex is a cursor that moves.",
    [
      "Do not use test() in a loop with /g on a shared regex without resetting lastIndex.",
      "matchAll for all group captures.",
      "replace callback gets groups.",
      "String methods ToString the receiver.",
    ],
    "const re = /(\\d+)/g;\nconsole.log(re.exec('a12 b34'));\nconsole.log(re.exec('a12 b34'));\nre.lastIndex = 0;\nconsole.log('a12 b34'.match(re));\nconsole.log([...('a12 b34'.matchAll(/(\\d+)/g))].map((m) => m[1]));\n",
    "exec lastIndex vs match vs matchAll groups",
    "A global regex in a helper: second call starts at lastIndex and ‘fails’ randomly.",
    [
      "RegExp.prototype.exec updates lastIndex per spec for global/sticky.",
      "test is specified as exec !== null (and thus also updates lastIndex).",
      "matchAll creates a new iterator that does not share lastIndex surprises as easily if you pass a literal each time.",
    ],
  ),

  "b1-regex-groups": e(
    "Capturing groups () are numbered in the match array and in replace as $1. Named groups (?<name> ) appear in match.groups. Non-capturing (?: ). Lookahead (?= ) (?! ) and lookbehind (?<= ) (?<! ) assert without consuming. Nested groups number by open-paren order. Groups can be undefined if that alternative did not match.",
    "Extraction needed pieces, not just a boolean. Lookaround is assertion without eating characters.",
    "Parentheses save a slice. Lookahead peeks forward; lookbehind peeks back. ?: means ‘group but don’t save.’",
    [
      "Named groups for readable extract.",
      "Optional groups can be undefined — guard.",
      "Lookbehind is not in the oldest browsers — know your baseline.",
      "Do not over-nest; numbered groups become unreadable.",
    ],
    "const m = /(?<y>\\d{4})-(?<mo>\\d{2})/.exec('2020-01-02');\nconsole.log(m.groups.y, m[1], m[2]);\nconsole.log(/js(?=\\!)/.exec('js!')?.[0]);\nconsole.log(/(?:ab)+/.exec('ababab')[0]);\nconsole.log(/(a)|(b)/.exec('b'));\n",
    "Named groups, lookahead, non-capturing, unused alt",
    "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays.",
    [
      "Capture indices and named table on the result array (exotic-ish array with extra properties).",
      "d flag adds indices for group offsets.",
      "Lookaround can still cause catastrophic backtracking in poorly written patterns.",
    ],
  ),

  "b1-functional-style": e(
    "Imperative style: for loops, mutating accumulators, step-by-step control. Declarative/functional style: map/filter/reduce, expressions that say what, not how. JS supports both. Declarative list pipelines are easier to test when pure; imperative is clearer for complex early-exit algorithms.",
    "JS grew array extras and closures, so a functional style became idiomatic in UI code without being a pure FP language.",
    "Imperative: a recipe of mutations. Declarative: a pipeline of transforms. Same engine, different readability bets.",
    [
      "Use map/filter for simple list transforms.",
      "Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops.",
      "Do not nest five maps to look clever.",
      "Keep functions small and named either way.",
    ],
    "const xs = [1, 2, 3, 4];\nlet imp = [];\nfor (const x of xs) if (x % 2 === 0) imp.push(x * 10);\nconst dec = xs.filter((x) => x % 2 === 0).map((x) => x * 10);\nconsole.log(imp, dec);\n",
    "Same transform: for-loop vs filter+map",
    "Using map for side effects (no return) — that is forEach, and reviewers will call it out.",
    [
      "map allocates a new array; a for-loop can prealloc — sometimes faster, often irrelevant.",
      "There is no purity checker in the language.",
      "Transducers and lazy iterators are library-level.",
    ],
  ),

  "b1-immutability-fp": e(
    "Immutability in JS is a convention: copy-on-write with spread, slice, concat, Map/Set copies, Object.freeze (shallow). The engine still uses mutable objects. Structural sharing is manual or via libraries (Immer). Const is not immutability. Frozen objects throw in strict on mutation.",
    "React state and undo stacks need old versions to stay valid. Mutation aliases are the bug.",
    "Never edit last frame’s film. Print a new frame with the change. freeze is a lock on one frame’s surface.",
    [
      "Replace arrays/objects instead of push on shared state.",
      "Nested updates copy each level: { ...s, user: { ...s.user, n } }.",
      "freeze in tests to catch accidental mutation.",
      "Immer if nested copies hurt.",
    ],
    "const state = { n: 1, tags: ['a'] };\nconst next = { ...state, n: 2, tags: [...state.tags, 'b'] };\nconsole.log(state, next, state.tags === next.tags);\nObject.freeze(state);\ntry { state.n = 3; } catch (e) { console.log(e.name); }\n",
    "Spread copy vs freeze on the old state",
    "...state still shares nested objects you forgot to copy.",
    [
      "Spread is shallow CopyDataProperties.",
      "freeze SetIntegrityLevel.",
      "Engines may COW internally; that is not a language guarantee you can observe as identity.",
    ],
  ),

  "b1-referential-transparency": e(
    "An expression is referentially transparent if you can replace it with its value without changing the program. Pure functions with immutable data aim at this. In JS, Date.now, this, I/O, and mutation break it. Transparency makes memoization and rerender skips valid.",
    "FP interviews and React ‘pure render’ talk this language. It is a property of expressions, not a JS keyword.",
    "2+2 can be replaced with 4. fetch(url) cannot be replaced with a constant without changing the world.",
    [
      "Push I/O to the edges.",
      "Pass time and randomness as arguments in core logic.",
      "Do not read module-level lets in ‘pure’ helpers.",
      "Memoize only transparent functions.",
    ],
    "const add = (a, b) => a + b;\nconsole.log(add(2, 2), add(2, 2));\nconst stamp = () => Date.now();\nconsole.log(stamp() === stamp());\nlet n = 0;\nconst tick = () => ++n;\nconsole.log(tick(), tick());\n",
    "add is transparent; Date.now and ++ are not",
    "Memoizing a function that reads Redux-like global state — cache hits are wrong.",
    [
      "The spec does not define referential transparency.",
      "Math.random and Date.now are host calls with effects.",
      "JIT may CSE pure arithmetic; it cannot CSE your fetch.",
    ],
  ),

  "b1-memory-management": e(
    "JS allocates objects on a GC heap. You do not free() them. Memory grows with live reachability from roots. Stack values (short-lived primitives in frames) die with the frame unless boxed/closed over. Understanding allocation sites (literals, closures, arrays) is how you control usage.",
    "A dynamic language cannot require manual malloc without crashing the web. GC is the contract; leaks are still your bug.",
    "You create balloons (objects). GC pops balloons nobody is holding a string to. Roots are hands: stack, globals, DOM, closures.",
    [
      "Drop references (null maps, remove listeners) when done.",
      "Avoid huge arrays you never shrink.",
      "Watch detached DOM.",
      "Do not cache unbounded user data in a module-level object.",
    ],
    "let cache = { buf: new Array(1e5).fill(0) };\nconsole.log(cache.buf.length);\ncache = null;\nconsole.log(cache);\n",
    "Dropping the last reference to a large array",
    "A forgotten Map of every user session in a SPA — unbounded growth that GC cannot save.",
    [
      "Allocation via OrdinaryObjectCreate etc. on the heap.",
      "GC is host/engine; spec only requires that unreachable objects may be collected.",
      "Finalization is best-effort.",
    ],
  ),

  "b1-reachability": e(
    "An object is live if a path of references exists from a root: execution contexts on the stack, the global object, host handles (DOM), and currently running functions’ environments. Closures extend reachability after the stack pops. WeakMap keys are not strong from the map side. Cycles are collectable if no root path exists.",
    "GC is reachability, not ‘I stopped using this variable’s name in source.’ Alias and listener lists keep things alive.",
    "A subway map of arrows. If you can ride from a root to the object, it lives. Cycles without a root are a closed loop in an abandoned station — collectable.",
    [
      "Draw who points at the suspected leak.",
      "Listeners, timers, and globals are sneaky roots.",
      "WeakMap for metadata.",
      "Cycles of two objects are fine if nothing else points at them.",
    ],
    "const a = { n: 1 };\nconst b = { n: 2 };\na.b = b; b.a = a;\nconsole.log(a.b.a.n);\nlet root = a;\nroot = null;\nconsole.log('cycle unrooted; GC may collect both');\n",
    "A cycle is collectable once unrooted",
    "Thinking cycles always leak — mark-and-sweep handles cycles; listener roots do not.",
    [
      "GC roots defined by the embedding (handles) + spec stack/global.",
      "Mark-and-sweep marks from roots; cycles without marks die.",
      "WeakRef / WeakMap are not strong retainers of keys.",
    ],
  ),

  "b1-garbage-collection": e(
    "Garbage collection reclaims objects with no incoming path from roots. Engines use generational GC: nursery for new objects, then old space. Collection pauses (or runs incrementally) are engine-defined. You cannot force a complete GC in portable JS. Allocation churn of short-lived objects is usually cheap; old-space leaks are not.",
    "Automatic memory is why JS is safe for untrusted pages. The pause-time tradeoff is an engine problem you influence by allocation patterns.",
    "A janitor who throws away anything not marked ‘still used’ from the front door (roots). New trash is swept more often than old furniture.",
    [
      "Prefer short-lived objects in tight loops if needed; measure.",
      "Do not create functions in hot loops without need (closures).",
      "Heap snapshots for leaks, not for ‘GC is broken.’",
      "In Node, --expose-gc is a debug hatch, not an API.",
    ],
    "function churn() {\n  let s = 0;\n  for (let i = 0; i < 10000; i++) s += { n: i }.n;\n  return s;\n}\nconsole.log(churn());\n",
    "Short-lived objects in a loop — nursery GC food",
    "Calling a ‘force GC’ in production to ‘fix leaks’ — you do not have a portable one, and it would not fix reachability.",
    [
      "V8 Scavenger (young) + Mark-Compact/concurrent marking (old).",
      "Orinoco incremental/concurrent techniques reduce pause.",
      "The spec is silent on algorithms.",
    ],
  ),

  "b1-mark-and-sweep": e(
    "Mark-and-sweep: mark every object reachable from roots, then sweep unmarked. Generational: most objects die young, so collect young space more often (copying/scavenge). Compaction reduces fragmentation. Incremental marking avoids long pauses. This is engine lore for interviews, not something you invoke.",
    "Reference counting cannot collect cycles easily. Mark-and-sweep plus generations is the industry default for JS.",
    "Paint every house you can walk to from city hall. Demolish unpainted houses. The new suburb is walked more often than downtown.",
    [
      "Interview: explain mark vs sweep vs generations.",
      "Do not claim JS uses only refcounting (it does not as the main GC).",
      "Leaks = extra roots, not ‘sweep forgot.’",
      "Finalizers run after sweep, asynchronously.",
    ],
    "function demo() {\n  const young = { n: 1 };\n  return young.n;\n}\nconsole.log(demo());\nconst old = { keep: true };\nconsole.log(old.keep);\n",
    "young dies with the frame; old lives while referenced",
    "Saying ‘JS has no GC pauses’ — it does; they are just short on modern engines.",
    [
      "Tri-color marking (white/grey/black) for incremental GC.",
      "Write barriers when mutator runs during marking.",
      "Copying young GC moves objects and updates pointers.",
    ],
  ),

  "b1-memory-leaks": e(
    "Common JS leaks: detached DOM still in a closure, forgotten setInterval, global caches, EventEmitter without off, Map keyed by objects you also keep, console logs holding objects in DevTools, detached listeners with old handlers. Not a leak: memory that grows then flats under GC of short-lived objects.",
    "SPAs run for days. A listener per navigation without teardown is a classic leak graph in heap snapshots.",
    "A balloon tied to a forgotten fence post (global, listener list, timer table). GC cannot cut that string.",
    [
      "Cleanup in the same place you subscribe (useEffect return).",
      "clearInterval / removeEventListener with the same function identity.",
      "Bound caches (LRU).",
      "Take heap snapshots: detached HTMLDivElement is a clue.",
    ],
    "const leaks = [];\nfunction mount() {\n  const huge = new Array(10000).fill(0);\n  const on = () => huge.length;\n  leaks.push(on);\n  return () => {\n    const i = leaks.indexOf(on);\n    if (i >= 0) leaks.splice(i, 1);\n  };\n}\nconst off = mount();\noff();\nconsole.log(leaks.length);\n",
    "Register and unregister a callback that closed over a big array",
    "removeEventListener('click', () => this.fn()) cannot remove — new arrow every time.",
    [
      "Host listener lists are strong roots.",
      "Timer tables hold the callback closure.",
      "DevTools retainers panel shows the path from GC root.",
    ],
  ),

  "b1-heap-snapshots": e(
    "A heap snapshot is a dump of objects, sizes, and retainers. Compare snapshots to see what grew. Look for Detached DOM, increasing (string) counts, and unexpected retainer paths (Window → listener → closure → node). Allocation instrumentation records who allocated. Snapshots are large; take them after GC.",
    "‘I think it leaks’ is not a diagnosis. Snapshots show the retaining path.",
    "A census of the warehouse plus ‘who is holding this box?’ arrows. Compare two censuses to see new boxes.",
    [
      "Reproduce, take snapshot, repeat action, snapshot again, compare.",
      "Filter Detached.",
      "Read retainer path from the leak suspect to Window.",
      "Ignore noise from DevTools itself when possible.",
    ],
    "function leaky() {\n  const el = { tag: 'div', listeners: [] };\n  el.listeners.push(() => el);\n  return el;\n}\nconst held = leaky();\nconsole.log(held.tag, held.listeners.length);\n",
    "A toy cycle DOM-like node ↔ listener (still rooted by held)",
    "Comparing snapshots with DevTools console holding the old object — you are the retainer.",
    [
      "Snapshots walk the heap via debugger protocol.",
      "Shallow vs retained size: retained is ‘if I drop this, how much dies.’",
      "Dominator trees summarize retainers.",
    ],
  ),

  "b1-debounce": e(
    "Debounce delays calling fn until wait ms have passed since the last invoke. Typical: search input. Leading vs trailing: fire at start and/or after quiet. You must cancel on unmount. Implement with setTimeout and a stored id; each call clears the previous timer.",
    "Users type faster than you should hit the network. Debounce waits for a pause.",
    "An elevator door: it resets the close timer every time someone blocks the sensor. It closes after the last interruption.",
    [
      "Trailing debounce for search boxes.",
      "Return a cancel function.",
      "Pass the latest args to the trailing call.",
      "Do not debounce already-debounced handlers accidentally twice.",
    ],
    "function debounce(fn, wait) {\n  let t;\n  const wrapped = (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), wait);\n  };\n  wrapped.cancel = () => clearTimeout(t);\n  return wrapped;\n}\nconst d = debounce((s) => console.log('search', s), 20);\nd('a'); d('ab'); d('abc');\n",
    "Trailing debounce: only the last 'abc' should log",
    "Debouncing a function but using the first event’s target in a closure — args must be from the last call.",
    [
      "Purely host timers; not a language primitive.",
      "Each wrapped call is O(1) plus one timeout.",
      "Leading+trailing needs extra flags for ‘already fired.’",
    ],
  ),

  "b1-throttle": e(
    "Throttle ensures fn runs at most once per wait ms while events keep firing. Typical: scroll, resize. Leading throttle fires immediately then ignores until the window; trailing also fires the last event at the end. Unlike debounce, throttle keeps a heartbeat during the storm.",
    "Scroll can fire 100+ times a second. You still want periodic work, not only after the user stops.",
    "A turnstile that unlocks once per interval. People keep arriving; only one gets through per tick (plus maybe the last one).",
    [
      "Throttle scroll handlers; debounce search.",
      "rAF-throttle for visual work.",
      "Store lastRan timestamp or a locked flag.",
      "Cancel on unmount.",
    ],
    "function throttle(fn, wait) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= wait) {\n      last = now;\n      fn(...args);\n    }\n  };\n}\nconst t = throttle((n) => console.log('tick', n), 50);\nfor (let i = 0; i < 5; i++) t(i);\n",
    "Leading throttle: first call in a burst runs",
    "Using debounce on scroll — the UI updates only after the user stops, feeling laggy.",
    [
      "Timestamp vs timeout implementations differ on trailing-edge.",
      "requestAnimationFrame is vsync throttle, not ms throttle.",
      "Both patterns are user-space.",
    ],
  ),

  "b1-debounce-vs-throttle": e(
    "Debounce: wait for quiet, then one call (good for input). Throttle: cap rate during activity (good for scroll). If you need the last value after a throttled stream, add a trailing call (hybrid). Mixing names in interviews is the fail. rAF is a special throttle aligned to frames.",
    "Both limit how often work runs, but the UX intent differs: ‘after they pause’ vs ‘while they drag, periodically.’",
    "Debounce = wait for the drumroll to stop. Throttle = sample the drumroll every N ms.",
    [
      "Search box → debounce.",
      "Scroll position → throttle or rAF.",
      "Resize → debounce or rAF depending on layout cost.",
      "Say trailing vs leading when you implement.",
    ],
    "const debounce = (fn, w) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), w); }; };\nconst throttle = (fn, w) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= w) { l = n; fn(...a); } }; };\nconsole.log(typeof debounce(() => {}, 1), typeof throttle(() => {}, 1));\n",
    "Tiny debounce vs throttle signatures",
    "Interview: ‘they’re the same.’ They are not — give one UI example each.",
    [
      "Debounce coalesces to the last (or first) call in a quiet window.",
      "Throttle coalesces to at most one in a sliding/fixed window.",
      "Neither is in ECMA-262.",
    ],
  ),

  "b1-long-tasks": e(
    "A long task is ~50ms+ of sync JS (or long layout) on the main thread, blocking input and paint. Fix: split work (yield, scheduler.postTask, setTimeout chunks), move CPU to Workers, reduce layout thrash. await does not help if you still do 200ms of CPU between awaits. INP/TBT metrics track this.",
    "Run-to-completion means a 200ms loop is a 200ms frozen tab. User-centric metrics made this a first-class bug.",
    "The bartender making a 200ms cocktail while the line (clicks, paint) waits. Yield = serve the line between stirs.",
    [
      "Profile; find the yellow JS block.",
      "Chunk arrays; yield to the loop.",
      "Workers for parse/crypto/image.",
      "Avoid sync layout in loops (read then write DOM).",
    ],
    "async function chunked(xs, fn) {\n  const out = [];\n  for (let i = 0; i < xs.length; i++) {\n    out.push(fn(xs[i]));\n    if (i % 1000 === 0) await new Promise((r) => setTimeout(r, 0));\n  }\n  return out;\n}\nconsole.log((await chunked([1, 2, 3], (x) => x + 1)).length);\n",
    "Yield every N items so tasks can run",
    "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help.",
    [
      "Long Tasks API / PerformanceObserver entryType longtask.",
      "50ms threshold is a heuristic used by the web perf community.",
      "scheduler.yield is designed to wait for a chance to continue after input.",
    ],
  ),

  "b1-proxy": e(
    "new Proxy(target, handler) intercepts operations: get, set, has, deleteProperty, apply, construct, ownKeys, etc. The target is the real object; the handler’s traps run first. Proxies enable Vue-style reactivity and virtual objects. They are not free (slower) and invariants with Invariants of [[GetOwnProperty]] can throw.",
    "JS needed a standard way to virtualize objects (membranes, logging, reactive get/set) without mutating Object.prototype.",
    "A receptionist in front of a filing cabinet. Every read/write asks the receptionist, who may forward, deny, or invent.",
    [
      "Trap get/set for validation or reactivity.",
      "Always forward to Reflect.* to keep invariants.",
      "Do not proxy everything in a hot path without measuring.",
      "typeof proxy is still 'object' (or 'function' if target is).",
    ],
    "const t = { n: 1 };\nconst p = new Proxy(t, {\n  get(obj, k, rec) { return Reflect.get(obj, k, rec); },\n  set(obj, k, v, rec) {\n    if (k === 'n' && typeof v !== 'number') throw new TypeError('n');\n    return Reflect.set(obj, k, v, rec);\n  },\n});\np.n = 2;\nconsole.log(p.n, t.n);\ntry { p.n = 'x'; } catch (e) { console.log(e.message); }\n",
    "Proxy set trap validating n",
    "Forgetting Reflect.set return value (must be boolean) → TypeError on strict assignment.",
    [
      "Proxy exotic object with [[ProxyTarget]] and [[ProxyHandler]].",
      "Revocable proxies: Proxy.revocable.",
      "Handler traps must obey invariants relative to the target’s descriptors.",
    ],
  ),

  "b1-reflect": e(
    "Reflect is a namespace of functions mirroring object internal methods: Reflect.get, set, has, deleteProperty, apply, construct, ownKeys, defineProperty. They return booleans instead of throwing for some ops (set/delete). Use with Proxy traps to default-forward correctly (receiver, this).",
    "The old Object.* APIs were incomplete and throwing. Reflect matches [[Get]]/[[Set]] and returns status flags for proxies.",
    "A toolbox labeled with the same names as the engine’s hidden [[methods]]. Proxy traps should call these.",
    [
      "In get trap: return Reflect.get(target, key, receiver).",
      "Reflect.apply(fn, thisArg, args).",
      "Reflect.ownKeys includes symbols.",
      "Prefer Reflect.set’s boolean over assignment expression when implementing traps.",
    ],
    "const o = { x: 1 };\nconsole.log(Reflect.get(o, 'x'), Reflect.has(o, 'x'));\nconsole.log(Reflect.set(o, 'y', 2), o.y);\nconsole.log(Reflect.ownKeys({ a: 1, [Symbol('s')]: 2 }));\nconsole.log(Reflect.apply(Math.max, null, [1, 5, 2]));\n",
    "Reflect get/set/ownKeys/apply",
    "Using target[key] in a get trap instead of Reflect.get(..., receiver) breaks inheritance/getters this.",
    [
      "Each Reflect.* is specified as the ordinary internal method.",
      "receiver is passed to getters/setters as this.",
      "Proxy invariants are stated in terms of these operations.",
    ],
  ),

  "b1-proxy-traps": e(
    "Common traps: get, set, has (in), deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, apply, construct. Missing traps forward to the target. getPrototypeOf/setPrototypeOf exist too. Invariants: you cannot report a non-configurable property as missing if it exists on a non-extensible target.",
    "Each object internal method needed a hook so a proxy can emulate exotic objects fully.",
    "A switchboard: one socket per kind of operation. Unplugged sockets go straight to the cabinet.",
    [
      "Implement the traps you need; let the rest default.",
      "ownKeys + getOwnPropertyDescriptor together for Object.keys to work.",
      "apply trap for function proxies.",
      "Read the invariant errors — they mean your lie was illegal.",
    ],
    "const p = new Proxy({ a: 1, b: 2 }, {\n  has(t, k) { return k === 'a'; },\n  ownKeys() { return ['a']; },\n  getOwnPropertyDescriptor(t, k) {\n    if (k === 'a') return { value: t.a, enumerable: true, configurable: true, writable: true };\n  },\n  get(t, k) { return k === 'a' ? t.a : undefined; },\n});\nconsole.log('a' in p, 'b' in p, Object.keys(p), p.b);\n",
    "has/ownKeys/get cooperating to hide b",
    "Hiding a non-configurable property via ownKeys throws — you cannot lie that way.",
    [
      "Each trap corresponds to an internal method on the Proxy object.",
      "Invariant checks run after the trap returns.",
      "Function proxies need apply/construct to be callable/newable.",
    ],
  ),

  "b1-reactivity-concept": e(
    "Reactivity: when a value changes, dependents update. JS implements this with getters that register the current effect, and setters that rerun those effects (Vue), or with Proxies that intercept get/set. It is a design pattern on top of the language, not a keyword. Validation is a simpler trap: set rejects bad values.",
    "UI state trees needed automatic dependency tracking instead of manual subscribe for every field.",
    "Reading a property while an effect is running subscribes. Writing notifies. Proxy is the sensor on the object.",
    [
      "Track a global currentEffect during get.",
      "Store Set of effects per key.",
      "On set, copy the set and rerun.",
      "Avoid infinite loops: do not set the same key inside its own effect without a guard.",
    ],
    "let active;\nfunction effect(fn) { active = fn; fn(); active = undefined; }\nfunction reactive(obj) {\n  const deps = new Map();\n  return new Proxy(obj, {\n    get(t, k) {\n      if (active) { if (!deps.has(k)) deps.set(k, new Set()); deps.get(k).add(active); }\n      return t[k];\n    },\n    set(t, k, v) { t[k] = v; deps.get(k)?.forEach((fn) => fn()); return true; },\n  });\n}\nconst s = reactive({ n: 1 });\neffect(() => console.log('n', s.n));\ns.n = 2;\n",
    "Tiny Proxy-based reactive n",
    "Triggering set during get tracking can recurse forever — batch or compare old/new.",
    [
      "This is user-space; engines do not ‘do Vue’ for you.",
      "Proxy get/set are the interception points.",
      "Solid/Vue/MobX differ in granularity (property vs store).",
    ],
  ),

  "b1-arraybuffer": e(
    "ArrayBuffer is a fixed-length raw binary store. TypedArrays (Uint8Array, Float64Array, …) are views with a type, offset, and length. DataView is an untyped view with endianness control. They share memory; mutating a view mutates the buffer. Not resizable unless using the newer resizable buffers. JSON cannot hold them (use base64).",
    "Audio, images, WASM, and protocols need bytes, not UTF-16 strings or number arrays.",
    "A slab of bytes (buffer) plus window frames (views) that interpret those bytes as ints/floats.",
    [
      "new Uint8Array(buffer) or new Uint8Array(n).",
      "DataView for mixed endian fields.",
      "Do not overlap views carelessly if you care about aliasing.",
      "structuredClone can clone buffers; postMessage can transfer them.",
    ],
    "const buf = new ArrayBuffer(8);\nconst u8 = new Uint8Array(buf);\nconst dv = new DataView(buf);\nu8[0] = 1;\nu8[1] = 2;\nconsole.log(dv.getUint16(0, true), u8);\nconst f64 = new Float64Array(1);\nf64[0] = 1.5;\nconsole.log(new Uint8Array(f64.buffer).length);\n",
    "Shared buffer: Uint8Array and DataView",
    "new Float64Array(buf) requires byteLength multiple of 8 — RangeError otherwise.",
    [
      "[[ArrayBufferData]] internal slot; views have [[ViewedArrayBuffer]], [[ByteOffset]].",
      "TypedArray integer indexed exotic objects.",
      "Transfer detaches the buffer ([[ArrayBufferData]] empty).",
    ],
  ),

  "b1-blob-file-js": e(
    "In language terms, Blob is an immutable blob of bytes with a type; File extends Blob with name and lastModified. FileReader (legacy) reads blobs async via events; today blob.arrayBuffer()/text()/stream() return promises. They are host objects in browsers and Node, not ECMA-262. This is the data-model view; UI input lives in B3.",
    "Uploads and downloads needed a JS value for ‘file contents + MIME’ without being a path string.",
    "A sealed bag of bytes with a label (type) and maybe a filename. Reading is async because bytes can be huge.",
    [
      "new Blob([str], { type: 'text/plain' }).",
      "await blob.text() / arrayBuffer().",
      "File comes from inputs; you rarely new File except in tests.",
      "Do not FileReader unless you maintain old code.",
    ],
    "const blob = new Blob(['hello'], { type: 'text/plain' });\nconsole.log(blob.size, blob.type);\nconst t = await blob.text();\nconsole.log(t);\nconst buf = await blob.arrayBuffer();\nconsole.log(new Uint8Array(buf));\n",
    "Blob from text, then text() and arrayBuffer()",
    "JSON.stringify(file) is {} — send FormData or the bytes, not stringify.",
    [
      "Blob is specified in the File API / HTML, not ECMA-262.",
      "slice of a blob is cheap (reference + offset) until read.",
      "Transferable in some structured clone paths.",
    ],
  ),

  "b1-impl-map-filter-reduce": e(
    "Implement map/filter/reduce/forEach on an array-like: loop indexes 0..length-1, skip holes if you match spec (HasProperty), call the callback with (value, index, array) and optional thisArg. map builds a new array of the same length; filter pushes passing values; reduce folds with an accumulator; forEach ignores returns. Do not call the built-ins you are implementing.",
    "Interviews test whether you understand holes, thisArg, and that map preserves length while filter does not. It is the spec algorithms in miniature.",
    "A for-loop with a callback. map writes to dest[i]; filter only dest.push; reduce threads acc; forEach is map without dest.",
    [
      "Read length once.",
      "if (!(i in arr)) continue for hole-skipping methods.",
      "callback.call(thisArg, arr[i], i, arr).",
      "reduce: if no init, find first present element as acc or throw.",
      "Return the new array or the acc; forEach returns undefined.",
    ],
    "function map(arr, fn, thisArg) {\n  const len = arr.length, out = new Array(len);\n  for (let i = 0; i < len; i++) {\n    if (i in arr) out[i] = fn.call(thisArg, arr[i], i, arr);\n  }\n  return out;\n}\nfunction reduce(arr, fn, init) {\n  let i = 0, acc, started = arguments.length >= 3;\n  if (started) acc = init;\n  for (; i < arr.length; i++) {\n    if (!(i in arr)) continue;\n    if (!started) { acc = arr[i]; started = true; continue; }\n    acc = fn(acc, arr[i], i, arr);\n  }\n  if (!started) throw new TypeError('empty');\n  return acc;\n}\nconsole.log(map([1, , 3], (x) => x * 2), reduce([1, 2, 3], (a, b) => a + b, 0));\n",
    "map keeps holes; reduce with initializer",
    "Using Array.prototype.map inside your map — the interviewer asked you to write the loop.",
    [
      "Spec uses HasProperty to skip holes in map/forEach/filter.",
      "ArraySpeciesCreate is skipped in a simple interview impl (always Array).",
      "reduce without init on empty/all-holes throws TypeError.",
    ],
  ),

  "b1-impl-call-apply-bind": e(
    "Implement call: set a unique key on the thisArg object, assign the function, invoke with args, delete the key, return the result. For primitives, Object(thisArg). apply unpacks an array-like by index. bind returns a function that concatenates bound args then calls with the bound this. Handle null this → globalThis in sloppy mental model; in strict, keep null/undefined.",
    "You cannot use .call to implement .call in the interview. The unique-key trick shows you know methods are [[Call]] with a receiver.",
    "Temporarily hang the function on the object, call it as a method, unscrew it. bind is a closure over this+args.",
    [
      "Symbol() as the temp key so you do not clash.",
      "Box primitives with Object(ctx).",
      "apply: convert arrayLike to a real argument list.",
      "bind: return a new function; support further partial args.",
      "Do not forget to delete the temp key in finally.",
    ],
    "Function.prototype.myCall = function (ctx, ...args) {\n  if (ctx == null) ctx = globalThis;\n  else if (typeof ctx !== 'object' && typeof ctx !== 'function') ctx = Object(ctx);\n  const k = Symbol();\n  ctx[k] = this;\n  try { return ctx[k](...args); } finally { delete ctx[k]; }\n};\nfunction greet(p) { return p + this.name; }\nconsole.log(greet.myCall({ name: 'Ada' }, 'hi '));\nFunction.prototype.myBind = function (ctx, ...pre) {\n  const fn = this;\n  return (...post) => fn.myCall(ctx, ...pre, ...post);\n};\nconsole.log(greet.myBind({ name: 'Alan' }, 'yo ')());\n",
    "myCall via temp symbol key; myBind via closure",
    "Using a string key '__fn' that might exist on the object — Symbol is the fix.",
    [
      "Real call uses Call(fn, thisArg, args) without mutating the object.",
      "Bound functions are exotic objects, not just arrows (they can be new'd in some cases).",
      "The temp-property trick fails on frozen objects — mention that in interviews.",
    ],
  ),

  "b1-impl-promise-combinators": e(
    "Implement all: counter remaining, array of results by index, reject on first reject. allSettled: never reject the outer (for promise inputs); store {status,value|reason}. race: first settle wins, empty stays pending. Do not use the built-in combinators. Wrap non-promises with Promise.resolve.",
    "Combinators are the standard concurrency interview after ‘what is a promise.’ Index-stability vs finish-order is the point.",
    "Attach then to every input. all fills a seating chart. race slams the door on first finish. allSettled waits for every seat to have a card.",
    [
      "Convert inputs to an array (iterable).",
      "Promise.resolve each item.",
      "all: if reject, reject outer once (guard).",
      "allSettled: increment done until n.",
      "race: no remaining count needed; first then/catch on the outer resolve/reject.",
    ],
    "function all(iter) {\n  const xs = [...iter];\n  return new Promise((resolve, reject) => {\n    if (!xs.length) return resolve([]);\n    const out = []; let left = xs.length;\n    xs.forEach((p, i) => Promise.resolve(p).then((v) => { out[i] = v; if (--left === 0) resolve(out); }, reject));\n  });\n}\nfunction race(iter) {\n  const xs = [...iter];\n  return new Promise((resolve, reject) => {\n    xs.forEach((p) => Promise.resolve(p).then(resolve, reject));\n  });\n}\nconsole.log(await all([1, Promise.resolve(2)]));\nconsole.log(await race([new Promise(() => {}), Promise.resolve('w')]));\n",
    "all preserves index; race takes first settle",
    "all that pushes in completion order instead of assigning out[i] — order bugs.",
    [
      "Spec still lets losing promises reject unhandled if you do not attach empty catches — mention it.",
      "Empty race never resolves — your impl should match.",
      "allSettled should not fail-fast.",
    ],
  ),

  "b1-impl-debounce-throttle": e(
    "Implement debounce with clearTimeout/setTimeout storing latest args; expose cancel. Throttle with last-run timestamp or a locked flag plus optional trailing timeout. Memoize with a Map keyed by JSON.stringify(args) or the first argument; document identity vs deep keys. These are timer + closure exercises, not lodash imports.",
    "Every frontend interview eventually asks you to write debounce. Trailing vs leading is the follow-up.",
    "Debounce: reset the timer. Throttle: locked door with a clock. Memoize: notebook of past (args→result).",
    [
      "debounce: each call clearTimeout then setTimeout(fn, wait).",
      "throttle leading: if now-last>=wait, run and set last.",
      "trailing throttle: schedule a timeout for the leftover last args.",
      "memoize: cache.has(key) ? get : set(fn()).",
      "memoize only pure fns.",
    ],
    "function debounce(fn, wait) {\n  let t; const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };\n  d.cancel = () => clearTimeout(t); return d;\n}\nfunction throttle(fn, wait) {\n  let last = 0;\n  return (...a) => { const n = Date.now(); if (n - last >= wait) { last = n; fn(...a); } };\n}\nfunction memoize(fn) {\n  const c = new Map();\n  return (x) => c.has(x) ? c.get(x) : c.set(x, fn(x)).get(x);\n}\nconst f = memoize((n) => n * 2);\nconsole.log(f(3), f(3));\n",
    "debounce/throttle/memoize from closures and Map",
    "JSON.stringify keys: object key order and undefined make cache misses/hits wrong.",
    [
      "Timers are host; your functions only close over ids.",
      "Map SameValueZero keys: NaN works, objects by identity.",
      "Trailing throttle is a debounce nested inside a throttle window.",
    ],
  ),

  "b1-impl-curry-compose": e(
    "Curry: return a function that collects args until fn.length is met, then apply (or allow batched args). compose(f,g,h)(x) is f(g(h(x))) via reduceRight. pipe is reduce left. Do not use lodash. Handle 0-arg functions. compose() with no fns is identity.",
    "FP toolkit interviews: closures + reduce. .length pitfalls (defaults/rest) are the follow-up.",
    "Curry: piggy bank of arguments until full. compose: wrap functions right-to-left. pipe: assembly line left-to-right.",
    [
      "curried(...a) if a.length>=fn.length then fn(...a) else (...b)=>curried(...a,...b).",
      "compose: fns.reduceRight((v,f)=>f(v), x).",
      "pipe: fns.reduce((v,f)=>f(v), x).",
      "Identity: (x)=>x when fns empty.",
      "Do not copy this unless wrapping methods.",
    ],
    "function curry(fn) {\n  const nest = (...a) => (a.length >= fn.length ? fn(...a) : (...b) => nest(...a, ...b));\n  return nest;\n}\nconst compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst add = (a, b, c) => a + b + c;\nconsole.log(curry(add)(1)(2)(3), compose((n) => n + 1, (n) => n * 2)(3), pipe((n) => n * 2, (n) => n + 1)(3));\n",
    "curry by arity; compose vs pipe on 3",
    "fn.length is 0 for (...args)=> — your curry will call immediately with [].",
    [
      "Function.length ignores rest and counts until first default.",
      "Each nested curry function is a new closure object.",
      "compose of async functions needs a special async compose.",
    ],
  ),

  "b1-impl-deep-clone": e(
    "Deep clone: walk objects/arrays, copy into new containers, use a WeakMap of originals→copies to preserve cycles. Clone Date via new Date(ms), Map/Set by iterating, typed arrays via slice. Skip functions or throw. Flatten: recursive concat of nested arrays. Deep equal: same walk with SameValue and cycle maps. JSON is not an acceptable clone.",
    "structuredClone exists, but interviews want you to handle cycles and types by hand to prove graph traversal.",
    "DFS/BFS of a graph. When you see a node already in the memo, reuse the copy (cycle). Flatten is clone of lists only. Equal is clone’s brother that returns boolean.",
    [
      "if (seen.has(x)) return seen.get(x).",
      "Arrays: new array, then fill.",
      "Plain objects: Object.create(getPrototypeOf) or {}.",
      "Date/Map/Set special cases.",
      "deepEqual: if both seen, compare mapped pairs.",
    ],
    "function deepClone(x, seen = new WeakMap()) {\n  if (x === null || typeof x !== 'object') return x;\n  if (seen.has(x)) return seen.get(x);\n  if (x instanceof Date) return new Date(x);\n  const c = Array.isArray(x) ? [] : {};\n  seen.set(x, c);\n  for (const k of Reflect.ownKeys(x)) c[k] = deepClone(x[k], seen);\n  return c;\n}\nfunction flatten(a) {\n  return a.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v) : v), []);\n}\nconst o = { n: 1 }; o.self = o;\nconst c = deepClone(o);\nconsole.log(c.n, c.self === c, c !== o, flatten([1, [2, [3]]]));\n",
    "Cycle-safe clone with WeakMap; recursive flatten",
    "JSON.parse(JSON.stringify) drops functions, dates-as-dates, maps, and throws on cycles.",
    [
      "WeakMap memo is identity-based — correct for cycles.",
      "Reflect.ownKeys copies symbols too.",
      "Prototype: copying into {} loses class; mention structuredClone vs custom.",
    ],
  ),

  "b1-impl-get-path": e(
    "get(object, path) reads a nested path like 'a.b[0].c' or ['a','b',0,'c'] and returns undefined if any step is nullish (or a default). Implement by splitting the path, walking with a loop, not eval. Do not use lodash.get — write the walk. Optional prototype pollution: skip __proto__ keys if the interviewer cares.",
    "Config objects are nested. A safe walker is safer than eval('obj.'+path) and is a standard utility interview.",
    "A flashlight along a hallway of doors. If a door is missing or null, stop and return undefined (or default).",
    [
      "Normalize path to an array of keys.",
      "Split on . and [n] with a small parser or regex.",
      "for (const k of keys) { if (cur==null) return def; cur = cur[k]; }",
      "Return default only if the walk failed, not if the value is 0.",
      "Refuse __proto__ / constructor if implementing safely.",
    ],
    "function get(obj, path, def) {\n  const keys = Array.isArray(path)\n    ? path\n    : String(path).replace(/\\[/g, '.').replace(/\\]/g, '').split('.').filter(Boolean);\n  let cur = obj;\n  for (const k of keys) {\n    if (k === '__proto__' || k === 'constructor') return def;\n    if (cur == null) return def;\n    cur = cur[k];\n  }\n  return cur === undefined ? def : cur;\n}\nconsole.log(get({ a: { b: [ { c: 1 } ] } }, 'a.b[0].c'));\nconsole.log(get({}, 'a.b', 3), get({ a: 0 }, 'a', 3));\n",
    "Walk a.b[0].c; default vs legitimate 0",
    "Returning default when the value is 0 or '' — only missing/undefined should default (define your contract).",
    [
      "eval is a security hole and a wrong tool.",
      "Bracket paths are still property keys (strings).",
      "Prototype pollution via path '__proto__.x' is a real get/set utility CVE class.",
    ],
  ),

  "b1-impl-event-emitter": e(
    "EventEmitter: map of event name → array of listeners. on/addListener pushes; off/removeListener splices the same function identity; emit calls a snapshot of the list (so off during emit is safe); once wraps and removes after fire. Do not inherit Node’s unless asked. Errors in listeners should not skip siblings (policy choice — document it).",
    "Pub/sub is the backbone of Node streams and many UI buses. Implementing it tests arrays, this, and snapshot iteration.",
    "A dictionary of mailing lists. emit photocopies the list then phones each number so unsubscribing mid-broadcast is safe.",
    [
      "this.table = new Map().",
      "on: get-or-create array, push fn.",
      "emit: [...list].forEach(fn => fn(...args)).",
      "off: filter !== fn.",
      "once: wrapper that offs then calls.",
    ],
    "class Emitter {\n  #m = new Map();\n  on(ev, fn) { if (!this.#m.has(ev)) this.#m.set(ev, []); this.#m.get(ev).push(fn); return this; }\n  off(ev, fn) { const a = this.#m.get(ev); if (a) this.#m.set(ev, a.filter((f) => f !== fn)); }\n  emit(ev, ...args) { [...(this.#m.get(ev) || [])].forEach((f) => f(...args)); }\n  once(ev, fn) {\n    const w = (...a) => { this.off(ev, w); fn(...a); };\n    return this.on(ev, w);\n  }\n}\nconst e = new Emitter();\ne.once('x', (n) => console.log('once', n));\ne.emit('x', 1); e.emit('x', 2);\n",
    "Map of arrays; once wrapper; snapshot emit",
    "Iterating the live array while a listener unsubscribes — skipped listeners. Snapshot with slice.",
    [
      "Node EventEmitter is more (error event, maxListeners, prepend).",
      "Function identity is how off works — bind creates a new one.",
      "DOM EventTarget is a different API (capture, once option).",
    ],
  ),

  "b1-impl-retry-sleep": e(
    "sleep(ms) is new Promise(r => setTimeout(r, ms)). retry(fn, {times, delay, backoff}) loops await fn(), on throw await sleep, multiply delay. Concurrency limiter: queue + active count as in the limiter topic. Implement from scratch with promises, not libraries. AbortSignal can break the loop.",
    "Network robustness is a practical async interview: sleep is the primitive, retry and pooling compose it.",
    "sleep = timer wrapped in a promise. retry = for-loop with catch and wait. limiter = nightclub door from before.",
    [
      "sleep: Promise + setTimeout; clear on abort.",
      "retry: for i in 1..n try return await fn() catch store; await sleep(delay); delay*=2.",
      "Do not retry if signal.aborted.",
      "limiter finally decrements active.",
      "Jitter: delay * (0.5 + Math.random()/2).",
    ],
    "const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function retry(fn, times = 3, delay = 5) {\n  let last;\n  for (let i = 0; i < times; i++) {\n    try { return await fn(); } catch (e) { last = e; await sleep(delay); }\n  }\n  throw last;\n}\nlet n = 0;\nconsole.log(await retry(async () => { if (++n < 2) throw new Error('x'); return n; }));\nawait sleep(1);\nconsole.log('slept');\n",
    "sleep helper and retry until success",
    "retry(fn) where fn is not a function that returns a new promise each time — reusing a rejected promise never succeeds.",
    [
      "A rejected promise is settled forever; retry must call fn again.",
      "setTimeout ids should be cleared if you abort sleep.",
      "Backoff without cap can sleep for minutes — cap delay.",
    ],
  ),

  "b1-impl-promise": e(
    "A toy Promise: store state, value, and arrays of onF/onR. The executor runs sync with resolve/reject that settle once and then drain queues via queueMicrotask. then always returns a new MyPromise; wrap callback results (thenable adopt). catch/finally can be then sugar. This is hard; handle throw in executor and in then callbacks.",
    "‘Write Promise’ is the senior async interview. It proves microtasks, thenable assimilation, and once-settle.",
    "A state machine plus two mailing lists. resolve mails the success list on the next microtask. then always cuts a new box chained to this one.",
    [
      "pending|fulfilled|rejected, locked after first settle.",
      "queueMicrotask to run handlers.",
      "then: if already settled, still queue async.",
      "If handler returns a thenable, adopt it.",
      "throw in handler → reject next.",
    ],
    "class P {\n  #s = 'pending'; #v; #ok = []; #no = [];\n  constructor(ex) {\n    const settle = (s, v) => { if (this.#s !== 'pending') return; this.#s = s; this.#v = v; queueMicrotask(() => (s === 'fulfilled' ? this.#ok : this.#no).forEach((f) => f(v))); };\n    try { ex((v) => settle('fulfilled', v), (e) => settle('rejected', e)); } catch (e) { settle('rejected', e); }\n  }\n  then(onF, onR) {\n    return new P((res, rej) => {\n      const wrap = (fn, pass) => (v) => { try { const r = fn ? fn(v) : pass(v); res(r); } catch (e) { rej(e); } };\n      const ok = wrap(onF, (v) => v), no = wrap(onR, (e) => { throw e; });\n      if (this.#s === 'fulfilled') queueMicrotask(() => ok(this.#v));\n      else if (this.#s === 'rejected') queueMicrotask(() => no(this.#v));\n      else { this.#ok.push(ok); this.#no.push(no); }\n    });\n  }\n}\nconst p = new P((r) => r(1));\np.then((n) => n + 1).then((n) => console.log(n));\n",
    "Minimal Promise: microtask then chain",
    "Calling then handlers synchronously in resolve — Promises must always be async (tests check a then after resolve still runs later).",
    [
      "A+ spec: then must be async; 2.2.4.",
      "Thenable assimilation is the hardest part (thenable that calls both resolve and reject).",
      "Real engines optimize native promises in C++.",
    ],
  ),

  "b1-impl-lru": e(
    "LRU cache: Map keeps insertion order. get: if has, delete and re-set to move to newest, return value. set: if has, refresh; if size==cap, delete map.keys().next().value (oldest); then set. O(1) average. Do not use an array.shift for large caps. Optional: TTL is extra.",
    "Caches in editors and APIs must evict. LRU is the standard interview cache with a clear invariant.",
    "A guest list that re-stamps whoever you see. When the club is full, the oldest stamp at the door leaves.",
    [
      "this.m = new Map(); this.cap = cap.",
      "get: if !has return; bump by delete+set.",
      "set: bump or evict first key then set.",
      "size: map.size.",
      "Do not iterate the whole map to find LRU.",
    ],
    "class LRU {\n  constructor(cap) { this.cap = cap; this.m = new Map(); }\n  get(k) {\n    if (!this.m.has(k)) return undefined;\n    const v = this.m.get(k); this.m.delete(k); this.m.set(k, v); return v;\n  }\n  set(k, v) {\n    if (this.m.has(k)) this.m.delete(k);\n    else if (this.m.size === this.cap) this.m.delete(this.m.keys().next().value);\n    this.m.set(k, v);\n  }\n}\nconst l = new LRU(2);\nl.set('a', 1); l.set('b', 2); l.get('a'); l.set('c', 3);\nconsole.log(l.m.has('b'), [...l.m.keys()]);\n",
    "Map-order LRU: get bumps; set evicts oldest",
    "Using an Array to store order and indexOf on every get — O(n), not the expected O(1).",
    [
      "JS Map is specified to be ordered by last set for new keys; delete+set moves to the end.",
      "A doubly linked list + hashmap is the classic non-JS writeup; Map is the JS-native equivalent.",
      "WeakMap cannot iterate keys, so it is the wrong structure for LRU eviction.",
    ],
  ),

  "b3-dom-elements": e(
    "DOM elements are host objects implementing the Element/HTMLElement interfaces: a live tree of nodes (element, text, comment) under document. You create with document.createElement, query with querySelector/All, and insert with append/prepend/before/after. The tree is not a JS array; live NodeLists can change as the DOM changes. This is a Web API, not ECMAScript.",
    "HTML needed a programmable document. The DOM is that tree exposed to JS so UIs can update without full page reloads.",
    "A live tree of boxes (elements) with attributes and kids. JS holds pointers into the tree; mutating the pointer’s node mutates what the user sees after the next paint.",
    [
      "document.querySelector('#id') for one; querySelectorAll for a static NodeList from that API.",
      "createElement + append to build.",
      "textContent vs innerHTML (XSS).",
      "Do not copy DOM nodes with spread expecting elements to clone — use cloneNode.",
      "iframe has a different document.",
    ],
    "const el = document.createElement('button');\nel.textContent = 'Save';\nel.setAttribute('type', 'button');\ndocument.body?.append(el);\nconst found = document.querySelector('button');\nconsole.log(found?.textContent, found === el);\nel.remove();\n",
    "createElement, append, query, remove",
    "innerHTML with user strings is XSS. Prefer textContent or sanitizers.",
    [
      "Nodes are host objects; each has a wrapper in the JS heap.",
      "Live HTMLCollection vs static NodeList (querySelectorAll is static).",
      "The rendering pipeline (style/layout/paint) runs in the browser event loop, not in ECMA-262.",
    ],
  ),

  "b3-add-event-listener": e(
    "addEventListener(type, listener, options) registers a callback on an EventTarget (element, document, window, xhr). The browser calls it with an Event when that event fires. options: capture, once, passive, signal. removeEventListener needs the same function identity and capture flag. Events propagate capture→target→bubble unless stopped.",
    "Clicks, input, and load are the original reason JS is in the browser. The listener list is how the page reacts without polling.",
    "A mailbox on the node. The browser delivers Event letters down from window (capture) then back up (bubble). once is a self-stamped envelope.",
    [
      "addEventListener('click', fn) not onclick = if you need many handlers.",
      "Keep fn identity for remove, or pass { signal } from AbortController.",
      "event.preventDefault() vs stopPropagation().",
      "passive: true on touch/wheel for scroll performance.",
      "this in a classic function listener is the currentTarget.",
    ],
    "const btn = document.createElement('button');\nconst ac = new AbortController();\nfunction onClick(e) { console.log(e.type, e.currentTarget === btn); }\nbtn.addEventListener('click', onClick, { signal: ac.signal });\nbtn.dispatchEvent(new Event('click'));\nac.abort();\n",
    "Listener with AbortSignal; dispatchEvent for a test click",
    "removeEventListener('click', fn.bind(this)) never removes the original — different identity.",
    [
      "EventTarget listener lists in the DOM spec.",
      "dispatchEvent is synchronous; the rest of the event loop waits.",
      "Synthetic events vs trusted user events (isTrusted).",
    ],
  ),

  "b3-custom-events": e(
    "CustomEvent lets you dispatch named events with a detail payload: new CustomEvent('cart:add', { detail: { id }, bubbles: true }). Listeners use addEventListener('cart:add', e => e.detail). Use for loosely coupled components on the DOM tree. Native Event also works without detail. They do not cross iframe/realms without more plumbing.",
    "Components needed a pub/sub that rides the same capture/bubble path as clicks, without a global event bus import.",
    "A homemade letter with a detail pocket, mailed through the DOM tree if bubbles is true.",
    [
      "new CustomEvent(name, { detail, bubbles, cancelable }).",
      "element.dispatchEvent(ev).",
      "Listen on a common ancestor for bubbled custom events.",
      "Do not use for cross-tab (use BroadcastChannel).",
      "Name with a namespace prefix to avoid clashing with future HTML events.",
    ],
    "const host = document.createElement('div');\nhost.addEventListener('cart:add', (e) => console.log(e.detail.id));\nhost.dispatchEvent(new CustomEvent('cart:add', { detail: { id: 7 }, bubbles: true }));\ndocument.body?.append(host);\nhost.remove();\n",
    "CustomEvent with detail on a host element",
    "Forgetting bubbles: true and listening on document — the event never gets there.",
    [
      "CustomEvent.detail is specified in the DOM spec.",
      "dispatchEvent runs listeners synchronously on the current stack.",
      "composed: true is needed to cross shadow DOM.",
    ],
  ),

  "b3-fetch": e(
    "fetch(url, init) is a Web API that returns a Promise<Response> for an HTTP request. Default GET, CORS mode, no cookies unless credentials: 'include'. Response is a stream: call .json/.text once. HTTP 404 is still a fulfilled promise — check response.ok. Abort with init.signal. It is not ECMAScript.",
    "XHR was event-based and clunky. fetch is promise-based HTTP with streaming bodies, matching modern async JS.",
    "Mail a Request, get a Response box. Status is on the box; the body is a one-shot stream inside. 404 is a delivered box with a sad stamp, not a thrown letter.",
    [
      "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.json().",
      "POST JSON: method, headers Content-Type, body JSON.stringify.",
      "Do not fetch file:// in pages casually (CORS).",
      "Opaque CORS responses hide body/headers.",
      "Clone the response if you must read twice.",
    ],
    "const ac = new AbortController();\nconst res = await fetch('/api/item', { signal: ac.signal });\nif (!res.ok) throw new Error(String(res.status));\nconst data = await res.json();\nconsole.log(data);\n// ac.abort();\n",
    "fetch, ok check, json(), optional abort",
    "await fetch() throwing only on network failure — 500 is not a throw unless you check ok.",
    [
      "Fetch spec: request/response/body streams, CORS, redirect modes.",
      "Body mixin: bodyUsed flag after json/text/arrayBuffer.",
      "HTTP cache and service workers can intercept.",
    ],
  ),

  "b3-abort-controller": e(
    "In the browser, AbortController.abort() cancels fetch, streams, and addEventListener({signal}). AbortError (DOMException) is what fetch rejects with. One signal can be passed to many APIs. AbortSignal.timeout(ms) and any(signals) exist in newer browsers. This is the Web API; language-level cooperative cancel is the same token.",
    "SPA navigations and typeahead needed to cancel in-flight HTTP and listeners with one standard object.",
    "A shared kill switch. Flip it; fetch aborts, listeners detach, your loops should check aborted.",
    [
      "New controller per request generation.",
      "Pass signal into fetch and addEventListener.",
      "abort() in route unmount.",
      "if (signal.aborted) return before heavy work.",
      "timeout: AbortSignal.timeout(5000) or race your own.",
    ],
    "const c = new AbortController();\ndocument.addEventListener('click', () => console.log('click'), { signal: c.signal });\nfetch('/x', { signal: c.signal }).catch((e) => console.log(e.name));\nc.abort();\nconsole.log(c.signal.aborted);\n",
    "One abort drops a listener and a fetch",
    "Reusing one controller for the lifetime of the app — the first abort kills all future fetches using that signal.",
    [
      "AbortSignal is an EventTarget; abort sets aborted and reason.",
      "Fetch aborts the underlying network as specified.",
      "Listener option signal unregisters on abort.",
    ],
  ),

  "b3-intersection-observer": e(
    "IntersectionObserver asynchronously reports when a target’s visibility vs a root (viewport or element) crosses thresholds. Callback receives entries with intersectionRatio, boundingClientRect, isIntersecting. Use for lazy images, infinite scroll, ad viewability. It is not a poll of getBoundingClientRect on scroll (cheaper).",
    "Scroll listeners + layout reads caused jank. The browser can compute intersections off the critical path and batch callbacks.",
    "A lookout that pings you when a box enters or leaves a window (the root), not on every pixel of scroll.",
    [
      "new IntersectionObserver(cb, { root, rootMargin, threshold }).",
      "observer.observe(el); disconnect on unmount.",
      "threshold: 0, 0.25, 1 or an array.",
      "Do not assume callback order equals DOM order.",
      "root: null means viewport.",
    ],
    "const io = new IntersectionObserver((entries) => {\n  for (const e of entries) console.log(e.isIntersecting, e.intersectionRatio);\n}, { threshold: 0.25 });\nconst el = document.createElement('div');\ndocument.body?.append(el);\nio.observe(el);\nio.disconnect();\nel.remove();\n",
    "Observe an element at 25% visibility, then disconnect",
    "Keeping the observer without disconnect after removing nodes — callbacks and references can leak.",
    [
      "HTML spec: IntersectionObserver, queued as a microtask-ish delivery (specified as a task).",
      "rootMargin can grow/shrink the root box like CSS margin.",
      "Cross-origin iframes have restrictions on root.",
    ],
  ),

  "b3-mutation-observer": e(
    "MutationObserver watches a node for DOM changes: childList, attributes, characterData, subtree. The callback receives a batch of MutationRecords after mutations, asynchronously (microtask). Use for integrations with foreign widgets, not for your own React tree (you already know the updates). disconnect when done.",
    "Extensions and widgets needed to react to DOM they do not control, without monkey-patching Node.prototype.",
    "A security camera on a branch of the tree. It does not fire inside your append() call; it reports a reel of what changed, soon after.",
    [
      "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attributeFilter }).",
      "Process records; avoid mutating in a way that loops forever.",
      "disconnect() / takeRecords().",
      "characterData for text node edits.",
      "Not a replacement for state management in your app.",
    ],
    "const box = document.createElement('div');\nconst mo = new MutationObserver((recs) => {\n  console.log(recs.map((r) => r.type));\n});\nmo.observe(box, { childList: true });\nbox.append('hi');\nqueueMicrotask(() => { mo.disconnect(); });\n",
    "Observe childList; callback runs after the append",
    "Observing document.body with subtree: true in a busy app — performance cliff.",
    [
      "Records are queued and delivered in a microtask checkpoint.",
      "attributeOldValue / characterDataOldValue need extra options.",
      "Shadow DOM: observe the shadow root to see internals.",
    ],
  ),

  "b3-resize-observer": e(
    "ResizeObserver notifies when an Element’s content box (or border/device-pixel box) size changes, including first observe. Callback gets ResizeObserverEntry with contentRect / borderBoxSize. Better than window resize for component-level layout (charts, overflow). Avoid layout writes in the callback that resize the same element (loop notifications).",
    "window 'resize' missed CSS grid/flex children changing size. Elements needed their own size events.",
    "A tape measure on a box that pings you when the numbers change — even if the window did not.",
    [
      "new ResizeObserver(cb).observe(el, { box: 'border-box' }).",
      "unobserve/disconnect on unmount.",
      "Read sizes from the entry, not a fresh getBoundingClientRect storm if possible.",
      "Debounce extra work; the observer already batches.",
      "Watch for infinite resize loops.",
    ],
    "const el = document.createElement('div');\nel.style.width = '100px';\nconst ro = new ResizeObserver((entries) => {\n  for (const e of entries) console.log(e.contentRect.width);\n});\ndocument.body?.append(el);\nro.observe(el);\nro.disconnect();\nel.remove();\n",
    "ResizeObserver on a div’s content box",
    "Changing el.style in the callback based on width in a way that changes width again — notification loop (browser may error).",
    [
      "Delivered as a resize observer “undelivered notifications” batch in the event loop.",
      "device-pixel-content-box is for canvas sharpness.",
      "SVG and tables have historically quirky box models.",
    ],
  ),

  "b3-performance-observer": e(
    "PerformanceObserver streams PerformanceEntry records: paint, largest-contentful-paint, layout-shift, longtask, resource, navigation, measure. Use buffered: true to see entries that happened before you subscribed. This is the measurement Web API, not the JS profiler in DevTools. Disconnect when the page component dies.",
    "Core Web Vitals and resource timing needed a standard, privacy-aware way to observe performance events from script.",
    "A subscribe button on the browser’s stopwatch log. You get typed entries (LCP, CLS, longtask) as they are recorded.",
    [
      "new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true }).",
      "entry.entryType and startTime/duration.",
      "Observe longtask to find main-thread blocks.",
      "Do not log PII from resource URLs carelessly.",
      "performance.mark still creates measure-able marks.",
    ],
    "const po = new PerformanceObserver((list) => {\n  for (const e of list.getEntries()) console.log(e.entryType, e.name, e.duration);\n});\npo.observe({ type: 'measure', buffered: true });\nperformance.mark('a');\nperformance.mark('b');\nperformance.measure('ab', 'a', 'b');\npo.disconnect();\n",
    "Observe User Timing measures including buffered",
    "Observing without buffered: true and missing the LCP that already happened at startup.",
    [
      "Performance Timeline spec; some entry types require origin-trial or limited availability.",
      "longtask entries are coarse for privacy (attribution is limited).",
      "Dropped entries if the observer is too slow — check.",
    ],
  ),

  "b3-blob-file": e(
    "In the browser, <input type=file> and drag-drop give File objects (Blobs with name). URL.createObjectURL(blob) makes a temporary blob: URL for img/src or download. Revoke it to free memory. FormData.append('file', file) for multipart upload. FileReader is legacy; prefer await file.text()/arrayBuffer(). Show a picker with showOpenFilePicker where supported.",
    "Uploads, image previews, and downloads are core web tasks. Blob URLs avoid huge base64 in the DOM.",
    "A File is a named bag of bytes from the user’s disk. createObjectURL is a temporary http-like address for that bag in this tab.",
    [
      "input.files[0] is a File.",
      "const url = URL.createObjectURL(file); img.src = url; then revoke.",
      "fetch(url) can read a blob URL.",
      "Do not stringify files.",
      "Accept attribute filters the picker, not a security boundary.",
    ],
    "const blob = new Blob(['hi'], { type: 'text/plain' });\nconst url = URL.createObjectURL(blob);\nconsole.log(url.startsWith('blob:'));\nconst file = new File(['hi'], 'a.txt', { type: 'text/plain' });\nconsole.log(file.name, file.size, await file.text());\nURL.revokeObjectURL(url);\n",
    "Blob URL + File.name; revoke after use",
    "Never revoking object URLs in a preview gallery — memory leak of decoded images.",
    [
      "blob: URLs are origin-tied and listed in a per-document store until revoke or unload.",
      "File inherits Blob; lastModified is extra.",
      "Drag-drop DataTransfer.files is a FileList, not an Array.",
    ],
  ),

  "b3-raf": e(
    "requestAnimationFrame(callback) runs before the next paint with a high-res timestamp. Use it to mutate DOM/canvas once per frame. cancelAnimationFrame(id) stops a loop. It pauses in background tabs (often). Timestamp is not ‘16.67ms guaranteed.’ Pair with CSS transforms for cheap visual changes. This is the browser paint-aligned scheduler.",
    "setTimeout(16) is not vsync and drifts. rAF exists so animations sample once per refresh and stop wasting CPU when hidden.",
    "The projector’s ‘next frame’ bell. You move the puppets, then the browser paints. If the tab is in a drawer, the bell may slow down.",
    [
      "function loop(t) { draw(t); id = requestAnimationFrame(loop); }.",
      "Cancel on unmount.",
      "Measure DOM first, then write (avoid layout thrash).",
      "Do not rAF a network poll.",
      "Fallback to setTimeout only if rAF missing.",
    ],
    "let id = 0;\nfunction loop(ts) {\n  if (ts < 48) id = requestAnimationFrame(loop);\n  else console.log('done', ts);\n}\nid = requestAnimationFrame(loop);\n// cancelAnimationFrame(id);\n",
    "rAF chain until timestamp ≥ 48ms",
    "Starting a new rAF loop every scroll event without canceling — stacked loops burn CPU.",
    [
      "HTML event loop: run animation frame callbacks, then render.",
      "Timestamp is time origin + elapsed (DOMHighResTimeStamp).",
      "Multiple callbacks in one frame share the same timestamp approximately.",
    ],
  ),
}
