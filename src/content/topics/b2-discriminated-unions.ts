import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A discriminated union (tagged union) is a union of object types sharing a common literal-typed discriminant field (kind, type, status, tag). TypeScript narrows to exactly one member when you switch or compare on that field.',
  whyExists:
    'Boolean flags and optional fields allow invalid combinations (`{ success: true, error: "x" }`). A discriminant makes states mutually exclusive and enables exhaustive handling — reducers, parsers, and state machines become type-safe.',
  mentalModel:
    'Every variant wears a name tag (kind: "circle"). Show the tag, get the right shape. The compiler ensures you handle every tag or errors on the never assignability check.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Each member includes same discriminant key with distinct literal value.',
        'switch (x.kind) narrows body per case.',
        'Exhaustive default: const _check: never = x.',
        'Works with if (x.status === "ok") equality narrowing.',
        'Combine with generics for typed action payloads in Redux-style reducers.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'API results',
      text: 'Prefer { ok: true, data } | { ok: false, error } over optional data? and error? on one object.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Shape union and reducer actions',
      code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'rect'; width: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'square':
      return s.side ** 2;
    case 'rect':
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

type Action =
  | { type: 'increment'; by: number }
  | { type: 'reset' }
  | { type: 'set'; value: number };`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Fetch result discriminated union',
      code: `type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function render<T>(state: FetchState<T>): string {
  switch (state.status) {
    case 'idle': return 'Click to load';
    case 'loading': return 'Loading...';
    case 'success': return String(state.data);
    case 'error': return state.error.message;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Discriminant must be literal type — widen to string breaks narrowing.',
        'as const on discriminant values in factories preserves literals.',
        'Union of classes with shared method is OOP alternative — less common in TS UI code.',
        'Codegen from OpenAPI oneOf maps to discriminated unions.',
        'Narrowing propagates through nested switches on same discriminant.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Invalid state unrepresentable',
      'Exhaustive compile checks',
      'Clear reducer and parser patterns',
    ],
    disadvantages: [
      'Boilerplate for many variants',
      'Adding variant requires updating all switches',
      'JSON must include discriminant field consistently',
    ],
    alternatives: ['Single object with optional fields (weaker)', 'Class hierarchy with instanceof'],
    whenToUse: ['Redux actions, API results, UI state machines, AST nodes'],
    whenNotToUse: ['Simple two-state boolean with no extra fields'],
  },
  failureModes: [
    'Discriminant typed as string not literal — narrowing fails.',
    'Missing never default — new variant slips through at runtime.',
    'Backend omits tag field — runtime fallthrough needed.',
    'Duplicate discriminant values across members.',
  ],
  production: {
    reliability: ['Runtime assert discriminant in JSON parser before trusting type'],
    maintainability: ['Centralize Action type; use satisfies on action creators'],
  },
  interview: {
    expectations: [
      'Define discriminated union with switch',
      'Show never exhaustiveness',
      'Contrast with optional-field single object',
    ],
    commonQuestions: ['What is discriminated union?', 'How achieve exhaustiveness?'],
    followUps: ['Redux typing?', 'Parse JSON to discriminated union?'],
    misconceptions: ['Any union is discriminated — need shared literal key'],
    traps: ['Using boolean isError instead of status literal union'],
    strongSignals: ['never check, FetchState example, invalid states unrepresentable phrase'],
  },
  keyTakeaways: [
    'Shared literal discriminant enables narrowing.',
    'switch + never = exhaustiveness.',
    'Better than optional error/data on same object.',
    'Keep discriminant as const literals.',
    'Standard pattern for actions and API results.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes a union “discriminated”?',
      answerHint: 'Common property with literal type unique per member.',
    },
    {
      level: 'intermediate',
      question: 'How enforce handling all cases in switch?',
      answerHint: 'default: const _x: never = value — compile error if case missing.',
    },
    {
      level: 'advanced',
      question: 'Why not { success?: boolean; data?; error? }?',
      answerHint: 'Allows impossible combos; discriminant makes states mutually exclusive.',
    },
  ],
  flashcards: [
    { front: 'Discriminated union', back: 'Union with shared literal tag field' },
    { front: 'never exhaustiveness', back: 'Default assigns x to never — forces all cases' },
    { front: 'kind / type / status', back: 'Common discriminant property names' },
    { front: 'Literal requirement', back: 'Tag must be literal not wide string' },
  ],
  quickRevision: [
    'Tag field + literal values',
    'switch narrows per case',
    'never in default',
    'API ok/data | ok/error pattern',
    'Invalid states impossible',
    'as const on factories',
  ],
}
