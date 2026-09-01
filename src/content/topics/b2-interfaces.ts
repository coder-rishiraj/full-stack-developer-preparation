import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TypeScript interfaces declare the shape of objects — property names, types, optional/required fields, readonly modifiers, and call/index signatures. They are structural: if a value has the right shape, it satisfies the interface. Interfaces can extend other interfaces and be merged via declaration merging.',
  whyExists:
    'JavaScript objects have no compile-time contract. Interfaces document and enforce API shapes, enable IDE autocomplete, catch typos before runtime, and serve as living documentation for teams and libraries.',
  mentalModel:
    'An interface is a mold checker, not a mold factory. At compile time TS asks: “Does this object fit the mold?” Extra properties may error on object literals (excess property checking) but often allowed when assigned via variable.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare with interface Name { props } — erased at runtime.',
        'Optional `?`, readonly, and index signatures `[key: string]: T`.',
        'extends merges parent members; implements on classes enforces shape.',
        'Declaration merging: same interface name augments members (common in @types).',
        'Structural typing: duck typing — shape matters, not explicit implements.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'interface vs type alias',
      text: 'Interfaces excel at object extension and merging. Type aliases handle unions, tuples, mapped types. Prefer interface for public object contracts unless you need union/intersection composition.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Basic interface and extension',
      code: `interface User {
  readonly id: string;
  name: string;
  email?: string;
}

interface Admin extends User {
  permissions: string[];
}

function greet(u: User) {
  return \`Hello, \${u.name}\`;
}

const admin: Admin = {
  id: '1',
  name: 'Ada',
  permissions: ['read', 'write'],
};`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Call signature and index signature',
      code: `interface SearchFn {
  (query: string, limit?: number): Promise<Result[]>;
}

interface StringMap {
  [key: string]: string;
}

interface EventHandlers {
  click?: (e: MouseEvent) => void;
  [event: string]: ((e: Event) => void) | undefined;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Interfaces have no runtime representation — purely type-level.',
        'Excess property checking on fresh object literals only.',
        'implements checks class instance shape; does not copy runtime behavior.',
        'Declaration merging only works with interface, not type alias.',
        'Generic interfaces: interface ApiResponse<T> { data: T }.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear object contracts and IDE support',
      'Extensible via extends and merging',
      'Familiar OOP-style naming for teams',
    ],
    disadvantages: [
      'Cannot express some unions without type aliases',
      'Declaration merging can surprise in large codebases',
      'No runtime validation without separate schema layer',
    ],
    alternatives: ['type aliases for unions/tuples', 'Zod/io-ts for runtime validation', 'classes with public fields'],
    whenToUse: ['Public API shapes, React props, service contracts, extendable plugin defs'],
    whenNotToUse: ['Primitive unions alone — use type alias', 'When runtime validation is required without codegen'],
  },
  failureModes: [
    'Excess property error on inline object with extra key — assign to variable first or use satisfies.',
    'Assuming implements adds runtime checks.',
    'Optional vs undefined confusion: `{ x?: string }` allows missing or undefined.',
    'Index signature forcing all known props to match value type.',
  ],
  production: {
    maintainability: ['Export interfaces from domain modules; avoid any in public contracts'],
    reliability: ['Pair with Zod at boundaries if external JSON untrusted'],
    observability: ['Use satisfies for config objects preserving literal types'],
  },
  interview: {
    expectations: [
      'Define interface and structural typing',
      'Explain extends vs implements',
      'Know interface vs type alias tradeoffs',
    ],
    commonQuestions: ['What is an interface?', 'Structural vs nominal typing?', 'Declaration merging?'],
    followUps: ['Excess property checking?', 'When prefer type over interface?'],
    misconceptions: ['Interfaces exist at runtime'],
    traps: ['Thinking implements creates inheritance at runtime'],
    strongSignals: ['Mentions erasure, duck typing, merging, optional/readonly'],
  },
  keyTakeaways: [
    'Interfaces describe object shapes; compile-time only.',
    'TypeScript uses structural (duck) typing.',
    'extends for composition; implements for class contracts.',
    'Declaration merging unique to interface.',
    'Pair types with runtime validation at boundaries.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Do TypeScript interfaces exist at runtime?',
      answerHint: 'No — erased during compilation.',
    },
    {
      level: 'intermediate',
      question: 'What is structural typing?',
      answerHint: 'Compatibility based on shape, not explicit declaration name.',
    },
    {
      level: 'advanced',
      question: 'Why might excess property checking fail on an object literal?',
      answerHint: 'Fresh literal checked strictly; extra unknown props rejected.',
    },
  ],
  flashcards: [
    { front: 'Structural typing', back: 'Shape match suffices — duck typing' },
    { front: 'interface extends', back: 'Merge member types from parent interface' },
    { front: 'implements', back: 'Class must satisfy interface shape at compile time' },
    { front: 'Declaration merging', back: 'Same interface name augments members' },
  ],
  quickRevision: [
    'Interfaces = object shape contracts',
    'Erased at runtime',
    'Structural not nominal',
    'extends / implements / optional / readonly',
    'Merging only on interface',
    'Excess props on literals',
  ],
}
