import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ES modules (import/export) are JavaScript official standard for splitting code into files with static dependencies, live bindings, and strict mode. Each module has its own top-level scope; imports are hoisted and evaluated in dependency order before the importing module runs.',
  whyExists:
    'Global script tags and CommonJS (require) lack static analysis and async-friendly loading in browsers. ESM enables tree shaking, explicit public API surfaces, and browser-native `<script type="module">` without bundlers (though bundlers still optimize).',
  mentalModel:
    'Each file is a sealed capsule exporting named or default bindings. Importers get read-only live views of exports — if exporter mutates let export, importers see updates. Load graph is a DAG resolved at parse/link time.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Parsing: static import/export only at top level (dynamic import() exception).',
        'Instantiation: allocate module environment, resolve bindings.',
        'Evaluation: run module bodies in dependency order (depth-first post-order).',
        'Live bindings: import { x } tracks exported let/const/var binding.',
        'Default export is a local binding exported as default.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'CJS vs ESM in Node',
      text: '.mjs or "type":"module" → ESM; .cjs or require → CommonJS. Interop rules differ (default import of CJS, __esModule hints).',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  A[moduleA.js]
  B[moduleB.js]
  C[moduleC.js]
  B -->|import| A
  C -->|import| B
  C -->|import| A
  Eval[Evaluate: A then B then C]`,
    caption: 'Dependencies evaluated before dependents; each module runs once',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Named, default, re-export',
      code: `// math.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function add(a, b) { return a + b; }

// app.js
import add, { PI, square } from './math.js';
import * as math from './math.js'; // namespace object

export { square } from './math.js'; // re-export`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Dynamic import (async)',
      code: `async function loadLocale(lang) {
  const mod = await import(\`./locales/\${lang}.js\`);
  return mod.default;
}
// Returns Promise<ModuleNamespace> — code splitting`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Module record: Environment, Namespace, state (uninstantiated → evaluated).',
        'import.meta.url — module URL (Node file:// paths).',
        'Cycle handling: live bindings may be in TDZ until exporter initializes.',
        'Tree shaking: bundlers eliminate unused exports via static graph.',
        'Top-level await pauses module evaluation until Promise settles.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Static structure for tooling and dead-code elimination',
      'Explicit dependency graph',
      'Browser-native loading with CORS',
    ],
    disadvantages: [
      'CJS interop friction in Node',
      'Cannot conditionally static-import at parse time',
      'Cycle bugs with TDZ temporal dead zone across modules',
    ],
    alternatives: ['CommonJS require (Node legacy)', 'Bundlers wrapping both', 'IIFE script tags (legacy browser)'],
    whenToUse: ['Modern browser and Node apps; libraries publishing ESM + CJS dual'],
    whenNotToUse: ['Tiny inline scripts — maybe overkill; sync require-only legacy without migration plan'],
  },
  failureModes: [
    'Circular dependency: undefined import during partial init.',
    'Mutating imported binding — TypeError (imports read-only).',
    'Missing .js extension in Node ESM resolution.',
    'Dynamic import path not analyzable — no static tree shake.',
  ],
  production: {
    performance: ['Code split with dynamic import(); prefetch critical modules'],
    maintainability: ['Barrel files (index re-export) can harm tree shake — export directly'],
    scalability: ['CDN + HTTP/2 for many small module files vs bundled chunk strategy'],
    security: ['CORS on cross-origin modules; integrity attribute on script tags'],
  },
  interview: {
    expectations: [
      'Static vs dynamic import',
      'Live bindings concept',
      'Module eval order',
    ],
    commonQuestions: ['ESM vs CommonJS?', 'What are live bindings?', 'import vs require hoisting?'],
    followUps: ['Circular module cycles?', 'Tree shaking requirements?'],
    misconceptions: ['import copies value once', 'Modules share global scope'],
    traps: ['Default export interop from CJS', 'Hoist means value ready before body runs'],
    strongSignals: ['Parse/link/eval phases, live bindings, static graph, import() async'],
  },
  keyTakeaways: [
    'ESM: static import/export, per-module scope, strict.',
    'Imports are live views of exports — not snapshots.',
    'Evaluation order: dependencies first; each module once.',
    'import() dynamic — async, for code splitting.',
    'Tree shaking needs static import graph.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Difference between export and export default?',
      answerHint: 'Named exports by name; default one primary export per module.',
    },
    {
      level: 'intermediate',
      question: 'What is a live binding in ES modules?',
      answerHint: 'Importer sees current value of exported let/var — updates propagate.',
    },
    {
      level: 'advanced',
      question: 'What happens with circular ESM dependencies?',
      answerHint: 'Partial evaluation; imports may be TDZ/undefined until exporter finishes init.',
    },
  ],
  flashcards: [
    { front: 'Live binding', back: 'Import tracks exporter binding — not copy' },
    { front: 'import vs import()', back: 'Static hoisted vs async dynamic load' },
    { front: 'Module scope', back: 'Top-level not global — own lexical env' },
  ],
  quickRevision: [
    'Static import/export',
    'Strict; own scope',
    'Deps eval first',
    'Live bindings',
    'import() for split',
    'Cycles: partial init TDZ',
  ],
}
