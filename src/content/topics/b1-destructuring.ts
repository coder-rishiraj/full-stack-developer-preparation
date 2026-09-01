import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Destructuring assignment unpacks values from arrays or properties from objects into distinct variables. Rest/spread companions (`...rest`) collect remaining elements. Works in declarations, assignments, and function parameters.',
  whyExists:
    'Repeated property access and index reads clutter code and obscure intent. Destructuring expresses shape extraction declaratively — especially for API responses, options objects, and React props.',
  mentalModel:
    'Pattern matching on the right-hand shape: “pull these slots out and bind names.” Array destructuring is positional; object destructuring is by key (with optional rename and defaults).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Array: `[a, b] = arr` — position-based; holes skip; default if undefined.',
        'Object: `{ x, y: renamed } = obj` — keys; shorthand `{ x }` for `{ x: x }`.',
        'Default values apply when binding is undefined (not when null).',
        'Rest collects remainder: `[head, ...tail]`, `{ id, ...rest }`.',
        'Nested patterns destructure deep shapes in one statement.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Function parameter destructuring',
      text: 'function connect({ host = "localhost", port = 5432 } = {}) — default entire param to {} avoids undefined destructuring throw.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Object and array patterns',
      code: `const user = { id: 1, name: 'Ada', role: 'admin' };
const { name, role = 'guest' } = user;

const pair = [10, 20, 30];
const [x, y, ...rest] = pair;
// x=10, y=20, rest=[30]

// Swap without temp
let a = 1, b = 2;
[a, b] = [b, a];`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Rename, nested, and function params',
      code: `const response = { data: { items: [1, 2] }, status: 200 };
const { data: { items }, status } = response;

function render({ title, onClick = () => {} }) {
  return \`<button onclick="...">\${title}</button>\`;
}

// Computed key destructuring
const key = 'id';
const { [key]: userId } = user;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'RHS must be iterable (array) or object (ToObject for null/undefined throws).',
        'Iterator protocol for array destructuring; own enumerable keys for object (not inherited by default in pattern).',
        'Rest in object destructuring copies own enumerable properties — shallow clone pattern.',
        'Destructuring in for-of: `for (const { id } of users)`.',
      ],
    },
  ],
  implementation: [
    {
      language: 'typescript',
      caption: 'Typed destructuring with defaults',
      code: `type Options = { timeout?: number; retries?: number };
function fetchWithOpts(url: string, { timeout = 5000, retries = 3 }: Options = {}) {
  return { url, timeout, retries };
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Concise extraction and options handling',
      'Rest enables immutable omit patterns',
      'Self-documenting parameter shapes',
    ],
    disadvantages: [
      'Deep nesting hard to read',
      'undefined vs null default trap',
      'Renaming obscures source field names',
    ],
    alternatives: ['Manual property access', 'lodash pick/omit', 'Pattern matching (future/experimental)'],
    whenToUse: ['API payloads, React props, swap, function options'],
    whenNotToUse: ['Very deep optional chains — optional chaining may be clearer alone'],
  },
  failureModes: [
    'Destructuring undefined/null without default param object.',
    'Expecting default when value is null (defaults only for undefined).',
    'Mutating rest object thinking it is deep clone.',
    'Missing rename: `{ data: items }` vs `{ items: data }` confusion.',
  ],
  production: {
    performance: ['Negligible; avoid destructuring huge objects repeatedly in hot loops if profiling shows cost'],
    maintainability: ['Limit nesting depth; use intermediate variables for complex API shapes'],
    reliability: ['Default entire options param to {} in public APIs'],
  },
  interview: {
    expectations: [
      'Array vs object destructuring syntax',
      'Defaults and renaming',
      'Rest/spread in destructuring',
    ],
    commonQuestions: ['Swap two variables?', 'Default in destructuring?', '{ a: b } meaning?'],
    followUps: ['undefined vs null with defaults?', 'Shallow clone via rest?'],
    misconceptions: ['Rest deep clones', 'Defaults apply for null'],
    traps: ['Destructuring undefined function arg without = {}'],
    strongSignals: ['Rename syntax, rest omit, nested patterns, default only undefined'],
  },
  keyTakeaways: [
    'Array: positional; object: by key with rename shorthand.',
    'Defaults trigger on undefined, not null.',
    'Rest collects remaining; object rest is shallow omit clone.',
    'Parameter destructuring: default whole param to {}.',
    'Nested patterns unpack deep structures in one line.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does `const { x: y } = obj` do?',
      answerHint: 'Reads obj.x into variable named y (rename).',
    },
    {
      level: 'intermediate',
      question: 'When does a default value in destructuring apply?',
      answerHint: 'When property is undefined; null does not trigger default.',
    },
    {
      level: 'advanced',
      question: 'How is `{ ...rest } = obj` used for immutable updates?',
      answerHint: 'Omit field then spread rest with override — shallow new object.',
    },
  ],
  flashcards: [
    { front: '{ x: y } destructuring', back: 'Property x → variable y' },
    { front: 'Default in destructuring', back: 'Applies when undefined only' },
    { front: 'Array rest', back: '[first, ...rest] collects remainder' },
  ],
  quickRevision: [
    'Array positional; object by key',
    'Rename: { key: alias }',
    'Default on undefined',
    'Rest for tail / omit',
    'Param: ({ opt } = {})',
    'Nested patterns supported',
  ],
}
