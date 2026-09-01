import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Scope is the region of code where a binding (variable, function, class) is visible and accessible. JavaScript has global, module, function, and block scopes. The engine resolves names by walking the scope chain from inner to outer lexical environments.',
  whyExists:
    'Without scope, every name would collide globally and programs could accidentally overwrite each other. Scoped bindings enable encapsulation, predictable lookup, closures, and safe modular code.',
  mentalModel:
    'Nested boxes drawn at write time. Each box holds its own names. Inner boxes see outer names; outer boxes never see inner names. Lookup starts in the current box and walks outward until a match or ReferenceError.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Global scope: script-wide (browser window / Node globalThis).',
        'Module scope: each ES module is its own top-level scope (strict, no accidental globals).',
        'Function scope: var and function declarations live for the whole function body.',
        'Block scope: let/const/class are scoped to the nearest { } block.',
        'Resolution is lexical — determined by source structure, not call site.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'var vs let/const',
      text: 'var is function-scoped and hoisted with undefined initialization. let/const are block-scoped and sit in the temporal dead zone until their line runs.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Global[Global scope]
  Module[Module scope]
  Function[Function scope]
  Block[Block scope]
  Global --> Module
  Module --> Function
  Function --> Block
  Block -->|miss| Function
  Function -->|miss| Module
  Module -->|miss| Global`,
    caption: 'Identifier lookup walks outward through nested lexical environments',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Block vs function scope',
      code: `function demo() {
  if (true) {
    var v = 1;   // function-scoped
    let l = 2;   // block-scoped
  }
  console.log(v); // 1
  // console.log(l); // ReferenceError
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Module scope prevents accidental globals',
      code: `// utils.ts — top-level is module scope, not window
export const API_URL = '/api';
let cache: Map<string, unknown> | null = null; // not a global property`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Lexical Environment: environment record + outer reference ([[OuterEnv]]).',
        'Global lexical environment uses global object binding (legacy) plus declarative record.',
        'Module environments mark bindings as immutable exports where applicable.',
        'Shadowing: inner declaration hides outer same-name binding in that inner scope only.',
        'Strict mode disallows with and limits eval from polluting outer lexical scope.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Predictable name lookup and tooling support',
      'Block scope (let/const) reduces accidental leakage',
      'Modules isolate implementation details',
    ],
    disadvantages: [
      'var legacy behavior confuses beginners',
      'TDZ errors for let/const before declaration',
      'Closure retention can keep outer scopes alive longer than expected',
    ],
    alternatives: ['IIFE for pre-ES6 encapsulation', 'Explicit namespace objects'],
    whenToUse: ['Default to const/let in blocks; modules for file-level boundaries'],
    whenNotToUse: ['Avoid var in new code; avoid polluting global unless intentional (polyfills)'],
  },
  failureModes: [
    'Using var in loops → shared binding across async callbacks.',
    'Assuming block-scoped let is hoisted like var (TDZ ReferenceError).',
    'Accidental global in sloppy scripts: x = 1 without declaration.',
    'Shadowing outer params and mutating wrong binding.',
  ],
  production: {
    performance: ['Prefer block scope to limit live bindings visible to closures'],
    maintainability: ['Enable strict mode; use ESLint no-var, no-implicit-globals'],
    reliability: ['Use modules instead of script tags leaking globals'],
  },
  interview: {
    expectations: [
      'Distinguish global, module, function, block scope',
      'Explain var vs let in a for-loop with setTimeout',
      'Define lexical (static) scope',
    ],
    commonQuestions: ['What is scope?', 'Difference between var and let?', 'What is TDZ?'],
    followUps: ['How does scope relate to closures?', 'Module scope vs script scope?'],
    misconceptions: ['Scope is determined by where a function is called'],
    traps: ['Thinking let is not hoisted at all (it is, but in TDZ)'],
    strongSignals: ['Mentions environment records, outer chain, per-iteration let bindings'],
  },
  keyTakeaways: [
    'Scope = where a name is visible; lookup is lexical.',
    'var is function-scoped; let/const are block-scoped.',
    'Modules create isolated top-level scopes.',
    'Inner scopes read outer; outer cannot read inner.',
    'TDZ: let/const exist but are inaccessible before their line.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between var and let scope?',
      answerHint: 'var is function-scoped; let/const are block-scoped.',
    },
    {
      level: 'intermediate',
      question: 'Why does let in a for-loop fix the setTimeout closure bug?',
      answerHint: 'New lexical binding per iteration; each callback closes over distinct i.',
    },
    {
      level: 'advanced',
      question: 'How does module scope differ from a classic script tag?',
      answerHint: 'Module top-level is not global object property; strict; private by default.',
    },
  ],
  flashcards: [
    { front: 'Lexical scope', back: 'Visibility determined by where code is written' },
    { front: 'var scope', back: 'Function-scoped (or global if outside function)' },
    { front: 'let/const scope', back: 'Block-scoped; TDZ until declaration line' },
    { front: 'Shadowing', back: 'Inner binding hides outer same name in inner scope' },
  ],
  quickRevision: [
    'Nested scopes: global → module → function → block',
    'Lookup walks outward on scope chain',
    'var: function scope; let/const: block scope',
    'Modules = strict isolated top-level',
    'TDZ for let/const before declaration',
    'Lexical, not dynamic (except this)',
  ],
}
