import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Lexical scope (static scope) means variable access is determined by where functions and blocks are written in source code, not where they are called. Inner scopes can read outer bindings; outer cannot read inner. Block scope (let/const) and function scope (var) nest lexically.',
  whyExists:
    'Predictable name lookup simplifies reasoning and enables closures. Dynamic scope (call-site based) was rejected for user-facing JS — lexical scope makes tooling, minification, and mental models stable.',
  mentalModel:
    'Scopes are nested bubbles drawn at write time. Lookup walks outward from current bubble until a name is found. Calling a function elsewhere does not change which bubbles it can see — only where it was defined matters.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Global scope → module scope → function → block (let/const) nesting.',
        'Inner function captures outer bindings in closure when created.',
        'var is function-scoped (or global); let/const are block-scoped.',
        'Shadowing: inner declaration hides outer same name in inner scope.',
        'Lookup follows scope chain at runtime but chain fixed at definition (lexical).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Lexical vs dynamic',
      text: 'JS uses lexical scope only (with). this is dynamic by call site; scope is not.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Global[Global scope]
  Mod[Module scope]
  Fn[Function scope]
  Block[Block scope]
  Global --> Mod
  Mod --> Fn
  Fn --> Block
  Block -->|lookup misses| Fn
  Fn -->|lookup misses| Mod
  Mod -->|lookup misses| Global`,
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
  console.log(l); // ReferenceError
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0,1,2 — per-iteration binding
}`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Closure over lexical scope',
      code: `function makeLogger(prefix) {
  return (msg) => console.log(\`\${prefix}: \${msg}\`);
}
const log = makeLogger('APP');
log('ready'); // APP: ready — prefix from birth scope`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Environment records linked by [[OuterEnv]] forming scope chain.',
        'Module scope is strict, top-level let/const not global properties.',
        'with and eval(can poison lexical scope in non-strict legacy code).',
        'TDZ is lexical — block start to let/const line.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Predictable closures and module privacy',
      'Block scope limits leak of loop variables',
      'Enables static analysis and tree shaking',
    ],
    disadvantages: [
      'var function-scope surprises in blocks',
      'Shadowing can confuse readers',
      'Long scope chains slightly slower lookup (engine caches)',
    ],
    alternatives: ['Modules for file-level privacy', 'IIFE for pre-ES6 isolation'],
    whenToUse: ['Default mental model for all JS name resolution'],
    whenNotToUse: ['Expecting call-site scope — use explicit params instead'],
  },
  failureModes: [
    'var in block leaking to function scope.',
    'Shadowing outer variable accidentally in inner block.',
    'Assuming import is global — module lexical only.',
  ],
  production: {
    maintainability: ['Prefer const; smallest block scope; avoid var'],
    performance: ['Scope depth rarely matters; avoid eval/with breaking optimization'],
  },
  interview: {
    expectations: [
      'Define lexical scope',
      'Block vs function scope',
      'Closure ties to lexical not dynamic scope',
    ],
    commonQuestions: ['var in for-loop + setTimeout?', 'Difference lexical vs dynamic?', 'Shadowing?'],
    followUps: ['Module scope vs global?', 'How let fixes loop closure?'],
    misconceptions: ['Scope determined where function called', 'Each if creates function scope for let'],
    traps: ['var hoisting in blocks', 'inner function dynamic scope expectation'],
    strongSignals: ['Static nesting, scope chain walk, let block vs var function'],
  },
  keyTakeaways: [
    'Scope fixed by source location (lexical).',
    'let/const block-scoped; var function-scoped.',
    'Lookup walks outward until binding found.',
    'Closures see lexical outer bindings at creation.',
    'Shadowing hides outer names in inner scope.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is lexical scope?',
      answerHint: 'Variable visibility determined by where code is written, not called.',
    },
    {
      level: 'intermediate',
      question: 'Why does let in a for-loop fix the setTimeout closure bug?',
      answerHint: 'New block-scoped binding per iteration — each closure captures distinct i.',
    },
    {
      level: 'advanced',
      question: 'Is JavaScript dynamically scoped?',
      answerHint: 'No — lexical; only this is dynamic (non-arrow).',
    },
  ],
  flashcards: [
    { front: 'Lexical scope', back: 'Nested by write-time structure' },
    { front: 'let vs var scope', back: 'Block vs function/global' },
    { front: 'Scope chain lookup', back: 'Inner → outer until found' },
  ],
  quickRevision: [
    'Scope = where written',
    'let/const block; var function',
    'Closure = lexical outer',
    'Shadowing hides outer',
    'Module scope ≠ window',
    'No dynamic scope in JS',
  ],
}
